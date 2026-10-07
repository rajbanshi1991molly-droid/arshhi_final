(function () {
  'use strict';

  var NETWORKS = [
    ['facebook', 'Facebook', 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z'],
    ['instagram', 'Instagram', 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'],
    ['youtube', 'YouTube', 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'],
    ['linkedin', 'LinkedIn', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z']
  ];

  var CSS =
    /* the page has its own "Follow" tab; this one bar replaces it */
    '#social{display:none!important}' +
    '.ar-social{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:99999;display:flex;flex-direction:column;' +
      'background:#4A3525;border-radius:0 6px 6px 0;box-shadow:0 2px 8px rgba(44,30,20,.22);overflow:hidden;' +
      'padding-left:env(safe-area-inset-left,0px)}' +
    '.ar-social[hidden]{display:none}' +
    '.ar-social a{display:flex;align-items:center;justify-content:center;width:36px;height:36px;color:#fff;' +
      'text-decoration:none;transition:background-color .2s}' +
    '.ar-social a+a{border-top:1px solid rgba(255,255,255,.14)}' +
    '.ar-social a:hover{background:#5C4331}' +
    '.ar-social a:focus-visible{outline:2px solid #fff;outline-offset:-4px}' +
    '.ar-social svg{width:16px;height:16px;fill:currentColor}' +
    '@media (max-width:600px){.ar-social a{width:32px;height:32px}.ar-social svg{width:15px;height:15px}}';

  function cleanUrl(v) {
    v = String(v == null ? '' : v).trim();
    if (!v) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) v = 'https://' + v;
    try {
      var u = new URL(v);
      return (u.protocol === 'https:' || u.protocol === 'http:') ? v : '';
    } catch (e) { return ''; }
  }

  function init() {
    if (document.querySelector('.ar-social')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var bar = document.createElement('nav');
    bar.className = 'ar-social';
    bar.setAttribute('aria-label', 'Social media');
    bar.hidden = true; /* stays hidden until real links are known, so there are never dead icons */
    document.body.appendChild(bar);

    fetch('/api/get-content', { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var c = data && data.content;
        if (typeof c === 'string') { try { c = JSON.parse(c); } catch (e) { c = null; } }
        if (!c || typeof c !== 'object') return;
        var so = (c.social && typeof c.social === 'object') ? c.social : {};

        NETWORKS.forEach(function (n) {
          var url = cleanUrl(c[n[0]] || so[n[0]]);
          if (!url) return;
          var a = document.createElement('a');
          a.id = 'link-' + n[0];
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.title = n[1];
          a.setAttribute('aria-label', n[1]);
          a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + n[2] + '"/></svg>';
          bar.appendChild(a);
        });
        bar.hidden = !bar.children.length;
      })
      .catch(function () { /* no links available: the bar simply stays hidden */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
