/* Web Premium V3.1 — datos públicos de contacto, sin claves privadas. */
(() => {
const whatsappNumero = '573124954578';
const instagramHandle = 'yullyrodriguezpsicologa';
window.SITE_CONFIG = Object.freeze({
  nombre: 'Yully Mallerly Rodríguez Garzón',
  profesion: 'Psicología Clínica y de la Salud',
  instagramHandle,
  whatsappNumero,
  whatsappVisible: '+57 312 495 4578',
  tarjetaProfesional: null,
  direccionProfesional: null,
  correo: null, // Completar solo después de confirmar el correo oficial.
  redes: Object.freeze({
    instagram: 'https://www.instagram.com/' + instagramHandle + '/',
    linktree: 'https://linktr.ee/Yullyrodriguez',
    whatsapp: 'https://wa.me/' + whatsappNumero + '?text=' + encodeURIComponent('Hola Yully, quisiera información sobre terapia'),
    calendly: 'https://calendly.com/yullyrodriguezpsicologa/psicoterapia'
  }),
  colores: Object.freeze({principal:'#BBE5E1',acento:'#46D9BF',secundario:'#E8B890',detalle:'#BA8C75',blanco:'#FFFEFD',negro:'#000000'})
});


})();
