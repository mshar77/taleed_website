import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Menu, MessageCircle, Search, ShieldCheck, Truck, X, Clock3, MapPin, Phone } from "lucide-react";
import { catalogCategories } from "@/data/categories";
import { catalogProducts } from "@/data/products";

const fallbackBanners = [
  { label: "مختصون بالشاحنات", title: "قطعتك المناسبة تبدأ من هنا", text: "اسألنا عن القطعة، ونساعدك توصل للبديل المناسب.", tone: "banner-gold", art: "banner-wheel", mark: "BDW", imageUrl: null },
  { label: "جديد تليد وجديد", title: "وصل حديثًا للمحل", text: "منتجات مختارة بجودة تثق فيها على الخط.", tone: "banner-steel", art: "banner-filter", mark: "NEW", imageUrl: null },
  { label: "خدمة أسرع", title: "أرسل صورة القطعة", text: "لا تعرف اسمها؟ صوّرها واترك الباقي علينا.", tone: "banner-green", art: "banner-camera", mark: "IMG", imageUrl: null },
  { label: "أهل الخط", title: "جاهزين لاستفسارك", text: "رد سريع عبر واتساب عن السعر والتوفر.", tone: "banner-blue", art: "banner-chat", mark: "24/7", imageUrl: null },
  { label: "عروض المحل", title: "تابع آخر العروض", text: "بوستات وعروض جديدة تضاف هنا باستمرار.", tone: "banner-orange", art: "banner-tag", mark: "%", imageUrl: null },
];

const fallbackFaqs = [
  { question: "كيف أطلب قطعة؟", answer: "ابحث عن القطعة في الكتالوج واضغط زر «اطلب عبر واتساب»، أو أرسل لنا صورة القطعة ورقمها وسنساعدك في التعرف عليها." },
  { question: "هل أستطيع التأكد من توافق القطعة؟", answer: "نعم، أرسل نوع الشاحنة وموديلها أو صورة رقم القطعة، ونراجع لك التوافق والبدائل المتاحة." },
  { question: "هل يوجد توصيل؟", answer: "التوصيل متاح تقريبًا حسب موقعك والقطعة المطلوبة؛ تواصل معنا عبر واتساب لتأكيد التفاصيل والتكلفة." },
  { question: "ما أوقات العمل؟", answer: "نستقبلكم من السبت إلى الخميس من 8 صباحًا حتى 8 مساءً، ويوم الجمعة مغلق." },
];

