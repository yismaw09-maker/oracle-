/* =====================================================================
   FLEXCUBE Navigation & Shell Controls
   ===================================================================== */
const SIDEBAR_NAV=[
  {id:'m1',num:'1',title:'Access & Security',icon:'🔐',items:[
    {route:'m1-security',label:'Security Overview',icon:'🛡'},
    {route:'m1-change-pass',label:'Change Password',icon:'🔑'},
    {route:'m1-settings',label:'User Settings',icon:'⚙'},
    {route:'m1-roles',label:'User Roles',icon:'👥'},
    {route:'m1-limits',label:'User Limits',icon:'📊'},
    {route:'m1-branches',label:'Allowed Branches',icon:'🏢'},
    {route:'m1-signoff',label:'Sign Off',icon:'⏻'}
  ]},
  {id:'m2',num:'2',title:'System Navigation',icon:'🧭',items:[
    {route:'m2-home',label:'Home Dashboard',icon:'🏠'},
    {route:'m2-interactions',label:'Interactions',icon:'💬'},
    {route:'m2-funcid',label:'Function ID Master',icon:'⌨'},
    {route:'m2-preferences',label:'Preferences',icon:'⚙'}
  ]},
  {id:'m3',num:'3',title:'Customer Onboarding',icon:'👤',items:[
    {route:'m3-kyc-new',label:'KYC Creation',icon:'➕',func:'STDKYCMN'},
    {route:'m3-kyc-list',label:'KYC Maintenance',icon:'📋',func:'STDKYCMN'},
    {route:'m3-kyc-auth',label:'KYC Auth',icon:'✔',badge:'m3-kyc-badge',func:'STSKYCMN'},
    {route:'m3-cust-new',label:'CIF Creation',icon:'➕',func:'STDCIF'},
    {route:'m3-cust-list',label:'CIF Maintenance',icon:'📋',func:'STDCIF'},
    {route:'m3-cust-auth',label:'CIF Auth',icon:'✔',badge:'m3-cust-badge',func:'STSCIF'},
    {route:'m3-joint',label:'Joint Holders',icon:'👥',func:'STDJHMN'},
    {route:'m3-legacy',label:'Legacy Mapping',icon:'🔗',func:'STDACMAP'},
    {route:'m3-fayda',label:'Fayda Verification',icon:'🆔'},
    {route:'m3-aml',label:'AML Screening',icon:'🔍'}
  ]},
  {id:'m4',num:'4',title:'Customer Accounts',icon:'💳',items:[
    {route:'m4-acc-list',label:'Accounts Summary',icon:'📋'},
    {route:'m4-acc-new',label:'Account Opening',icon:'➕',func:'STDCUSAC'},
    {route:'m4-acc-auth',label:'Account Auth',icon:'✔',badge:'m4-acc-badge',func:'STSCUSAC'},
    {route:'m4-acc-status',label:'Status Change',icon:'🔄',func:'STDSTCHN'},
    {route:'m4-acc-class',label:'Class Transfer',icon:'↔',func:'STDACTFR'},
    {route:'m4-acc-branch',label:'Branch Transfer',icon:'↗',func:'CSDACCTR'},
    {route:'m4-acc-closure',label:'Account Closure',icon:'✖'}
  ]},
  {id:'m5',num:'5',title:'Signature & Biometrics',icon:'✍',items:[
    {route:'m5-signature',label:'Signature Capture',icon:'✍',func:'STDCIFIS'},
    {route:'m5-biometric',label:'Biometric Capture',icon:'👆',func:'STDBIOCP'}
  ]},
  {id:'m6',num:'6',title:'Term Deposit (TD)',icon:'📅',items:[
    {route:'m6-td-list',label:'TD Accounts',icon:'📅'},
    {route:'m6-td-new',label:'TD Booking',icon:'➕',func:'STDCUSTD'},
    {route:'m6-td-sim',label:'TD Simulation',icon:'🧮',func:'STDTDSIM'},
    {route:'m6-td-topup',label:'TD Top-up',icon:'⬆',func:'STDTDTOP'},
    {route:'m6-td-redeem',label:'TD Redemption',icon:'💰',func:'ICDREDMN'},
    {route:'m6-td-cert',label:'TD Certificate',icon:'📜',func:'ICDBADHC'}
  ]},
  {id:'m7',num:'7',title:'Block / Lien',icon:'🔒',items:[
    {route:'m7-lien-list',label:'Active Blocks',icon:'🔒',func:'CADAMBLK'},
    {route:'m7-lien-new',label:'New Block',icon:'➕',func:'CADAMBLK'}
  ]},
  {id:'m8',num:'8',title:'OBPM — Non-Cash',icon:'📒',items:[
    {route:'m8-journal',label:'Journal Entry',icon:'📒',func:'DEDJNLON'},
    {route:'m8-transfer',label:'Book Transfer',icon:'📖',func:'PBDOTONL'},
    {route:'m8-batch-auth',label:'Batch Auth',icon:'✔',func:'DEDBTTOT'},
    {route:'m8-reversal',label:'Reversal',icon:'↩',func:'PBSOVIEW'}
  ]},
  {id:'m9',num:'9',title:'Standing Instructions',icon:'📋',items:[
    {route:'m9-si-list',label:'SI Management',icon:'📋',func:'SIDTRONL'}
  ]},
  {id:'m10',num:'10',title:'Bulk Upload',icon:'📤',items:[
    {route:'m10-bulk',label:'Bulk Processing',icon:'📤',func:'DESALUPF'}
  ]},
  {id:'m11',num:'11',title:'Customer 360°',icon:'🔭',items:[
    {route:'m11-c360',label:'360° View',icon:'🔭',func:'STDRETVW'}
  ]},
  {id:'m12',num:'12',title:'Inter-Branch (IBT)',icon:'🔗',items:[
    {route:'m12-ibt-request',label:'IBT Request',icon:'📥'},
    {route:'m12-ibt-liquidation',label:'IBT Liquidation',icon:'📤'},
    {route:'m12-ibt-input',label:'IBT Cash Input',icon:'💵'},
    {route:'m12-ibt-recon',label:'IBT & Claim Recon',icon:'🔗'}
  ]},
  {id:'m13',num:'13',title:'Stock / Inventory',icon:'📦',items:[
    {route:'m13-stock-list',label:'Stock Balance',icon:'📊',func:'IVDBALIN'},
    {route:'m13-stock-req',label:'Request Stock',icon:'📥',func:'IVDTXNIR'},
    {route:'m13-stock-order',label:'Order Stock',icon:'📦',func:'IVDTXNOR'},
    {route:'m13-stock-receive',label:'Receive Stock',icon:'📥'},
    {route:'m13-stock-issue',label:'Issue Stock',icon:'📤',func:'IVDTXNRI'},
    {route:'m13-stock-adjust',label:'Adjust Inventory',icon:'⚖',func:'IVDTXNAS'},
    {route:'m13-stock-confirm',label:'Confirm Receipts',icon:'✔',func:'IVDCONFR'}
  ]},
  {id:'m14',num:'14',title:'Cheque Book',icon:'📒',items:[
    {route:'m14-cheque-book',label:'Cheque Book Issue',icon:'📒',func:'CADCHBOO'},
    {route:'m14-cheque-detail',label:'Cheque Detail',icon:'📋',func:'CADCHKDT'},
    {route:'m14-stop-payment',label:'Stop Payment',icon:'🛑',func:'CADSPMNT'}
  ]},
  {id:'m15',num:'15',title:'CPO / Bankers Cheque',icon:'🏦',items:[
    {route:'m15-cpo-issue',label:'CPO Issue',icon:'🏦',func:'PIDINSIS'},
    {route:'m15-cpo-pay',label:'CPO Payment',icon:'💵',func:'PIDINSPY'},
    {route:'m15-cpo-stop',label:'Stop CPO',icon:'⏹',func:'PIDSTPAY'}
  ]},
  {id:'m16',num:'16',title:'OBBRN Cash Operations',icon:'💵',items:[
    {route:'m16-branch-ops',label:'Branch Operations',icon:'🏢'},
    {route:'m16-till',label:'Till Position',icon:'💼'},
    {route:'m16-vault',label:'Vault Position',icon:'🏦'},
    {route:'m16-breach',label:'Breach Limits',icon:'⚠'},
    {route:'m16-cash-move',label:'Cash Movement',icon:'💸'},
    {route:'m16-denom',label:'Denomination Exchange',icon:'🔢'}
  ]},
  {id:'m17',num:'17',title:'OBBRN Customer Txn',icon:'🔄',items:[
    {route:'m17-deposit',label:'Cash Deposit',icon:'↓'},
    {route:'m17-withdrawal',label:'Cash Withdrawal',icon:'↑'},
    {route:'m17-cheque-wd',label:'Cheque Withdrawal',icon:'📝'},
    {route:'m17-fx-pur-acc',label:'FX Purchase — Account',icon:'💱'},
    {route:'m17-fx-pur-walk',label:'FX Purchase — Walk-in',icon:'💱'},
    {route:'m17-fx-sale-acc',label:'FX Sale — Account',icon:'💱'},
    {route:'m17-fx-sale-walk',label:'FX Sale — Walk-in',icon:'💱'},
    {route:'m17-closure-cash',label:'Closure — Cash',icon:'✖'},
    {route:'m17-closure-bc',label:'Closure — Account/BC',icon:'✖'}
  ]},
  {id:'m18',num:'18',title:'OBBRN Miscellaneous',icon:'⚙',items:[
    {route:'m18-misc',label:'Miscellaneous Txn',icon:'⚙'}
  ]},
  {id:'m19',num:'19',title:'Authorization & Workflow',icon:'✔',items:[
    {route:'m19-work-queue',label:'Work Queue',icon:'☰',badge:'m19-apv-badge'},
    {route:'m19-approvals',label:'Pending Approvals',icon:'✔',badge:'m19-apv-badge'},
    {route:'m19-approval-log',label:'Approval Log',icon:'📜'},
    {route:'m19-reassign',label:'Reassign Txn',icon:'🔁'}
  ]},
  {id:'m20',num:'20',title:'Transaction Monitoring',icon:'📊',items:[
    {route:'m20-txn-log',label:'Transaction Log',icon:'📋'},
    {route:'m20-ej',label:'Electronic Journal',icon:'📰'},
    {route:'m20-service-journal',label:'Servicing Journal',icon:'📖'},
    {route:'m20-cust-service',label:'Customer Service',icon:'👤',func:'STDINVDT'},
    {route:'m20-clear-cache',label:'Clear Cache',icon:'🔄'}
  ]},
  {id:'m21',num:'21',title:'Reporting & Advice',icon:'📊',items:[
    {route:'m21-reports',label:'Reports Center',icon:'📊'},
    {route:'m21-advices',label:'Advices & Tickets',icon:'📨'}
  ]},
  {id:'m22',num:'22',title:'Branch End-of-Day',icon:'🌙',items:[
    {route:'m22-eod',label:'End of Day (EOD)',icon:'🌙'}
  ]},
  {id:'m23',num:'23',title:'Function ID Index',icon:'📚',items:[
    {route:'m23-help',label:'Function ID Reference',icon:'📚'}
  ]},
  {id:'m24',num:'24',title:'★ Analytics & BI',icon:'📈',new:true,items:[
    {route:'m24-analytics',label:'Analytics Dashboard',icon:'📈'},
    {route:'m24-kpi',label:'KPI Heatmap',icon:'🔥'},
    {route:'m24-trends',label:'Trend Analysis',icon:'📉'},
    {route:'m24-compliance',label:'Compliance Dashboard',icon:'🛡'}
  ]},
  {id:'m25',num:'25',title:'★ Task Manager',icon:'✅',new:true,items:[
    {route:'m25-tasks',label:'My Tasks',icon:'✅',badge:'m25-task-badge'},
    {route:'m25-calendar',label:'Calendar / Scheduler',icon:'📅'}
  ]},
  {id:'m26',num:'26',title:'★ Document Center',icon:'📁',new:true,items:[
    {route:'m26-docs',label:'Document Vault',icon:'📁'},
    {route:'m26-templates',label:'Templates Library',icon:'📝'}
  ]},
  {id:'m27',num:'27',title:'★ Communication Hub',icon:'📨',new:true,items:[
    {route:'m27-inbox',label:'Internal Messages',icon:'📨'},
    {route:'m27-sms',label:'SMS Templates',icon:'💬'},
    {route:'m27-email',label:'Email Templates',icon:'✉'}
  ]},
  {id:'m28',num:'28',title:'★ Channel Management',icon:'🏧',new:true,items:[
    {route:'m28-atm',label:'ATM Management',icon:'🏧'},
    {route:'m28-pos',label:'POS Terminals',icon:'💳'},
    {route:'m28-merchant',label:'Merchant Onboarding',icon:'🏬'}
  ]},
  {id:'m29',num:'29',title:'★ Wealth & Investments',icon:'💎',new:true,items:[
    {route:'m29-portfolio',label:'Investment Portfolio',icon:'💎'},
    {route:'m29-moneymarket',label:'Money Market',icon:'📊'},
    {route:'m29-securities',label:'Securities / Custody',icon:'📜'}
  ]},
  {id:'m30',num:'30',title:'★ System Health',icon:'⚙',new:true,items:[
    {route:'m30-health',label:'Health Monitor',icon:'⚙'},
    {route:'m30-api',label:'API Monitor',icon:'🔌'},
    {route:'m30-backup',label:'Backup Manager',icon:'💾'},
    {route:'m30-sessions',label:'Session Manager',icon:'👥'}
  ]},
  {id:'new',num:'+',title:'Additional Features',icon:'✨',items:[
    {route:'new-mobile-money',label:'Mobile Money',icon:'📱'},
    {route:'new-loans',label:'Loan Management',icon:'🏠'},
    {route:'new-cards',label:'Card Management',icon:'💳'},
    {route:'new-bills',label:'Bill Payments',icon:'🧾'},
    {route:'new-treasury',label:'Treasury / FX',icon:'📈'},
    {route:'new-trade',label:'Trade Finance',icon:'🚢'},
    {route:'new-islamic',label:'Islamic Banking',icon:'☪'},
    {route:'new-notifications',label:'Notification Center',icon:'🔔'}
  ]},
  {id:'ref',num:'⚙',title:'References',icon:'🏦',items:[
    {route:'ref-banks',label:'31 Licensed Banks',icon:'🏦'},
    {route:'ref-ift',label:'IFT / Interbank',icon:'🔗'},
    {route:'ref-my-accounts',label:'My Accounts',icon:'💰'},
    {route:'ref-rtgs',label:'RTGS Transfer',icon:'⚡'},
    {route:'ref-users',label:'User Management',icon:'👥'},
    {route:'ref-branches',label:'Branch Management',icon:'🏢'},
    {route:'ref-roles',label:'Roles & Permissions',icon:'🔑'},
    {route:'ref-reports',label:'Reports',icon:'📊'},
    {route:'ref-audit',label:'Audit Trail',icon:'🛡'},
    {route:'ref-search',label:'Universal Search',icon:'⌕'}
  ]}
];

