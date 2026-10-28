/* Lumen prototype core: state, helpers, onboarding, analysis. Data comes from data.js and crawl-data.js (real captures). */

/* ================= ICONS ================= */
const ICONS={
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>',
 users:'<circle cx="9" cy="8" r="4"/><path d="M1 21c0-4 3.5-7 8-7s8 3 8 7M17 4a4 4 0 0 1 0 8M23 21c0-3-2-5.5-5-6.5"/>',
 building:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h6"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 palette:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.5 1.7-2.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
 file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 layers:'<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
 send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
 trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
 bar:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
 plug:'<path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0zM12 17v5"/>',
 insta:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
 fb:'<path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
 check:'<path d="M5 12l5 5L20 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 heart:'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z"/>',
 comment:'<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z"/>',
 play:'<polygon points="6 4 20 12 6 20"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
 bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01M9.5 17.5h5"/>',
 sliders:'<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.500.8-2.500 2s1 1.800 2.500 2 2.500.8 2.500 2-1 2-2.500 2c-1 0-2-.5-2.500-1.500M12 6v2M12 16v2"/>',
 chev:'<path d="M6 9l6 6 6-6"/>',
 timeline:'<path d="M3 6h12M3 12h18M3 18h8"/><circle cx="18" cy="6" r="2"/>',
 radar:'<polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/><polygon points="12 8 16 10.5 16 14 12 16.5 8 14 8 10.5"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.700 21a2 2 0 0 1-3.400 0"/>'
};
const I=(n,c='')=>`<svg class="i ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||''}</svg>`;

/* ================= HELPERS ================= */
const $=s=>document.querySelector(s);
const rupee=n=>'₹'+Number(Math.round(n)).toLocaleString('en-IN');
const r100=n=>Math.round(n/100)*100;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>s.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'');
const fmtNum=n=>Number(n).toLocaleString('en-IN');
const parseAmt=t=>{const v=parseFloat(String(t).replace(/[^\d.]/g,''));return isNaN(v)?0:v};

const CLIENTS={srv:SRV,parul:PARUL,wagh:WAGH};
const CITY_OPTIONS=['Pune','Bengaluru','Gurugram','Kolkata','Mumbai','Delhi NCR','Hyderabad','Chennai','Dubai'];
const INDUSTRIES=[['agency','Marketing agency'],['edu','Education'],['ecom','E-commerce'],['local','Local services'],['b2b','B2B / manufacturing']];
const GOALS=['Leads','Sales','Messages','Awareness'];

const S={
  phase:'onb',ob:0,view:'overview',role:null,
  f:{agency:'SRV Media',team:'21-50',goal:'Leads',biz:'SRV Media',site:'https://www.srvmedia.com',ind:'agency',budget:150000,
     cities:['Pune','Bengaluru','Gurugram','Kolkata'],comps:['Techmagnate','upGrowth Digital','Wildnet Technologies','FMA Digital'],
     cl:{srv:true,parul:true,wagh:true},mb:{srv:150000,parul:80000,wagh:60000}},
  clients:['srv'],cur:'srv',
  conn:{meta:false,ga4:false,gsc:false,ig:false,fb:false,openai:false,perplexity:false,gemini:false},
  approved:new Set(),launched:{},tasks:{},over:{},cap:{},prompts:[],comps:[],rules:{cpl:true,daily:true,reject:true,fatigue:true,shift:false},
  copy:{},toolLog:[],dnaOk:{},speed:1,tools:0,token:0,intervals:[],sim:null,sel:null,tour:null,visSel:'q1',compSel:'tm',auditSel:null,auditFilter:'all',auditQ:'',compGroup:'All'
};
const C=()=>CLIENTS[S.cur];
const mbOf=cid=>S.f.mb[cid]||0;
const capOf=cid=>S.cap[cid]!=null?S.cap[cid]:mbOf(cid);
const dayCap=cid=>r100(capOf(cid)/20);
const clearIntervals=()=>{S.intervals.forEach(clearInterval);S.intervals=[]};
const wait=ms=>new Promise(r=>setTimeout(r,ms*S.speed));

function tool(name,args,res){
  S.tools++;S.toolLog.push({t:Date.now(),name,args,res});
  const log=$('#log');const e=log.querySelector('.empty');if(e)e.remove();
  const el=document.createElement('div');el.className='tc';
  el.innerHTML=`<div class="tcn">${esc(name)}</div><div class="tca">${esc(args)}</div><div class="tcr">${esc(res)}</div>`;
  log.prepend(el);$('#toolN').textContent=S.tools;
  const b=$('#toolBtn');b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');
}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;$('#app').appendChild(t);setTimeout(()=>t.remove(),2400)}
function modal(html,mount){const o=$('#overlay');o.innerHTML=`<div class="modal"><div class="mbox">${html}</div></div>`;o.querySelector('.modal').onclick=e=>{if(e.target.classList.contains('modal'))closeModal()};if(mount)mount(o)}
function closeModal(){$('#overlay').innerHTML=''}
const stage=h=>{$('#stage').innerHTML=h};
const sh=(t,sub,right)=>`<div class="sh"><div><h1>${t}</h1>${sub?`<div class="sub">${sub}</div>`:''}</div><div class="ra">${right||''}</div></div>`;

function budHtml(key,val,min,max,step){return `<div class="bud"><input type="range" data-bk="${key}" min="${min}" max="${max}" step="${step}" value="${val}"><input type="text" class="amt" data-bt="${key}" value="${rupee(val)}"></div>`}
function bindBud(root,set){
  (root||document).querySelectorAll('.bud').forEach(b=>{
    const rg=b.querySelector('input[type=range]'),tx=b.querySelector('.amt'),k=rg.dataset.bk;
    rg.oninput=()=>{tx.value=rupee(rg.value);set(k,+rg.value)};
    tx.onchange=()=>{let v=parseAmt(tx.value);v=Math.max(+rg.min,Math.min(+rg.max,Math.round(v/+rg.step)*+rg.step));rg.value=v;tx.value=rupee(v);set(k,v)};
  });
}

