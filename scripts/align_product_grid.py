from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = p.read_text()
if '.products-grid { align-items:start; }' not in c:
    c += '\n.products-grid { align-items:start; }\n'
p.write_text(c)