let sidebarGroupState={};
function loadSidebarState(){try{const raw=localStorage.getItem(SIDEBAR_STATE_KEY);if(raw)sidebarGroupState=JSON.parse(raw);}catch(e){}}
function saveSidebarState(){try{localStorage.setItem(SIDEBAR_STATE_KEY,JSON.stringify(sidebarGroupState));}catch(e){}}

function buildSidebar(filter=''){
  const cur=(location.hash.replace('#/','').split('?')[0])||'m2-home';
  const container=$('#sbNav');if(!container)return;
  const lf=filter.toLowerCase();
  let html='';
  SIDEBAR_NAV.forEach(group=>{
    const items=group.items.filter(i=>!lf||i.label.toLowerCase().includes(lf)||(i.func||'').toLowerCase().includes(lf));
    if(lf&&items.length===0)return;
    const isOpen=lf?true:!sidebarGroupState[group.id];
    const hasActive=items.some(it=>it.route===cur);
    html+=`<div class="sb-group">
      <div class="sb-head ${isOpen?'':'closed'}" onclick="toggleSidebarGroup('${group.id}')">
        <span class="sb-num">${group.num}</span>
        <span class="sb-ic">${group.icon}</span>
        <span class="sb-title">${esc(group.title)}</span>
        ${hasActive?'<span class="sb-count">●</span>':''}
        <span class="sb-arrow">▾</span>
      </div>
      <div class="sb-group-items ${isOpen?'':'collapsed'}">
        ${items.map(item=>{
          const isActive=item.route===cur;
          const badgeAttr=item.badge?`data-nav-badge="${item.badge}"`:'';
          const funcTag=item.func?`<span class="nav-func">${item.func}</span>`:'';
          const newTag=group.new?'<span class="ni-new">★</span>':'';
          return `<div class="nav-item ${isActive?'on':''}" onclick="navigateTo('${item.route}')" title="${item.func||item.label}">
            <span class="ni-ic">${item.icon}</span>
            <span class="ni-txt">${item.label}</span>
            ${item.badge?`<span class="nav-badge zero" ${badgeAttr}>0</span>`:newTag||funcTag}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });
  container.innerHTML=html;
  updateSidebarBadges();
}

