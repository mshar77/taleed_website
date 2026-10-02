from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('import { trpc } from "@/lib/trpc";\n', 'import { catalogCategories } from "@/data/categories";\nimport { catalogProducts } from "@/data/products";\n')
start = s.index('const fallbackCategories = [')
end = s.index('\n\nconst fallbackBanners = [', start)
s = s[:start] + s[end+2:]
start = s.index('const fallbackProducts = [')
end = s.index('\n\nfunction ProductVisual', start)
s = s[:start] + s[end+2:]
old = '''  const { data: dbCategories = [] } = trpc.catalog.categories.useQuery();
  const { data: dbProducts = [] } = trpc.catalog.products.useQuery();
  const categories = useMemo(() => dbCategories.length ? [{ label: "كل القطع", icon: Package, count: String(dbProducts.length) }, ...dbCategories.map((category) => ({ label: category.name, icon: Package, count: "" }))] : fallbackCategories, [dbCategories, dbProducts.length]);
  const products = useMemo(() => dbProducts.map(({ product, category }, index) => ({ name: product.name, code: product.code || "بدون رقم", brand: product.brand || "تليد وجديد", category: category?.name || "كل القطع", tag: product.tag || (product.status === "available" ? "متوفر الآن" : "تأكد من التوفر"), tone: ["gold", "blue", "green", "orange"][index % 4], visual: product.imageUrl ? "sample" : "valve", imageUrl: product.imageUrl })), [dbProducts]);
  const banners = fallbackBanners;
  const faqs = fallbackFaqs;'''
new = '''  const categories = catalogCategories;
  const products = useMemo(() => catalogProducts.map((product, index) => ({ ...product, tone: ["gold", "blue", "green", "orange"][index % 4], visual: "sample" })), []);
  const banners = fallbackBanners;
  const faqs = fallbackFaqs;'''
if old not in s:
    raise SystemExit('dynamic data block not found')
s = s.replace(old, new)
home.write_text(s)

app = Path('/home/ubuntu/truck-parts-catalog/client/src/App.tsx')
a = app.read_text().replace('import Admin from "@/pages/Admin";\n', '').replace('      <Route path="/admin" component={Admin} />\n', '')
app.write_text(a)

pkg = Path('/home/ubuntu/truck-parts-catalog/package.json')
p = pkg.read_text().replace('"build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",', '"build": "vite build",')
pkg.write_text(p)
