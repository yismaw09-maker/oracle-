/* =====================================================================
   FLEXCUBE Modules Part 6 (OBBRN Cash, Operations, Workflow, Monitoring, EOD)
   ===================================================================== */
R['m16-branch-ops']={render(){
  return `${actionStrip([{label:'Branch Operations',active:true,icon:'fas fa-building'}])}
  <div class="section-band">Branch Operations (OBBRN)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-h">Start of Day</div><div class="panel-b">
      <div class="progress-steps">
        <div class="step active"><span class="step-num">1</span> Open Branch Batch</div>
        <div class="step"><span class="step-num">2</span> Open Vault Batch</div>
        <div class="step"><span class="step-num">3</span> Open Teller Batch</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn pri" onclick="toast('Branch batch opened','s')"><i class="fas fa-play"></i> Open Branch Batch</button>
        <button class="btn dark" onclick="toast('Vault batch opened','s')"><i class="fas fa-play"></i> Open Vault Batch</button>
        <button class="btn exit" onclick="toast('Teller batch opened','s')"><i class="fas fa-play"></i> Open Teller Batch</button>
      </div>
    </div></div>
    <div class="panel"><div class="panel-h">End of Day</div><div class="panel-b">
      <div class="progress-steps">
        <div class="step"><span class="step-num">1</span> Close Teller</div>
        <div class="step"><span class="step-num">2</span> Close Vault</div>
        <div class="step"><span class="step-num">3</span> Branch Invoke</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn" onclick="toast('Teller closed','w')"><i class="fas fa-stop"></i> Close Teller</button>
        <button class="btn" onclick="toast('Vault closed','w')"><i class="fas fa-stop"></i> Close Vault</button>
        <button class="btn dgr" onclick="go('m22-eod')"><i class="fas fa-moon"></i> Go to EOD</button>
      </div>
    </div></div>
    <div class="panel"><div class="panel-h">Other Operations</div><div class="panel-b">
      <div class="qa-grid">
        <div class="qa-tile" onclick="go('m16-till')"><div class="qa-ic"><i class="fas fa-cash-register"></i></div><div class="qa-l">Till Position</div></div>
        <div class="qa-tile" onclick="go('m16-vault')"><div class="qa-ic"><i class="fas fa-landmark"></i></div><div class="qa-l">Vault Position</div></div>
        <div class="qa-tile" onclick="go('m16-breach')"><div class="qa-ic"><i class="fas fa-exclamation-triangle"></i></div><div class="qa-l">Breach Limits</div></div>
        <div class="qa-tile" onclick="go('m16-cash-move')"><div class="qa-ic"><i class="fas fa-truck"></i></div><div class="qa-l">Cash Movement</div></div>
      </div>
    </div></div>
  </div>`;
},init(){}};

R['m16-till']={render(){
  return `${actionStrip([{label:'Refresh',onclick:"mount()",icon:'fas fa-sync'}])}
  <div class="section-band">Till Total Position <span class="tag">Sample data</span></div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <table class="oracle-tbl"><thead><tr>
        <th>Ccy</th><th>Teller ID</th><th style="text-align:right">Opening</th><th style="text-align:right">Incoming</th><th style="text-align:right">Outgoing</th><th style="text-align:right">Closing</th>
      </tr></thead><tbody>
        <tr><td>ETB</td><td class="mono">T-003</td><td class="mono" style="text-align:right">100,000.00</td><td class="mono" style="text-align:right">394,100.00</td><td class="mono" style="text-align:right">0.00</td><td class="mono" style="text-align:right">494,100.00</td></tr>
        <tr><td>USD</td><td class="mono">T-005</td><td class="mono" style="text-align:right">5,000.00</td><td class="mono" style="text-align:right">1,500.00</td><td class="mono" style="text-align:right">0.00</td><td class="mono" style="text-align:right">6,500.00</td></tr>
      </tbody></table>
    </div></div>
  </div>`;
},init(){}};

