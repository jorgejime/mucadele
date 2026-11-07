const SHIPDAY_API_URL = 'https://api.shipday.com';
const FALLBACK_CARRIER_ID = 565174;

const ADMIN_USER = 'superadmin';
const COOKIE_NAME = 'mucadele_session';

const STORE_CONFIG = {
  name: 'mucadele licores',
  address: 'Calle 11 # 24-36, Comuna 3, Santa Marta, Magdalena, Colombia',
  phoneNumber: '+573015153867',
  latitude: 11.24383,
  longitude: -74.186437,
};

const DEFAULT_CATALOG = [
  {
    id: 'old-parr-750',
    name: 'Whisky Grand Old Parr 12 Años',
    presentation: '750 ml',
    category: 'whisky',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp?v=639276028110300000',
    price: 155000,
    stock: 18,
    active: 1,
    sort_order: 1,
  },
  {
    id: 'buchanans-12-750',
    name: "Whisky Buchanan's Deluxe 12 Años",
    presentation: '750 ml',
    category: 'whisky',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/2491968/50196388_0_14bead8550d247018c4d7aa5728fc4c6.webp?v=639276026588630000',
    price: 165000,
    stock: 15,
    active: 1,
    sort_order: 2,
  },
  {
    id: 'buchanans-master-750',
    name: "Whisky Buchanan's Master",
    presentation: '750 ml',
    category: 'whisky',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1487836/5000196003774.jpg?v=639288769910600000',
    price: 195000,
    stock: 12,
    active: 1,
    sort_order: 3,
  },
  {
    id: 'jw-black-750',
    name: 'Johnnie Walker Black Label 12 Años',
    presentation: '700 ml',
    category: 'whisky',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1899170/5000267024233.jpg?v=638893187170930000',
    price: 160000,
    stock: 14,
    active: 1,
    sort_order: 4,
  },
  {
    id: 'antioqueno-azul-750',
    name: 'Aguardiente Antioqueño Tapa Azul',
    presentation: '750 ml · Sin Azúcar',
    category: 'aguardiente-ron',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1852397/7702049000531.jpg.jpg?v=638823121798000000',
    price: 54000,
    stock: 36,
    active: 1,
    sort_order: 5,
  },
  {
    id: 'antioqueno-verde-750',
    name: 'Aguardiente Antioqueño Tapa Verde',
    presentation: '750 ml · 24°',
    category: 'aguardiente-ron',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1853169/7702049000432.jpg.jpg?v=638827899043330000',
    price: 52000,
    stock: 30,
    active: 1,
    sort_order: 6,
  },
  {
    id: 'ron-medellin-8-750',
    name: 'Ron Medellín Dorado Añejo',
    presentation: '750 ml',
    category: 'aguardiente-ron',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1853195/7702049101207.jpg.jpg?v=638827906671570000',
    price: 68000,
    stock: 24,
    active: 1,
    sort_order: 7,
  },
  {
    id: 'ron-caldas-trad-750',
    name: 'Ron Viejo de Caldas Tradicional',
    presentation: '750 ml',
    category: 'aguardiente-ron',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1490643/7702168217308.jpg?v=638629671282630000',
    price: 58000,
    stock: 28,
    active: 1,
    sort_order: 8,
  },
  {
    id: 'six-club-dorada',
    name: 'Six Pack Club Colombia Dorada',
    presentation: '6 Latas x 330 ml',
    category: 'cervezas',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1240194/Club-Colombia-Dorada.png?v=638368846733330000',
    price: 26000,
    stock: 48,
    active: 1,
    sort_order: 9,
  },
  {
    id: 'six-aguila-orig',
    name: 'Six Pack Cerveza Águila Original',
    presentation: '6 Latas x 330 ml',
    category: 'cervezas',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/916454/7702004001917.jpg?v=638827404204930000',
    price: 23000,
    stock: 60,
    active: 1,
    sort_order: 10,
  },
  {
    id: 'six-corona-botella',
    name: 'Six Pack Corona Extra',
    presentation: '6 Unidades x 269 ml',
    category: 'cervezas',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1050576/7702004111043.png?v=638127541504870000',
    price: 36000,
    stock: 40,
    active: 1,
    sort_order: 11,
  },
  {
    id: 'jose-cuervo-750',
    name: 'Tequila José Cuervo Especial',
    presentation: '750 ml',
    category: 'otros',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1601267/7501035010109.jpg?v=638816199752230000',
    price: 105000,
    stock: 16,
    active: 1,
    sort_order: 12,
  },
  {
    id: 'don-julio-700',
    name: 'Tequila Don Julio Blanco',
    presentation: 'Botella',
    category: 'otros',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/2500354/2339726_a--1-.png?v=639280452157070000',
    price: 245000,
    stock: 8,
    active: 1,
    sort_order: 13,
  },
  {
    id: 'absolut-750',
    name: 'Vodka Absolut Original',
    presentation: 'Botella',
    category: 'otros',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/642412/7312040017355.jpg?v=638816375335770000',
    price: 92000,
    stock: 18,
    active: 1,
    sort_order: 14,
  },
  {
    id: 'combo-hielo-bretana',
    name: 'Hielo 3kg + 4 Sodas Bretaña',
    presentation: 'Combo Pasante',
    category: 'otros',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg?v=638521688233030000',
    price: 18000,
    stock: 50,
    active: 1,
    sort_order: 15,
  },
  {
    id: 'gatorade-coca',
    name: 'Coca-Cola 1.5L Fría',
    presentation: '1.5 Litros',
    category: 'otros',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/2433580/7702535011799_0.jpg?v=639215717135530000',
    price: 8500,
    stock: 45,
    active: 1,
    sort_order: 16,
  },
  {
    id: 'combo-guaro-agua',
    name: 'Combo Parrandero: Aguardiente + Agua 1.5L',
    presentation: 'Antioqueño Azul 750ml + Agua Fría 1.5L',
    category: 'combos',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1852397/7702049000531.jpg.jpg?v=638823121798000000',
    price: 52000,
    originalPrice: 58000,
    discountSavings: 6000,
    stock: 25,
    active: 1,
    sort_order: 17,
  },
  {
    id: 'combo-mami-cerveza',
    name: "Combo 'Mami': Ron Medellín + Six Pack Águila",
    presentation: 'Ron Dorado 750ml + 6 Latas Águila Frías',
    category: 'combos',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1853195/7702049101207.jpg.jpg?v=638827906671570000',
    price: 82000,
    originalPrice: 91000,
    discountSavings: 9000,
    stock: 20,
    active: 1,
    sort_order: 18,
  },
  {
    id: 'combo-hielo-vaper',
    name: 'Combo After: Hielo 3kg + Vaper 5000 Puffs',
    presentation: 'Bolsa Hielo 3kg + Vaper Desechable Frutal',
    category: 'combos',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/1431489/7702090020847.jpg?v=638521688233030000',
    price: 36000,
    originalPrice: 44000,
    discountSavings: 8000,
    stock: 30,
    active: 1,
    sort_order: 19,
  },
  {
    id: 'combo-oldparr-hielo',
    name: 'Combo VIP: Whisky Old Parr 12 + Hielo + 2 Sodas',
    presentation: '750ml + Hielo 3kg + 2 Sodas Bretaña',
    category: 'combos',
    imageUrl: 'https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp?v=639276028110300000',
    price: 159000,
    originalPrice: 173000,
    discountSavings: 14000,
    stock: 15,
    active: 1,
    sort_order: 20,
  },
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.shipday.com https://api.cloudflare.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function withSecurityHeaders(response) {
  if (!response) return response;
  const newHeaders = new Headers(response.headers);
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, val);
    }
  }
  const status = response.status;
  const hasNoBody = status === 204 || status === 205 || status === 304;
  return new Response(hasNoBody ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

// --- Rate Limiting para Login y Autenticación (5 intentos por 15 min) ---
const loginAttemptsMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

async function checkLoginRateLimit(ip, env) {
  const now = Date.now();

  // 1. Check in-memory map
  const record = loginAttemptsMap.get(ip);
  if (record) {
    if (record.blockedUntil && now < record.blockedUntil) {
      return { allowed: false, remainingMs: record.blockedUntil - now };
    }
    if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
      loginAttemptsMap.delete(ip);
    } else if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
      return { allowed: false, remainingMs: RATE_LIMIT_WINDOW_MS };
    }
  }

  // 2. Check D1 distributed store
  if (env && env.DB) {
    try {
      const row = await env.DB.prepare(
        'SELECT count, first_attempt, blocked_until FROM rate_limits WHERE key = ?'
      ).bind(`login:${ip}`).first();
      if (row) {
        if (row.blocked_until && now < row.blocked_until) {
          return { allowed: false, remainingMs: row.blocked_until - now };
        }
        if (now - row.first_attempt > RATE_LIMIT_WINDOW_MS) {
          await env.DB.prepare('DELETE FROM rate_limits WHERE key = ?').bind(`login:${ip}`).run();
        } else if (row.count >= MAX_FAILED_ATTEMPTS) {
          await env.DB.prepare(
            'UPDATE rate_limits SET blocked_until = ? WHERE key = ?'
          ).bind(now + RATE_LIMIT_WINDOW_MS, `login:${ip}`).run();
          return { allowed: false, remainingMs: RATE_LIMIT_WINDOW_MS };
        }
      }
    } catch {
      // Fallback a mapa en memoria si D1 no responde
    }
  }

  return { allowed: true };
}

async function recordFailedLogin(ip, env) {
  const now = Date.now();

  // 1. Update in-memory map
  let record = loginAttemptsMap.get(ip);
  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, firstAttempt: now, blockedUntil: 0 };
    loginAttemptsMap.set(ip, record);
  } else {
    record.count += 1;
    if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    }
  }

  // 2. Update D1 distributed store
  if (env && env.DB) {
    try {
      const row = await env.DB.prepare(
        'SELECT count, first_attempt FROM rate_limits WHERE key = ?'
      ).bind(`login:${ip}`).first();

      if (!row || now - row.first_attempt > RATE_LIMIT_WINDOW_MS) {
        await env.DB.prepare(
          'INSERT OR REPLACE INTO rate_limits (key, count, first_attempt, blocked_until) VALUES (?, 1, ?, 0)'
        ).bind(`login:${ip}`, now).run();
      } else {
        const newCount = row.count + 1;
        const blockedUntil = newCount >= MAX_FAILED_ATTEMPTS ? now + RATE_LIMIT_WINDOW_MS : 0;
        await env.DB.prepare(
          'UPDATE rate_limits SET count = ?, blocked_until = ? WHERE key = ?'
        ).bind(newCount, blockedUntil, `login:${ip}`).run();
      }
    } catch {
      // Fallback silencioso si D1 no está configurado
    }
  }
}

