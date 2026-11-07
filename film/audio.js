// Soundtrack written in code: 120 BPM, A minor (Am F C G), 30 s.
// window.renderAudio() -> base64 16-bit stereo WAV at 48 kHz.
(function(){
  'use strict';
  const SR=48000, DUR=30, BPM=120, BEAT=60/BPM, BAR=BEAT*4;
  const midi=n=>440*Math.pow(2,(n-69)/12);
  // chords per bar (root midi, triad offsets)
  const PROG=[[57,[0,3,7]],[53,[0,4,7]],[48,[0,4,7]],[55,[0,4,7]]]; // Am F C G
  const SCENES=[2,8,14,20];           // scene-change hits
  const DROP=26;                       // biggest beat
  const CLICKS=[4.0,5.5,10.0,15.0,21.0,22.0,22.5,23.0,23.5];
  const TYPE=[]; for(let i=0;i<19;i++) TYPE.push(4.25+i*0.06); for(let i=0;i<7;i++) TYPE.push(21.1+i*0.09);

  function rng(seed){ return ()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }; }

  window.renderAudio=async function(){
    const ctx=new OfflineAudioContext(2,SR*DUR,SR);
    const r=rng(7);
    const noise=ctx.createBuffer(1,SR*2,SR); { const d=noise.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=r()*2-1; }

    const master=ctx.createGain(); master.gain.value=0.9;
    const comp=ctx.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=3.5; comp.attack.value=0.004; comp.release.value=0.18;
    master.connect(comp); comp.connect(ctx.destination);
    // master fade at the very end
    master.gain.setValueAtTime(0.9,29.35); master.gain.linearRampToValueAtTime(0.0001,30);

    // music bus, ducked by the kick (sidechain feel)
    const music=ctx.createGain(); music.connect(master);
    const duck=(t,depth=0.45)=>{ music.gain.setValueAtTime(1-depth,t); music.gain.setTargetAtTime(1,t+0.02,0.09); };

    const noiseSrc=(t,dur)=>{ const s=ctx.createBufferSource(); s.buffer=noise; s.loop=true; s.start(t, r()*1.5); s.stop(t+dur); return s; };

    function kick(t,g=1){
      const o=ctx.createOscillator(), a=ctx.createGain();
      o.frequency.setValueAtTime(165,t); o.frequency.exponentialRampToValueAtTime(46,t+0.13);
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(0.95*g,t+0.004); a.gain.exponentialRampToValueAtTime(0.0001,t+0.42);
      o.connect(a); a.connect(master); o.start(t); o.stop(t+0.45);
      const n=noiseSrc(t,0.02), f=ctx.createBiquadFilter(), b=ctx.createGain(); f.type='highpass'; f.frequency.value=2500; b.gain.setValueAtTime(0.12*g,t); b.gain.exponentialRampToValueAtTime(0.0001,t+0.02);
      n.connect(f); f.connect(b); b.connect(master);
      duck(t);
    }
    function hat(t,g=0.06,open=false){
      const n=noiseSrc(t,open?0.22:0.06), f=ctx.createBiquadFilter(), a=ctx.createGain(); f.type='highpass'; f.frequency.value=7500;
      a.gain.setValueAtTime(g,t); a.gain.exponentialRampToValueAtTime(0.0001,t+(open?0.2:0.045)); n.connect(f); f.connect(a); a.connect(music);
    }
    function clap(t,g=0.22){
      for(let k=0;k<3;k++){ const tt=t+k*0.009; const n=noiseSrc(tt,0.2), f=ctx.createBiquadFilter(), a=ctx.createGain(); f.type='bandpass'; f.frequency.value=1600; f.Q.value=0.9;
        a.gain.setValueAtTime(g*(k===2?1:0.6),tt); a.gain.exponentialRampToValueAtTime(0.0001,tt+(k===2?0.18:0.03)); n.connect(f); f.connect(a); a.connect(music); }
    }
    function bass(t,note,dur=0.24,g=0.2){
      const o=ctx.createOscillator(), o2=ctx.createOscillator(), f=ctx.createBiquadFilter(), a=ctx.createGain();
      o.type='sawtooth'; o2.type='square'; o.frequency.value=midi(note); o2.frequency.value=midi(note-12); f.type='lowpass'; f.frequency.setValueAtTime(900,t); f.frequency.exponentialRampToValueAtTime(220,t+dur); f.Q.value=4;
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(g,t+0.008); a.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      const m=ctx.createGain(); m.gain.value=0.5; o2.connect(m); m.connect(f); o.connect(f); f.connect(a); a.connect(music); o.start(t); o2.start(t); o.stop(t+dur+0.02); o2.stop(t+dur+0.02);
    }
    function pad(t,root,iv,dur,g=0.035){
      iv.forEach(x=>[ -7, 7 ].forEach(det=>{
        const o=ctx.createOscillator(), f=ctx.createBiquadFilter(), a=ctx.createGain();
        o.type='sawtooth'; o.frequency.value=midi(root+12+x); o.detune.value=det; f.type='lowpass'; f.frequency.value=1500; f.Q.value=0.5;
        a.gain.setValueAtTime(0.0001,t); a.gain.linearRampToValueAtTime(g,t+0.25); a.gain.setValueAtTime(g,t+dur-0.2); a.gain.linearRampToValueAtTime(0.0001,t+dur+0.15);
        o.connect(f); f.connect(a); a.connect(music); o.start(t); o.stop(t+dur+0.2);
      }));
    }
    function pluck(t,note,g=0.07){
      const o=ctx.createOscillator(), f=ctx.createBiquadFilter(), a=ctx.createGain();
      o.type='triangle'; o.frequency.value=midi(note); f.type='lowpass'; f.frequency.setValueAtTime(4000,t); f.frequency.exponentialRampToValueAtTime(600,t+0.2);
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(g,t+0.004); a.gain.exponentialRampToValueAtTime(0.0001,t+0.22);
      o.connect(f); f.connect(a); a.connect(music); o.start(t); o.stop(t+0.25);
    }
    function stab(t,root,iv,g=0.09,dur=0.5){
      iv.concat([12]).forEach(x=>{ const o=ctx.createOscillator(), f=ctx.createBiquadFilter(), a=ctx.createGain();
        o.type='sawtooth'; o.frequency.value=midi(root+12+x); f.type='lowpass'; f.frequency.setValueAtTime(5000,t); f.frequency.exponentialRampToValueAtTime(500,t+dur);
        a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(g,t+0.005); a.gain.exponentialRampToValueAtTime(0.0001,t+dur);
        o.connect(f); f.connect(a); a.connect(master); o.start(t); o.stop(t+dur+0.05); });
    }
    function hit(t,big=false){
      // low boom
      const o=ctx.createOscillator(), a=ctx.createGain(); o.frequency.setValueAtTime(big?110:95,t); o.frequency.exponentialRampToValueAtTime(34,t+(big?0.9:0.5));
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(big?0.9:0.6,t+0.006); a.gain.exponentialRampToValueAtTime(0.0001,t+(big?1.2:0.6));
      o.connect(a); a.connect(master); o.start(t); o.stop(t+1.3);
      // noise impact with a falling band
      const n=noiseSrc(t,big?1.8:0.7), f=ctx.createBiquadFilter(), g=ctx.createGain(); f.type='bandpass'; f.Q.value=0.7; f.frequency.setValueAtTime(big?6000:4200,t); f.frequency.exponentialRampToValueAtTime(400,t+(big?1.4:0.5));
      g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(big?0.5:0.3,t+0.004); g.gain.exponentialRampToValueAtTime(0.0001,t+(big?1.7:0.6));
      n.connect(f); f.connect(g); g.connect(master);
      if(big){ const c=noiseSrc(t,2.6), hf=ctx.createBiquadFilter(), cg=ctx.createGain(); hf.type='highpass'; hf.frequency.value=5000; cg.gain.setValueAtTime(0.16,t); cg.gain.exponentialRampToValueAtTime(0.0001,t+2.5); c.connect(hf); hf.connect(cg); cg.connect(master); }
    }
    function whoosh(t,dur,g=0.28){
      const n=noiseSrc(t,dur+0.05), f=ctx.createBiquadFilter(), a=ctx.createGain(); f.type='bandpass'; f.Q.value=1.2;
      f.frequency.setValueAtTime(300,t); f.frequency.exponentialRampToValueAtTime(5000,t+dur*0.8);
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(g,t+dur*0.7); a.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      n.connect(f); f.connect(a); a.connect(master);
    }
    function click(t,g=0.16){
      const o=ctx.createOscillator(), a=ctx.createGain(); o.type='sine'; o.frequency.setValueAtTime(2400,t); o.frequency.exponentialRampToValueAtTime(1200,t+0.03);
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(g,t+0.002); a.gain.exponentialRampToValueAtTime(0.0001,t+0.05); o.connect(a); a.connect(master); o.start(t); o.stop(t+0.06);
    }
    function tick(t){ const n=noiseSrc(t,0.02), f=ctx.createBiquadFilter(), a=ctx.createGain(); f.type='bandpass'; f.frequency.value=3200; f.Q.value=2; a.gain.setValueAtTime(0.09,t); a.gain.exponentialRampToValueAtTime(0.0001,t+0.018); n.connect(f); f.connect(a); a.connect(master); }

    // ---- arrangement ----
    const bars=Math.ceil(DUR/BAR);
    for(let b=0;b<bars;b++){
      const t0=b*BAR, [root,iv]=PROG[b%4];
      for(let k=0;k<4;k++){ const t=t0+k*BEAT; if(t<29.6) kick(t, b===0?0.8:1); }
      if(b===0){ // hook: stabs land with the three words
        stab(0.0,PROG[0][0],PROG[0][1],0.06,0.4); stab(0.5,PROG[0][0],PROG[0][1],0.06,0.4); stab(1.0,PROG[0][0],PROG[0][1],0.08,0.5);
        continue;
      }
      if(t0>=29.9) continue;
      const last=b===bars-1;
      pad(t0,root,iv,BAR, b>=13?0.045:0.032);
      for(let k=0;k<8;k++){ const t=t0+k*BEAT/2; if(t>=29.5) break; bass(t, root-12+(k%4===3?12:0)+(k===6?7:0), 0.22, b>=13?0.24:0.19); }
      for(let k=0;k<4;k++){ const t=t0+k*BEAT; if(t>=29.6) break; hat(t+BEAT/2, 0.055, k===3); if(k%2===1) clap(t); }
      if(b>=4 && t0<24){ // arpeggio from scene 2 on
        const notes=[0,iv[1],iv[2],12,iv[2],iv[1],0,iv[2]];
        for(let k=0;k<16;k++){ const t=t0+k*BEAT/4; pluck(t, root+12+notes[k%8]+(k>=8?12:0), 0.045); }
      }
      if(b>=13){ for(let k=0;k<16;k++){ const t=t0+k*BEAT/4; if(t>=29.5) break; pluck(t, root+24+[0,iv[2],12,iv[1]][k%4], 0.05); } }
    }
    // riser + snare build into the drop
    { const t=24, d=2; const n=noiseSrc(t,d), f=ctx.createBiquadFilter(), a=ctx.createGain(); f.type='bandpass'; f.Q.value=1.5; f.frequency.setValueAtTime(500,t); f.frequency.exponentialRampToValueAtTime(9000,t+d);
      a.gain.setValueAtTime(0.0001,t); a.gain.exponentialRampToValueAtTime(0.25,t+d-0.02); a.gain.setValueAtTime(0.0001,t+d); n.connect(f); f.connect(a); a.connect(master);
      for(let k=0;k<8;k++) clap(24+k*0.25,0.08+k*0.012); for(let k=0;k<8;k++) clap(25+k*0.125,0.1+k*0.015); }
    SCENES.forEach(t=>hit(t));
    hit(DROP,true); stab(DROP,PROG[1][0],PROG[1][1],0.12,1.2);
    stab(27.0,PROG[2][0],PROG[2][1],0.07,0.6); // arrow docks
    whoosh(1.42,0.55); whoosh(25.9,0.9,0.22); whoosh(28.4,0.75,0.18); // arrow flights + rocket
    CLICKS.forEach(t=>click(t)); click(26.0,0.2);
    TYPE.forEach(tick);
    // final chord rings
    stab(29.5,PROG[0][0],PROG[0][1],0.08,0.5);

    const buf=await ctx.startRendering();
    // encode WAV
    const L=buf.getChannelData(0), Rr=buf.getChannelData(1), n=L.length;
    const ab=new ArrayBuffer(44+n*4), dv=new DataView(ab);
    const w=(o,s)=>{ for(let i=0;i<s.length;i++) dv.setUint8(o+i,s.charCodeAt(i)); };
    w(0,'RIFF'); dv.setUint32(4,36+n*4,true); w(8,'WAVE'); w(12,'fmt '); dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,2,true);
    dv.setUint32(24,SR,true); dv.setUint32(28,SR*4,true); dv.setUint16(32,4,true); dv.setUint16(34,16,true); w(36,'data'); dv.setUint32(40,n*4,true);
    let peak=0; for(let i=0;i<n;i++) peak=Math.max(peak,Math.abs(L[i]),Math.abs(Rr[i]));
    const norm=peak>0.95?0.95/peak:1;
    for(let i=0;i<n;i++){ dv.setInt16(44+i*4,Math.max(-1,Math.min(1,L[i]*norm))*32767,true); dv.setInt16(46+i*4,Math.max(-1,Math.min(1,Rr[i]*norm))*32767,true); }
    const bytes=new Uint8Array(ab); let s=''; const CH=0x8000; for(let i=0;i<bytes.length;i+=CH) s+=String.fromCharCode.apply(null,bytes.subarray(i,i+CH));
    return {b64:btoa(s), peak};
  };
})();
