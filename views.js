/* Lumen prototype views. Every figure is computed from data.js / crawl-data.js (real captures) or from the user's own inputs. */
const VIEWS={};
S.never=['guaranteed rank','100% results','number one'];
S.creativeOk={};

/* ---------- creative content per proposal (copy written from claims that srvmedia.com itself makes) ---------- */
const CREATIVE={
 p1:{concept:'Visibility gap',heads:['Is your brand missing from AI answers?','Free AI and search visibility audit','Google Premier Partner agency'],
  alts:[['Missing from AI answers?','Is your brand in AI answers?'],['Free AI visibility audit','Free visibility audit'],['Google Premier Partner']],
  primary:'We check how your brand appears in Google and AI answers, and where rivals are cited instead. Request a free audit.',cta:'Learn more',
  scenes:[['0-3s','Missing from AI answers?','A question is typed, the brand is absent'],['3-8s','Competitors get cited','Competitor names appear in the answer'],['8-13s','We audit search and AI','An audit checklist builds on screen'],['13-15s','Free audit from SRV Media','Logo and call to action']]},
 p2:{concept:'Admissions proof',heads:['Admissions season, planned early','Parul University: 2X paid applications','Education marketing by SRV EDGE'],
  alts:[['Plan admissions early','Admissions, planned early'],['Parul: 2X paid applications','2X paid applications'],['SRV EDGE for universities']],
  primary:'From campus videos to paid admissions campaigns, SRV EDGE supports universities and B-schools. See our case studies.',cta:'Learn more',
  scenes:[['0-3s','Admissions season is near','A calendar turns to the intake month'],['3-8s','2X paid applications','Parul University case study figure'],['8-13s','Campus video to paid campaigns','Service labels appear in sequence'],['13-15s','SRV EDGE for universities','Logo and call to action']]},
 p4:{concept:'Come back and talk',heads:['Still planning your growth?','Talk to a Google Premier Partner','Speak to our team'],
  alts:[['Planning your growth?'],['Talk to a Premier Partner'],[]],
  primary:'You visited SRV Media. Tell us your goals and we will share a plan across search, social and performance marketing.',cta:'Contact us',
  scenes:[['0-3s','Still planning your growth?','Pages from the site fade in'],['3-8s','Search, social, performance','Three service labels appear'],['8-13s','Google Premier Partner','Partner mark and logo'],['13-15s','Speak to our team','Call to action']]}
};
const CTA_OPTIONS=['Learn more','Sign up','Get quote','Contact us','Book now','Download'];
/* the "Primary goal" chosen in onboarding sets the Meta objective used in plans and launches */
const OBJ={Leads:['Leads','Instant Form','Leads','OUTCOME_LEADS'],Sales:['Leads','Instant Form','Leads','OUTCOME_LEADS'],Messages:['Messages','WhatsApp','Conversations','OUTCOME_ENGAGEMENT'],Awareness:['Awareness','Reach','Reach','OUTCOME_AWARENESS']};
const objOf=()=>OBJ[S.f.goal]||OBJ.Leads;
const copyOf=pid=>{if(!S.copy[pid]){const c=CREATIVE[pid];S.copy[pid]={heads:c.heads.slice(),primary:c.primary,cta:c.cta}}return S.copy[pid]};
const neverCheck=t=>S.never.filter(w=>w&&t.toLowerCase().includes(w.toLowerCase())).map(w=>['bad','Blocked by your Never-say list: "'+w+'"']);
const claimsAll=t=>claimCheck(t).concat(neverCheck(t));
const sevRank={ok:0,warn:1,bad:2};

function policyFor(p){
  const cid=S.cur,out=[],tot=usedFor(cid,p.id)+bud(p),cap=capOf(cid);
  out.push([tot<=cap?'ok':'bad','Total '+rupee(tot)+(tot<=cap?' within':' exceeds')+' the '+rupee(cap)+' monthly cap']);
  const dl=Math.round(bud(p)/p.days),dc=dayCap(cid);
  out.push([dl<=dc?'ok':'bad','Daily '+rupee(dl)+(dl<=dc?' within':' exceeds')+' the '+rupee(dc)+' daily cap']);
  const lp=lpPage(p.lp);
  if(lp){out.push([lp.s===200?'ok':'bad','Landing page '+lp.f+': HTTP '+lp.s+', '+lp.kb+' KB, '+lp.t+' s']);if(lp.h1n>1)out.push(['warn','Landing page has '+lp.h1n+' H1 tags'])}
  out.push([S.tasks.pixel?'ok':'warn',S.tasks.pixel?'Meta Pixel verified':'Meta Pixel not in page source: leads tracked through Instant Form']);
  const cp=copyOf(p.id);let worst=['ok','Claims scan: no issues'];
  [...cp.heads,cp.primary].forEach(t=>claimsAll(t).forEach(r=>{if(sevRank[r[0]]>sevRank[worst[0]])worst=[r[0],'Claims scan: '+r[1]]}));
  out.push(worst);
  out.push([S.conn.meta?'ok':'warn',S.conn.meta?'Meta Ads connected through AdIntel':'Meta Ads not connected: connect before launching']);
  return out;
}
function polLi(r){return '<div class="li '+(r[0]==='ok'?'g':r[0]==='warn'?'a':'r')+'">'+esc(r[1])+'</div>'}
function bars(list,max,color,fmt){return list.map(b=>`<div class="hb"><span class="nm" title="${esc(b[0])}">${esc(b[0])}</span><div class="tr"><i data-w="${max?b[1]/max*100:0}" style="background:${b[2]||color||'var(--ink)'}"></i></div><span class="v">${fmt?fmt(b):b[1]}</span></div>`).join('')}
function growBars(){requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll('[data-w]').forEach(i=>i.style.width=i.dataset.w+'%')))}
function clientTabs(){return ''}
function bindTabs(){document.querySelectorAll('.ct').forEach(b=>b.onclick=()=>switchClient(b.dataset.c))}
function gotoView(v,fn){if(fn)fn();openView(v)}
function downloadCsv(name,rows){const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Downloaded '+name)}
function partial(title,what){
  if(C().own)return false;
  stage(`<div class="scr">${sh(title,esc(C().name),clientTabs())}<div class="card" style="flex:1"><h3>Full audit pending</h3><div class="cb"><p style="font-size:13px;color:var(--text2);max-width:540px;line-height:1.55">Lumen has scanned only the homepage of ${esc(C().name)} (${esc(C().domain)}). ${esc(what)} runs as a server job after onboarding, which this prototype does not include. Switch to ${esc(SRV.name)} to see the full workflow on captured data.</p></div></div></div>`);bindTabs();return true;
}

/* ================= OVERVIEW ================= */
VIEWS.overview=function(){
  const c=C();
  if(!c.own){
    const t=c.tech,tags=[...t.gtm.map(x=>'GTM '+x),...t.ga4.map(x=>'GA4 '+x)];
    const tasks=propsOf(S.cur).filter(p=>p.type==='task');
    stage(`<div class="scr">${sh('Overview',esc(c.name)+' · quick scan of '+esc(c.domain),clientTabs())}
      <div class="tiles"><div class="tile"><small>Homepage HTML</small><b>${c.htmlKb} KB</b><span>${c.images} images</span></div><div class="tile"><small>Platform</small><b style="font-size:16px;margin:6px 0">${esc(t.cms)}</b><span>read from page source</span></div><div class="tile"><small>Tags found</small><b>${tags.length}</b><span>${esc(tags.join(', ')||'none')}</span></div><div class="tile"><small>Meta Pixel</small><b style="font-size:18px;margin:5px 0">Not in source</b><span>Needs a render check</span></div></div>
      <div class="grid" style="grid-template-columns:1.2fr 1fr"><div class="card"><h3>Open tasks <span class="chip">${tasks.filter(x=>!S.tasks[x.task]).length}</span></h3><div class="cb sc">${tasks.map(p=>`<div class="rule"><div class="tx"><b style="font-weight:500">${esc(p.t)}</b><small>${esc(p.trig)}</small></div>${S.tasks[p.task]?'<span class="chip g">Done</span>':`<button class="btn sm" data-t="${p.task}">Mark done</button>`}</div>`).join('')}</div></div>
      <div class="card"><h3>Brand from the homepage</h3><div class="cb"><div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><div style="width:40px;height:40px;border-radius:10px;background:${c.color};color:#fff;display:grid;place-items:center;font-weight:600">${c.mono}</div><b style="font-weight:500">${esc(c.name)}</b></div><span class="lbl">Title</span><div style="font-size:12.5px;margin-bottom:8px">${esc(c.title)}</div><span class="lbl">Meta description</span><div style="font-size:12.5px;margin-bottom:8px;color:var(--text2)">${esc(c.metaDesc)}</div><div class="pills">${c.colors.map(x=>`<span class="pill"><span class="dotc" style="background:${x[0]}"></span>${x[0]}</span>`).join('')}</div></div></div></div></div>`);
    bindTabs();document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{S.tasks[b.dataset.t]=true;toast('Task marked done');VIEWS.overview()});return;
  }
  const h=healthScore(),pr=srvPresence(),ig=SRV.social.instagram,fb=SRV.social.facebook;
  const used=usedFor(S.cur),cap=capOf(S.cur),mb=mbOf(S.cur);
  const iss=auditIssues().filter(i=>i.pages.length&&i.sev==='warn').sort((a,b)=>b.pages.length-a.pages.length);
  const pend=propsOf(S.cur).filter(p=>p.type==='campaign'&&!S.approved.has(p.id)&&!isBlocked(p)).length;
  const act=[];
  if(pend)act.push(['Review '+pend+' proposed campaign'+(pend>1?'s':''),'Built from the search and tracking gaps found','autopilot']);
  if(!S.tasks.pixel)act.push(['Verify Meta Pixel tracking','Not in page source. Blocks retargeting and lead attribution','autopilot']);
  if(!S.conn.meta)act.push(['Connect Meta Ads','Required before anything can launch','connections']);
  act.push(['Be found in category searches: listed in '+pr.listed+' of '+pr.total,'Agency, performance, education and GEO queries','visibility']);
  if(iss[0])act.push([iss[0].pages.length+' pages: '+iss[0].label.toLowerCase(),iss[0].hint,'audit',iss[0].id]);
  act.push(['Reconcile the years claim','15+ years on the site, 12 years on YouTube, founded 2010 or 2011','brand']);
  stage(`<div class="scr">${sh('Overview',esc(SRV.name)+' · srvmedia.com · captured '+CAPTURED,clientTabs())}
   <div class="tiles">
    <div class="tile"><small>Site health</small><b>${h.score}</b><span>${h.pages} of ${SRV.sitemapTotal} URLs sampled</span></div>
    <div class="tile"><small>Category searches where SRV is listed</small><b>${pr.listed} / ${pr.total}</b><span>Named inside ${pr.named} third-party list</span></div>
    <div class="tile"><small>Social audience</small><b>${fmtNum(ig.followers+fb.followers)}</b><span>Instagram ${fmtNum(ig.followers)} · Facebook ${fmtNum(fb.followers)}</span></div>
    <div class="tile"><small>Ad tracking</small><b style="font-size:19px;margin:5px 0">GTM and GA4 found</b><span>Meta Pixel not in page source</span></div>
   </div>
   <div class="grid" style="grid-template-columns:1.3fr 1fr 1fr">
    <div class="card"><h3>Next best actions</h3><div class="cb sc">${act.map((a,i)=>`<div class="rule" style="cursor:pointer" data-a="${i}"><div class="tx"><b style="font-weight:500">${esc(a[0])}</b><small>${esc(a[1])}</small></div>${I('ext')}</div>`).join('')}</div></div>
    <div class="card"><h3>Next up <button class="btn sm ghost" id="goAg" style="margin-left:auto">Open workplan</button></h3><div class="cb sc">${nextUp(S.cur,7).map(it=>nextRow(it,S.cur)).join('')||'<div class="empty">Nothing scheduled.</div>'}</div></div>
    <div class="card"><h3>Budget this month</h3><div class="cb"><span class="lbl">Monthly ad budget</span>${budHtml('mb',mb,10000,1000000,5000)}<div class="cap2" style="margin-top:14px"><div class="t"><span>Approved</span><span>${rupee(used)} of ${rupee(cap)} cap</span></div><div class="b"><i style="width:${Math.min(100,used/cap*100)}%"></i></div></div><div style="font-size:12px;color:var(--text2);line-height:1.5">Lumen plans up to ${rupee(r100(mb*.9))} across campaigns and holds ${rupee(r100(mb*.1))} in reserve for the first winner.</div></div></div>
   </div></div>`);
  bindTabs();growBars();
  $('#goAg').onclick=()=>openView('workplan');
  document.querySelectorAll('[data-a]').forEach(r=>r.onclick=()=>{const a=act[+r.dataset.a];gotoView(a[2],()=>{if(a[3])S.auditFilter=a[3]})});
  bindBud(document,(k,v)=>{S.f.mb[S.cur]=v;S.over={};VIEWS.overview();renderSide()});
};

