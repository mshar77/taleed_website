from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = p.read_text().replace('تواصل معنا عبر واتساب لمعرفة خيارات التوصيل المتاحة حسب موقعك والقطعة المطلوبة.', 'التوصيل متاح تقريبًا حسب موقعك والقطعة المطلوبة؛ تواصل معنا عبر واتساب لتأكيد التفاصيل والتكلفة.')
p.write_text(s)
