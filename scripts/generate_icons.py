from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(BASE, "icons")
os.makedirs(ICONS, exist_ok=True)
S = 1024


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_bg(size):
    w, h = size
    top = (244, 236, 247)
    bottom = (247, 232, 219)
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        c = lerp(top, bottom, t)
        for x in range(w):
            px[x, y] = c
    return img


def star(draw, cx, cy, r, fill):
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.36
        pts.append((cx + math.cos(ang) * rad, cy + math.sin(ang) * rad))
    draw.polygon(pts, fill=fill)


def draw_cloud_icon(scale=1.0):
    img = gradient_bg((S, S)).convert("RGBA")
    d = ImageDraw.Draw(img, "RGBA")

    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow, "RGBA")
    gd.ellipse((170, 120, 860, 810), fill=(255, 251, 240, 135))
    gd.ellipse((280, 180, 760, 720), fill=(238, 222, 246, 95))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img.alpha_composite(glow)

    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = S / 2, S / 2 + 12
    R = 370
    for deg in range(0, 360, 12):
        a1 = math.radians(deg)
        a2 = math.radians(deg + 5.5)
        x1, y1 = cx + R * math.cos(a1), cy + R * math.sin(a1)
        x2, y2 = cx + R * math.cos(a2), cy + R * math.sin(a2)
        d.line([(x1, y1), (x2, y2)], fill=(151, 126, 165, 90), width=4)

    for x, y, r, a in [(235, 270, 18, 110), (795, 238, 13, 95), (822, 682, 10, 80), (207, 678, 8, 80)]:
        star(d, x, y, r, (185, 150, 91, a))

    shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow, "RGBA")
    sd.ellipse((300, 610, 742, 780), fill=(70, 48, 70, 85))
    sd.ellipse((334, 330, 708, 706), fill=(70, 48, 70, 35))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))
    img.alpha_composite(shadow)

    cloud = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cloud, "RGBA")
    cd.rounded_rectangle((335, 432, 695, 690), radius=125, fill=(255, 251, 243, 255))
    cd.ellipse((285, 474, 500, 690), fill=(255, 251, 243, 255))
    cd.ellipse((378, 320, 652, 615), fill=(255, 253, 248, 255))
    cd.ellipse((526, 378, 760, 660), fill=(253, 247, 240, 255))
    cd.ellipse((322, 548, 700, 735), fill=(255, 250, 241, 255))

    shade = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    shd = ImageDraw.Draw(shade, "RGBA")
    shd.ellipse((338, 590, 704, 760), fill=(204, 187, 218, 72))
    shd.ellipse((300, 510, 470, 735), fill=(219, 199, 226, 45))
    shade = shade.filter(ImageFilter.GaussianBlur(26))
    cloud.alpha_composite(shade)
    img.alpha_composite(cloud)

    blush = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blush, "RGBA")
    bd.ellipse((357, 551, 447, 590), fill=(235, 169, 169, 90))
    bd.ellipse((556, 551, 646, 590), fill=(235, 169, 169, 90))
    blush = blush.filter(ImageFilter.GaussianBlur(10))
    img.alpha_composite(blush)

    d = ImageDraw.Draw(img, "RGBA")
    d.ellipse((410, 483, 482, 571), fill=(55, 45, 63, 255))
    d.ellipse((541, 483, 613, 571), fill=(55, 45, 63, 255))
    d.ellipse((429, 500, 455, 532), fill=(255, 255, 255, 240))
    d.ellipse((560, 500, 586, 532), fill=(255, 255, 255, 240))
    d.ellipse((451, 544, 465, 556), fill=(255, 255, 255, 110))
    d.ellipse((582, 544, 596, 556), fill=(255, 255, 255, 110))
    d.arc((477, 567, 544, 610), start=15, end=165, fill=(122, 82, 86, 235), width=6)
    d.ellipse((504, 557, 514, 563), fill=(207, 151, 134, 150))

    star(d, 512, 286, 27, (184, 146, 87, 235))
    star(d, 512, 286, 13, (245, 225, 185, 240))

    box = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bd2 = ImageDraw.Draw(box, "RGBA")
    bd2.rounded_rectangle((432, 681, 622, 834), radius=24, fill=(211, 191, 229, 255))
    bd2.rounded_rectangle((421, 658, 633, 714), radius=18, fill=(232, 217, 242, 255))
    bd2.rectangle((507, 661, 545, 833), fill=(246, 230, 205, 255))
    bd2.rounded_rectangle((492, 642, 560, 678), radius=10, fill=(246, 230, 205, 255))
    bd2.ellipse((489, 635, 525, 667), fill=(238, 216, 183, 255))
    bd2.ellipse((528, 635, 564, 667), fill=(238, 216, 183, 255))
    bd2.ellipse((510, 640, 544, 671), fill=(201, 164, 119, 255))
    bd2.line((452, 744, 592, 744), fill=(255, 255, 255, 35), width=4)
    img.alpha_composite(box)

    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle((8, 8, S - 9, S - 9), radius=210, outline=(255, 255, 255, 80), width=3)

    if scale != 1.0:
        inner = img.resize((int(S * scale), int(S * scale)), Image.LANCZOS)
        canvas = gradient_bg((S, S)).convert("RGBA")
        off = ((S - inner.width) // 2, (S - inner.height) // 2)
        canvas.alpha_composite(inner, off)
        img = canvas
    return img


icon = draw_cloud_icon(1.0)
icon.resize((512, 512), Image.LANCZOS).convert("RGB").save(os.path.join(ICONS, "icon-512.png"), optimize=True)
icon.resize((192, 192), Image.LANCZOS).convert("RGB").save(os.path.join(ICONS, "icon-192.png"), optimize=True)
icon.resize((180, 180), Image.LANCZOS).convert("RGB").save(os.path.join(ICONS, "apple-touch-icon.png"), optimize=True)
icon.resize((32, 32), Image.LANCZOS).convert("RGB").save(os.path.join(ICONS, "favicon-32.png"), optimize=True)
draw_cloud_icon(0.78).resize((512, 512), Image.LANCZOS).convert("RGB").save(
    os.path.join(ICONS, "maskable-512.png"), optimize=True
)

# Social preview card
W, H = 1200, 630
og = Image.new("RGB", (W, H), (246, 238, 231))
px = og.load()
for y in range(H):
    for x in range(W):
        t = x / W
        u = y / H
        c = lerp((243, 233, 246), (248, 232, 218), 0.55 * t + 0.3 * u)
        px[x, y] = c
og = og.convert("RGBA")

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow, "RGBA")
gd.ellipse((-120, -160, 500, 390), fill=(255, 255, 255, 150))
gd.ellipse((800, -220, 1320, 300), fill=(237, 220, 243, 140))
gd.ellipse((900, 360, 1360, 800), fill=(255, 244, 230, 120))
glow = glow.filter(ImageFilter.GaussianBlur(55))
og.alpha_composite(glow)
d = ImageDraw.Draw(og, "RGBA")

