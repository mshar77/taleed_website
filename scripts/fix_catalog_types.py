from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = p.read_text()
s = s.replace('visual: "sample" },', 'visual: "sample", imageUrl: "/manus-storage/sample-product_571abdda.webp" },')
s = s.replace('visual: "brake" },', 'visual: "brake", imageUrl: null },')
s = s.replace('visual: "valve" },', 'visual: "valve", imageUrl: null },')
s = s.replace('visual: "belt" },', 'visual: "belt", imageUrl: null },')
p.write_text(s)
