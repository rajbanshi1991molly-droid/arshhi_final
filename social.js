document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('social-sidebar')) return;

    const COLOR = '#4A3525';

    // ---------- Styles ----------
    const style = document.createElement('style');
    style.textContent = `
        #social-sidebar {
            position: fixed;
            left: 0;
            top: 50%;
            transform: translate(-100%, -50%);
            display: flex;
            flex-direction: column;
            z-index: 99999;
            box-shadow: 0 6px 20px rgba(0,0,0,0.18);
            border-radius: 0 10px 10px 0;
            animation: socialSlideIn .6s .4s cubic-bezier(.22,.9,.3,1) forwards;
        }
        @keyframes socialSlideIn {
            to { transform: translate(0, -50%); }
        }
        #social-sidebar a {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: ${COLOR};
            color: #fff;
            text-decoration: none;
            transition: background .25s ease, width .25s ease;
        }
        #social-sidebar a + a { border-top: 1px solid rgba(255,255,255,.12); }
        #social-sidebar a:first-child { border-top-right-radius: 10px; }
        #social-sidebar a:last-child  { border-bottom-right-radius: 10px; }
        #social-sidebar a:hover,
        #social-sidebar a:focus-visible {
            background: #6b4a33;
            width: 56px;
            outline: none;
        }
        #social-sidebar a::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 3px;
            background: #E8C9A0;
            transform: scaleY(0);
            transition: transform .25s ease;
        }
        #social-sidebar a:hover::before,
        #social-sidebar a:focus-visible::before { transform: scaleY(1); }
        #social-sidebar svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
            transition: transform .25s ease;
        }
        #social-sidebar a:hover svg { transform: scale(1.15); }

        /* Tooltip label */
        #social-sidebar a span {
            position: absolute;
            left: 100%;
            margin-left: 10px;
            padding: 6px 12px;
            background: ${COLOR};
            color: #fff;
            font: 500 13px/1 'Segoe UI', Arial, sans-serif;
            white-space: nowrap;
            border-radius: 6px;
            opacity: 0;
            pointer-events: none;
            transform: translateX(-6px);
            transition: opacity .2s ease, transform .2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,.18);
        }
        #social-sidebar a:hover span,
        #social-sidebar a:focus-visible span {
            opacity: 1;
            transform: translateX(0);
        }

        /* Toggle button: hidden on laptop, only used on phones */
        #social-toggle {
            display: none;
            position: fixed;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            padding: 0;
            border: 0;
            background: ${COLOR};
            color: #fff;
            align-items: center;
            justify-content: center;
            border-radius: 0 6px 6px 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 99999;
            -webkit-tap-highlight-color: transparent;
        }
        #social-toggle svg { width: 12px; height: 12px; fill: currentColor; }

        @media (max-width: 600px) {
            /* Collapsed by default: only the small toggle button shows */
            #social-toggle.ready { display: flex; }
            #social-toggle.hide  { display: none; }
            #social-sidebar:not(.open) { display: none !important; }

            /* Opened: full icon bar at the previous (tap) size */
            #social-sidebar {
                box-shadow: 0 3px 10px rgba(0,0,0,0.15);
                border-radius: 0 8px 8px 0;
            }
            #social-sidebar a,
            #social-sidebar a:hover,
            #social-sidebar a:focus-visible {
                width: 30px;
                height: 30px;
            }
            #social-sidebar a:first-child { border-top-right-radius: 8px; }
            #social-sidebar a:last-child  { border-bottom-right-radius: 8px; }
            #social-sidebar svg { width: 14px; height: 14px; }
            #social-sidebar a:hover svg { transform: none; }
            #social-sidebar a::before { width: 2px; }
            #social-sidebar a span { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
            #social-sidebar { animation: none; transform: translate(0, -50%); }
            #social-sidebar * { transition: none !important; }
        }
    `;
    document.head.appendChild(style);

    // ---------- Icons ----------
    const networks = [
        {
            key: 'facebook', label: 'Facebook',
            path: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z'
        },
        {
            key: 'instagram', label: 'Instagram',
            path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
        },
        {
            key: 'youtube', label: 'YouTube',
            path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
        },
        {
            key: 'linkedin', label: 'LinkedIn',
            path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
        }
    ];

    // ---------- Build sidebar (hidden until links are known) ----------
    const sidebar = document.createElement('nav');
    sidebar.id = 'social-sidebar';
    sidebar.setAttribute('aria-label', 'Social media links');
    sidebar.style.display = 'none';

    const links = {};
    networks.forEach(n => {
        const a = document.createElement('a');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', n.label);
        a.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${n.path}"/></svg>
            <span>${n.label}</span>`;
        a.style.display = 'none';
        links[n.key] = a;
        sidebar.appendChild(a);
    });
    document.body.appendChild(sidebar);

    // ---------- Mobile toggle button (CSS hides it on laptop) ----------
    const toggle = document.createElement('button');
    toggle.id = 'social-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Show social media links');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>';
    document.body.appendChild(toggle);

    function setOpen(open) {
        sidebar.classList.toggle('open', open);
        toggle.classList.toggle('hide', open);
        toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(true); });
    // Tap anywhere else (or on a link) to collapse back to the small button
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) setOpen(false);
    });
    sidebar.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });

    // ---------- Load links from API ----------
    fetch('/api/get-content')
        .then(res => res.json())
        .then(data => {
            let config = {};
            if (data && data.content) {
                config = typeof data.content === 'object' ? data.content : JSON.parse(data.content);
            }

            let visible = 0;
            networks.forEach(n => {
                const url = config[n.key];
                if (url && typeof url === 'string' && url.trim()) {
                    links[n.key].href = url.trim();
                    links[n.key].style.display = 'flex';
                    visible++;
                }
            });

            // Show the bar only if at least one link exists
            if (visible) {
                sidebar.style.display = 'flex';
                toggle.classList.add('ready');
            }
        })
        .catch(err => console.log('Social links not loaded:', err));
});
