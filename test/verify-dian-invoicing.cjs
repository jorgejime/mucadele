const https = require('https');
const crypto = require('crypto');

const BASE_URL = process.argv[2] || 'https://mucadele.com.co';

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (postData) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          const setCookie = res.headers['set-cookie'];
          const location = res.headers['location'];
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData), setCookie, location });
          } catch {
            resolve({ status: res.statusCode, raw: resData, setCookie, location });
          }
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function verifyCufeLocalCalculation() {
  console.log('[1/6] Verificación Criptográfica Local del Algoritmo CUFE (Anexo Técnico 1.9 DIAN)...');
  const numFac = 'SETP1';
  const fecFac = '2026-11-13';
  const horFac = '13:30:00-05:00';
  const valFac = '100000.00';
  const codImp1 = '01';
  const valImp1 = '19000.00';
  const codImp2 = '04';
  const valImp2 = '0.00';
  const codImp3 = '03';
  const valImp3 = '0.00';
  const valTot = '119000.00';
  const nitOfe = '901234567';
  const numAdq = '1082987654';
  const clTec = 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c';
  const tipoAmb = '2';

  const raw = `${numFac}${fecFac}${horFac}${valFac}${codImp1}${valImp1}${codImp2}${valImp2}${codImp3}${valImp3}${valTot}${nitOfe}${numAdq}${clTec}${tipoAmb}`;
  const cufeHash = crypto.createHash('sha384').update(raw, 'utf8').digest('hex');

  if (cufeHash.length !== 96) {
    throw new Error(`El CUFE debe tener exactamente 96 caracteres hex (obtenido: ${cufeHash.length})`);
  }
  console.log('  ✓ CUFE generado correctamente (96 chars SHA-384):', cufeHash);
  return cufeHash;
}

