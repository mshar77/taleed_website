from pathlib import Path

p = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = p.read_text()
s = s.replace('import { MapView } from "@/components/Map";', 'import { MapView } from "@/components/Map";\nimport { trpc } from "@/lib/trpc";')
s = s.replace('const categories = [', 'const fallbackCategories = [', 1)
s = s.replace('const banners = [', 'const fallbackBanners = [', 1)
s = s.replace('const faqs = [', 'const fallbackFaqs = [', 1)
s = s.replace('const products = [', 'const fallbackProducts = [', 1)
s = s.replace('function ProductVisual({ type, tone }: { type: string; tone: string }) {', 'function ProductVisual({ type, tone, imageUrl, imageAlt }: { type: string; tone: string; imageUrl?: string | null; imageAlt?: string }) {')
s = s.replace('<>{type === "sample" ? <img className="real-product-image" src="/manus-storage/sample-product_571abdda.webp" alt="منتج تجريبي من شركة تليد وجديد" /> : <div', '<>{imageUrl ? <img className="real-product-image" src={imageUrl} alt={imageAlt ?? "صورة المنتج"} /> : type === "sample" ? <img className="real-product-image" src="/manus-storage/sample-product_571abdda.webp" alt="منتج تجريبي من شركة تليد وجديد" /> : <div')
needle = '  const [openFaq, setOpenFaq] = useState(0);\n'
insert = '''  const [openFaq, setOpenFaq] = useState(0);\n  const { data: dbCategories = [] } = trpc.catalog.categories.useQuery();\n  const { data: dbProducts = [] } = trpc.catalog.products.useQuery();\n  const { data: dbBanners = [] } = trpc.catalog.banners.useQuery();\n  const { data: dbFaqs = [] } = trpc.catalog.faqs.useQuery();\n  const categories = useMemo(() => dbCategories.length ? [{ label: "كل القطع", icon: Package, count: String(dbProducts.length) }, ...dbCategories.map((category) => ({ label: category.name, icon: Package, count: "" }))] : fallbackCategories, [dbCategories, dbProducts.length]);\n  const products = useMemo(() => dbProducts.length ? dbProducts.map(({ product, category }, index) => ({ name: product.name, code: product.code || "بدون رقم", brand: product.brand || "تليد وجديد", category: category?.name || "كل القطع", tag: product.tag || (product.status === "available" ? "متوفر الآن" : "تأكد من التوفر"), tone: ["gold", "blue", "green", "orange"][index % 4], visual: product.imageUrl ? "sample" : "valve", imageUrl: product.imageUrl })) : fallbackProducts, [dbProducts]);\n  const banners = useMemo(() => dbBanners.length ? dbBanners.map((banner, index) => ({ label: "إعلان تليد وجديد", title: banner.title, text: banner.text || "اسألنا عن القطعة ونساعدك توصل للبديل المناسب.", tone: ["banner-gold", "banner-steel", "banner-green", "banner-blue", "banner-orange"][index % 5], art: "banner-camera", mark: "NEW", imageUrl: banner.imageUrl })) : fallbackBanners, [dbBanners]);\n  const faqs = dbFaqs.length ? dbFaqs : fallbackFaqs;\n'''
if needle not in s:
    raise SystemExit('state needle not found')
s = s.replace(needle, insert, 1)
s = s.replace('setBannerIndex((index) => (index + 1) % banners.length), 5000); return () => window.clearInterval(timer); }, []);', 'setBannerIndex((index) => (index + 1) % Math.max(banners.length, 1)), 5000); return () => window.clearInterval(timer); }, [banners.length]);')
s = s.replace('<div className={`banner-art ${banner.art}`}><div className="banner-orbit" /><span>{banner.mark}</span></div>', '<div className={`banner-art ${banner.art}`}>{banner.imageUrl ? <img className="banner-real-image" src={banner.imageUrl} alt={banner.title} /> : <><div className="banner-orbit" /><span>{banner.mark}</span></>}</div>')
s = s.replace('<ProductVisual type={product.visual} tone={product.tone} />', '<ProductVisual type={product.visual} tone={product.tone} imageUrl={product.imageUrl} imageAlt={product.name} />')
s = s.replace('className={`product-image-wrap ${product.visual === "sample" ? "sample-image-wrap" : ""}`}', 'className={`product-image-wrap ${product.imageUrl || product.visual === "sample" ? "sample-image-wrap" : ""}`}')
p.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
if '.banner-real-image' not in c:
    c += '\n.banner-real-image { width:100%; height:100%; object-fit:cover; border-radius:inherit; display:block; }\n'
css.write_text(c)
