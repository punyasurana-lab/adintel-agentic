/* Lumen prototype, part 3: workplan (agent schedule), GEO audit, prompt layer, change history.
   The prompt layer is a plain rule-based parser: every instruction maps to the same state changes the manual controls make. */

const TODAY=new Date(2026,9,26);
S.startDate=new Date(2026,9,29);S.autoRefresh=true;S.changes=[];S.wpSel=null;S.startOpt='29 Oct';
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtD=d=>d.getDate()+' '+MON[d.getMonth()];
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const dayIdx=d=>Math.round((d-TODAY)/86400000);
const winText=days=>fmtD(S.startDate)+' to '+fmtD(addDays(S.startDate,days-1));
Object.values(PROPS).forEach(arr=>arr.forEach(p=>{if(p.days&&p.type==='campaign')Object.defineProperty(p,'win',{get(){return winText(this.days)},configurable:true,enumerable:true})}));
function logChange(actor,scope,desc,by){S.changes.push({t:Date.now(),actor,by:by||'',scope,desc})}

/* ================= SCHEDULE: what happens next, who does it, where a human decides ================= */
const INFO={
 'Brand DNA and baseline':['Researcher and Analyst built the Brand DNA, the site audit, the search baseline and the competitor profiles.',false,'brand'],
 'Confirm Brand DNA':['You confirm the Brand DNA. Every later step reads from it.',true,'brand'],
 'Weekly visibility rescan':['Analyst re-runs the tracked prompts and updates share of voice, so movement is visible week to week.',false,'visibility'],
 'Approve plan':['You review the evidence, structure and budget. Nothing is created in Meta before this.',true,'plan'],
 'Build creatives':['Creative agent fills the chosen template from the brand kit and writes copy for feed, video and reel.',false,'creative'],
 'Claims and policy check':['Compliance checks every claim against the site, the spend caps and the landing page.',false,'plan'],
 'Meta review':['AdIntel creates the campaign through Meta. Meta reviews the ads, usually within 24 hours.',false,'launch'],
 'Learning phase':['Delivery starts. No changes are made until enough results exist.',false,'monitor'],
 'Day-3 read':['Optimizer reads early delivery and applies your rules inside the spend caps.',false,'monitor'],
 'Day-7 decision':['You decide to scale, keep or stop, with a one-page summary from the Analyst.',true,'monitor'],
 'Rotate creative variant':['Creative agent swaps in a fresh variant before fatigue, using the same template and the claims you approved.',false,'creative'],
 'Campaign ends':['Optimizer closes the campaign and the Reporter writes the wrap-up.',false,'monitor'],
 'Weekly client update':['Reporter writes a plain-language update and sends it to the client.',false,'reports'],
 'Homepage scan':['Homepage read for tags, colours and metadata.',false,'overview'],
 'Full audit':['Full crawl, search research and competitor profiling run as a server job.',false,'overview']
};
function scheduleFor(cid){
  const items=[],c=CLIENTS[cid],own=c.own,camps=propsOf(cid).filter(p=>p.type==='campaign'),s0=dayIdx(S.startDate);
  const add=(lane,label,agent,start,dur,status,extra)=>items.push({id:cid+'|'+lane+'|'+label+'|'+start,lane,label,agent,start,dur:dur||1,status,...(extra||{})});
  if(own){
    add('Research','Brand DNA and baseline','Researcher',0,1,'done');
    add('Research','Confirm Brand DNA','You',0,1,S.dnaOk[cid]?'done':'needs');
    [7,14,21,28].forEach(d=>add('Research','Weekly visibility rescan','Analyst',d,1,'scheduled'));
  }else{
    add('Research','Homepage scan','Researcher',0,1,'done');
    add('Research','Full audit','Researcher',2,1,'scheduled');
  }
  camps.forEach(p=>{
    const lane=p.short,ap=S.approved.has(p.id),built=!!(S.creativeSeen&&S.creativeSeen[p.id]),lv=!!S.launched[p.id],bl=isBlocked(p);
    const cp=CREATIVE[p.id]?copyOf(p.id):null,bad=cp&&[...cp.heads,cp.primary].some(t=>claimsAll(t).some(r=>r[0]==='bad'));
    add(lane,'Approve plan','You',s0-3,1,ap?'done':bl?'blocked':'needs',{pid:p.id});
    if(CREATIVE[p.id])add(lane,'Build creatives','Creative agent',s0-2,1,built?'done':ap?'running':'scheduled',{pid:p.id});
    add(lane,'Claims and policy check','Compliance',s0-1,1,built?(bad?'blocked':'done'):'scheduled',{pid:p.id});
    add(lane,'Meta review','AdIntel',s0-1,1,lv?'running':'scheduled',{pid:p.id});
    add(lane,'Learning phase','Optimizer',s0,3,lv?'running':'scheduled',{pid:p.id});
    add(lane,'Day-3 read','Optimizer',s0+3,1,'scheduled',{pid:p.id});
    add(lane,'Day-7 decision','You',s0+7,1,'scheduled',{pid:p.id});
    if(S.autoRefresh&&CREATIVE[p.id])add(lane,'Rotate creative variant','Creative agent',s0+10,1,'scheduled',{pid:p.id});
    add(lane,'Campaign ends','Optimizer',s0+p.days-1,1,'scheduled',{pid:p.id});
  });
  propsOf(cid).filter(p=>p.type==='task').forEach(t=>add('Setup tasks',t.t,'You',1,1,S.tasks[t.task]?'done':'needs',{info:[t.trig,true,'autopilot']}));
  if(camps.length)[7,14,21].forEach(k=>add('Reporting','Weekly client update','Reporter',s0+k,1,'scheduled'));
  return items.filter(i=>i.start<36&&i.start+i.dur>0||i.status==='done');
}
const SLAB={done:'Done',needs:'Needs you',blocked:'Blocked',running:'In progress',scheduled:'Scheduled'};
const SDOT={done:'done',needs:'wait',blocked:'attn',running:'work',scheduled:'idle'};
function nextUp(cid,n,maxDay){return scheduleFor(cid).filter(i=>i.status!=='done'&&i.start<=(maxDay==null?99:maxDay)).sort((a,b)=>(a.status==='needs'?-1:0)-(b.status==='needs'?-1:0)||a.start-b.start).slice(0,n)}
function nextUpAll(maxDay){return S.clients.flatMap(cid=>nextUp(cid,4,maxDay).map(it=>({it,cid}))).sort((a,b)=>a.it.start-b.it.start).slice(0,9)}
function nextRow(it,cid){return `<div class="rost"><span class="dot-s ${SDOT[it.status]}"></span><div class="tx"><b>${esc(it.label)}</b><small>${esc(CLIENTS[cid].short)} · ${fmtD(addDays(TODAY,Math.max(0,it.start)))} · ${esc(it.agent)}</small></div><span class="chip ${it.status==='needs'?'a':it.status==='blocked'?'r':''}">${SLAB[it.status]}</span></div>`}

