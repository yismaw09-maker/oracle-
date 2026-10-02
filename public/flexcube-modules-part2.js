/* =====================================================================
   FLEXCUBE Modules Part 2 (Accounts, TDs, Lien, Journals, Stock, Cheques, CPO)
   ===================================================================== */
R['m4-acc-list']={render(){
  return `${actionStrip([{label:'New',onclick:"go('m4-acc-new')",icon:'fas fa-plus'},{label:'Enter Query',onclick:"toast('Browse accounts','i')",icon:'fas fa-search'},{spacer:true},{info:'Func: <code>STDCUSAC</code>'}])}
  <div class="section-band">Customer Accounts <span class="tag">${state.accounts.length} accounts</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Account</th><th>Customer</th><th>Class</th><th>Ccy</th><th style="text-align:right">Balance</th><th>Auth</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${state.accounts.length?state.accounts.map(a=>`<tr class="clickable" onclick="state.ui.lastAcc='${a.acc}';go('m4-acc-360')">
        <td class="chk"><input type="checkbox" onclick="event.stopPropagation()"></td>
        <td class="mono">${esc(a.acc)}</td><td>${esc(a.name)}</td><td>${esc(a.className)}</td>
        <td>${esc(a.currency)}</td><td class="mono" style="text-align:right">${fmtETB(a.balance)}</td>
        <td>${bdg(a.authStatus)}</td>
        <td style="text-align:right"><button class="btn sm" onclick="event.stopPropagation();state.ui.lastAcc='${a.acc}';go('m4-acc-360')"><i class="fas fa-eye"></i></button></td>
      </tr>`).join(''):'<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--tx3)">No accounts</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

R['m4-acc-360']={render(){
  const a=state.ui.lastAcc?findAcc(state.ui.lastAcc):null;
  if(!a)return `<div class="content-wrap">${emptyState('💳','Select an account','Pick from Account Summary.')}<button class="btn exit" onclick="go('m4-acc-list')"><i class="fas fa-arrow-left"></i> Back</button></div>`;
  const mask=a.acc.length===14?`${a.acc.slice(0,3)}-${a.acc.slice(3,10)}-${a.acc.slice(10,13)}-${a.acc.slice(13)}`:a.acc;
  return `${actionStrip([{label:'Account 360°',active:true,icon:'fas fa-eye'},{label:'Back',onclick:"go('m4-acc-list')",icon:'fas fa-arrow-left'}])}
  <div class="section-band">Account — ${esc(mask)} <span class="tag">${esc(a.name)}</span></div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi k-green"><div class="kpi-l"><i class="fas fa-wallet"></i> Balance</div><div class="kpi-v">${fmtETB(a.balance)}</div></div>
      <div class="kpi k-blue"><div class="kpi-l"><i class="fas fa-check"></i> Available</div><div class="kpi-v">${fmtETB(a.balance-(a.hold||0))}</div></div>
      <div class="kpi k-amber"><div class="kpi-l"><i class="fas fa-lock"></i> Hold</div><div class="kpi-v">${fmtETB(a.hold||0)}</div></div>
      <div class="kpi"><div class="kpi-l"><i class="fas fa-dollar-sign"></i> Ccy</div><div class="kpi-v" style="font-size:13px">${esc(a.currency)}</div></div>
    </div>
    <div class="panel"><div class="panel-h">Details</div><div class="panel-b"><div class="kv-grid">
      <dt>Account</dt><dd class="mono">${esc(a.acc)}</dd>
      <dt>Masked Format</dt><dd class="mono">${esc(mask)}</dd>
      <dt>Customer</dt><dd>${esc(a.name)} (${esc(a.cif)})</dd>
      <dt>Class</dt><dd>${esc(a.className)}</dd>
      <dt>Branch</dt><dd>${esc(a.branch)}</dd>
      <dt>Auth</dt><dd>${bdg(a.authStatus)}</dd>
    </div></div></div>
    <div class="panel"><div class="panel-h">Actions</div><div class="panel-b">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn pri" onclick="toast('Interest calc initiated','i')"><i class="fas fa-calculator"></i> Interest</button>
        <button class="btn" onclick="toast('Statement requested','s')"><i class="fas fa-file-alt"></i> Statement</button>
        <button class="btn dark" onclick="go('m4-acc-status')"><i class="fas fa-sync"></i> Change Status</button>
        <button class="btn dgr" onclick="closeAcc('${a.acc}')"><i class="fas fa-times"></i> Close</button>
      </div>
    </div></div>
  </div>`;
},init(){}};

function closeAcc(acc){
  const a=findAcc(acc);if(!a){toast('Account not found','e');return;}
  if(a.status==='CLOSED'){toast('Account is already closed','w');return;}
  if(a.balance!==0){toast('Balance must be zero ('+fmtETB(a.balance)+'). Use Account Closure to pay it out first.','e');return;}
  if(state.lienBlocks.some(b=>b.account===acc&&b.status==='ACTIVE')){toast('Release active blocks first','e');return;}
  if(!confirm('Close account '+acc+'?'))return;
  a.status='CLOSED';a.recordStatus='CLOSED';
  logAudit('CLOSE_ACCOUNT',acc);toast('Account closed','s');saveState();mount();
}

R['m4-acc-new']={render(){
  const custOpts=state.customers.filter(c=>c.authStatus==='AUTHORIZED').map(c=>`<option value="${c.cif}">${esc(c.cif)} — ${esc(c.fullName)}</option>`).join('');
  const classOpts=ACCOUNT_CLASSES.filter(c=>c.type==='CASA').map(c=>`<option value="${c.code}">${c.code} — ${c.desc}</option>`).join('');
  return `${actionStrip([{label:'New',active:true,icon:'fas fa-plus'},{label:'Save',onclick:"createNewAccount()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDCUSAC</code>'}])}
  <div class="section-band">New Account Opening (STDCUSAC)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Customer No</label><select class="input" id="naCif">${custOpts||'<option value="">No authorized customers</option>'}</select></div>
          <div class="form-row"><label class="req">Currency</label><select class="input" id="naCcy">${CURRENCIES.map(c=>`<option>${c.c}</option>`).join('')}</select></div>
          <div class="form-row"><label class="req">Account Class</label><select class="input" id="naClass" onchange="const c=ACCOUNT_CLASSES.find(x=>x.code===this.value);if(c)$('#naCcy').value=c.ccy">${classOpts}</select></div>
          <div class="form-row"><label>Account</label>
            <div style="display:flex;gap:4px"><input class="input mono" id="naAcc" value="${genAccountNo()}" readonly style="flex:1"><button class="p-btn">P</button></div></div>
        </div>
        <div>
          <div class="form-row"><label>Branch Code</label><input class="input mono" value="${esc(state.branch.code)}" readonly></div>
          <div class="form-row"><label>Account Type</label>
            <div style="display:flex;gap:14px;align-items:center;font-size:11px;padding-top:4px"><label style="font-weight:normal;text-align:left;padding:0"><input type="radio" name="naType" value="Single" checked> Single</label><label style="font-weight:normal;text-align:left;padding:0"><input type="radio" name="naType" value="Joint"> Joint</label></div></div>
          <div class="form-row"><label>Opening Deposit</label><input class="input mono" id="naDeposit" type="number" value="0"></div>
        </div>
      </div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function createNewAccount(){
  const cif=$('#naCif').value,classCode=$('#naClass').value,acc=$('#naAcc').value,ccy=$('#naCcy').value;
  if(!cif){toast('Select customer','e');return;}
  const cust=findCust(cif);if(!cust){toast('Customer not found','e');return;}
  if(cust.authStatus!=='AUTHORIZED'){toast('Customer must be authorized','e');return;}
  const cls=ACCOUNT_CLASSES.find(c=>c.code===classCode);if(!cls){toast('Select account class','e');return;}
  if(cls.ccy!==ccy){toast('Class '+cls.code+' requires currency '+cls.ccy,'e');return;}
  const dep=num($('#naDeposit').value);if(dep<0){toast('Opening deposit cannot be negative','e');return;}
  if(findAcc(acc)){toast('Account number already exists — reopen the form','e');return;}
  const accType=(document.querySelector('input[name="naType"]:checked')||{}).value||'Single';
  const newAcc={acc,cif,name:cust.fullName,currency:ccy,classCode:cls.code,className:cls.name,classDesc:cls.desc,
    branch:state.branch.code,accType,balance:+dep.toFixed(2),hold:0,
    facilities:$$('.naFacility:checked').map(c=>c.value),
    status:'PENDING_AUTHORIZATION',authStatus:'UNAUTHORIZED',recordStatus:'PENDING_AUTHORIZATION',
    maker:state.user.id,makerName:state.user.name,jointHolders:[],createdAt:nowISO()};
  state.accounts.push(newAcc);submitForApproval('ACCOUNT',acc,'New '+cls.name+' · '+cust.fullName);
  logAudit('CREATE_ACCOUNT',acc,'New for '+cust.fullName);
  toast('Account created: '+acc,'s');go('m4-acc-list');
}

R['m4-acc-auth']={render(){
  const pending=state.accounts.filter(a=>a.authStatus==='UNAUTHORIZED');
  return `${actionStrip([{label:'Authorize',onclick:"toast('Use the ✓ / ✗ buttons on each row to authorize or reject','i')",icon:'fas fa-check'},{spacer:true},{info:'Func: <code>STSCUSAC</code>'}])}
  <div class="section-band">Account Authorization <span class="tag">${pending.length} pending</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Account</th><th>Customer</th><th>Class</th><th>Maker</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${pending.length?pending.map(a=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(a.acc)}</td><td>${esc(a.name)}</td><td>${esc(a.className)}</td><td>${esc(a.makerName||a.maker)}</td>
        <td style="text-align:right"><div class="grid-actions">
          <button class="btn sm ok" onclick="authAccount('${a.acc}',true)"><i class="fas fa-check"></i></button>
          <button class="btn sm dgr" onclick="authAccount('${a.acc}',false)"><i class="fas fa-times"></i></button>
        </div></td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--tx3)">No pending accounts</td></tr>'}
    </tbody></table></div>
    ${formFooter('','','UNAUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function authAccount(acc,ok){applyAuth('ACCOUNT',acc,ok);}

R['m4-acc-status']={render(){
  return `${actionStrip([{label:'Save',onclick:"changeStatus()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDSTCHN</code>'}])}
  <div class="section-band">Manual Status Change (STDSTCHN)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Branch</label><input class="input mono" value="${esc(state.branch.code)}" readonly></div>
          <div class="form-row"><label class="req">Account No</label><input class="input mono" id="scAcc"></div>
        </div>
        <div>
          <div class="form-row"><label class="req">New Status</label>
            <select class="input" id="scNew">
              <option>No Debit</option><option>No Credit</option><option>Frozen</option><option>Posting Allowed</option>
              <option>Dormant</option><option>Debit Override</option><option>Credit Override</option><option>Banc Control</option><option>Active</option>
            </select></div>
          <div class="form-row"><label>Reason</label><input class="input" id="scReason"></div>
        </div>
      </div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function changeStatus(){
  const acc=$('#scAcc').value.trim();
  if(!acc){toast('Enter account','e');return;}
  const a=findAcc(acc);if(!a){toast('Account not found','e');return;}
  if(a.status==='CLOSED'){toast('A closed account cannot be changed','e');return;}
  if(a.authStatus!=='AUTHORIZED'){toast('Account is not authorized yet','e');return;}
  const old=a.status;let ns=$('#scNew').value;if(ns==='Active')ns='ACTIVE';
  a.status=ns;a.statusReason=$('#scReason').value;
  logAudit('STATUS_CHANGE',acc,old+' → '+a.status);
  toast('Status: '+old+' → '+a.status,'s');saveState();
}

R['m4-acc-class']={render(){
  return `${actionStrip([{label:'Save',onclick:"transferClass()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDACTFR</code>'}])}
  <div class="section-band">Account Class Transfer (STDACTFR)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div><div class="form-row"><label class="req">Account Number</label><input class="input mono" id="ctAcc"></div></div>
        <div><div class="form-row"><label class="req">Target Class</label>
          <select class="input" id="ctClass">${ACCOUNT_CLASSES.filter(c=>c.type==='CASA').map(c=>`<option value="${c.code}">${c.code} — ${c.desc}</option>`).join('')}</select></div></div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="transferClass()"><i class="fas fa-exchange-alt"></i> Submit</button></div>
    </div></div>
  </div>`;
},init(){}};
function transferClass(){
  const a=findAcc($('#ctAcc').value.trim());if(!a){toast('Account not found','e');return;}
  const cls=ACCOUNT_CLASSES.find(c=>c.code===$('#ctClass').value);
  if(a.status==='CLOSED'){toast('Account is closed','e');return;}
  if(cls.ccy!==a.currency){toast('Target class currency ('+cls.ccy+') differs from account currency ('+a.currency+')','e');return;}
  if(cls.code===a.classCode){toast('Account is already in this class','w');return;}
  const old=a.classCode;Object.assign(a,{classCode:cls.code,className:cls.name,classDesc:cls.desc});
  logAudit('CLASS_TRANSFER',a.acc,old+' → '+cls.code);saveState();toast('Class changed: '+old+' → '+cls.code,'s');
}

R['m4-acc-branch']={render(){
  const brs=[{code:'000',name:'System Default'},...state.branches];
  return `${actionStrip([{label:'Save',onclick:"transferBranch()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>CSDACCTR</code>'}])}
  <div class="section-band">Account Branch Transfer (CSDACCTR)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div><div class="form-row"><label>Transfer ID</label><input class="input mono" value="${ref('AT')}" readonly></div>
          <div class="form-row"><label class="req">Account Number</label><input class="input mono" id="btrAcc"></div></div>
        <div><div class="form-row"><label class="req">Target Branch</label><select class="input" id="btrBranch">${brs.map(b=>`<option value="${esc(b.code)}">${esc(b.code)} — ${esc(b.name)}</option>`).join('')}</select></div></div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="transferBranch()"><i class="fas fa-exchange-alt"></i> Submit</button></div>
    </div></div>
  </div>`;
},init(){}};
function transferBranch(){
  const a=findAcc($('#btrAcc').value.trim());if(!a){toast('Account not found','e');return;}
  const to=$('#btrBranch').value;
  if(a.status==='CLOSED'){toast('Account is closed','e');return;}
  if(a.branch===to){toast('Account is already in branch '+to,'w');return;}
  const old=a.branch;a.branch=to;logAudit('BRANCH_TRANSFER',a.acc,old+' → '+to);saveState();toast('Branch changed: '+old+' → '+to,'s');
}

R['m4-acc-closure']={render(){
  return `${actionStrip([{label:'Close Account',onclick:"doCloseAcc()",icon:'fas fa-times'},{spacer:true},{info:'Closure'}])}
  <div class="section-band">Account Closure</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">Account Number</label><input class="input mono" id="clAcc"></div>
      <div class="form-row"><label>Closure Mode</label><select class="input" id="clMode"><option>Cash Withdrawal</option><option>Transfer to Account</option><option>Bankers Cheque</option></select></div>
      <div class="form-row"><label>Transfer To Account</label><input class="input mono" id="clTarget" placeholder="Only for Transfer to Account"></div>
      <div style="text-align:right"><button class="btn dgr" onclick="doCloseAcc()"><i class="fas fa-times"></i> Close</button></div>
    </div></div>
  </div>`;
},init(){}};

function doCloseAcc(){
  const acc=$('#clAcc').value.trim();if(!acc){toast('Enter account','e');return;}
  const a=findAcc(acc);if(!a){toast('Account not found','e');return;}
  if(a.status==='CLOSED'){toast('Account is already closed','w');return;}
  if(state.lienBlocks.some(b=>b.account===acc&&b.status==='ACTIVE')){toast('Release active blocks first','e');return;}
  const mode=$('#clMode').value,bal=a.balance;let tgt=null;
  if(bal>0){
    if(mode==='Transfer to Account'){
      tgt=findAcc($('#clTarget').value.trim());
      if(!tgt||tgt.acc===a.acc||tgt.currency!==a.currency){toast('A different target account in the same currency is required','e');return;}
      const b=postingBlock(tgt,'CR');if(b){toast(b,'e');return;}
    }
    if(!confirm('Pay out '+fmtETB(bal)+' ('+mode+') and close '+acc+'?'))return;
    if(tgt)tgt.balance=+(tgt.balance+bal).toFixed(2);
    recTxn({p:'CLS',type:'out',amount:bal,account:a.acc,name:a.name,title:'Account Closure · '+mode});
    if(tgt)recTxn({p:'CLS',type:'in',amount:bal,account:tgt.acc,name:tgt.name,title:'Closure proceeds from '+a.acc});
  }else if(!confirm('Close account '+acc+'?'))return;
  a.balance=0;a.status='CLOSED';a.recordStatus='CLOSED';
  logAudit('CLOSE_ACCOUNT',acc,mode+' · '+fmtETB(bal));toast('Account closed','s');saveState();mount();
}