function filterMenu(v){buildSidebar(v);}
function toggleSidebarGroup(g){sidebarGroupState[g]=!sidebarGroupState[g];saveSidebarState();buildSidebar($('.sb-search input')?.value||'');}
function navigateTo(r){go(r);if(window.innerWidth<=900)closeSidebar();}

function toggleSidebar(){
  if(window.innerWidth>900){document.body.classList.toggle('sb-collapsed');return;}
  const sb=$('#sidebar'),ov=$('#sbOverlay');if(!sb)return;
  if(sb.classList.contains('open')){sb.classList.remove('open');ov.classList.remove('on');}else{sb.classList.add('open');ov.classList.add('on');}
}
function closeSidebar(){const sb=$('#sidebar'),ov=$('#sbOverlay');if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('on');}

function updateSidebarUser(){
  const a=initials(state.user.name||'--');
  ['sbUserAvatar','hdrUserAvatar','umAvatar'].forEach(id=>{const e=$('#'+id);if(e)e.textContent=a;});
  ['sbUserName','hdrUserName','umName'].forEach(id=>{const e=$('#'+id);if(e)e.textContent=state.user.name||'User';});
  const rl=$('#sbUserRole');if(rl)rl.textContent=(state.user.role||'USER').replace(/_/g,' ');
  const em=$('#umEmail');if(em)em.textContent=state.user.email||'';
}

