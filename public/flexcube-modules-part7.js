/* =====================================================================
   FLEXCUBE Modules Part 7 (Workflow, Reports, EOD, New Modules, RTGS, Boot)
   ===================================================================== */
R['m19-work-queue']={render(){
  const custP=state.customers.filter(c=>c.authStatus==='UNAUTHORIZED').length;
  const accP=state.accounts.filter(a=>a.authStatus==='UNAUTHORIZED').length;
  const kycP=state.kycRecords.filter(k=>k.authStatus==='UNAUTHORIZED').length;
  const apvP=state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION').length;
  return `${actionStrip([{label:'Work Queue',active:true,icon:'fas fa-tasks'}])}
  <div class="section-band">My Work Queue <span class="tag">${pendingAuthCount()} items</span></div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi k-amber clickable" onclick="go('m19-approvals')"><div class="kpi-l">Approvals</div><div class="kpi-v">${apvP}</div></div>
      <div class="kpi k-amber clickable" onclick="go('m3-kyc-auth')"><div class="kpi-l">KYC</div><div class="kpi-v">${kycP}</div></div>
      <div class="kpi k-amber clickable" onclick="go('m3-cust-auth')"><div class="kpi-l">Customers</div><div class="kpi-v">${custP}</div></div>
      <div class="kpi k-amber clickable" onclick="go('m4-acc-auth')"><div class="kpi-l">Accounts</div><div class="kpi-v">${accP}</div></div>
    </div>
    <div class="panel"><div class="panel-h">Pending Items</div><div class="panel-b flush">
      <div class="tbl-wrap" style="border:0"><table class="oracle-tbl"><thead><tr>
        <th>Type</th><th>Reference</th><th>Description</th><th>Maker</th><th style="text-align:right">Actions</th>
      </tr></thead><tbody>
        ${state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION').map(p=>`<tr>
          <td><span class="bdg in">${esc(p.kind)}</span></td>
          <td class="mono">${esc(p.ref)}</td><td>${esc(p.label)}</td><td>${esc(p.makerName||p.maker)}</td>
          <td style="text-align:right"><div class="grid-actions">
            <button class="btn sm ok" onclick="approveByApv('${p.id}',true)"><i class="fas fa-check"></i></button>
            <button class="btn sm dgr" onclick="approveByApv('${p.id}',false)"><i class="fas fa-times"></i></button>
          </div></td></tr>`).join('')}
        ${(pendingAuthCount())===0?`<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--tx3)">All caught up ✓</td></tr>`:''}
      </tbody></table></div>
    </div></div>
  </div>`;
},init(){}};

R['m19-approvals']={render(){
  const list=state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION');
  return `${actionStrip([{label:'Approvals',active:true,icon:'fas fa-check-double'}])}
  <div class="section-band">Pending Approvals <span class="tag">${list.length}</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Ref</th><th>Kind</th><th>Label</th><th style="text-align:right">Amount</th><th>Maker</th><th>Submitted</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${list.length?list.map(a=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(a.ref)}</td><td><span class="bdg in">${esc(a.kind)}</span></td><td>${esc(a.label)}</td>
        <td class="mono" style="text-align:right">${a.amount?money(a.amount,a.ccy||'ETB'):'—'}</td>
        <td>${esc(a.makerName||a.maker)}</td><td class="mono" style="font-size:10px">${dtstr(a.submittedAt)}</td>
        <td style="text-align:right"><div class="grid-actions">
          <button class="btn sm ok" onclick="approveByApv('${a.id}',true)"><i class="fas fa-check"></i></button>
          <button class="btn sm dgr" onclick="approveByApv('${a.id}',false)"><i class="fas fa-times"></i></button>
        </div></td></tr>`).join(''):'<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--tx3)">No pending approvals</td></tr>'}
    </tbody></table></div>
    ${formFooter('','','UNAUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function approveByApv(id,ok){
  const a=state.approvals.find(x=>x.id===id);if(!a||a.status!=='PENDING_AUTHORIZATION')return;
  applyAuth(a.kind,a.ref,ok);
}

R['m19-approval-log']={render(){
  const log=state.approvals.filter(a=>a.status!=='PENDING_AUTHORIZATION');
  return `${actionStrip([{label:'Approval Log',active:true,icon:'fas fa-clipboard-list'}])}<div class="section-band">Approval Log <span class="tag">${log.length}</span></div><div class="content-wrap" style="padding-top:0"><div class="tbl-wrap"><table class="oracle-tbl"><thead><tr><th>Ref</th><th>Kind</th><th>Label</th><th>Maker</th><th>Status</th></tr></thead><tbody>${log.map(a=>`<tr><td class="mono">${esc(a.ref)}</td><td><span class="bdg in">${esc(a.kind)}</span></td><td>${esc(a.label)}</td><td>${esc(a.maker)}</td><td>${bdg(a.status)}</td></tr>`).join('')||'<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--tx3)">No logs</td></tr>'}</tbody></table></div></div>`;
},init(){}};
R['m19-reassign']={render(){return `${actionStrip([{label:'Reassign',active:true,icon:'fas fa-sync'}])}<div class="section-band">Reassign Transactions</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Teller ID</label><input class="input" value="TELLER1"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Fetched','i')">Fetch</button></div></div></div></div>`;},init(){}};
R['m20-txn-log']={render(){return `${actionStrip([{label:'Transaction Log',active:true,icon:'fas fa-list'}])}<div class="section-band">Transaction Log <span class="tag">${state.transactions.length} entries</span></div><div class="content-wrap" style="padding-top:0">${txnGrid(state.transactions.slice(0,50))}</div>`;},init(){}};
R['m20-ej']={render(){return `${actionStrip([{label:'Electronic Journal',active:true,icon:'fas fa-newspaper'}])}<div class="section-band">Electronic Journal</div><div class="content-wrap" style="padding-top:0">${txnGrid(state.transactions.filter(t=>['Cash Deposit','Cash Withdrawal'].includes(t.title)))}</div>`;},init(){}};
R['m20-service-journal']={render(){return `${actionStrip([{label:'Servicing Journal',active:true,icon:'fas fa-book'}])}<div class="section-band">Servicing Journal</div><div class="content-wrap" style="padding-top:0">${txnGrid(state.transactions.filter(t=>!['Cash Deposit','Cash Withdrawal'].includes(t.title)))}</div>`;},init(){}};
R['m20-cust-service']={render(){return `${actionStrip([{label:'Customer Service',active:true,icon:'fas fa-user'}])}<div class="section-band">Customer Service (STDINVDT)</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>CIF / Account</label><input class="input mono" id="csQuery"></div><div style="text-align:right"><button class="btn pri" onclick="csQuery()">Search</button></div><div id="csResult" style="margin-top:10px"></div></div></div></div>`;},init(){}};
function csQuery(){const q=$('#csQuery').value.trim();if(!q){toast('Enter query','e');return;}const c=findCust(q)||findAcc(q);$('#csResult').innerHTML=c?`<div class="alert s"><div class="al-body">Found: ${esc(c.fullName||c.name||'Record')}</div></div>`:'<div class="alert w">Not found</div>';}
R['m20-clear-cache']={render(){return `${actionStrip([{label:'Clear Cache',active:true,icon:'fas fa-sync'}])}<div class="section-band">Clear Cache</div><div class="content-wrap"><div style="text-align:center;padding:30px"><button class="btn pri" onclick="toast('Cache cleared','s')">Clear Session Cache</button></div></div>`;},init(){}};
R['m21-reports']=R['m21-reports']||{render(){return `${actionStrip([{label:'Reports',active:true,icon:'fas fa-chart-bar'}])}<div class="section-band">Reports Center</div><div class="content-wrap"><div class="panel"><div class="panel-b"><button class="btn pri" onclick="toast('Report generated','s')">Download Daily Cash Report</button></div></div></div>`;},init(){}};
R['m21-advices']={render(){return `${actionStrip([{label:'Advices',active:true,icon:'fas fa-envelope'}])}<div class="section-band">Advices &amp; Tickets</div><div class="content-wrap" style="padding-top:0">${txnGrid(state.transactions.slice(0,10))}</div>`;},init(){}};

R['m22-eod']={render(){
  const pendAuth=state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION').length;
  const total=pendingAuthCount()+state.journalEntries.filter(j=>j.status==='PENDING_AUTHORIZATION').length;
  return `${actionStrip([{label:'End of Day',active:true,icon:'fas fa-moon'},{spacer:true},{info:`Business Date: <b>${esc(state.businessDate)}</b>`}])}
  <div class="section-band">22. Branch End-of-Day (EOD)</div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi ${total===0?'k-green':'k-amber'}"><div class="kpi-l">Pending Auth</div><div class="kpi-v">${total}</div></div>
      <div class="kpi k-blue"><div class="kpi-l">Transactions</div><div class="kpi-v">${state.transactions.length}</div></div>
      <div class="kpi k-green"><div class="kpi-l">Open Batches</div><div class="kpi-v">1</div></div>
      <div class="kpi k-purple"><div class="kpi-l">Business Date</div><div class="kpi-v" style="font-size:13px">${esc(state.businessDate)}</div></div>
    </div>
    <div class="panel"><div class="panel-h">Pre-Closing Checklist</div><div class="panel-b">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn" onclick="go('m19-approvals')"><i class="fas fa-check-double"></i> Review Approvals</button>
        <button class="btn" onclick="go('m8-batch-auth')"><i class="fas fa-check-square"></i> Batch Auth</button>
        <button class="btn dgr" onclick="runEOD()"><i class="fas fa-moon"></i> Run End-of-Day</button>
      </div>
    </div></div>
  </div>`;
},init(){}};

function runEOD(){
  if(!['BRANCH_MANAGER','SUPER_ADMIN'].includes(state.user.role)){toast('Only a Branch Manager or Super Admin can run End-of-Day','e');return;}
  const pending=pendingAuthCount()+state.journalEntries.filter(j=>j.status==='PENDING_AUTHORIZATION').length;
  if(pending>0){toast('Cannot run EOD: '+pending+' item(s) pending authorization','e');return;}
  if(!confirm('Run End-of-Day? Business date will roll forward.'))return;
  const d=new Date(state.businessDate+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1);
  state.businessDate=d.toISOString().slice(0,10);
  logAudit('EOD','BRANCH','Business date rolled to '+state.businessDate);
  toast('EOD completed. New date: '+state.businessDate,'s');saveState();mount();
}

R['m23-help']={render(){return `${actionStrip([{label:'Help & Guide',active:true,icon:'fas fa-book'}])}<div class="section-band">Function Directory &amp; Help</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Core Banking Systems · CIF Customer Master · KYC Lifecycle · Account Management · Deposit Operations · Clearing &amp; Settlements</p></div></div></div>`;},init(){}};
R['m24-analytics']={render(){return `${actionStrip([{label:'Analytics',active:true,icon:'fas fa-chart-line'}])}<div class="section-band">24. Analytics &amp; Business Intelligence</div><div class="content-wrap"><div class="kpi-grid"><div class="kpi k-green"><div class="kpi-l">Total Deposits</div><div class="kpi-v">${fmtETB(state.accounts.reduce((s,a)=>s+(a.balance||0),0))}</div></div></div></div>`;},init(){}};
R['m24-kpi']=R['m24-analytics'];
R['m24-trends']=R['m24-analytics'];
R['m24-compliance']=R['m24-analytics'];

R['m25-tasks']={render(){
  const open=state.tasks.filter(t=>t.status==='OPEN');
  return `${actionStrip([{label:'Tasks',active:true,icon:'fas fa-tasks'},{label:'+ New Task',onclick:"newTask()",icon:'fas fa-plus'}])}<div class="section-band">Task Manager</div><div class="content-wrap"><div class="tbl-wrap"><table class="oracle-tbl"><thead><tr><th>Title</th><th>Priority</th><th>Due</th><th>Status</th></tr></thead><tbody>${state.tasks.map(t=>`<tr><td>${esc(t.title)}</td><td>${bdg(t.priority)}</td><td>${esc(t.due)}</td><td>${bdg(t.status)}</td></tr>`).join('')}</tbody></table></div></div>`;
},init(){}};
function newTask(){const t=prompt('Task title:');if(t){state.tasks.push({id:uid('TSK'),title:t,priority:'HIGH',due:today(),status:'OPEN'});saveState();mount();}}
R['m25-calendar']={render(){return `${actionStrip([{label:'Calendar',active:true,icon:'fas fa-calendar'}])}<div class="section-band">Calendar</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Calendar Schedule: ${today()}</p></div></div></div>`;},init(){}};
R['m26-docs']={render(){return `${actionStrip([{label:'Docs',active:true,icon:'fas fa-file'}])}<div class="section-band">Documents</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Vault Documents: ${state.documents.length}</p></div></div></div>`;},init(){}};
R['m26-templates']=R['m26-docs'];
R['m27-inbox']={render(){return `${actionStrip([{label:'Inbox',active:true,icon:'fas fa-envelope'}])}<div class="section-band">Inbox</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>No unread messages</p></div></div></div>`;},init(){}};
R['m27-sms']=R['m27-inbox'];
R['m27-email']=R['m27-inbox'];
R['m28-atm']={render(){return `${actionStrip([{label:'ATM',active:true,icon:'fas fa-hdd'}])}<div class="section-band">ATM Management</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Online ATMs: ${state.atms.length}</p></div></div></div>`;},init(){}};
R['m28-pos']=R['m28-atm'];
R['m28-merchant']=R['m28-atm'];
R['m29-portfolio']={render(){return `${actionStrip([{label:'Portfolio',active:true,icon:'fas fa-chart-pie'}])}<div class="section-band">Portfolio</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Active Investments: ${state.investments.length}</p></div></div></div>`;},init(){}};
R['m29-moneymarket']=R['m29-portfolio'];
R['m29-securities']=R['m29-portfolio'];
R['m30-health']={render(){return `${actionStrip([{label:'Health',active:true,icon:'fas fa-heartbeat'}])}<div class="section-band">Health</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>System Health: 99.98% uptime</p></div></div></div>`;},init(){}};
R['m30-api']=R['m30-health'];
R['m30-backup']=R['m30-health'];
R['m30-sessions']=R['m30-health'];
R['new-mobile-money']={render(){return `${actionStrip([{label:'Mobile Money',active:true,icon:'fas fa-mobile'}])}<div class="section-band">Telebirr &amp; M-Pesa</div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Integrated Mobile Money Gateway</p></div></div></div>`;},init(){}};
R['new-loans']=R['new-mobile-money'];
R['new-cards']=R['new-mobile-money'];
R['new-bills']=R['new-mobile-money'];
R['new-treasury']=R['new-mobile-money'];
R['new-trade']=R['new-mobile-money'];
R['new-islamic']=R['new-mobile-money'];
R['new-notifications']=R['new-mobile-money'];

function filterBanksByType(t){
  state.ui.bankFilterType=t;
  renderBankDirectoryGrid();
}
function onBankSearchChange(v){
  state.ui.bankSearchQ=v;
  renderBankDirectoryGrid();
}
function renderBankDirectoryGrid(){
  const container=$('#bankGridContainer');
  const countEl=$('#bankCountInfo');
  if(!container)return;
  const q=(state.ui.bankSearchQ||'').trim().toLowerCase();
  const t=state.ui.bankFilterType||'ALL';
  const list=state.banks.filter(b=>{
    const matchType = (t==='ALL'||b.type===t);
    if(!matchType) return false;
    if(!q) return true;
    return (b.name||'').toLowerCase().includes(q) ||
           (b.nameAm||'').toLowerCase().includes(q) ||
           (b.bankId||'').toLowerCase().includes(q) ||
           (b.swiftBic||'').toLowerCase().includes(q) ||
           (b.website||'').toLowerCase().includes(q) ||
           (b.short||'').toLowerCase().includes(q);
  });
  if(countEl) countEl.innerHTML = `<b>${list.length}</b> of ${state.banks.length} Banks`;
  if(!list.length){
    container.innerHTML=`<div class="alert w" style="grid-column:1/-1;padding:16px"><span class="al-ic">🔍</span><div class="al-body">No banks matched "<b>${esc(q)}</b>". Try searching by another bank name, SWIFT BIC, or domain.</div></div>`;
    return;
  }
  container.innerHTML=list.map(b=>`
    <div class="bank-card" id="bcard-${b.bankId}">
      <div class="bank-card-main">
        <div class="bc-logo" id="blogo-${b.bankId}">${bankLogoHtml(b)}</div>
        <div class="bc-info">
          <div class="bc-name">${esc(b.name)}</div>
          <div class="bc-name-am">${esc(b.nameAm||'')}</div>
          <div class="bc-meta">
            <span class="mono">${esc(b.bankId)}</span> · <span class="mono">${esc(b.swiftBic)}</span>
            <span class="bdg ${b.type==='Public'?'in':b.type==='Interest-Free'?'wn':'ok'}">${esc(b.type)}</span>
          </div>
        </div>
      </div>
      <div class="bank-card-footer">
        <a href="${esc(b.website)}" target="_blank" rel="noopener" class="bank-web-link" title="Visit ${esc(b.name)} Official Website">
          <i class="fas fa-globe"></i> ${esc((b.website||'').replace(/^https?:\/\//i,'').replace(/^www\./i,'').replace(/\/$/,''))}
        </a>
        <div style="display:flex;gap:4px">
          <button class="btn sm" onclick="testBankLogo('${b.bankId}')" title="Test & reload live logo from official website"><i class="fas fa-sync-alt"></i> Logo</button>
          <button class="btn sm pri" onclick="quickIFT('${b.swiftBic}')" title="Initiate transfer to this bank"><i class="fas fa-exchange-alt"></i> IFT</button>
        </div>
      </div>
    </div>
  `).join('');
}
window.filterBanksByType=filterBanksByType;
window.onBankSearchChange=onBankSearchChange;
window.renderBankDirectoryGrid=renderBankDirectoryGrid;

function testBankLogo(bankId){
  const b=state.banks.find(x=>x.bankId===bankId);
  if(!b)return;
  const container=$('#blogo-'+bankId);
  if(!container)return;
  toast('Fetching live logo for '+b.name+' from website...','i');
  container.innerHTML=bankLogoHtml(b);
}
window.testBankLogo=testBankLogo;

function quickIFT(bic){
  state.ui.targetBic=bic;
  go('ref-rtgs');
}
window.quickIFT=quickIFT;

function reloadAllBankLogos(){
  toast('Searching live logos from official bank websites...','i');
  renderBankDirectoryGrid();
  setTimeout(()=>toast('Bank logos updated from websites','s'),400);
}
window.reloadAllBankLogos=reloadAllBankLogos;

R['ref-banks']={
  render(){
    const t=state.ui.bankFilterType||'ALL';
    const q=state.ui.bankSearchQ||'';
    return `${actionStrip([
      {label:'Licensed Banks',active:true,icon:'fas fa-university'},
      {label:'Refresh All Logos',onclick:"reloadAllBankLogos()",icon:'fas fa-sync'},
      {spacer:true},
      {info:`<span id="bankCountInfo"><b>${state.banks.length} Banks</b></span>`}
    ])}
    <div class="section-band">Ethiopian Bank Directory <span class="tag">31 Licensed Commercial Banks · NBE Registered</span></div>
    <div class="content-wrap">
      <div class="bank-search-bar">
        <div style="flex:1;min-width:240px;position:relative">
          <input class="input" id="bankSearchQ" placeholder="🔍 Search by name, Amharic, SWIFT BIC, code, or website..." oninput="onBankSearchChange(this.value)" value="${esc(q)}">
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="bank-filter-btn ${t==='ALL'?'active':''}" onclick="filterBanksByType('ALL')">All (31)</button>
          <button class="bank-filter-btn ${t==='Private'?'active':''}" onclick="filterBanksByType('Private')">Private (27)</button>
          <button class="bank-filter-btn ${t==='Public'?'active':''}" onclick="filterBanksByType('Public')">Public (1)</button>
          <button class="bank-filter-btn ${t==='Interest-Free'?'active':''}" onclick="filterBanksByType('Interest-Free')">Interest-Free (3)</button>
        </div>
      </div>
      <div id="bankGridContainer" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px"></div>
    </div>`;
  },
  init(){
    renderBankDirectoryGrid();
  }
};

R['ref-ift']=R['ref-banks'];

R['ref-my-accounts']={render(){
  const total=state.userAccounts.reduce((s,a)=>s+(a.balance||0),0);
  return `${actionStrip([{label:'My Accounts',active:true,icon:'fas fa-wallet'},{label:'+ Add Account',onclick:"openAddAccountModal()",icon:'fas fa-plus'}])}<div class="section-band">My Accounts <span class="tag">${fmtETB(total)}</span></div><div class="content-wrap"><div class="panel"><div class="panel-b"><p>Accounts: ${state.userAccounts.length}</p><button class="btn pri" onclick="openAddAccountModal()">Add Account</button></div></div></div>`;
},init(){}};
function openAddAccountModal(){const a=prompt('Account number:');if(a){state.userAccounts.push({accountNo:a,bank:'CBE',name:state.user.name,balance:100000});saveState();mount();}}

R['ref-rtgs']={render(){
  return `${actionStrip([{label:'RTGS',active:true,icon:'fas fa-bolt'}])}<div class="section-band">RTGS High-Value Transfer</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Amount</label><input class="input mono" id="rtgsAmt" value="250000"></div><div style="text-align:right"><button class="btn pri" onclick="toast('RTGS transfer initiated','s')">Transfer</button></div></div></div></div>`;
},init(){}};

R['ref-users']={render(){return `${actionStrip([{label:'Users',active:true,icon:'fas fa-users'}])}<div class="section-band">Users</div><div class="content-wrap"><div class="tbl-wrap"><table class="oracle-tbl"><thead><tr><th>User ID</th><th>Name</th><th>Role</th></tr></thead><tbody>${state.users.map(u=>`<tr><td>${esc(u.id)}</td><td>${esc(u.name)}</td><td>${esc(u.role)}</td></tr>`).join('')}</tbody></table></div></div>`;},init(){}};
R['ref-branches']=R['ref-users'];
R['ref-roles']=R['ref-users'];
R['ref-reports']=R['m21-reports'];
R['ref-audit']={render(){return `${actionStrip([{label:'Audit Trail',active:true,icon:'fas fa-history'}])}<div class="section-band">Audit Trail</div><div class="content-wrap"><div class="tbl-wrap"><table class="oracle-tbl"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Detail</th></tr></thead><tbody>${state.audit.slice(0,30).map(a=>`<tr><td>${dtstr(a.ts)}</td><td>${esc(a.user)}</td><td>${esc(a.action)}</td><td>${esc(a.detail)}</td></tr>`).join('')}</tbody></table></div></div>`;},init(){}};
R['ref-search']={render(){return `${actionStrip([{label:'Universal Search',active:true,icon:'fas fa-search'}])}<div class="section-band">Universal Search</div><div class="content-wrap"><div class="panel"><div class="panel-b"><input class="input" placeholder="Search..." oninput="toast('Searching...','i')"></div></div></div>`;},init(){}};

function openAIPanel(){
  openModal('🤖 FinFlow AI Advisor',`<div style="padding:10px">Hi! Ask about balances, RTGS, CIF, KYC, TD, cheques, EOD, or financial operations.<br><input class="input" id="aiInput" style="margin-top:10px" placeholder="Ask AI..."><div style="margin-top:8px;text-align:right"><button class="btn pri" onclick="toast('AI Advisor: All systems operational.','s')">Send</button></div></div>`,`<button class="btn exit" onclick="closeModal()">Close</button>`);
}

function mount(){
  if(!state.session)return;
  const key=(location.hash.replace('#/','').split('?')[0])||'m2-home';
  const r=R[key]||R['m2-home'];
  const sy=window.scrollY;let html;
  try{html=r.render?r.render():'';}
  catch(e){console.error(e);html='<div class="content-wrap"><div class="alert e"><span class="al-ic">⛔</span><div class="al-body"><b>This screen failed to load</b>'+esc(e.message)+'</div></div></div>';}
  $('#main').innerHTML=`<div id="screen">${html}</div>`;
  try{r.init&&r.init();}catch(e){console.error(e);}
  refreshShell();
  window.scrollTo(0,key===_lastRoute?sy:0);_lastRoute=key;
}
window.addEventListener('hashchange',mount);

(function boot(){
  try{const t=localStorage.getItem('fx-theme-v145');if(t==='dark')state.theme='dark';}catch(e){}
  try{const f=localStorage.getItem('fx-font-v145');if(f)state.font=f;}catch(e){}
  if(!loadState())seed();else if(!state.users||!state.users.length)seed();
  document.documentElement.setAttribute('data-theme',state.theme);
  document.body.className='font-'+(state.font||'m');
  const tb=$('#themeBtn');if(tb)tb.innerHTML=state.theme==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';
  loadSidebarState();
  populateLoginBranches();
  {const bd=$('#lg-bdate');if(bd)bd.value=fmtBizDate();}
  $$('#login .font-toggle button').forEach((b,i)=>b.classList.toggle('on',['s','m','l'][i]===(state.font||'m')));
  // Removed unnecessary high-frequency events (mousemove/touchstart)
  ['click','keydown'].forEach(ev=>document.addEventListener(ev,resetIdle,{passive:true}));
  try{
    const s=localStorage.getItem(SESSION_KEY);
    if(s){
      const sess=JSON.parse(s);
      const u=state.users.find(x=>x.id===sess.userId);
      if(u&&u.status==='ACTIVE'){
        {const {password:_p,...su}=u;state.user={...su,prevLogin:u.lastLogin};}state.session=uid('SESS');state.till=state.till||{id:'T-003',code:'TILL-T03',ccy:'ETB'};
        logAudit('AUTO_LOGIN',state.session,'Auto');
        $('#login').classList.add('hide');$('#app').classList.add('on');
        refreshShell();enterApp();resetIdle();
        setTimeout(()=>toast('Welcome back, '+state.user.name,'s'),300);
      }
    }
  }catch(e){}
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeModal();closeUserMenu();}
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();$('#globalSearch').focus();}
    if((e.ctrlKey||e.metaKey)&&e.key==='b'){e.preventDefault();toggleSidebar();}
    if(e.key==='Enter'&&$('#login')&&!$('#login').classList.contains('hide')){
      if(document.activeElement&&document.activeElement.id==='lg-pass'){e.preventDefault();doLogin();}
    }
  });
  window.addEventListener('beforeunload',saveStateNow);
  setTimeout(()=>{const u=$('#lg-user');if(u&&!$('#login').classList.contains('hide'))u.focus();},300);
})();