R['m16-vault']={render(){
  const dms=[200,100,50,10,5,1];
  return `${actionStrip([{label:'Refresh',onclick:"mount()",icon:'fas fa-sync'}])}
  <div class="section-band">Till / Vault Position — Denomination View <span class="tag">Sample data</span></div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <table class="oracle-tbl"><thead><tr>
        <th>Denom</th><th>Value</th><th style="text-align:right">Opening</th><th style="text-align:right">Incoming</th><th style="text-align:right">Outgoing</th><th style="text-align:right">Total</th><th style="text-align:right">Units</th>
      </tr></thead><tbody>
        ${dms.map(d=>`<tr>
          <td class="mono">${d}00</td><td class="mono">${d}</td>
          <td class="mono" style="text-align:right">${(d*100).toFixed(2)}</td>
          <td class="mono" style="text-align:right">${d===100?'20,000.00':'0.00'}</td>
          <td class="mono" style="text-align:right">0.00</td>
          <td class="mono" style="text-align:right">${(d*100).toFixed(2)}</td>
          <td class="mono" style="text-align:right">${d===100?'200':(d*10)}</td>
        </tr>`).join('')}
      </tbody></table>
    </div></div>
  </div>`;
},init(){}};

R['m16-breach']={render(){
  return `${actionStrip([{label:'Refresh',onclick:"mount()",icon:'fas fa-sync'}])}
  <div class="section-band">Branch Breach Limits <span class="tag">Sample data</span></div>
  <div class="content-wrap">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th>User ID</th><th>Ccy</th><th style="text-align:right">Max Limit</th><th style="text-align:right">Min Limit</th><th style="text-align:right">Current Balance</th>
    </tr></thead><tbody>
      <tr><td class="mono">BERHANUF</td><td>ETB</td><td class="mono" style="text-align:right">999,999,999,999</td><td class="mono" style="text-align:right">0</td><td class="mono" style="text-align:right">0</td></tr>
      <tr><td class="mono">BETELB</td><td>ETB</td><td class="mono" style="text-align:right">999,999,999,999</td><td class="mono" style="text-align:right">0</td><td class="mono" style="text-align:right">394,100</td></tr>
      <tr><td class="mono">MESFINJ</td><td>ETB</td><td class="mono" style="text-align:right">999,999,999,999</td><td class="mono" style="text-align:right">0</td><td class="mono" style="text-align:right">100,000</td></tr>
    </tbody></table></div>
  </div>`;
},init(){}};

R['m16-cash-move']={render(){
  return `${actionStrip([{label:'Cash Movement',active:true,icon:'fas fa-truck'}])}
  <div class="section-band">Cash Movement — HO ↔ Branch ↔ Vault ↔ Till</div>
  <div class="content-wrap">
    <div class="kpi-grid">
      <div class="kpi k-blue"><div class="kpi-l">HO → Branch</div><div class="kpi-v" style="font-size:12px">Delivery</div></div>
      <div class="kpi k-blue"><div class="kpi-l">Branch → HO</div><div class="kpi-v" style="font-size:12px">Return</div></div>
      <div class="kpi k-green"><div class="kpi-l">Vault → Till</div><div class="kpi-v" style="font-size:12px">Buy</div></div>
      <div class="kpi k-green"><div class="kpi-l">Till → Vault</div><div class="kpi-v" style="font-size:12px">Sell</div></div>
    </div>
    <div class="panel"><div class="panel-h">Cash Movement Actions</div><div class="panel-b">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn pri" onclick="go('m12-ibt-request')"><i class="fas fa-inbox"></i> Request Cash</button>
        <button class="btn dark" onclick="go('m12-ibt-liquidation')"><i class="fas fa-check"></i> Liquidate</button>
        <button class="btn" onclick="toast('Buy from vault','s')"><i class="fas fa-arrow-down"></i> Buy from Vault</button>
        <button class="btn" onclick="toast('Sell to vault','s')"><i class="fas fa-arrow-up"></i> Sell to Vault</button>
      </div>
    </div></div>
  </div>`;
},init(){}};

