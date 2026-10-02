from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('import { useMemo, useState } from "react";', 'import { useEffect, useMemo, useState } from "react";')
old = '''        <section className="promo-strip" aria-label="مميزات تليد وجديد">
          <div className="promo-track">
            {["مختصون بقطع غيار الشاحنات", "طلبك جاهز قبل وصولك", "قطع أصلية وبدائل موثوقة", "اسألنا عن القطعة بصورة", "خدمة سريعة لأهل الخط"].map((item, index) => <div className="promo-tile" key={item}><span>0{index + 1}</span><strong>{item}</strong><Check size={15} /></div>)}
          </div>
        </section>
'''
new = '''        <section className="promo-strip banner-section" aria-label="إعلانات تليد وجديد">
          <div className="container banner-shell">
            <div className="banner-head"><div><div className="section-kicker">إعلانات تليد وجديد</div><h2>كل جديد <span>نوصلّه لك.</span></h2></div><div className="banner-controls"><button onClick={() => setBannerIndex((bannerIndex - 1 + banners.length) % banners.length)} aria-label="الإعلان السابق">‹</button><span>{String(bannerIndex + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}</span><button onClick={() => setBannerIndex((bannerIndex + 1) % banners.length)} aria-label="الإعلان التالي">›</button></div></div>
            <div className="banner-viewport"><div className="banner-track" style={{ transform: `translateX(${bannerIndex * 100}%)` }}>{banners.map((banner) => <a className={`ad-banner ${banner.tone}`} href="https://wa.me/966500000000" key={banner.title}><div className="banner-copy"><span className="banner-label">{banner.label}</span><h3>{banner.title}</h3><p>{banner.text}</p><span className="banner-cta">اسأل عبر واتساب <ArrowLeft size={14} /></span></div><div className={`banner-art ${banner.art}`}><div className="banner-orbit" /><span>{banner.mark}</span></div></a>)}</div></div>
            <div className="banner-dots">{banners.map((banner, index) => <button key={banner.title} className={bannerIndex === index ? "active" : ""} onClick={() => setBannerIndex(index)} aria-label={`الإعلان ${index + 1}`} />)}</div>
          </div>
        </section>
'''
if old not in s:
    raise SystemExit('promo block not found')
s = s.replace(old, new)
needle = 'const products = ['
banners = '''const banners = [
  { label: "مختصون بالشاحنات", title: "قطعتك المناسبة تبدأ من هنا", text: "اسألنا عن القطعة، ونساعدك توصل للبديل المناسب.", tone: "banner-gold", art: "banner-wheel", mark: "BDW" },
  { label: "جديد تليد وجديد", title: "وصل حديثًا للمحل", text: "منتجات مختارة بجودة تثق فيها على الخط.", tone: "banner-steel", art: "banner-filter", mark: "NEW" },
  { label: "خدمة أسرع", title: "أرسل صورة القطعة", text: "لا تعرف اسمها؟ صوّرها واترك الباقي علينا.", tone: "banner-green", art: "banner-camera", mark: "IMG" },
  { label: "أهل الخط", title: "جاهزين لاستفسارك", text: "رد سريع عبر واتساب عن السعر والتوفر.", tone: "banner-blue", art: "banner-chat", mark: "24/7" },
  { label: "عروض المحل", title: "تابع آخر العروض", text: "بوستات وعروض جديدة تضاف هنا باستمرار.", tone: "banner-orange", art: "banner-tag", mark: "%" },
];

'''
s = s.replace(needle, banners + needle)
needle2 = '  const [menuOpen, setMenuOpen] = useState(false);'
s = s.replace(needle2, needle2 + '\n  const [bannerIndex, setBannerIndex] = useState(0);\n  useEffect(() => { const timer = window.setInterval(() => setBannerIndex((index) => (index + 1) % banners.length), 5000); return () => window.clearInterval(timer); }, []);')
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
start = c.find('/* practical catalog additions */')
if start == -1:
    raise SystemExit('css additions not found')