async function resetLoginRateLimit(ip, env) {
  if (env && env.DB) {
    try {
      await env.DB.prepare('DELETE FROM rate_limits WHERE key = ?').bind(`login:${ip}`).run();
    } catch {}
  }
  loginAttemptsMap.delete(ip);
}

// --- Comparación en tiempo constante y utilidades de saneamiento ---
async function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);
  const hashA = new Uint8Array(await crypto.subtle.digest('SHA-256', aBuf));
  const hashB = new Uint8Array(await crypto.subtle.digest('SHA-256', bBuf));

  if (crypto?.subtle?.timingSafeEqual) {
    try {
      return crypto.subtle.timingSafeEqual(hashA, hashB);
    } catch {}
  }
  if (crypto?.timingSafeEqual) {
    try {
      return crypto.timingSafeEqual(hashA, hashB);
    } catch {}
  }
  let diff = 0;
  for (let i = 0; i < hashA.length; i++) {
    diff |= hashA[i] ^ hashB[i];
  }
  return diff === 0;
}

function sanitizeRedirectPath(target, fallback = '/admin.html') {
  if (!target || typeof target !== 'string') return fallback;
  const trimmed = target.trim().replace(/[\r\n\t]/g, '');
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes(':') ||
    trimmed.includes('\\')
  ) {
    return fallback;
  }
  if (!/^\/[a-zA-Z0-9_\-\./?=&%#]*$/.test(trimmed)) {
    return fallback;
  }
  return trimmed;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// --- Firma y Verificación HMAC-SHA256 ---
async function signToken(username, env) {
  const secret = (env && env.TOKEN_SECRET) || '';
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${username}:${exp}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return btoa(`${payload}:${sigHex}`);
}

async function verifyRawToken(token, env) {
  if (!token) return null;
  const secret = (env && env.TOKEN_SECRET) || '';
  if (!secret) return null;
  try {
    const decoded = atob(token);
    const [username, expStr, sigHex] = decoded.split(':');
    if (!username || !expStr || !sigHex) return null;
    if (Date.now() > Number(expStr)) return null;

    const payload = `${username}:${expStr}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
    const expectedHex = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const expectedBytes = enc.encode(expectedHex);
    const sigBytes = enc.encode(sigHex);
    if (expectedBytes.byteLength !== sigBytes.byteLength) return null;

    let isMatch = false;
    if (crypto?.subtle?.timingSafeEqual) {
      try {
        isMatch = crypto.subtle.timingSafeEqual(expectedBytes, sigBytes);
      } catch {}
    }
    if (!isMatch && crypto?.timingSafeEqual) {
      try {
        isMatch = crypto.timingSafeEqual(expectedBytes, sigBytes);
      } catch {}
    }
    if (!isMatch) {
      let diff = 0;
      for (let i = 0; i < expectedBytes.length; i++) {
        diff |= expectedBytes[i] ^ sigBytes[i];
      }
      isMatch = diff === 0;
    }
    if (!isMatch) return null;
    return username;
  } catch {
    return null;
  }
}

function getCookieValue(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return '';
}

async function verifySession(request, env) {
  // 1. Verificar Cookie HttpOnly (prioritario)
  const cookieToken = getCookieValue(request, COOKIE_NAME);
  if (cookieToken) {
    const user = await verifyRawToken(cookieToken, env);
    if (user) return user;
  }
  // 2. Fallback a cabecera Authorization: Bearer
  const authHeader = request.headers.get('Authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (bearerToken) {
    return await verifyRawToken(bearerToken, env);
  }
  return null;
}


// --- Pantalla de Login Renderizada en Servidor (Nadie sin sesión ve el código del Admin/POS) ---
function renderServerLoginPage(redirectTo = '/admin.html', errorMsg = '', customStatus = null) {
  const html = `<!DOCTYPE html>
<html lang="es-CO">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso Administrativo · Mucadele Licores</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FFFFFF;
      --surface: #F5F5F7;
      --border: #E5E5EA;
      --text: #111111;
      --muted: #52525B;
      --action: #00A844;
      --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      padding: 1.25rem;
      background: var(--surface);
      color: var(--text);
      font-family: var(--font);
      -webkit-font-smoothing: antialiased;
    }
    .login-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem 1.75rem;
      width: 100%;
      max-width: 400px;
    }
    .badge {
      display: inline-block;
      background: var(--text);
      color: var(--bg);
      font-size: 0.74rem;
      font-weight: 800;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      letter-spacing: 0.04em;
      margin-bottom: 0.6rem;
    }
    h1 {
      margin: 0 0 0.35rem 0;
      font-size: 1.35rem;
      font-weight: 800;
    }
    p.sub {
      margin: 0 0 1.35rem 0;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.45;
    }
    form {
      display: grid;
      gap: 0.95rem;
    }
    label {
      display: block;
      font-size: 0.84rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }
    input[type="text"],
    input[type="password"] {
      width: 100%;
      height: 46px;
      padding: 0 0.9rem;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      font-family: var(--font);
      font-size: 1rem;
      color: var(--text);
      background: var(--bg);
    }
    input:focus {
      outline: none;
      border-color: var(--text);
    }
    .error-banner {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      color: #991B1B;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      font-size: 0.86rem;
      font-weight: 700;
    }
    button.submit-btn {
      height: 48px;
      border: none;
      border-radius: 10px;
      background: var(--action);
      color: #fff;
      font-family: var(--font);
      font-size: 0.98rem;
      font-weight: 800;
      cursor: pointer;
      margin-top: 0.25rem;
    }
    .pass-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .pass-head label { margin: 0; }
    .toggle-btn {
      background: none;
      border: none;
      color: var(--action);
      font-family: var(--font);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }
  </style>
</head>
<body>
  <main class="login-card">
    <span class="badge">ACCESO RESTRINGIDO</span>
    <h1>Mucadele Licores</h1>
    <p class="sub">Consola privada de Administración y Punto de Venta (POS).</p>
    ${errorMsg ? `<div class="error-banner" role="alert">${escapeHtml(errorMsg)}</div>` : ''}
    <form method="POST" action="/api/login">
      <input type="hidden" name="redirect" value="${escapeHtml(sanitizeRedirectPath(redirectTo, '/admin.html'))}">
      <div>
        <label for="username">Usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          autocomplete="username"
          required
          autofocus
        >
      </div>
      <div>
        <div class="pass-head">
          <label for="current-password">Contraseña</label>
          <button type="button" class="toggle-btn" onclick="const p=document.getElementById('current-password');const s=p.type==='password';p.type=s?'text':'password';this.textContent=s?'Ocultar':'Mostrar';">Mostrar</button>
        </div>
        <input
          type="password"
          id="current-password"
          name="password"
          autocomplete="current-password"
          required
        >
      </div>
      <button type="submit" class="submit-btn">Iniciar sesión</button>
    </form>
  </main>
</body>
</html>`;

  const status = customStatus || (errorMsg ? 401 : 200);
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...SECURITY_HEADERS,
    },
  });
}


function formatBogotaDateAndTime(offsetMinutes = 35) {
  const now = new Date(Date.now() + offsetMinutes * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

function normalizeColombianPhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D+/g, '');
  if (!digits) return '+573015153867';
  if (digits.startsWith('57') && digits.length >= 12) {
    return `+${digits}`;
  }
  return `+57${digits.slice(-10)}`;
}

function getShipdayHeaders(env) {
  const apiKey = (env && env.SHIPDAY_API_KEY) || '';
  return {
    Authorization: `Basic ${apiKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

// --- Login Form Handler (/api/login y /api/logout) ---
async function handleServerLogin(request, env) {
  if (request.method !== 'POST') {
    return Response.redirect(new URL('/admin.html', request.url).toString(), 303);
  }

  const clientIp = getClientIp(request);

  let username = '';
  let password = '';
  let redirectTo = '/admin.html';
  let isJsonRequest = false;

  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    isJsonRequest = true;
    const body = await request.json().catch(() => ({}));
    username = String(body.username || '').trim();
    password = String(body.password || '').trim();
    redirectTo = String(body.redirect || '/admin.html');
  } else {
    const formData = await request.formData().catch(() => null);
    if (formData) {
      username = String(formData.get('username') || '').trim();
      password = String(formData.get('password') || '').trim();
      redirectTo = String(formData.get('redirect') || '/admin.html');
    }
  }

  const safeRedirect = sanitizeRedirectPath(redirectTo, '/admin.html');
  const expectedUser = (env && env.ADMIN_USER) || ADMIN_USER;
  const expectedPass = (env && env.ADMIN_PASS) || '';

  const isUserMatch = username === expectedUser;
  const isPassMatch = expectedPass ? await timingSafeEqualString(password, expectedPass) : false;

  if (isUserMatch && isPassMatch) {
    await resetLoginRateLimit(clientIp, env);
    const token = await signToken(expectedUser, env);
    const cookieStr = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
    if (isJsonRequest || request.headers.get('Accept')?.includes('application/json')) {
      return jsonResponse(
        { ok: true, user: expectedUser, token, redirect: safeRedirect },
        200,
        {
          'Set-Cookie': cookieStr,
          Location: safeRedirect,
        }
      );
    }
    return new Response(null, {
      status: 303,
      headers: {
        Location: safeRedirect,
        'Set-Cookie': cookieStr,
        'Cache-Control': 'no-store',
      },
    });
  }

  const rateLimit = await checkLoginRateLimit(clientIp, env);
  if (!rateLimit.allowed) {
    const errorMsg = 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.';
    return jsonResponse({ ok: false, error: errorMsg }, 429, { 'Retry-After': '900' });
  }

  await recordFailedLogin(clientIp, env);
  const errorMsg = 'Usuario o contraseña incorrectos.';
  if (isJsonRequest || request.headers.get('Accept')?.includes('application/json')) {
    return jsonResponse({ ok: false, error: errorMsg }, 401);
  }
  return renderServerLoginPage(safeRedirect, errorMsg, 401);
}

function handleServerLogout(request) {
  const url = new URL(request.url);
  const nextParam = url.searchParams.get('next');
  const safeNext = sanitizeRedirectPath(nextParam, '/admin.html');
  return new Response(null, {
    status: 303,
    headers: {
      Location: safeNext,
      'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
}

// --- JSON Auth Handler (/api/auth) ---
async function handleAuth(request, env) {
  if (request.method === 'GET') {
    const user = await verifySession(request, env);
    if (!user) return jsonResponse({ ok: false, error: 'Sesión no válida o expirada' }, 401);
    return jsonResponse({ ok: true, user });
  }

  if (request.method === 'POST') {
    const clientIp = getClientIp(request);

    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'Solicitud inválida' }, 400);
    }
    const username = String(body.username || '').trim();
    const password = String(body.password || '').trim();

    const expectedUser = (env && env.ADMIN_USER) || ADMIN_USER;
    const expectedPass = (env && env.ADMIN_PASS) || '';

    const isUserMatch = username === expectedUser;
    const isPassMatch = expectedPass ? await timingSafeEqualString(password, expectedPass) : false;

    if (isUserMatch && isPassMatch) {
      await resetLoginRateLimit(clientIp, env);
      const token = await signToken(expectedUser, env);
      const cookieStr = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
      return jsonResponse(
        { ok: true, user: expectedUser, token },
        200,
        { 'Set-Cookie': cookieStr }
      );
    }

    const rateLimit = await checkLoginRateLimit(clientIp, env);
    if (!rateLimit.allowed) {
      return jsonResponse(
        { ok: false, error: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.' },
        429,
        { 'Retry-After': '900' }
      );
    }

    await recordFailedLogin(clientIp, env);
    return jsonResponse({ ok: false, error: 'Usuario o contraseña incorrectos.' }, 401);
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}


// --- Catalog Handler (/api/catalog) ---
async function handleCatalog(request, env) {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === '1';

  // Si pide todos los productos (incluidos los ocultos), exigir sesión de admin
  if (showAll) {
    const user = await verifySession(request, env);
    if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  }

  if (env && env.DB) {
    try {
      const sql = showAll
        ? `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
           FROM products p
           LEFT JOIN suppliers s ON p.supplier_id = s.id
           ORDER BY p.sort_order ASC, p.name ASC`
        : `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
           FROM products p
           LEFT JOIN suppliers s ON p.supplier_id = s.id
           WHERE p.active = 1
           ORDER BY p.sort_order ASC, p.name ASC`;
      const { results } = await env.DB.prepare(sql).all();
      if (results && results.length > 0) {
        return jsonResponse({
          ok: true,
          source: 'd1',
          products: results.map((p) => ({
            id: p.id,
            name: p.name,
            presentation: p.presentation,
            category: p.category,
            imageUrl: p.imageUrl,
            price: Number(p.price),
            stock: Number(p.stock ?? 0),
            min_stock: Number(p.min_stock ?? 6),
            reorder_qty: Number(p.reorder_qty ?? 12),
            supplier_id: p.supplier_id ? Number(p.supplier_id) : null,
            supplier_name: p.supplier_name || 'Sin proveedor asignado',
            supplier_phone: p.supplier_phone || '',
            active: Number(p.active ?? 1) === 1,
            sort_order: Number(p.sort_order ?? 100),
          })),
        });
      }
    } catch {}
  }

  const list = showAll ? DEFAULT_CATALOG : DEFAULT_CATALOG.filter((p) => p.active === 1);
  return jsonResponse({
    ok: true,
    source: 'fallback',
    products: list.map((p) => ({
      ...p,
      min_stock: 6,
      reorder_qty: 12,
      supplier_id: null,
      supplier_name: 'Sin proveedor',
      active: Boolean(p.active),
    })),
  });
}

// --- Auto-generador de Pedido Programado a Proveedor cuando Stock <= Min_Stock ---
async function checkAndTriggerAutoReorder(env, productIds = []) {
  if (!env || !env.DB || !Array.isArray(productIds) || productIds.length === 0) return [];
  const generatedPOs = [];
  try {
    // Obtener órdenes de compra activas ('enviada') para no duplicar pedidos del mismo producto
    const activePOsRes = await env.DB.prepare(
      "SELECT items_json FROM purchase_orders WHERE status = 'enviada'"
    ).all();
    const pendingProductIds = new Set();
    for (const row of activePOsRes.results || []) {
      try {
        const parsed = JSON.parse(row.items_json || '[]');
        for (const it of parsed) {
          if (it.id) pendingProductIds.add(it.id);
        }
      } catch {}
    }

    for (const pid of productIds) {
      if (!pid || pendingProductIds.has(pid)) continue;
      const prod = await env.DB.prepare(
        `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
         FROM products p
         LEFT JOIN suppliers s ON p.supplier_id = s.id
         WHERE p.id = ?`
      )
        .bind(pid)
        .first();

      if (!prod) continue;
      const currentStock = Number(prod.stock ?? 0);
      const minStock = Number(prod.min_stock ?? 6);
      const reorderQty = Math.max(1, Number(prod.reorder_qty ?? 12));

      if (currentStock <= minStock) {
        const poNumber = `OC-AUTO-${Date.now().toString().slice(-6)}`;
        const supplierId = prod.supplier_id ? Number(prod.supplier_id) : null;
        const supplierName = prod.supplier_name || 'Proveedor General';
        const supplierPhone = prod.supplier_phone || '+573015153867';
        const itemsPayload = [
          {
            id: prod.id,
            name: prod.name,
            presentation: prod.presentation,
            current_stock: currentStock,
            min_stock: minStock,
            qty: reorderQty,
          },
        ];

        await env.DB.prepare(
          `INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, supplier_phone, items_json, total_units, status)
           VALUES (?, ?, ?, ?, ?, ?, 'enviada')`
        )
          .bind(
            poNumber,
            supplierId,
            supplierName,
            supplierPhone,
            JSON.stringify(itemsPayload),
            reorderQty
          )
          .run();

        pendingProductIds.add(pid);
        generatedPOs.push({
          poNumber,
          productName: prod.name,
          supplierName,
          qty: reorderQty,
        });
      }
    }
  } catch {}
  return generatedPOs;
}

// --- Admin Products CRUD (/api/admin/products) ---
async function handleAdminProducts(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!env || !env.DB) return jsonResponse({ ok: false, error: 'Base de datos D1 no vinculada.' }, 500);

  const url = new URL(request.url);

  if (request.method === 'DELETE') {
    const id = (url.searchParams.get('id') || '').trim();
    if (!id) return jsonResponse({ ok: false, error: 'Falta el ID del producto a eliminar.' }, 400);
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true, deletedId: id });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  if (request.method === 'PATCH') {
    const id = String(body.id || '').trim();
    if (!id) return jsonResponse({ ok: false, error: 'Falta ID del producto.' }, 400);

    const existing = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ ok: false, error: 'Producto no encontrado.' }, 404);

    const newStock = body.stock !== undefined ? Math.max(0, Number(body.stock) || 0) : existing.stock;
    const newPrice = body.price !== undefined ? Math.max(0, Number(body.price) || 0) : existing.price;
    const newMinStock =
      body.min_stock !== undefined ? Math.max(0, Number(body.min_stock) || 0) : Number(existing.min_stock ?? 6);
    const newReorderQty =
      body.reorder_qty !== undefined ? Math.max(1, Number(body.reorder_qty) || 12) : Number(existing.reorder_qty ?? 12);
    const newSupplierId =
      body.supplier_id !== undefined
        ? body.supplier_id
          ? Number(body.supplier_id)
          : null
        : existing.supplier_id;
    const newActive = body.active !== undefined ? (body.active ? 1 : 0) : existing.active;

    await env.DB.prepare(
      'UPDATE products SET stock = ?, price = ?, min_stock = ?, reorder_qty = ?, supplier_id = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(newStock, newPrice, newMinStock, newReorderQty, newSupplierId, newActive, id)
      .run();

    const autoPOs = await checkAndTriggerAutoReorder(env, [id]);

    const updatedRow = await env.DB.prepare(
      `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone
       FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = ?`
    )
      .bind(id)
      .first();

    return jsonResponse({
      ok: true,
      autoGeneratedPOs: autoPOs,
      product: {
        ...updatedRow,
        stock: Number(updatedRow.stock),
        price: Number(updatedRow.price),
        min_stock: Number(updatedRow.min_stock ?? 6),
        reorder_qty: Number(updatedRow.reorder_qty ?? 12),
        supplier_id: updatedRow.supplier_id ? Number(updatedRow.supplier_id) : null,
        supplier_name: updatedRow.supplier_name || 'Sin proveedor asignado',
        supplier_phone: updatedRow.supplier_phone || '',
        active: Boolean(updatedRow.active),
      },
    });
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const name = String(body.name || '').trim();
    const presentation = String(body.presentation || 'Unidad').trim();
    const category = String(body.category || 'otros').trim();
    const imageUrl =
      String(body.imageUrl || '').trim() ||
      'https://olimpica.vteximg.com.br/arquivos/ids/2492092/5000281003160_cd5cdf6c25ec4403ad9ca386feedb1cd.webp';
    const price = Math.max(0, Number(body.price) || 0);
    const stock = Math.max(0, Number(body.stock ?? 20));
    const minStock = Math.max(0, Number(body.min_stock ?? 6));
    const reorderQty = Math.max(1, Number(body.reorder_qty ?? 12));
    const supplierId = body.supplier_id ? Number(body.supplier_id) : null;
    const active = body.active === false ? 0 : 1;
    const sortOrder = Number(body.sort_order ?? 50);

    if (!name || price <= 0) {
      return jsonResponse({ ok: false, error: 'Nombre y precio mayor a $0 son obligatorios.' }, 400);
    }

    const slug =
      String(body.id || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `${name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${Date.now().toString().slice(-4)}`;

    await env.DB.prepare(
      `INSERT INTO products (id, name, presentation, category, imageUrl, price, stock, min_stock, reorder_qty, supplier_id, active, sort_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         presentation = excluded.presentation,
         category = excluded.category,
         imageUrl = excluded.imageUrl,
         price = excluded.price,
         stock = excluded.stock,
         min_stock = excluded.min_stock,
         reorder_qty = excluded.reorder_qty,
         supplier_id = excluded.supplier_id,
         active = excluded.active,
         sort_order = excluded.sort_order,
         updated_at = CURRENT_TIMESTAMP`
    )
      .bind(slug, name, presentation, category, imageUrl, price, stock, minStock, reorderQty, supplierId, active, sortOrder)
      .run();

    await checkAndTriggerAutoReorder(env, [slug]);

    return jsonResponse({
      ok: true,
      product: {
        id: slug,
        name,
        presentation,
        category,
        imageUrl,
        price,
        stock,
        min_stock: minStock,
        reorder_qty: reorderQty,
        supplier_id: supplierId,
        active: Boolean(active),
        sort_order: sortOrder,
      },
    });
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}

// --- Admin Suppliers & Programmed Reorders (/api/admin/suppliers & /api/admin/purchase-orders) ---
async function handleAdminSuppliers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!env || !env.DB) return jsonResponse({ ok: false, error: 'Base de datos D1 no vinculada.' }, 500);

  const url = new URL(request.url);

  if (request.method === 'GET') {
    const supRes = await env.DB.prepare('SELECT * FROM suppliers ORDER BY id ASC').all();
    const poRes = await env.DB.prepare('SELECT * FROM purchase_orders ORDER BY id DESC LIMIT 40').all();
    const lowRes = await env.DB.prepare(
      `SELECT p.*, s.name AS supplier_name, s.phone AS supplier_phone, s.contact_name AS supplier_contact
       FROM products p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.stock <= p.min_stock
       ORDER BY p.stock ASC`
    ).all();

    return jsonResponse({
      ok: true,
      suppliers: supRes.results || [],
      purchaseOrders: (poRes.results || []).map((po) => ({
        ...po,
        items: JSON.parse(po.items_json || '[]'),
      })),
      lowStockProducts: lowRes.results || [],
    });
  }

  if (request.method === 'DELETE') {
    const id = Number(url.searchParams.get('id'));
    if (!id) return jsonResponse({ ok: false, error: 'Falta ID del proveedor.' }, 400);
    await env.DB.prepare('UPDATE products SET supplier_id = NULL WHERE supplier_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM suppliers WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true, deletedId: id });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const id = body.id ? Number(body.id) : null;
    const name = String(body.name || '').trim();
    const contactName = String(body.contact_name || '').trim();
    const phone = normalizeColombianPhone(body.phone || '3015153867');
    const email = String(body.email || '').trim();
    const deliveryDays = String(body.delivery_days || 'Lunes a Sábado').trim();

    if (!name || !body.phone) {
      return jsonResponse({ ok: false, error: 'Nombre de la distribuidora y WhatsApp son obligatorios.' }, 400);
    }

    if (id) {
      await env.DB.prepare(
        'UPDATE suppliers SET name = ?, contact_name = ?, phone = ?, email = ?, delivery_days = ? WHERE id = ?'
      )
        .bind(name, contactName, phone, email, deliveryDays, id)
        .run();
      return jsonResponse({ ok: true, supplier: { id, name, contact_name: contactName, phone, email, delivery_days: deliveryDays } });
    } else {
      const res = await env.DB.prepare(
        'INSERT INTO suppliers (name, contact_name, phone, email, delivery_days) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(name, contactName, phone, email, deliveryDays)
        .run();
      return jsonResponse({
        ok: true,
        supplier: {
          id: res.meta?.last_row_id,
          name,
          contact_name: contactName,
          phone,
          email,
          delivery_days: deliveryDays,
        },
      });
    }
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}

async function handleAdminPurchaseOrders(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);
  if (!env || !env.DB) return jsonResponse({ ok: false, error: 'Base de datos D1 no vinculada.' }, 500);

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
  }

  const action = String(body.action || 'create');

  if (action === 'receive') {
    const poId = Number(body.id);
    if (!poId) return jsonResponse({ ok: false, error: 'Falta ID de la orden de compra.' }, 400);

    const po = await env.DB.prepare('SELECT * FROM purchase_orders WHERE id = ?').bind(poId).first();
    if (!po) return jsonResponse({ ok: false, error: 'Orden de compra no encontrada.' }, 404);
    if (po.status === 'recibida') {
      return jsonResponse({ ok: false, error: 'Esta orden de compra ya fue ingresada al inventario.' }, 400);
    }

    const items = JSON.parse(po.items_json || '[]');
    for (const item of items) {
      if (item.id && Number(item.qty) > 0) {
        await env.DB.prepare(
          'UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        )
          .bind(Number(item.qty), item.id)
          .run();
      }
    }

    await env.DB.prepare(
      "UPDATE purchase_orders SET status = 'recibida', received_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
      .bind(poId)
      .run();

    return jsonResponse({ ok: true, receivedId: poId, itemsAdded: items.length });
  }

  // Crear Orden de Compra (Manual o por Lote de Stock Mínimo)
  const supplierId = body.supplier_id ? Number(body.supplier_id) : null;
  let supplierName = String(body.supplier_name || 'Proveedor General').trim();
  let supplierPhone = normalizeColombianPhone(body.supplier_phone || '3015153867');

  if (supplierId) {
    const sup = await env.DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(supplierId).first();
    if (sup) {
      supplierName = sup.name;
      supplierPhone = sup.phone;
    }
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return jsonResponse({ ok: false, error: 'Seleccione al menos un producto para pedir al proveedor.' }, 400);
  }

  const totalUnits = items.reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
  const poNumber = `OC-${Date.now().toString().slice(-6)}`;

  await env.DB.prepare(
    `INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, supplier_phone, items_json, total_units, status)
     VALUES (?, ?, ?, ?, ?, ?, 'enviada')`
  )
    .bind(poNumber, supplierId, supplierName, supplierPhone, JSON.stringify(items), totalUnits)
    .run();

  const lines = items.map((i) => `• *${i.qty} uds* de ${i.name} (${i.presentation || ''})`).join('\n');
  const waText = `Hola *${supplierName}*, te comparto la Orden de Reabastecimiento *#${poNumber}* de *Mucadele Licores* (Calle 11 # 24-36, Santa Marta):\n\n${lines}\n\nTotal unidades: *${totalUnits}*. Quedamos atentos a confirmación de despacho.`;
  const cleanPhone = supplierPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

  return jsonResponse({
    ok: true,
    poNumber,
    supplierName,
    supplierPhone,
    totalUnits,
    whatsappUrl,
  });
}

// --- Admin Carriers / Domiciliarios (/api/admin/carriers) ---
async function handleAdminCarriers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  const shipdayHeaders = getShipdayHeaders(env);
  const url = new URL(request.url);

  if (request.method === 'GET') {
    let shipdayCarriers = [];
    try {
      const resp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers: shipdayHeaders });
      if (resp.ok) {
        shipdayCarriers = await resp.json();
      }
    } catch {}

    let dbCarriers = [];
    if (env && env.DB) {
      try {
        const res = await env.DB.prepare('SELECT * FROM carriers ORDER BY is_default DESC, name ASC').all();
        dbCarriers = res.results || [];
      } catch {}
    }

    const defaultCarrierRow = dbCarriers.find((c) => Number(c.is_default) === 1);
    const defaultCarrierId = defaultCarrierRow ? Number(defaultCarrierRow.id) : FALLBACK_CARRIER_ID;

    const mergedMap = new Map();
    for (const c of shipdayCarriers) {
      mergedMap.set(Number(c.id), {
        id: Number(c.id),
        name: c.name,
        phone: c.phoneNumber || '',
        email: c.email || '',
        isActive: Boolean(c.isActive),
        isOnShift: Boolean(c.isOnShift),
        isDefault: Number(c.id) === defaultCarrierId,
        source: 'shipday',
      });
    }
    for (const dbC of dbCarriers) {
      const numId = Number(dbC.id);
      if (!mergedMap.has(numId)) {
        mergedMap.set(numId, {
          id: numId,
          name: dbC.name,
          phone: dbC.phone,
          email: dbC.email || '',
          isActive: Boolean(dbC.active),
          isOnShift: false,
          isDefault: numId === defaultCarrierId,
          source: 'local',
        });
      } else {
        const existing = mergedMap.get(numId);
        existing.isDefault = numId === defaultCarrierId;
        if (!existing.email && dbC.email) existing.email = dbC.email;
      }
    }

    return jsonResponse({
      ok: true,
      defaultCarrierId,
      carriers: Array.from(mergedMap.values()),
    });
  }

  if (request.method === 'DELETE') {
    const carrierId = (url.searchParams.get('id') || '').trim();
    if (!carrierId) return jsonResponse({ ok: false, error: 'Falta ID del domiciliario.' }, 400);

    try {
      await fetch(`${SHIPDAY_API_URL}/carriers/${encodeURIComponent(carrierId)}`, {
        method: 'DELETE',
        headers: shipdayHeaders,
      });
    } catch {}

    if (env && env.DB) {
      await env.DB.prepare('DELETE FROM carriers WHERE id = ?').bind(Number(carrierId)).run();
    }
    return jsonResponse({ ok: true, deletedId: Number(carrierId) });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'JSON inválido.' }, 400);
  }

  if (request.method === 'PUT' || body.action === 'set_default') {
    const carrierId = Number(body.carrierId);
    const carrierName = String(body.name || 'Domiciliario').trim();
    const carrierPhone = normalizeColombianPhone(body.phone || '3015153867');
    if (!carrierId) return jsonResponse({ ok: false, error: 'Falta carrierId.' }, 400);

    if (env && env.DB) {
      await env.DB.prepare('UPDATE carriers SET is_default = 0').run();
      await env.DB.prepare(
        `INSERT INTO carriers (id, name, phone, is_default, active)
         VALUES (?, ?, ?, 1, 1)
         ON CONFLICT(id) DO UPDATE SET is_default = 1, active = 1`
      )
        .bind(carrierId, carrierName, carrierPhone)
        .run();
    }
    return jsonResponse({ ok: true, defaultCarrierId: carrierId });
  }

  if (request.method === 'POST') {
    const name = String(body.name || '').trim();
    const rawPhone = String(body.phone || '').trim();
    const phone = normalizeColombianPhone(rawPhone);
    const email =
      String(body.email || '').trim() ||
      `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'motorizado'}${Date.now().toString().slice(-3)}@mucadele.com.co`;
    const isDefault = body.isDefault ? 1 : 0;

    if (!name || !rawPhone) {
      return jsonResponse({ ok: false, error: 'Nombre y celular del domiciliario son obligatorios.' }, 400);
    }

    let createdId = null;
    let shipdayError = null;

    try {
      const createResp = await fetch(`${SHIPDAY_API_URL}/carriers`, {
        method: 'POST',
        headers: shipdayHeaders,
        body: JSON.stringify({
          name,
          phoneNumber: phone,
          email,
        }),
      });
      const createData = await createResp.json().catch(() => ({}));
      if (createResp.ok && createData.id) {
        createdId = Number(createData.id);
      } else {
        shipdayError = createData.message || createData.error || `HTTP ${createResp.status}`;
      }
    } catch (e) {
      shipdayError = e.message;
    }

    if (!createdId) {
      try {
        const listResp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers: shipdayHeaders });
        if (listResp.ok) {
          const all = await listResp.json();
          const digits = phone.replace(/\D/g, '').slice(-10);
          const found = all.find(
            (c) =>
              String(c.phoneNumber || '').replace(/\D/g, '').endsWith(digits) ||
              String(c.email || '').toLowerCase() === email.toLowerCase()
          );
          if (found) createdId = Number(found.id);
        }
      } catch {}
    }

    if (!createdId) {
      createdId = Number(Date.now().toString().slice(-6));
    }

    if (env && env.DB) {
      if (isDefault) {
        await env.DB.prepare('UPDATE carriers SET is_default = 0').run();
      }
      await env.DB.prepare(
        `INSERT INTO carriers (id, name, phone, email, is_default, active)
         VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           phone = excluded.phone,
           email = excluded.email,
           is_default = CASE WHEN excluded.is_default = 1 THEN 1 ELSE carriers.is_default END,
           active = 1`
      )
        .bind(createdId, name, phone, email, isDefault)
        .run();
    }

    return jsonResponse({
      ok: true,
      carrier: {
        id: createdId,
        name,
        phone,
        email,
        isDefault: Boolean(isDefault),
      },
      shipdaySynced: !shipdayError,
      shipdayNote: shipdayError || 'Registrado en Shipday correctamente.',
    });
  }

  return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405);
}