/* ================= AUTOPILOT ================= */
VIEWS.autopilot=function(){
  const c=C(),props=propsOf(S.cur),own=c.own;
  const pr=srvPresence(),iss=auditIssues().filter(i=>i.pages.length).length;
  const sig=own?[['search','Search visibility gaps',pr.total-pr.listed,'queries without srvmedia.com'],['users','Competitors selling GEO',5,'in the GEO search'],['plug','Tracking gaps',SRV.tech.notFound.length,'tags not in page source'],['file','Site issue types',iss,'across '+CRAWL.length+' pages'],['target','Claims to reconcile',1,'years of experience'],['wallet','Budget used',0,'no campaign live yet']]
   :[['plug','Tracking gaps',props.filter(p=>p.type==='task').length,'from the homepage'],['file','Full audit',0,'pending']];
  const sel=()=>props.find(p=>p.id===S.sel)||props[0];
  stage(`<div class="scr">${sh('Autopilot','Lumen turns what it finds into proposals. You approve, edit or reject.',clientTabs()+`<div style="display:flex;align-items:center;gap:8px;margin-left:8px"><span style="font-size:12px;color:var(--muted)">Monthly budget</span><input type="text" class="amt" id="mbIn" value="${rupee(mbOf(S.cur))}"></div>`)}
   <div class="grid" style="grid-template-columns:240px minmax(0,1fr) 340px">
    <div class="card"><h3>Signals</h3><div class="cb">${sig.map(s=>`<div class="sig"><div class="ic">${I(s[0])}</div><div><b>${s[1]}</b><small>${s[3]}</small></div><span class="n">${s[2]}</span></div>`).join('')}</div></div>
    <div class="card"><h3>Proposals for ${esc(c.short)} <span class="chip" id="aptot"></span></h3><div class="cb sc" id="plist"></div><div style="display:flex;gap:8px;margin-top:8px;flex:none"><button class="btn ghost sm" id="apAll">Approve all ready</button></div></div>
    <div class="card" id="detail"></div>
   </div></div>`);
  bindTabs();
  $('#mbIn').onchange=e=>{const v=Math.max(10000,Math.min(1000000,parseAmt(e.target.value)));S.f.mb[S.cur]=v;S.over={};VIEWS.autopilot();renderSide()};
  const tot=()=>{const a=approvedOf(S.cur);$('#aptot').textContent=a.length?a.length+' approved · '+rupee(usedFor(S.cur))+' of '+rupee(capOf(S.cur)):'None approved'};
  const detail=()=>{
    const p=sel();if(!p){$('#detail').innerHTML='<div class="empty">No proposals.</div>';return}
    const camp=p.type==='campaign';
    $('#detail').innerHTML=`<h3>Why this, why now <span class="chip ${p.type==='locked'?'':isBlocked(p)?'a':'g'}">${p.type==='task'?'Setup task':p.type==='locked'?'Locked':isBlocked(p)?'Blocked':'Ready'}</span></h3>
     <div class="cb sc"><div style="font-size:14px;font-weight:500;margin-bottom:3px">${esc(p.t)}</div>${camp?`<div class="mono" style="color:var(--muted);margin-bottom:10px">${p.cn}</div>`:'<div style="height:8px"></div>'}
     ${p.why.map(x=>`<div class="li g">${esc(x)}</div>`).join('')}
     ${camp?`<div class="hr"></div><dl class="kv"><dt>Budget</dt><dd>${rupee(bud(p))}</dd><dt>Window</dt><dd>${p.win} (${p.days} days)</dd><dt>Audience</dt><dd>${esc(p.aud)}</dd><dt>Locations</dt><dd>${locsOf(p).join(', ')}</dd><dt>Landing page</dt><dd>${p.lp}</dd><dt>Decision</dt><dd>Read at day 7. No ad history, so no result is forecast</dd></dl>`:''}
     ${p.type==='locked'?`<div class="hr"></div><div style="font-size:12.5px;color:var(--amber)">${esc(p.locked)}</div>`:''}</div>
     ${camp?`<div style="display:flex;gap:8px;margin-top:8px;flex:none"><button class="btn sm" id="openPlan">Open plan</button><button class="btn sm ghost" id="openCre">Creative</button></div>`:''}`;
    if(camp){$('#openPlan').onclick=()=>gotoView('plan',()=>{S.sel=p.id});$('#openCre').onclick=()=>gotoView('creative',()=>{S.sel=p.id})}
  };
  const list=()=>{
    const cur=sel();
    $('#plist').innerHTML=props.map((p,i)=>{
      const camp=p.type==='campaign',ap=S.approved.has(p.id),blocked=isBlocked(p);
      const btn=camp?`<button class="btn sm ${ap?'ok':''}" data-ap="${p.id}" ${blocked||(!ap&&!canApprove(p))?'disabled':''}>${ap?'Approved':blocked?'Blocked':'Approve'}</button>`:p.type==='task'?`<button class="btn sm ${S.tasks[p.task]?'ok':''}" data-task="${p.task}">${S.tasks[p.task]?'Done':'Mark done'}</button>`:'<span class="chip">Locked</span>';
      const chips=camp?`<span class="chip">${rupee(bud(p))}</span><span class="chip">${p.win}</span>${blocked?'<span class="chip a">Waits for tracking</span>':''}`:p.type==='task'?'<span class="chip">No spend</span>':`<span class="chip">${esc(p.locked)}</span>`;
      return `<div class="prop ${p.id===cur.id?'sel':''} ${p.type==='locked'?'lock':''}" data-id="${p.id}" style="animation-delay:${i*.08}s"><div class="bar" style="background:${p.type==='task'?'var(--blue)':p.type==='locked'?'#bbb':blocked?'var(--amber)':'var(--green)'}"></div><div><h4>${esc(p.t)}</h4><div class="tr">${esc(p.trig)}</div><div class="meta">${chips}</div></div><div class="act2">${btn}</div></div>`}).join('');
    $('#plist').querySelectorAll('.prop').forEach(r=>r.onclick=e=>{if(e.target.closest('button'))return;S.sel=r.dataset.id;list();detail()});
    $('#plist').querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{const id=b.dataset.ap;if(S.approved.has(id))S.approved.delete(id);else S.approved.add(id);tool('approval.'+(S.approved.has(id)?'approve':'revoke'),'proposal='+id,S.approved.has(id)?'queued for launch':'removed');list();tot();renderSide()});
    $('#plist').querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>{const k=b.dataset.task;S.tasks[k]=!S.tasks[k];tool('task.'+(S.tasks[k]?'done':'reopen'),k,S.tasks[k]?'dependent campaigns unblocked':'campaigns blocked again');if(!S.tasks.pixel)S.approved.delete('p4');list();detail();tot();renderSide()});
  };
  $('#apAll').onclick=()=>{props.filter(p=>p.type==='campaign').forEach(p=>{if(canApprove(p))S.approved.add(p.id)});list();tot();renderSide()};
  $('#apAll').disabled=!props.some(p=>p.type==='campaign');
  list();detail();tot();
};

