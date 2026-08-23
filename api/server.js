'use strict';
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const jwt        = require('jsonwebtoken');
const { authenticator } = require('otplib');
const QRCode     = require('qrcode');
const multer     = require('multer');
const bcrypt     = require('bcryptjs');
const crypto     = require('crypto');
const fs         = require('fs');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

// ── Paths ──
const DATA_DIR    = path.join(__dirname, 'data');
const PRODUCTS_F  = path.join(DATA_DIR, 'products.json');
const CONTENT_F   = path.join(DATA_DIR, 'site_content.json');
const WORKSHOPS_F = path.join(DATA_DIR, 'workshops.json');
const BOOKINGS_F  = path.join(DATA_DIR, 'bookings.json');
const BLOCKED_F   = path.join(DATA_DIR, 'blocked_dates.json');
const TOTP_F      = path.join(DATA_DIR, 'totp_secret.txt');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

[DATA_DIR, UPLOADS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── Products ──
let products = [];
if (fs.existsSync(PRODUCTS_F)) {
  try { products = JSON.parse(fs.readFileSync(PRODUCTS_F, 'utf8')); } catch (_) {}
} else {
  fs.writeFileSync(PRODUCTS_F, '[]');
}
function saveProducts() {
  fs.writeFileSync(PRODUCTS_F, JSON.stringify(products, null, 2));
}

// ── Site content ──
const DEFAULT_CONTENT = {
  hero: {
    tag: 'Handgemaakt keramiek · Etten-Leur',
    title: 'Keramiek dat<br /><em>verhalen</em> vertelt',
    motto: '"Met de hand gevormd, met het hart gebakken"',
    body: 'Elk stuk dat ik maak is uniek. Met de hand gevormd, liefdevol afgewerkt en bedoeld om generaties mee te gaan. Ontdek mijn collectie, maak kennis met het vak tijdens een workshop.'
  },
  about: {
    title: 'Het verhaal<br />achter het klei',
    p1: 'Veramiek is opgericht vanuit een diepe passie voor het ambacht van keramiek. Ik werk dagelijks met klei, van de eerste vorming op de draaischijf tot de glanzende afwerking na het brandproces.',
    p2: 'Elk stuk dat ik maak is uniek. Ik geloof dat echte schoonheid zit in het handgemaakte, in het spoor dat de handen van de maker achterlaten.',
    p3: 'Naast mijn eigen collectie organiseer ik ook workshops op locatie voor iedereen die zelf wil ontdekken hoe bijzonder het is om met klei te werken.'
  },
  workshop: {
    tag: 'Alle niveaus · Vanaf 4 personen',
    title: 'Keramiek Workshop',
    desc: 'Ik kom bij jullie langs op locatie en neem alles mee: van klei en gereedschap tot verf. Jullie maken onder mijn begeleiding je eigen keramiekstukken, die je daarna ook zelf kunt beschilderen. Als iedereen klaar is, neem ik alles mee om te bakken en te glazuren. Zo heb je binnen no-time je eigen handgemaakte creatie in huis, om op te halen of te laten bezorgen.',
    highlight: 'De perfecte activiteit voor een verjaardag, babyshower, vrijgezellenavond of gewoon een gezellige middag met vrienden. Laat je creativiteit de vrije loop!',
    duration: '~2,5 uur',
    groupSize: 'Vanaf 4 personen',
    location: 'Op locatie',
    price: 'Vanaf € 30',
    priceLabel: 'per persoon'
  },
  contact: {
    title: 'Vragen of bestellen?',
    desc: 'Heb je een vraag over mijn werk, wil je een maatwerkopdracht bespreken of de workshop boeken? Stuur me gerust een appje, bel me op of vul het formulier in. Ik reageer zo snel mogelijk.',
    phone: '+31 6 48 14 54 13',
    whatsappUrl: 'https://wa.me/31648145413',
    email: 'info@veramiek.nl',
    location: 'Etten-Leur, Noord-Brabant',
    instagramUrl: 'https://www.instagram.com/veramiek.nl',
    instagramHandle: '@veramiek.nl',
    tiktokUrl: 'https://www.tiktok.com/@veramiek',
    tiktokHandle: '@veramiek'
  },
  footer: {
    tagline: 'Handgemaakt keramiek met ziel, elk stuk een verhaal, met de hand gevormd en met het hart gebakken.'
  },
  // Geldt voor het hele assortiment, dus een keer invullen in plaats van bij
  // 25 producten. De productpagina toont dit onder de eigen specificaties.
  material: {
    clay: '',
    glaze: '',
    dishwasher: '',
    microwave: '',
    oven: '',
    maintenance: ''
  }
};

let siteContent = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
if (fs.existsSync(CONTENT_F)) {
  try {
    const saved = JSON.parse(fs.readFileSync(CONTENT_F, 'utf8'));
    for (const section of Object.keys(DEFAULT_CONTENT)) {
      if (saved[section] && typeof saved[section] === 'object') {
        siteContent[section] = { ...DEFAULT_CONTENT[section], ...saved[section] };
      }
    }
  } catch (_) {}
}
function saveContent() {
  fs.writeFileSync(CONTENT_F, JSON.stringify(siteContent, null, 2));
}

// ── Workshops (types die geboekt kunnen worden) ──
const DEFAULT_WORKSHOPS = [
  {
    id: 'op-locatie',
    name: 'Keramiek workshop op locatie',
    desc: 'Ik kom bij jullie langs en neem alles mee: klei, gereedschap en verf. Onder mijn begeleiding maakt iedereen een eigen stuk, dat je daarna zelf beschildert. Ik neem alles mee om te bakken en te glazuren, zodat je binnen no-time je eigen creatie in huis hebt. De perfecte activiteit voor een verjaardag, babyshower of gewoon een gezellige middag.',
    duration: '~2,5 uur',
    groupSize: 'Vanaf 4 personen',
    price: 'Vanaf € 30 p.p.',
    images: ['/images/workshop.jpeg'],
  },
];

let workshops = [];
if (fs.existsSync(WORKSHOPS_F)) {
  try { workshops = JSON.parse(fs.readFileSync(WORKSHOPS_F, 'utf8')); } catch (_) {}
}
if (!Array.isArray(workshops) || workshops.length === 0) {
  workshops = JSON.parse(JSON.stringify(DEFAULT_WORKSHOPS));
  fs.writeFileSync(WORKSHOPS_F, JSON.stringify(workshops, null, 2));
}
function saveWorkshops() {
  fs.writeFileSync(WORKSHOPS_F, JSON.stringify(workshops, null, 2));
}

// ── Boekingen ──
let bookings = [];
if (fs.existsSync(BOOKINGS_F)) {
  try { bookings = JSON.parse(fs.readFileSync(BOOKINGS_F, 'utf8')); } catch (_) {}
} else {
  fs.writeFileSync(BOOKINGS_F, '[]');
}
function saveBookings() {
  fs.writeFileSync(BOOKINGS_F, JSON.stringify(bookings, null, 2));
}

// ── Door Vera geblokkeerde datums (YYYY-MM-DD) ──
let blockedDates = [];
if (fs.existsSync(BLOCKED_F)) {
  try { blockedDates = JSON.parse(fs.readFileSync(BLOCKED_F, 'utf8')); } catch (_) {}
} else {
  fs.writeFileSync(BLOCKED_F, '[]');
}
function saveBlocked() {
  fs.writeFileSync(BLOCKED_F, JSON.stringify(blockedDates, null, 2));
}

// ── TOTP secret ──
/**
 * Is er al een 2FA-sleutel in gebruik? Zo ja, dan geeft /admin/setup die niet
 * meer terug op alleen het wachtwoord (zie daar). Een sleutel uit .env of uit
 * een bestaand secret-bestand telt als "in gebruik"; alleen een sleutel die
 * deze start zelf aanmaakt is nog nergens gescand.
 */
let totpEnrolled = false;
let totpSecret = (process.env.TOTP_SECRET || '').trim();
if (totpSecret) {
  totpEnrolled = true;
} else {
  if (fs.existsSync(TOTP_F)) {
    totpSecret = fs.readFileSync(TOTP_F, 'utf8').trim();
    totpEnrolled = true;
  } else {
    totpSecret = authenticator.generateSecret();
    fs.writeFileSync(TOTP_F, totpSecret);
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║  2FA SECRET AANGEMAAKT                ║');
    console.log('║  Bezoek /admin/setup om QR te scannen ║');
    console.log('╚═══════════════════════════════════════╝\n');
  }
}

// ── Admin wachtwoord ──
if (!process.env.ADMIN_PASSWORD) {
  console.error('FOUT: ADMIN_PASSWORD niet ingesteld in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('FOUT: JWT_SECRET niet ingesteld in .env');
  process.exit(1);
}
const adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);

// ── Express ──
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use(cors({
  origin: ['https://veramiek.nl', 'https://www.veramiek.nl', 'https://admin.veramiek.nl', 'http://localhost:8082', 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

/**
 * Verzoeken van binnen het docker-netwerk tellen niet mee voor de algemene
 * limiet. De Next.js-site rendert server-side en haalt producten, workshops en
 * content dus rechtstreeks bij deze API op; al dat verkeer komt van hetzelfde
 * container-IP. Zonder deze uitzondering zou een enkele zoekmachine die snel
 * door de productpagina's loopt de limiet voor de hele site opsouperen, en
 * kregen bezoekers 429's terug.
 *
 * Veilig omdat publiek verkeer altijd via NGINX Proxy Manager binnenkomt, die
 * X-Forwarded-For zet; met trust proxy 1 is req.ip dan het echte bezoekers-IP
 * en nooit een privéadres. Alleen wie al op het docker-netwerk zit, kan deze
 * kant op.
 */
function isInternalRequest(req) {
  const ip = String(req.ip || '').replace(/^::ffff:/, '');
  return /^(10\.|127\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(ip) || ip === '::1';
}

const globalLimit  = rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false,
  skip: isInternalRequest,
  message: { error: 'Te veel verzoeken. Probeer het later opnieuw.' } });
const contactLimit = rateLimit({ windowMs: 60_000, max: 3, standardHeaders: true, legacyHeaders: false });
const orderLimit   = rateLimit({ windowMs: 60_000, max: 3, standardHeaders: true, legacyHeaders: false });
const bookLimit    = rateLimit({ windowMs: 60_000, max: 3, standardHeaders: true, legacyHeaders: false });
const setupLimit   = rateLimit({ windowMs: 900_000, max: 5, standardHeaders: true, legacyHeaders: false });
const loginLimit   = rateLimit({ windowMs: 900_000, max: 5, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Te veel pogingen. Probeer over 15 minuten opnieuw.' } });
const uploadLimit  = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });
app.use(globalLimit);
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Multer (foto upload) ──
/**
 * Alleen deze vier rastertypes mogen erin, met een vaste extensie per type.
 * Bewust NIET path.extname(file.originalname): die naam komt van de uploader,
 * dus een bestand met mimetype image/png maar naam "x.html" belandde eerder
 * als .html op schijf en werd door express.static als tekst/HTML uitgeserveerd.
 * SVG staat er niet in: dat formaat kan script bevatten.
 */
const UPLOAD_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

/**
 * Eerste bytes van elk toegestaan formaat. De mimetype uit de multipart-header
 * is door de client te kiezen, dus die zegt niets; deze handtekeningen komen
 * uit het bestand zelf en worden na de upload gecontroleerd.
 */
const MAGIC_BYTES = {
  '.jpg':  [[0xff, 0xd8, 0xff]],
  '.png':  [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  '.gif':  [[0x47, 0x49, 0x46, 0x38]],
  // WEBP: "RIFF" op 0, "WEBP" op 8. Byte 4-7 is de lengte en varieert.
  '.webp': [[0x52, 0x49, 0x46, 0x46]],
};

/** Leest de eerste 12 bytes en toetst die aan de handtekening van `ext`. */
function hasValidMagicBytes(filePath, ext) {
  const head = Buffer.alloc(12);
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, head, 0, 12, 0);
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  const signatures = MAGIC_BYTES[ext] || [];
  const matches = signatures.some(sig => sig.every((byte, i) => head[i] === byte));
  if (!matches) return false;
  if (ext === '.webp') return head.slice(8, 12).toString('latin1') === 'WEBP';
  return true;
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = UPLOAD_TYPES[file.mimetype] || '.bin';
    cb(null, Date.now() + '-' + crypto.randomBytes(6).toString('hex') + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!UPLOAD_TYPES[file.mimetype]) {
      return cb(new Error('Alleen JPG-, PNG-, WEBP- of GIF-afbeeldingen toegestaan'));
    }
    cb(null, true);
  }
});

// ── Auth middleware ──
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Niet ingelogd' });
  try {
    req.admin = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Sessie verlopen, log opnieuw in' });
  }
}

// ── Rate limiting (login uses express-rate-limit via loginLimit defined above) ──

// ── Hulpfuncties e-mail ──
function escapeHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
/**
 * Maakt een waarde geschikt voor een mailheader (Subject). nodemailer knipt
 * CR/LF er zelf al uit, maar dat is een eigenschap van de library en geen
 * garantie van deze code; hier gaan alle control characters eruit zodat er
 * nooit een tweede header uit een bezoekersnaam kan ontstaan.
 */
function mailHeader(str) {
  return String(str ?? '').replace(/[\r\n\t\x00-\x1f]/g, ' ').trim().slice(0, 120);
}
const ALLOWED_IMG_ORIGINS = ['https://veramiek.nl'];
function imgUrl(src) {
  if (!src) return null;
  const s = String(src);
  // Only allow images hosted on veramiek.nl to prevent external tracking via email clients
  if (s.startsWith('https://veramiek.nl/')) return s;
  if (!s.startsWith('http')) return 'https://veramiek.nl/' + s.split('/').map(encodeURIComponent).join('/');
  return null; // reject external URLs
}

// ── Admin panel HTML ──
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin', (req, res) => res.redirect('/'));

// ── 2FA Setup ──
app.get('/admin/setup', (req, res) => {
  res.send(`<!DOCTYPE html><html lang="nl"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Veramiek: 2FA Instellen</title>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Raleway,sans-serif;background:#EEE4DA;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:2rem}
.card{background:white;border-radius:4px;padding:2.5rem;width:100%;max-width:440px;box-shadow:0 4px 24px rgba(77,14,19,.1)}
h1{font-family:Georgia,serif;color:#4D0E13;font-size:1.5rem;font-weight:400;margin-bottom:.4rem}
.sub{color:#8A6055;font-size:.85rem;margin-bottom:1.75rem;line-height:1.6}
label{display:block;font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8A6055;margin-bottom:.4rem}
input{width:100%;padding:.75rem 1rem;border:1.5px solid #C8B0A4;font-family:Raleway,sans-serif;font-size:.9rem;color:#4D0E13;background:#faf8f5;margin-bottom:1.25rem}
input:focus{outline:none;border-color:#C8A49F}
button{width:100%;padding:.85rem;background:#C8A49F;color:white;border:none;font-family:Raleway,sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:background .2s}
button:hover{background:#A8807A}
.err{color:#c2714f;font-size:.82rem;margin-bottom:.75rem;min-height:1.2em}
#result{margin-top:2rem;text-align:center;display:none}
#qrimg{width:200px;height:200px;border:1px solid #C8B0A4;border-radius:2px;margin-bottom:1rem}
.secret{font-family:monospace;background:#f5f0e8;padding:.6rem .9rem;border-radius:2px;font-size:.82rem;color:#4D0E13;word-break:break-all;text-align:left;margin:.5rem 0 1rem}
.ok{color:#5c8a5e;font-size:.85rem;margin-top:.75rem}
a{color:#C8A49F;text-decoration:none}
</style></head><body>
<div class="card">
  <h1>2FA Instellen</h1>
  <p class="sub">Voer je beheer-wachtwoord in om de QR-code te genereren. Scan die daarna met Google Authenticator of Authy. Is 2FA al ingesteld, vul dan ook je huidige verificatiecode in.</p>
  <label for="pw">Wachtwoord</label>
  <input type="password" id="pw" placeholder="Beheer-wachtwoord" autocomplete="current-password">
  <label for="totp">Huidige code (alleen als 2FA al werkt)</label>
  <input type="text" id="totp" placeholder="6 cijfers" inputmode="numeric" autocomplete="one-time-code" maxlength="6">
  <div class="err" id="err"></div>
  <button onclick="setup()">QR-code ophalen</button>
  <div id="result">
    <img id="qrimg" alt="QR code">
    <p style="font-size:.8rem;color:#8A6055;margin-bottom:.25rem">Of voer deze code handmatig in:</p>
    <div class="secret" id="secretTxt"></div>
    <p class="ok">✓ Gescand? Je kunt nu <a href="/">inloggen</a>.</p>
  </div>
</div>
<script>
async function setup(){
  const pw=document.getElementById('pw').value;
  const totp=document.getElementById('totp').value.trim();
  document.getElementById('err').textContent='';
  const r=await fetch('/admin/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw,totp})});
  const d=await r.json();
  if(!r.ok){document.getElementById('err').textContent=d.error;return;}
  document.getElementById('qrimg').src=d.qr;
  document.getElementById('secretTxt').textContent=d.secret;
  document.getElementById('result').style.display='block';
}
document.getElementById('pw').addEventListener('keydown',e=>{if(e.key==='Enter')setup();});
</script></body></html>`);
});

app.post('/admin/setup', setupLimit, async (req, res) => {
  const { password, totp } = req.body || {};
  if (!password || !bcrypt.compareSync(String(password), adminHash)) {
    return res.status(401).json({ error: 'Onjuist wachtwoord' });
  }
  /**
   * Zodra 2FA een keer is ingesteld, geeft deze route de geheime sleutel niet
   * meer op alleen het wachtwoord. Anders is de tweede factor geen tweede
   * factor: wie het wachtwoord heeft, haalt hier de sleutel op en zet de code
   * in zijn eigen app. Bij een nieuwe installatie (nog geen enrollment) mag het
   * wel, want dan is er nog niets om te beschermen.
   */
  if (totpEnrolled && !authenticator.check(String(totp || ''), totpSecret)) {
    return res.status(401).json({ error: '2FA is al ingesteld. Vul ook je huidige verificatiecode in.' });
  }
  try {
    const otpauth = authenticator.keyuri('admin', 'Veramiek Beheer', totpSecret);
    const qr = await QRCode.toDataURL(otpauth);
    res.json({ qr, secret: totpSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'QR-generatie mislukt' });
  }
});

// ── Login ──
app.post('/admin/login', loginLimit, async (req, res) => {
  const { password, totp } = req.body || {};
  const pwOk   = password && bcrypt.compareSync(String(password), adminHash);
  const totpOk = totp && authenticator.check(String(totp), totpSecret);
  if (!pwOk || !totpOk) {
    return res.status(401).json({ error: 'Onjuist wachtwoord of verificatiecode' });
  }
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// ── Publieke producten & content (voor de website) ──
app.get('/products', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(products.filter(p => p.available !== false));
});

app.get('/content', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(siteContent);
});

// ── Admin: producten CRUD ──
/*
 * POST en PUT bouwden allebei hun eigen productobject. Dat is nu een functie,
 * anders landt een nieuw veld in de een wel en in de ander niet.
 *
 * Meteen een bug eruit: de fotofilter liet alleen http-URL's door, terwijl
 * alle 25 bestaande producten een lokaal pad hebben (/images/producten/...).
 * Een product bewerken wiste dus zijn foto. Lokale paden mogen er nu bij,
 * maar alleen uit die twee mappen, zodat er geen willekeurige waarde in de
 * data belandt.
 */
const FOTO_OK = /^(https?:\/\/|\/images\/|\/uploads\/)/;

function tekst(waarde, max) {
  return String(waarde == null ? '' : waarde).trim().slice(0, max);
}

/* Leeg laten is iets anders dan nul: "niet geteld" mag geen "uitverkocht"
   worden. Vandaar null in plaats van 0 als er niets is ingevuld. */
function voorraadGetal(waarde) {
  if (waarde === '' || waarde == null) return null;
  const n = Math.floor(Number(waarde));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function bouwProduct(body, id) {
  return {
    id,
    name: tekst(body.name, 120),
    desc: tekst(body.desc, 600),
    price: Math.max(0, Number(body.price) || 0),
    category: String(body.category || 'overige'),
    collection: tekst(body.collection, 80),
    badge: body.badge ? tekst(body.badge, 40) : null,
    images: Array.isArray(body.images)
      ? body.images.filter(u => typeof u === 'string' && FOTO_OK.test(u))
      : [],
    available: body.available !== false,
    stock: voorraadGetal(body.stock),
    size: tekst(body.size, 80),
    volume: tekst(body.volume, 80),
    purpose: tekst(body.purpose, 200),
    story: tekst(body.story, 2000)
  };
}

app.get('/admin/products', auth, (req, res) => {
  res.json(products);
});

app.post('/admin/products', auth, (req, res) => {
  const body = req.body || {};
  if (!body.name) return res.status(400).json({ error: 'Naam is verplicht' });
  const p = bouwProduct(body, crypto.randomUUID());
  products.push(p);
  saveProducts();
  res.json(p);
});

app.put('/admin/products/:id', auth, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product niet gevonden' });
  const body = req.body || {};
  if (!body.name) return res.status(400).json({ error: 'Naam is verplicht' });
  products[idx] = bouwProduct(body, products[idx].id);
  saveProducts();
  res.json(products[idx]);
});

app.delete('/admin/products/:id', auth, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product niet gevonden' });
  products.splice(idx, 1);
  saveProducts();
  res.json({ ok: true });
});

