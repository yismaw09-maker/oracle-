/* =====================================================================
   FLEXCUBE Modules Part 3 (TD, Lien, Journal, Transfer, SI, Stock, CPO, Teller)
   ===================================================================== */
R['m5-signature']={render(){
  return `${actionStrip([{label:'New',active:true,icon:'fas fa-plus'},{label:'Save',onclick:"saveSignature()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDCIFIS</code>'}])}
  <div class="section-band">Digital Signature Capture</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Customer CIF</label><input class="input mono" id="sigCif"></div>
          <div class="form-row"><label>Title</label><input class="input" placeholder="Authorized Signatory"></div>
        </div>
        <div>
          <div class="form-row"><label>Replicate to Account</label><select class="input"><option>No</option><option>Yes</option></select></div>
        </div>
      </div>
      <div style="margin-top:10px">
        <label style="font-size:11px;font-weight:bold;display:block;margin-bottom:5px">Draw Signature</label>
        <div class="signature-box"><canvas id="sigCanvas" width="600" height="120"></canvas><button class="clear-sig" onclick="clearSig()">Clear</button></div>
      </div>
      <div style="text-align:right;margin-top:10px"><button class="btn pri" onclick="saveSignature()"><i class="fas fa-save"></i> Save</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){setTimeout(initSigPad,100);}};

function initSigPad(){
  const c=$('#sigCanvas');if(!c)return;
  const ctx=c.getContext('2d');ctx.strokeStyle='#1A1A1A';ctx.lineWidth=2;ctx.lineCap='round';
  let d=false;
  c.onmousedown=e=>{d=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY);};
  c.onmousemove=e=>{if(!d)return;ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke();};
  c.onmouseup=()=>d=false;c.onmouseleave=()=>d=false;
}
function clearSig(){const c=$('#sigCanvas');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);}
function saveSignature(){
  const cif=$('#sigCif').value.trim();
  if(!cif){toast('CIF required','e');return;}
  state.signatures.push({cif,capturedAt:nowISO()});
  logAudit('SAVE_SIGNATURE',cif);toast('Signature saved','s');
}

R['m5-biometric']={render(){
  return `${actionStrip([{label:'Scan & Save',onclick:"captureBio()",icon:'fas fa-fingerprint'},{spacer:true},{info:'Func: <code>STDBIOCP</code>'}])}
  <div class="section-band">Biometric Capture</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">Customer CIF</label><input class="input mono" id="bioCif"></div>
      <div class="form-row"><label>Finger</label><select class="input" id="bioFinger">
        <option>Right Thumb</option><option>Right Index</option><option>Right Middle</option>
        <option>Left Thumb</option><option>Left Index</option><option>Left Middle</option>
      </select></div>
      <div style="text-align:center;padding:24px;background:var(--bg-ro);border:2px dashed var(--bd-2);margin:10px 0">
        <div style="font-size:48px;color:var(--oracle-red);margin-bottom:8px">👆</div>
        <b>Place finger on scanner</b>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="captureBio()"><i class="fas fa-fingerprint"></i> Scan &amp; Save</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function captureBio(){
  const cif=$('#bioCif').value.trim();
  if(!cif){toast('CIF required','e');return;}
  toast('Scanning...','i');
  setTimeout(()=>{state.biometrics.push({cif,finger:$('#bioFinger').value,capturedAt:nowISO()});logAudit('CAPTURE_BIOMETRIC',cif);toast('Captured','s');},1000);
}

R['m6-td-list']={render(){
  return `${actionStrip([{label:'New TD',onclick:"go('m6-td-new')",icon:'fas fa-plus'},{label:'Simulate',onclick:"go('m6-td-sim')",icon:'fas fa-calculator'},{spacer:true},{info:'Func: <code>STDCUSTD</code>'}])}
  <div class="section-band">Term Deposits <span class="tag">${state.tdAccounts.length} TDs</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>TD Account</th><th>Customer</th><th>Class</th><th style="text-align:right">Principal</th><th>Tenor</th><th>Rate</th><th>Maturity</th><th>Status</th>
    </tr></thead><tbody>
      ${state.tdAccounts.length?state.tdAccounts.map(t=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(t.tdAcc)}</td><td>${esc(t.customerName)}</td><td>${esc(t.className)}</td>
        <td class="mono" style="text-align:right">${fmtETB(t.principal)}</td>
        <td>${t.tenor} ${t.tenorUnit}</td><td>${t.rate}%</td><td>${esc(t.maturityDate)}</td><td>${bdg(t.status)}</td>
      </tr>`).join(''):'<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--tx3)">No TDs</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

R['m6-td-new']={render(){
  return `${actionStrip([{label:'New',active:true,icon:'fas fa-plus'},{label:'Save',onclick:"bookTD()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDCUSTD</code>'}])}
  <div class="section-band">TD Booking (STDCUSTD)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">TD Account No</label>
            <div style="display:flex;gap:4px"><input class="input mono" id="tdAcc" value="${genAccountNo()}" readonly style="flex:1"><button class="p-btn">P</button></div></div>
          <div class="form-row"><label class="req">Currency</label><select class="input" id="tdCcy">${CURRENCIES.map(c=>`<option>${c.c}</option>`).join('')}</select></div>
          <div class="form-row"><label class="req">Customer No</label><input class="input mono" id="tdCif"></div>
          <div class="form-row"><label class="req">Account Class</label><select class="input" id="tdClass">
            ${ACCOUNT_CLASSES.filter(c=>c.type==='TD').map(c=>`<option value="${c.code}">${c.code} — ${c.desc}</option>`).join('')}
          </select></div>
        </div>
        <div>
          <div class="form-row"><label class="req">Principal</label><input class="input mono" id="tdPrincipal" type="number" value="100000"></div>
          <div class="form-row"><label class="req">Tenor</label>
            <div style="display:flex;gap:4px"><input class="input mono" id="tdTenor" type="number" value="12" style="flex:1"><select class="input" id="tdTenorUnit" style="flex:0 0 100px"><option>Months</option><option>Days</option><option>Years</option></select></div>
          </div>
          <div class="form-row"><label class="req">Interest Rate</label><input class="input mono" id="tdRate" type="number" step="0.01" value="8.5"></div>
          <div class="form-row"><label>Interest Payment</label><select class="input" id="tdIntPay"><option>Maturity (ADFD)</option><option>Monthly (MONT)</option></select></div>
        </div>
      </div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function bookTD(){
  const cif=$('#tdCif').value.trim();const cust=findCust(cif);
  if(!cust){toast('Customer not found','e');return;}
  if(cust.authStatus!=='AUTHORIZED'){toast('Customer must be authorized','e');return;}
  const principal=validAmt($('#tdPrincipal').value),tenor=Math.floor(num($('#tdTenor').value)),rate=num($('#tdRate').value);
  if(!principal||tenor<=0){toast('Positive principal and tenor required','e');return;}
  if(rate<=0||rate>100){toast('Interest rate must be between 0 and 100','e');return;}
  const cls=ACCOUNT_CLASSES.find(c=>c.code===$('#tdClass').value);
  if(cls.ccy!==$('#tdCcy').value){toast('Class '+cls.code+' requires currency '+cls.ccy,'e');return;}
  const unit=$('#tdTenorUnit').value;let mat=new Date(state.businessDate+'T00:00:00');
  if(unit==='Months')mat=addMonths(mat,tenor);else if(unit==='Years')mat=addMonths(mat,tenor*12);else mat.setDate(mat.getDate()+tenor);
  const td={tdAcc:$('#tdAcc').value,cif,name:cust.fullName,customerName:cust.fullName,
    currency:$('#tdCcy').value,classCode:cls.code,className:cls.name,classDesc:cls.desc,
    principal,tenor,tenorUnit:unit,rate,interestPay:$('#tdIntPay').value,
    startDate:today(),maturityDate:dstr(mat),status:'PENDING_AUTHORIZATION',authStatus:'UNAUTHORIZED',recordStatus:'PENDING_AUTHORIZATION',
    maker:state.user.id,makerName:state.user.name,createdAt:nowISO()};
  state.tdAccounts.push(td);submitForApproval('TD',td.tdAcc,'TD for '+cust.fullName,principal,td.currency);
  logAudit('BOOK_TD',td.tdAcc,fmtETB(principal));
  toast('TD booked (pending authorization): '+td.tdAcc,'s');go('m6-td-list');
}

R['m6-td-sim']={render(){
  return `${actionStrip([{label:'Compute',onclick:"simTD()",icon:'fas fa-calculator'},{label:'Create Deposit',onclick:"go('m6-td-new')",icon:'fas fa-plus'},{spacer:true},{info:'Func: <code>STDTDSIM</code>'}])}
  <div class="section-band">TD Simulation (STDTDSIM)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Currency</label><select class="input">${CURRENCIES.map(c=>`<option>${c.c}</option>`).join('')}</select></div>
          <div class="form-row"><label>Principal</label><input class="input mono" id="simPrincipal" type="number" value="100000"></div>
        </div>
        <div>
          <div class="form-row"><label>Tenor</label><input class="input mono" id="simTenor" type="number" value="12"></div>
          <div class="form-row"><label>Rate (%)</label><input class="input mono" id="simRate" type="number" step="0.01" value="8.5"></div>
        </div>
      </div>
      <div style="text-align:center;margin:14px 0"><button class="btn pri" onclick="simTD()"><i class="fas fa-calculator"></i> Compute</button></div>
      <div id="simResult"></div>
    </div>
    ${formFooter(state.user.name,'','—','—')}
    </div>
  </div>`;
},init(){}};

function simTD(){
  const p=num($('#simPrincipal').value),t=num($('#simTenor').value),r=num($('#simRate').value);
  if(!p||!t||!r){toast('Fill all fields','e');return;}
  const years=t/12,gross=p*(r/100)*years,tax=gross*0.15,net=gross-tax,mat=p+net;
  $('#simResult').innerHTML=`
    <div class="alert s"><span class="al-ic">✓</span><div class="al-body"><b>Simulation Result</b>Based on ${fmtETB(p)} for ${t} months at ${r}%</div></div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-l">Principal</div><div class="kpi-v" style="font-size:13px">${fmtETB(p)}</div></div>
      <div class="kpi k-green"><div class="kpi-l">Gross Interest</div><div class="kpi-v" style="font-size:13px">${fmtETB(gross)}</div></div>
      <div class="kpi k-amber"><div class="kpi-l">Tax (15%)</div><div class="kpi-v" style="font-size:13px">${fmtETB(tax)}</div></div>
      <div class="kpi k-purple"><div class="kpi-l">Net Interest</div><div class="kpi-v" style="font-size:13px">${fmtETB(net)}</div></div>
      <div class="kpi k-red"><div class="kpi-l">Maturity</div><div class="kpi-v" style="font-size:13px">${fmtETB(mat)}</div></div>
    </div>
    <div style="text-align:center;margin-top:12px"><button class="btn pri" onclick="go('m6-td-new')">Create Deposit</button></div>`;
}

R['m6-td-topup']={render(){
  return `${actionStrip([{label:'Save',onclick:"topUpTD()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>STDTDTOP</code>'}])}
  <div class="section-band">TD Top-up (STDTDTOP)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">TD Account Number</label><input class="input mono" id="topTdAcc"></div>
      <div class="form-row"><label class="req">Top-up Amount</label><input class="input mono" id="topAmount" type="number"></div>
      <div style="text-align:right"><button class="btn pri" onclick="topUpTD()"><i class="fas fa-arrow-up"></i> Top-up</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function topUpTD(){
  const acc=$('#topTdAcc').value.trim();const td=findTd(acc);
  if(!td){toast('TD not found','e');return;}
  if(td.status!=='ACTIVE'){toast('Only ACTIVE term deposits can be topped up','e');return;}
  const amt=validAmt($('#topAmount').value);
  if(!amt){toast('Enter a positive amount','e');return;}
  td.principal=+(td.principal+amt).toFixed(2);logAudit('TD_TOPUP',acc,'+'+fmtETB(amt));toast('Topped up','s');saveState();
}

R['m6-td-redeem']={render(){
  return `${actionStrip([{label:'Redeem',onclick:"redeemTD()",icon:'fas fa-hand-holding-usd'},{spacer:true},{info:'Func: <code>ICDREDMN</code>'}])}
  <div class="section-band">TD Redemption (ICDREDMN)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">TD Account Number</label><input class="input mono" id="rdTdAcc"></div>
      <div class="form-row"><label>Mode</label><select class="input" id="rdMode"><option>Full</option><option>Partial</option></select></div>
      <div class="form-row"><label>Amount</label><input class="input mono" id="rdAmount" type="number"></div>
      <div style="text-align:right"><button class="btn pri" onclick="redeemTD()"><i class="fas fa-money-bill"></i> Redeem</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function redeemTD(){
  const acc=$('#rdTdAcc').value.trim();const td=findTd(acc);
  if(!td){toast('TD not found','e');return;}
  if(td.status!=='ACTIVE'){toast('Only ACTIVE term deposits can be redeemed','e');return;}
  if($('#rdMode').value==='Full'){
    if(!confirm('Fully redeem '+fmtETB(td.principal)+'?'))return;
    td.redeemed=(td.redeemed||0)+td.principal;td.principal=0;td.status='CLOSED';logAudit('TD_REDEEM_FULL',acc);toast('Fully redeemed','s');
  }else{
    const amt=validAmt($('#rdAmount').value);
    if(!amt){toast('Enter a positive amount','e');return;}
    if(amt>=td.principal){toast('Partial amount must be less than principal — use Full','e');return;}
    td.redeemed=(td.redeemed||0)+amt;td.principal=+(td.principal-amt).toFixed(2);logAudit('TD_REDEEM_PARTIAL',acc,fmtETB(amt));toast('Partially redeemed','s');
  }
  saveState();
}

R['m6-td-cert']={render(){
  return `${actionStrip([{label:'Generate Certificate',onclick:"genCert()",icon:'fas fa-certificate'},{spacer:true},{info:'Func: <code>ICDBADHC</code>'}])}
  <div class="section-band">TD Certificate (ICDBADHC)</div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">📜</span><div class="al-body"><b>Note</b>For customers without CASA, use suspense GL <b>2070102</b>.</div></div>
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label>TD Account</label><input class="input mono" id="certTdAcc"></div>
      <div style="text-align:right"><button class="btn pri" onclick="genCert()"><i class="fas fa-certificate"></i> Generate</button></div>
    </div>
    ${formFooter(state.user.name,'','—','—')}
    </div>
  </div>`;
},init(){}};

function genCert(){
  const acc=$('#certTdAcc').value.trim();const td=findTd(acc);
  if(!td){toast('TD not found','e');return;}
  openModal('TD Certificate',`<div class="receipt-style">
    <div class="receipt-header"><h2>TERM DEPOSIT CERTIFICATE</h2><p>FLEXCUBE NEO</p></div>
    <div class="receipt-row"><span class="label">Certificate No</span><span class="value">${esc(ref('CERT'))}</span></div>
    <div class="receipt-row"><span class="label">TD Account</span><span class="value mono">${esc(td.tdAcc)}</span></div>
    <div class="receipt-row"><span class="label">Customer</span><span class="value">${esc(td.customerName)}</span></div>
    <div class="receipt-divider"></div>
    <div class="receipt-row" style="font-weight:bold"><span class="label">Principal</span><span class="value">${fmtETB(td.principal)}</span></div>
    <div class="receipt-row"><span class="label">Rate</span><span class="value">${td.rate}%</span></div>
    <div class="receipt-row"><span class="label">Tenor</span><span class="value">${td.tenor} ${td.tenorUnit}</span></div>
    <div class="receipt-row"><span class="label">Maturity</span><span class="value">${esc(td.maturityDate)}</span></div>
  </div>`,`<button class="btn exit" onclick="closeModal()">Exit</button><button class="btn ok" onclick="window.print()">Print</button>`);
}

R['m7-lien-list']={render(){
  return `${actionStrip([{label:'New Block',onclick:"openLienModal()",icon:'fas fa-plus'},{spacer:true},{info:'Func: <code>CADAMBLK</code>'}])}
  <div class="section-band">Amount Blocks <span class="tag">${state.lienBlocks.filter(b=>b.status==='ACTIVE').length} active</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Ref</th><th>Account</th><th>Amount</th><th>From</th><th>Until</th><th>Purpose</th><th>Status</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${state.lienBlocks.length?state.lienBlocks.map(b=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(b.id)}</td><td class="mono">${esc(b.account)}</td><td class="mono">${fmtETB(b.amount)}</td>
        <td>${esc(b.from)}</td><td>${esc(b.until)}</td><td>${esc(b.purpose)}</td><td>${bdg(b.status)}</td>
        <td style="text-align:right">${b.status==='ACTIVE'?`<button class="btn sm dgr" onclick="releaseLien('${b.id}')"><i class="fas fa-unlock"></i></button>`:''}</td>
      </tr>`).join(''):'<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--tx3)">No active blocks</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function openLienModal(){
  openModal('New Amount Block (CADAMBLK)',
    `<div class="form-2col">
      <div>
        <div class="form-row"><label class="req">Account Number</label><input class="input mono" id="lnAcc"></div>
        <div class="form-row"><label class="req">Amount</label><input class="input mono" id="lnAmt" type="number"></div>
      </div>
      <div>
        <div class="form-row"><label>From Date</label><input class="input" type="date" id="lnFrom" value="${today()}"></div>
        <div class="form-row"><label>Until Date</label><input class="input" type="date" id="lnUntil"></div>
        <div class="form-row"><label>Purpose</label><input class="input" id="lnPurpose" placeholder="Share / Limit / Collateral"></div>
      </div>
    </div>`,
    `<button class="btn exit" onclick="closeModal()">Cancel</button><button class="btn ok" onclick="saveLien()">Apply Block</button>`);
}

function saveLien(){
  const acc=$('#lnAcc').value.trim(),amt=validAmt($('#lnAmt').value),from=$('#lnFrom').value,until=$('#lnUntil').value;
  const a=findAcc(acc);
  if(!a){toast('Account not found','e');return;}
  if(!amt){toast('Enter a positive amount','e');return;}
  if(a.status==='CLOSED'){toast('Account is closed','e');return;}
  if(amt>availBal(a)){toast('Block exceeds available balance ('+fmtETB(availBal(a))+')','e');return;}
  if(until&&from&&until<from){toast('Until date is before From date','e');return;}
  const block={id:ref('LIEN'),account:acc,amount:amt,from,until,purpose:$('#lnPurpose').value,status:'ACTIVE',createdAt:nowISO()};
  state.lienBlocks.push(block);a.hold=+((a.hold||0)+amt).toFixed(2);
  logAudit('CREATE_LIEN',block.id,acc);toast('Block applied','s');closeModal();saveState();mount();
}

function releaseLien(id){
  const b=state.lienBlocks.find(x=>x.id===id);if(!b||b.status!=='ACTIVE')return;
  if(!confirm('Release block '+id+'?'))return;
  b.status='RELEASED';
  const a=findAcc(b.account);if(a)a.hold=Math.max(0,+((a.hold||0)-b.amount).toFixed(2));
  logAudit('RELEASE_LIEN',id);toast('Released','s');saveState();mount();
}

R['m7-lien-new']={render:R['m7-lien-list'].render,init(){setTimeout(openLienModal,50);}};
