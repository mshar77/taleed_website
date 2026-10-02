from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
for old, new in {
    'بدواي لقطع غيار الشاحنات': 'تليد وجديد لقطع غيار الشاحنات',
    'كتالوج بدواي لقطع غيار الشاحنات.': 'كتالوج تليد وجديد لقطع غيار الشاحنات.',
    'عرض مختارات بدواي': 'عرض مختارات تليد وجديد',
    'اسأل عن التوفر': 'اطلب عبر واتساب',
    'أستفسر عن': 'أطلب قطعة',
    '© 2026 بدواي لقطع غيار الشاحنات': '© 2026 تليد وجديد لقطع غيار الشاحنات',
}.items():
    s = s.replace(old, new)

marker = '        <section className="catalog-section container" id="catalog">'
promo = '''        <section className="promo-strip" aria-label="مميزات تليد وجديد">
          <div className="promo-track">
            {["مختصون بقطع غيار الشاحنات", "طلبك جاهز قبل وصولك", "قطع أصلية وبدائل موثوقة", "اسألنا عن القطعة بصورة", "خدمة سريعة لأهل الخط"].map((item, index) => <div className="promo-tile" key={item}><span>0{index + 1}</span><strong>{item}</strong><Check size={15} /></div>)}
          </div>
        </section>

'''
if promo not in s:
    s = s.replace(marker, promo + marker)

old_cta = '        <section className="cta-section container" id="contact"><div className="cta-inner"><div><div className="section-kicker light">تحتاج مساعدة؟</div><h2>قطعتك ما ظهرت؟<br /><span>خلها علينا.</span></h2><p>صوّر القطعة أو اكتب رقمها، ونتأكد لك من التوفر والبديل المناسب.</p></div><a className="cta-button" href="https://wa.me/966500000000"><MessageCircle size={19} /> أرسل استفسارك عبر واتساب <ArrowLeft size={17} /></a></div></section>'
new_about = '''        <section className="about-section container" id="contact"><div className="about-card"><div className="about-copy"><div className="section-kicker">من نحن</div><h2>خبرة تُورث،<br /><span>وثقة تتجدد.</span></h2><p>في تليد وجديد نعرف أن الشاحنة ليست مجرد مركبة؛ هي رزق ومشوار والتزام. لذلك نوفر قطع غيار شاحنات مختارة بعناية، ونساعدك توصل للقطعة المناسبة بدون تعقيد.</p><div className="about-points"><span><Check size={15} /> متخصصون بالشاحنات</span><span><Check size={15} /> قطع أصلية وبدائل موثوقة</span></div></div><div className="store-info"><div className="info-heading"><span className="store-pin">⌖</span><div><strong>زورونا في المحل</strong><small>نخدمك من السبت إلى الخميس</small></div></div><div className="info-row"><span>ساعات العمل</span><strong>8:00 ص — 10:00 م</strong></div><div className="info-row"><span>الجمعة</span><strong>4:00 م — 10:00 م</strong></div><a className="map-button" href="https://maps.google.com/?q=Riyadh"><span>فتح الموقع على الخريطة</span><ArrowLeft size={16} /></a></div></div></section>

        <section className="cta-section container"><div className="cta-inner"><div><div className="section-kicker light">تحتاج مساعدة؟</div><h2>قطعتك ما ظهرت؟<br /><span>خلها علينا.</span></h2><p>صوّر القطعة أو اكتب رقمها، ونتأكد لك من التوفر والبديل المناسب.</p></div><a className="cta-button" href="https://wa.me/966500000000"><MessageCircle size={19} /> أرسل استفسارك عبر واتساب <ArrowLeft size={17} /></a></div></section>'''
if old_cta in s:
    s = s.replace(old_cta, new_about)
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
c += '''
/* practical catalog additions */
.promo-strip { background:#f0f3f3; border-bottom:1px solid #e2e7e8; overflow:hidden; }
.promo-track { width:max-content; min-width:100%; display:flex; direction:rtl; justify-content:center; gap:10px; padding:12px 0; }
.promo-tile { display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #e4e9e9; border-radius:6px; padding:8px 13px; color:#52636d; font-size:10px; white-space:nowrap; }
.promo-tile span { color:#c69633; font:700 10px Manrope,sans-serif; }.promo-tile svg { color:#278565; }
.about-section { padding-bottom:35px; }.about-card { background:#fff; border:1px solid #e3e9eb; border-radius:11px; padding:38px 42px; display:grid; grid-template-columns:1.2fr .8fr; gap:55px; }.about-copy h2 { margin:8px 0 12px; color:#182d3e; font-size:32px; line-height:1.35; }.about-copy h2 span { color:#c99737; }.about-copy p { color:#77858d; font-size:13px; line-height:2; max-width:550px; margin:0; }.about-points { display:flex; gap:20px; margin-top:19px; color:#27805f; font-size:11px; font-weight:700; }.about-points span { display:flex; gap:6px; align-items:center; }.store-info { border-right:1px solid #edf0f1; padding-right:34px; align-self:center; }.info-heading { display:flex; gap:10px; align-items:center; margin-bottom:20px; }.store-pin { width:35px; height:35px; display:grid; place-items:center; border-radius:8px; color:#c39132; background:#fbf5e8; font-size:20px; }.info-heading strong,.info-heading small { display:block; }.info-heading strong { color:#2d414e; font-size:13px; }.info-heading small { color:#94a0a7; font-size:10px; margin-top:4px; }.info-row { display:flex; justify-content:space-between; border-top:1px solid #eef1f2; padding:11px 0; color:#87939b; font-size:10px; }.info-row strong { color:#3d505b; font:700 10px Manrope,sans-serif; direction:ltr; }.map-button { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:12px; background:#183143; border-radius:6px; padding:11px 13px; color:#e0b55b; font-size:10px; font-weight:700; }.map-button svg { color:#e0b55b; }
.product-image-wrap { background:#f4f5f4; }.product-visual { aspect-ratio:4/3; min-height:0; height:auto; }.product-ask { justify-content:center; background:#eaf6f0; border-radius:5px; padding:9px 7px; transition:.2s; }.product-ask:hover { background:#d7efe3; }.quick-view { opacity:.9; }
@media (max-width:800px) { .promo-track { justify-content:flex-start; animation: promo-scroll 22s linear infinite; padding-right:15px; }.about-card { grid-template-columns:1fr; gap:25px; padding:27px 22px; }.about-copy h2 { font-size:28px; }.store-info { border-right:0; border-top:1px solid #edf0f1; padding:22px 0 0; }.about-points { flex-direction:column; gap:10px; }.products-grid { grid-template-columns:1fr; max-width:520px; margin:0 auto; }.product-card { width:100%; }.product-visual { aspect-ratio:1.35/1; }.product-info h3 { font-size:14px; }.product-ask { font-size:11px; padding:10px; }.search-row { align-items:stretch; }.search-box { min-width:0; }.filter-button { flex-shrink:0; } }
@keyframes promo-scroll { from { transform:translateX(0); } to { transform:translateX(35%); } }
'''
css.write_text(c)