/* ================= AUDIT (computed from the real crawl) ================= */
function auditIssues(){
  const P=CRAWL,I=[];
  const add=(sev,id,label,pages,hint)=>I.push({sev,id,label,pages,hint});
  add('error','err','Pages returning 4xx or 5xx',P.filter(p=>p.s>=400),'Broken pages waste crawl budget and lose visitors.');
  add('warn','slow','Slow response (over 3 s)',P.filter(p=>p.t>3),'Fetch time measured from this capture; slow pages lose paid traffic.');
  add('warn','heavy','HTML larger than 1 MB',P.filter(p=>p.kb>1000),'Very large documents slow rendering on mobile.');
  add('warn','h1','More than one H1',P.filter(p=>p.h1n>1),'One H1 per page keeps the topic clear for search and AI engines.');
  add('warn','title','Title longer than 60 characters',P.filter(p=>p.tl>60),'Titles are truncated in search results.');
  add('warn','desc','Meta description over 160 characters',P.filter(p=>p.dl>160),'Descriptions are truncated in search results.');
  add('warn','alt','More than half of images lack alt text',P.filter(p=>p.img>0&&p.noalt/p.img>.5),'Alt text feeds accessibility, image search and AI summaries.');
  add('notice','thin','Under 450 words of content',P.filter(p=>p.w<450),'Thin pages rarely earn citations in AI answers.');
  add('notice','schema','No structured data (JSON-LD)',P.filter(p=>p.schema===0),'Schema helps engines understand services, FAQs and organisation.');
  add('notice','redir','Redirected URL',P.filter(p=>p.f!==p.p),'Link to the final URL to save a hop.');
  return I;
}
function healthScore(){
  const P=CRAWL,I=auditIssues(),n=P.length;
  const uniq=sev=>new Set(I.filter(i=>i.sev===sev).flatMap(i=>i.pages.map(p=>p.p))).size;
  const e=uniq('error'),w=uniq('warn'),no=uniq('notice');
  return {score:Math.max(0,Math.round(100-100*(e/n)-45*(w/n)-15*(no/n))),e,w,n:no,pages:n};
}

/* ================= SEARCH VISIBILITY (computed from the real result sets) ================= */
function sovTable(){
  const q=SERP.filter(x=>!x.brand),m={};
  q.forEach(s=>s.named.forEach(a=>{m[a]=(m[a]||0)+1}));
  return Object.entries(m).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
}
function srvPresence(){const q=SERP.filter(x=>!x.brand);return {listed:q.filter(s=>s.results.some(r=>/srvmedia\.com/.test(r[1]))).length,named:q.filter(s=>s.named.includes('SRV Media')).length,total:q.length}}
function domainCounts(){const m={};SERP.filter(x=>!x.brand).forEach(s=>s.results.forEach(r=>{m[r[1]]=(m[r[1]]||0)+1}));return Object.entries(m).sort((a,b)=>b[1]-a[1])}

