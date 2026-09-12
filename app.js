
const $ = s => document.querySelector(s);
const view = $("#view");
const toast = $("#toast");

const DEFAULTS = {
  theme:"dark", lang:"fr", bg:"assets/dubai.png",
  titles:{notes:"note idée", projects:"projet", motivation:"motivation"},
  notes:[], projects:[], quotes:[
    "“easy choices now make harder life, harder choices now makes easy life”"
  ]
};
let state = load();

function load(){
  try{
    const x=JSON.parse(localStorage.getItem("ZEN_STATE"));
    return {...DEFAULTS,...x,titles:{...DEFAULTS.titles,...(x?.titles||{})}};
  }catch{return structuredClone(DEFAULTS)}
}
function save(){localStorage.setItem("ZEN_STATE",JSON.stringify(state))}
function esc(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function notify(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove("show"),1800)}
function icon(name){
 const paths={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>',
 settings:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.9 1.9 0 0 0-3.2 1.4v.3a2 2 0 1 1-4 0v-.3A1.9 1.9 0 0 0 6.2 17l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.9 1.9 0 0 0 2 11h-.3a2 2 0 1 1 0-4H2a1.9 1.9 0 0 0 1.4-3.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.9 1.9 0 0 0 9.5 2v-.3a2 2 0 1 1 4 0V2a1.9 1.9 0 0 0 3.2 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.9 1.9 0 0 0 21 9.5h.3a2 2 0 1 1 0 4H21a1.9 1.9 0 0 0-1.6 1.5Z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 edit:'<path d="m4 20 4.5-1L19 8.5 15.5 5 5 16.5Z"/><path d="m13.5 7 3.5 3.5"/>',
 back:'<path d="m15 18-6-6 6-6"/>',
 trash:'<path d="M4 7h16M10 11v6m4-6v6M7 7l1 13h8l1-13M9 7V4h6v3"/>',
 star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
 folder:'<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19H4.5A1.5 1.5 0 0 1 3 17.5Z"/>',
 image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 2-2 5 5"/>',
 x:'<path d="m6 6 12 12M18 6 6 18"/>'
 };
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]||""}</svg>`;
}
function nav(active=1){
 return `<nav class="bottom-nav ${active===1?'':'compact'}">
   <button class="nav-side" data-go="4" aria-label="ZEN">${active===1?icon("settings"):icon("settings")}</button>
   <button class="nav-center ${active===1?'':'z'}" data-go="${active===1?0:0}" aria-label="Accueil">${active===1?'<img src="assets/home-icon.png">':'Z'}</button>
   <button class="nav-side" data-go="${active===1?'zen':'settings'}" aria-label="${active===1?'ZEN':'Réglages'}">${active===1?'<span style="font-weight:900;font-size:22px">Z</span>':icon("settings")}</button>
 </nav>`
}
// Correct side mapping per requested layout: in home left=ZEN, right=settings; menus: left=home, center=Z, right=settings.
function navFixed(active){
 if(active===1) return `<nav class="bottom-nav"><button class="nav-side" data-go="zen">${icon("star")}</button><button class="nav-center" data-go="0"><img src="assets/home-icon.png"></button><button class="nav-side" data-go="settings">${icon("settings")}</button></nav>`;
 return `<nav class="bottom-nav compact"><button class="nav-side" data-go="0">${icon("home")}</button><button class="nav-center z" data-go="zen">Z</button><button class="nav-side" data-go="settings">${icon("settings")}</button></nav>`;
}

function watch(type="classic", size="normal"){
 const now=new Date(), h=now.getHours()%12, m=now.getMinutes(), s=now.getSeconds(), ms=now.getMilliseconds();
 const hd=(h+m/60)*30, md=(m+s/60)*6, sd=(s+ms/1000)*6;
 let extra="";
 if(type==="chrono") extra=`<div class="subdial"></div><div class="subdial"></div><div class="subdial"></div><div class="date">${String(now.getDate()).padStart(2,"0")}</div>`;
 if(type==="skeleton") extra=`<div class="gear g1"></div><div class="gear g2"></div><div class="gear g3"></div>`;
 return `<div class="watch-wrap ${size==='mini'?'mini':''} ${size==='tiny'?'tiny':''}">
  <div class="watch ${type}" style="--hour:${hd}deg;--minute:${md}deg;--second:${sd}deg">
   ${type!=="skeleton"?`<div class="index">${Array.from({length:12},(_,i)=>`<span style="--i:${i}"></span>`).join("")}</div>`:""}
   <div class="numerals"><span class="n12">12</span><span class="n3">3</span><span class="n6">6</span><span class="n9">9</span></div>
   <div class="brand">MDG<em>MAISON D'OR</em></div>${extra}
   <div class="hand hour"></div><div class="hand minute"></div><div class="hand second"></div><div class="pin"></div>
  </div></div>`;
}
function clock(){
 const d=new Date(); return d.toLocaleTimeString(state.lang==="fr"?"fr-FR":"en-US",{hour:"numeric",minute:"2-digit",hour12:false});
}
function updateClocks(){
 document.querySelectorAll("[data-clock]").forEach(e=>e.textContent=clock());
 document.querySelectorAll(".live-watch").forEach(e=>{
   const type=e.dataset.type;
   const d=new Date(),h=d.getHours()%12,m=d.getMinutes(),s=d.getSeconds(),ms=d.getMilliseconds();
   e.querySelector(".hour").style.transform=`translate(-50%,-100%) rotate(${(h+m/60)*30}deg)`;
   e.querySelector(".minute").style.transform=`translate(-50%,-100%) rotate(${(m+s/60)*6}deg)`;
   e.querySelector(".second").style.transform=`translate(-50%,-100%) rotate(${(s+ms/1000)*6}deg)`;
   const date=e.querySelector(".date"); if(date) date.textContent=String(d.getDate()).padStart(2,"0");
 });
}
function renderWatch(type,size="normal"){
 return watch(type,size).replace(`class="watch ${type}"`,`class="watch live-watch ${type}" data-type="${type}"`);
}
function home(){
 view.innerHTML=`<section class="screen">
 <div class="home-hero">
   <div style="font-size:12px;letter-spacing:.22em;font-weight:800;opacity:.72;margin-bottom:-3px">CLASSIC</div>
   ${renderWatch("chrono")}
   <h3 class="hero-greeting">bonjour valentin</h3>
   <p class="quote">${esc(state.quotes[0]||DEFAULTS.quotes[0])}</p>
   <div class="nav-dots">
     <button class="nav-dot" data-go="2" aria-label="Notes">${icon("edit")}</button>
     <button class="nav-dot" data-go="3" aria-label="Projets">${icon("folder")}</button>
     <button class="nav-dot" data-go="4" aria-label="Motivation">${icon("star")}</button>
   </div>
 </div>${navFixed(1)}</section>`;
 bind();
}
function menuTop(type,label,subtitle){
 const w= type==="notes"?"classic":type==="projects"?"skeleton":"chrono";
 return `<div class="topbar">${renderWatch(w,"mini")}<div class="greeting"><h3>bonjour valentin</h3><p>${esc(label)}</p></div><button class="rename-btn" data-rename="${type}">${icon("edit")}</button></div><div class="clock" data-clock>${clock()}</div>`;
}
function notes(){
 const recent=[...state.notes].sort((a,b)=>b.created-a).slice(0,7);
 view.innerHTML=`<section class="screen">${menuTop("notes",state.titles.notes)}
 <div class="section-actions"><button class="pill-btn" data-filter="important">${state.lang==="fr"?"idée importante":"important idea"}</button><button class="pill-btn" data-filter="all">${state.lang==="fr"?"toutes les notes":"all notes"}</button></div>
 <div class="glass-panel list-panel">${recent.length?recent.map(n=>noteRow(n)).join(""):`<div class="empty-state">${state.lang==="fr"?"Aucune note pour l'instant.":"No notes yet."}</div>`}</div>
 <div class="mini-add-row"><button class="add-btn" data-add-note>+</button></div>${navFixed(2)}</section>`; bind();
}
function noteRow(n){
 return `<div class="note-row" data-note="${n.id}"><div class="note-text">${esc(n.text)}</div><button class="star-btn ${n.important?'active':''}" data-star="${n.id}">${icon("star")}</button><button class="star-btn trash" data-delete-note="${n.id}">${icon("trash")}</button></div>`
}
function projects(){
 view.innerHTML=`<section class="screen">${menuTop("projects",state.titles.projects)}
 <div class="cards">${state.projects.length?state.projects.map(p=>`<div class="project-card" data-project="${p.id}"><div class="folder">${icon("folder")} ${esc(p.name)}</div></div>`).join(""):`<div class="empty-state">${state.lang==="fr"?"Aucun projet. Appuie sur + pour créer ton premier dossier.":"No projects yet. Press + to create your first folder."}</div>`}</div>
 <div class="mini-add-row"><button class="add-btn" data-add-project>+</button></div>${navFixed(2)}</section>`;bind();
}
function projectDetail(id){
 const p=state.projects.find(x=>x.id===id); if(!p){projects();return}
 view.innerHTML=`<section class="screen">
 <div class="project-detail-head"><button class="back-btn" data-go="3">${icon("back")}</button><h2>${esc(p.name)}</h2></div>
 <div class="clock small" data-clock>${clock()}</div>
 <div class="section-actions"><button class="pill-btn" data-project-note="${p.id}">+ ${state.lang==="fr"?"note":"note"}</button><button class="pill-btn" data-import-note="${p.id}">↓ ${state.lang==="fr"?"note existante":"existing note"}</button><button class="pill-btn" data-project-photo="${p.id}">${icon("image")} photo</button></div>
 <div class="glass-panel list-panel">${p.notes?.length?p.notes.map(t=>`<div class="detail-note">${esc(t)}</div>`):`<div class="empty-state">${state.lang==="fr"?"Aucune note dans ce projet.":"No notes in this project."}</div>`}</div>
 ${p.photos?.length?`<div class="photo-grid">${p.photos.map(x=>`<img src="${x}" alt="">`).join("")}</div>`:""}
 <div class="mini-add-row"><button class="action danger" data-delete-project="${p.id}">${state.lang==="fr"?"Supprimer le projet":"Delete project"}</button></div>${navFixed(2)}</section>`;bind();
}
function motivation(){
 const quotes=state.quotes;
 view.innerHTML=`<section class="screen">${menuTop("motivation",state.titles.motivation)}
 <div class="motivation-title">MILLIONAIRE</div>
 <p class="motivation-quote">${esc(quotes[0]||DEFAULTS.quotes[0])}</p>
 <div class="glass-panel list-panel" style="margin-top:auto;margin-bottom:12px">${quotes.slice(1).map((q,i)=>`<div class="detail-note" data-q="${i+1}">${esc(q)} <button class="star-btn trash" data-delete-quote="${i+1}" style="float:right">${icon("trash")}</button></div>`).join("") || `<div class="empty-state">${state.lang==="fr"?"Ajoute tes propres citations avec +":"Add your own quotes with +"} </div>`}</div>
 <div class="mini-add-row"><button class="add-btn" data-add-quote>+</button></div>${navFixed(2)}</section>`;bind();
}
function zen(){
 view.innerHTML=`<section class="screen" style="justify-content:center">
 <div style="text-align:center">${renderWatch("classic")}<div class="clock" data-clock style="margin-top:18px">${clock()}</div></div>
 <button class="action secondary" data-go="0" style="align-self:center;width:180px;margin-top:20px">Quitter ZEN</button>
 </section>`;bind();
}
function settings(){
 view.innerHTML=`<section class="screen">
 <div class="project-detail-head"><button class="back-btn" data-go="0">${icon("back")}</button><h2>${state.lang==="fr"?"Réglages":"Settings"}</h2></div>
 <div class="glass-panel" style="padding:4px 17px;margin-top:14px">
  <div class="setting-row"><div><strong>${state.lang==="fr"?"Thème":"Theme"}</strong><span>${state.theme==="dark"?(state.lang==="fr"?"Sombre":"Dark"):(state.lang==="fr"?"Clair":"Light")}</span></div><button class="switch ${state.theme==="dark"?'on':''}" data-theme><i></i></button></div>
  <div class="setting-row"><div><strong>${state.lang==="fr"?"Langue":"Language"}</strong><span>${state.lang==="fr"?"Français":"English"}</span></div><select id="langSelect" style="width:110px;padding:9px;border-radius:12px;background:#151419;color:#fff"><option value="fr" ${state.lang==="fr"?"selected":""}>Français</option><option value="en" ${state.lang==="en"?"selected":""}>English</option></select></div>
  <div class="setting-row"><div><strong>${state.lang==="fr"?"Fond d'écran":"Wallpaper"}</strong><span>${state.lang==="fr"?"Choisir une photo":"Choose a photo"}</span></div><button class="action secondary" id="chooseBg" style="flex:0 0 auto">${state.lang==="fr"?"Choisir":"Choose"}</button></div>
  <div class="field"><img class="photo-preview" src="${esc(state.bg)}" alt=""></div>
  <div class="setting-row"><div><strong>ZEN</strong><span>${state.lang==="fr"?"Ouvre le mode minimal":"Open minimal mode"}</span></div><button class="action primary" data-go="zen" style="flex:0 0 auto">Z</button></div>
 </div>
 <div class="mini-add-row"><button class="action secondary" data-reset>${state.lang==="fr"?"Réinitialiser les données":"Reset data"}</button></div>
 ${navFixed(2)}</section>`;bind();
}
function modal(content){
 const b=document.createElement("div");b.className="modal-backdrop open";b.innerHTML=`<div class="modal">${content}</div>`;document.body.appendChild(b);return b;
}
function closeModal(b){b.remove()}
function addNote(){
 const b=modal(`<h2>${state.lang==="fr"?"Nouvelle note":"New note"}</h2><div class="field"><label>${state.lang==="fr"?"Note":"Note"}</label><textarea id="mText" autofocus></textarea></div><div class="modal-actions"><button class="action secondary" data-close>Annuler</button><button class="action primary" id="saveNote">${state.lang==="fr"?"Ajouter":"Add"}</button></div>`);
 b.querySelector("[data-close]").onclick=()=>closeModal(b);b.querySelector("#saveNote").onclick=()=>{const t=b.querySelector("#mText").value.trim();if(!t)return;state.notes.push({id:uid(),text:t,important:false,created:Date.now()});save();closeModal(b);notes();notify("Note ajoutée")};
}
function addProject(){
 const b=modal(`<h2>${state.lang==="fr"?"Nouveau projet":"New project"}</h2><div class="field"><label>${state.lang==="fr"?"Nom du dossier":"Folder name"}</label><input id="pName" autofocus></div><div class="modal-actions"><button class="action secondary" data-close>Annuler</button><button class="action primary" id="saveProject">Créer</button></div>`);
 b.querySelector("[data-close]").onclick=()=>closeModal(b);b.querySelector("#saveProject").onclick=()=>{const n=b.querySelector("#pName").value.trim();if(!n)return;state.projects.push({id:uid(),name:n,notes:[],photos:[]});save();closeModal(b);projects();notify("Projet créé")};
}
function rename(type){
 const b=modal(`<h2>${state.lang==="fr"?"Renommer le menu":"Rename menu"}</h2><div class="field"><label>${state.lang==="fr"?"Nouveau nom":"New name"}</label><input id="rName" value="${esc(state.titles[type])}" autofocus></div><div class="modal-actions"><button class="action secondary" data-close>Annuler</button><button class="action primary" id="saveRename">Enregistrer</button></div>`);
 b.querySelector("[data-close]").onclick=()=>closeModal(b);b.querySelector("#saveRename").onclick=()=>{const n=b.querySelector("#rName").value.trim();if(n){state.titles[type]=n;save();closeModal(b);route(type==="notes"?2:type==="projects"?3:4)}};
}
function addQuote(){
 const b=modal(`<h2>${state.lang==="fr"?"Nouvelle citation":"New quote"}</h2><div class="field"><label>${state.lang==="fr"?"Citation":"Quote"}</label><textarea id="qText" autofocus></textarea></div><div class="modal-actions"><button class="action secondary" data-close>Annuler</button><button class="action primary" id="saveQuote">Ajouter</button></div>`);
 b.querySelector("[data-close]").onclick=()=>closeModal(b);b.querySelector("#saveQuote").onclick=()=>{const q=b.querySelector("#qText").value.trim();if(!q)return;state.quotes.push(q);save();closeModal(b);motivation()};
}

function importNote(id){
 const p=state.projects.find(x=>x.id===id), available=state.notes.filter(n=>!(p.notes||[]).includes(n.text));
 if(!p)return;
 const b=modal(`<h2>${state.lang==="fr"?"Ajouter une note existante":"Add an existing note"}</h2>
 <div class="field"><label>${state.lang==="fr"?"Choisis une note":"Choose a note"}</label>
 <select id="existingNote">${available.length?available.map(n=>`<option value="${n.id}">${esc(n.text.slice(0,90))}</option>`).join(""):`<option value="">${state.lang==="fr"?"Aucune note disponible":"No notes available"}</option>`}</select></div>
 <div class="modal-actions"><button class="action secondary" data-close>Annuler</button><button class="action primary" id="importSave">Ajouter</button></div>`);
 b.querySelector("[data-close]").onclick=()=>closeModal(b);
 b.querySelector("#importSave").onclick=()=>{const n=state.notes.find(x=>x.id===b.querySelector("#existingNote").value);if(n){p.notes=p.notes||[];p.notes.push(n.text);save();closeModal(b);projectDetail(id);}};
}

function addProjectNote(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const b=modal(`<h2>${esc(p.name)}</h2><div class="field"><label>Note</label><textarea id="pn" autofocus></textarea></div><div class="modal-actions"><button class="action secondary" data-close>Annuler</button><button class="action primary" id="savePN">Ajouter</button></div>`);
 b.querySelector("[data-close]").onclick=()=>closeModal(b);b.querySelector("#savePN").onclick=()=>{const t=b.querySelector("#pn").value.trim();if(t){p.notes.push(t);save();closeModal(b);projectDetail(id)}}}
function addProjectPhoto(id){
 $("#projectPhotoPicker").dataset.project=id;$("#projectPhotoPicker").click();
}
function handlePhotoPicker(e){
 const id=e.target.dataset.project,p=state.projects.find(x=>x.id===id),file=e.target.files[0];if(!p||!file)return;
 const r=new FileReader();r.onload=()=>{p.photos=p.photos||[];p.photos.push(r.result);save();projectDetail(id);notify("Photo ajoutée")};r.readAsDataURL(file);e.target.value="";
}
function bind(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>route(b.dataset.go));
 document.querySelectorAll("[data-rename]").forEach(b=>b.onclick=()=>rename(b.dataset.rename));
 document.querySelectorAll("[data-add-note]").forEach(b=>b.onclick=addNote);
 document.querySelectorAll("[data-add-project]").forEach(b=>b.onclick=addProject);
 document.querySelectorAll("[data-add-quote]").forEach(b=>b.onclick=addQuote);
 document.querySelectorAll("[data-star]").forEach(b=>b.onclick=()=>{const n=state.notes.find(x=>x.id===b.dataset.star);if(n){n.important=!n.important;save();notes()}});
 document.querySelectorAll("[data-delete-note]").forEach(b=>b.onclick=()=>{state.notes=state.notes.filter(x=>x.id!==b.dataset.deleteNote);save();notes()});
 document.querySelectorAll("[data-project]").forEach(b=>b.onclick=()=>projectDetail(b.dataset.project));
 document.querySelectorAll("[data-project-note]").forEach(b=>b.onclick=()=>addProjectNote(b.dataset.projectNote));
 document.querySelectorAll("[data-import-note]").forEach(b=>b.onclick=()=>importNote(b.dataset.importNote));
 document.querySelectorAll("[data-project-photo]").forEach(b=>b.onclick=()=>addProjectPhoto(b.dataset.projectPhoto));
 document.querySelectorAll("[data-delete-project]").forEach(b=>b.onclick=()=>{if(confirm(state.lang==="fr"?"Supprimer ce projet ?":"Delete this project?")){state.projects=state.projects.filter(x=>x.id!==b.dataset.deleteProject);save();projects()}});
 document.querySelectorAll("[data-delete-quote]").forEach(b=>b.onclick=()=>{state.quotes.splice(Number(b.dataset.deleteQuote),1);if(!state.quotes.length)state.quotes=[DEFAULTS.quotes[0]];save();motivation()});
 document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>filterNotes(b.dataset.filter));
 document.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";applyTheme();save();settings()});
 const ls=$("#langSelect");if(ls)ls.onchange=()=>{state.lang=ls.value;save();route(currentPage)};
 const cb=$("#chooseBg");if(cb)cb.onclick=()=>$("#bgPicker").click();
 const reset=$("[data-reset]");if(reset)reset.onclick=()=>{if(confirm(state.lang==="fr"?"Tout effacer ?":"Erase everything?")){localStorage.removeItem("ZEN_STATE");state=load();applyTheme();home()}};
}
function filterNotes(type){
 const arr=state.notes.filter(n=>type==="important"?n.important:true).sort((a,b)=>b.created-a);
 const panel=document.querySelector(".list-panel");if(panel)panel.innerHTML=arr.length?arr.map(noteRow).join(""):`<div class="empty-state">Aucune note.</div>`;bind();
}
function applyTheme(){document.body.classList.toggle("light",state.theme==="light");document.documentElement.style.setProperty("--app-bg",`url("${state.bg}")`)}
let currentPage=0;
function route(r){
 if(r==="settings"){currentPage="settings";settings();return}
 if(r==="zen"){currentPage="zen";zen();return}
 r=Number(r);currentPage=r;
 if(r===0)home();else if(r===2)notes();else if(r===3)projects();else if(r===4)motivation();else home();
}
$("#bgPicker").addEventListener("change",e=>{
 const f=e.target.files[0];if(!f)return;
 const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas"),max=1600,scale=Math.min(1,max/img.width);c.width=img.width*scale;c.height=img.height*scale;c.getContext("2d").drawImage(img,0,0,c.width,c.height);state.bg=c.toDataURL("image/jpeg",.82);save();applyTheme();settings();notify("Fond modifié")};img.src=r.result};r.readAsDataURL(f);e.target.value="";
});
$("#projectPhotoPicker").addEventListener("change",handlePhotoPicker);
applyTheme();
setInterval(updateClocks,250);
setTimeout(()=>$("#splash").classList.add("hide"),1100);
route(0);
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