old_css = c[start:]
new_css = old_css.replace('''/* practical catalog additions */
.promo-strip { background:#f0f3f3; border-bottom:1px solid #e2e7e8; overflow:hidden; }
.promo-track { width:max-content; min-width:100%; display:flex; direction:rtl; justify-content:center; gap:10px; padding:12px 0; }
.promo-tile { display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #e4e9e9; border-radius:6px; padding:8px 13px; color:#52636d; font-size:10px; white-space:nowrap; }
.promo-tile span { color:#c69633; font:700 10px Manrope,sans-serif; }.promo-tile svg { color:#278565; }
''', '''/* practical catalog additions */
.promo-strip { background:#f0f3f3; border-bottom:1px solid #e2e7e8; overflow:hidden; }
.banner-shell { padding:34px 0 39px; }.banner-head { display:flex; align-items:end; justify-content:space-between; margin-bottom:17px; }.banner-head h2 { color:#182d3e; font-size:22px; margin:5px 0 0; }.banner-head h2 span { color:#c99737; }.banner-controls { display:flex; align-items:center; gap:8px; direction:ltr; }.banner-controls button { width:28px; height:28px; border:1px solid #dde4e5; background:#fff; color:#687780; border-radius:5px; font-size:20px; line-height:1; }.banner-controls span { color:#8e9aa0; font:700 10px Manrope,sans-serif; }.banner-viewport { overflow:hidden; border-radius:10px; }.banner-track { display:flex; direction:ltr; transition:transform .55s cubic-bezier(.23,1,.32,1); }.ad-banner { flex:0 0 100%; min-height:190px; display:flex; align-items:center; justify-content:space-between; direction:rtl; color:#fff; overflow:hidden; position:relative; padding:30px 40px; }.banner-gold { background:linear-gradient(105deg,#162b3c 0%,#263f4d 53%,#b4872f 170%); }.banner-steel { background:linear-gradient(105deg,#253642,#6b858d 68%,#b4c7c4); }.banner-green { background:linear-gradient(105deg,#173b39,#347d6e 64%,#d1a447); }.banner-blue { background:linear-gradient(105deg,#19283d,#355b79 64%,#b88938); }.banner-orange { background:linear-gradient(105deg,#392c27,#995a3a 66%,#d5a446); }.banner-copy { position:relative; z-index:2; max-width:520px; }.banner-label { color:#e1b960; font-size:10px; font-weight:700; }.banner-copy h3 { font-size:26px; margin:8px 0 5px; }.banner-copy p { color:rgba(255,255,255,.72); font-size:11px; margin:0 0 15px; }.banner-cta { display:flex; align-items:center; gap:7px; width:max-content; color:#1b3342; background:#d6a747; padding:8px 12px; border-radius:5px; font-size:10px; font-weight:700; }.banner-art { width:250px; height:155px; position:relative; display:grid; place-items:center; color:rgba(255,255,255,.86); font:800 24px Manrope,sans-serif; letter-spacing:3px; }.banner-art::before { content:""; width:126px; height:126px; border-radius:50%; border:14px solid rgba(255,255,255,.76); box-shadow:inset 0 0 0 9px rgba(0,0,0,.16), 0 15px 20px rgba(0,0,0,.16); transform:rotate(18deg); }.banner-filter::before { width:110px; height:93px; border-radius:16px; border:0; background:linear-gradient(135deg,#2d3639,#11191c); box-shadow:14px 16px 0 rgba(255,255,255,.15); transform:rotate(-12deg); }.banner-camera::before { width:120px; height:75px; border:0; border-radius:14px; background:#e1b351; box-shadow:inset 0 0 0 10px #304f4b; }.banner-camera::after { content:""; position:absolute; width:35px;height:35px;border-radius:50%;border:7px solid #1b3a38; }.banner-chat::before { width:126px;height:88px;border:0;border-radius:18px;background:rgba(255,255,255,.86);box-shadow:22px 25px 0 -6px rgba(255,255,255,.45); }.banner-chat::after { content:"..."; position:absolute;color:#36536c; font-size:28px; letter-spacing:2px; }.banner-tag::before { width:100px;height:100px;border:0;border-radius:9px;background:#e0b14c;transform:rotate(15deg); }.banner-tag::after { content:"عرض"; position:absolute;color:#4c3427;font-size:17px;letter-spacing:0; }.banner-orbit { position:absolute; width:220px;height:220px;border:1px solid rgba(255,255,255,.2);border-radius:50%; }.banner-art > span { position:absolute; color:rgba(255,255,255,.68); font-size:10px; bottom:6px; left:5px; }.banner-dots { display:flex; justify-content:center; gap:6px; padding-top:14px; direction:ltr; }.banner-dots button { width:6px;height:6px;border:0;border-radius:50%;background:#cbd4d5;padding:0;transition:.2s; }.banner-dots button.active { width:20px;border-radius:4px;background:#c69633; }
''')
new_css = new_css.replace('.promo-track { justify-content:flex-start; animation: promo-scroll 22s linear infinite; padding-right:15px; }', '.banner-shell { padding:28px 0 32px; }.banner-head { align-items:center; }.banner-head h2 { font-size:19px; }.ad-banner { min-height:240px; padding:26px 22px; }.banner-copy { max-width:55%; }.banner-copy h3 { font-size:21px; }.banner-copy p { line-height:1.7; }.banner-art { width:45%; transform:scale(.82); margin-left:-18px; }.banner-controls button { width:25px; height:25px; }.banner-track { transition-duration:.4s; }')
new_css = new_css.replace('@keyframes promo-scroll { from { transform:translateX(0); } to { transform:translateX(35%); } }', '')
css.write_text(c[:start] + new_css)