R['m16-denom']={render(){
  return `${actionStrip([{label:'Exchange',onclick:"toast('Denomination exchange saved','s')",icon:'fas fa-exchange-alt'},{spacer:true},{info:'Received (+) · Given (-)'}])}
  <div class="section-band">Denomination Exchange</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
        <th>Denom</th><th>Received (+)</th><th>Given (-)</th><th style="text-align:right">Net</th>
      </tr></thead><tbody>
        ${[200,100,50,10,5,1].map(d=>`<tr>
          <td class="mono">${d}</td>
          <td><input class="input mono" type="number" value="0" style="min-height:22px"></td>
          <td><input class="input mono" type="number" value="0" style="min-height:22px"></td>
          <td class="mono" style="text-align:right">0</td>
        </tr>`).join('')}
      </tbody></table></div>
      <div style="text-align:right;margin-top:10px"><button class="btn pri" onclick="toast('Denomination exchange saved','s')"><i class="fas fa-save"></i> Submit</button></div>
    </div></div>
  </div>`;
},init(){}};

R['m17-deposit']={render(){
  return `${actionStrip([{label:'Submit',onclick:"postDeposit()",icon:'fas fa-check'},{label:'Clear',onclick:"go('m17-deposit')",icon:'fas fa-eraser'},{spacer:true},{info:'Cash Deposit'}])}
  <div class="section-band">Teller — Cash Deposit</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Account Number</label><input class="input mono" id="depAcc" oninput="depLookup()"></div>
          <div class="form-row"><label class="req">Amount</label><input class="input mono" id="depAmt" type="number"></div>
          <div class="form-row"><label>Narrative</label><input class="input" value="Cash Deposit"></div>
        </div>
        <div>
          <div class="panel"><div class="panel-h">Customer Information</div><div class="panel-b">
            <div class="kv-grid" id="depCust"><dt>Name</dt><dd>—</dd><dt>KYC</dt><dd>—</dd><dt>Status</dt><dd>—</dd></div>
          </div></div>
        </div>
      </div>
      <div class="form-section-title">Denomination</div>
      <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
        <th>Denom</th><th>Units</th><th style="text-align:right">Subtotal</th>
      </tr></thead><tbody>
        ${[200,100,50,10,5,1].map(d=>`<tr><td class="mono">${d}</td><td><input class="input mono dn-u" data-d="${d}" type="number" min="0" value="0" style="min-height:22px" oninput="denomCalc()"></td><td class="mono dn-s" style="text-align:right">0.00</td></tr>`).join('')}<tr><td colspan="2"><b>Total</b></td><td class="mono" style="text-align:right"><b id="dnTotal">0.00</b></td></tr>
      </tbody></table></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function depLookup(){const a=findAcc($('#depAcc').value.trim()),el=$('#depCust');if(!el)return;const c=a&&findCust(a.cif);el.innerHTML=a?`<dt>Name</dt><dd>${esc(a.name)}</dd><dt>KYC</dt><dd>${c&&c.kycRef?'Linked ('+esc(c.kycRef)+')':'Not linked'}</dd><dt>Status</dt><dd>${esc(a.status)}</dd>`:'<dt>Name</dt><dd>—</dd><dt>KYC</dt><dd>—</dd><dt>Status</dt><dd>—</dd>';}
function denomSum(){let total=0,any=false;$$('.dn-u').forEach(i=>{const u=Math.max(0,parseInt(i.value)||0);if(u)any=true;total+=u*+i.dataset.d;});return{total,any};}
function denomCalc(){$$('.dn-u').forEach(i=>{const c=i.closest('tr').querySelector('.dn-s');if(c)c.textContent=(Math.max(0,parseInt(i.value)||0)*+i.dataset.d).toFixed(2);});const t=$('#dnTotal');if(t)t.textContent=denomSum().total.toFixed(2);}
function postDeposit(){
  const acc=$('#depAcc').value.trim(),amt=validAmt($('#depAmt').value);
  if(!acc||!amt){toast('Account and a positive amount are required','e');return;}
  const a=findAcc(acc);if(!a){toast('Account not found','e');return;}
  const blk=postingBlock(a,'CR');if(blk){toast(blk,'e');return;}
  const dn=denomSum();if(dn.any&&Math.abs(dn.total-amt)>0.001){toast('Denomination total ('+fmtETB(dn.total)+') does not match the amount','e');return;}
  a.balance=+(a.balance+amt).toFixed(2);
  const t=recTxn({p:'DEP',type:'in',amount:amt,account:a.acc,name:a.name,title:'Cash Deposit'});
  logAudit('CASH_DEPOSIT',acc,fmtETB(amt));toast('Deposited '+fmtETB(amt),'s');saveState();mount();viewTxn(t.id);
}

R['m17-withdrawal']={render(){
  return `${actionStrip([{label:'Submit',onclick:"postWithdrawal()",icon:'fas fa-check'},{spacer:true},{info:'Cash Withdrawal'}])}
  <div class="section-band">Teller — Cash Withdrawal</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Account Number</label><input class="input mono" id="wdAcc"></div>
          <div class="form-row"><label class="req">Amount</label><input class="input mono" id="wdAmt" type="number"></div>
        </div>
        <div></div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="postWithdrawal()"><i class="fas fa-check"></i> Submit</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function postWithdrawal(){
  const acc=$('#wdAcc').value.trim(),amt=validAmt($('#wdAmt').value);
  if(!acc||!amt){toast('Account and a positive amount are required','e');return;}
  if(amt>CASH_WD_LIMIT){toast('Cash withdrawal limit is '+fmtETB(CASH_WD_LIMIT),'e');return;}
  const a=findAcc(acc);if(!a){toast('Account not found','e');return;}
  const blk=postingBlock(a,'DR');if(blk){toast(blk,'e');return;}
  if(availBal(a)<amt){toast('Insufficient available balance ('+fmtETB(availBal(a))+')','e');return;}
  a.balance=+(a.balance-amt).toFixed(2);
  const t=recTxn({p:'WDR',type:'out',amount:amt,account:a.acc,name:a.name,title:'Cash Withdrawal'});
  logAudit('CASH_WITHDRAWAL',acc,fmtETB(amt));toast('Withdrawn '+fmtETB(amt),'s');saveState();mount();viewTxn(t.id);
}

R['m17-cheque-wd']={render(){
  return `${actionStrip([{label:'Submit',onclick:"postChqWD()",icon:'fas fa-check'},{spacer:true},{info:'Cheque Withdrawal'}])}
  <div class="section-band">Cheque Withdrawal</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label class="req">Account</label><input class="input mono" id="cwAcc"></div>
          <div class="form-row"><label class="req">Cheque No</label><input class="input mono" id="cwChq"></div>
          <div class="form-row"><label class="req">Amount</label><input class="input mono" id="cwAmt" type="number"></div>
        </div>
        <div>
          <div class="form-row"><label>Cheque Date</label><input class="input" type="date" value="${today()}" readonly></div>
        </div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="postChqWD()"><i class="fas fa-check"></i> Submit</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function postChqWD(){
  const acc=$('#cwAcc').value.trim(),chq=$('#cwChq').value.trim(),amt=validAmt($('#cwAmt').value);
  if(!acc||!chq||!amt){toast('Account, cheque number and a positive amount are required','e');return;}
  const a=findAcc(acc);if(!a){toast('Account not found','e');return;}
  const blk=postingBlock(a,'DR');if(blk){toast(blk,'e');return;}
  if(state.transactions.some(t=>t.status!=='REVERSED'&&t.chequeNo===chq&&t.account===acc)){toast('Cheque '+chq+' has already been paid','e');return;}
  if(availBal(a)<amt){toast('Insufficient available balance','e');return;}
  a.balance=+(a.balance-amt).toFixed(2);
  const t=recTxn({p:'CHQ',type:'out',amount:amt,account:a.acc,name:a.name,title:'Cheque Withdrawal · '+chq,extra:{chequeNo:chq}});
  logAudit('CHEQUE_WITHDRAWAL',acc,'Chq '+chq);toast('Posted','s');saveState();mount();viewTxn(t.id);
}

R['m17-fx-pur-acc']={render(){return `${actionStrip([{label:'Submit',onclick:"toast('FX Purchase posted','s')",icon:'fas fa-check'}])}<div class="section-band">FX Purchase — Account</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-2col"><div><div class="form-row"><label>Currency</label><select class="input"><option>USD</option><option>EUR</option><option>GBP</option></select></div><div class="form-row"><label>Amount</label><input class="input mono" type="number"></div></div><div><div class="form-row"><label>Rate</label><input class="input mono" value="57.2500"></div><div class="form-row"><label>Account</label><input class="input mono"></div></div></div><div style="text-align:right"><button class="btn pri" onclick="toast('Posted','s')"><i class="fas fa-check"></i> Submit</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m17-fx-pur-walk']={render(){return `${actionStrip([{label:'Submit',onclick:"toast('FX Walk-in posted','s')",icon:'fas fa-check'}])}<div class="section-band">FX Purchase — Walk-in</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Amount</label><input class="input mono" type="number"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Posted','s')"><i class="fas fa-check"></i> Submit</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m17-fx-sale-acc']={render(){return `${actionStrip([{label:'Submit',onclick:"toast('FX Sale posted','s')",icon:'fas fa-check'}])}<div class="section-band">FX Sale — Account</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Amount</label><input class="input mono" type="number"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Posted','s')"><i class="fas fa-check"></i> Submit</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m17-fx-sale-walk']={render(){return `${actionStrip([{label:'Submit',onclick:"toast('FX Sale posted','s')",icon:'fas fa-check'}])}<div class="section-band">FX Sale — Walk-in</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Amount</label><input class="input mono" type="number"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Posted','s')"><i class="fas fa-check"></i> Submit</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m17-closure-cash']={render(){return `${actionStrip([{label:'Close Account',onclick:"toast('Closed by cash','w')",icon:'fas fa-times'}])}<div class="section-band">Account Closure — Cash</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label class="req">Account</label><input class="input mono"></div><div style="text-align:right"><button class="btn dgr" onclick="toast('Closed by cash','w')"><i class="fas fa-times"></i> Close</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m17-closure-bc']={render(){return `${actionStrip([{label:'Close with BC',onclick:"toast('Closed via BC','w')",icon:'fas fa-times'}])}<div class="section-band">Account Closure — Account / Bankers Cheque</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label class="req">Account</label><input class="input mono"></div><div style="text-align:right"><button class="btn dgr" onclick="toast('Closed via BC','w')"><i class="fas fa-times"></i> Close</button></div></div>${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}</div></div>`;},init(){}};
R['m18-misc']={render(){return `${actionStrip([{label:'Miscellaneous',active:true,icon:'fas fa-cogs'}])}<div class="section-band">Miscellaneous Transactions</div><div class="content-wrap"><div class="panel"><div class="panel-b"><div class="form-row"><label>Account / GL</label><input class="input mono"></div><div class="form-row"><label>Amount</label><input class="input mono" type="number"></div><div style="text-align:right"><button class="btn pri" onclick="toast('Posted','s')"><i class="fas fa-check"></i> Submit</button></div></div></div></div>`;},init(){}};
