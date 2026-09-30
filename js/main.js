/* ==========================================================================
   MAIN JS: CONFIGURACIÓN WHATSAPP, DISPARO DE EVENTOS & TEST A/B
   ========================================================================== */

const CONFIG = {
  phone: '573000000000', // Reemplazar con el número oficial
  googleAdsConversionId: 'AW-XXXXXXXXX/AbCdEfGhIjK', // Etiqueta de conversión Google Ads
  messages: {
    general: 'Hola Electroingeniería, deseo cotizar conductores de cobre y aluminio con disponibilidad inmediata.',
    cobre_ingenieria: 'Hola Electroingeniería, requiero cotización de conductores de cobre para ingeniería y obra (THHN/THWN-2).',
    cobre_edificaciones: 'Hola Electroingeniería, solicito cotización para cables de cobre libres de halógeno (LSZH).',
    cobre_industria: 'Hola Electroingeniería, deseo cotizar cables encauchetados de cobre para maquinaria y uso pesado.',
    cobre_soldador: 'Hola Electroingeniería, solicito existencias de cable soldador extraflexible en cobre.',
    aluminio_multiplex: 'Hola Electroingeniería, deseo cotizar cable de aluminio Multiplex para redes aéreas.',
    aluminio_acometidas: 'Hola Electroingeniería, solicito cotización para aluminio XHHW-2 en ductos y acometidas.',
    aluminio_urbanismo: 'Hola Electroingeniería, requiero lote de aluminio para proyecto de urbanismo e infraestructura.',
    aluminio_distribucion: 'Hola Electroingeniería, solicito lista de precios por volumen de aluminio para distribuidores.',
    constructor: "Hola Electroingeniería, soy Cliente Constructor. Tenemos una obra en ejecución y deseo revisar mi listado de materiales para estructurar una cotización especial por volumen.",
    contratista: "Hola Electroingeniería, soy Contratista Eléctrico. Requiero enviar calibres y cantidades de conductores de cobre con disponibilidad inmediata.",
    distribuidor: "Hola Electroingeniería, soy Distribuidor. Deseo recibir el listado de referencias, existencias y precios para compras por volumen."
  }
};

/**
 * 1. Disparador Centralizado de WhatsApp con Doble Medición (Google + Meta)
 */
function sendWhatsApp(tipo) {
  const mensaje = CONFIG.messages[tipo] || CONFIG.messages.general;
  const urlWhatsApp = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(mensaje)}`;

  // Evento Meta Pixel (Lead / Contacto)
  if (typeof fbq === 'function') {
    fbq('track', 'Contact', {
      content_name: tipo,
      content_category: 'Conductores Cobre y Aluminio',
      status: 'click_whatsapp'
    });
  }

  // Evento Google Ads
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      send_to: CONFIG.googleAdsConversionId,
      event_category: 'WhatsApp',
      event_label: tipo
    });
  }

  // Apertura directa
  window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
}

/**
 * 2. Motor Test A/B para Titular H1 (Hero Section)
 */
document.addEventListener('DOMContentLoaded', () => {
  const heroTitleElement = document.querySelector('.hero-title');
  if (!heroTitleElement) return;

  const abVariants = [
    // Variante A
    'Cables y Alambres <span class="highlight-yellow">Cobre</span><br>Cables <span class="highlight-yellow">Aluminio</span>',
    // Variante B (Ligeramente diferente para medir clics)
    'Cables y Alambres de <span class="highlight-yellow">Cobre</span><br>Cables de <span class="highlight-yellow">Aluminio</span>'
  ];

  // Recuperar o asignar variante en la sesión actual
  let assignedVariant = sessionStorage.getItem('ab_hero_variant');
  if (assignedVariant === null) {
    assignedVariant = Math.random() < 0.5 ? 0 : 1;
    sessionStorage.setItem('ab_hero_variant', assignedVariant);
  } else {
    assignedVariant = parseInt(assignedVariant, 10);
  }

  // Inyectar el titular asignado
  heroTitleElement.innerHTML = abVariants[assignedVariant];

  // Registrar la variante expuesta en analíticas
  if (typeof gtag === 'function') {
    gtag('event', 'ab_test_impression', {
      experiment_name: 'hero_title_test',
      variant_id: `variante_${assignedVariant === 0 ? 'A' : 'B'}`
    });
  }
});