function ProductVisual({ type, tone, imageUrl, imageAlt, eager = false }: { type: string; tone: string; imageUrl?: string | null; imageAlt?: string; eager?: boolean }) {
  return (
    <div className={`product-visual ${tone}`}>
      <>{imageUrl ? <img loading={eager ? "eager" : "lazy"} decoding="async" width="1200" height="1200" className="real-product-image" src={imageUrl} alt={imageAlt ?? "صورة المنتج"} /> : type === "sample" ? <img loading="lazy" decoding="async" className="real-product-image" src="/assets/sample-product.webp" alt="منتج تجريبي من شركة تليد وجديد" /> : <div className={`part-shape ${type}`} aria-hidden="true">
        {type === "air" && <><span /><span /><span /></>}
        {type === "brake" && <><i /><i /><i /><i /></>}
        {type === "valve" && <><b /><b /></>}
        {type === "belt" && <><em /><em /></>}
      </div>}
      </>
      <span className="visual-mark">تليد وجديد</span>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("كل القطع");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const categories = useMemo(() => catalogCategories.map((category) => ({ ...category, count: String(category.label === "كل القطع" ? catalogProducts.length : catalogProducts.filter((product) => product.category === category.label).length) })), []);
  const products = useMemo(() => catalogProducts.map((product, index) => ({ ...product, tone: ["gold", "blue", "green", "orange"][index % 4], visual: "sample" })), []);
  const banners = fallbackBanners;
  const faqs = fallbackFaqs;
  useEffect(() => { const timer = window.setInterval(() => setBannerIndex((index) => (index + 1) % Math.max(banners.length, 1)), 5000); return () => window.clearInterval(timer); }, [banners.length]);
  useEffect(() => { const items = document.querySelectorAll(".reveal"); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.01, rootMargin: "0px 0px 80px 0px" }); items.forEach((item) => observer.observe(item)); return () => observer.disconnect(); }, []);
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.brand}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    const matchesCategory = activeCategory === "كل القطع" || product.category === activeCategory;
    return matchesQuery && matchesCategory;
  }), [query, activeCategory]);

  return (
    <div dir="rtl" className="site-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="فتح القائمة">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <a href="#top" className="brand" aria-label="تليد وجديد لقطع غيار الشاحنات">
            <img src="/assets/taleed-mark.png" alt="شعار شركة تليد وجديد" /><span className="brand-name">شركة تليد وجديد</span>
          </a>
          <nav className={menuOpen ? "main-nav open" : "main-nav"}>
            <a className="active" href="#catalog">الكتالوج</a>
            <a href="#contact">من نحن</a>
            <a href="#contact">تواصل معنا</a>
          </nav>
          <div className="top-actions">
            <a className="phone-link" href="tel:+966536655941">053 665 5941</a>
            <a className="whatsapp-button" href="https://wa.me/966536655941"><MessageCircle size={17} /> واتساب</a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-grid" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> خبرة تفرق على الخط</div>
              <h1>قطع تعتمد عليها،<br /><span>في كل طريق.</span></h1>
              <p>كتالوج تليد وجديد لقطع غيار الشاحنات. قطع أصلية وبدائل موثوقة، مختارة لتخدم شاحنتك وتكمل مشوارك.</p>
              <div className="hero-actions">
                <a className="primary-button" href="#catalog">تصفح القطع <ArrowLeft size={18} /></a>
                <a className="ghost-button" href="https://wa.me/966536655941"><MessageCircle size={19} /> اسأل عن قطعة</a>
              </div>
              <div className="hero-proof">
                <div className="proof-avatars"><span>م</span><span>ع</span><span>خ</span></div>
                <div><strong>يثق بنا أهل الشاحنات</strong><small>خدمة سريعة · معرفة بالقطعة</small></div>
              </div>
            </div>
            <div className="hero-art" aria-label="شاحنة وقطع غيار">
              <div className="art-glow" />
              <div className="art-card art-card-top"><ShieldCheck size={18} /><span>جودة نضمنها</span></div>
              <div className="truck-illustration"><Truck size={210} strokeWidth={1.2} /><div className="truck-line" /></div>
              <div className="art-card art-card-bottom"><span className="status-dot" /> قطع في الكتالوج <strong>{catalogProducts.length}</strong></div>
              <div className="floating-gear gear-one">⚙</div><div className="floating-gear gear-two">⚙</div>
            </div>
          </div>
        </section>

        <section className="service-strip reveal" id="about">
          <div className="container service-grid">
            <div className="service-item reveal-child"><div className="service-icon"><ShieldCheck size={21} /></div><div><strong>قطع أصلية وموثوقة</strong><span>نختارها لك بعناية</span></div></div>
            <div className="service-item reveal-child"><div className="service-icon"><Truck size={21} /></div><div><strong>متخصصون بالشاحنات</strong><span>نعرف القطعة المناسبة</span></div></div>
            <div className="service-item reveal-child"><div className="service-icon"><MessageCircle size={21} /></div><div><strong>رد سريع على استفسارك</strong><span>اسألنا عن أي قطعة</span></div></div>
          </div>
        </section>

        <section className="promo-strip banner-section reveal" aria-label="إعلانات تليد وجديد">
          <div className="container banner-shell">
            <div className="banner-head"><div><div className="section-kicker">إعلانات تليد وجديد</div><h2>كل جديد <span>نوصلّه لك.</span></h2></div><div className="banner-controls"><button onClick={() => setBannerIndex((bannerIndex - 1 + banners.length) % banners.length)} aria-label="الإعلان السابق">‹</button><span>{String(bannerIndex + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}</span><button onClick={() => setBannerIndex((bannerIndex + 1) % banners.length)} aria-label="الإعلان التالي">›</button></div></div>
            <div className="banner-viewport"><div className="banner-track" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>{banners.map((banner) => <a className={`ad-banner ${banner.tone}`} href="https://wa.me/966536655941" key={banner.title}><div className="banner-copy"><span className="banner-label">{banner.label}</span><h3>{banner.title}</h3><p>{banner.text}</p><span className="banner-cta">اسأل عبر واتساب <ArrowLeft size={14} /></span></div><div className={`banner-art ${banner.art}`}>{banner.imageUrl ? <img className="banner-real-image" src={banner.imageUrl} alt={banner.title} /> : <><div className="banner-orbit" /><span>{banner.mark}</span></>}</div></a>)}</div></div>
            <div className="banner-dots">{banners.map((banner, index) => <button key={banner.title} className={bannerIndex === index ? "active" : ""} onClick={() => setBannerIndex(index)} aria-label={`الإعلان ${index + 1}`} />)}</div>
          </div>
        </section>

        <section className="catalog-section container" id="catalog">
          <div className="section-heading"><div><div className="section-kicker">اختار اللي تحتاجه</div><h2>تصفح <span>القطع</span></h2></div><a className="all-link" href="#catalog">عرض الكل <ArrowLeft size={16} /></a></div>
          <div className="catalog-layout">
            <aside className="categories-panel"><div className="panel-label">التصنيفات</div>{categories.map(({ label, icon: Icon, count }) => <button key={label} className={activeCategory === label ? "category-button selected" : "category-button"} onClick={() => setActiveCategory(label)}><span className="category-icon"><Icon size={18} /></span><span>{label}</span><small>{count}</small></button>)}<div className="side-note"><div className="side-note-icon"><Search size={18} /></div><strong>ما لقيت قطعتك؟</strong><span>أرسل لنا صورة أو رقم القطعة ونبحث لك عنها.</span><a href="https://wa.me/966536655941">تواصل معنا <ArrowLeft size={14} /></a></div></aside>
            <div className="products-area"><div className="search-row"><div className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم القطعة أو الشركة..." /><kbd>⌘ K</kbd></div><select className="filter-button" value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)} aria-label="تصفية حسب القسم">{categories.map(({ label }) => <option key={label} value={label}>{label}</option>)}</select></div><div className="results-line"><span>{filteredProducts.length} قطع مقترحة</span><span className="result-note">عرض مختارات تليد وجديد</span></div><div className="products-grid">{filteredProducts.map((product, index) => <article className="product-card" key={`${product.category}-${product.brand}-${product.name}-${index}`}><div className={`product-image-wrap ${product.imageUrl || product.visual === "sample" ? "sample-image-wrap" : ""}`}><ProductVisual type={product.visual} tone={product.tone} imageUrl={product.imageUrl} imageAlt={product.name} eager={index < 2} />{product.tag && <span className="product-tag">{product.tag}</span>}<a className="quick-view" href={product.imageUrl} target="_blank" rel="noopener noreferrer" aria-label={`عرض صورة ${product.name}`}><Search size={16} /></a></div><div className="product-info"><div className="product-brand">{product.brand}</div><h3>{product.name}</h3><a className="product-ask" href={`https://wa.me/966536655941?text=${encodeURIComponent(`السلام عليكم، أستفسر عن ${product.name}${product.brand ? ` من ${product.brand}` : ""}`)}`}><MessageCircle size={15} /> اطلب عبر واتساب <ArrowLeft size={14} /></a></div></article>)}</div></div>
          </div>
        </section>

        <section className="about-section container reveal" id="contact"><div className="about-card"><div className="about-copy"><div className="section-kicker">من نحن</div><h2>خبرة تُورث،<br /><span>وثقة تتجدد.</span></h2><p>في تليد وجديد نعرف أن الشاحنة ليست مجرد مركبة؛ هي رزق ومشوار والتزام. لذلك نوفر قطع غيار شاحنات مختارة بعناية، ونساعدك توصل للقطعة المناسبة بدون تعقيد.</p><div className="about-points"><span><Check size={15} /> متخصصون بالشاحنات</span><span><Check size={15} /> قطع أصلية وبدائل موثوقة</span></div></div><div className="store-info"><div className="info-heading"><span className="store-pin">⌖</span><div><strong>زورونا في محل تليد وجديد</strong><small>حي الأمير عبدالمجيد، جدة</small></div></div><div className="info-row"><span>ساعات العمل</span><strong>8:00 ص — 8:00 م</strong></div><div className="info-row"><span>الجمعة</span><strong>مغلق</strong></div><a className="map-button" href="https://maps.app.goo.gl/6q7qZcLfAQWac31DA?g_st=ac"><span>فتح موقع المحل على الخريطة</span><ArrowLeft size={16} /></a></div></div></section>

        <section className="contact-section container reveal" id="location"><div className="contact-heading"><div><div className="section-kicker">تواصل معنا</div><h2>نحن <span>قريبين منك.</span></h2></div><a className="all-link" href="https://wa.me/966536655941">ابدأ محادثة <ArrowLeft size={16} /></a></div><div className="contact-layout"><div className="map-card"><a className="map-static-link" href="https://maps.app.goo.gl/6q7qZcLfAQWac31DA?g_st=ac" target="_blank" rel="noopener noreferrer" aria-label="فتح موقع تليد وجديد في خرائط Google"><MapPin size={31} /><span>اضغط لفتح موقع المحل على الخريطة</span></a><div className="map-overlay"><MapPin size={15} /><span>تليد وجديد لقطع غيار الشاحنات</span><small>جدة · افتح الاتجاهات من الزر</small></div></div><div className="contact-cards"><a href="tel:+966536655941" className="contact-card"><span className="contact-icon"><Phone size={18} /></span><div><small>اتصل بنا</small><strong>053 665 5941</strong><em>اضغط للاتصال مباشرة</em></div><ArrowLeft size={16} /></a><a href="tel:+966537566863" className="contact-card"><span className="contact-icon"><Phone size={18} /></span><div><small>اتصل بنا · عبدالعزيز</small><strong>053 756 6863</strong><em>اضغط للاتصال مباشرة</em></div><ArrowLeft size={16} /></a><a href="https://wa.me/966537566863" className="contact-card whatsapp-card"><span className="contact-icon"><MessageCircle size={18} /></span><div><small>واتساب · عبدالعزيز</small><strong>053 756 6863</strong><em>أرسل صورة أو رقم القطعة</em></div><ArrowLeft size={16} /></a><a href="https://wa.me/966536655941" className="contact-card whatsapp-card"><span className="contact-icon"><MessageCircle size={18} /></span><div><small>واتساب · ناجي</small><strong>053 665 5941</strong><em>أرسل صورة أو رقم القطعة</em></div><ArrowLeft size={16} /></a><div className="contact-card"><span className="contact-icon"><Clock3 size={18} /></span><div><small>ساعات العمل</small><strong>8 ص — 8 م</strong><em>الجمعة: مغلق</em></div></div></div></div></section>

        <section className="faq-section container reveal"><div className="contact-heading"><div><div className="section-kicker">عندك سؤال؟</div><h2>الأسئلة <span>الشائعة</span></h2></div><span className="faq-note">إجابات سريعة قبل ما تتواصل معنا</span></div><div className="faq-list">{faqs.map((faq, index) => <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{faq.question}</span><span className="faq-plus">+</span></button><div className="faq-answer"><p>{faq.answer}</p></div></div>)}</div></section>

        <section className="cta-section container reveal"><div className="cta-inner"><div><div className="section-kicker light">تحتاج مساعدة؟</div><h2>قطعتك ما ظهرت؟<br /><span>خلها علينا.</span></h2><p>صوّر القطعة أو اكتب رقمها، ونتأكد لك من التوفر والبديل المناسب.</p></div><a className="cta-button" href="https://wa.me/966536655941"><MessageCircle size={19} /> أرسل استفسارك عبر واتساب <ArrowLeft size={17} /></a></div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><span>© 2026 شركة تليد وجديد لقطع غيار الشاحنات</span><span>قطع أصلية ... أداء يدوم وثقة ما تخذلك</span></div></footer>
    </div>
  );
}
