/* =====================================================================
   FLEXCUBE Modules 3 - 15 (Customer, Accounts, TD, Lien, Stock, Cheques, CPO)
   ===================================================================== */
R['m3-kyc-new']={render(){
  const newRef=ref('KYC');
  return `${actionStrip([{label:'New',active:true,icon:'fas fa-plus'},{label:'Save',onclick:"saveKYC()",icon:'fas fa-save'},{label:'Clear',onclick:"go('m3-kyc-new')",icon:'fas fa-eraser'},{spacer:true},{info:`Func: <code>STDKYCMN</code>`},{info:`Auth: <code>STSKYCMN</code>`}])}
  <div class="section-band">KYC Maintenance — New <span class="tag" id="kycRefTag">Ref: ${esc(newRef)}</span></div>
  <div class="content-wrap">
    <div class="info-msg"><div class="im-ic">ⓘ</div><div class="im-body"><b>KYC Reference auto-generated</b>
      <div class="im-list"><div><span>Ref No:</span><b>${esc(newRef)}</b></div><div><span>Branch:</span><b>${esc(state.branch.code)}</b></div></div>
    </div></div>
    <div class="panel"><div class="panel-h">Customer KYC Details</div><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Customer Type</label>
            <select class="input" id="kType"><option>Individual</option><option>Corporate</option><option>Bank</option><option>Special Customer</option></select></div>
          <div class="form-row"><label class="req">Full Name</label><input class="input" id="kName"></div>
          <div class="form-row"><label>Short Name</label><input class="input" id="kShort"></div>
          <div class="form-row"><label class="req">Category</label>
            <select class="input" id="kCat"><option>Individual</option><option>Association</option><option>PLC</option><option>Minor</option></select></div>
        </div>
        <div>
          <div class="form-row"><label>Branch Code</label><input class="input mono" value="${esc(state.branch.code)}" readonly></div>
          <div class="form-row"><label class="req">ID Type</label><select class="input" id="kIdType">${ID_TYPES.map(t=>`<option>${t}</option>`).join('')}</select></div>
          <div class="form-row"><label class="req">ID Number</label><input class="input mono" id="kIdNo"></div>
          <div class="form-row"><label>Date of Birth</label><input class="input" type="date" id="kDob"></div>
        </div>
      </div>
      <div class="form-section-title">Contact Information</div>
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Mobile</label><input class="input mono" id="kMobile"></div>
          <div class="form-row"><label>Email</label><input class="input" id="kEmail" type="email"></div>
        </div>
        <div>
          <div class="form-row"><label>Address</label><input class="input" id="kAddress"></div>
          <div class="form-row"><label>City</label><input class="input" id="kCity"></div>
        </div>
      </div>
      <div class="form-section-title">Fayda National ID Integration</div>
      <div class="fayda-card">
        <div class="fayda-h"><div class="fayda-logo">F</div><div><h4>Fayda National ID</h4></div><span class="fayda-status">LIVE</span></div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input class="input mono" id="kFayda" placeholder="Fayda ID" style="flex:1;min-width:200px">
          <button class="btn pri" onclick="verifyFayda()"><i class="fas fa-id-card"></i> Verify</button>
        </div>
        <div id="faydaResult" style="margin-top:8px"></div>
      </div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function verifyFayda(){
  const id=$('#kFayda').value.replace(/\s/g,'');
  if(!/^(\d{12}|\d{16})$/.test(id)){toast('Fayda FIN/FAN must be 12 or 16 digits','e');return;}
  toast('Contacting Fayda verification service...','i');
  setTimeout(()=>{
    state.ui.faydaChecked=id;
    $('#faydaResult').innerHTML=`<div class="alert i"><span class="al-ic">🆔</span><div class="al-body"><b>Fayda Number Validated:</b> Format check passed for <span class="mono">${esc(id)}</span>.<br>To perform live biometric/OTP verification, access the official portal: <a href="https://id.et/authentication" target="_blank" rel="noopener" class="btn sm pri" style="margin-top:6px;display:inline-flex;align-items:center;gap:4px;text-decoration:none"><i class="fas fa-external-link-alt"></i> Official Fayda Authentication (id.et)</a></div></div>`;
    logAudit('FAYDA_FORMAT_CHECK','KYC',id);
  },400);
}

function saveKYC(){
  const refNo=$('#kycRefTag').textContent.replace('Ref: ','');
  const name=$('#kName').value.trim(),idNo=$('#kIdNo').value.trim(),idType=$('#kIdType').value;
  const dob=$('#kDob').value,mobile=$('#kMobile').value.replace(/[\s-]/g,''),email=$('#kEmail').value.trim(),fid=$('#kFayda').value.replace(/\s/g,'');
  if(!name){toast('Full Name required','e');return;}
  if(!idNo){toast('ID Number required','e');return;}
  if(state.kycRecords.some(k=>k.idType===idType&&k.idNo.toUpperCase()===idNo.toUpperCase())){toast('A KYC record with this ID already exists','e');return;}
  if(dob&&dob>today()){toast('Date of birth cannot be in the future','e');return;}
  if(mobile&&!/^(\+251|251|0)?[79]\d{8}$/.test(mobile)){toast('Invalid Ethiopian mobile number','e');return;}
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Invalid email address','e');return;}
  if(fid&&!/^(\d{12}|\d{16})$/.test(fid)){toast('Fayda ID must be 12 or 16 digits','e');return;}
  const kyc={refNo,type:$('#kType').value,name,short:$('#kShort').value,category:$('#kCat').value,
    branch:state.branch.code,idType,idNo,dob,mobile,email,address:$('#kAddress').value,city:$('#kCity').value,
    faydaId:fid,faydaVerified:!!fid&&state.ui.faydaChecked===fid,authStatus:'UNAUTHORIZED',recordStatus:'PENDING_AUTHORIZATION',
    maker:state.user.id,makerName:state.user.name,createdAt:nowISO()};
  state.kycRecords.push(kyc);submitForApproval('KYC',refNo,'KYC for '+name);
  logAudit('CREATE_KYC',refNo,'KYC for '+name);
  toast('KYC saved: '+refNo,'s');go('m3-kyc-list');
}

R['m3-kyc-list']={render(){
  return `${actionStrip([{label:'New',onclick:"go('m3-kyc-new')",icon:'fas fa-plus'},{label:'Enter Query',onclick:"toast('Browse KYC','i')",icon:'fas fa-search'},{spacer:true},{info:'Func: <code>STDKYCMN</code>'}])}
  <div class="section-band">KYC Records <span class="tag">${state.kycRecords.length} records</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>KYC Ref</th><th>Type</th><th>Full Name</th><th>ID Type</th><th>Fayda</th><th>Auth</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${state.kycRecords.length?state.kycRecords.map(k=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(k.refNo)}</td><td>${esc(k.type)}</td><td>${esc(k.name)}</td>
        <td>${esc(k.idType)}</td><td>${k.faydaId?`<span class="bdg ${k.faydaVerified?'ok':'wn'}">${k.faydaVerified?'format ok':'unchecked'}</span>`:'<span class="bdg mu">—</span>'}</td>
        <td>${bdg(k.authStatus)}</td>
        <td style="text-align:right"><button class="btn sm" onclick="viewKYC('${k.refNo}')"><i class="fas fa-eye"></i></button></td>
      </tr>`).join(''):'<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--tx3)">No KYC records</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function viewKYC(refNo){
  const k=findKyc(refNo);if(!k)return;
  openModal('KYC — '+esc(refNo),
    `<div class="kv-grid">
      <dt>Ref No</dt><dd class="mono">${esc(k.refNo)}</dd>
      <dt>Full Name</dt><dd>${esc(k.name)}</dd>
      <dt>Type</dt><dd>${esc(k.type)}</dd>
      <dt>ID</dt><dd>${esc(k.idType)} ${esc(k.idNo)}</dd>
      <dt>Mobile</dt><dd>${esc(k.mobile||'—')}</dd>
      <dt>Fayda</dt><dd>${k.faydaId?`<span class="bdg ok">${esc(k.faydaId)}</span>`:'—'}</dd>
      <dt>Auth</dt><dd>${bdg(k.authStatus)}</dd>
      <dt>Maker</dt><dd>${esc(k.makerName||k.maker)}</dd>
      <dt>Created</dt><dd>${dtstr(k.createdAt)}</dd>
    </div>`,
    `<button class="btn exit" onclick="closeModal()"><i class="fas fa-sign-out-alt"></i> Exit</button>`);
}

R['m3-kyc-auth']={render(){
  const pending=state.kycRecords.filter(k=>k.authStatus==='UNAUTHORIZED');
  return `${actionStrip([{label:'Authorize',onclick:"toast('Use the ✓ / ✗ buttons on each row to authorize or reject','i')",icon:'fas fa-check'},{spacer:true},{info:'Func: <code>STSKYCMN</code>'}])}
  <div class="section-band">KYC Authorization <span class="tag">${pending.length} pending</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>KYC Ref</th><th>Name</th><th>Type</th><th>Maker</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${pending.length?pending.map(k=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(k.refNo)}</td><td>${esc(k.name)}</td><td>${esc(k.type)}</td><td>${esc(k.makerName||k.maker)}</td>
        <td style="text-align:right"><div class="grid-actions">
          <button class="btn sm ok" onclick="authKYC('${k.refNo}',true)"><i class="fas fa-check"></i></button>
          <button class="btn sm dgr" onclick="authKYC('${k.refNo}',false)"><i class="fas fa-times"></i></button>
        </div></td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--tx3)">No pending KYC</td></tr>'}
    </tbody></table></div>
    ${formFooter('','','UNAUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function authKYC(refNo,ok){applyAuth('KYC',refNo,ok);}

R['m3-cust-list']={render(){
  return `${actionStrip([{label:'New',onclick:"go('m3-cust-new')",icon:'fas fa-plus'},{label:'360° View',onclick:"go('m11-c360')",icon:'fas fa-eye'},{spacer:true},{info:'Func: <code>STDCIF</code>'}])}
  <div class="section-band">Customer Information File (CIF) <span class="tag">${state.customers.length} records</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Customer No</th><th>Full Name</th><th>Type</th><th>KYC Ref</th><th>Auth</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${state.customers.length?state.customers.map(c=>`<tr class="clickable" onclick="state.ui.lastCust='${c.cif}';go('m11-c360')">
        <td class="chk"><input type="checkbox" onclick="event.stopPropagation()"></td>
        <td class="mono">${esc(c.cif)}</td><td>${esc(c.fullName)}</td><td>${esc(c.type)}</td>
        <td class="mono">${esc(c.kycRef||'—')}</td><td>${bdg(c.authStatus)}</td>
        <td style="text-align:right"><button class="btn sm" onclick="event.stopPropagation();state.ui.lastCust='${c.cif}';go('m11-c360')"><i class="fas fa-eye"></i></button></td>
      </tr>`).join(''):'<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--tx3)">No customers</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

R['m3-cust-new']={render(){
  const kycOpts=state.kycRecords.filter(k=>k.authStatus==='AUTHORIZED'&&!state.customers.some(c=>c.kycRef===k.refNo)).map(k=>`<option value="${k.refNo}">${esc(k.refNo)} — ${esc(k.name)}</option>`).join('');
  const cif=genCustomerNo();
  return `${actionStrip([{label:'New',active:true,icon:'fas fa-plus'},{label:'Save',onclick:"createNewCustomer()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDCIF</code>'}])}
  <div class="section-band">Customer Information File (CIF) — New <span class="tag">STDCIF</span></div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-h">Customer Details</div><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Customer Type</label>
            <select class="input" id="ncType"><option>Individual</option><option>Corporate</option><option>Bank</option><option>Special Customer</option></select></div>
          <div class="form-row"><label class="req">Customer No</label>
            <div style="display:flex;gap:4px"><input class="input mono" id="ncCif" value="${cif}" readonly style="flex:1"><button class="p-btn">P</button></div></div>
          <div class="form-row"><label class="req">Full Name</label><input class="input" id="ncName"></div>
          <div class="form-row"><label>Short Name</label><input class="input" id="ncShort"></div>
          <div class="form-row"><label class="req">Category</label>
            <select class="input" id="ncCat"><option>Individual</option><option>Association</option><option>PLC</option><option>Minor</option></select></div>
        </div>
        <div>
          <div class="form-row"><label>Branch Code</label><input class="input mono" value="${esc(state.branch.code)}" readonly></div>
          <div class="form-row"><label>KYC Reference</label><select class="input" id="ncKyc">${kycOpts||'<option value="">No authorized KYC</option>'}</select></div>
          <div class="form-row"><label class="req">Mobile</label><input class="input mono" id="ncMobile"></div>
          <div class="form-row"><label>Email</label><input class="input" id="ncEmail"></div>
          <div class="form-row"><label>National ID</label><input class="input mono" id="ncNid"></div>
        </div>
      </div>
      <div class="tab-strip">
        <div class="tab-item active" onclick="switchTab(this,'nc-personal')">Personal</div>
        <div class="tab-item" onclick="switchTab(this,'nc-corp')">Corporate</div>
        <div class="tab-item" onclick="switchTab(this,'nc-add')">Additional</div>
        <div class="tab-item" onclick="switchTab(this,'nc-chk')">Check List</div>
      </div>
      <div class="tab-panel active" id="nc-personal">
        <div class="form-2col">
          <div>
            <div class="form-row"><label>First Name</label><input class="input"></div>
            <div class="form-row"><label>Last Name</label><input class="input"></div>
            <div class="form-row"><label>Gender</label><select class="input"><option>Male</option><option>Female</option></select></div>
          </div>
          <div>
            <div class="form-row"><label>Date of Birth</label><input class="input" type="date"></div>
            <div class="form-row"><label>Nationality</label><input class="input" value="Ethiopian"></div>
            <div class="form-row"><label>Preferred Contact</label><select class="input"><option>Mobile</option><option>Email</option></select></div>
          </div>
        </div>
      </div>
      <div class="tab-panel" id="nc-corp">
        <div class="form-2col">
          <div><div class="form-row"><label>Trade License No</label><input class="input mono"></div></div>
          <div><div class="form-row"><label>TIN Number</label><input class="input mono"></div></div>
        </div>
      </div>
      <div class="tab-panel" id="nc-add">
        <div class="form-2col">
          <div><div class="form-row"><label>Staff</label><select class="input"><option>No</option><option>Yes</option></select></div></div>
          <div><div class="form-row"><label>KYC Status</label><select class="input"><option>Yet To Verify</option><option>Verified</option></select></div></div>
        </div>
      </div>
      <div class="tab-panel" id="nc-chk">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:6px;padding:8px 0">
          ${['ID Document','Proof of Address','Photo','Signature'].map(d=>`<label style="display:flex;gap:6px;align-items:center;font-size:11px;padding:4px 8px;background:var(--bg-ro);border:1px solid var(--bd-3);cursor:pointer"><input type="checkbox"> ${d}</label>`).join('')}
        </div>
      </div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function createNewCustomer(){
  const cif=$('#ncCif').value,kycRef=$('#ncKyc').value,k=findKyc(kycRef);
  if(!k){toast('An authorized KYC record is required before creating a CIF','e');return;}
  if(state.customers.some(c=>c.kycRef===kycRef)){toast('This KYC is already linked to a customer','e');return;}
  const name=$('#ncName').value.trim()||k.name,mobile=($('#ncMobile').value||k.mobile||'').replace(/[\s-]/g,''),email=$('#ncEmail').value.trim();
  if(!name){toast('Full Name required','e');return;}
  if(!/^(\+251|251|0)?[79]\d{8}$/.test(mobile)){toast('A valid Ethiopian mobile number is required','e');return;}
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Invalid email address','e');return;}
  if(state.customers.some(c=>c.cif===cif)){toast('Customer number already in use — reopen the form','e');return;}
  const c={cif,fullName:name,shortName:$('#ncShort').value||'',type:$('#ncType').value,category:$('#ncCat').value,
    branch:state.branch.code,kycRef,mobile,email,
    status:'DRAFT',authStatus:'UNAUTHORIZED',recordStatus:'PENDING_AUTHORIZATION',
    maker:state.user.id,makerName:state.user.name,createdAt:nowISO()};
  state.customers.push(c);submitForApproval('CUSTOMER',cif,'New customer '+name);
  logAudit('CREATE_CUSTOMER',cif,'New customer '+name);
  toast('Customer created: '+cif,'s');go('m3-cust-list');
}

R['m3-cust-auth']={render(){
  const pending=state.customers.filter(c=>c.authStatus==='UNAUTHORIZED');
  return `${actionStrip([{label:'Authorize',onclick:"toast('Use the ✓ / ✗ buttons on each row to authorize or reject','i')",icon:'fas fa-check'},{spacer:true},{info:'Func: <code>STSCIF</code>'}])}
  <div class="section-band">CIF Authorization <span class="tag">${pending.length} pending</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>CIF</th><th>Name</th><th>Type</th><th>Maker</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${pending.length?pending.map(c=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(c.cif)}</td><td>${esc(c.fullName)}</td><td>${esc(c.type)}</td><td>${esc(c.makerName||c.maker)}</td>
        <td style="text-align:right"><div class="grid-actions">
          <button class="btn sm ok" onclick="authCustomer('${c.cif}',true)"><i class="fas fa-check"></i></button>
          <button class="btn sm dgr" onclick="authCustomer('${c.cif}',false)"><i class="fas fa-times"></i></button>
        </div></td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--tx3)">No pending CIF</td></tr>'}
    </tbody></table></div>
    ${formFooter('','','UNAUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function authCustomer(cif,ok){applyAuth('CUSTOMER',cif,ok);}

R['m3-joint']={render(){
  return `${actionStrip([{label:'New',onclick:"toast('Add joint holder','i')",icon:'fas fa-plus'},{spacer:true},{info:'Func: <code>STDJHMN</code>'}])}
  <div class="section-band">Joint Holder Maintenance</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-h">Add Joint Holder</div><div class="panel-b">
      <div class="form-2col">
        <div><div class="form-row"><label class="req">Account Number</label><input class="input mono" id="jhAcc"></div></div>
        <div><div class="form-row"><label class="req">Customer CIF</label><input class="input mono" id="jhCif"></div></div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="addJointHolder()"><i class="fas fa-plus"></i> Add</button></div>
    </div></div>
    <div class="panel"><div class="panel-h">Joint Holder Summary</div><div class="panel-b flush">
      <div class="tbl-wrap" style="border:0"><table class="oracle-tbl"><thead><tr>
        <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th><th>Account</th><th>CIF</th><th>Name</th><th>Type</th><th>Start</th>
      </tr></thead><tbody>
        ${state.accounts.filter(a=>a.jointHolders?.length).map(a=>a.jointHolders.map(j=>`<tr>
          <td class="chk"><input type="checkbox"></td>
          <td class="mono">${esc(a.acc)}</td><td class="mono">${esc(j.cif)}</td><td>${esc(j.name)}</td><td>${esc(j.type)}</td><td>${esc(j.start)}</td>
        </tr>`).join('')).join('')||'<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--tx3)">No joint holders</td></tr>'}
      </tbody></table></div>
    </div></div>
  </div>`;
},init(){}};

function addJointHolder(){
  const accNo=$('#jhAcc').value.trim(),cif=$('#jhCif').value.trim();
  if(!accNo||!cif){toast('Account and CIF required','e');return;}
  const acc=findAcc(accNo),cust=findCust(cif);
  if(!acc||!cust){toast('Account or customer not found','e');return;}
  if(cust.authStatus!=='AUTHORIZED'){toast('Customer must be authorized','e');return;}
  if(acc.cif===cust.cif||(acc.jointHolders||[]).some(j=>j.cif===cust.cif)){toast('Customer is already a holder of this account','e');return;}
  acc.jointHolders=acc.jointHolders||[];
  acc.jointHolders.push({cif:cust.cif,name:cust.fullName,type:'Joint',start:today()});
  logAudit('ADD_JOINT_HOLDER',accNo,cif);saveState();toast('Added','s');mount();
}

R['m3-legacy']={render(){
  return `${actionStrip([{label:'Execute Query',onclick:"legacyLookup()",icon:'fas fa-search'},{spacer:true},{info:'Func: <code>STDACMAP</code>'}])}
  <div class="section-band">Legacy Mapping (STDACMAP)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label>Legacy CIF / Account</label><input class="input mono" id="legacyInput" placeholder="Enter old number"></div>
      <div style="text-align:right"><button class="btn pri" onclick="legacyLookup()">Execute Query</button></div>
      <div id="legacyResult" style="margin-top:12px"></div>
    </div></div>
  </div>`;
},init(){}};

function legacyLookup(){
  const v=$('#legacyInput').value.trim();
  if(!v){toast('Enter legacy number','e');return;}
  $('#legacyResult').innerHTML=`<div class="alert i"><span class="al-ic">ℹ</span><div class="al-body"><b>Mapping Result (simulated — no legacy table loaded)</b>Legacy: <span class="mono">${esc(v)}</span> → FLEXCUBE: <span class="mono">CIF-${Math.floor(100000+Math.random()*899999)}</span></div></div>`;
  logAudit('LEGACY_MAP',v);
}

R['m3-fayda']={render(){
  return `${actionStrip([{label:'Fayda Verification',active:true,icon:'fas fa-id-card'}])}
  <div class="section-band">Fayda National ID Verification <span class="tag">NIDP Ethiopia</span></div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">🆔</span><div class="al-body"><b>Official Fayda Authentication Portal:</b> <a href="https://id.et/authentication" target="_blank" rel="noopener" style="color:var(--link);font-weight:bold"><span class="mono">https://id.et/authentication</span> <i class="fas fa-external-link-alt"></i></a> · Resident Portal: <a href="https://id.et/portal" target="_blank" rel="noopener" style="color:var(--link);font-weight:bold"><span class="mono">https://id.et/portal</span> <i class="fas fa-external-link-alt"></i></a></div></div>
    <div class="fayda-card" style="padding:24px;max-width:680px;margin:0 auto">
      <div class="fayda-h" style="justify-content:center;border:0"><div class="fayda-logo" style="width:60px;height:60px;font-size:26px">F</div></div>
      <h3 style="text-align:center;color:#075985;margin-bottom:4px;font-size:16px">Fayda eKYC &amp; National Identity Verification</h3>
      <p style="text-align:center;color:var(--tx3);font-size:11px;margin-bottom:16px">Direct interface to Ethiopia's National ID Program (NIDP) authentication ecosystem</p>
      
      <div style="background:#fff;border:1px solid #7DD3FC;border-radius:4px;padding:16px;margin-bottom:16px">
        <div class="form-row"><label>Fayda ID (FIN / FAN)</label><input class="input mono" id="faydaFullId" placeholder="e.g. 123456789012 (12 or 16 digits)"></div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
          <button class="btn pri" onclick="verifyFaydaFull()"><i class="fas fa-shield-alt"></i> Validate Format</button>
          <a class="btn pri" href="https://id.et/authentication" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none"><i class="fas fa-external-link-alt"></i> Open Real Fayda Auth Portal</a>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:12px">
        <a class="btn sec" href="https://id.et/authentication" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none">
          <i class="fas fa-key"></i> id.et/authentication
        </a>
        <a class="btn sec" href="https://id.et/portal" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none">
          <i class="fas fa-user-circle"></i> id.et/portal (Resident)
        </a>
        <a class="btn sec" href="https://id.gov.et" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none">
          <i class="fas fa-landmark"></i> id.gov.et (NIDP Official)
        </a>
      </div>

      <div id="faydaFullResult" style="margin-top:16px"></div>
    </div>
  </div>`;
},init(){}};

function verifyFaydaFull(){
  const id=$('#faydaFullId').value.replace(/\s/g,'');
  if(!/^(\d{12}|\d{16})$/.test(id)){toast('Fayda FIN/FAN must be 12 or 16 digits','e');return;}
  toast('Verifying Fayda ID format...','i');
  setTimeout(()=>{
    $('#faydaFullResult').innerHTML=`<div class="alert i"><span class="al-ic">✅</span><div class="al-body"><b>Fayda FIN/FAN Format Validated:</b> <span class="mono">${esc(id)}</span> matches official NIDP standards.<br>To perform live digital identity verification (OTP / Biometrics / QR), authenticate on the official portal:<br><a href="https://id.et/authentication" target="_blank" rel="noopener" class="btn pri sm" style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;text-decoration:none"><i class="fas fa-external-link-alt"></i> Launch Fayda Authentication (id.et/authentication)</a></div></div>`;
    logAudit('FAYDA_FORMAT_CHECK','FAYDA',id);
  },400);
}

R['m3-aml']={render(){
  return `${actionStrip([{label:'AML Screening',active:true,icon:'fas fa-search'}])}
  <div class="section-band">AML / CFT Screening</div>
  <div class="content-wrap">
    <div class="alert w"><span class="al-ic">🔍</span><div class="al-body"><b>AML Engine</b>Screen against OFAC, UN, EU &amp; PEP databases.</div></div>
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label>Name / CIF</label><input class="input" id="amlQuery"></div>
      <button class="btn pri" onclick="runAML()"><i class="fas fa-search"></i> Screen</button>
      <div id="amlResult" style="margin-top:12px"></div>
    </div></div>
  </div>`;
},init(){}};

function runAML(){
  const q=$('#amlQuery').value.trim();
  if(!q){toast('Enter name or CIF','e');return;}
  toast('Running demo screening...','i');
  setTimeout(()=>{
    $('#amlResult').innerHTML=`<div class="alert w"><span class="al-ic">⚠</span><div class="al-body"><b>DEMO RESULT</b>No screening provider is connected. This is NOT a compliance clearance.</div></div>
      <div style="font-size:10.5px;color:var(--tx3)">OFAC · UN · EU · UK HMT · PEP · Interpol · FinCEN · Ethiopia FIC</div>`;
    logAudit('AML_SCREEN','COMPLIANCE',q);toast('AML demo only — no live watchlists connected','w');
  },800);
}