/* ================= CLAIM CHECK (real rules against what srvmedia.com states) ================= */
const SUPPORTED_NUM={'2x':'Parul University case study, srvmedia.com/parul-university/','140%':'QMUL case study, srvmedia.com/qmul/','5x':'Wagh Bakri case study, srvmedia.com/wagh-bakri/'};
function claimCheck(text){
  const out=[];
  if(/guarantee|assured|100\s?%/i.test(text))out.push(['bad','Guarantees and absolutes are rejected by Meta and not supported by any source']);
  if(/\b(best|#1|number one|top-rated|leading)\b/i.test(text))out.push(['warn','Superlative needs a cited source']);
  if(/award[- ]winning/i.test(text))out.push(['ok','"Award-winning": supported by Google Premier Partner Awards 2023 on srvmedia.com']);
  if(/google premier partner/i.test(text))out.push(['ok','"Google Premier Partner": stated on srvmedia.com']);
  if(/\b\d{2}\+?\s*years/i.test(text))out.push(['warn','Years claim conflicts: 15+ (site), 12 (YouTube), founded 2010/2011 (directories)']);
  (text.match(/\b\d+(\.\d+)?\s?(x|%)/gi)||[]).forEach(tok=>{const k=tok.toLowerCase().replace(/\s/g,'');if(SUPPORTED_NUM[k])out.push(['ok',`"${tok}": ${SUPPORTED_NUM[k]}`]);else if(!/100\s?%/.test(tok))out.push(['warn',`"${tok}" has no source on file`])});
  return out;
}

/* ================= PROPOSALS (built from the real findings) ================= */
const PROPS={
 srv:[
  {id:'p1',type:'campaign',t:'Free AI-visibility audit for marketing leaders',short:'GEO-AUDIT',cn:'SRV_LEAD_GEO-AUDIT_NOV26',share:.45,days:21,obj:'Leads',win:'29 Oct to 18 Nov',
   trig:'Absent from 6 of 6 category searches while /seo-services/ is titled "SEO AEO GEO Services"',
   why:['Searches for agencies in Pune and India for performance marketing, education and GEO return upGrowth, Techmagnate, OneCity and others, but not srvmedia.com','upGrowth and Techmagnate already publish AI-visibility proof (5.7x leads, 333k keywords cited in AI answers)','SRV already sells the service: its /seo-services/ page is titled "SEO Agency in Pune - SEO AEO GEO Services"'],
   aud:'Job titles: Marketing Director, Head of Marketing, CMO, Founder. Age 28-55. Interests: SEO, digital marketing',lp:'/seo-services/',ev:'sov',locsN:4,
   rev:[['Landing page has two H1 tags','H1 fix queued'],['Meta Pixel not in page source','Instant Form used until verified'],['"Award-winning" needs support','Supported on site (Google Premier Partner Awards 2023)'],['Years claim conflicts (15+ vs 12)','Years left out of ad copy']]},
  {id:'p2',type:'campaign',t:'Education admissions: SRV EDGE for universities',short:'EDU-ADMISSIONS',cn:'SRV_LEAD_EDU-ADMISSIONS_NOV26',share:.30,days:28,obj:'Leads',win:'29 Oct to 25 Nov',
   trig:'Education searches return FMA Digital, Unipro and Golden Markers, not SRV, despite 2X and 140% case results',
   why:['The "education + Pune" search returns only FMA Digital, which is also based in Baner','Proof is on srvmedia.com: Parul University 2X paid applications, QMUL 140% rise','Unipro and GrowthTrack position as education-only. SRV can lead on breadth plus named results'],
   aud:'Job titles: Director, Dean, Head of Admissions, Head of Marketing. Universities and B-schools. Age 30-60',lp:'/parul-university/',ev:'edu',locsN:2,
   rev:[['No dedicated SRV EDGE page in the sitemaps','Parul University case study used as landing page'],['Case figures are reported by SRV on its own site','Quoted as "SRV case study"'],['Meta Pixel not in page source','Instant Form used until verified']]},
  {id:'p3',type:'task',task:'pixel',t:'Install and verify Meta Pixel and LinkedIn Insight Tag',trig:'Not in page source. GTM-TJ7TQVF is present',
   why:['The homepage source lists GTM-TJ7TQVF and GA4 G-7V5SBDHJSS only','Retargeting and lead attribution need a verified Lead event','A browser-render check will confirm whether GTM already loads them']},
  {id:'p4',type:'campaign',t:'Website visitor retargeting',short:'RETARGET',cn:'SRV_LEAD_RETARGET_NOV26',share:.15,days:21,obj:'Leads',win:'29 Oct to 18 Nov',blockedBy:'pixel',
   trig:'Blocked until the Meta Pixel is verified',
   why:['Visitors who read service pages are the warmest audience','The audience cannot be built without a Pixel','Starts after the tracking task is marked done'],
   aud:'Website visitors, last 30 days. Lookalike 1% after pixel verification',lp:'/contact/',ev:'pixel',locsN:4,
   rev:[['No visitor audience exists yet','Audience builds after pixel verification'],['Traffic volume unknown','GA4 property needs connecting']]},
  {id:'p5',type:'locked',t:'Google Search: brand and category defence',trig:'Brand and category searches return no srvmedia.com result',locked:'Requires Google Ads, coming through AdIntel',
   why:['Search ads can capture the queries tested in Search visibility','Needs the Google Ads connector']}
 ],
 parul:[
  {id:'pr1',type:'task',task:'parul_tag',t:'Consolidate two GTM containers and add GA4',trig:'GTM-P4TP4N6D and GTM-59JNZQZF both load. No GA4 ID in source',why:['Two containers can double-fire tags','No Meta Pixel in source. Admissions leads need a verified Lead event']},
  {id:'pr2',type:'locked',t:'Admissions campaign',trig:'Full audit pending: only the homepage was scanned',locked:'Needs the full server-side audit',why:['The plan is built from the full crawl and search research']}
 ],
 wagh:[
  {id:'wr1',type:'task',task:'wagh_pixel',t:'Install Meta Pixel and Purchase event',trig:'GA4 G-LF0SCNYJLL present. No GTM or Meta Pixel in source',why:['Sales campaigns need a Purchase event','GA4 is present, so conversions can be imported later']},
  {id:'wr2',type:'task',task:'wagh_sitemap',t:'Publish a valid sitemap.xml',trig:'/sitemap.xml returned 404',why:['Crawlers rely on the sitemap to find pages']},
  {id:'wr3',type:'locked',t:'Catalog sales campaign',trig:'Full audit pending: only the homepage was scanned',locked:'Needs the full server-side audit',why:['The plan is built from the full crawl and search research']}
 ]
};
const budOfP=(cid,p)=>S.over[p.id]!=null?S.over[p.id]:r100(mbOf(cid)*(p.share||0));
const bud=p=>budOfP(S.cur,p);
const propsOf=cid=>PROPS[cid]||[];
const approvedOf=cid=>propsOf(cid).filter(p=>S.approved.has(p.id));
const usedFor=(cid,exceptId)=>approvedOf(cid).filter(p=>p.id!==exceptId).reduce((a,p)=>a+budOfP(cid,p),0);
const isBlocked=p=>!!p.blockedBy&&!S.tasks[p.blockedBy];
const canApprove=p=>p.type==='campaign'&&!isBlocked(p)&&usedFor(S.cur,p.id)+bud(p)<=capOf(S.cur);
function locsOf(p){const c=S.f.cities.length?S.f.cities:['Pune'];return c.slice(0,Math.min(p.locsN||c.length,c.length))}
function adsetsOf(p){
  const L=locsOf(p),W=[.35,.25,.2,.12,.08].slice(0,L.length),ws=W.reduce((a,b)=>a+b,0),total=bud(p);
  const rows=L.map((city,i)=>({city,amt:r100(total*W[i]/ws)}));
  const diff=total-rows.reduce((a,r)=>a+r.amt,0);if(rows.length)rows[0].amt+=diff;
  rows.forEach(r=>{r.daily=Math.round(r.amt/p.days)});return rows;
}
const lpPage=path=>CRAWL.find(c=>c.p===path||c.f===path);

/* ================= WORKSPACE BAR + NAV ================= */
const NAV=[
 ['Workspace',[['overview','grid','Overview'],['workplan','timeline','Workplan'],['autopilot','bolt','Autopilot']]],
 ['Campaigns',[['campaigns','layers','Campaigns'],['library','image','Creative library'],['templates','sliders','Templates']]],
 ['Brand and research',[['brand','palette','Brand DNA'],['geo','radar','GEO audit'],['audit','file','Site audit'],['visibility','search','Search visibility'],['competitors','users','Competitors'],['social','globe','Social']]],
 ['Insights',[['analytics','bar','Analytics'],['profit','coin','Profitability'],['reports','file','Reports']]],
 ['Admin',[['connections','plug','Connections']]]
];
const CAMP_SUB=[['plan','Plan'],['creative','Creative studio'],['launch','Launch'],['monitor','Monitor']];
const VIEW_LABEL={portfolio:'All clients',plan:'Plan',creative:'Creative studio',launch:'Launch',monitor:'Monitor'};
function viewLabel(v){if(VIEW_LABEL[v])return VIEW_LABEL[v];for(const g of NAV)for(const it of g[1])if(it[0]===v)return it[2];return v}
const orgName=()=>S.role==='agency'?S.f.agency:S.f.biz;
const pendingFor=cid=>propsOf(cid).filter(p=>p.type==='campaign'&&!S.approved.has(p.id)&&!isBlocked(p)).length;
function renderWs(){
  const el=$('#ws');
  if(!S.role){el.innerHTML='<span class="wsb">New workspace</span>';return}
  if(S.phase!=='app'){el.innerHTML=`<span class="wsb">${I(S.role==='agency'?'building':'user')} ${esc(orgName())} <em>${S.role==='agency'?'Agency':'Individual'}</em></span>`;return}
  const crumb=[orgName()];if(S.role==='agency'&&S.view!=='portfolio')crumb.push(C().name+(C().own?' (own brand)':''));crumb.push(viewLabel(S.view));
  el.innerHTML='<span class="crumb">'+crumb.map((c,i)=>i===crumb.length-1?`<b>${esc(c)}</b>`:esc(c)).join(' <i>/</i> ')+'</span>';
  renderBell();
}
document.addEventListener('click',e=>{
  document.querySelectorAll('.cdrop.open').forEach(d=>{if(!d.parentElement.contains(e.target))d.classList.remove('open')});
  if(!e.target.closest('#demo')&&!e.target.closest('#demoBtn'))$('#demo').classList.remove('open');
  if(!e.target.closest('#inbox')&&!e.target.closest('#bellBtn'))$('#inbox').classList.remove('open');
});
function switchClient(id){S.cur=id;S.sel=null;if(S.view==='portfolio')S.view='overview';renderWs();renderSide();renderView()}

/* notifications: everything that waits for a human, across clients */
function inboxItems(){
  const out=[];
  S.clients.forEach(cid=>{
    propsOf(cid).forEach(p=>{
      if(p.type==='campaign'&&!S.approved.has(p.id)&&!isBlocked(p))out.push({cid,v:'autopilot',t:'Approve: '+p.t,s:CLIENTS[cid].short+' · campaign proposal'});
      if(p.type==='task'&&!S.tasks[p.task])out.push({cid,v:'autopilot',t:p.t,s:CLIENTS[cid].short+' · setup task'});
    });
  });
  S.approved.forEach(id=>{if(!S.launched[id]){const cid=S.clients.find(c=>propsOf(c).some(p=>p.id===id));if(cid)out.push({cid,v:'launch',t:'Launch approved campaign',s:CLIENTS[cid].short+' · '+id.toUpperCase()})}});
  if(!S.conn.meta)out.push({cid:S.cur,v:'connections',t:'Connect Meta Ads',s:'Required to launch'});
  return out;
}
function renderBell(){
  const n=inboxItems().length;const b=$('#bellBtn');if(!b)return;
  b.querySelector('b').textContent=n;
}
function openInbox(){
  const it=inboxItems();
  $('#inbox').innerHTML='<h4>Needs you ('+it.length+')</h4>'+(it.length?it.map((x,i)=>`<div class="rule" data-i="${i}"><div class="tx"><b style="font-weight:500">${esc(x.t)}</b><small>${esc(x.s)}</small></div>${I('ext')}</div>`).join(''):'<div class="empty" style="padding:8px">Nothing is waiting for you.</div>');
  $('#inbox').classList.toggle('open');
  $('#inbox').querySelectorAll('[data-i]').forEach(r=>r.onclick=()=>{const x=it[+r.dataset.i];$('#inbox').classList.remove('open');S.cur=x.cid;renderWs();openView(x.v)});
}

function renderSide(){
  const own=C().own,ag=S.role==='agency',org=orgName();
  const campView=['plan','creative','launch','monitor'].includes(S.view);
  const badge={autopilot:pendingFor(S.cur)||'',audit:own?auditIssues().filter(i=>i.pages.length).length:'',visibility:own?srvPresence().named+'/'+srvPresence().total:'',campaigns:propsOf(S.cur).filter(p=>p.type==='campaign').length||''};
  let h=`<div class="wsw"><button class="wsb2" id="wsw"><span class="mk">${esc(org.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase())}</span><div><b>${esc(org)}</b><small>${ag?'Agency workspace':'Individual workspace'}</small></div>${I('chev')}</button><div class="cdrop" id="wsmenu"><button data-ws="cur"><span class="dotc" style="background:var(--green)"></span>${esc(org)} (current)</button><button data-ws="new">${I('plus')} New workspace</button></div></div>
   <button class="cmdk" id="cmdk">${I('search')}<span>Search or jump to</span><kbd>Ctrl K</kbd></button>`;
  if(ag){
    h+='<h6>Clients</h6>'+`<button class="ni ${S.view==='portfolio'?'on':''}" data-v="portfolio">${I('grid')}All clients</button>`
     +S.clients.map(id=>`<button class="ni cl ${S.cur===id&&S.view!=='portfolio'?'cur':''}" data-cl="${id}"><span class="dotc" style="background:${CLIENTS[id].color}"></span>${esc(CLIENTS[id].short)}${pendingFor(id)?`<span class="nb">${pendingFor(id)}</span>`:''}</button>`).join('');
  }
  NAV.forEach(([g,items])=>{
    h+=`<h6>${g}</h6>`;
    items.forEach(([id,ic,lb])=>{
      const on=S.view===id,par=id==='campaigns'&&campView;
      h+=`<button class="ni ${on?'on':par?'par':''}" data-v="${id}">${I(ic)}${lb}${badge[id]?`<span class="nb">${badge[id]}</span>`:''}</button>`;
      if(id==='campaigns'&&campView)CAMP_SUB.forEach(([sid,sl])=>{h+=`<button class="ni sub ${S.view===sid?'on':''}" data-v="${sid}">${sl}</button>`});
    });
  });
  $('#side').innerHTML=h;
  $('#side').querySelectorAll('.ni[data-v]').forEach(b=>b.onclick=()=>openView(b.dataset.v));
  $('#side').querySelectorAll('[data-cl]').forEach(b=>b.onclick=()=>switchClient(b.dataset.cl));
  $('#wsw').onclick=e=>{e.stopPropagation();$('#wsmenu').classList.toggle('open')};
  $('#wsmenu').querySelectorAll('[data-ws]').forEach(b=>b.onclick=()=>{$('#wsmenu').classList.remove('open');if(b.dataset.ws==='new')modal('<h3>New workspace</h3><p>A workspace holds one agency or one brand with its own clients, connections, templates and approval rules. Creating one provisions a separate tenant on Lumen\'s servers, which this prototype does not include.</p><div class="ft"><button class="btn" onclick="closeModal()">Understood</button></div>')});
  $('#cmdk').onclick=openCmdK;
  renderBell();
}
function openView(v){S.token++;clearIntervals();S.view=v;renderWs();renderSide();renderView();if(typeof stopTourOnUser==='function')stopTourOnUser()}
function renderView(){S.token++;clearIntervals();const f=VIEWS[S.view];if(f)f()}
function enterApp(){S.phase='app';S.view=S.role==='agency'?'portfolio':'overview';$('#app').classList.remove('onb');renderWs();renderSide();renderView()}

/* command palette */
function openCmdK(){
  const items=[];
  if(S.role==='agency'){items.push(['All clients','View',()=>openView('portfolio')]);S.clients.forEach(id=>items.push([CLIENTS[id].name,'Client',()=>switchClient(id)]))}
  NAV.forEach(([g,its])=>its.forEach(it=>items.push([it[2],g,()=>openView(it[0])])));
  CAMP_SUB.forEach(it=>items.push([it[1],'Campaigns',()=>openView(it[0])]));
  items.push(['Start guided tour','Action',()=>startTour()]);
  $('#overlay').innerHTML='<div class="modal" style="align-items:start;padding-top:12vh"><div class="mbox cmdm"><input type="text" id="cmdIn" placeholder="Search views, clients and actions" autocomplete="off"><div class="cmdl" id="cmdL"></div></div></div>';
  let sel=0,list=items;
  const draw=()=>{$('#cmdL').innerHTML=list.length?list.map((x,i)=>`<button class="cmdi ${i===sel?'on':''}" data-i="${i}">${esc(x[0])}<small>${esc(x[1])}</small></button>`).join(''):'<div class="empty" style="padding:10px">No match</div>';$('#cmdL').querySelectorAll('.cmdi').forEach(b=>b.onclick=()=>{closeModal();list[+b.dataset.i][2]()})};
  draw();
  const inp=$('#cmdIn');inp.focus();
  inp.oninput=()=>{const q=inp.value.toLowerCase();list=items.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(q));sel=0;draw()};
  inp.onkeydown=e=>{if(e.key==='ArrowDown'){sel=Math.min(sel+1,list.length-1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);draw();e.preventDefault()}else if(e.key==='Enter'&&list[sel]){closeModal();list[sel][2]()}else if(e.key==='Escape')closeModal()};
  $('#overlay').querySelector('.modal').onclick=e=>{if(e.target.classList.contains('modal'))closeModal()};
}
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&S.phase==='app'){e.preventDefault();openCmdK()}});

