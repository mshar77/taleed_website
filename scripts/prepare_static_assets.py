from pathlib import Path
import shutil

root = Path('/home/ubuntu/truck-parts-catalog')
assets = root / 'client' / 'public' / 'assets'
assets.mkdir(parents=True, exist_ok=True)
source = Path('/home/ubuntu/webdev-static-assets')
for src, name in [(source / 'taleed-mark.png', 'taleed-mark.png'), (source / 'sample-product.webp', 'sample-product.webp')]:
    if src.exists():
        shutil.copy2(src, assets / name)

home = root / 'client' / 'src' / 'pages' / 'Home.tsx'
s = home.read_text().replace('/manus-storage/taleed-mark_cf4d8fc6.png', '/assets/taleed-mark.png').replace('/manus-storage/sample-product_571abdda.webp', '/assets/sample-product.webp')
home.write_text(s)
