const TASKS = [
  {id:1,title:"Hello world Page",cat:"html"},
  {id:2,title:"Personal Bio Page",cat:"html"},
  {id:3,title:"Favorite Links Page",cat:"html"},
  {id:4,title:"Simple Contact Page",cat:"html"},
  {id:5,title:"Basic Recipe Page",cat:"html"},
  {id:6,title:"Contact Form Page",cat:"html"},
  {id:7,title:"Weekly Schedule Table",cat:"html"},
  {id:8,title:"Image Gallery",cat:"html"},
  {id:9,title:"Multilingual Page",cat:"html"},
  {id:10,title:"Resume Page",cat:"html"},
  {id:11,title:"Blog Post Page",cat:"html"},
  {id:12,title:"Navigation Menu Page",cat:"html"},
  {id:13,title:"FAQ Page",cat:"html"},
  {id:14,title:"Product Page",cat:"html"},
  {id:15,title:"Portfolio Index Page",cat:"html"},
  {id:16,title:"FAQ Page with details/summary",cat:"html"},
  {id:17,title:"Event Invitation Page",cat:"html"},
  {id:18,title:"Newsletter Signup Page",cat:"html"},
  {id:19,title:"Audio & Video Showcase",cat:"html"},
  {id:20,title:"Accessibility Demo Page",cat:"html"},
  {id:21,title:"Bookstore Catalog Page",cat:"html"},
  {id:22,title:"Favorite Quotes Page",cat:"html"},
  {id:23,title:"Glossary Page",cat:"html"},
  {id:24,title:"Embedded Map Page",cat:"html"},
  {id:25,title:"Multi‑Page Mini Site",cat:"html"},
  {id:26,title:"Form with fieldset/legend/datalist",cat:"html"},
  {id:27,title:"Progress & Meter Demo",cat:"html"},
  {id:28,title:"Accessibility Showcase",cat:"html"},
  {id:29,title:"Glossary with dl",cat:"html"},
  {id:30,title:"Microdata / Structured Data Page",cat:"html"},
  {id:31,title:"Styled Bio Page",cat:"css"},
  {id:32,title:"Recipe Card",cat:"css"},
  {id:33,title:"Navigation Bar",cat:"css"},
  {id:34,title:"Image Gallery with Borders",cat:"css"},
  {id:35,title:"Resume with Sections",cat:"css"},
  {id:36,title:"Contact Form Styling",cat:"css"},
  {id:37,title:"Blog Post Layout",cat:"css"},
  {id:38,title:"Product Page with Cards",cat:"css"},
  {id:39,title:"Portfolio Index Page (Styled)",cat:"css"},
  {id:40,title:"Responsive Mini-Site",cat:"css"},
  {id:41,title:"Styled Digital Resume",cat:"css"},
  {id:42,title:"Landing Page",cat:"css"},
  {id:43,title:"Pricing Table",cat:"css"},
  {id:44,title:"Blog Layout",cat:"css"},
  {id:45,title:"Image Gallery with CSS Grid",cat:"css"},
  {id:46,title:"Contact Form Page (Styled)",cat:"css"},
  {id:47,title:"Portfolio Showcase",cat:"css"},
  {id:48,title:"Restaurant Menu Page",cat:"css"},
  {id:49,title:"Multi‑Page Personal Website",cat:"css"},
  {id:50,title:"Final Capstone: Personal Portfolio v1",cat:"css"},
];

const KEY="tracker50";
const state = JSON.parse(localStorage.getItem(KEY) || "{}");
const save = () => localStorage.setItem(KEY, JSON.stringify(state));

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const category = document.getElementById("category");
const status = document.getElementById("status");
const count = document.getElementById("count");
const ratio = document.getElementById("ratio");
const barFill = document.getElementById("barFill");

function matches(t){
  const q=(search.value||"").toLowerCase();
  const byText=!q || t.title.toLowerCase().includes(q) || String(t.id).includes(q);
  const byCat=category.value==="all" || t.cat===category.value;
  const done=!!state[t.id]?.done;
  const byStatus=status.value==="all" || (status.value==="done" ? done : !done);
  return byText && byCat && byStatus;
}

function render(){
  grid.innerHTML="";
  const visible = TASKS.filter(matches);
  const totalDone = TASKS.filter(t => state[t.id]?.done).length;
  const pct = Math.round((totalDone / TASKS.length) * 100);
  count.textContent = `${visible.length} shown • ${totalDone}/${TASKS.length} completed`;
  ratio.textContent = `${pct}% complete`;
  barFill.style.width = pct + "%";

  visible.forEach(t=>{
    const s = state[t.id] || {};
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="row">
        <label><input type="checkbox" id="chk-${t.id}" ${s.done ? "checked" : ""}/> #${t.id} ${t.title}</label>
      </div>
      <div class="tags"><span class="tag">${t.cat.toUpperCase()}</span></div>
      <textarea id="note-${t.id}" placeholder="Notes"></textarea>
    `;
    grid.appendChild(card);

    card.querySelector(`#chk-${t.id}`).addEventListener("change", (e)=>{
      state[t.id] = state[t.id] || {};
      state[t.id].done = e.target.checked;
      save(); render();
    });

    const note = card.querySelector(`#note-${t.id}`);
    note.value = s.note || "";
    note.addEventListener("input", (e)=>{
      state[t.id] = state[t.id] || {};
      state[t.id].note = e.target.value;
      save();
    });
  });
}

["input","change"].forEach(evt=>{
  search.addEventListener(evt, render);
  category.addEventListener(evt, render);
  status.addEventListener(evt, render);
});

render();