// --- Admin Customers & Credit Portfolio (/api/admin/customers) ---
async function handleAdminCustomers(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
  }

  try {
    const ordersRes = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const orders = ordersRes.results || [];

    const customersMap = new Map();

    for (const ord of orders) {
      const rawName = (ord.customer_name || 'Cliente Mostrador').trim();
      const rawPhone = (ord.customer_phone || '').trim();
      const rawDoc = (ord.customer_doc || '').trim();
      const cleanPhone = rawPhone.replace(/\D/g, '');

      // Llave única priorizando teléfono (si tiene al menos 7 dígitos), o cédula, o nombre normalizado
      let clientKey = '';
      if (cleanPhone.length >= 7) {
        clientKey = `phone:${cleanPhone.slice(-10)}`;
      } else if (rawDoc.length >= 4) {
        clientKey = `doc:${rawDoc.toLowerCase()}`;
      } else {
        clientKey = `name:${rawName.toLowerCase()}`;
      }

      if (!customersMap.has(clientKey)) {
        customersMap.set(clientKey, {
          id: clientKey,
          name: rawName,
          phone: rawPhone,
          cleanPhone: cleanPhone.slice(-10),
          doc: rawDoc,
          address: (ord.delivery_address || '').trim(),
          total_orders: 0,
          total_spent: 0,
          total_debt: 0,
          pending_credits_count: 0,
          first_order_date: ord.created_at,
          last_order_date: ord.created_at,
          orders: [],
        });
      }

      const client = customersMap.get(clientKey);
      client.total_orders += 1;
      const amount = Number(ord.total) || 0;
      client.total_spent += amount;

      // Actualizar datos si este pedido tiene más info
      if (!client.doc && rawDoc) client.doc = rawDoc;
      if (!client.phone && rawPhone) {
        client.phone = rawPhone;
        client.cleanPhone = cleanPhone.slice(-10);
      }
      if (!client.address && ord.delivery_address) client.address = ord.delivery_address.trim();

      const isPendingCredit = ord.payment_method === 'credito' && ord.payment_status === 'pending';
      if (isPendingCredit) {
        client.total_debt += amount;
        client.pending_credits_count += 1;
      }

      let items = [];
      try { items = JSON.parse(ord.items_json || '[]'); } catch {}

      client.orders.push({
        order_number: ord.order_number,
        created_at: ord.created_at,
        total: amount,
        payment_method: ord.payment_method || 'efectivo',
        payment_status: ord.payment_status || 'paid',
        items_count: items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0),
        items_summary: items.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      });
    }

    const customersList = Array.from(customersMap.values()).map((c) => {
      let tier = 'Nuevo';
      let tierBadge = 'badge-new';
      if (c.total_orders >= 3) {
        tier = 'VIP / Frecuente';
        tierBadge = 'badge-vip';
      } else if (c.total_orders === 2) {
        tier = 'Recurrente';
        tierBadge = 'badge-recurring';
      }

      return {
        ...c,
        tier,
        tierBadge,
        has_pending_credit: c.total_debt > 0,
      };
    });

    // Ordenar: primero los que tienen deuda pendiente descendente, luego los más frecuentes / mayor gasto
    customersList.sort((a, b) => {
      if (b.total_debt !== a.total_debt) return b.total_debt - a.total_debt;
      if (b.total_orders !== a.total_orders) return b.total_orders - a.total_orders;
      return b.total_spent - a.total_spent;
    });

    // KPIs globales
    const kpis = {
      total_customers: customersList.length,
      frequent_customers: customersList.filter((c) => c.total_orders >= 2).length,
      debtors_count: customersList.filter((c) => c.total_debt > 0).length,
      total_debt: customersList.reduce((sum, c) => sum + c.total_debt, 0),
      total_revenue: customersList.reduce((sum, c) => sum + c.total_spent, 0),
    };

    return jsonResponse({
      ok: true,
      kpis,
      customers: customersList,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Error consultando clientes: ' + err.message }, 500);
  }
}

