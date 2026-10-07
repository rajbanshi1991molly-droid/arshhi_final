document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.createElement('nav');
    sidebar.innerHTML = `
        <a href="#" id="link-facebook" target="_blank" style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; background-color:#4A3525; color:#FFF; border-bottom:1px solid rgba(255,255,255,0.1); text-decoration:none;">
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor;"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
        </a>
        <a href="#" id="link-instagram" target="_blank" style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; background-color:#4A3525; color:#FFF; border-bottom:1px solid rgba(255,255,255,0.1); text-decoration:none;">
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a href="#" id="link-youtube" target="_blank" style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; background-color:#4A3525; color:#FFF; border-bottom:1px solid rgba(255,255,255,0.1); text-decoration:none;">
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor;"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        <a href="#" id="link-linkedin" target="_blank" style="display:flex; align-items:center; justify-content:center; width:48px; height:48px; background-color:#4A3525; color:#FFF; text-decoration:none;">
            <svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
    `;

    Object.assign(sidebar.style, {
        position: 'fixed', left: '0', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', zIndex: '99999',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.15)', borderRadius: '0 8px 8px 0', overflow: 'hidden'
    });

    document.body.appendChild(sidebar);

    fetch('/api/get-content')
        .then(res => res.json())
        .then(data => {
            let config = {};
            if (data && data.content) {
                config = typeof data.content === 'object' ? data.content : JSON.parse(data.content);
            }
            if (config.facebook) document.getElementById('link-facebook').href = config.facebook;
            if (config.instagram) document.getElementById('link-instagram').href = config.instagram;
            if (config.youtube) document.getElementById('link-youtube').href = config.youtube;
            if (config.linkedin) document.getElementById('link-linkedin').href = config.linkedin;
        })
        .catch(err => console.log("Fallback links:", err));
});