/* ================= WORKPLAN ================= */
VIEWS.workplan=function(){
  const cid=S.cur,items=scheduleFor(cid),N=36,own=CLIENTS[cid].own,camps=propsOf(cid).filter(p=>p.type==='campaign');
  const lanes=[...new Set(items.map(i=>i.lane))];
  const sel=items.find(i=>i.id===S.wpSel)||nextUp(cid,1)[0]||items[0];
  const withCre=camps.filter(p=>CREATIVE[p.id]).length;
  const pct=(a,b)=>b?Math.round(a/b*100):0;
  const ph=[
   ['Foundations','Brand DNA, audit, search baseline',own?(S.dnaOk[cid]?100:85):30],
   ['Approvals and creative','Plans approved, creatives built',pct(camps.filter(p=>S.approved.has(p.id)).length+camps.filter(p=>S.creativeOk[p.id]).length,camps.length+withCre)],
   ['Launch and learning','Meta review, first reads',pct(camps.filter(p=>S.launched[p.id]).length,camps.length)],
   ['Optimise and report','Rules, weekly updates',0]];
  const ticks=[0,7,14,21,28,35];
  const L=d=>(d+.5)/N*100+'%';
  const starts=['29 Oct','2 Nov','5 Nov','9 Nov'];
  stage(`<div class="scr">${sh('Workplan',esc(C().name)+' · what the agents do next, and where a person decides','<span style="font-size:12px;color:var(--muted)">Campaign start</span><select id="wpStart" style="width:110px">'+starts.map(x=>`<option ${S.startOpt===x?'selected':''}>${x}</option>`).join('')+'</select><span style="font-size:12px;color:var(--muted);margin-left:8px">Rotate variants</span><div class="sw2 '+(S.autoRefresh?'on':'')+'" id="wpAuto"></div>')}
   <div class="phs">${ph.map((p,i)=>`<div class="ph"><b>${i+1}. ${p[0]}<span style="font-weight:400;color:var(--text2)">${p[2]}%</span></b><small>${p[1]}</small><div class="pbar"><i data-w="${p[2]}" style="width:0"></i></div></div>`).join('')}</div>
   <div class="grid" style="grid-template-columns:minmax(0,1fr) 320px">
    <div class="card"><h3>Timeline <span class="chip">26 Oct to 30 Nov</span><div class="lg3" style="margin-left:auto">${['done','needs','running','blocked','scheduled'].map(s=>`<span><i class="s-${s}"></i>${SLAB[s]}</span>`).join('')}</div></h3>
     <div class="cb sc"><div class="gaxis"><span></span><div class="tk">${ticks.map(d=>`<span style="left:${L(d)}">${fmtD(addDays(TODAY,d))}</span>`).join('')}</div></div>
     ${lanes.map(l=>`<div class="glane"><b>${esc(l)}</b><div class="gtrack"><div class="gnow" style="left:${.5/N*100}%"></div>${items.filter(i=>i.lane===l).map((i,k)=>{const top=k%2?27:5,cls=`s-${i.status} ${i.id===sel.id?'sel':''}`;return i.dur>1?`<div class="gi ${cls}" data-i="${esc(i.id)}" style="left:${Math.max(0,i.start)/N*100}%;width:${i.dur/N*100}%;top:${top}px" title="${esc(i.label)}">${esc(i.label)}</div>`:`<div class="gd ${cls}" data-i="${esc(i.id)}" style="left:${L(Math.max(0,i.start))};top:${top+2}px" title="${esc(i.label)} · ${fmtD(addDays(TODAY,i.start))}"></div>`}).join('')}</div></div>`).join('')}</div></div>
    <div class="col"><div class="card" id="wpd"></div><div class="card" style="flex:1"><h3>Next up</h3><div class="cb sc">${nextUp(cid,6).map(it=>nextRow(it,cid)).join('')||'<div class="empty">Nothing scheduled.</div>'}</div></div></div>
   </div></div>`);
  document.querySelectorAll('.pbar i').forEach(i=>requestAnimationFrame(()=>requestAnimationFrame(()=>{i.style.width=i.dataset.w+'%'})));
  const it=items.find(i=>i.id===S.wpSel)||sel,inf=it.info||INFO[it.label]||['Scheduled step.',false,'overview'];
  const dep={'Build creatives':'Plan approved','Claims and policy check':'Creatives built','Meta review':'Plan approved and claims checked','Learning phase':'Meta approves the ads','Day-3 read':'Delivery has started','Day-7 decision':'Enough results to compare','Rotate creative variant':'Frequency rises','Campaign ends':'Schedule'}[it.label]||'None';
  $('#wpd').innerHTML=`<h3>${esc(it.label)} <span class="chip ${it.status==='needs'?'a':it.status==='blocked'?'r':it.status==='done'?'g':''}">${SLAB[it.status]}</span></h3><div class="cb sc"><div style="font-size:12.5px;line-height:1.5;margin-bottom:10px">${esc(inf[0])}</div>
   <dl class="kv"><dt>When</dt><dd>${fmtD(addDays(TODAY,Math.max(0,it.start)))}${it.dur>1?' for '+it.dur+' days':''}</dd><dt>Who</dt><dd>${esc(it.agent)}</dd><dt>Decision</dt><dd>${inf[1]?'A person decides':'Automatic, inside your limits'}</dd><dt>Starts when</dt><dd>${dep}</dd>${it.pid?`<dt>Campaign</dt><dd>${esc((camps.find(p=>p.id===it.pid)||{}).short||'')}</dd>`:''}</dl></div>
   <div style="display:flex;gap:6px;margin-top:8px;flex:none"><button class="btn sm" id="wpGo">Open ${esc(viewLabel(inf[2]).toLowerCase())}</button></div>`;
  $('#wpGo').onclick=()=>gotoView(inf[2],()=>{if(it.pid)S.sel=it.pid});
  document.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{S.wpSel=el.dataset.i;VIEWS.workplan()});
  $('#wpStart').onchange=e=>{S.startOpt=e.target.value;const p=e.target.value.split(' ');S.startDate=new Date(2026,MON.indexOf(p[1]),+p[0]);logChange('You','Workspace','Campaign start moved to '+e.target.value);tool('schedule.update','start='+e.target.value,'workplan recalculated');VIEWS.workplan();renderSide()};
  $('#wpAuto').onclick=()=>{S.autoRefresh=!S.autoRefresh;logChange('You','Workspace',(S.autoRefresh?'Enabled':'Disabled')+' automatic creative variant rotation');VIEWS.workplan()};
};