for deg in range(0, 360, 14):
    a1 = math.radians(deg)
    a2 = math.radians(deg + 6)
    x1, y1 = 960 + 260 * math.cos(a1), 300 + 260 * math.sin(a1)
    x2, y2 = 960 + 260 * math.cos(a2), 300 + 260 * math.sin(a2)
    d.line([(x1, y1), (x2, y2)], fill=(143, 119, 158, 50), width=2)
for x, y, r in [(1078, 100, 12), (1112, 410, 8), (160, 450, 8), (690, 120, 7)]:
    star(d, x, y, r, (179, 145, 91, 130))

font_title = ImageFont.truetype(r"C:\Windows\Fonts\STSONG.TTF", 84)
font_sub = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 26)
font_eyebrow = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
font_small = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 17)

d.text((88, 122), "A TINY SURPRISE, JUST FOR YOU", font=font_eyebrow, fill=(128, 104, 145))
d.text((82, 178), "云朵抽盒社", font=font_title, fill=(53, 42, 60))
d.text((88, 302), "今天，也拆一点好运气。", font=font_sub, fill=(105, 88, 115))
d.rounded_rectangle((88, 374, 466, 432), radius=29, fill=(255, 252, 246, 170), outline=(126, 102, 140, 45), width=1)
d.text((112, 390), "一箱 10 盒  ·  2 个随机 DIMOO + 8 个其他 IP", font=font_small, fill=(102, 82, 112))
d.text((88, 482), "没有空盒  ·  隐藏款约 5%  ·  可自由换批", font=font_small, fill=(137, 118, 145))
d.text((88, 552), "CLOUD BOX CLUB   ·   NO. 001", font=font_eyebrow, fill=(154, 134, 155))

card_w = 380
icon_small = icon.resize((card_w, card_w), Image.LANCZOS)
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(shadow, "RGBA")
sd.rounded_rectangle((776, 126, 1156, 506), radius=70, fill=(53, 37, 63, 100))
shadow = shadow.filter(ImageFilter.GaussianBlur(28))
og.alpha_composite(shadow)
mask = Image.new("L", (card_w, card_w), 0)
md = ImageDraw.Draw(mask)
md.rounded_rectangle((0, 0, card_w, card_w), radius=64, fill=255)
card = icon_small.convert("RGBA")
card.putalpha(mask)
og.alpha_composite(card, (776, 126))
d = ImageDraw.Draw(og, "RGBA")
d.rounded_rectangle((776, 126, 776 + card_w, 126 + card_w), radius=64, outline=(255, 255, 255, 170), width=3)

og.convert("RGB").save(os.path.join(ICONS, "og-cover.png"), optimize=True)
print("icons and og written")
