/* =====================================================================
   FLEXCUBE Modules Part 4 (Journal, Transfer, SI, Bulk, 360, Stock, Cheques, CPO)
   ===================================================================== */
R['m8-journal']={render(){
  return `${actionStrip([{label:'New',active:true,icon:'fas fa-plus'},{label:'Add Row',onclick:"addJELine()",icon:'fas fa-plus-circle'},{label:'Post',onclick:"postJournal()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>DEDJNLON</code>'}])}
  <div class="section-band">Journal Entry (DEDJNLON)</div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">📒</span><div class="al-body"><b>Double-Entry Journal</b>One Dr → Many Cr · Many Dr → One Cr · Many Dr → Many Cr</div></div>
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Branch</label><input class="input mono" value="${esc(state.branch.code)}" readonly></div>
          <div class="form-row"><label>Batch Number</label><input class="input mono" id="jeBatch" value="BATCH-${Date.now().toString().slice(-8)}"></div>
        </div>
        <div>
          <div class="form-row"><label>Value Date</label><input class="input" type="date" value="${today()}" readonly></div>
          <div class="form-row"><label>Currency</label><select class="input">${CURRENCIES.map(c=>`<option>${c.c}</option>`).join('')}</select></div>
        </div>
      </div>
      <div class="form-section-title">Journal Lines</div>
      <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
        <th>#</th><th>Account / GL</th><th>Dr/Cr</th><th style="text-align:right">Amount</th><th>Narrative</th><th></th>
      </tr></thead><tbody id="jeLines">
        <tr><td>1</td><td><input class="input mono" style="min-height:22px"></td><td><select class="input" style="min-height:22px"><option>DR</option><option>CR</option></select></td><td><input class="input mono" type="number" style="min-height:22px"></td><td><input class="input" style="min-height:22px"></td><td></td></tr>
        <tr><td>2</td><td><input class="input mono" style="min-height:22px"></td><td><select class="input" style="min-height:22px"><option>CR</option><option>DR</option></select></td><td><input class="input mono" type="number" style="min-height:22px"></td><td><input class="input" style="min-height:22px"></td><td></td></tr>
      </tbody></table></div>
      <div style="margin-top:8px;display:flex;gap:6px">
        <button class="btn sm" onclick="addJELine()"><i class="fas fa-plus"></i> Add</button>
      </div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function addJELine(){
  const tb=$('#jeLines');const n=tb.children.length+1;
  const row=document.createElement('tr');
  row.innerHTML=`<td>${n}</td><td><input class="input mono" style="min-height:22px"></td><td><select class="input" style="min-height:22px"><option>DR</option><option>CR</option></select></td><td><input class="input mono" type="number" style="min-height:22px"></td><td><input class="input" style="min-height:22px"></td><td><button class="btn sm dgr" onclick="this.closest('tr').remove()">✕</button></td>`;
  tb.appendChild(row);
}

function postJournal(){
  const rows=$$('#jeLines tr').map(tr=>{const i=tr.querySelectorAll('input,select');return{acc:i[0].value.trim(),side:i[1].value,amt:validAmt(i[2].value),nar:i[3].value.trim()};}).filter(r=>r.acc||r.amt);
  if(rows.length<2){toast('At least two journal lines are required','e');return;}
  if(rows.some(r=>!r.acc||!r.amt)){toast('Every line needs an account/GL and a positive amount','e');return;}
  const sum=sd=>+rows.filter(r=>r.side===sd).reduce((t,r)=>t+r.amt,0).toFixed(2);
  const dr=sum('DR'),cr=sum('CR');
  if(dr!==cr){toast('Debits ('+fmtETB(dr)+') must equal credits ('+fmtETB(cr)+')','e');return;}
  const batch=$('#jeBatch').value.trim();
  if(!batch||state.journalEntries.some(j=>j.batch===batch)){toast('A unique batch number is required','e');return;}
  state.journalEntries.push({batch,lines:rows,amount:dr,maker:state.user.id,status:'PENDING_AUTHORIZATION',createdAt:nowISO()});
  submitForApproval('JOURNAL',batch,'Journal '+batch,dr,'ETB');
  logAudit('JOURNAL_ENTRY',batch,'Submitted '+fmtETB(dr));toast('Journal submitted for authorization','s');saveState();go('m8-batch-auth');
}
function authAllBatches(){
  let n=0;state.journalEntries.filter(j=>j.status==='PENDING_AUTHORIZATION').forEach(j=>{if(applyAuth('JOURNAL',j.batch,true,true))n++;});
  if(n)toast(n+' batch(es) authorized','s');else toast('Nothing authorized','w');saveState();mount();updateSidebarBadges();
}

R['m8-transfer']={render(){
  return `${actionStrip([{label:'Save',onclick:"postBT()",icon:'fas fa-save'},{spacer:true},{info:'Func: <code>PBDOTONL</code>'}])}
  <div class="section-band">Book Transfer (PBDOTONL)</div>
  <div class="content-wrap">
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Source Code</label><input class="input" value="ADDIS" readonly></div>
          <div class="form-row"><label class="req">Debit Account</label><input class="input mono" id="btDrAcc"></div>
        </div>
        <div>
          <div class="form-row"><label class="req">Credit Account</label><input class="input mono" id="btCrAcc"></div>
          <div class="form-row"><label class="req">Amount</label><input class="input mono" id="btAmt" type="number"></div>
        </div>
      </div>
      <div style="text-align:right"><button class="btn pri" onclick="postBT()"><i class="fas fa-exchange-alt"></i> Submit</button></div>
    </div>
    ${formFooter(state.user.name,'','UNAUTHORIZED','NEW')}
    </div>
  </div>`;
},init(){}};

function postBT(){
  const dr=$('#btDrAcc').value.trim(),cr=$('#btCrAcc').value.trim(),amt=validAmt($('#btAmt').value);
  if(!dr||!cr||!amt){toast('Debit account, credit account and a positive amount are required','e');return;}
  if(dr===cr){toast('Debit and credit accounts must differ','e');return;}
  const drA=findAcc(dr),crA=findAcc(cr);
  if(!drA||!crA){toast('Accounts not found','e');return;}
  if(drA.currency!==crA.currency){toast('Currency mismatch — use an FX transaction','e');return;}
  const blk=postingBlock(drA,'DR')||postingBlock(crA,'CR');if(blk){toast(blk,'e');return;}
  if(availBal(drA)<amt){toast('Insufficient available balance','e');return;}
  drA.balance=+(drA.balance-amt).toFixed(2);crA.balance=+(crA.balance+amt).toFixed(2);
  const g=ref('BT');
  recTxn({p:'BTD',type:'out',amount:amt,account:dr,name:drA.name,title:'Book Transfer (Dr) → '+cr,extra:{group:g}});
  recTxn({p:'BTC',type:'in',amount:amt,account:cr,name:crA.name,title:'Book Transfer (Cr) ← '+dr,extra:{group:g}});
  logAudit('BOOK_TRANSFER',g,dr+' → '+cr+' · '+fmtETB(amt));toast('Transfer posted: '+g,'s');saveState();mount();
}

R['m8-batch-auth']={render(){
  return `${actionStrip([{label:'Authorize All',onclick:"authAllBatches()",icon:'fas fa-check-double'},{spacer:true},{info:'Func: <code>DEDBTTOT</code>'}])}
  <div class="section-band">Batch Authorization (DEDBTTOT)</div>
  <div class="content-wrap">
    <div class="alert w"><span class="al-ic">⚠</span><div class="al-body"><b>End of Day</b>Authorize all created batch numbers.</div></div>
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th><th>Batch No</th><th>Branch</th><th style="text-align:right">Amount</th><th>Maker</th><th>Status</th><th style="text-align:right">Actions</th>
    </tr></thead><tbody>
      ${state.journalEntries.length?state.journalEntries.map(j=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(j.batch)}</td><td>${esc(state.branch.code)}</td>
        <td class="mono" style="text-align:right">${fmtETB(j.amount||0)}</td><td>${esc(j.maker||'MAKER')}</td><td>${bdg(j.status||'PENDING_AUTHORIZATION')}</td><td style="text-align:right">${j.status==='PENDING_AUTHORIZATION'?`<div class="grid-actions"><button class="btn sm ok" onclick="applyAuth('JOURNAL','${esc(j.batch)}',true)"><i class="fas fa-check"></i></button><button class="btn sm dgr" onclick="applyAuth('JOURNAL','${esc(j.batch)}',false)"><i class="fas fa-times"></i></button></div>`:''}</td>
      </tr>`).join(''):'<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--tx3)">No batches pending</td></tr>'}
    </tbody></table></div>
  </div>`;
},init(){}};

R['m8-reversal']={render(){
  return `${actionStrip([{label:'Reversal Request',onclick:"reverseSelected()",icon:'fas fa-undo'},{spacer:true},{info:'Func: <code>PBSOVIEW</code>'}])}
  <div class="section-band">Transaction Reversal (PBSOVIEW)</div>
  <div class="content-wrap" style="padding-top:0">
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th><th>Ref</th><th>Type</th><th style="text-align:right">Amount</th><th>Status</th><th>Date</th>
    </tr></thead><tbody>
      ${state.transactions.slice(0,15).map(t=>`<tr>
        <td class="chk"><input type="checkbox" data-id="${t.id}"></td>
        <td class="mono">${esc(t.ref)}</td><td>${esc(t.title)}</td>
        <td class="mono" style="text-align:right">${fmtETB(t.amount)}</td><td>${bdg(t.status||'POSTED')}</td>
        <td>${dstr(t.timestamp)}</td>
      </tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--tx3)">No transactions</td></tr>'}
    </tbody></table></div>
    <div style="margin-top:10px"><button class="btn dgr" onclick="reverseSelected()"><i class="fas fa-undo"></i> Reversal Request</button></div>
  </div>`;
},init(){}};

function reverseSelected(){
  const ids=$$('tbody input[data-id]:checked').map(c=>c.dataset.id);
  if(ids.length!==1){toast('Select exactly one transaction to reverse','w');return;}
  if(!['SUPER_ADMIN','BRANCH_MANAGER','CHECKER'].includes(state.user.role)){toast('Only supervisors can reverse transactions','e');return;}
  const t=state.transactions.find(x=>x.id===ids[0]);if(!t)return;
  if(t.status==='REVERSED'||t.reversalOf){toast('Already reversed, or is itself a reversal','e');return;}
  const grp=t.group?state.transactions.filter(x=>x.group===t.group&&x.status==='POSTED'):[t];
  const plan=[];
  for(const x of grp){
    const accNo=x.account||x.accountNo,tgt=findAcc(accNo)||state.userAccounts.find(u=>u.accountNo===accNo);
    if(!tgt){toast('Account '+accNo+' no longer exists','e');return;}
    const delta=x.type==='in'?-x.amount:+(x.amount+(x.fee||0)+(x.vat||0)).toFixed(2);
    plan.push({x,tgt,delta,accNo});
  }
  for(const p of plan){const avail=p.tgt.hold!==undefined?availBal(p.tgt):p.tgt.balance;if(avail+p.delta<0){toast('Reversal would overdraw '+p.accNo,'e');return;}}
  if(!confirm('Reverse '+t.ref+(grp.length>1?' (both legs)':'')+'?'))return;
  plan.forEach(p=>{
    p.tgt.balance=+(p.tgt.balance+p.delta).toFixed(2);p.x.status='REVERSED';
    state.transactions.unshift({id:uid('TX'),ref:ref('REV'),type:p.x.type==='in'?'out':'in',amount:Math.abs(p.delta),account:p.accNo,customerName:p.x.customerName,title:'Reversal of '+p.x.ref,status:'POSTED',reversalOf:p.x.id,timestamp:nowISO()});
  });
  logAudit('REVERSAL',t.ref,'Reversed by '+state.user.id);toast('Reversed','s');saveState();mount();
}

R['m9-si-list']={render(){
  return `${actionStrip([{label:'New SI',onclick:"newSI()",icon:'fas fa-plus'},{spacer:true},{info:'Func: <code>SIDTRONL</code>'}])}
  <div class="section-band">Standing Instructions (SIDTRONL)</div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">📋</span><div class="al-body"><b>5 SI Product Types</b>One-to-One · Sweep-In · Sweep-Out · Many-to-One · One-to-Many</div></div>
    <div class="tbl-wrap"><table class="oracle-tbl"><thead><tr>
      <th class="chk"><input type="checkbox" onclick="toggleAll(this)"></th>
      <th>SI Number</th><th>Product</th><th style="text-align:right">Amount</th><th>Frequency</th><th>Next</th><th>Status</th>
    </tr></thead><tbody>
      ${state.standingInstructions.length?state.standingInstructions.map(si=>`<tr>
        <td class="chk"><input type="checkbox"></td>
        <td class="mono">${esc(si.siNumber)}</td><td>${esc(si.product)}</td>
        <td class="mono" style="text-align:right">${fmtETB(si.amount)}</td><td>${esc(si.frequency)}</td>
        <td>${esc(si.nextExecution)}</td><td>${bdg(si.status)}</td>
      </tr>`).join(''):'<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--tx3)">No standing instructions</td></tr>'}
    </tbody></table></div>
    ${formFooter(state.user.name,'','AUTHORIZED','OPEN')}
  </div>`;
},init(){}};

function newSI(){
  const accOpts=state.accounts.map(a=>`<option value="${a.acc}">${esc(a.acc)} — ${esc(a.name)}</option>`).join('')||'<option value="">No accounts</option>';
  openModal('New Standing Instruction',
    `<div class="form-2col">
      <div>
        <div class="form-row"><label>SI Number</label><input class="input mono" id="siNum" value="${ref('SI')}" readonly></div>
        <div class="form-row"><label>Product</label>
          <select class="input" id="siProduct">
            <option value="SI ONE TO ONE">SI ONE TO ONE</option>
            <option value="SI SWEEPIN">SI SWEEPIN</option>
            <option value="SI SWEEPOUT">SI SWEEPOUT</option>
            <option value="SI MANY TO ONE">SI MANY TO ONE</option>
            <option value="SI ONE TO MANY">SI ONE TO MANY</option>
          </select></div>
        <div class="form-row"><label>Debit Account</label><select class="input" id="siDrAcc">${accOpts}</select></div>
        <div class="form-row"><label>Credit Account</label><select class="input" id="siCrAcc">${accOpts}</select></div>
      </div>
      <div>
        <div class="form-row"><label>Amount</label><input class="input mono" id="siAmt" type="number"></div>
        <div class="form-row"><label>Frequency</label><select class="input" id="siFreq"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
        <div class="form-row"><label>First Execution</label><input class="input" type="date" id="siFirst" value="${today()}"></div>
      </div>
    </div>`,
    `<button class="btn exit" onclick="closeModal()">Cancel</button><button class="btn ok" onclick="saveSI()">Create</button>`);
}

function saveSI(){
  const si={siNumber:$('#siNum').value,product:$('#siProduct').value,drAcc:$('#siDrAcc').value,
    crAcc:$('#siCrAcc').value,amount:num($('#siAmt').value),frequency:$('#siFreq').value,
    firstExecution:$('#siFirst').value,nextExecution:$('#siFirst').value,
    status:'ACTIVE',createdAt:nowISO()};
  state.standingInstructions.push(si);logAudit('CREATE_SI',si.siNumber,si.product);
  toast('SI created','s');closeModal();mount();
}

R['m10-bulk']={render(){
  return `${actionStrip([{label:'Upload',onclick:"toast('Uploading...','i')",icon:'fas fa-upload'},{spacer:true},{info:'Func: <code>DESALUPF</code>'}])}
  <div class="section-band">Bulk Upload (DESALUPF)</div>
  <div class="content-wrap">
    <div class="alert i"><span class="al-ic">📤</span><div class="al-body"><b>3-Step Process</b>1. DEDBARES (reserve) → 2. DEDUPMNT (master) → 3. DESALUPF (upload)</div></div>
    <div class="panel"><div class="panel-b">
      <div class="form-2col">
        <div>
          <div class="form-row"><label>Branch</label><input class="input mono" value="${esc(state.branch.code)}" readonly></div>
          <div class="form-row"><label>Batch</label><input class="input mono" value="9999"></div>
        </div>
        <div>
          <div class="form-row"><label>Interface</label><input class="input" value="SALUPDF" readonly></div>
          <div class="form-row"><label>Process</label><select class="input"><option>Process All</option><option>Validate</option></select></div>
        </div>
      </div>
      <div class="form-row"><label>CSV File</label><input type="file" accept=".csv,.xlsx" style="font-size:11px"></div>
      <div style="text-align:right"><button class="btn pri" onclick="toast('File uploaded','s')"><i class="fas fa-upload"></i> Upload</button></div>
    </div></div>
  </div>`;
},init(){}};