// ── Admin: content bijwerken ──
app.put('/admin/content', auth, (req, res) => {
  const { hero, about, workshop, contact, footer, material } = req.body || {};
  if (hero)     siteContent.hero     = { ...siteContent.hero,     ...hero };
  if (about)    siteContent.about    = { ...siteContent.about,    ...about };
  if (workshop) siteContent.workshop = { ...siteContent.workshop, ...workshop };
  if (contact)  siteContent.contact  = { ...siteContent.contact,  ...contact };
  if (footer)   siteContent.footer   = { ...siteContent.footer,   ...footer };
  if (material) siteContent.material = { ...siteContent.material, ...material };
  saveContent();
  res.json(siteContent);
});

// ── Foto upload ──
app.post('/admin/upload', auth, uploadLimit, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Geen bestand ontvangen' });
  // Pas na het wegschrijven te controleren: multer streamt naar schijf, de
  // eerste bytes zijn in fileFilter nog niet beschikbaar. Klopt de handtekening
  // niet met de opgegeven mimetype, dan is het bestand geen echte afbeelding en
  // gaat het meteen weer weg.
  const ext = path.extname(req.file.filename);
  if (!hasValidMagicBytes(req.file.path, ext)) {
    try { fs.unlinkSync(req.file.path); } catch { /* al weg, prima */ }
    return res.status(400).json({ error: 'Bestand is geen geldige afbeelding' });
  }
  const url = `https://veramiek.nl/api/uploads/${req.file.filename}`;
  res.json({ url });
});