const NAV_TABS=[
  {key:'home',label:'Home',route:'m2-home',icon:'fas fa-home'},
  {key:'interactions',label:'Interactions',route:'m2-interactions',icon:'fas fa-comments'},
  {key:'nextgen',label:'Next Gen UI',route:'m16-branch-ops',icon:'fas fa-bolt'},
  {key:'customer',label:'Customer',route:'m3-cust-list',icon:'fas fa-user'},
  {key:'workflow',label:'Workflow',route:'m19-work-queue',icon:'fas fa-check-double'},
  {key:'analytics',label:'Analytics',route:'m24-analytics',icon:'fas fa-chart-line'},
  {key:'preferences',label:'Preferences',route:'m1-settings',icon:'fas fa-cog'}
];

function buildNavTabs(){
  const cur=(location.hash.replace('#/','').split('?')[0])||'m2-home';
  let activeKey='home';
  const mm=cur.match(/^m(\d+)-/);const mn=mm?+mm[1]:0;
  if(mn===19||(mn>=20&&mn<=22))activeKey='workflow';
  else if(mn>=16&&mn<=18)activeKey='nextgen';
  else if((mn>=3&&mn<=5)||mn===11)activeKey='customer';
  else if(mn===24||mn===29||mn===30)activeKey='analytics';
  else if((mn>=25&&mn<=27)||cur==='m2-interactions')activeKey='interactions';
  else if(cur==='m1-settings'||cur==='m2-preferences')activeKey='preferences';
  const el=$('#hdrTabs');if(!el)return;
  el.innerHTML=NAV_TABS.map(t=>`<button class="hdr-tab ${t.key===activeKey?'active':''}" onclick="go('${t.route}')"><i class="${t.icon}"></i> ${t.label}</button>`).join('');
}

