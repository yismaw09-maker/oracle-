/* =====================================================================
   FLEXCUBE Modules Part 5 (Customer 360, IBT, Stock, Cheque, CPO, Cash Ops)
   ===================================================================== */
R['m11-c360']={render(){
  const c=state.ui.lastCust?findCust(state.ui.lastCust):null;
  if(!c){
    return `${actionStrip([{label:'Customer 360°',active:true,icon:'fas fa-eye'}])}
    <div class="section-band">360° Customer View (STDRETVW)</div>
    <div class="content-wrap">
      <div class="panel"><div class="panel-b">
        <div class="form-row"><label>Customer No</label><input class="input mono" id="v360Cif" placeholder="Enter CIF"></div>
        <button class="btn pri" onclick="loadC360()"><i class="fas fa-search"></i> Fetch</button>
      </div></div>
      <div class="panel" style="margin-top:10px"><div class="panel-h">Select Customer</div><div class="panel-b flush">
        <div class="tbl-wrap" style="border:0"><table class="oracle-tbl"><thead><tr><th>CIF</th><th>Name</th><th>Type</th><th>Auth</th></tr></thead><tbody>
          ${state.customers.map(x=>`<tr class="clickable" onclick="state.ui.lastCust='${x.cif}';mount()">
            <td class="mono">${esc(x.cif)}</td><td>${esc(x.fullName)}</td><td>${esc(x.type)}</td><td>${bdg(x.authStatus)}</td>
          </tr>`).join('')||'<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--tx3)">No customers</td></tr>'}
        </tbody></table></div>
      </div></div>
    </div>`;
  }
  const accs=acctsOf(c.cif);
  const tds=state.tdAccounts.filter(t=>t.cif===c.cif);
  return `${actionStrip([{label:'360° View',active:true,icon:'fas fa-eye'},{label:'Back',onclick:"state.ui.lastCust=null;mount()",icon:'fas fa-arrow-left'},{spacer:true},{info:'Func: <code>STDRETVW</code>'}])}
  <div class="section-band">360° View — ${esc(c.fullName)} <span class="tag">CIF ${esc(c.cif)}</span></div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi k-blue"><div class="kpi-l">CIF</div><div class="kpi-v" style="font-size:12px">${esc(c.cif)}</div></div>
      <div class="kpi k-green"><div class="kpi-l">Accounts</div><div class="kpi-v">${accs.length}</div></div>
      <div class="kpi k-purple"><div class="kpi-l">TDs</div><div class="kpi-v">${tds.length}</div></div>
      <div class="kpi k-amber"><div class="kpi-l">Total Balance</div><div class="kpi-v" style="font-size:13px">${fmtETB(accs.reduce((s,a)=>s+(a.balance||0),0))}</div></div>
    </div>
    <div class="panel"><div class="panel-h">Profile</div><div class="panel-b"><div class="kv-grid">
      <dt>Customer No</dt><dd class="mono">${esc(c.cif)}</dd>
      <dt>Full Name</dt><dd>${esc(c.fullName)}</dd>
      <dt>Type / Cat</dt><dd>${esc(c.type)} / ${esc(c.category)}</dd>
      <dt>Branch</dt><dd>${esc(c.branch)}</dd>
      <dt>Mobile</dt><dd>${esc(c.mobile||'—')}</dd>
      <dt>Email</dt><dd>${esc(c.email||'—')}</dd>
      <dt>Auth</dt><dd>${bdg(c.authStatus)}</dd>
    </div></div></div>
    <div class="panel"><div class="panel-h">Accounts</div><div class="panel-b flush">
      ${accs.length?`<div class="tbl-wrap" style="border:0"><table class="oracle-tbl"><thead><tr><th>Account</th><th>Class</th><th>Ccy</th><th style="text-align:right">Balance</th></tr></thead><tbody>
        ${accs.map(a=>`<tr><td class="mono">${esc(a.acc)}</td><td>${esc(a.className)}</td><td>${esc(a.currency)}</td><td class="mono" style="text-align:right">${fmtETB(a.balance)}</td></tr>`).join('')}
      </tbody></table></div>`:emptyState('💳','No accounts')}
    </div></div>
    <div class="panel"><div class="panel-h">Term Deposits</div><div class="panel-b flush">${tds.length?`<div class="tbl-wrap" style="border:0"><table class="oracle-tbl"><thead><tr><th>TD Account</th><th style="text-align:right">Principal</th><th>Rate</th><th>Maturity</th><th>Status</th></tr></thead><tbody>${tds.map(t=>`<tr><td class="mono">${esc(t.tdAcc)}</td><td class="mono" style="text-align:right">${fmtETB(t.principal)}</td><td>${t.rate}%</td><td>${esc(t.maturityDate)}</td><td>${bdg(t.status)}</td></tr>`).join('')}</tbody></table></div>`:emptyState('📅','No term deposits')}</div></div>
  </div>`;
},init(){}};