// --- AI Invoice Processing (/api/admin/scan-invoice) ---
async function handleAdminScanInvoice(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Método no permitido' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  const { imageBase64 } = body || {};
  if (!imageBase64) {
    return jsonResponse({ ok: false, error: 'Se requiere la imagen o página de factura en base64.' }, 400);
  }

  // 1. Obtener catálogo actual de D1 para cotejar
  let catalogList = [];
  if (env && env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT id, name, presentation, stock, category FROM products WHERE active = 1 ORDER BY sort_order ASC, name ASC'
      ).all();
      catalogList = results || [];
    } catch {}
  }
  if (catalogList.length === 0) {
    catalogList = DEFAULT_CATALOG;
  }

  const catalogSummary = catalogList.map((p) => ({ id: p.id, name: p.name, stock: p.stock }));

  const promptText = `Eres un asistente experto en auditoría y extracción de facturas comerciales de compra de licores para Mucadele Licores en Santa Marta, Colombia.
Analiza la imagen adjunta de la factura comercial.
Extrae la información en un formato JSON estrictamente válido, sin texto adicional ni bloques markdown, con la siguiente estructura:
{
  "supplier_name": "Nombre de la distribuidora o proveedor",
  "invoice_number": "Número de factura (ej. FE-12345)",
  "invoice_date": "Fecha de la factura (AAAA-MM-DD)",
  "total_amount": 0,
  "items": [
    {
      "raw_name": "Nombre original tal como aparece en la factura",
      "quantity": 0,
      "unit_cost": 0,
      "subtotal": 0,
      "matched_product_id": "id del producto del catálogo si coincide exactamente o null"
    }
  ]
}

Catálogo oficial de Mucadele Licores para mapear matched_product_id:
${JSON.stringify(catalogSummary)}`;

  let aiRawText = '';
  const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();

  // 2. Ejecución con env.AI (Cloudflare Workers AI)
  if (env && env.AI) {
    try {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
        prompt: promptText,
        image: cleanBase64,
        max_tokens: 1800,
      });
      aiRawText = aiResponse?.response || (typeof aiResponse === 'string' ? aiResponse : '');
    } catch (err) {
      console.warn('env.AI falló, intentando REST API de Workers AI:', err);
    }
  }

  // Fallback REST API Workers AI con token
  if (!aiRawText) {
    try {
      const cfToken = env.CLOUDFLARE_API_TOKEN || 'q4vD5o779b5YgHk0L_mR51X24Hk0V8mP';
      const accountId = env.CLOUDFLARE_ACCOUNT_ID || 'fc3f86dccb5f80460e28e5ba899d0427';
      const restResp = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptText,
            image: cleanBase64,
            max_tokens: 1800,
          }),
        }
      );
      if (restResp.ok) {
        const restData = await restResp.json();
        aiRawText = restData?.result?.response || '';
      }
    } catch (err) {
      console.error('Error invocando Workers AI REST API:', err);
    }
  }

  // 3. Parsear JSON de la IA
  let parsedInvoice = null;
  if (aiRawText) {
    try {
      const jsonMatch = aiRawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInvoice = JSON.parse(jsonMatch[0]);
      }
    } catch {}
  }

  if (!parsedInvoice || !Array.isArray(parsedInvoice.items) || parsedInvoice.items.length === 0) {
    // Si la imagen era borrosa o la IA no extrajo ítems, armar estructura asistida
    parsedInvoice = {
      supplier_name: parsedInvoice?.supplier_name || 'Distribuidora de Licores',
      invoice_number: parsedInvoice?.invoice_number || `FAC-${Date.now().toString().slice(-6)}`,
      invoice_date: parsedInvoice?.invoice_date || new Date().toISOString().split('T')[0],
      total_amount: Number(parsedInvoice?.total_amount) || 0,
      items: [
        {
          raw_name: 'Ítem detectado en factura',
          quantity: 12,
          unit_cost: 0,
          subtotal: 0,
          matched_product_id: catalogList[0]?.id || null,
        },
      ],
    };
  }

  // 4. Enriquecer con cotejo inteligente y stock actual de D1
  const catalogMap = new Map(catalogList.map((p) => [p.id, p]));
  const enrichedItems = (parsedInvoice.items || []).map((item) => {
    let matchedId = item.matched_product_id;
    let matchedProd = catalogMap.get(matchedId);

    // Búsqueda por similitud semántica si no hubo match directo
    if (!matchedProd) {
      const rawLower = (item.raw_name || '').toLowerCase();
      matchedProd = catalogList.find((p) => {
        const pLower = p.name.toLowerCase();
        if (rawLower.includes('buchan') && pLower.includes('buchan')) return true;
        if ((rawLower.includes('old parr') || rawLower.includes('parr')) && pLower.includes('old parr')) return true;
        if (rawLower.includes('antioq') && pLower.includes('antioqueño')) {
          if (rawLower.includes('azul') || rawLower.includes('sin azucar')) return p.id.includes('azul');
          if (rawLower.includes('verde') || rawLower.includes('24')) return p.id.includes('verde');
          return true;
        }
        if (rawLower.includes('medellin') && pLower.includes('medellín')) return true;
        if (rawLower.includes('caldas') && pLower.includes('caldas')) return true;
        if (rawLower.includes('corona') && pLower.includes('corona')) return true;
        if (rawLower.includes('aguila') && pLower.includes('águila')) return true;
        if (rawLower.includes('club') && pLower.includes('club colombia')) return true;
        if (rawLower.includes('cuervo') && pLower.includes('cuervo')) return true;
        if (rawLower.includes('don julio') && pLower.includes('don julio')) return true;
        if (rawLower.includes('absolut') && pLower.includes('absolut')) return true;
        if (rawLower.includes('hielo') && pLower.includes('hielo')) return true;
        return false;
      });
      if (matchedProd) {
        matchedId = matchedProd.id;
      }
    }

    const currentStock = matchedProd ? Number(matchedProd.stock ?? 0) : 0;
    const qty = Math.max(1, Number(item.quantity) || 1);

    return {
      raw_name: item.raw_name || 'Ítem Facturado',
      quantity: qty,
      unit_cost: Number(item.unit_cost) || 0,
      subtotal: (Number(item.unit_cost) || 0) * qty,
      matched_product_id: matchedId || null,
      matched_product_name: matchedProd ? matchedProd.name : 'Seleccionar producto...',
      current_stock: currentStock,
      projected_stock: currentStock + qty,
    };
  });

  return jsonResponse({
    ok: true,
    invoice: {
      supplier_name: parsedInvoice.supplier_name || 'Distribuidora Comercial',
      invoice_number: parsedInvoice.invoice_number || `FAC-${Date.now().toString().slice(-6)}`,
      invoice_date: parsedInvoice.invoice_date || new Date().toISOString().split('T')[0],
      total_amount: Number(parsedInvoice.total_amount) || 0,
      items: enrichedItems,
    },
    catalog: catalogList.map((p) => ({
      id: p.id,
      name: p.name,
      presentation: p.presentation,
      stock: Number(p.stock ?? 0),
    })),
  });
}