function runFuncId(){
  const val=($('#funcIdInput').value||'').trim().toUpperCase();
  if(!val){toast('Enter a Function ID','e');return;}
  const route=FUNC_MAP[val];
  if(route){logAudit('FUNC_CALL',val,route);toast('Opening '+val,'s');go(route);}
  else toast('Unknown Function ID: '+val,'e');
}

function globalSearchGo(){
  const q=$('#globalSearch').value.trim();
  if(!q){toast('Enter search query','e');return;}
  const fid=q.toUpperCase();if(FUNC_MAP[fid]){go(FUNC_MAP[fid]);return;}
  const c=findCust(q),a=findAcc(q);
  if(c){state.ui.lastCust=c.cif;go('m11-c360');return;}
  if(a){state.ui.lastAcc=a.acc;go('m4-acc-360');return;}
  state.ui.searchQ=q;go('ref-search');
}

function populateLoginBranches(){
  const sel=$('#lg-branch');if(!sel)return;
  sel.innerHTML=state.branches.length?state.branches.map(b=>`<option value="${b.code}">${b.code} — ${b.name}</option>`).join(''):'<option value="000">000 — System Default</option>';
}

function refreshShell(){buildNavTabs();buildSidebar($('.sb-search input')?.value||'');updateSidebarUser();}
function go(r){const h='#/'+r;if(location.hash===h)mount();else location.hash=h;closeSidebar();closeUserMenu();}