function loadC360(){
  const v=$('#v360Cif').value.trim();const c=findCust(v);
  if(!c){toast('Customer not found','e');return;}
  state.ui.lastCust=c.cif;mount();
}

R['m12-ibt-request']={render(){
  return `${actionStrip([{label:'Submit',onclick:"toast('IBT request submitted','s')",icon:'fas fa-paper-plane'},{spacer:true},{info:'IBT Request'}])}
  <div class="section-band">Inter-Branch Transaction Request</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label>IBT Ref</label><input class="input mono" value="${ref('IBT')}" readonly></div>
      <div class="form-row"><label class="req">To Branch</label><input class="input mono" value="000"></div>
      <div class="form-row"><label>Amount</label><input class="input mono" type="number"></div>
      <div style="text-align:right"><button class="btn pri" onclick="toast('IBT request submitted','s')"><i class="fas fa-paper-plane"></i> Submit</button></div>
    </div></div>
  </div>`;
},init(){}};

R['m12-ibt-liquidation']={render(){
  return `${actionStrip([{label:'Liquidate',onclick:"toast('Liquidated','s')",icon:'fas fa-check'},{spacer:true},{info:'IBT Liquidation'}])}
  <div class="section-band">Inter-Branch Transaction Liquidation</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">IBT Reference</label><input class="input mono"></div>
      <div style="text-align:right"><button class="btn pri" onclick="toast('Liquidated','s')"><i class="fas fa-check"></i> Liquidate</button></div>
    </div></div>
  </div>`;
},init(){}};

R['m12-ibt-input']={render(){
  return `${actionStrip([{label:'Submit',onclick:"toast('Cash sent','s')",icon:'fas fa-paper-plane'},{spacer:true},{info:'IBT Cash Input'}])}
  <div class="section-band">Inter-Branch Cash Input</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label class="req">IBT Reference</label><input class="input mono"></div>
      <div class="form-row"><label class="req">Amount</label><input class="input mono" type="number"></div>
      <div style="text-align:right"><button class="btn pri" onclick="toast('Cash sent','s')"><i class="fas fa-paper-plane"></i> Submit</button></div>
    </div></div>
  </div>`;
},init(){}};

R['m12-ibt-recon']={render(){
  return `${actionStrip([{label:'IBT Recon',active:true,icon:'fas fa-link'}])}
  <div class="section-band">IBT &amp; Claim Reconciliation <span class="tag">Sample data</span></div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">🔗</span><div class="al-body"><b>Core Accounts</b>MIB: <b>1150112</b> · Claim on HO: <b>1040102</b> · CK Books: <b>1040403</b></div></div>
    <div class="panel"><div class="panel-h">Illustrative Flow</div><div class="panel-b">
      <div class="stat-row"><span class="sl">HO → Sends CK/CPO</span><span class="sv mono">Claim 1040102 Dr 1,500 | Stock 1040403 Cr 1,500</span></div>
      <div class="stat-row"><span class="sl">Branch Receives</span><span class="sv mono">Stock 1040403 Dr 1,500 | MIB 1150112 Cr 1,500</span></div>
      <div class="stat-row"><span class="sl">HO Recon</span><span class="sv mono">MIB 1150112 Dr 1,500 | Claim 1040102 Cr 1,500</span></div>
    </div></div>
    <div class="panel"><div class="panel-h">Balances</div><div class="panel-b">
      <div class="stat-row"><span class="sl">MIB (1150112)</span><span class="sv mono">ETB 0.00</span></div>
      <div class="stat-row"><span class="sl">Claim on HO (1040102)</span><span class="sv mono">ETB 0.00</span></div>
      <div class="stat-row"><span class="sl">CK Books (1040403)</span><span class="sv mono">ETB 0.00</span></div>
      <div class="stat-row"><span class="sl">Suspense (2070102)</span><span class="sv mono">ETB 0.00</span></div>
    </div></div>
  </div>`;
},init(){}};

