/* =====================================================================
   FLEXCUBE Modules 1-15 Routes
   ===================================================================== */
const R={};

R['m2-home']={render(){
  const totalBal=state.userAccounts.reduce((s,a)=>s+(a.balance||0),0);
  const pending=state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION').length;
  const tasks=state.tasks.filter(t=>t.status==='OPEN').length;
  return `
  ${actionStrip([
    {label:'Home',active:true,icon:'fas fa-home'},
    {label:'Work Queue',onclick:"go('m19-work-queue')",icon:'fas fa-tasks'},
    {label:'Analytics',onclick:"go('m24-analytics')",icon:'fas fa-chart-line'},
    {label:'My Tasks',onclick:"go('m25-tasks')",icon:'fas fa-check-circle'},
    {sep:true},
    {info:`<b>Date:</b> ${esc(state.businessDate)}`},
    {info:`<b>Branch:</b> ${esc(state.branch.code)}`}
  ])}
  <div class="section-band">Home Dashboard <span class="tag">FLEXCUBE Neo · v14.5 · 30 Modules</span></div>
  <div class="content-wrap">
    <div class="info-msg">
      <div class="im-ic">ⓘ</div>
      <div class="im-body">
        <b>Welcome back, ${esc(state.user.name)}</b>
        <div class="im-list">
          <div><span>Last Login:</span><b>${esc(state.user.prevLogin?dtstr(state.user.prevLogin):'First login')}</b></div>
          <div><span>Current Time:</span><b>${new Date().toTimeString().slice(0,8)}</b></div>
          <div><span>Session:</span><b>${esc(state.session||'—')}</b></div>
          <div><span>Branch:</span><b>${esc(state.branch.code)} — ${esc(state.branch.name)}</b></div>
        </div>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi k-blue clickable" onclick="go('m3-cust-list')"><div class="kpi-l"><i class="fas fa-users"></i> Customers</div><div class="kpi-v">${state.customers.length}</div><div class="kpi-s">Authorized: ${state.customers.filter(c=>c.authStatus==='AUTHORIZED').length}</div></div>
      <div class="kpi k-green clickable" onclick="go('m4-acc-list')"><div class="kpi-l"><i class="fas fa-credit-card"></i> Accounts</div><div class="kpi-v">${state.accounts.length}</div><div class="kpi-s">Total: ${fmtETB(state.accounts.reduce((s,a)=>s+(a.balance||0),0))}</div></div>
      <div class="kpi k-purple clickable" onclick="go('m6-td-list')"><div class="kpi-l"><i class="fas fa-calendar-check"></i> Term Deposits</div><div class="kpi-v">${state.tdAccounts.length}</div><div class="kpi-s">Principal: ${fmtETB(state.tdAccounts.reduce((s,a)=>s+(a.principal||0),0))}</div></div>
      <div class="kpi k-amber clickable" onclick="go('m19-work-queue')"><div class="kpi-l"><i class="fas fa-hourglass-half"></i> Pending</div><div class="kpi-v">${pending}</div><div class="kpi-s">Awaiting approval</div></div>
      <div class="kpi k-teal clickable" onclick="go('m25-tasks')"><div class="kpi-l"><i class="fas fa-check-circle"></i> Open Tasks</div><div class="kpi-v">${tasks}</div><div class="kpi-s">My assignments</div></div>
      <div class="kpi k-cyan clickable" onclick="go('ref-rtgs')"><div class="kpi-l"><i class="fas fa-bolt"></i> RTGS</div><div class="kpi-v">${state.transactions.filter(t=>t.title&&t.title.includes('RTGS')).length}</div><div class="kpi-s">High-value transfers</div></div>
      <div class="kpi k-pink clickable" onclick="go('new-loans')"><div class="kpi-l"><i class="fas fa-home"></i> Loans</div><div class="kpi-v">0</div><div class="kpi-s">Active portfolio</div></div>
      <div class="kpi k-red clickable" onclick="go('ref-banks')"><div class="kpi-l"><i class="fas fa-university"></i> Banks</div><div class="kpi-v">${state.banks.length}</div><div class="kpi-s">Licensed · 2026</div></div>
    </div>
    <div class="panel">
      <div class="panel-h"><i class="fas fa-bolt"></i> Quick Actions <span class="tag">Frequently used</span></div>
      <div class="panel-b">
        <div class="qa-grid">
          <div class="qa-tile" onclick="go('m3-cust-new')"><div class="qa-ic"><i class="fas fa-user-plus"></i></div><div class="qa-l">New Customer</div><div class="qa-s">STDCIF</div></div>
          <div class="qa-tile" onclick="go('m4-acc-new')"><div class="qa-ic"><i class="fas fa-credit-card"></i></div><div class="qa-l">Open Account</div><div class="qa-s">STDCUSAC</div></div>
          <div class="qa-tile" onclick="go('m6-td-new')"><div class="qa-ic"><i class="fas fa-calendar-plus"></i></div><div class="qa-l">Book TD</div><div class="qa-s">STDCUSTD</div></div>
          <div class="qa-tile" onclick="go('m17-deposit')"><div class="qa-ic"><i class="fas fa-arrow-down"></i></div><div class="qa-l">Cash Deposit</div><div class="qa-s">Teller</div></div>
          <div class="qa-tile" onclick="go('m17-withdrawal')"><div class="qa-ic"><i class="fas fa-arrow-up"></i></div><div class="qa-l">Withdrawal</div><div class="qa-s">Teller</div></div>
          <div class="qa-tile" onclick="go('ref-rtgs')"><div class="qa-ic"><i class="fas fa-bolt"></i></div><div class="qa-l">RTGS Transfer</div><div class="qa-s">High-value</div></div>
          <div class="qa-tile" onclick="go('m14-cheque-book')"><div class="qa-ic"><i class="fas fa-book"></i></div><div class="qa-l">Cheque Book</div><div class="qa-s">CADCHBOO</div></div>
          <div class="qa-tile" onclick="go('m15-cpo-issue')"><div class="qa-ic"><i class="fas fa-money-check"></i></div><div class="qa-l">CPO Issue</div><div class="qa-s">PIDINSIS</div></div>
          <div class="qa-tile" onclick="go('m19-approvals')"><div class="qa-ic"><i class="fas fa-check-double"></i></div><div class="qa-l">Approvals</div><div class="qa-s">${pending} pending</div></div>
          <div class="qa-tile" onclick="go('m22-eod')"><div class="qa-ic"><i class="fas fa-moon"></i></div><div class="qa-l">Run EOD</div><div class="qa-s">End of day</div></div>
          <div class="qa-tile" onclick="openAIPanel()"><div class="qa-ic"><i class="fas fa-robot"></i></div><div class="qa-l">AI Advisor</div><div class="qa-s">FinFlow AI</div></div>
          <div class="qa-tile" onclick="go('m23-help')"><div class="qa-ic"><i class="fas fa-book-open"></i></div><div class="qa-l">Function Index</div><div class="qa-s">All IDs</div></div>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="panel"><div class="panel-h"><i class="fas fa-heartbeat"></i> System Status</div><div class="panel-b">
        <div class="stat-row"><span class="sl">Active Users</span><span class="sv">${state.users.filter(u=>u.status==='ACTIVE').length}</span></div>
        <div class="stat-row"><span class="sl">Branches</span><span class="sv">${state.branches.length||1}</span></div>
        <div class="stat-row"><span class="sl">Total Transactions</span><span class="sv">${state.transactions.length}</span></div>
        <div class="stat-row"><span class="sl">Audit Entries</span><span class="sv">${state.audit.length}</span></div>
        <div class="stat-row"><span class="sl">Licensed Banks</span><span class="sv">${state.banks.length}</span></div>
      </div></div>
      <div class="panel"><div class="panel-h"><i class="fas fa-wallet"></i> My Accounts</div><div class="panel-b">
        <div class="stat-row"><span class="sl">Linked Accounts</span><span class="sv">${state.userAccounts.length}</span></div>
        <div class="stat-row"><span class="sl">Total Balance</span><span class="sv" style="color:var(--ok)">${fmtETB(totalBal)}</span></div>
        <div class="stat-row"><span class="sl">Primary Account</span><span class="sv">${state.userAccounts[state.primaryAccountIndex]?.accountNo||'—'}</span></div>
        <div style="text-align:right;margin-top:8px"><button class="btn pri" onclick="go('ref-my-accounts')"><i class="fas fa-plus"></i> Manage Accounts</button></div>
      </div></div>
    </div>
    <div class="panel" style="margin-top:14px">
      <div class="panel-h"><i class="fas fa-history"></i> Recent Transactions <span class="tag">Latest 6</span></div>
      <div class="panel-b flush">${txnGrid(state.transactions.slice(0,6))}</div>
    </div>
  </div>`;
},init(){}};