function logout(force){
  if(force!==true&&!confirm('Sign off from FLEXCUBE?'))return;
  logAudit('LOGOUT',state.session||'—',force===true?'Auto sign-off (idle)':'User signed off');
  state.user={id:'',name:'',role:''};state.session=null;_lastRoute=null;clearTimeout(_idle);closeModal();closeUserMenu();
  try{localStorage.removeItem(SESSION_KEY);}catch(e){}
  $('#app').classList.remove('on');$('#login').classList.remove('hide');
  $('#lg-user').value='';$('#lg-pass').value='';
  setTimeout(()=>$('#lg-user').focus(),200);toast('Signed off','s');
}

function toggleUserMenu(e){e.stopPropagation();$('#hdrUserMenu').classList.toggle('on');}
function closeUserMenu(){$('#hdrUserMenu').classList.remove('on');}
document.addEventListener('click',e=>{if(!e.target.closest('.hdr-user')&&!e.target.closest('.hdr-user-menu'))closeUserMenu();});

function togglePass(){
  const p=$('#lg-pass'),i=$('#togglePassIcon');
  if(p.type==='password'){p.type='text';i.className='fas fa-eye-slash';}
  else{p.type='password';i.className='fas fa-eye';}
}

function showLoginError(m){const e=$('#loginError');$('#loginErrorText').textContent=m;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),5000);}
function showLoginSuccess(m){const s=$('#loginSuccess');$('#loginSuccessText').textContent=m;s.classList.add('show');setTimeout(()=>s.classList.remove('show'),3000);}

