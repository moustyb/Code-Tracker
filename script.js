// Day/Night mode
(function setDayNight(){
  const h = new Date().getHours();
  document.body.classList.add(h>=7 && h<19 ? "day" : "night");
})();

// Feather-like inline SVG icons
const ICONS = {
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  filter:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3"></polygon></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"></polyline></svg>`,
  trash:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6m5-3h4"></path></svg>`,
  download:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 5 17 10"></polyline><line x1="12" y1="5" x2="12" y2="21"></line></svg>`,
  sparkles:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z"></path></svg>`,
  folder:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 7h5l2 2h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>`,
  layout:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="18" height="7"></rect></svg>`,
  database:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 5v6c0 1.7-4 3-9 3s-9-1.3-9-3V5m0 6v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"></path></svg>`,
  flag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 4v16"></path><path d="M6 4h11l-1.5 3L17 10H6z"></path></svg>`,
  link:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"></path>
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"></path></svg>`
};

// Seed tasks (50 total)
const TASKS = [ /* ... same TASKS array from your original code ... */ ];

// Storage
const KEY="notion-program-tracker-v1";
const state = JSON.parse(localStorage.getItem(KEY) || "{}");
const save=()=>localStorage.setItem(KEY, JSON.stringify(state));
const getTaskState = (id)=>state[id]||{done:false,note:"",links:[],ts:null};

// Motivational quotes
const quotes = {
  25: "💡 \"First, solve the problem. Then, write the code.\" — John Johnson",
  50: "🏁 \"The best way to get a project done faster is to start sooner.\" — Jim Highsmith",
  75: "📘 \"Good code is its own best documentation.\" — Steve McConnell",
  100:"🔥 \"I have not failed. I've just found 10,000 ways that won't work.\" — Thomas Edison"
};
if (!state._shown) { state._shown = {}; save(); }

// Learning time tracker
if (!localStorage.getItem("trackerStart")) {
  localStorage.setItem("trackerStart", Date.now());
}
const startTime = parseInt(localStorage.getItem("trackerStart"), 10);
function formatDuration(ms){
  const mins = Math.floor(ms/60000), hrs = Math.floor(mins/60);
  return hrs>0 ? `${hrs}h ${mins%60}m` : `${mins}m`;
}

// DOM refs
const search=document.getElementById("search");
const category=document.getElementById("category");
const status=document.getElementById("status");
const count=document.getElementById("count");
const ratio=document.getElementById("ratio");
const barFill=document.getElementById("barFill");
const importFile=document.getElementById("importFile");
const timeEl=document.getElementById("time");

// Render icons
document.querySelectorAll("[data-icon]").forEach(el=>{
  const name=el.getAttribute("data-icon");
  el.innerHTML = ICONS[name] || "";
});

const sections = {
  foundation: document.getElementById("grid-foundation"),
  frontend: document.getElementById("grid-frontend"),
  backend: document.getElementById("grid-backend"),
  project: document.getElementById("grid-project"),
};

function matchesFilters(t){
  const q=(search.value||"").toLowerCase();
  const byText=!q || t.title.toLowerCase().includes(q) || String(t.id).includes(q) || t.tags.some(x=>x.toLowerCase().includes(q));
  const byCat = category.value==="all" || t.category===category.value;
  const done = !!getTaskState(t.id).done;
  const byStatus = status.value==="all" || (status.value==="done" ? done : !done);
  return byText && byCat && byStatus;
}

function render(){
  Object.values(sections).forEach(sec=>sec.innerHTML="");
  const visible = TASKS.filter(matchesFilters);

  // Stats
  const totalDone = TASKS.filter(t=>getTaskState(t.id).done).length;
  const pct = Math.round((totalDone/TASKS.length)*100);
  count.textContent = `${visible.length} shown • ${totalDone}/${TASKS.length} completed`;
  ratio.textContent = `Progress ${pct}%`;
  barFill.style.width = pct+"%";

  // Learning time
  const elapsed = Date.now() - startTime;
  timeEl.textContent = `Learning time ${formatDuration(elapsed)}`;

  // Milestone quotes
  [25,50,75,100].forEach(m=>{
    if (pct >= m && !state._shown[m]) {
      alert(`${quotes[m]}\n\nProgress: ${pct}% • Time