R['m2-interactions']={render(){
  return `${actionStrip([{label:'Interactions',active:true,icon:'fas fa-comments'}])}
  <div class="section-band">Interactions <span class="tag">Reminders · Alerts · Messages</span></div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi k-amber clickable" onclick="go('m19-work-queue')"><div class="kpi-l"><i class="fas fa-bell"></i> Reminders</div><div class="kpi-v">${state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION').length}</div><div class="kpi-s">Action needed</div></div>
      <div class="kpi k-red clickable"><div class="kpi-l"><i class="fas fa-exclamation-triangle"></i> Alerts</div><div class="kpi-v">${state.alerts.length}</div><div class="kpi-s">System alerts</div></div>
      <div class="kpi k-blue clickable" onclick="go('m27-inbox')"><div class="kpi-l"><i class="fas fa-envelope"></i> Messages</div><div class="kpi-v">${state.messages.length}</div><div class="kpi-s">Internal</div></div>
    </div>
    <div class="panel"><div class="panel-h">Interaction Queue</div><div class="panel-b">${emptyState('💬','No pending interactions','All caught up.')}</div></div>
  </div>`;
},init(){}};

R['m2-funcid']={render(){
  return `${actionStrip([{label:'Function ID Master',active:true,icon:'fas fa-terminal'},{spacer:true},{info:'Type in Function ID bar to navigate'}])}
  <div class="section-band">Function ID Master</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-h">Function ID Directory</div><div class="panel-b">
      <div class="qa-grid">
        ${Object.keys(FUNC_MAP).map(f=>`<div class="qa-tile" onclick="$('#funcIdInput').value='${f}';runFuncId()" style="min-height:56px;padding:6px">
          <div class="qa-l" style="font-family:var(--mono);color:var(--oracle-red);font-size:11px">${f}</div>
          <div class="qa-s" style="font-size:9px">${esc(FUNC_MAP[f])}</div>
        </div>`).join('')}
      </div>
    </div></div>
  </div>`;
},init(){}};