/* ================= BRAND DNA ================= */
VIEWS.brand=function(){
  const c=C();
  if(!c.own){
    stage(`<div class="scr">${sh('Brand DNA',esc(c.name)+' · from the homepage only',clientTabs())}<div class="grid" style="grid-template-columns:1fr 1fr 1fr"><div class="card"><h3>Identity</h3><div class="cb"><div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><div style="width:44px;height:44px;border-radius:11px;background:${c.color};color:#fff;display:grid;place-items:center;font-weight:600;font-size:16px">${c.mono}</div><b style="font-weight:500">${esc(c.name)}</b></div><span class="lbl">Colours</span><div class="swr" style="margin-bottom:20px">${c.colors.map(x=>`<div style="background:${x[0]}"><small>${x[0]}</small></div>`).join('')}</div><span class="lbl">Headline</span><div style="font-size:12.5px;line-height:1.45">${c.h1.map(esc).join('<br>')}</div></div></div><div class="card"><h3>Page metadata</h3><div class="cb"><span class="lbl">Title</span><div style="font-size:12.5px;margin-bottom:10px">${esc(c.title)}</div><span class="lbl">Meta description</span><div style="font-size:12.5px;color:var(--text2);line-height:1.45">${esc(c.metaDesc)}</div></div></div><div class="card"><h3>Case study on srvmedia.com</h3><div class="cb"><div style="font-size:13px">${esc(c.caseResult)}</div><div class="hr"></div><div style="font-size:12.5px;color:var(--muted);line-height:1.5">Voice, audiences, services and claims come from the full crawl, which has not run for this client.</div></div></div></div></div>`);bindTabs();return;
  }
  const v=SRV.visual,sc=SRV.social;
  stage(`<div class="scr">${sh('Brand DNA',esc(SRV.name)+' · extracted from srvmedia.com, public profiles and search',clientTabs()+'<span class="chip g" id="dnaOk" style="margin-left:8px">Auto-built · v1</span> <button class="btn sm" id="dnaConf">Confirm DNA</button>')}
   <div class="grid" style="grid-template-columns:1fr 1.2fr 1fr">
    <div class="card"><h3>Identity</h3><div class="cb sc">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><img class="logo-img" src="${v.logo}" alt="SRV Media logo" style="height:40px"><span class="chip">Real logo, 17.9 KB SVG</span></div>
      <span class="lbl">Colours (click to copy)</span><div class="swr" style="margin-bottom:22px">${v.colors.map(x=>`<div style="background:${x[0]}" data-hex="${x[0]}" title="${x[1]}"><small>${x[0]}</small></div>`).join('')}</div>
      <span class="lbl">Typography</span><div style="font-size:12.5px;margin-bottom:12px">${v.fonts.join(', ')}</div>
      <span class="lbl">Voice, in their own words</span>
      <div style="font-size:12.5px;line-height:1.5;color:var(--text2)">"${esc(SRV.heroLines[0])} ..."<br>"${esc(SRV.heroLines[1])}"<br>"${esc(sc.instagram.bio)}"</div>
      <div class="hr"></div><span class="lbl">Three pillars</span><div class="pills">${SRV.pillars.map(x=>`<span class="pill">${x}</span>`).join('')}</div>
    </div></div>
    <div class="card"><h3>Offer and proof</h3><div class="cb sc">
      <span class="lbl">Services (${SRV.services.length})</span><div class="pills" style="margin-bottom:12px">${SRV.services.map(x=>`<span class="pill">${x}</span>`).join('')}</div>
      <span class="lbl">Industries (${SRV.industries.length})</span><div class="pills" style="margin-bottom:12px">${SRV.industries.map(x=>`<span class="pill">${x}</span>`).join('')}</div>
      <span class="lbl">Case studies on the site</span>
      <table>${SRV.caseStudies.map(x=>{const pg=lpPage(x.path);return `<tr><td>${x.name}<small>${x.vertical}</small></td><td>${x.result}</td><td class="r">${pg?`<span class="chip g">${pg.s}</span>`:'<span class="chip">n/a</span>'}</td></tr>`}).join('')}</table>
      <div class="hr"></div><span class="lbl">Recognition stated</span>${SRV.recognition.map(x=>`<div class="li g">${esc(x)}</div>`).join('')}
    </div></div>
    <div class="col">
      <div class="card"><h3>Claims to reconcile <span class="chip a">1 conflict</span></h3><div class="cb sc">${SRV.claims.map(x=>`<div class="li ${x.id.startsWith('years')||x.id==='founded'?'a':'g'}">${esc(x.text)}<small>${esc(x.where)}</small></div>`).join('')}<div style="font-size:12px;color:var(--text2);line-height:1.45;margin-top:6px">Lumen keeps years out of ad copy until one number is chosen.</div></div></div>
      <div class="card"><h3>Never say <span class="chip">${S.never.length}</span></h3><div class="cb"><div class="pills" id="nevers">${S.never.map(x=>`<span class="pill on">${esc(x)}<span class="x" data-nv="${esc(x)}">${I('x')}</span></span>`).join('')}</div><input type="text" id="nvIn" placeholder="Add a phrase and press Enter" style="margin-top:8px"></div></div>
      <div class="card" style="flex:1"><h3>Footprint</h3><div class="cb sc">${SRV.offices.map(o=>`<div class="li g">${o.city}${o.hq?' (HQ)':''}<small>${esc(o.addr.split(',').slice(-2).join(',').trim())}</small></div>`).join('')}<div style="font-size:12px;color:var(--text2);margin-top:4px">${SRV.contact.email} · ${SRV.contact.phones[0]}</div></div></div>
    </div>
   </div></div>`);
  bindTabs();
  document.querySelectorAll('[data-hex]').forEach(d=>d.onclick=()=>{if(navigator.clipboard)navigator.clipboard.writeText(d.dataset.hex);toast('Copied '+d.dataset.hex)});
  const dnaDone=()=>{$('#dnaConf').textContent='Confirmed';$('#dnaConf').classList.add('ok');$('#dnaConf').disabled=true;$('#dnaOk').textContent='Confirmed · v1'};
  if(S.dnaOk[S.cur])dnaDone();
  $('#dnaConf').onclick=()=>{S.dnaOk[S.cur]=true;dnaDone();tool('dna.confirm','client=srv','v1 locked as the reference for agents')};
  $('#nvIn').onkeydown=e=>{if(e.key==='Enter'&&e.target.value.trim()){S.never.push(e.target.value.trim());VIEWS.brand()}};
  document.querySelectorAll('[data-nv]').forEach(x=>x.onclick=()=>{S.never=S.never.filter(n=>n!==x.dataset.nv);VIEWS.brand()});
};

