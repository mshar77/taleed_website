from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('<div className={`part-shape ${type}`} aria-hidden="true">', '<>{type === "sample" ? <img className="real-product-image" src="/manus-storage/sample-product_571abdda.webp" alt="منتج تجريبي من شركة تليد وجديد" /> : <div className={`part-shape ${type}`} aria-hidden="true">')
s = s.replace('{type === "belt" && <><em /><em /></>}\n      </div>\n      <span className="visual-mark">BDW</span>', '{type === "belt" && <><em /><em /></>}\n      </div>}\n      </>\n      <span className="visual-mark">تليد وجديد</span>')
s = s.replace('{ name: "فلتر هواء للمحرك", code: "BDW-AF-2048", brand: "تليد وجديد أصلي", category: "المحرك", tag: "الأكثر طلبًا", tone: "gold", visual: "air" }', '{ name: "صورة منتج تجريبية", code: "SAMPLE-IMAGE-01", brand: "تجربة صورة حقيقية", category: "كل القطع", tag: "تجربة الصورة", tone: "gold", visual: "sample" }')
s = s.replace('<img src="/manus-storage/bdawi-logo_17d70164.png" alt="تليد وجديد لقطع غيار الشاحنات" />', '<img src="/manus-storage/taleed-mark_cf4d8fc6.png" alt="شعار شركة تليد وجديد" /><span className="brand-name">شركة تليد وجديد</span>')
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
c = c.replace('.brand { display:flex; align-items:center; width: 165px; flex-shrink:0; }\n.brand img { display:block; width:100%; height:auto; mix-blend-mode:multiply; }', '.brand { display:flex; align-items:center; gap:9px; width:190px; flex-shrink:0; color:#263d4b; font-size:11px; font-weight:700; white-space:nowrap; }\n.brand img { display:block; width:46px; height:46px; object-fit:contain; }\n.brand-name { color:#b2862f; }')
if '.real-product-image' not in c:
    c += '\n.real-product-image { width:100%; height:100%; min-height:0; object-fit:contain; object-position:center; display:block; background:#122333; }\n'
css.write_text(c)
