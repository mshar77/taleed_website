from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text().replace('بدواي أصلي', 'تليد وجديد أصلي')
home.write_text(s)

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
addition = '''\n/* prevent product cards from overflowing on narrow screens */\nhtml, body, #root { max-width:100%; overflow-x:hidden; }\n.products-area, .products-grid, .product-card, .product-image-wrap, .product-visual { min-width:0; max-width:100%; }\n.products-grid { width:100%; direction:rtl; }\n.product-card { overflow:hidden; }\n.product-image-wrap, .product-visual { width:100%; overflow:hidden; }\n@media (max-width:800px) { .products-area { width:100%; }.products-grid { width:100%; max-width:520px; margin-right:auto; margin-left:auto; }.product-card { width:100%; } }\n'''
if '/* prevent product cards from overflowing on narrow screens */' not in c:
    c += addition
css.write_text(c)