/* ================= GEO AUDIT ================= */
function geoScores(){
  const P=CRAWL,pr=srvPresence(),h=healthScore();
  const schema=Math.round(P.filter(p=>p.schema>0).length/P.length*100),depth=Math.round(P.filter(p=>p.w>=450).length/P.length*100);
  const faq=P.find(p=>p.p==='/faq/'),answers=faq?(faq.schema>0?100:50):0;
  const dims=[
   ['Presence in category searches',Math.round(pr.listed/pr.total*100),30,'srvmedia.com listed in '+pr.listed+' of '+pr.total+' category searches'],
   ['Named in third-party lists',Math.round(pr.named/pr.total*100),15,'Named inside '+pr.named+' of '+pr.total+' result sets'],
   ['Structured data',schema,15,P.filter(p=>p.schema>0).length+' of '+P.length+' sampled pages carry JSON-LD'],
   ['Content depth',depth,10,P.filter(p=>p.w>=450).length+' of '+P.length+' pages have 450 words or more'],
   ['Technical health',h.score,15,'Health score from the site audit'],
   ['Answer readiness',answers,15,'/faq/ has '+(faq?faq.w:0)+' words; FAQPage markup is '+(faq&&faq.schema>0?'present':'missing')]];
  return {dims,overall:Math.round(dims.reduce((s,d)=>s+d[1]*d[2],0)/100)};
}
function radar(vals,labels){
  const cx=130,cy=120,R=82,pt=(i,v)=>{const a=(-90+i*360/vals.length)*Math.PI/180;return [cx+R*v/100*Math.cos(a),cy+R*v/100*Math.sin(a)]};
  const ring=r=>vals.map((_,i)=>pt(i,r).join(',')).join(' ');
  return `<svg viewBox="0 0 260 240" style="width:100%;height:100%;max-height:250px">${[25,50,75,100].map(r=>`<polygon points="${ring(r)}" fill="none" stroke="#ece6e0" stroke-width="1"/>`).join('')}${vals.map((_,i)=>`<line x1="${cx}" y1="${cy}" x2="${pt(i,100)[0]}" y2="${pt(i,100)[1]}" stroke="#ece6e0"/>`).join('')}<polygon points="${vals.map((v,i)=>pt(i,Math.max(v,3)).join(',')).join(' ')}" fill="#DA1F26" fill-opacity=".22" stroke="#DA1F26" stroke-width="2"/>${vals.map((v,i)=>{const p=pt(i,Math.max(v,3));return `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#DA1F26"/>`}).join('')}${labels.map((l,i)=>{const p=pt(i,124);return `<text x="${p[0]}" y="${p[1]}" font-size="9.5" text-anchor="middle" fill="#5a554f" font-family="Inter,sans-serif">${l}</text>`}).join('')}</svg>`;
}
VIEWS.geo=function(){
  if(partial('GEO audit','The GEO audit'))return;
  const {dims,overall}=geoScores(),q=SERP.filter(s=>!s.brand),all=sovTable(),sov=all.slice(0,6);
  if(!sov.find(x=>x[0]==='SRV Media'))sov.push(['SRV Media',(all.find(x=>x[0]==='SRV Media')||['',1])[1]]);
  const w=Object.fromEntries(dims.map(d=>[d[0],d]));
  const gain=(name,target)=>Math.max(0,Math.round((target-w[name][1])*w[name][2]/100*10)/10);
  const fixes=[
   ['Get listed in 3 of the 6 category searches','Presence in category searches',50,'Pitch the publishers behind the lists in the results'],
   ['Add FAQPage markup to /faq/','Answer readiness',100,'The page already has '+((CRAWL.find(p=>p.p==='/faq/')||{}).w||0)+' words of answers'],
   ['Add Service and Course schema to service pages','Structured data',80,'Only '+CRAWL.filter(p=>p.schema>0).length+' of '+CRAWL.length+' sampled pages have JSON-LD'],
   ['Earn mentions in 2 more third-party lists','Named in third-party lists',50,'Only the upGrowth Pune list names SRV Media today'],
   ['Fix slow and heavy pages','Technical health',80,CRAWL.filter(p=>p.t>3).length+' pages respond in over 3 s']
  ].map(f=>({t:f[0],g:gain(f[1],f[2]),why:f[3]})).sort((a,b)=>b.g-a.g);
  const after=Math.min(100,Math.round((overall+fixes.reduce((s,f)=>s+f.g,0))*10)/10);
  const sc=v=>v>=60?'var(--green)':v>=30?'#e2a21a':'var(--red)';
  stage(`<div class="scr">${sh('GEO audit','How visible '+esc(SRV.name)+' is to generative search and AI answers. Scored from the live crawl and search results captured '+CAPTURED+'.','<button class="btn sm ghost" id="geoCsv">'+I('download')+' Export CSV</button>')}
   <div class="grid" style="grid-template-columns:230px minmax(0,1fr) 380px">
    <div class="col"><div class="card" style="align-items:center"><h3 style="align-self:flex-start">GEO score</h3><div class="gauge" style="--p:${overall}"><span><div>${overall}<small>out of 100</small></div></span></div><div style="font-size:12px;color:var(--text2);text-align:center;line-height:1.5;margin-top:10px">With the fixes listed here: <b style="font-weight:500;color:var(--green)">${after}</b></div></div>
     <div class="card" style="flex:1"><h3>How it is scored</h3><div class="cb sc"><div style="font-size:11.5px;color:var(--text2);line-height:1.5">Six measured dimensions, weighted: ${dims.map(d=>d[0].toLowerCase()+' '+d[2]+'%').join(', ')}. Each is computed from crawled pages or search results, not estimated.</div></div></div></div>
    <div class="card"><h3>Profile <span class="chip">6 dimensions</span></h3><div class="cb" style="display:flex;align-items:center">${radar(dims.map(d=>d[1]),['Presence','Mentions','Schema','Depth','Technical','Answers'])}</div></div>
    <div class="col"><div class="card" style="flex:1"><h3>Dimensions</h3><div class="cb sc">${dims.map(d=>`<div><div class="dim"><span>${d[0]}</span><div class="tr"><i data-w="${d[1]}" style="width:0;background:${sc(d[1])}"></i></div><b style="font-weight:500;text-align:right">${d[1]}</b></div><div style="font-size:11px;color:var(--muted);margin:-3px 0 4px">${esc(d[3])}</div></div>`).join('')}</div></div></div>
   </div>
   <div class="grid" style="grid-template-columns:1.2fr 1fr;flex:none;height:230px">
    <div class="card"><h3>Citation gap <span class="chip">${q.length} searches</span></h3><div class="cb sc"><table class="matrix"><tr><th>Named in results</th>${q.map((s,i)=>`<th title="${esc(s.q)}">S${i+1}</th>`).join('')}<th>Total</th></tr>${sov.map(a=>`<tr><td>${esc(a[0])}</td>${q.map(s=>`<td><span class="dotf ${s.named.includes(a[0])?(a[0]==='SRV Media'?'r':''):'o'}"></span></td>`).join('')}<td>${a[1]}</td></tr>`).join('')}</table></div></div>
    <div class="card"><h3>Fix first <span class="chip g">+${Math.round(fixes.reduce((s,f)=>s+f.g,0)*10)/10} points</span></h3><div class="cb sc">${fixes.map(f=>`<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;gap:8px;font-size:12.5px"><span>${esc(f.t)}</span><b style="font-weight:500;color:var(--green);white-space:nowrap">+${f.g}</b></div><div style="font-size:11px;color:var(--muted)">${esc(f.why)}</div></div>`).join('')}</div></div>
   </div></div>`);
  growBars();
  $('#geoCsv').onclick=()=>downloadCsv('srvmedia-geo-audit.csv',[['dimension','score','weight_percent','evidence']].concat(dims.map(d=>[d[0],d[1],d[2],d[3]])).concat([['overall',overall,100,'weighted sum']]));
};

/* ================= PROMPT LAYER ================= */
const NAVWORDS=[['creative library','library'],['creative studio','creative'],['site audit','audit'],['work plan','workplan'],['workplan','workplan'],['all clients','portfolio'],['overview','overview'],['autopilot','autopilot'],['campaigns','campaigns'],['templates','templates'],['brand','brand'],['geo','geo'],['audit','audit'],['visibility','visibility'],['search','visibility'],['competitors','competitors'],['social','social'],['analytics','analytics'],['profitability','profit'],['profit','profit'],['reports','reports'],['connections','connections'],['plan','plan'],['creative','creative'],['launch','launch'],['monitor','monitor'],['clients','portfolio']];
const STOPW=new Set(['of','to','and','the','for','in','a','your','from','with','by','is','are','our','on','at']);
function trimTo(s,max){if(s.length<=max)return s;const w=s.split(' ');while(w.join(' ').length>max&&w.length>2)w.pop();while(w.length>2&&STOPW.has(w[w.length-1].toLowerCase().replace(/[^a-z]/g,'')))w.pop();return w.join(' ').replace(/[,:;]+$/,'')}
function parseMoney(t){const m=t.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(k|l|lakh)?\b/i);if(!m)return null;let v=parseFloat(m[1].replace(/,/g,''));const u=(m[2]||'').toLowerCase();if(u==='k')v*=1000;if(u==='l'||u==='lakh')v*=100000;return v}
function parseCmd(raw){
  const t=raw.trim(),l=t.toLowerCase(),own=C().own;
  const camps=propsOf(S.cur).filter(p=>p.type==='campaign');
  const cur=camps.find(p=>p.id===S.sel)||camps[0];
  const cre=CREATIVE[S.sel]?camps.find(p=>p.id===S.sel):camps.find(p=>CREATIVE[p.id]);
  const scopeC=cre?'Creative · '+cre.short:'Creative';
  const help='I can change copy (headlines, call to action, shorter text), templates, logo and text position, background, budgets, start date, approvals, and open any page. Try: "shorten the headlines", "use the proof stat template", "set budget to 80k".';
  let m;
  if((m=l.match(/^(?:open|go to|show|take me to)\s+(.+)$/))){const hit=NAVWORDS.find(n=>m[1].includes(n[0]));if(hit)return {nav:hit[1],title:'Opening '+viewLabel(hit[1])}}
  if(/\bpixel\b|\btracking\b/.test(l)&&/(done|verified|installed|fixed)/.test(l)&&own)return {title:'Mark tracking as verified',by:'Planner',scope:'Workspace',diffs:[['Meta Pixel',S.tasks.pixel?'verified':'not verified','verified']],apply:()=>{S.tasks.pixel=true}};
  if((m=l.match(/start(?:ing)?.*?(\d{1,2})\s*(oct|nov|dec)/))){const mi=MON.findIndex(x=>x.toLowerCase()===m[2]),d=new Date(2026,mi,+m[1]);if(d<=TODAY)return {reply:'The start date must be after today, 26 Oct.',title:'Start date'};return {title:'Move campaign start',by:'Planner',scope:'Workspace',diffs:[['Start date',fmtD(S.startDate),fmtD(d)]],note:'Every date in the workplan and every campaign window moves with it.',apply:()=>{S.startDate=d;S.startOpt=fmtD(d)}}}
  if(/(auto|automatic).*(rotate|refresh|variant)/.test(l)||/(rotate|refresh).*variant/.test(l)){const on=!/(off|stop|disable|no )/.test(l);return {title:(on?'Enable':'Disable')+' automatic variant rotation',by:'Creative agent',scope:'Workspace',diffs:[['Variant rotation',S.autoRefresh?'on':'off',on?'on':'off']],apply:()=>{S.autoRefresh=on}}}
  if(/\bapprove\b/.test(l)){
    let list=[];
    if(/\b(all|ready|everything)\b/.test(l))list=camps.filter(p=>!S.approved.has(p.id)&&canApprove(p));
    else{const hit=camps.find(p=>l.includes(p.id)||p.short.toLowerCase().split('-').some(w=>w.length>3&&l.includes(w)));list=[hit||cur].filter(p=>p&&!S.approved.has(p.id)&&canApprove(p))}
    if(!list.length)return {reply:'Nothing can be approved right now. A campaign may already be approved, blocked by tracking, or over the spend cap.',title:'Approve'};
    return {title:'Approve '+list.length+' campaign'+(list.length>1?'s':''),by:'Planner',scope:'Campaigns',diffs:list.map(p=>[p.short,'draft','approved at '+rupee(bud(p))]),apply:()=>{list.forEach(p=>S.approved.add(p.id))}};
  }
  if(/budget/.test(l)&&/\d/.test(l)&&cur){
    const monthly=/monthly|per month|a month/.test(l),before=monthly?mbOf(S.cur):bud(cur);let v=null;
    const rel=l.match(/(increase|raise|boost|reduce|cut|lower|decrease)[^\d]*(\d+(?:\.\d+)?)\s*%/);
    if(rel){const f=parseFloat(rel[2])/100;v=before*(/(increase|raise|boost)/.test(rel[1])?1+f:1-f)}
    else{const tail=l.split(/\bto\b|=/);v=parseMoney(tail.length>1?tail[tail.length-1]:l.replace(/.*budget/,''))}
    if(!v||v<5000)return {reply:'I could not read an amount of at least ₹5,000. Try "set budget to 80k".',title:'Budget'};
    v=Math.min(1000000,r100(v));
    const warn=!monthly&&usedFor(S.cur,cur.id)+v>capOf(S.cur)?'This is above the '+rupee(capOf(S.cur))+' monthly cap, so approval will be refused until the cap is raised.':'';
    return {title:monthly?'Change monthly budget':'Change budget for '+cur.short,by:'Planner',scope:monthly?'Workspace':'Campaign · '+cur.short,diffs:[[monthly?'Monthly budget':'Campaign budget',rupee(before),rupee(v)]],note:warn,apply:()=>{if(monthly){S.f.mb[S.cur]=v;S.over={}}else{S.over[cur.id]=v;if(S.approved.has(cur.id)&&!canApprove(cur))S.approved.delete(cur.id)}}};
  }
  if(!own||!cre)return /(headline|cta|template|logo|background|shorten|shorter|text)/.test(l)?{reply:'Creative edits work on campaigns that have creatives. Open '+SRV.name+' and a campaign first.',title:'Creative'}:{reply:help,title:'Lumen'};
  const cp=copyOf(cre.id),tp=tplOf(cre.id);
  if((m=l.match(/(question|proof|offer|case)(?:\s+stat)?\s*(?:template|style|layout)/))||(m=l.match(/(?:use|switch to|apply)\s+(?:the\s+)?(question|proof|offer|case)/))){
    const to=TEMPLATES.find(x=>x.id===m[1]);return {title:'Switch template',by:'Creative agent',scope:scopeC,diffs:[['Template',tp.name,to.name]],apply:()=>{S.tplSel[cre.id]=to.id}};
  }
  if((m=t.match(/headline\s*([abc])?\s*(?:to|as|=|:)\s*["“'`]?(.+?)["”'`]?\s*$/i))){
    const idx=m[1]?'abc'.indexOf(m[1].toLowerCase()):0,val=m[2].trim();
    if(val.length>tp.hlMax)return {reply:'That headline is '+val.length+' characters. The '+tp.name+' template allows '+tp.hlMax+'.',title:'Headline too long'};
    return {title:'Change headline '+'ABC'[idx],by:'Creative agent',scope:scopeC,diffs:[['Headline '+'ABC'[idx],cp.heads[idx],val]],note:claimsAll(val).filter(r=>r[0]!=='ok').map(r=>r[1]).join(' '),apply:()=>{cp.heads[idx]=val}};
  }
  if(/(shorten|shorter|trim|tighten|cut down)/.test(l)){
    if(/(primary|body|description)/.test(l)){const first=cp.primary.split('. ');let s=first[0];if(!s.endsWith('.'))s+='.';const to=s.length<cp.primary.length?s:trimTo(cp.primary,100);return {title:'Shorten primary text',by:'Creative agent',scope:scopeC,diffs:[['Primary text',cp.primary,to]],apply:()=>{cp.primary=to}}}
    const alts=(CREATIVE[cre.id].alts)||[[],[],[]];
    const to=cp.heads.map((h,i)=>{if(h.length<=24)return h;const better=(alts[i]||[]).filter(a=>a.length<h.length&&a.length<=tp.hlMax).sort((a,b)=>a.length-b.length)[0];return better||(h.length>tp.hlMax?trimTo(h,tp.hlMax):h)}),ch=to.map((h,i)=>['Headline '+'ABC'[i],cp.heads[i],h]).filter(d=>d[1]!==d[2]);
    if(!ch.length)return {reply:'The headlines are already short, and I have no shorter variant that keeps the meaning.',title:'Shorten headlines'};
    return {title:'Shorten '+ch.length+' headline'+(ch.length>1?'s':''),by:'Creative agent',scope:scopeC,diffs:ch,apply:()=>{cp.heads=to}};
  }
  if((m=l.match(/\b(learn more|sign up|get quote|contact us|book now|download)\b/))&&/(cta|button|call to action)/.test(l)){const to=CTA_OPTIONS.find(o=>o.toLowerCase()===m[1]);return {title:'Change call to action',by:'Creative agent',scope:scopeC,diffs:[['Call to action',cp.cta,to]],apply:()=>{cp.cta=to}}}
  if(/logo/.test(l)&&(m=l.match(/(top left|top right|bottom left)/))){const k={'top left':'tl','top right':'tr','bottom left':'bl'}[m[1]];return {title:'Move logo',by:'Creative agent',scope:scopeC,diffs:[['Logo ('+tp.name+')',{tl:'top left',tr:'top right',bl:'bottom left'}[tp.logo],m[1]]],note:'Applies to every campaign that uses the '+tp.name+' template.',apply:()=>{tp.logo=k}}}
  if(/(headline|text|copy)/.test(l)&&(m=l.match(/\b(top|centre|center|bottom)\b/))){const k=m[1]==='centre'?'center':m[1];return {title:'Move headline',by:'Creative agent',scope:scopeC,diffs:[['Headline position',tp.textPos,k]],note:'Applies to every campaign that uses the '+tp.name+' template.',apply:()=>{tp.textPos=k}}}
  if(/(background|bg|colou?r)/.test(l)&&(m=l.match(/\b(red|blue|black|dark|grey|gray|light)\b/))){
    const map={red:[['#DA1F26','#7a0f14'],false],blue:[['#1863DC','#0b2f6e'],false],black:[['#212121','#000000'],false],dark:[['#212121','#000000'],false],grey:[['#F4F4F4','#d8d8d8'],true],gray:[['#F4F4F4','#d8d8d8'],true],light:[['#F4F4F4','#d8d8d8'],true]}[m[1]];
    return {title:'Change background',by:'Creative agent',scope:scopeC,diffs:[['Background',tp.bg.join(' to '),map[0].join(' to ')]],note:'Applies to every campaign that uses the '+tp.name+' template.',apply:()=>{tp.bg=map[0].slice();tp.dark=map[1]}};
  }
  return {reply:help,title:'Lumen'};
}
function cpClose(){$('#cpOut').classList.remove('open')}
function runCmd(text){
  const out=$('#cpOut');out.classList.add('open');
  if(S.phase!=='app'){out.innerHTML='<h4>Finish onboarding first</h4><div style="font-size:12.5px;color:var(--text2);margin-top:4px">Lumen can change things once the workspace exists.</div>';return}
  const r=parseCmd(text);
  if(r.nav){cpClose();$('#cpIn').value='';openView(r.nav);return}
  if(r.reply){out.innerHTML=`<h4>${esc(r.title||'Lumen')}</h4><div style="font-size:12.5px;color:var(--text2);line-height:1.5;margin-top:4px">${esc(r.reply)}</div>`;return}
  out.innerHTML=`<h4>${esc(r.title)}</h4><div style="font-size:12px;color:var(--muted)">Requested by you, carried out by ${esc(r.by)}. Nothing changes until you apply.</div><dl class="diff">${r.diffs.map(d=>`<dt>${esc(d[0])}</dt><dd><s>${esc(d[1])}</s><b>${esc(d[2])}</b></dd>`).join('')}</dl>${r.note?`<div class="li a" style="margin-bottom:8px">${esc(r.note)}</div>`:''}<div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn ghost sm" id="cpNo">Discard</button><button class="btn sm" id="cpYes">Apply</button></div>`;
  $('#cpNo').onclick=cpClose;
  $('#cpYes').onclick=()=>{r.apply();logChange('Lumen',r.scope,r.title,r.by);tool((r.by==='Creative agent'?'creative':'planner')+'.apply',r.title,'applied on request');cpClose();$('#cpIn').value='';toast('Applied: '+r.title);renderWs();renderSide();renderView()};
}
function setupCopilot(){
  $('#cpI').innerHTML=I('spark');
  const inp=$('#cpIn');
  inp.onkeydown=e=>{if(e.key==='Enter'&&inp.value.trim())runCmd(inp.value.trim());if(e.key==='Escape')cpClose()};
  document.addEventListener('click',e=>{if(!e.target.closest('#copilot'))cpClose()});
}
setupCopilot();