R['m2-preferences']={render(){
  return `${actionStrip([{label:'Preferences',active:true,icon:'fas fa-cog'}])}
  <div class="section-band">Preferences</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-h">Display</div><div class="panel-b">
      <div class="form-row"><label>Font Size</label>
        <div class="font-toggle">
          <button onclick="setFont('s',this)" class="${state.font==='s'?'on':''}">Small</button>
          <button onclick="setFont('m',this)" class="${state.font==='m'?'on':''}">Medium</button>
          <button onclick="setFont('l',this)" class="${state.font==='l'?'on':''}">Large</button>
        </div>
      </div>
      <div class="form-row"><label>Language</label>
        <select class="input" onchange="setLang(this.value)">
          <option value="am" ${state.lang==='am'?'selected':''}>አማርኛ (Amharic)</option>
          <option value="en" ${state.lang==='en'?'selected':''}>English</option>
        </select></div>
      <div class="form-row"><label>Theme</label>
        <select class="input" onchange="setTheme(this.value==='Dark'?'dark':'light')">
          <option ${state.theme==='light'?'selected':''}>Light</option>
          <option ${state.theme==='dark'?'selected':''}>Dark</option>
        </select></div>
    </div></div>
    <div class="panel"><div class="panel-h">Personal Details</div><div class="panel-b"><div class="kv-grid">
      <dt>Full Name</dt><dd>${esc(state.user.name)}</dd>
      <dt>Email</dt><dd>${esc(state.user.email||'—')}</dd>
      <dt>Phone</dt><dd class="mono">${esc(state.user.phone||'—')}</dd>
      <dt>Department</dt><dd>${esc(state.user.department||'—')}</dd>
    </div></div></div>
  </div>`;
},init(){}};

