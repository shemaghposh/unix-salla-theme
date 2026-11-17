# Stitch viewport tiles into <name>-full.png: python stitch.py <dir>
import sys, json, glob
from PIL import Image
d=sys.argv[1]
for r in json.load(open(d+'/report.json')):
    files=sorted(glob.glob(f"{d}/{r['name']}-t*.png"))
    if not files: continue
    ims=[Image.open(f).convert('RGB') for f in files]
    w,h=ims[0].size; scale=h/r['vh']; total=int(r['height']*scale)
    out=Image.new('RGB',(w,total),'white')
    for i,im in enumerate(ims):
        y=int(i*r['vh']*scale)
        if i==len(ims)-1: y=total-h if total>h else 0   # the last tile sits at the page end
        out.paste(im,(0,max(0,y)))
    out.save(f"{d}/{r['name']}-full.png")
    print(r['name'],len(ims),'tiles')
