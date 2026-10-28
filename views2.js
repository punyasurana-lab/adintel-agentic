/* Lumen prototype, part 2: agents, portfolio, campaigns, creative library, templates, analytics, profitability.
   Counts and statuses are derived from the real captured data and from what the user has done in this session.
   Profitability uses assumptions the user can edit; none of them are presented as measured results. */

S.tplSel={p1:'question',p2:'proof',p4:'offer'};
S.autonomy={researcher:'auto',analyst:'auto',planner:'ask',reviewer:'auto',creative:'ask',compliance:'auto',optimizer:'limits',reporter:'ask'};
S.ucSel='dna';S.replay=null;S.queueTab='queue';S.anTab='site';S.tplTab='creative';S.tplEdit='question';S.camFilter='All';S.camSel=null;S.libPl='All';S.libSt='All';S.custom=0;
S.assume={rate:800,fteHours:160,platform:10000,fee:'pct',pct:10,retainer:{srv:0,parul:90000,wagh:70000},indFee:60000,
  uc:[
   {id:'dna',label:'Brand onboarding and DNA refresh',man:6,rev:.75,runs:.5,cost:600},
   {id:'vis',label:'Search visibility report',man:4,rev:.5,runs:1,cost:400},
   {id:'comp',label:'Competitor intelligence',man:5,rev:.75,runs:1,cost:500},
   {id:'plan',label:'Campaign planning',man:4,rev:.75,runs:2,cost:500},
   {id:'cre',label:'Creative production, 3 placements',man:6,rev:1,runs:2,cost:900},
   {id:'opt',label:'Optimisation and reporting',man:6,rev:1,runs:4,cost:200}]};
S.scn={cpl:1500,close:8,value:240000,imp:20};

/* ---------- templates (used by the Creative agent) ---------- */
const TEMPLATES=[
 {id:'question',name:'Question hook',desc:'A question that names the gap',bg:['#DA1F26','#7a0f14'],accent:'#1863DC',textPos:'bottom',logo:'tl',dark:false,big:false,hlMax:40,slots:{headline:true,proof:false,cta:true}},
 {id:'proof',name:'Proof stat',desc:'A sourced number up front',bg:['#1863DC','#0b2f6e'],accent:'#DA1F26',textPos:'center',logo:'tl',dark:false,big:true,hlMax:40,slots:{headline:true,proof:true,cta:true}},
 {id:'offer',name:'Offer and call to action',desc:'Plain offer with a strong button',bg:['#212121','#000000'],accent:'#DA1F26',textPos:'bottom',logo:'tr',dark:false,big:false,hlMax:40,slots:{headline:true,proof:false,cta:true}},
 {id:'case',name:'Case study',desc:'Client result on a light background',bg:['#F4F4F4','#d8d8d8'],accent:'#DA1F26',textPos:'top',logo:'bl',dark:true,big:false,hlMax:40,slots:{headline:true,proof:true,cta:true}}
];
const tplOf=pid=>TEMPLATES.find(t=>t.id===(S.tplSel[pid]||'question'))||TEMPLATES[0];
const BRAND_COLORS=[['#DA1F26','Brand red'],['#1863DC','Brand blue'],['#212121','Near black'],['#FF3A2D','Bright red'],['#F4F4F4','Light grey'],['#000000','Black'],['#0b2f6e','Deep blue'],['#7a0f14','Deep red'],['#d8d8d8','Mid grey']];

function agentOfTool(n){
  if(/^(web|seo|social|dna|fetch)/.test(n))return 'Researcher';
  if(/^(search|prompts|competitors)/.test(n))return 'Analyst';
  if(/^agent\.review/.test(n))return 'Reviewer';
  if(/^agent\./.test(n))return 'Workspace';
  if(/^(planner|approval|task|strategy|brief|playbook|campaign)/.test(n))return 'Planner';
  if(/^(creative\.|template)/.test(n))return 'Creative';
  if(/^policy/.test(n))return 'Compliance';
  if(/^(rules|meta\.update)/.test(n))return 'Optimizer';
  if(/^report/.test(n))return 'Reporter';
  if(/^(adintel|meta|audit)/.test(n))return 'AdIntel';
  return 'Workspace';
}

