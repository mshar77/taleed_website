from pathlib import Path
p = Path('/home/ubuntu/truck-parts-catalog/client/src/pages/Home.tsx')
s = p.read_text()
needle = '<a href="tel:+966537566863" className="contact-card"><span className="contact-icon"><Phone size={18} /></span><div><small>اتصل بنا · عبدالعزيز</small><strong>053 756 6863</strong><em>اضغط للاتصال مباشرة</em></div><ArrowLeft size={16} /></a>'
addition = needle + '<a href="https://wa.me/966537566863" className="contact-card whatsapp-card"><span className="contact-icon"><MessageCircle size={18} /></span><div><small>واتساب · عبدالعزيز</small><strong>053 756 6863</strong><em>أرسل صورة أو رقم القطعة</em></div><ArrowLeft size={16} /></a>'
if 'واتساب · عبدالعزيز' not in s:
    if needle not in s:
        raise SystemExit('Abdulaziz phone card not found')
    s = s.replace(needle, addition)
p.write_text(s)
