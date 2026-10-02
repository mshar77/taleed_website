from pathlib import Path

css = Path('/home/ubuntu/truck-parts-catalog/client/src/index.css')
c = css.read_text()
old = '.map-card { min-height:310px; position:relative; overflow:hidden; background:#dbe5e2; border-radius:10px; border:1px solid #e0e7e6; }'
new = '.map-card { min-height:310px; position:relative; overflow:hidden; background-color:#dbe5e2; background-image:linear-gradient(32deg, transparent 46%, rgba(255,255,255,.72) 47%, rgba(255,255,255,.72) 50%, transparent 51%), linear-gradient(118deg, transparent 45%, rgba(255,255,255,.55) 46%, rgba(255,255,255,.55) 48%, transparent 49%), linear-gradient(90deg, transparent 49%, rgba(154,181,172,.35) 50%, transparent 51%); background-size:170px 130px, 220px 170px, 100px 100px; border-radius:10px; border:1px solid #e0e7e6; }'
if old in c:
    c = c.replace(old, new)
css.write_text(c)
