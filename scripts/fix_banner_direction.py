from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = p.read_text().replace('translateX(${bannerIndex * 100}%)', 'translateX(-${bannerIndex * 100}%)')
p.write_text(s)