/* ---------- runs derived from the real state of the workspace ---------- */
const ST={done:['Done','g'],wait:['Waiting for you','a'],attn:['Needs attention','r'],idle:['Idle',''],queued:['Queued',''],work:['Working','b']};
function runsFor(cid){
  const c=CLIENTS[cid],out=[],R=(a,t,s,d,uc)=>out.push({a,t,s,d,uc});
  if(c.own){
    const h=healthScore(),pr=srvPresence();
    R('Researcher','Crawled srvmedia.com','done',CRAWL.length+' pages sampled, '+SRV.sitemapTotal+' URLs in sitemaps','dna');
    R('Researcher','Extracted the brand kit','done','Logo, 5 colours, 3 fonts, '+SRV.services.length+' services','dna');
    R('Researcher','Read social profiles','attn','LinkedIn is behind a login wall. Needs authorisation','dna');
    R('Researcher','Wrote Brand DNA v1',S.dnaOk[cid]?'done':'wait',S.dnaOk[cid]?'Confirmed by you':'Waiting for you to confirm','dna');
    R('Analyst','Ran '+SERP.length+' buyer searches','done','Listed in '+pr.listed+' of '+pr.total+' category searches','vis');
    R('Analyst','Profiled '+(COMPETITORS.length-1)+' competitors','done','Claims, services and sources captured','comp');
    R('Analyst','Audited '+CRAWL.length+' pages','done','Health score '+h.score,'dna');
  }else{
    R('Researcher','Scanned the homepage','done',c.htmlKb+' KB, '+c.images+' images, tags read','dna');
    R('Researcher','Full crawl and search research','idle','Server job, not included in this prototype','dna');
  }
  const camps=propsOf(cid).filter(p=>p.type==='campaign'),tasks=propsOf(cid).filter(p=>p.type==='task');
  if(camps.length){
    R('Planner','Drafted '+camps.length+' campaign proposals','done',camps.map(p=>p.short).join(', '),'plan');
    R('Reviewer','Challenged the plans','done',camps.reduce((a,p)=>a+(p.rev?p.rev.length:0),0)+' challenges raised and resolved','plan');
    camps.forEach(p=>{
      const ap=S.approved.has(p.id),bl=isBlocked(p);
      R('Planner','Plan: '+p.short,bl?'attn':ap?'done':'wait',bl?'Blocked until tracking is verified':ap?'Approved by you':'Waiting for your approval','plan');
      if(CREATIVE[p.id]){
        const cp=copyOf(p.id),bad=[...cp.heads,cp.primary].some(t=>claimsAll(t).some(r=>r[0]==='bad')),built=S.creativeSeen&&S.creativeSeen[p.id];
        R('Creative','Creatives: '+p.short,built?(S.creativeOk[p.id]?'done':'wait'):'queued',S.creativeOk[p.id]?'3 placements approved':built?'3 placements ready for review':'Starts when you open the plan','cre');
        R('Compliance','Copy scan: '+p.short,bad?'attn':'done',bad?'A blocked claim needs fixing':'No blocked claims','cre');
      }
    });
  }
  tasks.forEach(t=>R('Planner','Task: '+t.t,S.tasks[t.task]?'done':'wait',S.tasks[t.task]?'Marked done':'Waiting for you','plan'));
  const live=camps.filter(p=>S.launched[p.id]);
  R('Optimizer','Watch delivery',live.length?'wait':'idle',live.length?live.length+' campaign(s) in Meta review':'Starts after the first launch','opt');
  R('Reporter','Weekly client report',live.length?'queued':'idle',live.length?'First report at day 7':'Starts after the first launch','opt');
  return out;
}
function runRow(r){const s=ST[r.s]||ST.idle;return `<div class="rost"><span class="dot-s ${r.s==='queued'?'idle':r.s}"></span><div class="tx"><b>${esc(r.t)}</b><small>${esc(r.a)} · ${esc(r.d)}</small></div><span class="chip ${s[1]}">${s[0]}</span></div>`}
/* ================= PROFITABILITY MODEL ================= */
function ucTotals(){const a=S.assume;return {man:a.uc.reduce((s,u)=>s+u.man*u.runs,0),rev:a.uc.reduce((s,u)=>s+u.rev*u.runs,0),ag:a.uc.reduce((s,u)=>s+u.cost*u.runs,0)}}
function profitFor(cid){
  const a=S.assume,t=ucTotals(),c=CLIENTS[cid];
  const revenue=c.own?0:(a.fee==='pct'?a.pct/100*mbOf(cid):(a.retainer[cid]||0));
  const costH=t.man*a.rate,costA=t.rev*a.rate+t.ag+a.platform;
  return {hoursH:t.man,hoursA:t.rev,saved:t.man-t.rev,revenue,costH,costA,mH:revenue-costH,mA:revenue-costA,gain:costH-costA,internal:!!c.own};
}
function profitAll(){
  const a=S.assume,t=ucTotals(),rows=S.clients.map(id=>({id,...profitFor(id)}));
  const sum=k=>rows.reduce((s,r)=>s+r[k],0);
  return {rows,saved:sum('saved'),gain:sum('gain'),revenue:sum('revenue'),mH:sum('mH'),mA:sum('mA'),cpcH:t.man*a.rate,cpcA:t.rev*a.rate+t.ag+a.platform,perFteH:t.man?a.fteHours/t.man:0,perFteA:t.rev?a.fteHours/t.rev:0};
}
const hfmt=h=>(Math.round(h*10)/10)+' h';

/* ================= PORTFOLIO (agency) ================= */
VIEWS.portfolio=function(){
  const P=profitAll(),inbox=inboxItems(),total=S.clients.reduce((a,id)=>a+mbOf(id),0);
  const attn=[];S.clients.forEach(id=>runsFor(id).filter(r=>r.s==='attn'||r.s==='wait').forEach(r=>attn.push({id,r})));
  stage(`<div class="scr">${sh('All clients',esc(S.f.agency)+' · '+S.clients.length+' clients · media budget, approvals and agent work across the portfolio','<button class="btn sm ghost" id="addC">'+I('plus')+' Add client</button>')}
   <div class="tiles"><div class="tile"><small>Clients</small><b>${S.clients.length}</b><span>${S.clients.filter(id=>CLIENTS[id].own).length} own brand</span></div><div class="tile"><small>Monthly media budget</small><b>${rupee(total)}</b><span>Planned 90%, reserve 10%</span></div><div class="tile"><small>Waiting for you</small><b>${inbox.length}</b><span>approvals, tasks, connections</span></div><div class="tile"><small>Hours freed per month</small><b>${hfmt(P.saved)}</b><span>Assumptions in Profitability</span></div></div>
   <div class="grid" style="grid-template-columns:1.9fr 1fr">
    <div class="card"><h3>Clients <span class="chip">${S.clients.length}</span></h3><div class="cb sc"><table><tr><th>Client</th><th>Site</th><th>Tracking</th><th>Monthly budget</th><th class="r">Campaigns</th><th class="r">Tasks</th><th class="r">Margin / month</th><th></th></tr>
     ${P.rows.map(r=>{const c=CLIENTS[r.id],camps=propsOf(r.id).filter(p=>p.type==='campaign'),tk=c.own?'GTM, GA4':[...(c.tech.gtm.length?['GTM']:[]),...(c.tech.ga4.length?['GA4']:[])].join(', ')||'none';
       return `<tr class="row" data-open="${r.id}"><td><span class="dotc" style="background:${c.color};margin-right:6px"></span>${esc(c.name)}<small>${esc(c.vertical)}${c.own?' · own brand':''}</small></td><td>${c.own?'Health '+healthScore().score:'Homepage only'}<small>${c.own?CRAWL.length+' pages crawled':c.htmlKb+' KB homepage'}</small></td><td>${tk}<small>Meta Pixel not in source</small></td><td><input type="text" class="amt" data-b="${r.id}" value="${rupee(mbOf(r.id))}"></td><td class="r">${camps.filter(p=>S.approved.has(p.id)).length} / ${camps.length}<small>approved</small></td><td class="r">${propsOf(r.id).filter(p=>p.type==='task'&&!S.tasks[p.task]).length}<small>open</small></td><td class="r ${r.internal?'':r.mA>=0?'okc':'badc'}">${r.internal?'Internal':rupee(r.mA)}<small>${r.internal?rupee(r.gain)+' saved':'was '+rupee(r.mH)}</small></td><td><button class="btn sm" data-go="${r.id}">Open</button></td></tr>`}).join('')}
     <tr><td><b style="font-weight:500">Total</b></td><td></td><td></td><td>${rupee(total)}</td><td></td><td></td><td class="r"><b style="font-weight:500">${rupee(P.mA)}</b><small>was ${rupee(P.mH)}</small></td><td></td></tr></table></div></div>
    <div class="col"><div class="card" style="flex:1"><h3>Needs attention <span class="chip a">${attn.length}</span></h3><div class="cb sc">${attn.length?attn.slice(0,9).map(x=>`<div class="rost" style="cursor:pointer" data-at="${x.id}"><span class="dot-s ${x.r.s}"></span><div class="tx"><b>${esc(x.r.t)}</b><small>${esc(CLIENTS[x.id].short)} · ${esc(x.r.d)}</small></div></div>`).join(''):'<div class="empty">Nothing needs attention.</div>'}</div></div>
     <div class="card"><h3>Next 7 days, all clients</h3><div class="cb sc">${nextUpAll(7).map(x=>nextRow(x.it,x.cid)).join('')||'<div class="empty">Nothing scheduled.</div>'}</div></div></div>
   </div></div>`);
  growBars();
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.stopPropagation();switchClient(b.dataset.go)});
  document.querySelectorAll('tr[data-open]').forEach(r=>r.onclick=e=>{if(e.target.closest('input,button'))return;switchClient(r.dataset.open)});
  document.querySelectorAll('[data-at]').forEach(r=>r.onclick=()=>{S.cur=r.dataset.at;renderWs();openView('workplan')});
  document.querySelectorAll('[data-b]').forEach(i=>i.onchange=()=>{S.f.mb[i.dataset.b]=Math.max(10000,Math.min(1000000,parseAmt(i.value)));S.over={};VIEWS.portfolio();renderSide()});
  $('#addC').onclick=()=>modal('<h3>Add a client</h3><p>Adding a client starts a live crawl, search research and brand extraction on Lumen\'s servers. This prototype runs without a backend, so only the three clients listed carry captured data.</p><div class="ft"><button class="btn" onclick="closeModal()">Understood</button></div>');
};

