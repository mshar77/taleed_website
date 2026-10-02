from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
s = s.replace('<div className="product-image-wrap"><ProductVisual type={product.visual}', '<div className={`product-image-wrap ${product.visual === "sample" ? "sample-image-wrap" : ""}`}><ProductVisual type={product.visual}')
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
addition = '''\n/* portrait product images keep their natural poster ratio */\n.sample-image-wrap, .sample-image-wrap .sample-visual { aspect-ratio:367 / 519 !important; height:auto !important; min-height:0 !important; }\n.sample-image-wrap .real-product-image { object-fit:cover; width:100%; height:100%; }\n'''
if '/* portrait product images keep their natural poster ratio */' not in c:
    c += addition
css.write_text(c)