/* ================= SITE AUDIT ================= */
S.auditTab='pages';
VIEWS.audit=function(){
  if(partial('Site audit','The site audit'))return;
  const h=healthScore(),iss=auditIssues(),P=CRAWL,pg=SRV.page;
  const tab=S.auditTab;
  const hdr=sh('Site audit','srvmedia.com · '+P.length+' pages sampled from '+SRV.sitemapTotal+' URLs · captured '+CAPTURED,clientTabs()+`<div class="seg" id="atab" style="margin-left:8px;width:320px">${[['pages','Pages'],['tech','Tech and tracking'],['rules','Crawl rules']].map(t=>`<button class="${tab===t[0]?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>`);
  const tiles=`<div class="tiles"><div class="tile" style="display:flex;gap:12px;align-items:center"><div class="ring" style="--p:${h.score}"><span>${h.score}</span></div><div><small>Health score</small><span>${h.pages} pages</span></div></div><div class="tile"><small>Errors</small><b>${h.e}</b><span>pages with 4xx or 5xx</span></div><div class="tile"><small>Warnings</small><b>${h.w}</b><span>pages flagged</span></div><div class="tile"><small>Notices</small><b>${h.n}</b><span>pages flagged</span></div></div>`;
  if(tab==='tech'){
    stage(`<div class="scr">${hdr}${tiles}<div class="grid" style="grid-template-columns:1.2fr 1fr"><div class="card"><h3>Detected <span class="chip g">${SRV.tech.detected.length}</span></h3><div class="cb sc"><table><tr><th>Type</th><th>Technology</th><th>Evidence</th></tr>${SRV.tech.detected.map(d=>`<tr><td>${d[0]}</td><td>${d[1]}</td><td style="color:var(--text2)">${esc(d[2])}</td></tr>`).join('')}</table></div></div>
     <div class="col"><div class="card"><h3>Not in page source <span class="chip a">${SRV.tech.notFound.length}</span></h3><div class="cb">${SRV.tech.notFound.map(n=>`<div class="li a">${n}</div>`).join('')}<div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:6px">${esc(SRV.tech.notFoundNote)}</div></div></div>
     <div class="card" style="flex:1"><h3>Homepage facts</h3><div class="cb"><dl class="kv"><dt>HTML size</dt><dd>${pg.htmlKb} KB</dd><dt>Fetch time</dt><dd>${pg.fetchSec} s</dd><dt>Images</dt><dd>${pg.images} (${pg.imagesNoAlt} without alt text)</dd><dt>Links</dt><dd>${pg.links}</dd><dt>Redirect</dt><dd>${pg.redirect}</dd></dl></div></div></div></div></div>`);
  }else if(tab==='rules'){
    stage(`<div class="scr">${hdr}${tiles}<div class="grid" style="grid-template-columns:1fr 1fr 1fr"><div class="card"><h3>robots.txt <span class="chip">${pg.robots.size}</span></h3><div class="cb"><div class="mono" style="line-height:1.7">User-agent: *<br>${pg.robots.disallow.map(d=>'Disallow: '+d).join('<br>')}<br>Sitemap: ${pg.robots.sitemap}</div></div></div>
     <div class="card"><h3>Sitemaps <span class="chip">${SRV.sitemapTotal} URLs</span></h3><div class="cb"><table><tr><th>File</th><th class="r">URLs</th><th class="r">Last modified</th></tr>${pg.sitemaps.map(s=>`<tr><td>${s[0]}</td><td class="r">${s[1]}</td><td class="r">${s[2]}</td></tr>`).join('')}</table><div style="font-size:12px;color:var(--text2);margin-top:8px">Sitemap index generated by Yoast SEO.</div></div></div>
     <div class="card"><h3>Structured data on the homepage</h3><div class="cb"><div class="pills" style="margin-bottom:10px">${pg.schemaTypes.map(t=>`<span class="pill mono">${t}</span>`).join('')}</div><div style="font-size:12.5px;color:var(--text2);line-height:1.5">${P.filter(p=>p.schema===0).length} of ${P.length} sampled pages have no JSON-LD. The service pages listed on the homepage have no Service or FAQPage markup in the sample.</div></div></div></div></div>`);
  }else{
    const f=S.auditFilter,q=S.auditQ.toLowerCase();
    const fi=iss.find(i=>i.id===f);
    const rows=P.filter(p=>(!fi||fi.pages.includes(p))&&(!q||(p.p+p.title).toLowerCase().includes(q)));
    const sel=P.find(p=>p.p===S.auditSel)||P[0];
    const pIssues=iss.filter(i=>i.pages.includes(sel));
    stage(`<div class="scr">${hdr}${tiles}
     <div class="grid" style="grid-template-columns:270px minmax(0,1fr) 290px">
      <div class="card"><h3>Issues <button class="btn sm ghost" id="clearF" style="margin-left:auto">All pages</button></h3><div class="cb sc">${['error','warn','notice'].map(s=>iss.filter(i=>i.sev===s).map(i=>`<div class="rule" style="cursor:pointer;${f===i.id?'background:var(--soft);border-radius:8px;padding-left:6px':''}" data-f="${i.id}"><span class="chip ${s==='error'?'r':s==='warn'?'a':''}" style="min-width:34px;text-align:center">${i.pages.length}</span><div class="tx">${esc(i.label)}</div></div>`).join('')).join('')}</div></div>
      <div class="card"><h3>Pages <span class="chip">${rows.length} shown</span></h3><input type="text" id="aq" placeholder="Search path or title" value="${esc(S.auditQ)}" style="margin-bottom:8px;flex:none"><div class="cb sc"><table><tr><th>Page</th><th class="r">Status</th><th class="r">KB</th><th class="r">Time</th><th class="r">Title</th><th class="r">H1</th><th class="r">Words</th></tr>${rows.map(p=>`<tr class="row ${p===sel?'sel':''}" data-p="${esc(p.p)}"><td class="ell">${esc(p.p)}</td><td class="r ${p.s>=400?'badc':'okc'}">${p.s}</td><td class="r">${p.kb}</td><td class="r ${p.t>3?'warnc':''}">${p.t}s</td><td class="r ${p.tl>60?'warnc':''}">${p.tl}</td><td class="r ${p.h1n!==1?'warnc':''}">${p.h1n}</td><td class="r">${p.w}</td></tr>`).join('')}</table></div></div>
      <div class="card"><h3>Page detail</h3><div class="cb sc"><div style="font-size:13px;font-weight:500;margin-bottom:2px">${esc(sel.p)}</div><a class="link" href="https://www.srvmedia.com${sel.f}" target="_blank" rel="noopener" style="font-size:12px">Open live page</a><div class="hr"></div><dl class="kv"><dt>Title</dt><dd>${esc(sel.title)}</dd><dt>H1</dt><dd>${esc(sel.h1.join(' / ')||'none')}</dd><dt>Meta</dt><dd>${sel.dl} characters</dd><dt>Images</dt><dd>${sel.img}, ${sel.noalt} without alt</dd><dt>Schema</dt><dd>${sel.schema} block${sel.schema===1?'':'s'}</dd><dt>Canonical</dt><dd>${sel.canon?'set':'missing'}</dd></dl><div class="hr"></div>${pIssues.length?pIssues.map(i=>`<div class="li ${i.sev==='warn'?'a':i.sev==='error'?'r':''}">${esc(i.label)}</div>`).join(''):'<div class="li g">No issues on this page</div>'}</div></div>
     </div></div>`);
    document.querySelectorAll('[data-f]').forEach(r=>r.onclick=()=>{S.auditFilter=r.dataset.f;VIEWS.audit()});
    $('#clearF').onclick=()=>{S.auditFilter='all';VIEWS.audit()};
    $('#aq').oninput=e=>{S.auditQ=e.target.value;const pos=e.target.selectionStart;VIEWS.audit();const n=$('#aq');n.focus();n.setSelectionRange(pos,pos)};
    document.querySelectorAll('tr[data-p]').forEach(r=>r.onclick=()=>{S.auditSel=r.dataset.p;VIEWS.audit()});
  }
  bindTabs();document.querySelectorAll('#atab button').forEach(b=>b.onclick=()=>{S.auditTab=b.dataset.t;VIEWS.audit()});
};

/* ================= SEARCH VISIBILITY ================= */
VIEWS.visibility=function(){
  if(partial('Search visibility','Prompt tracking and share of voice'))return;
  const pr=srvPresence(),sov=sovTable();
  const all=SERP.concat(S.prompts.map((q,i)=>({id:'u'+i,q,intent:'Added by you',queued:true,results:[],named:[],note:''})));
  const sel=all.find(s=>s.id===S.visSel)||all[0];
  const srvN=(sov.find(x=>x[0]==='SRV Media')||['',0])[1];
  const top=sov.slice(0,7);if(!top.find(x=>x[0]==='SRV Media'))top.push(['SRV Media',srvN]);
  const engines=[['openai','ChatGPT'],['perplexity','Perplexity'],['gemini','Gemini and AI Overviews']];
  const nEng=engines.filter(e=>S.conn[e[0]]).length;
  stage(`<div class="scr">${sh('Search visibility','Does srvmedia.com appear when buyers search? Captured '+CAPTURED+' from web search results',clientTabs())}
   <div class="tiles"><div class="tile"><small>Listed in category results</small><b>${pr.listed} of ${pr.total}</b><span>srvmedia.com as a result</span></div><div class="tile"><small>Named inside a third-party list</small><b>${pr.named} of ${pr.total}</b><span>upGrowth Pune list, entry 2</span></div><div class="tile"><small>Most visible competitor</small><b style="font-size:19px;margin:5px 0">${esc(sov[0][0])}</b><span>in ${sov[0][1]} of ${pr.total} searches</span></div><div class="tile"><small>AI engines sampled</small><b>${nEng} of 3</b><span>${nEng?'First scan scheduled':'Add API keys to sample ChatGPT, Perplexity, Gemini'}</span></div></div>
   <div class="grid" style="grid-template-columns:330px minmax(0,1fr) 300px">
    <div class="card"><h3>Tracked prompts <span class="chip">${all.length}</span></h3><div class="cb sc">${all.map(s=>{const hit=s.results.some(r=>/srvmedia\.com/.test(r[1]));return `<div class="rule" style="cursor:pointer;${s.id===sel.id?'background:var(--soft);border-radius:8px;padding-left:6px':''}" data-q="${s.id}"><div class="tx"><b style="font-weight:500">${esc(s.q)}</b><small>${esc(s.intent)}</small></div>${s.queued?'<span class="chip">Queued</span>':s.brand?'<span class="chip">Brand</span>':hit?'<span class="chip g">Listed</span>':'<span class="chip r">Absent</span>'}</div>`}).join('')}</div>
     <div style="display:flex;gap:6px;margin-top:8px;flex:none"><input type="text" id="pIn" placeholder="Add a prompt" style="flex:1"><button class="btn sm" id="pAdd">Add</button></div></div>
    <div class="card"><h3>Results for the selected prompt <span class="chip">Web search</span></h3><div class="cb sc">
      <div style="font-size:13.5px;font-weight:500;margin-bottom:6px">${esc(sel.q)}</div>
      ${sel.queued?'<div class="empty" style="line-height:1.5">Queued. Lumen runs new prompts on the next scheduled scan and keeps the history, so share of voice can be compared week to week.</div>':`<table><tr><th>#</th><th>Result</th><th>Domain</th></tr>${sel.results.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r[0])}</td><td class="mono" style="color:${/srvmedia\.com/.test(r[1])?'var(--green)':'var(--text2)'}">${r[1]}</td></tr>`).join('')}</table><div class="hr"></div><div class="li ${sel.results.some(r=>/srvmedia\.com/.test(r[1]))?'g':'a'}">${esc(sel.note)}</div>`}
    </div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.45;flex:none">Results are as returned by a web search API on ${CAPTURED}, not Google's live ranking. ${esc(METHOD.visibility)}</div></div>
    <div class="col">
     <div class="card" style="flex:1"><h3>Share of voice <span class="chip">${pr.total} searches</span></h3><div class="cb sc">${bars(top.map(x=>[x[0],x[1],x[0]==='SRV Media'?'var(--red)':'var(--ink)']),pr.total,'var(--ink)',b=>b[1]+' of '+pr.total)}<div style="font-size:11.5px;color:var(--muted);margin-top:6px">Searches in which the name appears in results or summaries.</div></div></div>
     <div class="card"><h3>Answer engines</h3><div class="cb">${engines.map(e=>`<div class="rule"><div class="tx">${e[1]}</div>${S.conn[e[0]]?'<span class="chip g">Key added</span>':`<button class="btn sm ghost" data-ek="${e[0]}">Add key</button>`}</div>`).join('')}</div></div>
    </div>
   </div></div>`);
  bindTabs();growBars();
  document.querySelectorAll('[data-q]').forEach(r=>r.onclick=()=>{S.visSel=r.dataset.q;VIEWS.visibility()});
  const add=()=>{const v=$('#pIn').value.trim();if(!v)return;S.prompts.push(v);S.visSel='u'+(S.prompts.length-1);tool('prompts.add','q="'+v+'"','queued for next scan');VIEWS.visibility()};
  $('#pAdd').onclick=add;$('#pIn').onkeydown=e=>{if(e.key==='Enter')add()};
  document.querySelectorAll('[data-ek]').forEach(b=>b.onclick=()=>connectFlow(b.dataset.ek,'key',VIEWS.visibility));
};

/* ================= COMPETITORS ================= */
VIEWS.competitors=function(){
  if(partial('Competitors','Competitor profiling'))return;
  const groups=['All','Local','Education','National'];
  const extra=S.comps.filter(n=>!COMPETITORS.some(c=>c.name.toLowerCase().includes(n.toLowerCase().split(' ')[0]))).map((n,i)=>({id:'u'+i,name:n,city:'n/a',group:'Added',pos:'Pending first crawl',services:[],claims:[],clients:[],overlap:[],note:'Added by you. Lumen profiles it on the next scan.',pending:true,url:'',founded:'n/a',size:'n/a',education:'n/a'}));
  const all=COMPETITORS.concat(extra);
  const list=all.filter(c=>S.compGroup==='All'||c.group===S.compGroup||c.group==='Added');
  const sel=all.find(c=>c.id===S.compSel)||all[0];
  const mentions=n=>SERP.filter(s=>!s.brand&&s.named.some(x=>x.toLowerCase().includes(n.split(' ')[0].toLowerCase()))).length;
  const adLib=n=>'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=IN&q='+encodeURIComponent(n)+'&search_type=keyword_unordered';
  const shared=sel.services.filter(s=>sel.overlap.includes(s));
  stage(`<div class="scr">${sh('Competitors','Profiled from their own pages and directory listings. Sources linked.',clientTabs()+`<select id="cg" style="width:150px;margin-left:8px">${groups.map(g=>`<option ${S.compGroup===g?'selected':''}>${g}</option>`).join('')}</select>`)}
   <div class="grid" style="grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)">
    <div class="card"><h3>${list.length} competitors <span class="chip">${esc(S.compGroup)}</span></h3><div class="cb sc"><table><tr><th>Name</th><th>City</th><th>Since</th><th class="r">In searches</th></tr>${list.map(c=>`<tr class="row ${c.id===sel.id?'sel':''}" data-c="${c.id}"><td>${esc(c.name)}<small>${esc(c.pos)}</small></td><td>${esc(c.city)}</td><td>${esc(c.founded)}</td><td class="r">${c.pending||c.id==='wc'?'-':mentions(c.name)+' of 6'}</td></tr>`).join('')}</table></div></div>
    <div class="card"><h3>${esc(sel.name)} <span class="chip">${esc(sel.group)}</span></h3><div class="cb sc">
      <dl class="kv"><dt>Position</dt><dd>${esc(sel.pos)}</dd><dt>City</dt><dd>${esc(sel.city)}</dd><dt>Size</dt><dd>${esc(sel.size)}</dd><dt>Education</dt><dd>${esc(sel.education)}</dd></dl>
      ${sel.services.length?`<div class="hr"></div><span class="lbl">Services (shared with SRV highlighted)</span><div class="pills">${sel.services.map(s=>`<span class="pill ${shared.includes(s)?'on':''}">${esc(s)}</span>`).join('')}</div>`:''}
      ${sel.claims.length?`<div class="hr"></div><span class="lbl">Claims on their site (self-reported)</span>${sel.claims.map(x=>`<div class="li a">${esc(x)}</div>`).join('')}`:''}
      ${sel.clients.length?`<span class="lbl" style="margin-top:6px">Named clients</span><div class="pills">${sel.clients.map(x=>`<span class="pill">${esc(x)}</span>`).join('')}</div>`:''}
      <div class="hr"></div><div style="font-size:12.5px;line-height:1.5">${esc(sel.note)}</div>
      <div style="display:flex;gap:12px;margin-top:10px;font-size:12px">${sel.url?`<a class="link" href="${sel.url}" target="_blank" rel="noopener">Source ${I('ext')}</a>`:''}<a class="link" href="${adLib(sel.name.split(',')[0])}" target="_blank" rel="noopener">Meta Ad Library ${I('ext')}</a></div>
      <div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.45">${esc(METHOD.adlib)}</div>
    </div></div>
   </div>
   <div style="display:flex;gap:8px;flex:none"><input type="text" id="cIn" placeholder="Add a competitor to track and press Enter" style="max-width:340px"></div></div>`);
  bindTabs();
  $('#cg').onchange=e=>{S.compGroup=e.target.value;VIEWS.competitors()};
  document.querySelectorAll('tr[data-c]').forEach(r=>r.onclick=()=>{S.compSel=r.dataset.c;VIEWS.competitors()});
  $('#cIn').onkeydown=e=>{if(e.key==='Enter'&&e.target.value.trim()){S.comps.push(e.target.value.trim());S.compSel='u'+(extra.length);tool('competitors.add','name='+e.target.value.trim(),'queued for first crawl');VIEWS.competitors()}};
};

/* ================= SOCIAL ================= */
VIEWS.social=function(){
  if(partial('Social','Social profile reading'))return;
  const s=SRV.social;
  const card=(ic,name,body,rows,link,note)=>`<div class="card"><h3>${I(ic)} ${name} ${note||''}</h3><div class="cb sc">${body}${rows?`<dl class="kv" style="margin-top:10px">${rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl>`:''}${link?`<div style="margin-top:12px;font-size:12px"><a class="link" href="${link}" target="_blank" rel="noopener">Open profile ${I('ext')}</a></div>`:''}</div></div>`;
  const bio=t=>`<div style="font-size:12.5px;line-height:1.5;color:var(--text2)">${t?'"'+esc(t)+'"':'No public bio returned (login wall).'}</div>`;
  const total=s.instagram.followers+s.facebook.followers;
  stage(`<div class="scr">${sh('Social','Public profile data captured '+CAPTURED+'. Engagement needs the connected accounts.',clientTabs()+'<button class="btn sm" id="cn">Connect Instagram and Facebook</button>')}
   <div class="tiles"><div class="tile"><small>Instagram followers</small><b>${fmtNum(s.instagram.followers)}</b><span>${fmtNum(s.instagram.posts)} posts, following ${s.instagram.following}</span></div><div class="tile"><small>Facebook followers</small><b>${fmtNum(s.facebook.followers)}</b><span>${fmtNum(s.facebook.talking)} talking about this</span></div><div class="tile"><small>Combined audience</small><b>${fmtNum(total)}</b><span>Facebook is ${Math.round(s.facebook.followers/total*100)}% of it</span></div><div class="tile"><small>Followers per Instagram post</small><b>${Math.round(s.instagram.followers/s.instagram.posts*10)/10}</b><span>${fmtNum(s.instagram.posts)} posts for ${fmtNum(s.instagram.followers)} followers</span></div></div>
   <div class="grid" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,minmax(0,1fr))">
    ${card('insta','Instagram '+s.instagram.handle,bio(s.instagram.bio),[['Followers',fmtNum(s.instagram.followers)],['Posts',fmtNum(s.instagram.posts)],['Following',s.instagram.following]],s.instagram.url)}
    ${card('fb','Facebook '+s.facebook.handle,bio(s.facebook.bio),[['Followers',fmtNum(s.facebook.followers)],['Talking about',fmtNum(s.facebook.talking)],['Location','Pune, Maharashtra']],s.facebook.url)}
    ${card('globe','X '+s.x.handle,bio(s.x.bio),[['Data','Bio only']],s.x.url)}
    ${card('play','YouTube',bio(s.youtube.bio),[['Data','Description only']],s.youtube.url)}
    ${card('users','LinkedIn',bio(s.linkedin.bio),[['Status','Login wall']],s.linkedin.url,'<span class="chip a">Needs authorisation</span>')}
    <div class="card"><h3>What this tells Lumen</h3><div class="cb"><div class="li a">Instagram and Facebook bios use the same sentence, so channel voice is not differentiated</div><div class="li a">The YouTube description says "over 12 years", the site says "15+ years"</div><div class="li">Engagement rate, reach and best formats need Instagram and Facebook connected</div></div></div>
   </div></div>`);
  bindTabs();$('#cn').onclick=()=>gotoView('connections');
};

/* ================= PLAN ================= */
VIEWS.plan=function(){
  const camps=propsOf(S.cur).filter(p=>p.type==='campaign');
  if(!camps.length){stage(`<div class="scr">${sh('Plan','',clientTabs())}<div class="card" style="flex:1"><h3>No campaign plans yet</h3><div class="cb"><p style="font-size:13px;color:var(--text2);line-height:1.5;max-width:520px">Lumen plans campaigns after tracking is verified and the full audit has run. Open Autopilot for the setup tasks.</p></div></div></div>`);bindTabs();return}
  const p=camps.find(x=>x.id===S.sel)||camps[0];S.sel=p.id;
  const rows=adsetsOf(p),tot=bud(p),pol=policyFor(p),blocked=isBlocked(p);
  const sov=sovTable();
  let ev='';
  if(p.ev==='sov'){const top=sov.slice(0,7);if(!top.find(x=>x[0]==='SRV Media'))top.push(['SRV Media',(sov.find(x=>x[0]==='SRV Media')||['',0])[1]]);ev='<span class="lbl">Searches naming each agency (of 6)</span>'+bars(top.map(x=>[x[0],x[1],x[0]==='SRV Media'?'var(--red)':'var(--ink)']),6,'var(--ink)',b=>b[1]+' of 6')}
  else if(p.ev==='edu'){const q=SERP.filter(s=>s.id==='q3'||s.id==='q5');const m={};q.forEach(s=>s.named.forEach(a=>{m[a]=(m[a]||0)+1}));m['SRV Media']=0;ev='<span class="lbl">Named in the 2 education searches</span>'+bars(Object.entries(m).map(x=>[x[0],x[1],x[0]==='SRV Media'?'var(--red)':'var(--ink)']),2,'var(--ink)',b=>b[1]+' of 2')+'<div class="hr"></div><span class="lbl">SRV education proof on the site</span>'+SRV.caseStudies.filter(x=>x.vertical==='Education').map(x=>`<div class="li g">${x.name}: ${x.result}</div>`).join('')}
  else if(p.ev==='none'){ev='<span class="lbl">Evidence</span><div class="li a">Added manually. No evidence is attached. Agents review audience and claims before launch.</div>'}
  else{ev='<span class="lbl">Tracking on srvmedia.com</span>'+SRV.tech.detected.filter(d=>d[0]==='Tag manager'||d[0]==='Analytics').map(d=>`<div class="li g">${d[1]} ${d[2]}</div>`).join('')+SRV.tech.notFound.slice(0,2).map(n=>`<div class="li a">${n}: not in page source</div>`).join('')}
  const camp='SRV_'+(p.obj==='Leads'?'LEAD':'SALE')+'_'+p.short;
  stage(`<div class="scr">${sh('Plan: '+esc(p.t),'<span class="mono">'+p.cn+'</span>',clientTabs()+`<div style="display:flex;align-items:center;gap:6px;margin-left:8px"><span style="font-size:12px;color:var(--muted)">Budget</span><button class="btn sm ghost" id="bm">-</button><input type="text" class="amt" id="pbud" value="${rupee(tot)}"><button class="btn sm ghost" id="bp">+</button></div><button class="btn sm ${S.approved.has(p.id)?'ok':''}" id="apB" ${blocked||(!S.approved.has(p.id)&&!canApprove(p))?'disabled':''}>${S.approved.has(p.id)?'Approved':blocked?'Blocked by tracking':'Approve plan'}</button>`)}
   <div style="display:flex;gap:6px;flex:none">${camps.map(x=>`<button class="pill ${x.id===p.id?'on':''}" data-pp="${x.id}">${esc(x.short)}</button>`).join('')}</div>
   <div class="grid" style="grid-template-columns:1fr 1.7fr 1fr">
    <div class="card"><h3>Evidence <span class="chip">${CAPTURED}</span></h3><div class="cb sc">${ev}<div class="hr"></div>${p.why.map(x=>`<div class="li g">${esc(x)}</div>`).join('')}</div></div>
    <div class="card"><h3>Campaign structure <span class="chip k">${rupee(tot)}</span></h3><div class="cb sc">
      <dl class="kv" style="grid-template-columns:auto 1fr auto 1fr;margin-bottom:10px"><dt>Objective</dt><dd>${objOf()[0]} (${objOf()[1]})</dd><dt>Schedule</dt><dd>${p.win}</dd><dt>Optimization</dt><dd>${objOf()[2]}</dd><dt>Bid</dt><dd>Lowest cost</dd><dt>Attribution</dt><dd>7d click, 1d view</dd><dt>Placements</dt><dd>Feed, Reels, Stories</dd></dl>
      <span class="lbl">Audience</span><div style="font-size:12.5px;margin-bottom:10px;line-height:1.45">${esc(p.aud)}</div>
      <table><tr><th>Ad set</th><th class="r">Daily</th><th class="r">Total</th><th class="r">Share</th></tr>${rows.map(r=>`<tr><td>${camp}_${r.city.toUpperCase().replace(/\s/g,'')}<small>${r.city}, 25 km radius · 3 ads</small></td><td class="r">${rupee(r.daily)}</td><td class="r">${rupee(r.amt)}</td><td class="r">${Math.round(r.amt/tot*100)}%</td></tr>`).join('')}</table>
      <div style="font-size:11.5px;color:var(--muted);margin-top:8px;line-height:1.45">No ad history is connected, so the city split follows the order of your target locations and is re-weighted after the day-7 read. The remaining 10% of the monthly budget stays in reserve.</div>
    </div></div>
    <div class="col"><div class="card" style="flex:1"><h3>Reviewer</h3><div class="cb sc">${p.rev.map(r=>`<div style="display:flex;gap:8px;padding:6px 0;border-top:1px solid var(--line);font-size:12px"><div style="flex:1">${esc(r[0])}</div><span class="chip g" style="align-self:flex-start;max-width:150px;white-space:normal">${esc(r[1])}</span></div>`).join('')}</div></div>
     <div class="card" style="flex:1"><h3>Policy checks</h3><div class="cb sc">${pol.map(polLi).join('')}</div></div></div>
   </div></div>`);
  bindTabs();
  document.querySelectorAll('[data-pp]').forEach(b=>b.onclick=()=>{S.sel=b.dataset.pp;VIEWS.plan()});
  const setB=v=>{v=Math.max(5000,Math.min(1000000,r100(v)));S.over[p.id]=v;if(S.approved.has(p.id)&&!canApprove(p))S.approved.delete(p.id);VIEWS.plan();renderSide()};
  $('#pbud').onchange=e=>setB(parseAmt(e.target.value));
  const step=tot>=100000?10000:5000;$('#bm').onclick=()=>setB(tot-step);$('#bp').onclick=()=>setB(tot+step);
  $('#apB').onclick=()=>{if(S.approved.has(p.id))S.approved.delete(p.id);else if(canApprove(p))S.approved.add(p.id);tool('approval.'+(S.approved.has(p.id)?'approve':'revoke'),'proposal='+p.id,rupee(tot));VIEWS.plan();renderSide()};
};

/* ================= CREATIVE ================= */
function artSvg(t){
  t=t||{id:'x',bg:['#DA1F26','#7a0f14'],accent:'#1863DC',dark:false};
  const f=t.dark?'#000':'#fff';
  return `<svg class="bgart" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gg${t.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient></defs><rect width="100" height="100" fill="url(#gg${t.id})"/><circle cx="82" cy="20" r="26" fill="${t.accent}" opacity=".85"/><circle cx="14" cy="70" r="30" fill="${f}" opacity=".07"/><rect x="18" y="36" width="64" height="30" rx="4" fill="${f}" opacity=".12"/><rect x="24" y="43" width="30" height="3" rx="1.5" fill="${f}" opacity=".7"/><rect x="24" y="50" width="42" height="3" rx="1.5" fill="${f}" opacity=".45"/><rect x="24" y="57" width="22" height="3" rx="1.5" fill="${f}" opacity=".45"/></svg>`;
}
const LOGO_POS={tl:'left:9px;top:9px',tr:'right:9px;top:9px',bl:'left:9px;bottom:9px'};
const TEXT_POS={bottom:'bottom:9px',center:'top:50%;transform:translateY(-50%)',top:'top:36px'};
function phones(cp,t){
  t=t||{id:'x',bg:['#DA1F26','#7a0f14'],accent:'#1863DC',textPos:'bottom',logo:'tl',dark:false,big:false};
  const tc=t.dark?'#111':'#fff';
  const logo=`<div class="lg2" style="${LOGO_POS[t.logo]||LOGO_POS.tl}"><img src="${SRV.visual.logo}" alt=""></div>`;
  const art=(h,extra)=>`<div class="art">${artSvg(t)}${logo}<div class="ov" style="${TEXT_POS[t.textPos]||TEXT_POS.bottom};color:${tc}"><div class="hd" data-h="${h}" style="${t.big?'font-size:20px':''};${t.dark?'text-shadow:none':''}">${esc(cp.heads[h])}</div><div class="sb" data-h="2">${esc(cp.heads[2])}</div></div><div class="shim"></div>${extra||''}</div>`;
  const top='<div class="igtop"><span class="av2" style="background:#DA1F26">SR</span><b>srvmedia</b><small>Sponsored</small></div>';
  return `
  <div class="dwrap"><div class="dev" data-s="0" id="dFeed"><div class="scrn">${top}${art(0)}<div class="igcta"><span class="ctat">${esc(cp.cta)}</span><span>&rsaquo;</span></div><div class="igact">${I('heart')}${I('comment')}${I('send')}</div></div></div><div class="dlab">Instagram Feed · 4:5</div></div>
  <div class="dwrap"><div class="dev" data-s="0" id="dVid"><div class="scrn">${top}${art(1,`<div class="play">${I('play')}</div>`)}<div class="vbar"><i id="vbar"></i></div><div class="igcta"><span class="ctat">${esc(cp.cta)}</span><span>&rsaquo;</span></div></div></div><div class="dlab">Instagram Video · 1:1 · 15s</div></div>
  <div class="dwrap"><div class="dev" data-s="0" id="dReel"><div class="scrn"><div class="segs">${[0,1,2,3].map(()=>'<i><b></b></i>').join('')}</div><div class="art" style="flex:1">${artSvg(t)}${logo}<div class="cap" id="cap" style="color:${tc}"></div><div class="rside">${I('heart')}${I('comment')}${I('send')}</div><div class="rbot"><b>srvmedia</b> · Sponsored<div class="rcta ctat">${esc(cp.cta)}</div></div><div class="shim"></div></div><div class="safe"><i>Top 14%: app UI</i><i>Bottom 35%: caption and buttons</i></div></div></div><div class="dlab">Instagram Reel · 9:16 · 15s</div></div>`;
}
S.creativeSeen={};
VIEWS.creative=function(){
  const camps=propsOf(S.cur).filter(p=>p.type==='campaign'&&CREATIVE[p.id]);
  if(!camps.length){stage(`<div class="scr">${sh('Creative','',clientTabs())}<div class="card" style="flex:1"><h3>No creative yet</h3><div class="cb"><p style="font-size:13px;color:var(--text2);line-height:1.5;max-width:520px">Creative is built from an approved plan and the Brand DNA. Open Autopilot first.</p></div></div></div>`);bindTabs();return}
  const p=camps.find(x=>x.id===S.sel)||camps[0];S.sel=p.id;
  const cp=copyOf(p.id),base=CREATIVE[p.id];
  const steps=['Brand kit read: logo SVG, #DA1F26 and #1863DC, Raleway','No footage in the library: kinetic text layouts on brand colours','3 headlines (max 40 characters) and primary text (max 125) written','Layouts built for 4:5, 1:1 and 9:16 with Meta safe zones','Rendered 3 placements','Checks: claims against the site, logo clearance, text coverage'];
  stage(`<div class="scr">${sh('Creative: '+esc(base.concept),'Built from claims srvmedia.com makes. Edit any text and the previews update.',clientTabs())}
   <div style="display:flex;gap:6px;flex:none;flex-wrap:wrap;align-items:center">${camps.map(x=>`<button class="pill ${x.id===p.id?'on':''}" data-pp="${x.id}">${esc(x.short)}</button>`).join('')}<span style="margin-left:10px;font-size:12px;color:var(--muted)">Ask Lumen:</span>${['Shorten the headlines','Use the proof stat template','Change CTA to Get quote','Move logo to top right'].map(c=>`<button class="pill" data-cmd="${c}">${c}</button>`).join('')}</div>
   <div class="grid" style="grid-template-columns:230px minmax(0,1fr) 300px">
    <div class="col"><div class="card" style="flex:none"><h3>Creative agent</h3><div class="cb">${steps.map(s=>`<div class="stp2"><span class="ck">${I('check')}</span><span>${esc(s)}</span></div>`).join('')}</div></div>
     <div class="card" style="flex:1"><h3>Changes <span class="chip" id="chN">0</span></h3><div class="cb sc" id="chg"></div></div></div>
    <div class="col" style="gap:10px"><div style="display:flex;gap:10px;justify-content:space-around;flex:1;min-height:0;align-items:flex-start">${phones(cp,tplOf(p.id))}</div>
     <div class="sb2" id="sbd">${base.scenes.map((s,i)=>`<div class="scene" data-k="${i}"><div class="th" style="background:linear-gradient(90deg,#DA1F26,#1863DC);opacity:${1-i*.15}"></div><b>Reel scene ${i+1} · ${s[0]}</b><div class="os">${esc(s[1])}</div><div class="vo">${esc(s[2])}</div></div>`).join('')}</div></div>
    <div class="card"><h3>Copy and claims</h3><div class="cb sc" id="copy"></div>
     <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;flex:none"><button class="btn sm ghost" id="szb">Show Reel safe zones</button><button class="btn sm ${S.creativeOk[p.id]?'ok':''}" id="apc">${S.creativeOk[p.id]?'Creatives approved':'Approve creatives'}</button></div></div>
   </div></div>`);
  bindTabs();
  document.querySelectorAll('[data-pp]').forEach(b=>b.onclick=()=>{S.sel=b.dataset.pp;VIEWS.creative()});
  const claimsHtml=()=>{const a=[...cp.heads,cp.primary].flatMap(t=>claimsAll(t));return a.length?a.map(polLi).join(''):'<div class="li g">No claims flagged</div>'};
  const refreshClaims=()=>{$('#clm').innerHTML=claimsHtml();S.creativeOk[p.id]=false;const b=$('#apc');b.textContent='Approve creatives';b.classList.remove('ok')};
  const drawCopy=()=>{
    $('#copy').innerHTML=cp.heads.map((h,i)=>`<div class="copyv"><div class="t"><span>Headline ${'ABC'[i]}</span><span id="hc${i}">${h.length} / ${tplOf(p.id).hlMax}</span></div><input type="text" maxlength="${tplOf(p.id).hlMax}" data-hi="${i}" value="${esc(h)}"></div>`).join('')
     +`<div class="copyv"><div class="t"><span>Primary text</span><span id="pc">${cp.primary.length} / 125</span></div><textarea maxlength="125" id="prim" style="height:62px">${esc(cp.primary)}</textarea></div>`
     +`<div class="copyv"><div class="t"><span>Template</span></div><select id="tplS">${TEMPLATES.map(t=>`<option value="${t.id}" ${t.id===tplOf(p.id).id?'selected':''}>${t.name}</option>`).join('')}</select></div>`
     +`<div class="copyv"><div class="t"><span>Call to action</span></div><select id="ctaS">${CTA_OPTIONS.map(o=>`<option ${o===cp.cta?'selected':''}>${o}</option>`).join('')}</select></div><div id="clm" style="margin-top:4px">${claimsHtml()}</div>`;
    document.querySelectorAll('[data-hi]').forEach(inp=>{inp.onchange=()=>{logChange('You','Creative · '+p.short,'Edited headline '+'ABC'[+inp.dataset.hi]);drawChanges()}});
    document.querySelectorAll('[data-hi]').forEach(inp=>inp.oninput=()=>{const i=+inp.dataset.hi;cp.heads[i]=inp.value;$('#hc'+i).textContent=inp.value.length+' / '+tplOf(p.id).hlMax;document.querySelectorAll('[data-h="'+i+'"]').forEach(n=>{n.textContent=inp.value});refreshClaims()});
    $('#prim').onchange=()=>{logChange('You','Creative · '+p.short,'Edited primary text');drawChanges()};
    $('#prim').oninput=e=>{cp.primary=e.target.value;$('#pc').textContent=e.target.value.length+' / 125';refreshClaims()};
    $('#tplS').onchange=e=>{logChange('You','Creative · '+p.short,'Switched template to '+e.target.selectedOptions[0].text);S.tplSel[p.id]=e.target.value;tool('template.apply','proposal='+p.id+' template='+e.target.value,'re-rendered 3 placements');VIEWS.creative()};
    $('#ctaS').onchange=e=>{logChange('You','Creative · '+p.short,'Changed call to action to '+e.target.value);drawChanges();cp.cta=e.target.value;document.querySelectorAll('.ctat').forEach(n=>{n.textContent=cp.cta})};
  };
  const drawChanges=()=>{const ch=S.changes.filter(c=>c.scope.includes(p.short)||c.scope==='Workspace').slice().reverse();$('#chN').textContent=ch.length;$('#chg').innerHTML=ch.length?ch.map(c=>`<div class="chg"><span class="who ${c.actor==='Lumen'?'l':''}">${c.actor==='Lumen'?'Lumen':'You'}</span><span>${esc(c.desc)}</span><small>${c.by?esc(c.by)+' · ':''}${new Date(c.t).toTimeString().slice(0,8)}</small></div>`).join(''):'<div class="empty">No changes yet. Edit anything, or ask Lumen.</div>'};
  drawCopy();drawChanges();
  document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{$('#cpIn').value=b.dataset.cmd;runCmd(b.dataset.cmd)});
  const setStage=n=>['#dFeed','#dVid','#dReel'].forEach(s=>{$(s).dataset.s=n});
  const loop=()=>{let k=0;const sc=base.scenes;const tick=()=>{document.querySelectorAll('.segs i b').forEach((b,i)=>{b.style.width=i<k?'100%':i===k?'60%':'0'});const c2=$('#cap');if(c2)c2.textContent=sc[k][1];document.querySelectorAll('.scene').forEach((s,i)=>s.classList.toggle('on',i===k));const vb=$('#vbar');if(vb)vb.style.width=((k+1)/sc.length*100)+'%';k=(k+1)%sc.length};tick();S.intervals.push(setInterval(tick,1700))};
  $('#szb').onclick=e=>{const d=$('#dReel');d.classList.toggle('sz');e.target.textContent=d.classList.contains('sz')?'Hide Reel safe zones':'Show Reel safe zones'};
  $('#apc').onclick=e=>{S.creativeOk[p.id]=true;e.target.textContent='Creatives approved';e.target.classList.add('ok');tool('creative.approve','proposal='+p.id,'3 placements approved')};
  const els=[...document.querySelectorAll('.stp2')];
  if(S.creativeSeen[p.id]){els.forEach(e=>e.classList.add('on'));setStage(3);loop();return}
  const tk=S.token;(async()=>{
    for(let i=0;i<els.length;i++){
      if(tk!==S.token)return;els[i].classList.add('cur');
      if(i===2)tool('creative.copy','variants=3 limits=40/125','written');
      if(i===4)tool('creative.render','placements=feed,video,reel','3 assets');
      if(i===5)tool('policy.creativeQA','claims,logo,text-ratio,captions','checked');
      if(i===1)setStage(0);if(i===3)setStage(1);if(i===4)setStage(2);
      await wait(800);if(tk!==S.token)return;els[i].classList.remove('cur');els[i].classList.add('on');
    }
    setStage(3);loop();S.creativeSeen[p.id]=true;
  })();
};

/* ================= LAUNCH ================= */
S.mode={};
VIEWS.launch=function(){
  const ap=approvedOf(S.cur),STG=['Draft saved','Pre-flight passed','Campaign created','In review'];
  const over=ap.length>0&&usedFor(S.cur)>capOf(S.cur);
  const need=!S.conn.meta;
  stage(`<div class="scr">${sh('Launch','Approved campaigns are created through AdIntel. Limits are checked again at launch.',clientTabs())}
   <div class="grid" style="grid-template-columns:1.6fr 1fr">
    <div class="card"><h3>Approved campaigns <span class="chip">${ap.length}</span></h3><div class="cb sc"><table><tr><th>Campaign</th><th class="r">Budget</th><th class="r">Days</th><th>Status</th></tr><tbody id="lrows">${ap.map(p=>`<tr data-id="${p.id}"><td><span class="mono">${p.cn}</span></td><td class="r">${rupee(bud(p))}</td><td class="r">${p.days}</td><td><span class="stc ${S.launched[p.id]?'done':''}">${S.launched[p.id]?'In review':'Approved'}</span></td></tr>`).join('')}</tbody></table>${ap.length?'':'<div class="empty" style="margin-top:8px">Nothing approved yet. Approve a proposal in Autopilot.</div>'}
     ${need&&ap.length?'<div class="esc" style="margin-top:10px"><b>Meta Ads is not connected</b>Connect it before launching. Lumen cannot create campaigns without an ad account.<div style="margin-top:6px"><button class="btn sm" id="goConn">Open Connections</button></div></div>':''}</div>
     <div style="display:flex;align-items:center;gap:10px;margin-top:8px;flex:none"><span style="font-size:12.5px;color:var(--text2)">Total ${rupee(usedFor(S.cur))}</span><button class="btn" id="lbtn" style="margin-left:auto" ${ap.length&&!need&&!over?'':'disabled'}>${over?'Over spend limit':'Launch via AdIntel'}</button></div></div>
    <div class="col"><div class="card" style="flex:1"><h3>Spend limits</h3><div class="cb sc" id="caps"></div></div>
     <div class="card"><h3>Approval mode</h3><div class="cb" id="modes"></div></div></div>
   </div></div>`);
  bindTabs();
  $('#caps').innerHTML=S.clients.map(id=>{const u=usedFor(id),cap=capOf(id),ov=u>cap;return `<div class="cap2"><div class="t"><span>${esc(CLIENTS[id].short)}</span><span style="display:flex;gap:6px;align-items:center"><span style="color:${ov?'var(--red)':'var(--text2)'}">${rupee(u)} of</span><input type="text" class="amt" data-cap="${id}" value="${rupee(cap)}"></span></div><div class="b"><i style="width:${Math.min(100,u/cap*100)}%;background:${ov?'var(--red)':'var(--ink)'}"></i></div></div>`}).join('')+'<div style="font-size:11.5px;color:var(--muted);line-height:1.5">Daily cap is the monthly cap divided by 20. Spend above 30% of plan pauses the ad set. Meta rejections escalate to you.</div>';
  $('#caps').addEventListener('change',e=>{const id=e.target.dataset.cap;if(!id)return;S.cap[id]=Math.max(5000,parseAmt(e.target.value));VIEWS.launch()});
  const MODES=[['ask','Ask each time'],['limits','Within limits'],['auto','Automatic']];
  $('#modes').innerHTML=S.clients.map(id=>`<div class="modes"><span>${esc(CLIENTS[id].short)}</span><div class="seg" data-c="${id}">${MODES.map(m=>`<button class="${(S.mode[id]||'ask')===m[0]?'on':''}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div></div>`).join('');
  document.querySelectorAll('#modes .seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{S.mode[sg.dataset.c]=b.dataset.m;sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))}));
  if($('#goConn'))$('#goConn').onclick=()=>gotoView('connections');
  const setSt=(tr,k)=>{const s=tr.querySelector('.stc');s.textContent=STG[Math.min(k,3)];s.className='stc '+(k>=3?'done':'run')};
  $('#lbtn').onclick=async()=>{
    const b=$('#lbtn');if(b.disabled)return;b.disabled=true;const tk=S.token;
    try{
      const rows=[...document.querySelectorAll('#lrows tr')];
      await Promise.all(rows.map(async(r,k)=>{
        const p=ap.find(x=>x.id===r.dataset.id);
        const calls=[['adintel.createDraft','project=srv name='+p.cn,'draft saved'],['adintel.preflight','draft='+p.id,'passed'],['meta.createCampaign','objective='+objOf()[3]+' status=PAUSED','campaign created'],['meta.activate','campaign='+p.cn,'status IN_REVIEW']];
        for(let s=0;s<4;s++){setSt(r,s);await wait(700+k*200);if(tk!==S.token)throw new Error('cancel');tool(calls[s][0],calls[s][1],calls[s][2])}
        setSt(r,3);S.launched[p.id]='review';
      }));
      tool('audit.log','actor=lumen','written');b.textContent='Submitted to Meta review';b.classList.add('ok');renderSide();
      if(S.tour)setTimeout(()=>tourNext(),1200*S.speed);
    }catch(e){}
  };
};

/* ================= MONITOR ================= */
VIEWS.monitor=function(){
  const ids=propsOf(S.cur).filter(p=>S.launched[p.id]);
  const RULES=[['cpl','Pause an ad set if cost per lead exceeds 1.5x target after 3,000 impressions'],['daily','Never spend above the approved daily budget'],['reject','Escalate to me when Meta rejects or limits an ad'],['fatigue','Rotate the creative when frequency passes 3.0'],['shift','After 72 hours, move up to 20% of budget to the best ad set']];
  const tasks=propsOf(S.cur).filter(p=>p.type==='task');
  stage(`<div class="scr">${sh('Monitor','Delivery, rules and open tasks. Results appear here once Meta approves the ads.',clientTabs())}
   <div class="grid" style="grid-template-columns:1.4fr 1fr 1fr">
    <div class="card"><h3>Launched campaigns <span class="chip">${ids.length}</span></h3><div class="cb sc">${ids.length?`<table><tr><th>Campaign</th><th>Status</th><th>Delivery</th></tr>${ids.map(p=>`<tr><td><span class="mono">${p.cn}</span><small>${rupee(bud(p))} over ${p.days} days</small></td><td><span class="stc run">In review</span></td><td style="color:var(--muted)">Not started</td></tr>`).join('')}</table><div class="hr"></div>
      <span class="lbl">What happens next</span><div class="li">Meta reviews the ads, usually within 24 hours</div><div class="li">Learning phase: no changes before enough conversions exist</div><div class="li">First performance read at day 3, decision at day 7</div><div class="li">No result is shown until real delivery data arrives</div>`:'<div class="empty" style="line-height:1.5">No campaign has been launched yet. Approve a plan and launch it from the Launch page.</div>'}</div></div>
    <div class="card"><h3>Rules</h3><div class="cb sc">${RULES.map(r=>`<div class="rule"><div class="tx">${r[1]}</div><div class="sw2 ${S.rules[r[0]]?'on':''}" data-r="${r[0]}"></div></div>`).join('')}</div></div>
    <div class="card"><h3>Open tasks <span class="chip a">${tasks.filter(t=>!S.tasks[t.task]).length}</span></h3><div class="cb sc">${tasks.map(t=>`<div class="rule"><div class="tx"><b style="font-weight:500">${esc(t.t)}</b><small>${esc(t.trig)}</small></div>${S.tasks[t.task]?'<span class="chip g">Done</span>':`<button class="btn sm" data-t="${t.task}">Mark done</button>`}</div>`).join('')||'<div class="empty">No tasks.</div>'}</div></div>
   </div></div>`);
  bindTabs();
  document.querySelectorAll('[data-r]').forEach(s=>s.onclick=()=>{S.rules[s.dataset.r]=!S.rules[s.dataset.r];s.classList.toggle('on');tool('rules.'+(S.rules[s.dataset.r]?'enable':'disable'),s.dataset.r,'saved')});
  document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{S.tasks[b.dataset.t]=true;toast('Task marked done');VIEWS.monitor()});
};

/* ================= REPORTS ================= */
VIEWS.reports=function(){
  const ag=S.role==='agency',h=healthScore(),pr=srvPresence(),iss=auditIssues();
  const tag=c=>{if(c.own)return 'GTM, GA4';const t=c.tech;return [...(t.gtm.length?['GTM x'+t.gtm.length]:[]),...(t.ga4.length?['GA4']:[])].join(', ')||'none'};
  const total=S.clients.reduce((a,id)=>a+mbOf(id),0);
  stage(`<div class="scr">${sh(ag?'Reports: all clients':'Report: '+esc(S.f.biz),'Baseline from live data captured '+CAPTURED+'. Performance fills in after launch.',`<button class="btn sm ghost" id="csvA">${I('download')} Audit CSV</button><button class="btn sm ghost" id="csvV">${I('download')} Visibility CSV</button><button class="btn sm" id="prt">Print report</button>`)}
   <div class="tiles"><div class="tile"><small>Site health</small><b>${h.score}</b><span>${iss.filter(i=>i.pages.length).length} issue types on ${h.pages} pages</span></div><div class="tile"><small>Searches listed</small><b>${pr.listed} of ${pr.total}</b><span>Named in ${pr.named} third-party list</span></div><div class="tile"><small>Monthly budget under management</small><b>${rupee(total)}</b><span>${S.clients.length} ${ag?'clients':'brand'}</span></div><div class="tile"><small>Spend so far</small><b>${rupee(0)}</b><span>No campaign is delivering yet</span></div></div>
   <div class="grid" style="grid-template-columns:${ag?'1.5fr 1fr':'1fr 1fr'}">
    <div class="card"><h3>${ag?'Clients: tracking and readiness':'Readiness'}</h3><div class="cb sc"><table><tr><th>${ag?'Client':'Brand'}</th><th>Platform</th><th>Tags in source</th><th class="r">Homepage KB</th><th class="r">Budget</th></tr>${S.clients.map(id=>{const c=CLIENTS[id];return `<tr><td>${esc(c.name)}<small>${esc(c.domain)}</small></td><td>${c.own?'WordPress, Avada':esc(c.tech.cms.split(' (')[0])}</td><td>${tag(c)}<small>Meta Pixel not in source</small></td><td class="r">${c.own?SRV.page.htmlKb:c.htmlKb}</td><td class="r">${rupee(mbOf(id))}</td></tr>`}).join('')}</table></div></div>
    <div class="card"><h3>${ag?'Budget allocation by client':'Budget plan'}</h3><div class="cb">${ag?bars(S.clients.map(id=>[CLIENTS[id].short,mbOf(id),CLIENTS[id].color]),Math.max(...S.clients.map(mbOf)),'var(--ink)',b=>rupee(b[1])):bars(propsOf('srv').filter(p=>p.type==='campaign').map(p=>[p.short,r100(mbOf('srv')*p.share)]),mbOf('srv')*.45,'var(--ink)',b=>rupee(b[1]))}<div class="hr"></div><div style="font-size:12px;color:var(--text2);line-height:1.5">${ag?'Set per client in Clients or Overview.':'Shares of the monthly budget by proposal. 10% stays in reserve.'} Cost per lead, ROAS and AI-vs-human comparisons appear here once campaigns deliver.</div></div></div>
   </div></div>`);
  growBars();
  $('#csvA').onclick=()=>downloadCsv('srvmedia-site-audit.csv',[['path','final_path','status','html_kb','fetch_seconds','title','title_chars','meta_desc_chars','h1_count','words','images','images_missing_alt','schema_blocks']].concat(CRAWL.map(p=>[p.p,p.f,p.s,p.kb,p.t,p.title,p.tl,p.dl,p.h1n,p.w,p.img,p.noalt,p.schema])));
  $('#csvV').onclick=()=>downloadCsv('srvmedia-search-visibility.csv',[['query','intent','results','srvmedia_listed','agencies_named']].concat(SERP.map(s=>[s.q,s.intent,s.results.length,s.results.some(r=>/srvmedia\.com/.test(r[1]))?'yes':'no',s.named.join('; ')])));
  $('#prt').onclick=()=>window.print();
};

/* ================= CLIENTS (agency) ================= */
VIEWS.clients=function(){
  const total=S.clients.reduce((a,id)=>a+mbOf(id),0);
  stage(`<div class="scr">${sh('Clients',esc(S.f.agency)+' · '+S.clients.length+' clients','<button class="btn sm ghost" id="addC">'+I('plus')+' Add client</button>')}
   <div class="grid" style="grid-template-columns:1.6fr 1fr">
    <div class="card"><h3>Roster <span class="chip">${S.clients.length}</span></h3><div class="cb sc"><table><tr><th>Client</th><th>Quick scan</th><th>Tracking</th><th>Monthly budget</th><th></th></tr>${S.clients.map(id=>{const c=CLIENTS[id];const t=c.own?{gtm:['x'],ga4:['x']}:c.tech;return `<tr><td><span class="dotc" style="background:${c.color};margin-right:6px"></span>${esc(c.name)}<small>${esc(c.vertical)}${c.own?' · own brand':''}</small></td><td>${c.own?CRAWL.length+' pages crawled':'Homepage only'}<small>${c.own?SRV.page.htmlKb:c.htmlKb} KB homepage</small></td><td>${t.gtm.length?'GTM ':''}${t.ga4.length?'GA4':''}<small>Meta Pixel not in source</small></td><td style="min-width:230px">${budHtml('mb_'+id,mbOf(id),10000,1000000,5000)}</td><td><button class="btn sm" data-open="${id}">Open</button></td></tr>`}).join('')}</table></div></div>
    <div class="card"><h3>Budget allocation</h3><div class="cb">${bars(S.clients.map(id=>[CLIENTS[id].short,mbOf(id),CLIENTS[id].color]),Math.max(...S.clients.map(mbOf)),'var(--ink)',b=>rupee(b[1]))}<div class="hr"></div><dl class="kv"><dt>Total monthly</dt><dd>${rupee(total)}</dd><dt>Planned (90%)</dt><dd>${rupee(r100(total*.9))}</dd><dt>Reserve (10%)</dt><dd>${rupee(r100(total*.1))}</dd></dl></div></div>
   </div></div>`);
  growBars();
  bindBud(document,(k,v)=>{S.f.mb[k.replace('mb_','')]=v;S.over={};renderSide()});
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{S.cur=b.dataset.open;renderWs();openView('overview')});
  $('#addC').onclick=()=>modal('<h3>Add a client</h3><p>Adding a client starts a live crawl, search research and brand extraction on Lumen\'s servers. This prototype runs without a backend, so only the three clients listed carry captured data.</p><div class="ft"><button class="btn" onclick="closeModal()">Understood</button></div>');
};

/* ================= CONNECTIONS ================= */
VIEWS.connections=function(){
  const k=S.conn;
  const rows=[['meta','Meta Ads','Via AdIntel. Campaigns, ad sets, ads, spend, leads. Required to launch','Connect','ads'],['ga4','Google Analytics 4','Sessions, conversions, landing pages','Connect','ga'],['gsc','Google Search Console','Queries, clicks, indexing','Connect','gsc'],['ig','Instagram','Post and reel performance','Connect','ig'],['fb','Facebook Page','Page insights and lead forms','Connect','fb'],['openai','OpenAI API key','ChatGPT answers for tracked prompts','Add key','key'],['perplexity','Perplexity API key','Answers and citations','Add key','key'],['gemini','Gemini API key','Gemini and AI Overviews answers','Add key','key']];
  stage(`<div class="scr">${sh('Connections','What Lumen can read and do. Nothing publishes outside your approval rules.')}
   <div class="card" style="flex:1"><h3>Connectors <span class="chip">${Object.values(k).filter(Boolean).length} connected</span></h3><div class="cb sc">
    ${rows.map(r=>`<div class="rule"><div class="tx"><b style="font-weight:500">${r[1]}</b><small>${r[2]}</small></div>${k[r[0]]?`<span class="chip g">Connected</span><button class="btn sm ghost" data-off="${r[0]}">Disconnect</button>`:`<button class="btn sm" data-on="${r[0]}" data-kind="${r[4]}">${r[3]}</button>`}</div>`).join('')}
    <div class="rule"><div class="tx"><b style="font-weight:500">Google Ads</b><small>Coming through AdIntel</small></div><span class="chip">Coming soon</span></div>
    <div class="rule"><div class="tx"><b style="font-weight:500">LinkedIn Ads</b><small>Not yet supported</small></div><span class="chip">Coming soon</span></div>
   </div></div></div>`);
  document.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{S.conn[b.dataset.off]=false;VIEWS.connections();renderSide()});
  document.querySelectorAll('[data-on]').forEach(b=>b.onclick=()=>connectFlow(b.dataset.on,b.dataset.kind,()=>{VIEWS.connections();renderSide()}));
};

/* ================= GUIDED TOUR ================= */
const TOUR=[
 ['portfolio','Agency view: every client with its budget, approvals waiting, tracking gaps and the margin Lumen adds, in one table.'],
 ['workplan','Workplan: what the agents do next, on a timeline, and where a person decides. Move the start date and everything recalculates.'],
 ['overview','The client overview opens on real numbers: site health from 36 crawled pages, and srvmedia.com listed in none of six category searches.'],
 ['brand','Brand DNA is extracted from the live site: real logo, colours, fonts, services, offices and a claims conflict (15+ years vs 12 years).'],
 ['geo','GEO audit: a score from six measured dimensions, a radar profile, the citation gap against competitors, and the fixes that move the score most.'],
 ['audit','The site audit lists real issues with real URLs. Click an issue to filter pages.'],
 ['visibility','Six buyer searches were run. SRV Media sells GEO but is absent from every category result.'],
 ['competitors','Competitors are profiled from their own pages, with sources and Meta Ad Library links.'],
 ['autopilot','Proposals come from these gaps. A campaign that needs tracking stays blocked until the setup task is done. Approving checks the spend cap.'],
 ['campaigns','All campaigns in one list with status, owner agent, budget and an audit trail.'],
 ['plan','The plan is built from evidence. Change the budget and every ad set recalculates, with checks against caps, landing page and claims.'],
 ['templates','Templates decide how the Creative agent builds ads. Change a template and the previews change.'],
 ['creative','Creative is built from the brand kit, the chosen template and claims the site supports.'],
 ['library','Every creative in one library, by placement and status.'],
 ['launch','Launch creates campaigns through AdIntel. Meta review follows, so the final status is In review, not live.'],
 ['analytics','Analytics computed from the crawl and search data: response times, page weight, share of voice, who is cited.'],
 ['profit','Profitability: hours freed, margin before and after, and clients one person can run. Every assumption is editable.']
];
function stopTour(){S.tour=null;$('#tour').classList.remove('on')}
function stopTourOnUser(){if(S._tn)return;if(S.tour)stopTour()}
function tourShow(){
  const t=TOUR[S.tour.i];if(!t){stopTour();return}
  $('#tour').innerHTML='<div><b>'+(S.tour.i+1)+' of '+TOUR.length+'.</b> '+esc(t[1])+'</div><button id="tourStop">Stop</button>';
  $('#tour').classList.add('on');$('#tourStop').onclick=stopTour;
}
function tourNext(){
  if(!S.tour)return;const i=++S.tour.i;if(i>=TOUR.length){stopTour();return}
  const t=TOUR[i];S._tn=true;
  if(t[0]==='autopilot'&&!S.approved.size){S.approved.add('p1');S.approved.add('p2')}
  if(t[0]==='launch'&&!S.conn.meta)S.conn.meta=true;
  openView(t[0]);S._tn=false;tourShow();
  const tk=S.tour;
  if(t[0]==='launch'){setTimeout(()=>{if(S.tour===tk&&$('#lbtn')&&!$('#lbtn').disabled)$('#lbtn').click()},1500*S.speed)}
  else setTimeout(()=>{if(S.tour===tk)tourNext()},(t[0]==='creative'?9000:7000)*S.speed);
}
function startTour(){
  $('#demo').classList.remove('open');reset();
  S.tour={i:-1};S.role='agency';S.f.agency='SRV Media';commitWorkspace();S.conn.meta=true;
  S.ob=2;renderWs();renderOnb();
  const tk=S.tour;const iv=setInterval(()=>{if(S.tour!==tk){clearInterval(iv);return}if(S.phase==='app'){clearInterval(iv);setTimeout(()=>{if(S.tour===tk)tourNext()},800)}},400);
}
$('#tourBtn').onclick=startTour;

/* ================= BOOT ================= */
renderWs();renderOnb();