// ── Bestelling e-mail (bestaand) ──
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@veramiek.nl';
const FROM_EMAIL = process.env.FROM_EMAIL || CONTACT_EMAIL;

function mailFrom(label) {
  return '"' + label + '" <' + FROM_EMAIL + '>';
}

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu', port: 587, secure: false, requireTLS: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

function buildVeraEmail({ naam, email, tel, adres, items, totaal }) {
  const rows = items.map(item => {
    const img = item.images && item.images[0] ? imgUrl(item.images[0]) : null;
    return `
      <tr style="border-bottom:1px solid #ede5db;">
        <td style="padding:12px 8px;">
          ${img ? `<img src="${img}" width="72" height="72" style="display:block;border-radius:3px;object-fit:cover;" />` : '<div style="width:72px;height:72px;background:#f0e8e0;border-radius:3px;"></div>'}
        </td>
        <td style="padding:12px 8px;font-family:Georgia,serif;color:#5c3d2e;font-size:15px;">${escapeHtml(item.name)}</td>
        <td style="padding:12px 8px;text-align:center;color:#7a6259;font-size:14px;">×${escapeHtml(item.qty)}</td>
        <td style="padding:12px 8px;text-align:right;color:#5c3d2e;font-size:14px;font-weight:bold;">${escapeHtml(item.subtotal)}</td>
      </tr>`;
  }).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:4px;overflow:hidden;border:1px solid #ede5db;">
  <tr><td style="background:#c2714f;padding:28px 40px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,serif;color:white;font-size:26px;letter-spacing:3px;">VERAMIEK</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:12px;letter-spacing:1px;">HANDGEMAAKT KERAMIEK</p>
  </td></tr>
  <tr><td style="padding:28px 40px 16px;border-bottom:1px solid #f0e8e0;">
    <h2 style="margin:0 0 6px;color:#5c3d2e;font-family:Georgia,serif;font-size:21px;">Nieuwe bestelling</h2>
    <p style="margin:0;color:#7a6259;font-size:13px;">Er is een nieuwe bestelling binnengekomen via veramiek.nl</p>
  </td></tr>
  <tr><td style="padding:24px 40px 8px;">
    <h3 style="margin:0 0 10px;color:#5c3d2e;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Klantgegevens</h3>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#2d1f17;">
      <tr><td style="padding:3px 0;color:#7a6259;width:90px;">Naam</td><td style="padding:3px 0;font-weight:bold;">${escapeHtml(naam)}</td></tr>
      <tr><td style="padding:3px 0;color:#7a6259;">E-mail</td><td style="padding:3px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#c2714f;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:3px 0;color:#7a6259;">Telefoon</td><td style="padding:3px 0;">${escapeHtml(tel)}</td></tr>
      <tr><td style="padding:3px 0;color:#7a6259;">Adres</td><td style="padding:3px 0;">${escapeHtml(adres)}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:8px 40px 28px;">
    <h3 style="margin:0 0 10px;color:#5c3d2e;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Bestelling</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border-radius:3px;border:1px solid #ede5db;">
      ${rows}
      <tr style="background:#f5f0e8;">
        <td colspan="3" style="padding:12px 8px;font-family:Georgia,serif;color:#5c3d2e;font-weight:bold;font-size:15px;">Totaal</td>
        <td style="padding:12px 8px;text-align:right;font-family:Georgia,serif;color:#c2714f;font-weight:bold;font-size:20px;">${totaal}</td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="background:#f5f0e8;padding:18px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#7a6259;">veramiek.nl · info@veramiek.nl</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

function buildBuyerEmail({ naam, items, totaal }) {
  const hero = items.find(i => i.images && i.images[0]);
  const heroSrc = hero ? imgUrl(hero.images[0]) : null;
  const rows = items.map(item => {
    const img = item.images && item.images[0] ? imgUrl(item.images[0]) : null;
    return `
    <tr style="border-bottom:1px solid #ede5db;">
      <td style="padding:10px 8px;">
        ${img ? `<img src="${img}" width="56" height="56" style="display:block;border-radius:3px;object-fit:cover;" />` : '<div style="width:56px;height:56px;background:#f0e8e0;border-radius:3px;"></div>'}
      </td>
      <td style="padding:10px 8px;font-family:Georgia,serif;color:#5c3d2e;font-size:14px;">${escapeHtml(item.name)}</td>
      <td style="padding:10px 8px;text-align:center;color:#7a6259;font-size:13px;">×${escapeHtml(item.qty)}</td>
      <td style="padding:10px 8px;text-align:right;color:#5c3d2e;font-size:14px;">${escapeHtml(item.subtotal)}</td>
    </tr>`;
  }).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:4px;overflow:hidden;border:1px solid #ede5db;">
  <tr><td style="background:#c2714f;padding:28px 40px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,serif;color:white;font-size:26px;letter-spacing:3px;">VERAMIEK</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:12px;letter-spacing:1px;">HANDGEMAAKT KERAMIEK</p>
  </td></tr>
  ${heroSrc ? `<tr><td style="padding:0;"><img src="${heroSrc}" width="600" style="display:block;width:100%;height:220px;object-fit:cover;" /></td></tr>` : ''}
  <tr><td style="padding:32px 40px 20px;">
    <h2 style="margin:0 0 12px;color:#5c3d2e;font-family:Georgia,serif;font-size:22px;">Bedankt voor je bestelling, ${escapeHtml(naam)}!</h2>
    <p style="margin:0;color:#7a6259;font-size:14px;line-height:1.8;">Je bestelling is goed ontvangen. Vera neemt zo snel mogelijk contact op om de bestelling te bevestigen.</p>
  </td></tr>
  <tr><td style="padding:0 40px 32px;">
    <h3 style="margin:0 0 10px;color:#5c3d2e;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Jouw bestelling</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #ede5db;">
      ${rows}
      <tr>
        <td style="padding:12px 0;font-family:Georgia,serif;color:#5c3d2e;font-weight:bold;" colspan="2">Totaal</td>
        <td style="padding:12px 0;text-align:right;font-family:Georgia,serif;color:#c2714f;font-weight:bold;font-size:19px;">${totaal}</td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="background:#f5f0e8;padding:22px 40px;text-align:center;">
    <p style="margin:0 0 6px;color:#5c3d2e;font-family:Georgia,serif;font-style:italic;font-size:14px;">Met liefde gemaakt, met zorg verstuurd.</p>
    <p style="margin:0;font-size:12px;color:#7a6259;">veramiek.nl · info@veramiek.nl</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

app.post('/send-contact', contactLimit, async (req, res) => {
  try {
    const { naam, email, onderwerp, bericht, website } = req.body;
    if (website) return res.json({ ok: true }); // honeypot
    if (!naam || !email || !bericht) {
      return res.status(400).json({ error: 'Ontbrekende velden' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Ongeldig e-mailadres' });
    if (String(naam).length > 100 || String(bericht).length > 5000) return res.status(400).json({ error: 'Invoer te lang' });
    await transporter.sendMail({
      from: mailFrom('Veramiek Website'),
      replyTo: email,
      to: CONTACT_EMAIL,
      subject: `Nieuw bericht van ${mailHeader(naam)}`,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:4px;overflow:hidden;border:1px solid #ede5db;">
  <tr><td style="background:#c2714f;padding:24px 40px;">
    <h1 style="margin:0;font-family:Georgia,serif;color:white;font-size:22px;letter-spacing:3px;">VERAMIEK</h1>
  </td></tr>
  <tr><td style="padding:28px 40px;">
    <h2 style="margin:0 0 20px;color:#5c3d2e;font-family:Georgia,serif;font-size:18px;">Nieuw contactbericht</h2>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#2d1f17;margin-bottom:20px;">
      <tr><td style="padding:4px 0;color:#7a6259;width:90px;">Naam</td><td style="padding:4px 0;font-weight:bold;">${escapeHtml(naam)}</td></tr>
      <tr><td style="padding:4px 0;color:#7a6259;">E-mail</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#c2714f;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:4px 0;color:#7a6259;">Onderwerp</td><td style="padding:4px 0;">${escapeHtml(onderwerp || '(geen)')}</td></tr>
    </table>
    <div style="background:#faf7f2;border-left:3px solid #c2714f;padding:14px 18px;font-size:14px;color:#2d1f17;line-height:1.7;white-space:pre-wrap;">${escapeHtml(bericht)}</div>
  </td></tr>
  <tr><td style="background:#f5f0e8;padding:16px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#7a6259;">veramiek.nl · info@veramiek.nl</p>
  </td></tr>
</table></td></tr></table>
</body></html>`
    });
    await transporter.sendMail({
      from: mailFrom('Vera, Veramiek'),
      replyTo: CONTACT_EMAIL,
      to: email,
      subject: `Bedankt voor je bericht, ${mailHeader(naam)}!`,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:4px;overflow:hidden;border:1px solid #ede5db;">
  <tr><td style="background:#c2714f;padding:24px 40px;">
    <h1 style="margin:0;font-family:Georgia,serif;color:white;font-size:22px;letter-spacing:3px;">VERAMIEK</h1>
  </td></tr>
  <tr><td style="padding:32px 40px;">
    <h2 style="margin:0 0 12px;color:#5c3d2e;font-family:Georgia,serif;font-size:20px;">Bedankt voor je bericht!</h2>
    <p style="margin:0 0 16px;color:#7a6259;font-size:14px;line-height:1.8;">Hoi ${escapeHtml(naam)}, ik heb je bericht goed ontvangen. Ik neem zo snel mogelijk contact met je op, doorgaans binnen 1 à 2 werkdagen.</p>
    <div style="background:#faf7f2;border-left:3px solid #c2714f;padding:14px 18px;font-size:13px;color:#7a6259;line-height:1.7;white-space:pre-wrap;">${escapeHtml(bericht)}</div>
  </td></tr>
  <tr><td style="background:#f5f0e8;padding:18px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#5c3d2e;">Met liefde gemaakt in Etten-Leur</p>
    <p style="margin:0;font-size:12px;color:#7a6259;">veramiek.nl · info@veramiek.nl</p>
  </td></tr>
</table></td></tr></table>
</body></html>`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mail mislukt' });
  }
});

app.post('/send-order', orderLimit, async (req, res) => {
  try {
    const { naam, email, tel, adres, items, totaal } = req.body;
    if (!naam || !email || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Ontbrekende velden' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Ongeldig e-mailadres' });
    if (items.length > 50) return res.status(400).json({ error: 'Te veel producten' });
    await transporter.sendMail({
      from: mailFrom('Veramiek Webshop'),
      replyTo: CONTACT_EMAIL,
      to: CONTACT_EMAIL,
      subject: `Nieuwe bestelling van ${mailHeader(naam)}`,
      html: buildVeraEmail({ naam, email, tel, adres, items, totaal }),
    });
    await transporter.sendMail({
      from: mailFrom('Vera, Veramiek'),
      replyTo: CONTACT_EMAIL,
      to: email,
      subject: 'Bedankt voor je bestelling bij Veramiek!',
      html: buildBuyerEmail({ naam, items, totaal }),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mail mislukt' });
  }
});

// ── Workshops & boekingen ──

/** Vandaag als YYYY-MM-DD in de Nederlandse tijdzone. */
function todayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());
}
function isValidDateStr(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
/** YYYY-MM-DD → DD/MM/YYYY (huisstijl-datumnotatie). */
function nlDate(s) {
  const [y, m, d] = String(s).split('-');
  return `${d}/${m}/${y}`;
}
/** Zelfde, maar met een nette fallback als er nog geen voorkeursdatum is. */
function nlDateOrOverleg(s) {
  return s ? nlDate(s) : 'Nog in overleg';
}

/** Escapet tekst voor een .ics-veld. */
function icsEscape(s) {
  return String(s ?? '')
    .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}
/** Volgende dag als YYYYMMDD (all-day DTEND is exclusief). */
function icsNextDay(datum) {
  const [y, m, d] = datum.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '');
}
/** Bouwt een all-day .ics-agenda-item voor een workshopboeking. */
function buildIcs({ uid, datum, summary, description }) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Veramiek//Boeking//NL',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${uid}`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${datum.replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${icsNextDay(datum)}`,
    `SUMMARY:${icsEscape(summary)}`, `DESCRIPTION:${icsEscape(description)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}

function bookingShell(inner) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:4px;overflow:hidden;border:1px solid #ede5db;">
  <tr><td style="background:#c2714f;padding:28px 40px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,serif;color:white;font-size:26px;letter-spacing:3px;">VERAMIEK</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:12px;letter-spacing:1px;">HANDGEMAAKT KERAMIEK</p>
  </td></tr>
  ${inner}
  <tr><td style="background:#f5f0e8;padding:18px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#7a6259;">veramiek.nl · info@veramiek.nl</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}
function detailRows(pairs) {
  return pairs.map(([k, v]) =>
    `<tr><td style="padding:4px 0;color:#7a6259;width:130px;">${escapeHtml(k)}</td><td style="padding:4px 0;font-weight:bold;color:#2d1f17;">${escapeHtml(v)}</td></tr>`
  ).join('');
}
function buildVeraBookingEmail(b) {
  return bookingShell(`
  <tr><td style="padding:28px 40px 8px;">
    <h2 style="margin:0 0 16px;color:#5c3d2e;font-family:Georgia,serif;font-size:21px;">Nieuwe workshopaanvraag</h2>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${detailRows([
        ['Workshop', b.workshopName],
        ['Datum', nlDateOrOverleg(b.datum)],
        ['Aantal personen', String(b.aantalPersonen)],
        ['Naam', b.naam],
        ['E-mail', b.email],
        ['Telefoon', b.tel],
      ])}
    </table>
    ${b.bericht ? `<p style="margin:16px 0 0;padding:14px 18px;background:#faf7f2;border:1px solid #ede5db;border-radius:3px;font-size:14px;color:#2d1f17;line-height:1.7;white-space:pre-wrap;">${escapeHtml(b.bericht)}</p>` : ''}
    <p style="margin:18px 0 4px;color:#7a6259;font-size:13px;line-height:1.7;">${b.datum ? 'De aanvraag staat in je agenda (bijlage). ' : ''}Neem contact op met de deelnemer om de datum en tijd te bevestigen.</p>
  </td></tr>`);
}
function buildDeelnemerBookingEmail(b) {
  return bookingShell(`
  <tr><td style="padding:32px 40px 8px;">
    <h2 style="margin:0 0 12px;color:#5c3d2e;font-family:Georgia,serif;font-size:22px;">Je aanvraag is ontvangen, ${escapeHtml(b.naam)}!</h2>
    <p style="margin:0 0 16px;color:#7a6259;font-size:14px;line-height:1.8;">Dankjewel voor je aanvraag voor <strong>${escapeHtml(b.workshopName)}</strong>. Ik neem zo snel mogelijk contact met je op om de datum en tijd definitief te bevestigen.</p>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${detailRows([
        ['Workshop', b.workshopName],
        ['Voorkeursdatum', nlDateOrOverleg(b.datum)],
        ['Aantal personen', String(b.aantalPersonen)],
      ])}
    </table>
    ${b.datum ? '<p style="margin:18px 0 0;color:#7a6259;font-size:13px;line-height:1.7;">In de bijlage vind je een agenda-item zodat je de datum alvast kunt noteren.</p>' : '<p style="margin:18px 0 0;color:#7a6259;font-size:13px;line-height:1.7;">Zodra we een datum hebben afgestemd, ontvang je alsnog een agenda-item.</p>'}
  </td></tr>`);
}

// Publiek: workshoptypes
app.get('/workshops', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(workshops);
});

// Publiek: beschikbaarheid voor een maand (YYYY-MM). Alleen niet-vrije dagen.
app.get('/availability', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  const maand = String(req.query.maand || '');
  if (!/^\d{4}-\d{2}$/.test(maand)) return res.status(400).json({ error: 'Ongeldige maand' });
  const [y, m] = maand.split('-').map(Number);
  const days = new Date(y, m, 0).getDate();
  const today = todayStr();
  const result = {};
  for (let d = 1; d <= days; d++) {
    const date = `${maand}-${String(d).padStart(2, '0')}`;
    if (date < today) result[date] = 'blocked';
  }
  for (const date of blockedDates) {
    if (date.startsWith(maand)) result[date] = 'blocked';
  }
  for (const b of bookings) {
    if (b.status !== 'cancelled' && b.datum.startsWith(maand) && result[b.datum] !== 'blocked') {
      result[b.datum] = 'full';
    }
  }
  res.json(result);
});

// Publiek: boekingsaanvraag
app.post('/book', bookLimit, async (req, res) => {
  try {
    const { workshopId, datum, naam, email, tel, aantalPersonen, bericht, website } = req.body || {};
    if (website) return res.json({ ok: true }); // honeypot
    if (!workshopId || !naam || !email || !tel || !aantalPersonen) {
      return res.status(400).json({ error: 'Vul alle verplichte velden in' });
    }
    const workshop = workshops.find(w => w.id === workshopId);
    if (!workshop) return res.status(400).json({ error: 'Onbekende workshop' });
    // Datum is optioneel: een aanvrager mag ook zonder voorkeursdatum aanvragen.
    if (datum) {
      if (!isValidDateStr(datum) || datum < todayStr()) {
        return res.status(400).json({ error: 'Kies een geldige datum' });
      }
      if (blockedDates.includes(datum) || bookings.some(b => b.status !== 'cancelled' && b.datum === datum)) {
        return res.status(409).json({ error: 'Deze datum is niet meer beschikbaar' });
      }
    }
    const aantal = Number(aantalPersonen);
    if (!Number.isInteger(aantal) || aantal < 1 || aantal > 50) {
      return res.status(400).json({ error: 'Ongeldig aantal personen' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Ongeldig e-mailadres' });
    if (String(naam).length > 100 || String(bericht || '').length > 2000) {
      return res.status(400).json({ error: 'Invoer te lang' });
    }

    const booking = {
      id: crypto.randomUUID(),
      workshopId,
      workshopName: workshop.name,
      datum: datum || '',
      naam: String(naam).trim(),
      email: String(email).trim(),
      tel: String(tel).trim(),
      aantalPersonen: aantal,
      bericht: String(bericht || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    saveBookings();

    // Mail Vera + deelnemer, met een .ics-agenda-item als er al een datum is (best effort).
    try {
      const attachments = booking.datum ? [{
        filename: 'workshop-veramiek.ics',
        content: buildIcs({
          uid: `${booking.id}@veramiek.nl`,
          datum: booking.datum,
          summary: `Workshop: ${workshop.name}`,
          description: `${aantal} personen. Aangevraagd door ${booking.naam} (${booking.email}, ${booking.tel}).`,
        }),
        contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
      }] : [];
      await transporter.sendMail({
        from: mailFrom('Veramiek Workshops'),
        replyTo: booking.email,
        to: CONTACT_EMAIL,
        subject: `Nieuwe workshopaanvraag van ${mailHeader(booking.naam)}`,
        html: buildVeraBookingEmail(booking),
        attachments,
      });
      await transporter.sendMail({
        from: mailFrom('Vera, Veramiek'),
        replyTo: CONTACT_EMAIL,
        to: booking.email,
        subject: 'Je workshopaanvraag bij Veramiek',
        html: buildDeelnemerBookingEmail(booking),
        attachments,
      });
    } catch (mailErr) {
      console.error('[Boeking] mail mislukt, boeking wel opgeslagen:', mailErr.message);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Aanvraag mislukt' });
  }
});

// ── Admin: workshops CRUD ──
app.get('/admin/workshops', auth, (req, res) => res.json(workshops));
app.post('/admin/workshops', auth, (req, res) => {
  const { name, desc, duration, groupSize, price, images } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Naam is verplicht' });
  const w = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    desc: String(desc || '').trim(),
    duration: String(duration || '').trim(),
    groupSize: String(groupSize || '').trim(),
    price: String(price || '').trim(),
    images: Array.isArray(images) ? images.filter(u => typeof u === 'string') : [],
  };
  workshops.push(w);
  saveWorkshops();
  res.json(w);
});
app.put('/admin/workshops/:id', auth, (req, res) => {
  const idx = workshops.findIndex(w => w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Workshop niet gevonden' });
  const { name, desc, duration, groupSize, price, images } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Naam is verplicht' });
  workshops[idx] = {
    id: workshops[idx].id,
    name: String(name).trim(),
    desc: String(desc || '').trim(),
    duration: String(duration || '').trim(),
    groupSize: String(groupSize || '').trim(),
    price: String(price || '').trim(),
    images: Array.isArray(images) ? images.filter(u => typeof u === 'string') : [],
  };
  saveWorkshops();
  res.json(workshops[idx]);
});
app.delete('/admin/workshops/:id', auth, (req, res) => {
  const idx = workshops.findIndex(w => w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Workshop niet gevonden' });
  workshops.splice(idx, 1);
  saveWorkshops();
  res.json({ ok: true });
});

// ── Admin: boekingen ──
app.get('/admin/bookings', auth, (req, res) => {
  res.json([...bookings].sort((a, b) => (a.datum < b.datum ? -1 : 1)));
});
app.put('/admin/bookings/:id', auth, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Boeking niet gevonden' });
  const { status } = req.body || {};
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Ongeldige status' });
  }
  booking.status = status;
  saveBookings();
  res.json(booking);
});
app.delete('/admin/bookings/:id', auth, (req, res) => {
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Boeking niet gevonden' });
  bookings.splice(idx, 1);
  saveBookings();
  res.json({ ok: true });
});

// ── Admin: geblokkeerde datums ──
app.get('/admin/blocked-dates', auth, (req, res) => res.json([...blockedDates].sort()));
app.post('/admin/blocked-dates', auth, (req, res) => {
  const { date } = req.body || {};
  if (!isValidDateStr(date)) return res.status(400).json({ error: 'Ongeldige datum' });
  if (!blockedDates.includes(date)) {
    blockedDates.push(date);
    saveBlocked();
  }
  res.json({ ok: true, blockedDates: [...blockedDates].sort() });
});
app.delete('/admin/blocked-dates/:date', auth, (req, res) => {
  const date = req.params.date;
  const idx = blockedDates.indexOf(date);
  if (idx !== -1) {
    blockedDates.splice(idx, 1);
    saveBlocked();
  }
  res.json({ ok: true, blockedDates: [...blockedDates].sort() });
});

// ── Global error handler (prevents stack trace leakage to clients) ──
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Error]', err.message, err.stack);
  // Multer errors (file type, size)
  if (err.name === 'MulterError' || (err.message && (err.message.includes('afbeeldingen') || err.message.includes('SVG')))) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Er is een interne fout opgetreden' });
});

app.listen(3001, () => console.log('Veramiek API op poort 3001'));