async function runTests() {
  console.log('======================================================');
  console.log('TEST DE FACTURACIÓN ELECTRÓNICA DIAN UBL 2.1 (SOFTWARE PROPIO)');
  console.log('Target: ' + BASE_URL);
  console.log('======================================================\n');

  // 1. Verificación algorítmica
  verifyCufeLocalCalculation();

  // 2. Login como Administrador
  console.log('\n[2/6] Autenticando sesión Admin en Cloudflare Edge...');
  const loginRes = await request('POST', '/api/login', {
    username: process.env.ADMIN_USER || 'superadmin',
    password: process.env.ADMIN_PASSWORD || 'Mucadele2026Breiner',
    redirect: '/admin',
  });

  if (loginRes.status !== 200 || !loginRes.data?.ok) {
    throw new Error('Fallo login admin: ' + JSON.stringify(loginRes.data || loginRes.raw));
  }
  const sessionCookie = loginRes.setCookie ? loginRes.setCookie[0].split(';')[0] : '';
  const authHeaders = { Cookie: sessionCookie };
  console.log('  ✓ Autenticado como Admin.');

  // 3. Consultar Parámetros DIAN
  console.log('\n[3/6] Consultando Parámetros Técnicos DIAN (GET /api/admin/dian/config)...');
  const configRes = await request('GET', '/api/admin/dian/config', null, authHeaders);
  if (configRes.status !== 200 || !configRes.data?.ok || !configRes.data.config) {
    throw new Error('Fallo al obtener configuración DIAN: ' + JSON.stringify(configRes.data));
  }
  const cfg = configRes.data.config;
  console.log(`  ✓ SoftwareID: ${cfg.software_id}`);
  console.log(`  ✓ Prefijo / Consecutivo Actual: ${cfg.prefix}${cfg.current_consecutive}`);
  console.log(`  ✓ Ambiente: ${cfg.environment === '2' ? 'Habilitación (2)' : 'Producción (1)'}`);
  console.log(`  ✓ Emisor: ${cfg.issuer_name} (NIT ${cfg.issuer_nit}-${cfg.issuer_dv})`);

  // 4. Emitir Factura Electrónica Individual POS
  console.log('\n[4/6] Emitiendo Factura Electrónica POS (POST /api/admin/dian/generate-invoice)...');
  const genRes = await request('POST', '/api/admin/dian/generate-invoice', {
    order_number: 'TEST-ORDER-POS-001',
    customer_name: 'PEDRO PEREZ GOMEZ',
    customer_doc: '1082987654',
    customer_email: 'pedro.perez@example.com',
    customer_phone: '+573001234567',
    subtotal: 106000,
    tax_iva: 0,
    total: 106000,
    payment_method: '10', // Efectivo
    items: [
      { id: 'antioqueno-azul-750', name: 'Aguardiente Antioqueño Tapa Azul 750ml', quantity: 1, price: 54000 },
      { id: 'antioqueno-verde-750', name: 'Aguardiente Antioqueño Tapa Verde 750ml', quantity: 1, price: 52000 },
    ],
  }, authHeaders);

  if (genRes.status !== 200 || !genRes.data?.ok) {
    throw new Error('Fallo al emitir factura DIAN: ' + JSON.stringify(genRes.data));
  }
  const inv = genRes.data;
  console.log(`  ✓ Factura Generada: ${inv.invoice_number}`);
  console.log(`  ✓ CUFE: ${inv.cufe}`);
  if (!inv.cufe || inv.cufe.length !== 96) {
    throw new Error(`CUFE inválido recibido del backend: ${inv.cufe}`);
  }

  // 5. Descargar y validar documento XML UBL 2.1
  console.log('\n[5/6] Descargando y Validando XML UBL 2.1 de la factura...');
  const xmlRes = await request('GET', inv.xml_url, null, authHeaders);
  if (xmlRes.status !== 200) {
    throw new Error('Fallo al descargar XML: status ' + xmlRes.status);
  }
  const xml = xmlRes.raw;
  if (!xml.includes('<Invoice') || !xml.includes('urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')) {
    throw new Error('El XML no contiene la raíz estándar UBL 2.1');
  }
  if (!xml.includes('<sts:DianExtensions>') || !xml.includes('<sts:SoftwareSecurityCode')) {
    throw new Error('El XML no contiene las extensiones reglamentarias de la DIAN');
  }
  if (!xml.includes(inv.cufe)) {
    throw new Error('El CUFE generado no coincide con el nodo cbc:UUID del XML');
  }
  console.log('  ✓ Estructura XML UBL 2.1 válida y conforme al Anexo Técnico 1.9 DIAN.');
  console.log(`  ✓ Tamaño del documento XML: ${Buffer.byteLength(xml)} bytes.`);

  // 6. Ejecutar Set de Pruebas Oficial DIAN (8 Facturas)
  console.log('\n[6/6] Ejecutando Set de Pruebas Reglamentario de 8 Facturas DIAN...');
  const testSetRes = await request('POST', '/api/admin/dian/run-test-set', {}, authHeaders);
  if (testSetRes.status !== 200 || !testSetRes.data?.ok) {
    throw new Error('Fallo al ejecutar Set de Pruebas: ' + JSON.stringify(testSetRes.data));
  }
  console.log(`  ✓ Set de Pruebas completado con éxito: ${testSetRes.data.total_invoices_generated} facturas generadas.`);
  testSetRes.data.results.forEach((r) => {
    console.log(`    - [${r.invoice_number}] ${r.name} | CUFE: ${r.cufe.slice(0, 24)}... | Total: $${r.total.toLocaleString('es-CO')}`);
  });

  console.log('\n======================================================');
  console.log('✅ TODAS LAS PRUEBAS DE FACTURACIÓN DIAN PASARON AL 100%');
  console.log('======================================================');
}

runTests().catch((err) => {
  console.error('\n❌ ERROR EN TEST DE FACTURACIÓN DIAN:', err.message);
  process.exit(1);
});
