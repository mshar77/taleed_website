from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = p.read_text()
s = s.replace('mark: "BDW" }', 'mark: "BDW", imageUrl: null }')
s = s.replace('mark: "NEW" }', 'mark: "NEW", imageUrl: null }')
s = s.replace('mark: "IMG" }', 'mark: "IMG", imageUrl: null }')
s = s.replace('mark: "24/7" }', 'mark: "24/7", imageUrl: null }')
s = s.replace('mark: "%" }', 'mark: "%", imageUrl: null }')
p.write_text(s)
