from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('  useEffect(() => { const timer = window.setInterval(() => setBannerIndex((index) => (index + 1) % banners.length), 5000); return () => window.clearInterval(timer); }, []);', '  useEffect(() => { const timer = window.setInterval(() => setBannerIndex((index) => (index + 1) % banners.length), 5000); return () => window.clearInterval(timer); }, []);\n  useEffect(() => { const items = document.querySelectorAll(".reveal"); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: "0px 0px -45px 0px" }); items.forEach((item) => observer.observe(item)); return () => observer.disconnect(); }, []);')
replacements = {
    '<section className="service-strip" id="about">': '<section className="service-strip reveal" id="about">',
    '<div className="service-item">': '<div className="service-item reveal-child">',
    '<section className="promo-strip banner-section"': '<section className="promo-strip banner-section reveal"',
    '<section className="catalog-section container"': '<section className="catalog-section container reveal"',
    '<article className="product-card"': '<article className="product-card reveal-child"',
    '<section className="about-section container"': '<section className="about-section container reveal"',
    '<section className="cta-section container">': '<section className="cta-section container reveal"',
}
for old, new in replacements.items():
    s = s.replace(old, new)
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
addition = '''
/* soft scroll reveal */
.reveal { opacity:0; transform:translateY(22px); transition:opacity .7s ease, transform .7s cubic-bezier(.23,1,.32,1); }
.reveal.is-visible { opacity:1; transform:translateY(0); }
.reveal-child { opacity:0; transform:translateY(18px); transition:opacity .55s ease, transform .55s cubic-bezier(.23,1,.32,1); }
.reveal.is-visible .reveal-child, .reveal-child.is-visible { opacity:1; transform:translateY(0); }
.products-grid .reveal-child:nth-child(2) { transition-delay:70ms; }.products-grid .reveal-child:nth-child(3) { transition-delay:140ms; }.products-grid .reveal-child:nth-child(4) { transition-delay:210ms; }
.service-grid .reveal-child:nth-child(2) { transition-delay:80ms; }.service-grid .reveal-child:nth-child(3) { transition-delay:160ms; }
.banner-section .banner-shell, .about-section .about-card, .cta-section .cta-inner { transition-delay:60ms; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior:auto !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; } .reveal, .reveal-child { opacity:1 !important; transform:none !important; } }
'''
if '/* soft scroll reveal */' not in c:
    c += addition
css.write_text(c)
