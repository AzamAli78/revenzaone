"""Render the Revenza One explainer.

  python render.py prep            extract AI video frames (run once)
  python render.py stills          one frame per beat + contact sheet (film/build/stills)
  python render.py still 12.3      a single frame
  python render.py audio           soundtrack -> film/build/soundtrack.wav
  python render.py video           60 fps, 3 subframes blended with tmix -> film/build/silent.mp4
  python render.py mux             -> film/revenza-one-explainer.mp4
"""
import base64, pathlib, subprocess, sys, time
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
BUILD = HERE / 'build'
FF = imageio_ffmpeg.get_ffmpeg_exe()
FPS, SUB, DUR = 60, 3, 30.0


def open_page(p):
    b = p.chromium.launch(channel='msedge', headless=True, args=['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    pg.goto((HERE / 'film.html').as_uri())
    pg.on('pageerror', lambda e: print('PAGE ERROR', e))
    pg.wait_for_function('window.__ok===true', timeout=90000)
    return b, pg


def shot(pg, t, path=None, fmt='png'):
    pg.evaluate(f'seek({t})')
    if path:
        return pg.screenshot(path=str(path), type=fmt, **({'quality': 95} if fmt == 'jpeg' else {}))
    return pg.screenshot(type='jpeg', quality=94)


def stills():
    from PIL import Image, ImageDraw
    out = BUILD / 'stills'; out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b, pg = open_page(p)
        files = []
        for beat in range(60):
            t = round(beat * 0.5 + 0.4, 3)
            f = out / f'b{beat:02d}.jpg'; shot(pg, t, f, 'jpeg'); files.append((beat, t, f))
        b.close()
    cols, tw, th = 6, 480, 270
    sheet = Image.new('RGB', (cols * tw, 10 * (th + 22)), (30, 30, 36))
    d = ImageDraw.Draw(sheet)
    for i, (beat, t, f) in enumerate(files):
        im = Image.open(f).resize((tw, th))
        x, y = (i % cols) * tw, (i // cols) * (th + 22)
        sheet.paste(im, (x, y + 22)); d.text((x + 6, y + 4), f'b{beat}  t={t}', fill=(255, 220, 120))
    sheet.save(out / 'sheet_a.jpg', quality=88, subsampling=0) if False else None
    sheet.crop((0, 0, cols * tw, 5 * (th + 22))).save(out / 'sheet_a.jpg', quality=88)
    sheet.crop((0, 5 * (th + 22), cols * tw, 10 * (th + 22))).save(out / 'sheet_b.jpg', quality=88)
    print('stills ->', out)


def one(t):
    with sync_playwright() as p:
        b, pg = open_page(p)
        f = BUILD / f'still_{t}.png'; shot(pg, float(t), f); b.close(); print(f)


def audio():
    with sync_playwright() as p:
        b, pg = open_page(p)
        r = pg.evaluate('renderAudio()')
        b.close()
    (BUILD / 'soundtrack.wav').write_bytes(base64.b64decode(r['b64']))
    print('audio peak', r['peak'], '->', BUILD / 'soundtrack.wav')


def video():
    n = int(DUR * FPS) * SUB
    vf = (f"tmix=frames={SUB}:weights='1 1 1',select='eq(mod(n\\,{SUB})\\,{SUB-1})',setpts=N/({FPS}*TB),scale=in_range=pc:out_range=tv,format=yuv420p")
    cmd = [FF, '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS * SUB), '-c:v', 'mjpeg', '-i', '-',
           '-vf', vf, '-r', str(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', str(BUILD / 'silent.mp4')]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    with sync_playwright() as p:
        b, pg = open_page(p)
        for i in range(n):
            proc.stdin.write(shot(pg, i / (FPS * SUB)))
            if i % 540 == 0:
                print(f'{i}/{n}  {time.time()-t0:.0f}s', flush=True)
        b.close()
    proc.stdin.close(); proc.wait()
    print('video done', time.time() - t0)


def prep():
    """Extract the AI UGC sample frames used in scene 3."""
    out = BUILD / 'vframes'; out.mkdir(parents=True, exist_ok=True)
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', '0', '-t', '5.2', '-i', str(HERE.parent / 'assets/video/ai-ugc-sample.mp4'),
                    '-vf', 'fps=30,scale=540:960', '-q:v', '3', str(out / 'f%03d.jpg')], check=True)
    print('frames ->', out)


def mux():
    out = HERE / 'revenza-one-explainer.mp4'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', str(BUILD / 'silent.mp4'), '-i', str(BUILD / 'soundtrack.wav'),
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', str(out)], check=True)
    print(out)


if __name__ == '__main__':
    cmd = sys.argv[1]
    {'prep': prep, 'stills': stills, 'audio': audio, 'video': video, 'mux': mux}.get(cmd, lambda: one(sys.argv[2]))()