/* ================= CAMPAIGNS ================= */
function campStatus(p){if(S.launched[p.id])return ['In review','a'];if(isBlocked(p))return ['Blocked','r'];if(S.approved.has(p.id))return ['Approved','g'];return ['Draft','']}
function campOwner(p){if(S.launched[p.id])return 'Optimizer';if(isBlocked(p))return 'Compliance';return 'Planner'}
VIEWS.campaigns=function(){
  const own=C().own,all=propsOf(S.cur).filter(p=>p.type==='campaign');
  const FL=['All','Draft','Approved','In review','Blocked'];
  const list=all.filter(p=>S.camFilter==='All'||campStatus(p)[0]===S.camFilter);
  const sel=all.find(p=>p.id===S.camSel&&list.includes(p))||list[0];
  stage(`<div class="scr">${sh('Campaigns',esc(C().name)+' · every campaign with its status, owner agent and audit trail','<button class="btn sm" id="newC">'+I('plus')+' New campaign</button>')}
   <div style="display:flex;gap:6px;flex:none">${FL.map(f=>`<button class="pill ${S.camFilter===f?'on':''}" data-f="${f}">${f} ${f==='All'?all.length:all.filter(p=>campStatus(p)[0]===f).length}</button>`).join('')}</div>
   <div class="grid" style="grid-template-columns:1.6fr 1fr">
    <div class="card"><h3>${list.length} campaign${list.length===1?'':'s'}</h3><div class="cb sc">${list.length?`<table><tr><th>Campaign</th><th>Objective</th><th class="r">Budget</th><th>Status</th><th>Owner</th><th class="r">Creatives</th></tr>${list.map(p=>{const s=campStatus(p),has=!!CREATIVE[p.id];return `<tr class="row ${sel&&p.id===sel.id?'sel':''}" data-c="${p.id}"><td>${esc(p.t)}<small class="mono">${p.cn}</small></td><td>${objOf()[0]}</td><td class="r">${rupee(bud(p))}</td><td><span class="chip ${s[1]}">${s[0]}</span></td><td>${campOwner(p)}</td><td class="r">${has?(S.creativeOk[p.id]?'3 approved':(S.creativeSeen&&S.creativeSeen[p.id])?'3 ready':'Not built'):'None'}</td></tr>`}).join('')}</table>`:'<div class="empty">No campaigns match this filter.</div>'}</div></div>
    <div class="card" id="cdet"></div>
   </div></div>`);
  const det=()=>{
    if(!sel){$('#cdet').innerHTML='<h3>Campaign</h3><div class="cb"><div class="empty" style="line-height:1.5">No campaigns yet. '+(own?'Create one, or approve a proposal in Autopilot.':'Campaigns appear after tracking is verified and the full audit has run.')+'</div></div>';return}
    const s=campStatus(sel),rows=adsetsOf(sel),trail=S.toolLog.filter(l=>(l.args+' '+l.name).includes(sel.id)||(l.args+'').includes(sel.cn)).slice(-6).reverse();
    $('#cdet').innerHTML=`<h3>${esc(sel.short||sel.t)} <span class="chip ${s[1]}">${s[0]}</span></h3><div class="cb sc"><div style="font-size:13.5px;font-weight:500;margin-bottom:2px">${esc(sel.t)}</div><div class="mono" style="color:var(--muted);margin-bottom:10px">${sel.cn}</div>
     <dl class="kv"><dt>Objective</dt><dd>${objOf()[0]} (${objOf()[1]})</dd><dt>Budget</dt><dd>${rupee(bud(sel))} over ${sel.days} days</dd><dt>Locations</dt><dd>${locsOf(sel).join(', ')}</dd><dt>Landing page</dt><dd>${sel.lp}</dd><dt>Owner agent</dt><dd>${campOwner(sel)}</dd></dl>
     <div class="hr"></div><span class="lbl">Ad sets</span>${rows.map(r=>`<div class="li g">${r.city}<small>${rupee(r.amt)} · ${rupee(r.daily)}/day</small></div>`).join('')}
     <div class="hr"></div><span class="lbl">Audit trail</span>${trail.length?trail.map(l=>`<div class="li">${esc(l.name)}<small>${esc(l.res)}</small></div>`).join(''):'<div class="empty">No actions recorded yet.</div>'}</div>
     <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;flex:none"><button class="btn sm" data-g="plan">Plan</button><button class="btn sm ghost" data-g="creative" ${CREATIVE[sel.id]?'':'disabled'}>Creative</button><button class="btn sm ghost" data-g="launch">Launch</button></div>`;
    $('#cdet').querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>gotoView(b.dataset.g,()=>{S.sel=sel.id}));
  };
  det();
  document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{S.camFilter=b.dataset.f;S.camSel=null;VIEWS.campaigns()});
  document.querySelectorAll('tr[data-c]').forEach(r=>r.onclick=()=>{S.camSel=r.dataset.c;VIEWS.campaigns()});
  $('#newC').onclick=()=>{
    if(!own){modal('<h3>New campaign</h3><p>Campaigns for this client are created after the full audit, because the plan is built from the crawl and search research. That job runs on Lumen\'s servers.</p><div class="ft"><button class="btn" onclick="closeModal()">Understood</button></div>');return}
    modal(`<h3>New campaign</h3><p>Agents review the audience and claims before anything can launch.</p>
     <div class="fld"><label>Name</label><input type="text" id="ncN" value="Services awareness test"></div>
     <div class="fld2"><div class="fld"><label>Budget</label><input type="text" id="ncB" value="${rupee(20000)}"></div><div class="fld"><label>Duration (days)</label><input type="text" id="ncD" value="14"></div></div>
     <div class="fld"><label>Landing page (from the crawl)</label><select id="ncL">${CRAWL.filter(p=>p.s===200).map(p=>`<option value="${p.f}">${p.f}</option>`).join('')}</select></div>
     <div class="ft"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn" id="ncOk">Create draft</button></div>`,()=>{
      $('#ncOk').onclick=()=>{
        const name=$('#ncN').value.trim()||'Untitled campaign',b=Math.max(5000,parseAmt($('#ncB').value)),d=Math.max(3,Math.round(parseAmt($('#ncD').value))||14);
        S.custom++;const id='c'+S.custom,arr=PROPS[S.cur],at=arr.findIndex(p=>p.type==='locked');
        arr.splice(at<0?arr.length:at,0,{id,type:'campaign',t:name,short:slug(name).slice(0,14),cn:'SRV_LEAD_'+slug(name).slice(0,22),share:0,days:d,obj:'Leads',win:'Next '+d+' days',trig:'Added by you',why:['Added manually. Agents review the audience and claims before launch.'],aud:'Set in the plan',lp:$('#ncL').value,ev:'none',locsN:3,rev:[['Added manually','Reviewer checks audience and claims at launch']]});
        S.over[id]=b;S.camSel=id;S.camFilter='All';closeModal();tool('campaign.create','name='+name+' budget='+b,'draft '+id);toast('Draft created');VIEWS.campaigns();renderSide();
      };
    });
  };
};

