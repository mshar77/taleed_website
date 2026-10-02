from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = p.read_text()
rule = '''\n.products-grid:empty { min-height:240px; display:grid; place-items:center; border:1px dashed #d7dfe2; border-radius:12px; background:#fbfcfc; }\n.products-grid:empty::before { content:"لم تُضف المنتجات بعد من لوحة التحكم"; color:#7a8a91; font-size:13px; }\n'''
if '.products-grid:empty' not in c:
    c += rule
p.write_text(c)
