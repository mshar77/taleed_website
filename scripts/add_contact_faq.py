from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('import { ArrowLeft, Check, ChevronDown, CircleDot, Disc3, Gauge, Menu, MessageCircle, Package, Search, ShieldCheck, SlidersHorizontal, Truck, Wrench, X } from "lucide-react";', 'import { ArrowLeft, Check, ChevronDown, CircleDot, Disc3, Gauge, Menu, MessageCircle, Package, Search, ShieldCheck, SlidersHorizontal, Truck, Wrench, X, Clock3, MapPin, Phone } from "lucide-react";\nimport { MapView } from "@/components/Map";')
needle = 'const products = ['
faqs = '''const faqs = [
  { question: "كيف أطلب قطعة؟", answer: "ابحث عن القطعة في الكتالوج واضغط زر «اطلب عبر واتساب»، أو أرسل لنا صورة القطعة ورقمها وسنساعدك في التعرف عليها." },
  { question: "هل أستطيع التأكد من توافق القطعة؟", answer: "نعم، أرسل نوع الشاحنة وموديلها أو صورة رقم القطعة، ونراجع لك التوافق والبدائل المتاحة." },
  { question: "هل يوجد توصيل؟", answer: "تواصل معنا عبر واتساب لمعرفة خيارات التوصيل المتاحة حسب موقعك والقطعة المطلوبة." },
  { question: "ما أوقات العمل؟", answer: "نستقبلكم من السبت إلى الخميس من 8 صباحًا حتى 10 مساءً، ويوم الجمعة من 4 عصرًا حتى 10 مساءً." },
];

'''
if 'const faqs = [' not in s:
    s = s.replace(needle, faqs + needle)