R['m13-stock-list']={render(){
  return `${actionStrip([{label:'Refresh',onclick:"mount()",icon:'fas fa-sync'},{spacer:true},{info:'Func: <code>IVDBALIN</code>'}])}
  <div class="section-band">Stock Balance (IVDBALIN) <span class="tag">${state.stockInventory.length} entries</span></div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Stock Code</th><th>Name</th><th>Denom</th><th style="text-align:right">Qty</th><th style="text-align:right">Reorder</th><th>Status</th>
    </tr></thead><tbody>
      ${state.stockInventory.slice(0,40).map(s=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(s.stockCode)}</td>
        <td>${esc(s.stockCode==='CPO'?'CPO / Bankers Cheque':s.stockCode==='CHQ'?'Cheque Book':s.stockCode==='GUAR'?'Bank Guarantee':s.stockCode==='SHAR'?'Share Certificate':'Passbook')}</td>
        <td class="mono">${esc(s.denom)}</td>
        <td class="mono" style="text-align:right">${esc(s.qty)}</td><td class="mono" style="text-align:right">${esc(s.reorderLevel)}</td>
        <td>${s.qty>s.reorderLevel?'<span class="bdg ok">OK</span>':'<span class="bdg wn">REORDER</span>'}</td>
      </tr>`).join('')}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