/* ================= ONBOARDING ================= */
const OB_STEPS=['Workspace','Connect','Analyse'];
function obBar(){return `<div class="obs">${OB_STEPS.map((s,i)=>`<span class="${i===S.ob?'on':i<S.ob?'done':''}"><b>${i<S.ob?I('check'):i+1}</b>${s}</span>`).join('<i></i>')}</div>`}
function renderOnb(){[ob0,ob1,ob2][S.ob]()}
function obGo(n){S.token++;clearIntervals();stopSim();S.ob=n;renderWs();renderOnb()}
function chipsHtml(list,sel,attr){return list.map(c=>`<button class="pill ${sel.includes(c)?'on':''}" ${attr}="${esc(c)}">${esc(c)}</button>`).join('')}

function ob0(){
  const f=S.f,ag=S.role==='agency';
  const form=!S.role?'<div class="empty">Choose how you will use Lumen to continue.</div>':ag?`
    <div class="fg">
      <div><span class="lbl">Agency name</span><input type="text" id="fAg" value="${esc(f.agency)}"></div>
      <div><span class="lbl">Team size</span><select id="fTeam">${['1-5','6-20','21-50','51-200','200+'].map(x=>`<option ${f.team===x?'selected':''}>${x}</option>`).join('')}</select></div>
      <div><span class="lbl">Primary goal for clients</span><select id="fGoal">${GOALS.map(x=>`<option ${f.goal===x?'selected':''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="hr"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px"><span class="lbl" style="margin:0">Clients to analyse (public websites)</span><button class="btn sm ghost" id="addCl">${I('plus')} Add client</button></div>
    <div>${['srv','parul','wagh'].map(id=>{const c=CLIENTS[id];return `<div class="crow2"><input type="checkbox" data-cl="${id}" ${f.cl[id]?'checked':''}><div><b>${esc(c.name)}${c.own?' (own brand)':''}</b><small>${esc(c.domain)}</small></div><small>${esc(c.vertical)}</small><div>${budHtml('mb_'+id,f.mb[id],10000,1000000,5000)}</div></div>`}).join('')}</div>
    <div style="font-size:11.5px;color:var(--muted);margin-top:4px">Monthly ad budget per client. Lumen splits it across campaigns and never plans beyond it.</div>`
  :`<div class="fg">
      <div><span class="lbl">Business name</span><input type="text" id="fBiz" value="${esc(f.biz)}"></div>
      <div><span class="lbl">Website</span><input type="text" id="fSite" value="${esc(f.site)}"></div>
      <div><span class="lbl">Industry</span><select id="fInd">${INDUSTRIES.map(x=>`<option value="${x[0]}" ${f.ind===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div>
      <div><span class="lbl">Primary goal</span><select id="fGoal">${GOALS.map(x=>`<option ${f.goal===x?'selected':''}>${x}</option>`).join('')}</select></div>
      <div class="s2"><span class="lbl">Monthly ad budget</span>${budHtml('budget',f.budget,10000,1000000,5000)}</div>
      <div class="s3"><span class="lbl">Target locations (up to 5)</span><div class="pills" id="cityPills">${chipsHtml(CITY_OPTIONS,f.cities,'data-city')}</div></div>
      <div class="s3"><span class="lbl">Competitors to track</span><div class="pills" id="compPills">${f.comps.map(c=>`<span class="pill on">${esc(c)}<span class="x" data-rc="${esc(c)}">${I('x')}</span></span>`).join('')}<input type="text" id="compIn" placeholder="Add a competitor and press Enter" style="width:230px;padding:5px 12px;border-radius:99px"></div></div>
    </div>`;
  stage(`<div class="ob">${obBar()}
    <div class="roles"><button class="role ${S.role==='individual'?'on':''}" data-r="individual"><div class="ri">${I('user')}</div><div><b>Individual</b><span>I run ads for my own business</span></div></button><button class="role ${S.role==='agency'?'on':''}" data-r="agency"><div class="ri">${I('building')}</div><div><b>Agency</b><span>I manage ads for several clients</span></div></button></div>
    <div class="card" style="flex:1"><div class="cb sc">${form}</div></div>
    <div class="obf"><span style="font-size:12px;color:var(--muted)">Nothing is sent anywhere until you continue.</span><button class="btn" id="obNext" ${canObNext()?'':'disabled'}>Continue</button></div></div>`);
  document.querySelectorAll('.role').forEach(b=>b.onclick=()=>{S.role=b.dataset.r;renderWs();ob0()});
  $('#obNext').onclick=()=>{commitWorkspace();obGo(1)};
  if(!S.role)return;
  const upd=()=>{$('#obNext').disabled=!canObNext();renderWs()};
  if(ag){
    $('#fAg').oninput=e=>{f.agency=e.target.value;upd()};$('#fTeam').onchange=e=>{f.team=e.target.value};$('#fGoal').onchange=e=>{f.goal=e.target.value};
    document.querySelectorAll('[data-cl]').forEach(c=>c.onchange=()=>{f.cl[c.dataset.cl]=c.checked;upd()});
    bindBud(document,(k,v)=>{f.mb[k.replace('mb_','')]=v});
    $('#addCl').onclick=()=>modal(`<h3>Add a client</h3><p>Adding a client starts a live crawl, search research and brand extraction on Lumen's servers. This prototype runs without a backend, so only the three clients listed carry captured data.</p><div class="ft"><button class="btn" onclick="closeModal()">Understood</button></div>`);
  }else{
    $('#fBiz').oninput=e=>{f.biz=e.target.value;upd()};$('#fSite').oninput=e=>{f.site=e.target.value};
    $('#fInd').onchange=e=>{f.ind=e.target.value};$('#fGoal').onchange=e=>{f.goal=e.target.value};
    bindBud(document,(k,v)=>{f.budget=v});
    document.querySelectorAll('[data-city]').forEach(b=>b.onclick=()=>{const c=b.dataset.city,i=f.cities.indexOf(c);if(i>=0){if(f.cities.length>1)f.cities.splice(i,1)}else if(f.cities.length<5)f.cities.push(c);else toast('Up to 5 locations');ob0()});
    document.querySelectorAll('[data-rc]').forEach(x=>x.onclick=()=>{f.comps=f.comps.filter(c=>c!==x.dataset.rc);ob0()});
    $('#compIn').onkeydown=e=>{if(e.key==='Enter'&&e.target.value.trim()){f.comps.push(e.target.value.trim());ob0()}};
  }
}
function canObNext(){if(!S.role)return false;if(S.role==='agency')return !!S.f.agency.trim()&&['srv','parul','wagh'].some(id=>S.f.cl[id]);return !!S.f.biz.trim()}
function commitWorkspace(){
  const f=S.f;S.approved=new Set();S.launched={};S.tasks={};S.over={};S.cap={};S.sim=null;S.copy={};
  if(S.role==='agency'){S.clients=['srv','parul','wagh'].filter(id=>f.cl[id])}
  else{S.clients=['srv'];f.mb.srv=f.budget}
  S.cur=S.clients[0];S.comps=f.comps.slice();
}

function ob1(){
  const k=S.conn;
  const rows=[
   ['meta','Meta Ads','Via AdIntel. Reads campaigns, ad sets, ads, spend and leads. Publishes only within your approval rules','Connect','ads'],
   ['ga4','Google Analytics 4','Reads sessions, conversions and landing pages. Tag G-7V5SBDHJSS was found on srvmedia.com','Connect','ga'],
   ['gsc','Google Search Console','Reads queries, clicks and indexing for the verified property','Connect','gsc'],
   ['ig','Instagram','Reads post and reel performance. The public profile only gives follower counts','Connect','ig'],
   ['fb','Facebook Page','Reads page insights and lead forms','Connect','fb'],
   ['openai','OpenAI API key','Samples ChatGPT answers for your tracked prompts','Add key','key'],
   ['perplexity','Perplexity API key','Samples Perplexity answers and citations','Add key','key'],
   ['gemini','Gemini API key','Samples Gemini and AI Overviews answers','Add key','key']];
  stage(`<div class="ob">${obBar()}
    <div class="card" style="flex:1"><h3>Connections <span class="chip">${Object.values(k).filter(Boolean).length} connected</span></h3><div class="cb sc">
      ${rows.map(r=>`<div class="rule"><div class="tx"><b style="font-weight:500">${r[1]}</b><small>${r[2]}</small></div>${k[r[0]]?`<span class="chip g">Connected</span><button class="btn sm ghost" data-off="${r[0]}">Disconnect</button>`:`<button class="btn sm" data-on="${r[0]}" data-kind="${r[4]}">${r[3]}</button>`}</div>`).join('')}
      <div class="rule"><div class="tx"><b style="font-weight:500">Google Ads</b><small>Coming through AdIntel</small></div><span class="chip">Coming soon</span></div>
      <div class="rule"><div class="tx"><b style="font-weight:500">LinkedIn Ads</b><small>Not yet supported</small></div><span class="chip">Coming soon</span></div>
    </div></div>
    <div class="obf"><button class="btn ghost" id="obBack">Back</button><div style="display:flex;gap:12px;align-items:center"><span style="font-size:12px;color:var(--muted)">Connections are optional now. Meta Ads is needed to launch.</span><button class="btn" id="obNext">Start analysis</button></div></div></div>`);
  $('#obBack').onclick=()=>obGo(0);$('#obNext').onclick=()=>obGo(2);
  document.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{S.conn[b.dataset.off]=false;ob1()});
  document.querySelectorAll('[data-on]').forEach(b=>b.onclick=()=>connectFlow(b.dataset.on,b.dataset.kind,ob1));
}
function connectFlow(key,kind,after){
  if(kind==='key'){
    modal(`<h3>Add API key</h3><p>The key is used to ask the engine your tracked prompts on a schedule. It is stored on the server, encrypted, and never shown again.</p><input type="password" id="apiK" placeholder="Paste key" style="width:100%;padding:9px 13px;border:1px solid var(--line);border-radius:12px;background:var(--soft)"><div class="ft"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn" id="saveK">Save key</button></div>`,()=>{$('#saveK').onclick=()=>{if(!$('#apiK').value.trim()){toast('Paste a key first');return}S.conn[key]=true;closeModal();tool('connect.'+key,'type=api_key','saved, first scan scheduled');after()}});
    return;
  }
  const scopes={ads:['ads_management','ads_read','business_management','pages_show_list','leads_retrieval'],ga:['analytics.readonly'],gsc:['webmasters.readonly'],ig:['instagram_basic','instagram_manage_insights'],fb:['pages_read_engagement','pages_show_list']}[kind];
  modal(`<h3>Authorize Lumen</h3><p>You are sent to the provider to approve these permissions. Lumen requests the minimum needed and publishes nothing outside your approval rules.</p><div class="pills" style="margin-bottom:6px">${scopes.map(s=>`<span class="pill mono">${s}</span>`).join('')}</div><div class="ft"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn" id="authB">Authorize</button></div>`,()=>{$('#authB').onclick=()=>{S.conn[key]=true;closeModal();tool('connect.'+key,'scopes='+scopes.join(','),'authorized');after()}});
}

/* ----- analysis: replays the real capture as a timeline ----- */
const SRC_ROWS=[['site','globe','Website crawl'],['stack','plug','Tech stack'],['audit','file','Site audit'],['brand','palette','Brand extraction'],['social','users','Social profiles'],['search','search','Search visibility'],['comps','building','Competitors']];
function buildEvents(cid){
  const ev=[];
  const T=(s,start)=>{let t=start;return (dt,vb,tg,rs,rev,w)=>ev.push({s,t:(t+=dt),vb,tg,rs,rev:rev||'',w:!!w})};
  if(cid==='srv'){
    const site=T('site',0);
    site(100,'GET','srvmedia.com/','301 to www.srvmedia.com');
    site(200,'GET','/robots.txt','200 · 228 B · 7 disallow rules');
    site(200,'GET','/sitemap_index.xml','200 · 5 sitemaps');
    SRV.page.sitemaps.forEach(sm=>site(150,'GET','/'+sm[0],'200 · '+sm[1]+' URLs · lastmod '+sm[2]));
    site(150,'PARSE','sitemaps',SRV.sitemapTotal+' URLs in sitemaps. Sampling '+CRAWL.length+' key pages');
    CRAWL.forEach((p,i)=>site(130,'GET',p.p,p.s+' · '+p.kb+' KB · '+p.t+' s · '+p.title,'',p.t>3));
    const st=T('stack',2600);
    SRV.tech.detected.forEach(d=>st(220,'DETECT',d[0],d[1]+' · '+d[2]));
    SRV.tech.notFound.forEach(n=>st(160,'CHECK',n,'not in page source','',true));
    st(180,'NOTE','GTM-TJ7TQVF','may load these tags dynamically. Needs a render check','',true);
    const br=T('brand',1500);
    br(300,'EXTRACT','logo','srv-logo-svg.svg · 17.9 KB','logo');
    br(300,'EXTRACT','tagline',SRV.heroLines[1],'tag');
    br(300,'EXTRACT','colours','#DA1F26 #1863DC #212121 #FF3A2D #F4F4F4','palette');
    br(300,'EXTRACT','fonts','Raleway, Roboto, Quicksand','fonts');
    br(300,'EXTRACT','services',SRV.services.length+' services from navigation','services');
    br(300,'EXTRACT','industries',SRV.industries.length+' industries, incl. Education (SRV EDGE)');
    br(300,'EXTRACT','offices','Pune, Kolkata, Bengaluru, Gurugram, Dubai','offices');
    br(300,'EXTRACT','contact','sales@srvmedia.com · 2 phone lines','contact');
    br(300,'EXTRACT','claims','15+ years, 8 case studies, 8 recognitions');
    const so=T('social',600),sc=SRV.social;
    so(900,'FETCH','instagram.com/srvmedia','200 · '+fmtNum(sc.instagram.followers)+' followers · '+fmtNum(sc.instagram.posts)+' posts');
    so(900,'FETCH','facebook.com/srvmedia','200 · '+fmtNum(sc.facebook.followers)+' followers · '+fmtNum(sc.facebook.talking)+' talking about this');
    so(800,'FETCH','x.com/SRVMedia','200 · profile bio only');
    so(800,'FETCH','youtube.com/channel/UCPUFwXn...','200 · channel description only');
    so(800,'FETCH','linkedin.com/company/srv-media','200 · login wall, title only. Needs page authorisation','',true);
    const se=T('search',2200);
    SERP.forEach(s=>{const hit=s.results.some(r=>/srvmedia\.com/.test(r[1]));se(850,'SEARCH','"'+s.q+'"',s.results.length+' results · '+(hit?'srvmedia.com present':'srvmedia.com not in results')+(s.named.includes('SRV Media')&&!s.brand?' · named in 1 list':''),'',!hit&&!s.brand)});
    const co=T('comps',6800);
    COMPETITORS.filter(c=>c.id!=='wc').forEach(c=>co(520,'FETCH',c.name,(c.size!=='n/a'?c.size+' · ':'')+c.pos));
    const au=T('audit',3000);
    auditIssues().filter(i=>i.pages.length).forEach(i=>au(420,'CHECK',i.label,i.pages.length+' of '+CRAWL.length+' pages',  '',i.sev==='warn'||i.sev==='error'));
    au(300,'SCORE','health',healthScore().score+' / 100');
  }else if(cid==='parul'){
    const a=T('site',200);a(200,'GET','/robots.txt','200 · 246 B');a(300,'GET','/','200 · 1161 KB · '+PARUL.title,'logo,tag,palette');
    const s=T('stack',900);s(300,'DETECT','CMS',PARUL.tech.cms);s(250,'DETECT','Tag manager','GTM-P4TP4N6D, GTM-59JNZQZF');s(250,'CHECK','GA4','no ID in page source','',true);s(250,'CHECK','Meta Pixel','not in page source','',true);
    const b=T('brand',1100);b(300,'EXTRACT','colours','#160A4D #FFC107 #FF2B56','palette');b(300,'EXTRACT','headline',PARUL.h1[0],'tag');
  }else{
    const a=T('site',200);a(200,'GET','/sitemap.xml','404 · no valid sitemap','',true);a(300,'GET','/','200 · 229 KB · '+WAGH.title,'logo,tag,palette');
    const s=T('stack',900);s(300,'DETECT','CMS',WAGH.tech.cms);s(250,'DETECT','Analytics','GA4 G-LF0SCNYJLL');s(250,'CHECK','Tag manager','not in page source','',true);s(250,'CHECK','Meta Pixel','not in page source','',true);
    const b=T('brand',1100);b(300,'EXTRACT','colours','#ED5926','palette');b(300,'EXTRACT','headline',WAGH.h1[0],'tag');
  }
  return ev.sort((x,y)=>x.t-y.t);
}
function simInit(){
  S.sim={E:0,done:false,timer:null,p:{}};
  S.clients.forEach(id=>{const ev=buildEvents(id),tot={};ev.forEach(e=>tot[e.s]=(tot[e.s]||0)+1);S.sim.p[id]={ev,i:0,cnt:{},tot,rev:new Set()}});
}
function stopSim(){if(S.sim&&S.sim.timer){clearInterval(S.sim.timer);S.sim.timer=null}}
const fmtT=ms=>{const s=ms/1000;return '00:'+(s<10?'0':'')+s.toFixed(1)};
function simResult(cid,id){
  if(cid==='srv'){const h=healthScore(),pr=srvPresence();return {site:CRAWL.length+' pages · '+SRV.sitemapTotal+' URLs mapped',stack:SRV.tech.detected.length+' found · '+SRV.tech.notFound.length+' not in source',audit:'Health '+h.score+' · '+(h.e+h.w+h.n)+' pages flagged',brand:'5 colours · 3 fonts · logo',social:'5 profiles · 1 login wall',search:SERP.length+' queries · listed in '+pr.listed+' of '+pr.total,comps:(COMPETITORS.length-1)+' competitors profiled'}[id]}
  return {site:'Homepage scanned',stack:'Tags read',audit:'Full audit pending',brand:'Colours read',social:'Not configured',search:'Not configured',comps:'Not configured'}[id];
}
function drawLine(e){
  const box=$('#logbox');if(!box)return;
  const d=document.createElement('div');d.className='lg';
  d.innerHTML=`<span class="tm">${fmtT(e.t)}</span><span class="vb">${e.vb}</span><span class="tg">${esc(e.tg)}</span><span class="rs ${e.w?'w':''}">${esc(e.rs)}</span>`;
  box.appendChild(d);
  const used=()=>[...box.children].reduce((a,x)=>a+x.offsetHeight,0);
  while(box.children.length>1&&used()>box.clientHeight)box.removeChild(box.firstChild);
}
function drawLog(){const box=$('#logbox');if(!box)return;box.innerHTML='';const p=S.sim.p[S.cur];for(let k=Math.max(0,p.i-40);k<p.i;k++)drawLine(p.ev[k])}
function drawSources(){
  const p=S.sim.p[S.cur];
  SRC_ROWS.forEach(([id])=>{
    const row=$('#src_'+id);if(!row)return;
    const tot=p.tot[id]||0,pr=tot?(p.cnt[id]||0)/tot:1;
    row.querySelector('.pb i').style.width=(tot?Math.round(pr*100):0)+'%';
    row.classList.toggle('done',!!tot&&pr>=1);
    row.querySelector('small').textContent=!tot?'Not run for this client':pr>=1?simResult(S.cur,id):(pr>0?'Reading...':'Waiting');
  });
}
function drawExtracted(){
  const p=S.sim.p[S.cur],c=C(),r=p.rev,sk=h=>`<div class="shimmer" style="height:${h}px"></div>`;
  const pal=c.own?SRV.visual.colors.map(x=>x[0]):c.colors.map(x=>x[0]);
  const na='<div style="font-size:12.5px;color:var(--muted)">Needs the full audit</div>';
  $('#extb').innerHTML=`
   <div class="exb"><span class="lb">Brand</span>${r.has('logo')?`<div style="display:flex;align-items:center;gap:10px">${c.own?`<img class="logo-img" src="${SRV.visual.logo}" alt="SRV Media logo">`:`<div style="width:38px;height:38px;border-radius:10px;background:${c.color};color:#fff;display:grid;place-items:center;font-weight:600">${c.mono}</div><b style="font-weight:500">${esc(c.name)}</b>`}</div>`:sk(36)}</div>
   <div class="exb"><span class="lb">${c.own?'Tagline':'Headline'}</span>${r.has('tag')?`<div style="font-size:12.5px;line-height:1.4">${esc(c.own?SRV.heroLines[1]:c.h1[0])}</div>`:sk(30)}</div>
   <div class="exb"><span class="lb">Colours</span>${r.has('palette')?`<div class="swr" style="margin-bottom:16px">${pal.map(h=>`<div style="background:${h}" title="${h}"><small>${h}</small></div>`).join('')}</div>`:sk(28)}</div>
   <div class="exb"><span class="lb">Typography</span>${c.own?(r.has('fonts')?`<div style="font-size:12.5px">${SRV.visual.fonts.join(', ')}</div>`:sk(18)):na}</div>
   <div class="exb"><span class="lb">Services</span>${c.own?(r.has('services')?`<div class="pills">${SRV.services.slice(0,6).map(o=>`<span class="pill">${o}</span>`).join('')}<span class="pill">+${SRV.services.length-6}</span></div>`:sk(46)):na}</div>
   <div class="exb"><span class="lb">Offices</span>${c.own?(r.has('offices')?`<div class="pills">${SRV.offices.map(o=>`<span class="pill">${o.city}</span>`).join('')}</div>`:sk(24)):na}</div>`;
}
function drawPcts(){S.clients.forEach(id=>{const e=$('#pc_'+id);if(!e)return;const p=S.sim.p[id];e.textContent=p.i>=p.ev.length?'done':Math.round(p.i/p.ev.length*100)+'%'})}
function applyEvent(id,e){
  const p=S.sim.p[id];p.cnt[e.s]=(p.cnt[e.s]||0)+1;
  if(e.rev&&e.rev.trim())e.rev.split(',').forEach(k=>p.rev.add(k.trim()));
  if(id===S.cur){drawLine(e);if(e.rev&&e.rev.trim())drawExtracted()}
  if(id==='srv'&&(e.vb==='SEARCH'||(e.vb==='FETCH'&&e.s==='social')))tool(e.vb.toLowerCase()+'.'+e.s,e.tg,e.rs);
}
function simTick(){
  const sim=S.sim;sim.E+=100/S.speed;
  S.clients.forEach(id=>{const p=sim.p[id];while(p.i<p.ev.length&&p.ev[p.i].t<=sim.E){const e=p.ev[p.i];p.i++;applyEvent(id,e)}});
  drawSources();drawPcts();
  if(S.clients.every(id=>sim.p[id].i>=sim.p[id].ev.length)){stopSim();sim.done=true;const b=$('#obNext');if(b)b.disabled=false;const s=$('#anSum');if(s)s.textContent='Analysis complete';if(S.tour)setTimeout(()=>{if(S.ob===2&&S.phase==='onb')finishOnb()},1200*S.speed)}
}
function ob2(){
  stage(`<div class="ob" style="max-width:1200px">${obBar()}
   <div style="display:flex;justify-content:space-between;align-items:flex-end;flex:none"><div class="sh"><div><h1>Analysing ${S.role==='agency'?'your clients':esc(S.f.biz)}</h1><div class="sub">Crawling the live site and reading public sources. <span id="anSum" style="color:var(--text2)"></span></div></div></div>${S.role==='agency'?`<div class="ctabs">${S.clients.map(id=>`<button class="ct ${id===S.cur?'on':''}" data-c="${id}"><span class="dotc" style="background:${CLIENTS[id].color}"></span>${CLIENTS[id].short}<small id="pc_${id}"></small></button>`).join('')}</div>`:''}</div>
   <div class="grid" style="grid-template-columns:240px minmax(0,1fr) 260px">
     <div class="card"><h3>Sources</h3><div class="cb">${SRC_ROWS.map(([id,ic,nm])=>`<div class="src" id="src_${id}"><div class="ic">${I(ic)}</div><div class="bd"><b>${nm}</b><small>Waiting</small><div class="pb"><i></i></div></div></div>`).join('')}</div></div>
     <div class="card"><h3>Activity <span class="chip">live</span></h3><div class="cb"><div class="logbox" id="logbox"></div></div></div>
     <div class="card"><h3>Extracted so far</h3><div class="cb" id="extb"></div></div>
   </div>
   <div class="obf"><button class="btn ghost" id="obBack">Back</button><button class="btn" id="obNext" disabled>Open workspace</button></div></div>`);
  $('#obBack').onclick=()=>obGo(1);$('#obNext').onclick=finishOnb;
  document.querySelectorAll('.ct').forEach(b=>b.onclick=()=>{S.cur=b.dataset.c;document.querySelectorAll('.ct').forEach(x=>x.classList.toggle('on',x===b));drawLog();drawSources();drawExtracted()});
  S.cur=S.clients.includes(S.cur)?S.cur:S.clients[0];
  if(!S.sim)simInit();
  drawLog();drawSources();drawExtracted();drawPcts();
  if(S.sim.done){$('#obNext').disabled=false;$('#anSum').textContent='Analysis complete'}else S.sim.timer=setInterval(simTick,100);
}
function finishOnb(){stopSim();S.cur=S.clients[0];enterApp()}

/* ================= CONTROLS ================= */
function reset(){
  S.token++;clearIntervals();stopSim();if(typeof stopTour==='function')stopTour();
  S.phase='onb';S.ob=0;S.view='overview';S.role=null;S.clients=['srv'];S.cur='srv';S.conn={meta:false,ga4:false,gsc:false,ig:false,fb:false,openai:false,perplexity:false,gemini:false};
  S.approved=new Set();S.launched={};S.tasks={};S.over={};S.cap={};S.prompts=[];S.comps=[];S.copy={};S.sim=null;S.tools=0;S.sel=null;
  S.f.comps=['Techmagnate','upGrowth Digital','Wildnet Technologies','FMA Digital'];S.f.cities=['Pune','Bengaluru','Gurugram','Kolkata'];S.f.cl={srv:true,parul:true,wagh:true};S.f.mb={srv:150000,parul:80000,wagh:60000};S.f.budget=150000;
  $('#toolN').textContent='0';$('#log').innerHTML='<div class="empty">No actions yet.</div>';
  $('#app').classList.add('onb');closeModal();renderWs();renderOnb();
}
$('#resetBtn').onclick=reset;
$('#toolBtn').onclick=()=>$('#drawer').classList.toggle('open');
$('#bellBtn').onclick=e=>{e.stopPropagation();if(S.phase==='app')openInbox()};
$('#demoBtn').onclick=e=>{e.stopPropagation();$('#demo').classList.toggle('open')};
$('#spdSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.speed=+b.dataset.s;$('#spdSeg').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))});