needle2 = '  const [bannerIndex, setBannerIndex] = useState(0);'
s = s.replace(needle2, needle2 + '\n  const [openFaq, setOpenFaq] = useState(0);')
marker = '        <section className="cta-section container reveal"><div className="cta-inner">'
extra = '''        <section className="contact-section container reveal" id="location"><div className="contact-heading"><div><div className="section-kicker">تواصل معنا</div><h2>نحن <span>قريبين منك.</span></h2></div><a className="all-link" href="https://wa.me/966500000000">ابدأ محادثة <ArrowLeft size={16} /></a></div><div className="contact-layout"><div className="map-card"><MapView initialCenter={{ lat: 24.7136, lng: 46.6753 }} initialZoom={13} onMapReady={(map) => { new google.maps.marker.AdvancedMarkerElement({ map, position: { lat: 24.7136, lng: 46.6753 }, title: "تليد وجديد لقطع غيار الشاحنات" }); }} /><div className="map-overlay"><MapPin size={15} /><span>تليد وجديد لقطع غيار الشاحنات</span><small>الموقع الدقيق يحدّث بعد إرسال العنوان</small></div></div><div className="contact-cards"><a href="tel:+966500000000" className="contact-card"><span className="contact-icon"><Phone size={18} /></span><div><small>اتصل بنا</small><strong>050 000 0000</strong><em>اضغط للاتصال مباشرة</em></div><ArrowLeft size={16} /></a><a href="https://wa.me/966500000000" className="contact-card whatsapp-card"><span className="contact-icon"><MessageCircle size={18} /></span><div><small>واتساب</small><strong>راسلنا الآن</strong><em>أرسل صورة أو رقم القطعة</em></div><ArrowLeft size={16} /></a><div className="contact-card"><span className="contact-icon"><Clock3 size={18} /></span><div><small>ساعات العمل</small><strong>8 ص — 10 م</strong><em>الجمعة: 4 م — 10 م</em></div></div></div></div></section>

        <section className="faq-section container reveal"><div className="contact-heading"><div><div className="section-kicker">عندك سؤال؟</div><h2>الأسئلة <span>الشائعة</span></h2></div><span className="faq-note">إجابات سريعة قبل ما تتواصل معنا</span></div><div className="faq-list">{faqs.map((faq, index) => <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{faq.question}</span><span className="faq-plus">+</span></button><div className="faq-answer"><p>{faq.answer}</p></div></div>)}</div></section>

'''
if 'className="contact-section' not in s:
    s = s.replace(marker, extra + marker)
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
addition = '''
/* contact, map and FAQ */
.contact-section, .faq-section { padding-bottom:62px; }.contact-heading { display:flex; align-items:end; justify-content:space-between; margin-bottom:18px; }.contact-heading h2 { color:#182d3e; font-size:27px; margin:6px 0 0; }.contact-heading h2 span { color:#c99737; }.faq-note { color:#929da4; font-size:11px; }.contact-layout { display:grid; grid-template-columns:1.25fr .75fr; gap:18px; }.map-card { min-height:310px; position:relative; overflow:hidden; background:#dbe5e2; border-radius:10px; border:1px solid #e0e7e6; }.map-card > div:first-child { height:310px !important; }.map-overlay { position:absolute; right:15px; bottom:15px; background:rgba(255,255,255,.94); box-shadow:0 9px 22px rgba(28,52,60,.14); border-radius:7px; padding:10px 12px; color:#2b4652; display:flex; align-items:center; gap:7px; font-size:11px; }.map-overlay svg { color:#c29233; }.map-overlay small { color:#9aa4a8; font-size:9px; margin-right:4px; }.contact-cards { display:flex; flex-direction:column; gap:10px; }.contact-card { min-height:96px; border:1px solid #e4e9eb; background:#fff; border-radius:9px; padding:17px; display:flex; align-items:center; gap:12px; color:#293e4b; transition:.22s; }.contact-card:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(25,44,56,.07); border-color:#d9c28a; }.contact-icon { flex:0 0 38px; width:38px; height:38px; display:grid; place-items:center; border-radius:8px; color:#bf8d2f; background:#fbf5e8; }.contact-card div { flex:1; }.contact-card small,.contact-card strong,.contact-card em { display:block; }.contact-card small { color:#9da7ac; font-size:10px; }.contact-card strong { color:#304754; font:700 14px Manrope,sans-serif; margin:4px 0; }.contact-card em { color:#9da8ad; font-style:normal; font-size:9px; }.contact-card > svg { color:#bf8d2f; }.whatsapp-card .contact-icon { color:#25835f; background:#eef8f3; }.faq-list { border-top:1px solid #e2e8e9; }.faq-item { border-bottom:1px solid #e2e8e9; }.faq-item button { width:100%; border:0; background:transparent; display:flex; justify-content:space-between; align-items:center; padding:18px 2px; color:#324957; font-size:13px; font-weight:700; text-align:right; }.faq-plus { color:#c29132; font:400 22px Manrope,sans-serif; transition:transform .25s; }.faq-answer { display:grid; grid-template-rows:0fr; transition:grid-template-rows .3s ease; }.faq-answer p { overflow:hidden; margin:0; color:#849199; font-size:11px; line-height:1.9; }.faq-item.open .faq-answer { grid-template-rows:1fr; }.faq-item.open .faq-answer p { padding:0 2px 17px; }.faq-item.open .faq-plus { transform:rotate(45deg); }
@media (max-width:800px) { .contact-section, .faq-section { padding-bottom:44px; }.contact-heading { align-items:start; }.contact-heading h2 { font-size:22px; }.faq-note { font-size:9px; text-align:left; max-width:115px; }.contact-layout { grid-template-columns:1fr; }.map-card, .map-card > div:first-child { min-height:230px; height:230px !important; }.map-overlay { right:9px; bottom:9px; max-width:calc(100% - 18px); }.map-overlay small { display:none; }.contact-card { min-height:80px; padding:13px; }.faq-item button { padding:15px 1px; font-size:12px; } }
'''
if '/* contact, map and FAQ */' not in c:
    c += addition
css.write_text(c)
