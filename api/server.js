const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: ['https://veramiek.nl', 'http://localhost:8082'] }));

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function imgUrl(path) {
  return 'https://veramiek.nl/' + path.split('/').map(encodeURIComponent).join('/');
}

function buildVeraEmail({ naam, email, tel, adres, items, totaal }) {
  const rows = items.map(item => {
    const img = item.images && item.images[0] ? imgUrl(item.images[0]) : null;
    return `
      <tr style="border-bottom:1px solid #ede5db;">
        <td style="padding:12px 8px;">
          ${img ? `<img src="${img}" width="72" height="72" style="display:block;border-radius:3px;object-fit:cover;" />` : '<div style="width:72px;height:72px;background:#f0e8e0;border-radius:3px;"></div>'}
        </td>
        <td style="padding:12px 8px;font-family:Georgia,serif;color:#5c3d2e;font-size:15px;">${item.name}</td>
        <td style="padding:12px 8px;text-align:center;color:#7a6259;font-size:14px;">×${item.qty}</td>
        <td style="padding:12px 8px;text-align:right;color:#5c3d2e;font-size:14px;font-weight:bold;">${item.subtotal}</td>
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
      <tr><td style="padding:3px 0;color:#7a6259;width:90px;">Naam</td><td style="padding:3px 0;font-weight:bold;">${naam}</td></tr>
      <tr><td style="padding:3px 0;color:#7a6259;">E-mail</td><td style="padding:3px 0;"><a href="mailto:${email}" style="color:#c2714f;text-decoration:none;">${email}</a></td></tr>
      <tr><td style="padding:3px 0;color:#7a6259;">Telefoon</td><td style="padding:3px 0;">${tel}</td></tr>
      <tr><td style="padding:3px 0;color:#7a6259;">Adres</td><td style="padding:3px 0;">${adres}</td></tr>
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
      <td style="padding:10px 8px;font-family:Georgia,serif;color:#5c3d2e;font-size:14px;">${item.name}</td>
      <td style="padding:10px 8px;text-align:center;color:#7a6259;font-size:13px;">×${item.qty}</td>
      <td style="padding:10px 8px;text-align:right;color:#5c3d2e;font-size:14px;">${item.subtotal}</td>
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
    <h2 style="margin:0 0 12px;color:#5c3d2e;font-family:Georgia,serif;font-size:22px;">Bedankt voor je bestelling, ${naam}!</h2>
    <p style="margin:0;color:#7a6259;font-size:14px;line-height:1.8;">Je bestelling is goed ontvangen. Vera neemt zo snel mogelijk contact op om de bestelling te bevestigen en de verdere details te bespreken.</p>
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

app.post('/send-order', async (req, res) => {
  try {
    const { naam, email, tel, adres, items, totaal } = req.body;
    if (!naam || !email || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Ontbrekende velden' });
    }

    await transporter.sendMail({
      from: '"Veramiek Webshop" <info@versodevelopment.nl>',
      replyTo: 'info@veramiek.nl',
      to: 'info@veramiek.nl',
      subject: `Nieuwe bestelling — ${naam}`,
      html: buildVeraEmail({ naam, email, tel, adres, items, totaal }),
    });

    await transporter.sendMail({
      from: '"Vera — Veramiek" <info@versodevelopment.nl>',
      replyTo: 'info@veramiek.nl',
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

app.listen(3001, () => console.log('Veramiek API op poort 3001'));