// --- Apply Scanned Invoice into Real Inventory (/api/admin/apply-invoice) ---
async function handleAdminApplyInvoice(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Método no permitido' }, 405);
  }

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  const { supplier_name = 'Proveedor Factura IA', invoice_number, invoice_date, items = [] } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return jsonResponse({ ok: false, error: 'Debe seleccionar al menos un producto para ingresar al inventario.' }, 400);
  }

  try {
    const validItems = items.filter((i) => i.product_id && Number(i.quantity) > 0);
    if (validItems.length === 0) {
      return jsonResponse({ ok: false, error: 'Ningún ítem tiene un producto de catálogo asignado con cantidad mayor a cero.' }, 400);
    }

    // 1. Actualizar el stock atómicamente en Cloudflare D1
    const updateStatements = validItems.map((item) =>
      env.DB.prepare(
        'UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(Number(item.quantity), item.product_id)
    );
    await env.DB.batch(updateStatements);

    // 2. Registrar en purchase_orders como orden de compra recibida
    const poNumber = invoice_number
      ? `FAC-${String(invoice_number).replace(/[^a-zA-Z0-9-]/g, '')}`
      : `ING-${Date.now().toString().slice(-6)}`;
    const totalUnits = validItems.reduce((sum, i) => sum + Number(i.quantity), 0);

    await env.DB.prepare(
      `INSERT INTO purchase_orders (po_number, supplier_name, supplier_phone, items_json, total_units, status, received_at, created_at)
       VALUES (?, ?, ?, ?, ?, 'recibida', CURRENT_TIMESTAMP, ?)`
    )
      .bind(
        poNumber,
        supplier_name,
        'Factura de Compra IA',
        JSON.stringify(validItems),
        totalUnits,
        invoice_date ? `${invoice_date} 12:00:00` : new Date().toISOString()
      )
      .run();

    // 3. Consultar los stocks actualizados de estos productos
    const placeholders = validItems.map(() => '?').join(', ');
    const updatedProds = await env.DB.prepare(
      `SELECT id, name, stock FROM products WHERE id IN (${placeholders})`
    )
      .bind(...validItems.map((i) => i.product_id))
      .all();

    return jsonResponse({
      ok: true,
      message: `¡Inventario actualizado! Se ingresaron ${totalUnits} unidades en ${validItems.length} productos.`,
      po_number: poNumber,
      total_units_added: totalUnits,
      updated_products: updatedProds.results || [],
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Error aplicando factura a inventario en D1: ' + err.message }, 500);
  }
}

// --- Orders GET & POST (/api/order) ---
async function handleOrderGet(request, env) {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get('orderNumber');
  const list = url.searchParams.get('list');
  const headers = getShipdayHeaders(env);

  if (list === 'active') {
    // Listar todas las órdenes activas y el historial completo requiere sesión de superadmin
    const user = await verifySession(request, env);
    if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

    let shipdayOrders = [];
    try {
      const ordersResp = await fetch(`${SHIPDAY_API_URL}/orders`, { headers });
      if (ordersResp.ok) {
        const parsed = await ordersResp.json();
        if (Array.isArray(parsed)) shipdayOrders = parsed.slice(0, 30);
      }
    } catch {}

    let dbOrders = [];
    const summaryByMethod = {
      efectivo: 0,
      tarjeta_credito: 0,
      tarjeta_debito: 0,
      transferencia: 0,
      credito: 0,
      credito_pendiente: 0,
      combinado: 0,
      otros: 0,
      total_recaudado: 0,
      total_facturado: 0,
    };
    const creditsSummaryMap = new Map();

    if (env && env.DB) {
      try {
        const res = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100').all();
        dbOrders = (res.results || []).map((o) => {
          let items = [];
          try { items = JSON.parse(o.items_json || '[]'); } catch {}
          let details = {};
          try {
            details = typeof o.payment_details === 'string' ? JSON.parse(o.payment_details) : (o.payment_details || {});
          } catch {}
          return {
            ...o,
            items,
            payment_status: o.payment_status || 'paid',
            payment_details: details,
            customer_doc: o.customer_doc || '',
          };
        });

        for (const ord of dbOrders) {
          const tot = Number(ord.total) || 0;
          summaryByMethod.total_facturado += tot;
          const method = ord.payment_method || 'efectivo';
          const isPendingCredit = method === 'credito' && ord.payment_status === 'pending';

          if (isPendingCredit) {
            summaryByMethod.credito_pendiente += tot;
            summaryByMethod.credito += tot;

            const custKey = `${(ord.customer_name || 'Sin Nombre').trim().toLowerCase()}::${(ord.customer_doc || ord.customer_phone || '').trim()}`;
            if (!creditsSummaryMap.has(custKey)) {
              creditsSummaryMap.set(custKey, {
                customer_name: ord.customer_name || 'Cliente sin nombre',
                customer_phone: ord.customer_phone || '',
                customer_doc: ord.customer_doc || '',
                total_debt: 0,
                orders: [],
              });
            }
            const group = creditsSummaryMap.get(custKey);
            group.total_debt += tot;
            group.orders.push({
              order_number: ord.order_number,
              created_at: ord.created_at,
              total: tot,
              items: ord.items,
            });
          } else {
            summaryByMethod.total_recaudado += tot;
            if (method === 'combinado' && ord.payment_details && Array.isArray(ord.payment_details.split)) {
              summaryByMethod.combinado += tot;
              for (const part of ord.payment_details.split) {
                const partMethod = (part.method || 'efectivo').toLowerCase();
                const partAmt = Number(part.amount) || 0;
                if (summaryByMethod[partMethod] !== undefined) {
                  summaryByMethod[partMethod] += partAmt;
                } else {
                  summaryByMethod.otros += partAmt;
                }
              }
            } else if (summaryByMethod[method] !== undefined) {
              summaryByMethod[method] += tot;
            } else {
              summaryByMethod.otros += tot;
            }
          }
        }
      } catch {}
    }

    return jsonResponse({
      ok: true,
      orders: shipdayOrders,
      dbOrders,
      summaryByMethod,
      creditsSummary: Array.from(creditsSummaryMap.values()),
    });
  }

  if (!orderNumber) {
    // Proteger datos privados de domiciliarios: requiere sesión administrativa
    const user = await verifySession(request, env);
    if (!user) {
      return jsonResponse({ ok: false, error: 'No autorizado para consultar transportistas.' }, 401);
    }

    try {
      const carriersResp = await fetch(`${SHIPDAY_API_URL}/carriers`, { headers });
      const carriers = carriersResp.ok ? await carriersResp.json() : [];
      let defaultCarrierId = FALLBACK_CARRIER_ID;
      if (env && env.DB) {
        try {
          const defRow = await env.DB.prepare('SELECT id FROM carriers WHERE is_default = 1 LIMIT 1').first();
          if (defRow && defRow.id) defaultCarrierId = Number(defRow.id);
        } catch {}
      }
      return jsonResponse({
        ok: true,
        store: STORE_CONFIG,
        defaultCarrierId,
        carriersCount: Array.isArray(carriers) ? carriers.length : 0,
        carriers: Array.isArray(carriers)
          ? carriers.map((c) => ({
              id: c.id,
              name: c.name,
              phone: c.phoneNumber,
              isActive: c.isActive,
              isOnShift: c.isOnShift,
              isDefault: Number(c.id) === defaultCarrierId,
            }))
          : [],
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  }

  // Consulta individual de rastreo por orderNumber
  try {
    const detailResp = await fetch(
      `${SHIPDAY_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
      { headers }
    );
    const details = detailResp.ok ? await detailResp.json() : [];
    let orderData = Array.isArray(details) && details.length > 0 ? details[0] : null;
    if (orderData) {
      const user = await verifySession(request, env);
      if (!user) {
        // Redactar datos privados del transportista para rastreo público
        const sanitized = { ...orderData };
        if (sanitized.carrier && (sanitized.carrier.phoneNumber || sanitized.carrier.phone)) {
          sanitized.carrier = {
            ...sanitized.carrier,
            phoneNumber: undefined,
            phone: undefined,
          };
        }
        orderData = sanitized;
      }
    }
    return jsonResponse({
      ok: true,
      order: orderData,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

async function handleOrderPatch(request, env) {
  const user = await verifySession(request, env);
  if (!user) return jsonResponse({ ok: false, error: 'No autorizado.' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido.' }, 400);
  }

  const { orderNumber, paymentStatus = 'paid', paidMethod = 'efectivo', notes = '' } = body || {};
  if (!orderNumber) {
    return jsonResponse({ ok: false, error: 'orderNumber es requerido.' }, 400);
  }

  if (env && env.DB) {
    try {
      const existing = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ? LIMIT 1').bind(orderNumber).first();
      if (!existing) {
        return jsonResponse({ ok: false, error: 'Orden no encontrada en la base de datos.' }, 404);
      }
      let details = {};
      try { details = JSON.parse(existing.payment_details || '{}'); } catch {}
      details.settledAt = new Date().toISOString();
      details.settledMethod = paidMethod;
      if (notes) details.settledNotes = notes;

      await env.DB.prepare(
        'UPDATE orders SET payment_status = ?, payment_details = ? WHERE order_number = ?'
      ).bind(paymentStatus, JSON.stringify(details), orderNumber).run();

      return jsonResponse({
        ok: true,
        orderNumber,
        paymentStatus,
        settledMethod: paidMethod,
        settledAt: details.settledAt,
      });
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error actualizando pago: ' + err.message }, 500);
    }
  }

  return jsonResponse({ ok: false, error: 'Base de datos D1 no disponible.' }, 500);
}

async function handleOrderPost(request, env) {
  const headers = getShipdayHeaders(env);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const {
    orderType = 'delivery',
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    customerDoc = '',
    neighborhood,
    deliveryInstruction,
    paymentMethod: rawPaymentMethod = 'efectivo',
    paymentStatus: rawPaymentStatus = null,
    paymentDetails = null,
    items = [],
    deliveryFee = 6000,
    tips = 0,
    autoAssignDriver = true,
    carrierId: requestedCarrierId = null,
    skipShipday = false,
    discountAmount = 0,
    discountDetails = null,
  } = body || {};

  // Normalización técnica y estricta de métodos de pago
  let paymentMethod = (rawPaymentMethod || 'efectivo').toString().trim().toLowerCase();
  if (paymentMethod === 'cash') paymentMethod = 'efectivo';
  else if (paymentMethod === 'card' || paymentMethod === 'tarjeta credito' || paymentMethod === 'tarjeta_credito') paymentMethod = 'tarjeta_credito';
  else if (paymentMethod === 'nequi' || paymentMethod === 'daviplata' || paymentMethod === 'banco' || paymentMethod === 'transferencia') paymentMethod = 'transferencia';
  else if (paymentMethod === 'tarjeta debito' || paymentMethod === 'tarjeta_debito' || paymentMethod === 'debito') paymentMethod = 'tarjeta_debito';
  else if (paymentMethod === 'a credito' || paymentMethod === 'credito' || paymentMethod === 'crédito') paymentMethod = 'credito';
  else if (paymentMethod === 'combinado' || paymentMethod === 'mixto') paymentMethod = 'combinado';
  else if (paymentMethod === 'otros' || paymentMethod === 'otro' || paymentMethod === 'otros metodos') paymentMethod = 'otros';

  const paymentStatus = rawPaymentStatus || (paymentMethod === 'credito' ? 'pending' : 'paid');

  const isNoDelivery = orderType === 'pickup' || orderType === 'pos_counter';
  const resolvedName = (customerName || (orderType === 'pos_counter' ? 'Cliente Mostrador' : '')).trim();
  const resolvedPhone = (customerPhone || (orderType === 'pos_counter' ? '3015153867' : '')).trim();
  const resolvedAddress = isNoDelivery
    ? STORE_CONFIG.address
    : (customerAddress || '').trim();

  if (!resolvedName || !resolvedPhone || !resolvedAddress || !Array.isArray(items) || items.length === 0) {
    return jsonResponse(
      { ok: false, error: 'Faltan datos obligatorios del cliente o el carrito está vacío.' },
      400
    );
  }

  // 1. Validar formato de cada ítem (id y cantidad estrictamente positiva)
  for (const item of items) {
    if (!item.id || typeof item.id !== 'string') {
      return jsonResponse({ ok: false, error: 'Identificador de producto faltante o inválido.' }, 400);
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return jsonResponse({ ok: false, error: `Cantidad inválida para el producto: ${item.name || item.id}` }, 400);
    }
  }

  // 2. Consultar obligatoriamente la tabla products en D1 para cada producto
  let dbProducts = [];
  if (env && env.DB) {
    try {
      const placeholders = items.map(() => '?').join(', ');
      const ids = items.map((i) => i.id);
      const query = `SELECT id, name, presentation, price, stock, active FROM products WHERE id IN (${placeholders})`;
      const dbRes = await env.DB.prepare(query).bind(...ids).all();
      dbProducts = dbRes.results || [];
    } catch (err) {
      return jsonResponse({ ok: false, error: 'Error consultando inventario en D1: ' + err.message }, 500);
    }
  } else {
    dbProducts = DEFAULT_CATALOG;
  }

  const dbMap = new Map(dbProducts.map((p) => [p.id, p]));

  // 3. Validar existencia, estado activo y stock de cada producto
  const orderItems = [];
  for (const item of items) {
    const dbProd = dbMap.get(item.id);
    if (!dbProd || dbProd.active === 0) {
      return jsonResponse({ ok: false, error: `Producto no disponible: ${item.name || item.id}` }, 400);
    }
    const requestedQty = Number(item.quantity) || 1;
    if (Number(dbProd.stock) < requestedQty) {
      return jsonResponse(
        {
          ok: false,
          error: `Stock insuficiente para ${dbProd.name}. Disponible: ${dbProd.stock}, solicitado: ${requestedQty}`,
        },
        400
      );
    }
    // Recalcular unitPrice usando exclusivamente el precio en D1 (ignorar item.price del cliente)
    const unitPrice = Number(dbProd.price) || 0;
    orderItems.push({
      id: dbProd.id,
      name: dbProd.name,
      unitPrice,
      quantity: requestedQty,
      detail: dbProd.presentation || item.presentation || '',
    });
  }

  // 4. Recalcular subtotales y total exclusivamente en el backend
  const itemsSubtotal = orderItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const effectiveDeliveryFee = isNoDelivery ? 0 : Number(deliveryFee || 0);
  const appliedDiscount = Math.min(itemsSubtotal, Math.max(0, Number(discountAmount || 0)));
  const totalOrderCost = Math.max(0, itemsSubtotal - appliedDiscount + effectiveDeliveryFee + Number(tips || 0));

  const prefix = orderType === 'pos_counter' ? 'POS' : orderType === 'pickup' ? 'RET' : 'MUC';
  const orderNumber = `${prefix}-${Date.now().toString().slice(-6)}`;
  const { date: expectedDeliveryDate, time: expectedDeliveryTime } = formatBogotaDateAndTime(
    isNoDelivery ? 5 : 35
  );

  const fullAddress = isNoDelivery
    ? `MOSTRADOR LOCAL · ${STORE_CONFIG.address}`
    : neighborhood
    ? `${resolvedAddress}, Barrio ${neighborhood.trim()}, Santa Marta, Magdalena, Colombia`
    : `${resolvedAddress}, Santa Marta, Magdalena, Colombia`;

  let targetCarrierId = requestedCarrierId ? Number(requestedCarrierId) : FALLBACK_CARRIER_ID;
  let targetCarrierName = 'Motorizado Mucadele';

  if (env && env.DB) {
    try {
      if (!requestedCarrierId) {
        const defCarrier = await env.DB.prepare('SELECT id, name FROM carriers WHERE is_default = 1 LIMIT 1').first();
        if (defCarrier && defCarrier.id) {
          targetCarrierId = Number(defCarrier.id);
          targetCarrierName = defCarrier.name;
        }
      } else {
        const selCarrier = await env.DB.prepare('SELECT id, name FROM carriers WHERE id = ? LIMIT 1')
          .bind(targetCarrierId)
          .first();
        if (selCarrier && selCarrier.name) {
          targetCarrierName = selCarrier.name;
        }
      }
    } catch {}
  }

  let paymentLabel = 'Efectivo';
  if (paymentMethod === 'tarjeta_credito') paymentLabel = 'Tarjeta de Crédito (Datáfono)';
  else if (paymentMethod === 'tarjeta_debito') paymentLabel = 'Tarjeta Débito (Datáfono)';
  else if (paymentMethod === 'transferencia') paymentLabel = `Transferencia ${paymentDetails?.reference ? `[Ref: ${paymentDetails.reference}]` : ''}`.trim();
  else if (paymentMethod === 'combinado') paymentLabel = 'Pago Combinado';
  else if (paymentMethod === 'credito') paymentLabel = `A CRÉDITO [PENDIENTE] · Doc/Tel: ${customerDoc || resolvedPhone}`;
  else if (paymentMethod === 'otros') paymentLabel = `Otros: ${paymentDetails?.concept || 'Varios'}`;

  // Enriquecer paymentDetails con descuento autorizado si existe
  const enrichedPaymentDetails = typeof paymentDetails === 'object' && paymentDetails !== null ? { ...paymentDetails } : {};
  if (appliedDiscount > 0) {
    enrichedPaymentDetails.discount = {
      amount: appliedDiscount,
      ...(discountDetails && typeof discountDetails === 'object' ? discountDetails : {}),
    };
  }

  // Función auxiliar para descontar stock de forma atómica en D1
  async function deductStockAndTriggerReorder() {
    if (env && env.DB) {
      try {
        const updateStatements = orderItems.map((item) =>
          env.DB.prepare(
            'UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
          ).bind(item.quantity, item.id)
        );
        await env.DB.batch(updateStatements);
        await checkAndTriggerAutoReorder(env, orderItems.map((i) => i.id));
      } catch (err) {
        console.error('Error descontando stock en D1:', err);
      }
    } else {
      for (const item of orderItems) {
        const p = dbMap.get(item.id);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
      }
    }
  }

  if (skipShipday) {
    await deductStockAndTriggerReorder();

    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO orders (order_number, shipday_order_id, order_type, customer_name, customer_phone, customer_address, payment_method, subtotal, delivery_fee, total, carrier_id, carrier_name, tracking_link, items_json, created_at, payment_status, payment_details, customer_doc)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            orderNumber,
            null,
            orderType,
            resolvedName,
            resolvedPhone,
            fullAddress,
            paymentMethod,
            itemsSubtotal,
            0,
            totalOrderCost,
            null,
            null,
            null,
            JSON.stringify(orderItems),
            `${expectedDeliveryDate} ${expectedDeliveryTime}`,
            paymentStatus,
            JSON.stringify(enrichedPaymentDetails),
            String(customerDoc || '').trim()
          )
          .run();
      } catch (err) {
        console.error('Error guardando orden en D1 (skipShipday):', err);
      }
    }

    return jsonResponse({
      ok: true,
      orderId: null,
      orderNumber,
      orderType,
      assigned: false,
      assignedCarrierId: null,
      assignedCarrierName: null,
      orderState: 'COMPLETED_AT_COUNTER',
      trackingLink: null,
      totalOrderCost,
      deliveryFee: 0,
      expectedDeliveryDate,
      expectedDeliveryTime,
      customerAddress: fullAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      customerDoc,
      items: orderItems,
    });
  }

  const modeTag =
    orderType === 'pickup'
      ? '[RECOGER EN LOCAL - SIN DOMICILIO]'
      : orderType === 'pos_counter'
      ? '[VENTA EN MOSTRADOR POS - SIN DOMICILIO]'
      : '[DOMICILIO EXPRESS]';

  const combinedInstructions = [
    modeTag,
    `Pago: ${paymentLabel} | Total COP $${totalOrderCost.toLocaleString('es-CO')}`,
    deliveryInstruction ? `Nota: ${deliveryInstruction.trim()}` : '',
    'Verificar mayoría de edad (+18).',
  ]
    .filter(Boolean)
    .join(' · ');

  const shipdayPayload = {
    orderNumber,
    customerName: resolvedName,
    customerAddress: fullAddress,
    customerEmail: (customerEmail || 'cliente@mucadele.com').trim(),
    customerPhoneNumber: normalizeColombianPhone(resolvedPhone),
    restaurantName: STORE_CONFIG.name,
    restaurantAddress: STORE_CONFIG.address,
    restaurantPhoneNumber: STORE_CONFIG.phoneNumber,
    pickupLatitude: STORE_CONFIG.latitude,
    pickupLongitude: STORE_CONFIG.longitude,
    expectedDeliveryDate,
    expectedDeliveryTime,
    deliveryInstruction: combinedInstructions,
    orderItem: orderItems.map((it) => ({
      name: it.name,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
    })),
    totalOrderCost,
    deliveryFee: effectiveDeliveryFee,
    tips: Number(tips || 0),
    tax: 0,
    discountAmount: 0,
    paymentMethod: paymentMethod === 'cash' ? 'cash' : 'credit_card',
  };

  try {
    const insertResp = await fetch(`${SHIPDAY_API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(shipdayPayload),
    });

    const insertData = await insertResp.json().catch(() => ({}));
    if (!insertResp.ok || insertData.success === false) {
      return jsonResponse(
        {
          ok: false,
          error: insertData.response || 'No fue posible registrar la orden en Shipday.',
          details: insertData,
        },
        502
      );
    }

    // Orden confirmada en Shipday: descontar stock atómicamente en D1
    await deductStockAndTriggerReorder();

    const orderId = insertData.orderId;
    let assigned = false;
    let assignedDriverName = null;

    const shouldAssignDriver = !isNoDelivery && autoAssignDriver && orderId;
    if (shouldAssignDriver) {
      const assignResp = await fetch(
        `${SHIPDAY_API_URL}/orders/assign/${orderId}/${targetCarrierId}`,
        {
          method: 'PUT',
          headers,
        }
      );
      if (assignResp.ok) {
        assigned = true;
        assignedDriverName = targetCarrierName;
      }
    }

    let trackingLink = null;
    let orderState = isNoDelivery
      ? 'PICKUP_AT_STORE'
      : assigned
      ? 'ASSIGNED'
      : 'NOT_ASSIGNED';

    if (!isNoDelivery) {
      try {
        const detailResp = await fetch(
          `${SHIPDAY_API_URL}/orders/${encodeURIComponent(orderNumber)}`,
          { headers }
        );
        if (detailResp.ok) {
          const detailJson = await detailResp.json();
          if (Array.isArray(detailJson) && detailJson.length > 0) {
            trackingLink = detailJson[0].trackingLink || null;
            orderState = detailJson[0]?.orderStatus?.orderState || orderState;
          }
        }
      } catch {}
    }

    if (env && env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO orders (order_number, shipday_order_id, order_type, customer_name, customer_phone, customer_address, payment_method, subtotal, delivery_fee, total, carrier_id, carrier_name, tracking_link, items_json, created_at, payment_status, payment_details, customer_doc)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            orderNumber,
            orderId || null,
            orderType,
            resolvedName,
            resolvedPhone,
            fullAddress,
            paymentMethod,
            itemsSubtotal,
            effectiveDeliveryFee,
            totalOrderCost,
            assigned ? targetCarrierId : null,
            assignedDriverName,
            trackingLink,
            JSON.stringify(orderItems),
            `${expectedDeliveryDate} ${expectedDeliveryTime}`,
            paymentStatus,
            JSON.stringify(enrichedPaymentDetails),
            String(customerDoc || '').trim()
          )
          .run();
      } catch (err) {
        console.error('Error guardando orden en D1 (con Shipday):', err);
      }
    }

    return jsonResponse({
      ok: true,
      orderId,
      orderNumber,
      orderType,
      assigned,
      assignedCarrierId: assigned ? targetCarrierId : null,
      assignedCarrierName: assignedDriverName,
      orderState,
      trackingLink,
      totalOrderCost,
      deliveryFee: effectiveDeliveryFee,
      expectedDeliveryDate,
      expectedDeliveryTime,
      customerAddress: fullAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      customerDoc,
      items: orderItems,
    });
  } catch (err) {
    return jsonResponse(
      { ok: false, error: err.message || 'Error interno procesando el pedido.' },
      500
    );
  }
}


const PROTECTED_PREFIXES = ['/admin', '/pos', '/manual', '/clientes'];

function isProtectedPath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return false;
  const normalized = rawPath.toLowerCase().replace(/\/+$/, '') || '/';
  for (const prefix of PROTECTED_PREFIXES) {
    if (
      normalized === prefix ||
      normalized === `${prefix}.html` ||
      normalized === `${prefix}.js` ||
      normalized.startsWith(`${prefix}/`)
    ) {
      return true;
    }
  }
  return false;
}

export default {
  async fetch(request, env) {
    try {
      const response = await this.handleRequest(request, env);
      return withSecurityHeaders(response);
    } catch (err) {
      return withSecurityHeaders(
        jsonResponse({ ok: false, error: 'Internal Server Error: ' + err.message }, 500)
      );
    }
  },

  async handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS' && path.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (path === '/api/login') {
      return handleServerLogin(request, env);
    }

    if (path === '/api/logout') {
      return handleServerLogout(request);
    }

    if (path === '/api/auth') {
      return handleAuth(request, env);
    }

    if (path === '/api/catalog') {
      return handleCatalog(request, env);
    }

    if (path === '/api/admin/products') {
      return handleAdminProducts(request, env);
    }

    if (path === '/api/admin/suppliers') {
      return handleAdminSuppliers(request, env);
    }

    if (path === '/api/admin/purchase-orders') {
      return handleAdminPurchaseOrders(request, env);
    }

    if (path === '/api/admin/carriers') {
      return handleAdminCarriers(request, env);
    }

    if (path === '/api/admin/customers') {
      return handleAdminCustomers(request, env);
    }

    if (path === '/api/admin/scan-invoice') {
      return handleAdminScanInvoice(request, env);
    }

    if (path === '/api/admin/apply-invoice') {
      return handleAdminApplyInvoice(request, env);
    }

    if (path === '/api/order') {
      if (request.method === 'GET') return handleOrderGet(request, env);
      if (request.method === 'POST') return handleOrderPost(request, env);
      if (request.method === 'PATCH') return handleOrderPatch(request, env);
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Protección estricta en el Edge con normalización de rutas y slashes
    if (isProtectedPath(path)) {
      const user = await verifySession(request, env);
      if (!user) {
        if (path.toLowerCase().endsWith('.js')) {
          return new Response('// Unauthorized', {
            status: 401,
            headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' },
          });
        }
        return renderServerLoginPage(sanitizeRedirectPath(path, '/admin.html'));
      }
      const assetResp = await env.ASSETS.fetch(request);
      const headers = new Headers(assetResp.headers);
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      return new Response(assetResp.body, {
        status: assetResp.status,
        statusText: assetResp.statusText,
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};

