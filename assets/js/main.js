(function () {
  'use strict';

  // ----- mobile menu -----
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('main-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  }

  // ----- hero showreel: muted loop, button restarts it with sound -----
  var film = document.getElementById('hero-film');
  var soundBtn = document.querySelector('.hf-sound');
  if (film && soundBtn) {
    var label = soundBtn.querySelector('span');
    var ICON_PLAY = '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>';
    var ICON_MUTE = '<path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="m22 9-6 6M16 9l6 6"/>';
    var setBtn = function (withSound) {
      soundBtn.setAttribute('aria-pressed', String(withSound));
      soundBtn.querySelector('svg').innerHTML = withSound ? ICON_MUTE : ICON_PLAY;
      label.textContent = withSound ? 'Mute' : 'Watch with sound';
    };
    // Respect reduced-motion and data-saver: show the poster until the visitor presses play.
    var calm = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || (navigator.connection && navigator.connection.saveData);
    if (calm) { film.removeAttribute('autoplay'); film.pause(); }
    soundBtn.addEventListener('click', function () {
      if (film.muted || film.paused) { film.muted = false; film.currentTime = 0; film.play().catch(function () {}); setBtn(true); }
      else { film.muted = true; setBtn(false); }
    });
  }

  // ----- scroll reveal -----
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ----- portfolio filter + dialog -----
  var filters = document.querySelectorAll('.filters .chip');
  var cards = document.querySelectorAll('.port');
  var empty = document.querySelector('.empty');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var cat = f.getAttribute('data-filter');
      filters.forEach(function (x) { x.classList.toggle('active', x === f); x.setAttribute('aria-pressed', String(x === f)); });
      var shown = 0;
      cards.forEach(function (c) {
        var show = cat === 'all' || c.getAttribute('data-cat') === cat;
        c.hidden = !show; if (show) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });

  var dlg = document.getElementById('proj-dialog');
  var dataEl = document.getElementById('portfolio-data');
  if (dlg && dataEl && typeof dlg.showModal === 'function') {
    var data = JSON.parse(dataEl.textContent);
    document.querySelectorAll('[data-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = data.find(function (x) { return x.id === b.getAttribute('data-open'); });
        if (!p) return;
        document.getElementById('pd-vis').innerHTML = p.visual;
        document.getElementById('pd-cat').textContent = p.category;
        document.getElementById('pd-title').textContent = p.title;
        document.getElementById('pd-desc').textContent = p.description;
        var list = document.getElementById('pd-list'); list.innerHTML = '';
        (p.details || []).forEach(function (d) { var li = document.createElement('li'); li.textContent = d; list.appendChild(li); });
        document.getElementById('pd-kind').textContent = p.kind === 'Concept'
          ? 'Concept project: created to demonstrate our capabilities. Not client work.'
          : p.kind === 'Sample' ? 'AI-generated sample: shows what our AI video service can produce. It is not a customer testimonial.'
          : 'Client project.';
        var visit = document.getElementById('pd-visit'); if (visit) { visit.hidden = !p.url; if (p.url) visit.href = p.url; }
        dlg.showModal();
      });
    });
    dlg.querySelector('.pd-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('close', function () { var v = dlg.querySelector('video'); if (v) v.pause(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  // ----- contact form -----
  var form = document.getElementById('enquiry-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submit = document.getElementById('submit-btn');
  var waBtn = document.getElementById('wa-from-form');
  var waBase = waBtn ? waBtn.getAttribute('href') : '';

  // preselect ?service=
  var qs = new URLSearchParams(location.search).get('service');
  if (qs) {
    form.querySelectorAll('input[name=services]').forEach(function (c) {
      if (c.value.toLowerCase() === qs.toLowerCase()) c.checked = true;
    });
    if (!form.querySelector('input[name=services]:checked')) {
      var d = form.elements.details; if (d && !d.value) d.value = 'I am interested in: ' + qs + '.';
    }
  }

  function val(n) { return (form.elements[n] && form.elements[n].value || '').trim(); }
  function selectedServices() { return Array.prototype.map.call(form.querySelectorAll('input[name=services]:checked'), function (c) { return c.value; }); }

  function setErr(name, msg) {
    var el = form.querySelector('.err[data-for="' + name + '"]');
    if (el) { el.textContent = msg || ''; var f = el.closest('.field'); if (f) f.classList.toggle('invalid', !!msg); }
  }
  function validate() {
    var ok = true, first = null;
    function check(name, bad, msg) { setErr(name, bad ? msg : ''); if (bad) { ok = false; if (!first) first = name; } }
    check('name', val('name').length < 2, 'Please enter your full name.');
    check('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email')), 'Please enter a valid email address.');
    check('phone', val('phone').replace(/\D/g, '').length < 8 || val('phone').replace(/\D/g, '').length > 15, 'Please enter a valid phone or WhatsApp number.');
    check('services', selectedServices().length === 0, 'Please select at least one service.');
    check('details', val('details').length < 10, 'Please tell us a little about your requirements.');
    if (first) { var t = form.elements[first] || form.querySelector('input[name=' + first + ']'); if (t && t.focus) t.focus(); }
    return ok;
  }

  // WhatsApp button carries whatever the visitor has typed so far.
  function waMessage() {
    var parts = ["Hi Revenza One! I'm interested in your digital marketing services."];
    if (val('name')) parts.push('Name: ' + val('name'));
    if (val('business')) parts.push('Business: ' + val('business'));
    if (selectedServices().length) parts.push('Services: ' + selectedServices().join(', '));
    if (val('budget')) parts.push('Budget: ' + val('budget'));
    if (val('details')) parts.push('Details: ' + val('details'));
    return parts.join('\n');
  }
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      var base = waBase.split('?')[0];
      waBtn.setAttribute('href', base + '?text=' + encodeURIComponent(waMessage()));
    });
  }

  function show(kind, html) { status.className = 'form-status ' + kind; status.innerHTML = html; status.focus(); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status'; status.textContent = '';
    if (!validate()) return;
    var payload = {
      name: val('name'), business: val('business'), email: val('email'), phone: val('phone'),
      industry: val('industry'), budget: val('budget'), services: selectedServices(),
      details: val('details'), website: val('website')
    };
    submit.disabled = true; var old = submit.textContent; submit.textContent = 'Sending…';
    var ctrl = new AbortController(); var to = setTimeout(function () { ctrl.abort(); }, 20000);
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok === true, msg: j.error }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          show('ok', '<strong>Thank you!</strong> Your enquiry has been sent. We will get back to you soon.');
        } else {
          show('bad', (res.msg ? res.msg + ' ' : 'We could not send your enquiry right now. ') + 'Please try again, or use the <strong>Discuss on WhatsApp</strong> button instead.');
        }
      })
      .catch(function () { show('bad', 'We could not reach the server. Please check your connection and try again, or use the <strong>Discuss on WhatsApp</strong> button instead.'); })
      .then(function () { clearTimeout(to); submit.disabled = false; submit.textContent = old; });
  });
})();