/* ================= CREATIVE LIBRARY ================= */
function miniAd2(t,cp,w,pl){
  pl=pl||'feed';const dims={feed:[w,Math.round(w*1.25)],video:[w,w],reel:[w,Math.round(w*16/9)]}[pl],tc=t.dark?'#111':'#fff',hd=pl==='video'?cp.heads[1]:cp.heads[0];
  const fs=t.big?(w>100?15:10):(w>100?11:8);
  return `<div class="mini" style="width:${dims[0]}px;height:${dims[1]}px">${artSvg(t)}<div class="lgm" style="${LOGO_POS[t.logo]};transform:scale(${w>100?1:.7});transform-origin:top left"><img src="${SRV.visual.logo}" alt=""></div><div class="t" style="${TEXT_POS[t.textPos]};color:${tc};font-size:${fs}px;${t.dark?'text-shadow:none':''}">${esc(hd)}</div></div>`;
}
const miniAd=(pid,pl,w)=>miniAd2(tplOf(pid),copyOf(pid),w,pl);
const PLACEMENTS=[['feed','Instagram Feed 4:5'],['video','Instagram Video 1:1'],['reel','Instagram Reel 9:16']];
function creStatus(pid){if(S.launched[pid])return ['In review','a'];if(S.creativeOk[pid])return ['Approved','g'];if(S.creativeSeen&&S.creativeSeen[pid])return ['Draft',''];return ['Not built','']}
VIEWS.library=function(){
  if(partial('Creative library','The creative library'))return;
  const camps=propsOf(S.cur).filter(p=>p.type==='campaign'&&CREATIVE[p.id]);
  const items=[];camps.forEach(p=>PLACEMENTS.forEach(pl=>items.push({p,pl,st:creStatus(p.id)})));
  const shown=items.filter(i=>(S.libPl==='All'||i.pl[0]===S.libPl)&&(S.libSt==='All'||i.st[0]===S.libSt));
  stage(`<div class="scr">${sh('Creative library',esc(C().name)+' · '+items.length+' creatives across '+camps.length+' campaigns','<button class="btn sm" id="toStudio">Open studio</button>')}
   <div style="display:flex;gap:10px;align-items:center;flex:none"><div class="tabs" id="lp">${[['All','All placements'],['feed','Feed'],['video','Video'],['reel','Reel']].map(x=>`<button data-v="${x[0]}" class="${S.libPl===x[0]?'on':''}">${x[1]}</button>`).join('')}</div><div class="tabs" id="ls">${['All','Not built','Draft','Approved','In review'].map(x=>`<button data-v="${x}" class="${S.libSt===x?'on':''}">${x}</button>`).join('')}</div></div>
   <div class="card" style="flex:1"><h3>${shown.length} creative${shown.length===1?'':'s'}</h3><div class="cb sc"><div class="libg">${shown.map((i,n)=>`<div class="libc" data-n="${n}">${miniAd(i.p.id,i.pl[0],i.pl[0]==='reel'?92:120)}<b style="font-weight:500;font-size:12.5px">${esc(i.p.short)}</b><small>${i.pl[1]}</small><span class="chip ${i.st[1]}">${i.st[0]}</span><small>${esc(tplOf(i.p.id).name)}</small></div>`).join('')||'<div class="empty">No creatives match.</div>'}</div></div></div></div>`);
  $('#toStudio').onclick=()=>openView('creative');
  $('#lp').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.libPl=b.dataset.v;VIEWS.library()});
  $('#ls').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.libSt=b.dataset.v;VIEWS.library()});
  document.querySelectorAll('.libc').forEach(el=>el.onclick=()=>{
    const i=shown[+el.dataset.n],p=i.p,cp=copyOf(p.id),cl=[...cp.heads,cp.primary].flatMap(t=>claimsAll(t));
    modal(`<div style="display:flex;gap:16px"><div>${miniAd(p.id,i.pl[0],i.pl[0]==='reel'?150:200)}</div><div style="flex:1;min-width:0"><h3>${esc(p.short)} · ${i.pl[1]}</h3><p style="margin-bottom:8px">Template: ${esc(tplOf(p.id).name)} · ${i.st[0]}</p>
      ${cp.heads.map((h,k)=>`<div class="li g">Headline ${'ABC'[k]}: ${esc(h)}</div>`).join('')}<div class="li g">${esc(cp.primary)}</div><div class="li g">CTA: ${esc(cp.cta)}</div>
      <div class="hr"></div>${cl.length?cl.map(polLi).join(''):'<div class="li g">No claims flagged</div>'}</div></div>
      <div class="ft"><button class="btn ghost" onclick="closeModal()">Close</button><button class="btn" id="lbOpen">Open in studio</button></div>`,()=>{$('#lbOpen').onclick=()=>{closeModal();gotoView('creative',()=>{S.sel=p.id})}});
  });
};