R['m1-security']={render(){
  return `${actionStrip([{label:'Security Overview',active:true,icon:'fas fa-shield-alt'},{label:'Change Password',onclick:"go('m1-change-pass')",icon:'fas fa-key'},{label:'User Limits',onclick:"go('m1-limits')",icon:'fas fa-chart-line'}])}
  <div class="section-band">1. System Access &amp; Security</div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi k-green"><div class="kpi-l"><i class="fas fa-shield-alt"></i> Session</div><div class="kpi-v" style="font-size:12px">ACTIVE</div><div class="kpi-s">${esc(state.session||'—')}</div></div>
      <div class="kpi k-blue"><div class="kpi-l"><i class="fas fa-user-tag"></i> Role</div><div class="kpi-v" style="font-size:12px">${esc(state.user.role)}</div></div>
      <div class="kpi k-amber"><div class="kpi-l"><i class="fas fa-building"></i> Branch</div><div class="kpi-v" style="font-size:12px">${esc(state.branch.code)}</div></div>
      <div class="kpi k-purple"><div class="kpi-l"><i class="fas fa-clock"></i> Last Login</div><div class="kpi-v" style="font-size:11px">${esc(state.user.prevLogin?dtstr(state.user.prevLogin):'First login')}</div></div>
    </div>
    <div class="panel"><div class="panel-h">Session Details</div><div class="panel-b"><div class="kv-grid">
      <dt>User ID</dt><dd class="mono">${esc(state.user.id)}</dd>
      <dt>Full Name</dt><dd>${esc(state.user.name)}</dd>
      <dt>Email</dt><dd>${esc(state.user.email||'—')}</dd>
      <dt>Phone</dt><dd class="mono">${esc(state.user.phone||'—')}</dd>
      <dt>Employee ID</dt><dd class="mono">${esc(state.user.employeeId||'—')}</dd>
      <dt>Department</dt><dd>${esc(state.user.department||'—')}</dd>
      <dt>IP Address</dt><dd class="mono">10.12.4.87</dd>
      <dt>Multi-Factor</dt><dd><span class="bdg wn">Not Authenticated</span></dd>
    </div></div></div>
  </div>`;
},init(){}};

R['m1-change-pass']={render(){
  return `${actionStrip([{label:'Change Password',active:true,icon:'fas fa-key'}])}
  <div class="section-band">Change Password</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">Current Password</label><input class="input" type="password" id="cpOld"></div>
      <div class="form-row"><label class="req">New Password</label><input class="input" type="password" id="cpNew"></div>
      <div class="form-row"><label class="req">Confirm New Password</label><input class="input" type="password" id="cpConfirm"></div>
      <div class="alert i"><span class="al-ic">ℹ</span><div class="al-body"><b>Password Policy</b>Min 8 chars · 1 uppercase · 1 lowercase · 1 number · 1 special</div></div>
      <div style="text-align:right;margin-top:12px"><button class="btn pri" onclick="changePassword()"><i class="fas fa-save"></i> Change Password</button></div>
    </div></div>
  </div>`;
},init(){}};

