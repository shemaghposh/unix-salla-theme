# Side-by-side tiles: unix.sa (left) | new theme (right). python3 pair.py <name>
import sys, os
from PIL import Image, ImageDraw
name=sys.argv[1]; W=420; TILE=1500
ims=[]
for d in ('old','new'):
    im=Image.open(f'shots/{d}/{name}-full.png').convert('RGB')
    im=im.resize((W,int(im.height*W/im.width)))
    ims.append(im)
H=max(i.height for i in ims)
canvas=Image.new('RGB',(W*2+20,H+30),'#888')
d=ImageDraw.Draw(canvas); d.text((10,8),'unix.sa',fill='white'); d.text((W+30,8),'Unixa (new)',fill='white')
canvas.paste(ims[0],(0,30)); canvas.paste(ims[1],(W+20,30))
os.makedirs('pairs',exist_ok=True); n=0
for y in range(0,canvas.height,TILE):
    canvas.crop((0,y,canvas.width,min(y+TILE,canvas.height))).save(f'pairs/{name}-{n}.jpg',quality=80); n+=1
print(name,n,'tiles',H)