/* ================= TEMPLATES ================= */
VIEWS.templates=function(){
  const tab=S.tplTab;
  const hdr=sh('Templates','How the Creative and Planner agents build. Change a template and every creative that uses it changes.','<div class="tabs" id="tt"><button data-t="creative" class="'+(tab==='creative'?'on':'')+'">Creative templates</button><button data-t="play" class="'+(tab==='play'?'on':'')+'">Campaign playbooks</button></div>');
  const tabs=()=>$('#tt').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.tplTab=b.dataset.t;VIEWS.templates()});
  if(tab==='play'){
    if(!C().own){stage(`<div class="scr">${hdr}<div class="card" style="flex:1"><h3>Playbooks</h3><div class="cb"><p style="font-size:13px;color:var(--text2);line-height:1.5;max-width:520px">Playbooks apply once a client has campaign proposals. Switch to ${esc(SRV.name)}.</p></div></div></div>`);tabs();return}
    const camps=propsOf(S.cur).filter(p=>p.type==='campaign'&&S.over[p.id]==null);
    const totalShare=camps.reduce((a,p)=>a+(p.share||0),0);
    stage(`<div class="scr">${hdr}<div class="card" style="flex:1"><h3>Campaign playbooks <span class="chip ${totalShare>.9?'r':'g'}">${Math.round(totalShare*100)}% of monthly budget planned</span></h3><div class="cb sc"><table><tr><th>Playbook</th><th>Objective</th><th class="r">Share of budget</th><th class="r">Budget</th><th class="r">Days</th><th>Success target</th><th>Autonomy</th></tr>
      ${camps.map(p=>`<tr><td>${esc(p.t)}<small>${esc(p.trig)}</small></td><td>${objOf()[0]}</td><td class="r"><input type="text" class="inpn" data-s="${p.id}" value="${Math.round((p.share||0)*100)}"> %</td><td class="r">${rupee(bud(p))}</td><td class="r"><input type="text" class="inpn" data-d="${p.id}" value="${p.days}"></td><td><input type="text" data-k="${p.id}" value="${esc(p.kpi||'Cost per lead decided at day 7')}" style="padding:5px 9px"></td><td><select data-m="${p.id}" style="padding:5px 24px 5px 9px">${[['ask','Ask first'],['limits','In limits'],['auto','Automatic']].map(m=>`<option value="${m[0]}" ${(p.mode||'ask')===m[0]?'selected':''}>${m[1]}</option>`).join('')}</select></td></tr>`).join('')}</table>
      ${totalShare>.9?'<div class="li r" style="margin-top:10px">Shares add up to more than 90%. Lumen always keeps 10% in reserve, so the last campaign would be reduced.</div>':'<div style="font-size:12px;color:var(--text2);margin-top:10px;line-height:1.5">Shares are of the monthly budget. Changes flow straight into Autopilot, Plan and Launch. Campaigns you created yourself keep their own budget.</div>'}</div></div></div>`);
    tabs();
    document.querySelectorAll('[data-s]').forEach(i=>i.onchange=()=>{const p=camps.find(x=>x.id===i.dataset.s);p.share=Math.max(0,Math.min(60,parseAmt(i.value)))/100;tool('playbook.update','campaign='+p.id+' share='+p.share,'budget '+rupee(bud(p)));VIEWS.templates();renderSide()});
    document.querySelectorAll('[data-d]').forEach(i=>i.onchange=()=>{const p=camps.find(x=>x.id===i.dataset.d);p.days=Math.max(3,Math.min(60,Math.round(parseAmt(i.value))||p.days));tool('playbook.update','campaign='+p.id+' days='+p.days,'saved');VIEWS.templates()});
    document.querySelectorAll('[data-k]').forEach(i=>i.onchange=()=>{camps.find(x=>x.id===i.dataset.k).kpi=i.value});
    document.querySelectorAll('[data-m]').forEach(i=>i.onchange=()=>{camps.find(x=>x.id===i.dataset.m).mode=i.value;toast('Autonomy saved')});
    return;
  }
  const t=TEMPLATES.find(x=>x.id===S.tplEdit)||TEMPLATES[0],cp=copyOf('p1');
  const camps=propsOf(S.cur).filter(p=>p.type==='campaign'&&CREATIVE[p.id]);
  const colSel=(id,v)=>`<select id="${id}">${BRAND_COLORS.map(c=>`<option value="${c[0]}" ${c[0].toLowerCase()===String(v).toLowerCase()?'selected':''}>${c[1]} ${c[0]}</option>`).join('')}</select>`;
  stage(`<div class="scr">${hdr}
   <div class="grid" style="grid-template-columns:260px minmax(0,1fr) 300px">
    <div class="card"><h3>Creative templates <span class="chip">${TEMPLATES.length}</span></h3><div class="cb sc">${TEMPLATES.map(x=>`<button class="tplc ${x.id===t.id?'on':''}" data-t="${x.id}">${miniAd2(x,cp,54)}<div><b>${esc(x.name)}</b><small>${esc(x.desc)}</small><small>${camps.filter(p=>tplOf(p.id).id===x.id).length} campaign(s)</small></div></button>`).join('')}</div></div>
    <div class="card"><h3>Preview: ${esc(t.name)} <span class="chip">uses campaign 1 copy</span></h3><div class="cb sc" style="display:flex;gap:18px;align-items:flex-start;justify-content:center;padding-top:6px"><div>${miniAd2(t,cp,150)}<div class="dlab" style="margin-top:6px">Feed 4:5</div></div><div>${miniAd2(t,cp,150,'video')}<div class="dlab" style="margin-top:6px">Video 1:1</div></div><div>${miniAd2(t,cp,110,'reel')}<div class="dlab" style="margin-top:6px">Reel 9:16</div></div></div></div>
    <div class="card"><h3>Template settings</h3><div class="cb sc">
      <div class="fld"><label>Name</label><input type="text" id="tN" value="${esc(t.name)}"></div>
      <div class="fld2"><div class="fld"><label>Background from</label>${colSel('tB1',t.bg[0])}</div><div class="fld"><label>Background to</label>${colSel('tB2',t.bg[1])}</div></div>
      <div class="fld"><label>Accent shape</label>${colSel('tAc',t.accent)}</div>
      <div class="fld2"><div class="fld"><label>Headline position</label><select id="tTp">${['bottom','center','top'].map(x=>`<option ${t.textPos===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="fld"><label>Logo position</label><select id="tLg">${[['tl','Top left'],['tr','Top right'],['bl','Bottom left']].map(x=>`<option value="${x[0]}" ${t.logo===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div></div>
      <div class="fld"><label>Headline limit (characters)</label><input type="text" id="tHm" value="${t.hlMax}"></div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;margin-bottom:10px"><label><input type="checkbox" id="tBig" ${t.big?'checked':''}> Large headline</label><label><input type="checkbox" id="tDk" ${t.dark?'checked':''}> Dark text on light background</label><label><input type="checkbox" id="tPr" ${t.slots.proof?'checked':''}> Requires a sourced proof point</label></div>
      <div class="hr"></div><span class="lbl">Apply to a campaign</span><div class="pills">${camps.map(p=>`<button class="pill ${tplOf(p.id).id===t.id?'on':''}" data-ap="${p.id}">${esc(p.short)}</button>`).join('')}</div>
    </div></div>
   </div></div>`);
  tabs();
  document.querySelectorAll('.tplc').forEach(b=>b.onclick=()=>{S.tplEdit=b.dataset.t;VIEWS.templates()});
  const upd=()=>{tool('template.update','template='+t.id,'saved');VIEWS.templates()};
  $('#tN').onchange=e=>{t.name=e.target.value||t.name;upd()};
  $('#tB1').onchange=e=>{t.bg[0]=e.target.value;upd()};$('#tB2').onchange=e=>{t.bg[1]=e.target.value;upd()};$('#tAc').onchange=e=>{t.accent=e.target.value;upd()};
  $('#tTp').onchange=e=>{t.textPos=e.target.value;upd()};$('#tLg').onchange=e=>{t.logo=e.target.value;upd()};
  $('#tHm').onchange=e=>{t.hlMax=Math.max(20,Math.min(60,Math.round(parseAmt(e.target.value))||40));upd()};
  $('#tBig').onchange=e=>{t.big=e.target.checked;upd()};$('#tDk').onchange=e=>{t.dark=e.target.checked;upd()};$('#tPr').onchange=e=>{t.slots.proof=e.target.checked;upd()};
  document.querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{S.tplSel[b.dataset.ap]=t.id;tool('template.apply','proposal='+b.dataset.ap+' template='+t.id,'applied');VIEWS.templates()});
};

/* ================= ANALYTICS ================= */
function histo(buckets){const mx=Math.max(1,...buckets.map(b=>b[1]));return `<div class="hist">${buckets.map(b=>`<div><b>${b[1]}</b><i style="height:${Math.round(b[1]/mx*70)+2}px"></i><span>${b[0]}</span></div>`).join('')}</div>`}
VIEWS.analytics=function(){
  if(partial('Analytics','Analytics'))return;
  const tab=S.anTab,P=CRAWL;
  const hdr=sh('Analytics',esc(C().name)+' · computed from the live crawl, search results and workspace activity','<div class="tabs" id="at">'+[['site','Site'],['search','Search'],['audience','Audience and tracking'],['work','Work']].map(x=>`<button data-t="${x[0]}" class="${tab===x[0]?'on':''}">${x[1]}</button>`).join('')+'</div>');
  const cnt=(f,bk)=>bk.map(b=>[b[0],P.filter(p=>f(p,b)).length]);
  let body='';
  if(tab==='site'){
    const rt=cnt((p,b)=>p.t>=b[2]&&p.t<b[3],[['< 0.5 s',0,0,.5],['0.5-1 s',0,.5,1],['1-3 s',0,1,3],['3-5 s',0,3,5],['> 5 s',0,5,99]]);
    const kb=cnt((p,b)=>p.kb>=b[2]&&p.kb<b[3],[['< 300',0,0,300],['300-400',0,300,400],['400-1000',0,400,1000],['> 1000',0,1000,9999]]);
    const tl=cnt((p,b)=>p.tl>=b[2]&&p.tl<b[3],[['< 30',0,0,30],['30-60',0,30,61],['> 60',0,61,999]]);
    const wd=cnt((p,b)=>p.w>=b[2]&&p.w<b[3],[['< 450',0,0,450],['450-1.5k',0,450,1500],['1.5k-3k',0,1500,3000],['> 3k',0,3000,99999]]);
    const slow=P.slice().sort((a,b)=>b.t-a.t).slice(0,5),heavy=P.slice().sort((a,b)=>b.kb-a.kb).slice(0,5);
    body=`<div class="grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:minmax(0,.9fr) minmax(0,1.1fr)">
      <div class="card"><h3>Response time</h3><div class="cb">${histo(rt)}</div></div><div class="card"><h3>HTML size, KB</h3><div class="cb">${histo(kb)}</div></div><div class="card"><h3>Title length, chars</h3><div class="cb">${histo(tl)}</div></div><div class="card"><h3>Words per page</h3><div class="cb">${histo(wd)}</div></div>
      <div class="card" style="grid-column:span 2"><h3>Slowest pages</h3><div class="cb sc"><table>${slow.map(p=>`<tr><td class="ell">${esc(p.p)}</td><td class="r warnc">${p.t} s</td><td class="r">${p.kb} KB</td></tr>`).join('')}</table></div></div>
      <div class="card" style="grid-column:span 2"><h3>Heaviest pages</h3><div class="cb sc"><table>${heavy.map(p=>`<tr><td class="ell">${esc(p.p)}</td><td class="r warnc">${p.kb} KB</td><td class="r">${p.t} s</td></tr>`).join('')}</table></div></div></div>`;
  }else if(tab==='search'){
    const q=SERP.filter(s=>!s.brand),all=sovTable(),sov=all.slice(0,8),dom=domainCounts().slice(0,8);
    if(!sov.find(x=>x[0]==='SRV Media'))sov.push(['SRV Media',(all.find(x=>x[0]==='SRV Media')||['',1])[1]]);
    body=`<div class="grid" style="grid-template-columns:1.5fr 1fr"><div class="card"><h3>Who is named, by search <span class="chip">${q.length} searches</span></h3><div class="cb sc"><table class="matrix"><tr><th>Agency</th>${q.map((s,i)=>`<th title="${esc(s.q)}">S${i+1}</th>`).join('')}<th>Total</th></tr>${sov.map(a=>`<tr><td>${esc(a[0])}</td>${q.map(s=>`<td><span class="dotf ${s.named.includes(a[0])?(a[0]==='SRV Media'?'r':''):'o'}"></span></td>`).join('')}<td>${a[1]}</td></tr>`).join('')}</table><div style="font-size:11.5px;color:var(--muted);margin-top:10px;line-height:1.5">${q.map((s,i)=>'S'+(i+1)+': '+esc(s.q)).join('<br>')}</div></div></div>
      <div class="card"><h3>Most cited domains</h3><div class="cb sc">${bars(dom.map(d=>[d[0],d[1]]),dom[0][1],'var(--ink)',b=>b[1]+' results')}<div style="font-size:11.5px;color:var(--muted);margin-top:8px;line-height:1.5">Domains that appear most in the results. These are the places where being listed or cited changes visibility.</div></div></div></div>`;
  }else if(tab==='audience'){
    const s=SRV.social,tot=s.instagram.followers+s.facebook.followers;
    body=`<div class="grid" style="grid-template-columns:1fr 1.2fr"><div class="card"><h3>Audience by channel</h3><div class="cb">${bars([['Facebook',s.facebook.followers],['Instagram',s.instagram.followers]],s.facebook.followers,'var(--ink)',b=>fmtNum(b[1]))}<div class="hr"></div><dl class="kv"><dt>Combined</dt><dd>${fmtNum(tot)}</dd><dt>Instagram posts</dt><dd>${fmtNum(s.instagram.posts)}</dd><dt>Followers per post</dt><dd>${Math.round(s.instagram.followers/s.instagram.posts*10)/10}</dd><dt>Facebook talking about</dt><dd>${fmtNum(s.facebook.talking)}</dd></dl></div></div>
      <div class="card"><h3>Tracking readiness, all clients</h3><div class="cb sc"><table><tr><th>Client</th><th>GTM</th><th>GA4</th><th>Meta Pixel</th></tr>${S.clients.map(id=>{const c=CLIENTS[id],g=c.own?['x']:c.tech.gtm,a=c.own?['x']:c.tech.ga4;return `<tr><td>${esc(c.short)}</td><td>${g.length?'<span class="chip g">found</span>':'<span class="chip a">none</span>'}</td><td>${a.length?'<span class="chip g">found</span>':'<span class="chip a">none</span>'}</td><td><span class="chip a">not in source</span></td></tr>`}).join('')}</table></div></div></div>`;
  }else{
    const ch=S.changes,you=ch.filter(c=>c.actor==='You').length,lum=ch.length-you;
    const tl={};S.toolLog.forEach(l=>{const a=agentOfTool(l.name);tl[a]=(tl[a]||0)+1});
    const camps=propsOf(S.cur).filter(p=>p.type==='campaign'),ap=camps.filter(p=>S.approved.has(p.id)).length,lv=camps.filter(p=>S.launched[p.id]).length;
    body=`<div class="grid" style="grid-template-columns:repeat(3,1fr)"><div class="card"><h3>Changes made <span class="chip">${ch.length}</span></h3><div class="cb sc">${ch.length?bars([['By you',you],['By Lumen',lum]],Math.max(1,you,lum),'var(--ink)',b=>b[1]):'<div class="empty">No changes yet. Edit a creative or ask Lumen to.</div>'}<div class="hr"></div><div style="font-size:12px;color:var(--text2);line-height:1.5">Every change is logged with who made it, so manual and prompted work stay visible together.</div></div></div>
      <div class="card"><h3>Platform activity <span class="chip">${S.toolLog.length}</span></h3><div class="cb sc">${Object.keys(tl).length?bars(Object.entries(tl).sort((a,b)=>b[1]-a[1]),Math.max(...Object.values(tl)),'var(--ink)',b=>b[1]):'<div class="empty">No activity yet.</div>'}</div></div>
      <div class="card"><h3>Proposal funnel</h3><div class="cb">${bars([['Proposed',camps.length],['Approved',ap],['In Meta review',lv]],Math.max(1,camps.length),'var(--ink)',b=>b[1])}<div class="hr"></div><div style="font-size:12px;color:var(--text2);line-height:1.5">Approval rate ${camps.length?Math.round(ap/camps.length*100):0}%. Delivery results join this funnel after Meta approves the ads.</div></div></div></div>`;
  }
  stage(`<div class="scr">${hdr}${body}</div>`);growBars();
  $('#at').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.anTab=b.dataset.t;VIEWS.analytics()});
};