function doLogin(){
  const uEl=$('#lg-user'),pEl=$('#lg-pass'),btn=$('#loginBtn');
  if(btn.disabled)return;
  const user=uEl.value.trim(),pass=pEl.value;
  if(!user){showLoginError('User ID required');uEl.focus();return;}
  if(!pass){showLoginError('Password required');pEl.focus();return;}
  if(Date.now()<_lockUntil){showLoginError('Too many attempts. Try again in '+Math.ceil((_lockUntil-Date.now())/1000)+'s');return;}
  btn.disabled=true;btn.classList.add('loading');
  const iEl=$('.btn-icon',btn);if(iEl)iEl.style.display='none';
  const reset=()=>{btn.disabled=false;btn.classList.remove('loading');if(iEl)iEl.style.display='';};
  setTimeout(()=>{
    const found=state.users.find(u=>u.username.toUpperCase()===user.toUpperCase()||u.id.toUpperCase()===user.toUpperCase());
    if(!found||found.status!=='ACTIVE'||found.password!==pass){
      reset();_failCount++;logAudit('LOGIN_FAILED',user);
      if(_failCount>=5){_lockUntil=Date.now()+30000;_failCount=0;logAudit('LOGIN_LOCKED',user,'5 failed attempts');showLoginError('Too many failed attempts. Locked for 30 seconds.');return;}
      showLoginError('Invalid User ID or password');pEl.value='';pEl.focus();return;
    }
    _failCount=0;
    const bv=$('#lg-branch').value||'000';
    state.session=uid('SESS');
    const {password:_pw,...safe}=found;state.user={...safe,prevLogin:found.lastLogin,lastLogin:nowISO()};
    const ix=state.users.findIndex(u=>u.id===found.id);if(ix>=0)state.users[ix].lastLogin=nowISO();
    if(bv==='000')state.branch={code:'000',name:'System Default'};
    else{const b=state.branches.find(x=>x.code===bv);state.branch=b?{code:b.code,name:b.name}:{code:'000',name:'System Default'};}
    const tp=($('#lg-till').value||'').split('|');state.till={id:tp[0],code:tp[1],ccy:tp[2]};
    if($('#lg-remember').checked){try{localStorage.setItem(SESSION_KEY,JSON.stringify({userId:found.id}));}catch(e){}}
    else{try{localStorage.removeItem(SESSION_KEY);}catch(e){}}
    logAudit('LOGIN',state.session,'Login as '+state.user.role);saveState();
    showLoginSuccess('Login successful!');
    setTimeout(()=>{
      $('#login').classList.add('hide');$('#app').classList.add('on');
      refreshShell();enterApp();resetIdle();
      toast('Welcome, '+state.user.name,'s');reset();
    },600);
  },500);
}

function enterApp(){const k=location.hash.replace('#/','').split('?')[0];if(!k||!R[k])location.hash='#/m2-home';mount();}
function resetIdle(){clearTimeout(_idle);if(!state.session)return;_idle=setTimeout(()=>{if(state.session){logout(true);toast('Signed off after 15 minutes of inactivity','w');}},IDLE_MS);}
function fmtBizDate(){const p=state.businessDate.split('-');return p[2]+'-'+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+p[1]-1]+'-'+p[0];}

function toast(msg,kind=''){
  const t=document.createElement('div');t.className='toast '+kind;
  const ic=kind==='e'?'⛔':kind==='w'?'⚠':kind==='s'?'✓':'ℹ';
  t.innerHTML=`<span class="tst-ic">${ic}</span><span>${esc(msg)}</span>`;
  $('#toasts').appendChild(t);setTimeout(()=>t.remove(),3800);
}

