from pathlib import Path

home = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = home.read_text()
# Main contact defaults use Naji's number; both numbers get dedicated cards below.
s = s.replace('966500000000', '966536655941')
s = s.replace('050 000 0000', '053 665 5941')
s = s.replace('نستقبلكم من السبت إلى الخميس من 8 صباحًا حتى 10 مساءً، ويوم الجمعة من 4 عصرًا حتى 10 مساءً.', 'نستقبلكم من السبت إلى الخميس من 8 صباحًا حتى 8 مساءً، ويوم الجمعة مغلق.')
s = s.replace('8:00 ص — 10:00 م', '8:00 ص — 8:00 م')
s = s.replace('4:00 م — 10:00 م', 'مغلق')
s = s.replace('8 ص — 10 م', '8 ص — 8 م')
s = s.replace('الجمعة: 4 م — 10 م', 'الجمعة: مغلق')
s = s.replace('https://maps.google.com/?q=Riyadh', 'https://maps.app.goo.gl/6q7qZcLfAQWac31DA?g_st=ac')
s = s.replace('initialCenter={{ lat: 24.7136, lng: 46.6753 }}', 'initialCenter={{ lat: 21.5433, lng: 39.1728 }}')
s = s.replace('position: { lat: 24.7136, lng: 46.6753 }', 'position: { lat: 21.5433, lng: 39.1728 }')
s = s.replace('<small>الموقع الدقيق يحدّث بعد إرسال العنوان</small>', '<small>جدة · افتح الاتجاهات من الزر</small>')
old = '<a href="tel:+966536655941" className="contact-card"><span className="contact-icon"><Phone size={18} /></span><div><small>اتصل بنا</small><strong>053 665 5941</strong><em>اضغط للاتصال مباشرة</em></div><ArrowLeft size={16} /></a>'
new = old + '<a href="tel:+966537566863" className="contact-card"><span className="contact-icon"><Phone size={18} /></span><div><small>اتصل بنا · عبدالعزيز</small><strong>053 756 6863</strong><em>اضغط للاتصال مباشرة</em></div><ArrowLeft size={16} /></a>'
if '053 756 6863' not in s:
    if old not in s:
        raise SystemExit('first contact card not found')
    s = s.replace(old, new)
# Add a WhatsApp second number card by updating the first WhatsApp label.
s = s.replace('<small>واتساب</small><strong>راسلنا الآن</strong>', '<small>واتساب · ناجي</small><strong>053 665 5941</strong>')
# Ensure footer/company naming is explicit.
s = s.replace('© 2026 تليد وجديد لقطع غيار الشاحنات', '© 2026 شركة تليد وجديد لقطع غيار الشاحنات')
home.write_text(s)