/* ================= PROFITABILITY ================= */
VIEWS.profit=function(){
  const a=S.assume,ag=S.role==='agency';
  stage(`<div class="scr">${sh('Profitability',ag?'What the agents change in your agency economics. Every number below comes from assumptions you control.':'What Lumen changes in the cost of running your marketing. Every number comes from assumptions you control.','<span class="chip a">Assumptions, not results</span>')}
   <div class="tiles" id="ptiles"></div>
   <div class="grid" style="grid-template-columns:340px minmax(0,1fr) 300px">
    <div class="card"><h3>Assumptions</h3><div class="cb sc" id="assume"></div></div>
    <div class="card"><h3>${ag?'Per client, per month':'Per month'}</h3><div class="cb sc" id="pres"></div></div>
    <div class="card"><h3>Client outcome scenario</h3><div class="cb sc" id="pscn"></div></div>
   </div></div>`);
  const num=(k,v)=>`<input type="text" class="inpn" data-k="${k}" value="${v}" style="width:100%">`;
  $('#assume').innerHTML=`<div class="fld2"><div class="fld"><label>Cost per team hour</label>${num('rate',a.rate)}</div><div class="fld"><label>Hours per person per month</label>${num('fteHours',a.fteHours)}</div></div>
   <div class="fld2"><div class="fld"><label>Lumen platform cost per client</label>${num('platform',a.platform)}</div>${ag?`<div class="fld"><label>Fee model</label><select id="feeM"><option value="pct" ${a.fee==='pct'?'selected':''}>% of media spend</option><option value="ret" ${a.fee==='ret'?'selected':''}>Monthly retainer</option></select></div>`:`<div class="fld"><label>Agency or freelancer cost today</label>${num('indFee',a.indFee)}</div>`}</div>
   ${ag?'<div id="feeBox"></div>':''}
   <div class="hr"></div><span class="lbl">Work per client per month</span>
   <table><tr><th>Use case</th><th class="r">By hand h</th><th class="r">Review h</th><th class="r">Runs</th><th class="r">Agent cost</th></tr>${a.uc.map((u,i)=>`<tr><td style="font-size:12px">${esc(u.label)}</td><td class="r"><input type="text" class="inpn" data-u="${i}" data-f="man" value="${u.man}"></td><td class="r"><input type="text" class="inpn" data-u="${i}" data-f="rev" value="${u.rev}"></td><td class="r"><input type="text" class="inpn" data-u="${i}" data-f="runs" value="${u.runs}"></td><td class="r"><input type="text" class="inpn" data-u="${i}" data-f="cost" value="${u.cost}"></td></tr>`).join('')}</table>
   <div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.5">Starting values are placeholders. Replace them with your own timesheets and tool costs.</div>`;
  const draw=()=>{
    const P=profitAll();
    if(ag){
      $('#ptiles').innerHTML=`<div class="tile"><small>Hours freed per month</small><b>${hfmt(P.saved)}</b><span>${hfmt(P.saved/S.clients.length)} per client</span></div><div class="tile"><small>Monthly margin</small><b style="font-size:20px;margin:5px 0">${rupee(P.mH)} to ${rupee(P.mA)}</b><span>${rupee(P.mA-P.mH)} more with Lumen</span></div><div class="tile"><small>Cost to serve one client</small><b style="font-size:20px;margin:5px 0">${rupee(P.cpcH)} to ${rupee(P.cpcA)}</b><span>${P.cpcH?Math.round((1-P.cpcA/P.cpcH)*100):0}% lower</span></div><div class="tile"><small>Clients one person can run</small><b style="font-size:20px;margin:5px 0">${Math.round(P.perFteH*10)/10} to ${Math.round(P.perFteA*10)/10}</b><span>${a.fteHours} hours a month</span></div>`;
      const mx=Math.max(1,...P.rows.map(r=>Math.max(r.costH,r.costA)));
      $('#pres').innerHTML=`<table><tr><th>Client</th><th class="r">Revenue</th><th class="r">Cost today</th><th class="r">Cost with Lumen</th><th class="r">Margin today</th><th class="r">Margin with Lumen</th><th class="r">Gain</th></tr>
       ${P.rows.map(r=>`<tr><td>${esc(CLIENTS[r.id].short)}${r.internal?'<small>Internal, no revenue</small>':''}</td><td class="r">${r.internal?'-':rupee(r.revenue)}</td><td class="r">${rupee(r.costH)}</td><td class="r">${rupee(r.costA)}</td><td class="r">${r.internal?'-':rupee(r.mH)+'<small>'+Math.round(r.mH/r.revenue*100)+'%</small>'}</td><td class="r ${r.internal?'':'okc'}">${r.internal?'-':rupee(r.mA)+'<small>'+Math.round(r.mA/r.revenue*100)+'%</small>'}</td><td class="r okc">${rupee(r.gain)}</td></tr>`).join('')}
       <tr><td><b style="font-weight:500">Total</b></td><td class="r">${rupee(P.revenue)}</td><td class="r">${rupee(P.rows.reduce((s,r)=>s+r.costH,0))}</td><td class="r">${rupee(P.rows.reduce((s,r)=>s+r.costA,0))}</td><td class="r">${rupee(P.mH)}</td><td class="r okc">${rupee(P.mA)}</td><td class="r okc">${rupee(P.gain)}</td></tr></table>
       <div class="hr"></div><span class="lbl">Cost to serve each client, today vs with Lumen</span>${P.rows.map(r=>`<div style="margin-bottom:8px"><div style="font-size:12px;margin-bottom:2px">${esc(CLIENTS[r.id].short)}</div><div class="hb" style="margin:2px 0"><span class="nm" style="width:80px">Today</span><div class="tr"><i style="width:${r.costH/mx*100}%;background:#b7aea5"></i></div><span class="v" style="width:80px">${rupee(r.costH)}</span></div><div class="hb" style="margin:2px 0"><span class="nm" style="width:80px">With Lumen</span><div class="tr"><i style="width:${r.costA/mx*100}%"></i></div><span class="v" style="width:80px">${rupee(r.costA)}</span></div></div>`).join('')}
       <div style="font-size:11.5px;color:var(--muted);line-height:1.5">Revenue is ${a.fee==='pct'?a.pct+'% of each client\'s monthly media budget':'the retainer you entered'}. Cost today is hours by hand times your team cost. Cost with Lumen is your review hours, agent run costs and the platform cost.</div>`;
      document.querySelectorAll('#pres .inpn').forEach(()=>{});
    }else{
      const t=ucTotals(),withL=t.rev*a.rate+t.ag+a.platform;
      $('#ptiles').innerHTML=`<div class="tile"><small>Hours freed per month</small><b>${hfmt(P.saved)}</b><span>${hfmt(t.man)} by hand to ${hfmt(t.rev)} of review</span></div><div class="tile"><small>Cost of marketing work today</small><b style="font-size:20px;margin:5px 0">${rupee(a.indFee)}</b><span>agency or freelancer</span></div><div class="tile"><small>Cost with Lumen</small><b style="font-size:20px;margin:5px 0">${rupee(withL)}</b><span>review time, agent runs, platform</span></div><div class="tile"><small>Saved per month</small><b>${rupee(a.indFee-withL)}</b><span>${a.indFee?Math.round((1-withL/a.indFee)*100):0}% lower</span></div>`;
      $('#pres').innerHTML=`<table><tr><th>Line</th><th class="r">Today</th><th class="r">With Lumen</th></tr><tr><td>Marketing work</td><td class="r">${rupee(a.indFee)}</td><td class="r">-</td></tr><tr><td>Your review time (${hfmt(t.rev)})</td><td class="r">-</td><td class="r">${rupee(t.rev*a.rate)}</td></tr><tr><td>Agent runs</td><td class="r">-</td><td class="r">${rupee(t.ag)}</td></tr><tr><td>Platform</td><td class="r">-</td><td class="r">${rupee(a.platform)}</td></tr><tr><td><b style="font-weight:500">Total</b></td><td class="r">${rupee(a.indFee)}</td><td class="r okc">${rupee(withL)}</td></tr></table>`;
    }
    const sc=S.scn,spend=mbOf(S.cur)*.9,leads=spend/sc.cpl,cust=leads*sc.close/100,rev=cust*sc.value,leads2=spend/(sc.cpl*(1-sc.imp/100)),cust2=leads2*sc.close/100,rev2=cust2*sc.value;
    $('#pscn').innerHTML=`<div style="font-size:12px;color:var(--text2);line-height:1.5;margin-bottom:10px">What a better cost per lead could mean for ${esc(C().short)} on the same media budget. A scenario to test, not a forecast.</div>
     <div class="fld2"><div class="fld"><label>Cost per lead today</label><input type="text" class="inpn" data-s="cpl" value="${sc.cpl}" style="width:100%"></div><div class="fld"><label>Lead to customer %</label><input type="text" class="inpn" data-s="close" value="${sc.close}" style="width:100%"></div></div>
     <div class="fld2"><div class="fld"><label>Value per customer</label><input type="text" class="inpn" data-s="value" value="${sc.value}" style="width:100%"></div><div class="fld"><label>Cost per lead improves by %</label><input type="text" class="inpn" data-s="imp" value="${sc.imp}" style="width:100%"></div></div>
     <div class="hr"></div><dl class="kv"><dt>Media spend planned</dt><dd>${rupee(spend)}</dd><dt>Leads</dt><dd>${Math.round(leads)} to ${Math.round(leads2)}</dd><dt>Customers</dt><dd>${Math.round(cust*10)/10} to ${Math.round(cust2*10)/10}</dd><dt>Customer value</dt><dd>${rupee(rev)} to ${rupee(rev2)}</dd><dt>Extra value</dt><dd class="okc">${rupee(rev2-rev)}</dd></dl>`;
    $('#pscn').querySelectorAll('[data-s]').forEach(i=>i.onchange=()=>{S.scn[i.dataset.s]=parseAmt(i.value);draw()});
  };
  const onK=e=>{a[e.target.dataset.k]=parseAmt(e.target.value);draw()};
  const feeBox=()=>{
    if(!ag)return;
    $('#feeBox').innerHTML=a.fee==='pct'?`<div class="fld"><label>Fee as % of media spend</label>${num('pct',a.pct)}</div>`:`<div class="fld"><label>Retainer per client per month</label>${S.clients.filter(id=>!CLIENTS[id].own).map(id=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="flex:1;font-size:12px">${esc(CLIENTS[id].short)}</span><input type="text" class="amt" data-ret="${id}" value="${rupee(a.retainer[id]||0)}"></div>`).join('')}</div>`;
    $('#feeBox').querySelectorAll('[data-k]').forEach(i=>i.onchange=onK);
    $('#feeBox').querySelectorAll('[data-ret]').forEach(i=>i.onchange=()=>{a.retainer[i.dataset.ret]=parseAmt(i.value);draw()});
  };
  document.querySelectorAll('#assume [data-k]').forEach(i=>i.onchange=onK);
  document.querySelectorAll('#assume [data-u]').forEach(i=>i.onchange=()=>{a.uc[+i.dataset.u][i.dataset.f]=parseAmt(i.value);draw()});
  const fm=$('#feeM');if(fm)fm.onchange=()=>{a.fee=fm.value;feeBox();draw()};
  feeBox();draw();
};