function openModal(title,body,footer){
  $('#modalBox').innerHTML=`<div class="modal-h"><h3>${title}</h3><button class="close" onclick="closeModal()">✕</button></div><div class="modal-b">${body}</div>${footer?`<div class="modal-f">${footer}</div>`:''}`;
  $('#modal').classList.add('on');document.body.style.overflow='hidden';
}
function closeModal(){$('#modal').classList.remove('on');document.body.style.overflow='';otpCallback=null;}
function setTheme(t){state.theme=t;document.documentElement.setAttribute('data-theme',t);const b=$('#themeBtn');if(b)b.innerHTML=t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';saveState();}
function toggleTheme(){setTheme(state.theme==='dark'?'light':'dark');}
function setLang(v){state.lang=v;saveState();mount();}
function footerOk(btn){const w=btn.closest('.content-wrap');const p=w&&w.querySelector('.btn.pri:not(.sm)');if(p)p.click();else toast('Nothing to save on this screen','i');}
function toggleAll(el){const t=el.closest('table');if(t)t.querySelectorAll('tbody input[type=checkbox]').forEach(c=>{c.checked=el.checked;});}
function setFont(s,btn){state.font=s;document.body.className='font-'+s;if(btn){btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));btn.classList.add('on');}saveState();}
function actionStrip(items){
  return `<div class="action-strip">${items.map(it=>it.spacer?'<div class="spacer"></div>':it.sep?'<div class="as-sep"></div>':it.info?`<div class="info">${it.info}</div>`:
    `<a class="as-item ${it.active?'active':''}" onclick="${it.onclick||''}">${it.icon?`<i class="${it.icon}"></i>`:''} ${it.label}</a>`).join('')}</div>`;
}
function emptyState(icon,title,msg){return `<div class="empty"><div class="ico">${icon}</div><b>${esc(title)}</b>${msg?'<span>'+esc(msg)+'</span>':''}</div>`;}
const bdg=s=>`<span class="bdg ${({POSTED:'ok',AUTHORIZED:'ok',ACTIVE:'ok',ONLINE:'ok',CLOSED:'mu',PENDING_AUTHORIZATION:'wn',PENDING:'wn',OPEN:'wn',REJECTED:'dg',UNAUTHORIZED:'wn',VERIFIED:'ok',DRAFT:'mu',MATURED:'in',ISSUED:'in',RELEASED:'mu',LOW_CASH:'wn',OFFLINE:'dg',REVERSED:'dg',PAID:'ok',STOPPED:'dg',POSTED:'ok'})[s]||'mu'}">${esc(s||'—')}</span>`;

function formFooter(maker,checker,auth,rec){
  return `<div class="footer-status">
    <div class="fs-item"><label>Maker</label><span>${esc(maker||state.user.name||PLACEHOLDER)}</span></div>
    <div class="fs-item"><label>Checker</label><span>${esc(checker||PLACEHOLDER)}</span></div>
    <div class="fs-item"><label>Date Time</label><span>${dtstr(nowISO())}</span></div>
    <div class="fs-item"><label>Mod No</label><span>1</span></div>
    <div class="fs-item"><label>Record Status</label><span class="${rec==='AUTHORIZED'?'ok':''}">${esc(rec||'OPEN')}</span></div>
    <div class="fs-item"><label>Auth Status</label><span class="${auth==='AUTHORIZED'?'ok':auth==='UNAUTHORIZED'?'warn':''}">${esc(auth||'UNAUTHORIZED')}</span></div>
    <div class="exit-wrap"><button class="btn ok" onclick="footerOk(this)"><i class="fas fa-check"></i> OK</button><button class="btn exit" onclick="go('m2-home')"><i class="fas fa-sign-out-alt"></i> Exit</button></div>
  </div>`;
}

function switchTab(el,id){
  const strip=el.parentElement;
  strip.querySelectorAll('.tab-item').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const wrap=strip.parentElement;
  wrap.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  const t=wrap.querySelector('#'+id);if(t)t.classList.add('active');
}
