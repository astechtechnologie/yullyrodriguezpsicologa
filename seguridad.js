/* V3.2 — preferencias locales, carga opcional y revocación. */
(() => {
'use strict';
const KEY='yully.privacy.v32', TTL=180*86400000, VERSION=1;
const blank=()=>({calendly:false,videos:false});
let choice=null, saved=true;
try { const x=JSON.parse(localStorage.getItem(KEY)); if(x && x.version===VERSION && Number.isFinite(x.date) && Date.now()>=x.date && Date.now()-x.date<TTL && typeof x.calendly==='boolean' && typeof x.videos==='boolean') choice=x; else localStorage.removeItem(KEY); } catch {saved=false;}
const initial=choice || blank();
const dialog=document.createElement('dialog');dialog.className='privacy-dialog';dialog.setAttribute('aria-labelledby','privacy-title');
dialog.innerHTML=`<div class="privacy-panel"><h2 id="privacy-title">Tu privacidad es importante</h2><p>Los servicios integrados son opcionales. Puedes usar enlaces directos sin activarlos.</p><div class="privacy-options"><label><input type="checkbox" checked disabled> Funciones esenciales</label><label><input type="checkbox" name="calendly"> Calendly: agenda integrada</label><label><input type="checkbox" name="videos"> Elfsight: videos integrados</label></div><p><a href="https://yullyrodriguez.pages.dev/cookies">Política de cookies</a> · <a href="https://yullyrodriguez.pages.dev/privacidad">Tratamiento de datos</a></p><div class="privacy-actions"><button type="button" data-choice="all">Aceptar todo</button><button type="button" data-choice="none">Solo esenciales</button><button type="button" data-choice="custom">Guardar selección</button></div><button type="button" class="privacy-dismiss">Cerrar sin cambiar</button></div>`;
document.body.append(dialog);
const fields={calendly:dialog.querySelector('[name=calendly]'),videos:dialog.querySelector('[name=videos]')};
let opener=null;
function open(){opener=document.activeElement;for(const k in fields)fields[k].checked=Boolean(choice?.[k]);if(!dialog.open)dialog.showModal();}
function close(){if(dialog.open)dialog.close();if(opener instanceof HTMLElement)opener.focus();}
function status(){document.querySelectorAll('[data-privacy-status]').forEach(e=>{e.textContent=choice?`Calendly: ${choice.calendly?'permitido':'desactivado'}. Elfsight: ${choice.videos?'permitido':'desactivado'}. ${saved?'Preferencias guardadas en este navegador.':'Preferencias temporales: el navegador no permite guardarlas.'}`:'Sin elección guardada. Solo funciones esenciales.';});}
const loaded=new Set();
function loadWidget(kind){const host=document.querySelector(`[data-private-widget="${kind}"]`);if(!host || loaded.has(kind))return;loaded.add(kind);host.replaceChildren();const node=document.createElement('div');const script=document.createElement('script');script.async=true;
if(kind==='calendly'){node.className='calendly-inline-widget';node.dataset.url=window.SITE_CONFIG?.redes?.calendly||'https://calendly.com/yullyrodriguezpsicologa/psicoterapia';node.style.cssText='min-width:0;height:700px';script.src='https://assets.calendly.com/assets/external/widget.js';script.onload=()=>{if(!node.querySelector('iframe') && window.Calendly?.initInlineWidget)window.Calendly.initInlineWidget({url:node.dataset.url,parentElement:node});};}else{node.className='elfsight-app-bcedbd94-6ef8-4c6f-ab08-8a1bf039c4a6';node.setAttribute('data-elfsight-app-lazy','');script.src='https://elfsightcdn.com/platform.js';}
script.onerror=()=>{host.textContent='No se pudo cargar el contenido integrado. Usa el enlace directo disponible en esta página.';};host.append(node,script);}
function apply(){for(const k of ['calendly','videos'])if(choice?.[k])loadWidget(k);status();}
function save(next){const revoke=[...loaded].some(k=>!next[k]);choice={version:VERSION,date:Date.now(),...next};try{localStorage.setItem(KEY,JSON.stringify(choice));saved=true;}catch{saved=false;}close();if(revoke){if(!saved){try{localStorage.removeItem(KEY);}catch{}}location.reload();return;}apply();}
dialog.addEventListener('click',e=>{const mode=e.target.closest('[data-choice]')?.dataset.choice;if(mode)save(mode==='all'?{calendly:true,videos:true}:mode==='none'?blank():{calendly:fields.calendly.checked,videos:fields.videos.checked});if(e.target.closest('.privacy-dismiss'))close();});
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
document.querySelectorAll('[data-privacy-open]').forEach(b=>{b.hidden=false;b.addEventListener('click',open);});
// Existing links remain available; no referrer is sent on external navigation.
document.querySelectorAll('a[href^="https://"]').forEach(a=>{a.rel='noopener noreferrer';});
apply();if(!choice)open();
window.addEventListener('storage',e=>{if(e.key===KEY || e.key===null)location.reload();});
})();