function changePassword(){
  const o=$('#cpOld').value,n=$('#cpNew').value,c=$('#cpConfirm').value;
  if(!o||!n||!c){toast('All fields required','e');return;}
  const u=state.users.find(x=>x.id===state.user.id);if(!u)return;
  if(u.password!==o){logAudit('CHANGE_PASSWORD_FAILED',state.user.id,'Wrong current password');toast('Current password is incorrect','e');return;}
  if(n!==c){toast('Passwords do not match','e');return;}
  if(n===o){toast('New password must differ from the current one','e');return;}
  if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(n)){toast('Password needs 8+ chars with upper, lower, number and special character','e');return;}
  u.password=n;logAudit('CHANGE_PASSWORD',state.user.id);toast('Password changed','s');saveState();go('m1-security');
}

R['m1-settings']=R['m2-preferences'];
R['m1-roles']={render(){
  return `${actionStrip([{label:'User Roles',active:true,icon:'fas fa-users-cog'}])}
  <div class="section-band">User Roles</div>
  <div class="content-wrap">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr><th>Role ID</th><th>Name</th><th>Description</th><th>Status</th></tr></thead><tbody>
      ${state.roles.map(r=>`<tr><td class="mono">${esc(r.id)}</td><td>${esc(r.name)}</td><td>${esc(r.desc)}</td><td>${bdg('ACTIVE')}</td></tr>`).join('')}
    </tbody></table></div>
  </div>`;
},init(){}};

R['m1-limits']={render(){
  return `${actionStrip([{label:'User Limits',active:true,icon:'fas fa-chart-line'}])}
  <div class="section-band">User Limits</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-h">Limits for ${esc(state.user.name)} <span class="tag">${esc(state.user.role)}</span></div><div class="panel-b flush">
      <div class="tbl-wrap" style="border:0"><table class="oracle-tbl"><thead><tr>
        <th>Transaction Type</th><th>Currency</th><th style="text-align:right">Min</th><th style="text-align:right">Max</th><th>Status</th>
      </tr></thead><tbody>
        <tr><td>Cash Deposit</td><td>ETB</td><td class="mono" style="text-align:right">0.00</td><td class="mono" style="text-align:right">999,999,999.99</td><td>${bdg('ACTIVE')}</td></tr>
        <tr><td>Cash Withdrawal</td><td>ETB</td><td class="mono" style="text-align:right">0.00</td><td class="mono" style="text-align:right">500,000.00</td><td>${bdg('ACTIVE')}</td></tr>
        <tr><td>RTGS Transfer</td><td>ETB</td><td class="mono" style="text-align:right">200,000.00</td><td class="mono" style="text-align:right">50,000,000.00</td><td>${bdg('ACTIVE')}</td></tr>
        <tr><td>FX Transaction</td><td>USD</td><td class="mono" style="text-align:right">0.00</td><td class="mono" style="text-align:right">50,000.00</td><td>${bdg('ACTIVE')}</td></tr>
      </tbody></table></div>
    </div></div>
  </div>`;
},init(){}};

R['m1-branches']={render(){
  return `${actionStrip([{label:'Allowed Branches',active:true,icon:'fas fa-sitemap'}])}
  <div class="section-band">Allowed / Disallowed Branches</div>
  <div class="content-wrap">
    <div class="form-2col">
      <div class="panel"><div class="panel-h">Allowed</div><div class="panel-b">
        <span class="chip ok">000 — SYSTEM DEFAULT</span>${state.branches.map(b=>`<span class="chip ok">${esc(b.code)} — ${esc((b.name||'').toUpperCase())}</span>`).join('')}
      </div></div>
      <div class="panel"><div class="panel-h">Disallowed</div><div class="panel-b">
        <span class="chip warn">999 — TEST BRANCH</span>
      </div></div>
    </div>
  </div>`;
},init(){}};

R['m1-signoff']={render(){
  return `${actionStrip([{label:'Sign Off',active:true,icon:'fas fa-power-off'}])}
  <div class="section-band">Sign Off</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="alert w"><span class="al-ic">⚠</span><div class="al-body"><b>Confirm Sign Off</b>Any unsaved changes will be lost.</div></div>
      <div style="text-align:center;padding:20px"><button class="btn pri" onclick="logout()"><i class="fas fa-power-off"></i> Sign Off Now</button></div>
    </div></div>
  </div>`;
},init(){}};