R['m13-stock-req']={render(){
  return `${actionStrip([{label:'Submit',onclick:"requestStock()",icon:'fas fa-paper-plane'},{spacer:true},{info:'Func: <code>IVDTXNIR</code>'}])}
  <div class="section-band">Request Stocks (IVDTXNIR)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div><div class="form-row"><label class="req">Stock Code</label>
          <select class="input" id="reqStockCode"><option>CPO</option><option>CHQ</option><option>GUAR</option><option>SHAR</option><option>PASS</option></select></div></div>
        <div><div class="form-row"><label class="req">Quantity</label><input class="input mono" id="reqQty" type="number" value="100"></div></div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="requestStock()"><i class="fas fa-paper-plane"></i> Submit</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function requestStock(){logAudit('STOCK_REQUEST',$('#reqStockCode').value,'Qty: '+$('#reqQty').value);toast('Stock request submitted','s');}
R['m13-stock-order']={render(){return `${actionStrip([{label:'Save',onclick:"toast('Order placed','s')",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>IVDTXNOR</code>'}])}<div class="section-band">Order Stocks (IVDTXNOR)</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Supplier Code</label><input class="input"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Order placed','s')"><i class="fas fa-save"></i> Place Order</button></div></div></div></div>`;},init(){}};
R['m13-stock-receive']={render(){return `${actionStrip([{label:'Receive',active:true,icon:'fas fa-download'}])}<div class="section-band">Receive Stocks</div><div class="content-wrap"><div class="alert s"><span class="al-ic">📥</span><div class="al-body"><b>Receive Stocks</b>Record inventory added to existing stock.</div></div></div>`;},init(){}};
R['m13-stock-issue']={render(){return `${actionStrip([{label:'Issue',active:true,icon:'fas fa-upload'}])}<div class="section-band">Issue Stocks (IVDTXNRI)</div><div class="content-wrap"><div class="alert i"><span class="al-ic">📤</span><div class="al-body"><b>Issue Stocks</b>Distribute inventory to departments.</div></div></div>`;},init(){}};
R['m13-stock-adjust']={render(){return `${actionStrip([{label:'Adjust',active:true,icon:'fas fa-balance-scale'}])}<div class="section-band">Adjust Inventory (IVDTXNAS)</div><div class="content-wrap"><div class="alert w"><span class="al-ic">⚖</span><div class="al-body"><b>Adjust Inventory</b>Adjustments after issue/receipt.</div></div></div>`;},init(){}};
R['m13-stock-confirm']={render(){return `${actionStrip([{label:'Confirm',active:true,icon:'fas fa-check'}])}<div class="section-band">Confirm Receipts (IVDCONFR)</div><div class="content-wrap"><div class="alert s"><span class="al-ic">✔</span><div class="al-body"><b>Confirm Receipts</b>Acknowledge physical receipt from HO.</div></div></div>`;},init(){}};

R['m14-cheque-book']={render(){
  return `${actionStrip([{label:'New',onclick:"openChequeModal()",icon:'fas fa-plus'},{spacer:true},{info:'Func: <code>CADCHBOO</code>'}])}
  <div class="section-band">Cheque Book Maintenance (CADCHBOO)</div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">📒</span><div class="al-body"><b>Cheque Book Issuance</b>12-digit cheque numbers · 25 (11) · 50 (12) · 100 (13)</div></div>
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>Account</th><th>Book No</th><th>First Cheque</th><th>Leaves</th><th>Type</th><th>Issue Date</th><th>Status</th>
    </tr></thead><tbody>
      ${state.chequeBooks.length?state.chequeBooks.map(c=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(c.account)}</td><td class="mono">${esc(c.bookNo)}</td><td class="mono">${esc(c.firstCheque)}</td>
        <td>${esc(c.leaves)}</td><td>${esc(c.type)}</td><td>${esc(c.issueDate)}</td><td>${bdg(c.status)}</td>
      </tr>`).join(''):'<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--tx3)">No cheque books issued</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function openChequeModal(){
  openModal('Issue Cheque Book (CADCHBOO)',
    `<div class="form-2col">
      <div>
        <div class="form-row"><label class="req">Account</label><input class="input mono" id="cbAcc"></div>
        <div class="form-row"><label>Leaves</label><select class="input" id="cbLeaves"><option value="25">25 (11)</option><option value="50">50 (12)</option><option value="100">100 (13)</option></select></div>
        <div class="form-row"><label>First Cheque</label><input class="input mono" id="cbFirst" value="100001"></div>
      </div>
      <div>
        <div class="form-row"><label>Type</label><select class="input" id="cbType"><option>Commercial</option><option>Euro</option></select></div>
        <div class="form-row"><label>Issue Date</label><input class="input" type="date" value="${today()}" readonly></div>
      </div>
    </div>`,
    `<button class="btn exit" onclick="closeModal()">Exit</button><button class="btn ok" onclick="saveChequeBook()">OK</button>`);
}

function saveChequeBook(){
  const acc=$('#cbAcc').value.trim(),first=$('#cbFirst').value.trim();
  const a=findAcc(acc);
  if(!a){toast('Account not found','e');return;}
  if(a.status==='CLOSED'||a.authStatus!=='AUTHORIZED'){toast('Account must be an authorized, open account','e');return;}
  if(!/^\d{1,12}$/.test(first)){toast('First cheque must be numeric (max 12 digits)','e');return;}
  const leaves=num($('#cbLeaves').value),f=Number(first),l=f+leaves-1;
  if(state.chequeBooks.some(b=>Number(b.firstCheque)<=l&&f<=Number(b.firstCheque)+b.leaves-1)){toast('Cheque number range overlaps an existing book','e');return;}
  const book={bookNo:ref('CHQBK'),account:acc,firstCheque:first,leaves,type:$('#cbType').value,issueDate:today(),status:'ISSUED',createdAt:nowISO()};
  state.chequeBooks.push(book);logAudit('ISSUE_CHEQUE_BOOK',acc,book.bookNo);
  toast('Issued: '+book.bookNo,'s');closeModal();saveState();mount();
}

R['m14-cheque-detail']={render(){
  return `${actionStrip([{label:'Update Status',onclick:"updateChqStatus()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>CADCHKDT</code>'}])}
  <div class="section-band">Cheque Detail (CADCHKDT)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div><div class="form-row"><label>Account</label><input class="input mono" id="cdAcc"></div></div>
        <div><div class="form-row"><label>Cheque Number</label><input class="input mono" id="cdChq"></div></div>
      </div>
      <div class="form-row"><label>Status</label>
        <select class="input" id="cdStatus">
          <option value="N">N — Non-used</option>
          <option value="U">U — Used</option>
          <option value="R">R — Rejected</option>
          <option value="S">S — Stopped</option>
          <option value="C">C — Cancelled</option>
        </select></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};
function updateChqStatus(){toast('Cheque status: '+$('#cdStatus').value,'s');logAudit('CHEQUE_STATUS',$('#cdChq').value,'→ '+$('#cdStatus').value);}

R['m14-stop-payment']={render(){
  return `${actionStrip([{label:'Stop Payment',onclick:"toast('Stop payment recorded','w')",icon:'fas fa-stop'},{spacer:true},{info:'Func: <code>CADSPMNT</code>'}])}
  <div class="section-band">Stop Payment (CADSPMNT)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-row"><label>Stop By</label><select class="input"><option>Cheque Number</option><option>Amount</option></select></div>
      <div class="form-row"><label>Cheque Number</label><input class="input mono"></div>
      <div class="form-row"><label>Amount</label><input class="input mono" type="number"></div>
      <div style="text-align:right"><button class="btn dgr" onclick="toast('Stop payment recorded','w')"><i class="fas fa-stop"></i> Stop Payment</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

R['m15-cpo-issue']={render(){
  return `${actionStrip([{label:'Save',onclick:"issueCPO()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>PIDINSIS</code>'}])}
  <div class="section-band">Instrument Issue (PIDINSIS)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Source Code</label><input class="input" value="ADDIS" readonly></div>
          <div class="form-row"><label class="req">CPO Number</label><input class="input mono" id="cpoNo" maxlength="7"></div>
        </div>
        <div>
          <div class="form-row"><label class="req">Amount</label><input class="input mono" id="cpoAmt" type="number"></div>
          <div class="form-row"><label class="req">Beneficiary</label><input class="input" id="cpoBen"></div>
        </div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="issueCPO()"><i class="fas fa-money-check"></i> Issue CPO</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function issueCPO(){
  const cpoNo=$('#cpoNo').value.trim(),amt=validAmt($('#cpoAmt').value),ben=$('#cpoBen').value.trim();
  if(!/^\d{7}$/.test(cpoNo)){toast('CPO number must be exactly 7 digits','e');return;}
  if(!amt||!ben){toast('A positive amount and a beneficiary are required','e');return;}
  if(state.cpoInstruments.some(c=>c.cpoNo===cpoNo)){toast('CPO number already issued','e');return;}
  const cpo={id:uid('CPO'),cpoNo,amount:amt,beneficiary:ben,currency:'ETB',status:'ISSUED',issueDate:today(),createdAt:nowISO(),maker:state.user.id};
  state.cpoInstruments.push(cpo);logAudit('ISSUE_CPO',cpoNo,fmtETB(cpo.amount));saveState();
  toast('CPO issued: '+cpoNo,'s');
}

R['m15-cpo-pay']={render(){return `${actionStrip([{label:'Payment',onclick:"toast('Payment processed','s')",icon:'fas fa-money-bill'},{spacer:true},{info:'Func: <code>PIDINSPY</code>'}])}<div class="section-band">Instrument Payment (PIDINSPY)</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label class="req">CPO Number</label><input class="input mono"></div><div class="form-row"><label>Credit Account</label><input class="input mono"></div><div class="form-row"><label>Amount</label><input class="input mono" type="number"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Payment processed','s')"><i class="fas fa-money-bill"></i> Process</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m15-cpo-stop']={render(){return `${actionStrip([{label:'Stop CPO',onclick:"toast('CPO stopped','w')",icon:'fas fa-stop'},{spacer:true},{info:'Func: <code>PIDSTPAY</code>'}])}<div class="section-band">Stop CPO (PIDSTPAY)</div><div class="content-wrap"><div class="alert w"><span class="al-ic">⏹</span><div class="al-body"><b>Note:</b> Once liquidated, CPO cannot be stopped.</div></div><div class="panel"><div class="panel-b"><div class="form-row"><label class="req">CPO Number</label><input class="input mono"></div><div style="text-align:right"><button class="btn dgr" onclick="toast('CPO stopped','w')"><i class="fas fa-stop"></i> Stop</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
