/* =====================================================================
   FLEXCUBE NEO v14.5 — Universal Core Banking Engine
   ===================================================================== */
const PLACEHOLDER='—', UNKNOWN='Not Provided';
const RTGS_MIN=200000, RTGS_SERVICE_FEE=100, RTGS_VAT_RATE=0.15;
const VALID_OTP='123456';
const RTGS_MAX=50000000, CASH_WD_LIMIT=500000, IDLE_MS=15*60*1000;
const ENFORCE_MAKER_CHECKER=true;
const CHECKER_ROLES=['CHECKER','BRANCH_MANAGER','SUPER_ADMIN'];
let _failCount=0,_lockUntil=0,_lastRoute=null,_idle=null;
const SESSION_KEY='fx-neo-s145-sess';
const SIDEBAR_STATE_KEY='fx-neo-s145-sb';
const STORAGE_KEY='fx-neo-v145';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>(s===null||s===undefined)?PLACEHOLDER:String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeText=(s,fb=UNKNOWN)=>(s===null||s===undefined||s==='')?fb:String(s);
const money=(v,c='ETB')=>Number(v||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+(c||'ETB');
const fmtETB=n=>'ETB '+Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const num=v=>{const n=parseFloat(String(v??'').replace(/,/g,''));return isNaN(n)?0:n;};
const nowISO=()=>new Date().toISOString();
const pad2=n=>String(n).padStart(2,'0');
const dstr=d=>{const x=d?new Date(d):new Date();return x.getFullYear()+'-'+pad2(x.getMonth()+1)+'-'+pad2(x.getDate());};
const tstr=d=>{const x=d?new Date(d):new Date();return pad2(x.getHours())+':'+pad2(x.getMinutes())+':'+pad2(x.getSeconds());};
const dtstr=d=>d?(dstr(d)+' '+tstr(d)):PLACEHOLDER;
const uid=p=>p+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
const today=()=>state.businessDate;
const initials=n=>safeText(n,'--').split(' ').map(x=>x[0]||'').join('').slice(0,2).toUpperCase()||'--';
function ref(p){const d=state.businessDate.replace(/-/g,'');state.seq=(state.seq||0)+1;return p+'-'+d+'-'+String(state.seq).padStart(8,'0');}
function genCustomerNo(){const m=state.customers.reduce((a,c)=>Math.max(a,parseInt(c.cif,10)||0),1000000);return String(m+1);}
function genAccountNo(){
  const br=/^\d{3}$/.test(state.branch.code)?state.branch.code:'000';let n;
  do{n=br+String(Math.floor(Math.random()*1e11)).padStart(11,'0');}while(state.accounts.some(a=>a.acc===n)||state.tdAccounts.some(t=>t.tdAcc===n));
  return n;
}
function numberToEnglishWords(amount){
  const total=Math.round(Number(amount||0)*100);
  if(!total)return 'ZERO BIRR AND ZERO CENTS';
  const birr=Math.floor(total/100),cents=total%100;
  const ones=['','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN'];
  const tens=['','','TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY'];
  const conv=n=>{if(n<20)return ones[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?'-'+ones[n%10]:'');if(n<1e3)return ones[Math.floor(n/100)]+' HUNDRED'+(n%100?' AND '+conv(n%100):'');if(n<1e6)return conv(Math.floor(n/1e3))+' THOUSAND'+(n%1e3?' '+conv(n%1e3):'');if(n<1e9)return conv(Math.floor(n/1e6))+' MILLION'+(n%1e6?' '+conv(n%1e6):'');return conv(Math.floor(n/1e9))+' BILLION'+(n%1e9?' '+conv(n%1e9):'');};
  return (birr?conv(birr):'ZERO')+' BIRR AND '+(cents?conv(cents):'ZERO')+' CENTS';
}

const BANK_MASTER=[
{bankId:'ETB-001',name:'Commercial Bank of Ethiopia',nameAm:'የኢትዮጵያ ንግድ ባንክ',type:'Public',swiftBic:'CBETETAA',website:'https://www.combanketh.et/',color:'#562071',color2:'#FFC72C',short:'CBE'},
{bankId:'ETB-002',name:'Awash Bank',nameAm:'አዋሽ ባንክ',type:'Private',swiftBic:'AWINETAA',website:'https://www.awashbank.com/',color:'#F37021',color2:'#002D62',short:'AWB'},
{bankId:'ETB-003',name:'Dashen Bank',nameAm:'ዳሽን ባንክ',type:'Private',swiftBic:'DASHETAA',website:'https://www.dashenbanksc.com/',color:'#003366',color2:'#F5B335',short:'DB'},
{bankId:'ETB-004',name:'Bank of Abyssinia',nameAm:'የአቢሲኒያ ባንክ',type:'Private',swiftBic:'ABYSETAA',website:'https://www.bankofabyssinia.com/',color:'#800000',color2:'#DAA520',short:'BOA'},
{bankId:'ETB-005',name:'Hibret Bank',nameAm:'ሕብረት ባንክ',type:'Private',swiftBic:'UNTDETAA',website:'https://www.hibretbank.com.et/',color:'#008080',color2:'#FDB813',short:'HB'},
{bankId:'ETB-006',name:'Wegagen Bank',nameAm:'ወጋገን ባንክ',type:'Private',swiftBic:'WEGAETAA',website:'https://www.wegagen.com/',color:'#EA7600',color2:'#231F20',short:'WB'},
{bankId:'ETB-007',name:'Nib International Bank',nameAm:'ኒብ ኢንተርናሽናል ባንክ',type:'Private',swiftBic:'NIBIETAA',website:'https://www.nibbanksc.com/',color:'#1A3E6D',color2:'#F58220',short:'NIB'},
{bankId:'ETB-008',name:'Lion International Bank',nameAm:'አንበሳ ኢንተርናሽናል ባንክ',type:'Private',swiftBic:'LIBSETAA',website:'https://www.anbesabank.com/',color:'#A6192E',color2:'#FFB81C',short:'LIB'},
{bankId:'ETB-009',name:'Cooperative Bank of Oromia',nameAm:'የኦሮሚያ ህብረት ሥራ ባንክ',type:'Private',swiftBic:'CBORETAA',website:'https://coopbankoromia.com.et/',color:'#9C1B20',color2:'#00843D',short:'COOP'},
{bankId:'ETB-010',name:'Oromia Bank',nameAm:'ኦሮሚያ ባንክ',type:'Private',swiftBic:'ORIRETAA',website:'https://www.oromiabank.com/',color:'#CE1126',color2:'#007A3D',short:'OB'},
{bankId:'ETB-011',name:'Zemen Bank',nameAm:'ዘመን ባንክ',type:'Private',swiftBic:'ZEMEETAA',website:'https://www.zemenbank.com/',color:'#1F2A44',color2:'#C5A059',short:'ZB'},
{bankId:'ETB-012',name:'Abay Bank',nameAm:'አባይ ባንክ',type:'Private',swiftBic:'ABAYETAA',website:'https://www.abaybank.com.et/',color:'#0066B3',color2:'#FDB913',short:'ABAY'},
{bankId:'ETB-013',name:'Addis Bank',nameAm:'አዲስ ባንክ',type:'Private',swiftBic:'ABSCETAA',website:'https://www.addisbanksc.com/',color:'#2E3192',color2:'#ED1C24',short:'ADB'},
{bankId:'ETB-014',name:'Berhan Bank',nameAm:'ብርሃን ባንክ',type:'Private',swiftBic:'BERHETAA',website:'https://berhanbanksc.com/',color:'#F39200',color2:'#1D1D1B',short:'BB'},
{bankId:'ETB-015',name:'Bunna Bank',nameAm:'ቡና ባንክ',type:'Private',swiftBic:'BUNAETAA',website:'https://www.bunnabanksc.com/',color:'#5C3A21',color2:'#E0A96D',short:'BUN'},
{bankId:'ETB-016',name:'Enat Bank',nameAm:'እናት ባንክ',type:'Private',swiftBic:'ENATETAA',website:'https://www.enatbanksc.com/',color:'#E4007D',color2:'#3D195B',short:'EB'},
{bankId:'ETB-017',name:'Global Bank Ethiopia',nameAm:'ግሎባል ባንክ ኢትዮጵያ',type:'Private',swiftBic:'DEGAETAA',website:'https://www.globalbankethiopia.com/',color:'#005A9C',color2:'#E30613',short:'GBE'},
{bankId:'ETB-018',name:'ZamZam Bank',nameAm:'ዘምዘም ባንክ',type:'Interest-Free',swiftBic:'ZAMZETAA',website:'https://zamzambank.com/',color:'#008751',color2:'#D4AF37',short:'ZZB'},
{bankId:'ETB-019',name:'Hijra Bank',nameAm:'ሂጅራ ባንክ',type:'Interest-Free',swiftBic:'HIJRETAA',website:'https://www.hijra-bank.com/',color:'#0B6623',color2:'#C5A059',short:'HJB'},
{bankId:'ETB-020',name:'Shabelle Bank',nameAm:'ሻቤሌ ባንክ',type:'Interest-Free',swiftBic:'SBEEETAA',website:'https://www.shabellebank.com/',color:'#006837',color2:'#00A651',short:'SBL'},
{bankId:'ETB-021',name:'Siinqee Bank',nameAm:'ሲንቄ ባንክ',type:'Private',swiftBic:'SINQETAA',website:'https://www.siinqeebank.com/',color:'#D4AF37',color2:'#1A1A1A',short:'SQB'},
{bankId:'ETB-022',name:'Tsehay Bank',nameAm:'ፀሐይ ባንክ',type:'Private',swiftBic:'TSCPETAA',website:'https://tsehaybank.com.et/',color:'#FDB813',color2:'#004A99',short:'TSH'},
{bankId:'ETB-023',name:'Ahadu Bank',nameAm:'አሃዱ ባንክ',type:'Private',swiftBic:'AHUUETAA',website:'https://www.ahadubank.com/',color:'#1B365D',color2:'#C5A059',short:'AHB'},
{bankId:'ETB-024',name:'Goh Betoch Bank',nameAm:'ጎህ ቤቶች ባንክ',type:'Private',swiftBic:'GOBTETAA',website:'https://www.gohbetbank.com/',color:'#8B2332',color2:'#D9822B',short:'GBB'},
{bankId:'ETB-025',name:'Tsedey Bank',nameAm:'ፀደይ ባንክ',type:'Private',swiftBic:'TSDYETAA',website:'https://tsedeybank-sc.com/',color:'#2E7D32',color2:'#F57C00',short:'TDB'},
{bankId:'ETB-026',name:'Amhara Bank',nameAm:'አማራ ባንክ',type:'Private',swiftBic:'AMHRETAA',website:'https://www.amharabank.com.et/',color:'#005696',color2:'#FED100',short:'AMB'},
{bankId:'ETB-027',name:'Gadaa Bank',nameAm:'ጋዳ ባንክ',type:'Private',swiftBic:'GDAAETAA',website:'https://www.gadaabank.com.et/',color:'#DA251D',color2:'#1A1A1A',short:'GDB'},
{bankId:'ETB-028',name:'Omo Bank',nameAm:'ኦሞ ባንክ',type:'Private',swiftBic:'OSCOETAA',website:'https://www.omobanksc.com/',color:'#007A3D',color2:'#FDB813',short:'OMO'},
{bankId:'ETB-029',name:'Sidama Bank',nameAm:'ሲዳማ ባንክ',type:'Private',swiftBic:'SDMAETAA',website:'https://www.sidamabanksc.com/',color:'#E30613',color2:'#009640',short:'SDB'},
{bankId:'ETB-030',name:'Rammis Bank',nameAm:'ራሚስ ባንክ',type:'Private',swiftBic:'RMSIETAA',website:'https://www.rammisbank.et/',color:'#1B4D3E',color2:'#D4AF37',short:'RMB'},
{bankId:'ETB-031',name:'Siket Bank',nameAm:'ሲኬት ባንክ',type:'Private',swiftBic:'SSHCETAA',website:'https://siketbank.com/',color:'#2C3E50',color2:'#3498DB',short:'SKB'}
];

function bankBadgeSvg(b){
  const bg=b.color||'#C74634';const fg=b.color2||'#FFFFFF';const txt=b.short||(b.name||'BK').slice(0,3).toUpperCase();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="${encodeURIComponent(bg)}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="${encodeURIComponent(fg)}" font-family="Arial,sans-serif" font-weight="900" font-size="${txt.length>3?14:17}">${txt}</text></svg>`;
}

function bankLogoHtml(b){
  const d=(b.website||'').replace(/^https?:\/\//i,'').replace(/^www\./i,'').split('/')[0];
  if(!d)return `<span class="bank-avatar" style="background:${b.color||'#C74634'};color:#fff">${b.short||'BK'}</span>`;
  const svgBadge=bankBadgeSvg(b);
  const chain=[
    `https://icons.duckduckgo.com/ip3/${d}.ico`,
    `https://unavatar.io/${d}?fallback=false`,
    svgBadge
  ].join('|');
  const primary=`https://www.google.com/s2/favicons?domain=${d}&sz=128`;
  return `<img src="${primary}" data-chain="${chain}" data-domain="${d}" onerror="bankLogoFallback(this)" alt="${esc(b.name)}" loading="lazy" class="bank-live-logo">`;
}

function bankLogoFallback(img){
  const chain=(img.dataset.chain||'').split('|').filter(Boolean);
  const next=chain.shift();
  if(next){
    img.dataset.chain=chain.join('|');
    img.src=next;
    return;
  }
  const p=img.parentElement;
  img.style.display='none';
  if(p){
    const d=img.dataset.domain||'BK';
    p.innerHTML=`<div class="bank-badge-fallback">${d.slice(0,3).toUpperCase()}</div>`;
  }
}
window.bankLogoFallback=bankLogoFallback;
window.bankBadgeSvg=bankBadgeSvg;
window.bankLogoHtml=bankLogoHtml;

const CURRENCIES=[{c:'ETB',n:'Ethiopian Birr'},{c:'USD',n:'US Dollar'},{c:'EUR',n:'Euro'},{c:'GBP',n:'Pound Sterling'},{c:'AED',n:'UAE Dirham'},{c:'SAR',n:'Saudi Riyal'}];
const ACCOUNT_CLASSES=[
  {code:'SAVPRV',name:'PRIVATE_SAVINGS',desc:'Private Savings Account',ccy:'ETB',type:'CASA'},
  {code:'SAVPRE',name:'PREMIUM_SAVINGS',desc:'Premium Savings Account',ccy:'ETB',type:'CASA'},
  {code:'SAVYTH',name:'YOUTH_SAVINGS',desc:'Youth Savings Account',ccy:'ETB',type:'CASA'},
  {code:'DEDPRV',name:'PRIVATE_DEMAND',desc:'Private Demand / Current',ccy:'ETB',type:'CASA'},
  {code:'DEDCOR',name:'CORPORATE_DEMAND',desc:'Corporate Current',ccy:'ETB',type:'CASA'},
  {code:'FDPVTS',name:'PRIVATE_FIXED_DEPOSIT',desc:'Private Fixed Deposit',ccy:'ETB',type:'TD'},
  {code:'FDCORP',name:'CORPORATE_FIXED_DEPOSIT',desc:'Corporate Fixed Deposit',ccy:'ETB',type:'TD'},
  {code:'AGROD',name:'AGRI_OVERDRAFT',desc:'Agricultural Production Overdraft',ccy:'ETB',type:'LOAN'},
  {code:'IFB001',name:'IFB_SAVINGS',desc:'Interest-Free Savings',ccy:'ETB',type:'CASA'},
  {code:'IFBTD1',name:'IFB_TERM_DEPOSIT',desc:'Interest-Free Term Deposit',ccy:'ETB',type:'TD'},
  {code:'DIASPR',name:'DIASPORA_ACCOUNT',desc:'Diaspora Foreign Currency Account',ccy:'USD',type:'CASA'},
  {code:'RETENT',name:'RETENTION_ACCOUNT',desc:'Export Retention Account',ccy:'USD',type:'CASA'},
  {code:'FCSAVE',name:'FC_SAVINGS',desc:'Foreign Currency Savings',ccy:'USD',type:'CASA'}
];
const ID_TYPES=['National ID (Kebele)','Passport','Driving License','Fayda National ID','Residence Permit','Employee ID'];

const FUNC_MAP={
  'STDKYCMN':'m3-kyc-new','STSKYCMN':'m3-kyc-auth','STDCIF':'m3-cust-new','STSCIF':'m3-cust-auth','STDRETVW':'m11-c360',
  'STDSPLRN':'m3-cust-new','STDACMAP':'m3-legacy','STDCSAC':'m4-acc-new','STDCUSAC':'m4-acc-new','STSCUSAC':'m4-acc-auth',
  'STDSTCHN':'m4-acc-status','STDACTFR':'m4-acc-class','CSDACCTR':'m4-acc-branch','STDJHMNTT':'m3-joint','STDJHMN':'m3-joint',
  'STSJHMNTT':'m3-joint','STSJHMN':'m3-joint','CSDJNTHD':'m3-joint','STDCIFIS':'m5-signature','STSCIFIS':'m5-signature',
  'STDBIOCP':'m5-biometric','STDCUSTD':'m6-td-new','STSCUSTD':'m6-td-list','STDTDSIM':'m6-td-sim','STDTDTOP':'m6-td-topup',
  'STSTDTOP':'m6-td-topup','ICDREDMN':'m6-td-redeem','ICSREDMN':'m6-td-redeem','ICDBADHC':'m6-td-cert','STDAMBLK':'m7-lien-new',
  'CADAMBLK':'m7-lien-new','DEDJNLON':'m8-journal','DEDBTTOT':'m8-batch-auth','PBDOTONL':'m8-transfer','PBSOVIEW':'m8-reversal',
  'PBSTRNRV':'m8-reversal','SIDTRONL':'m9-si-list','PBSOTONL':'m9-si-list','DEDBARES':'m10-bulk','DEDUPMNT':'m10-bulk',
  'DESALUPF':'m10-bulk','IVDTXNIR':'m13-stock-req','IVDTXNBR':'m13-stock-req','IVDTXNOR':'m13-stock-order',
  'IVDTXNRI':'m13-stock-issue','IVDTXNAS':'m13-stock-adjust','IVDCONFR':'m13-stock-confirm','IVDBALIN':'m13-stock-list',
  'CADCHBOO':'m14-cheque-book','CADCHKDT':'m14-cheque-detail','CADSPMNT':'m14-stop-payment','PIDINSIS':'m15-cpo-issue',
  'PIDINSPY':'m15-cpo-pay','PIDSTPAY':'m15-cpo-stop','STDINVDT':'m20-cust-service'
};

const state={
  session:null,seq:0,businessDate:'2026-10-01',entity:'ENTITY_ID1',
  user:{id:'',name:'',role:''},branch:{code:'000',name:'System Default'},
  branches:[],users:[],roles:[],
  customers:[],accounts:[],kycRecords:[],tdAccounts:[],
  standingInstructions:[],chequeBooks:[],stockInventory:[],
  lienBlocks:[],journalEntries:[],bulkUploads:[],cpoInstruments:[],
  signatures:[],biometrics:[],
  approvals:[],pendingAuth:[],audit:[],alerts:[],notifications:[],
  transactions:[],userAccounts:[],primaryAccountIndex:0,
  banks:BANK_MASTER,theme:'light',lang:'am',font:'m',
  tasks:[],documents:[],messages:[],atms:[],posTerminals:[],merchants:[],
  investments:[],apiLogs:[],systemHealth:{cpu:12,mem:47,disk:58,uptime:'99.98%'},
  ui:{lastCust:null,lastAcc:null,lastKyc:null,lastTd:null,searchQ:'',faydaChecked:null}
};
let _saveT=null;
function saveState(){clearTimeout(_saveT);_saveT=setTimeout(saveStateNow,200);}
function saveStateNow(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({
  users:state.users,roles:state.roles,branches:state.branches,customers:state.customers,
  accounts:state.accounts,transactions:state.transactions,audit:state.audit.slice(0,500),
  approvals:state.approvals,userAccounts:state.userAccounts,pendingAuth:state.pendingAuth,
  businessDate:state.businessDate,seq:state.seq,theme:state.theme,lang:state.lang,font:state.font,
  kycRecords:state.kycRecords,tdAccounts:state.tdAccounts,standingInstructions:state.standingInstructions,
  chequeBooks:state.chequeBooks,stockInventory:state.stockInventory,lienBlocks:state.lienBlocks,
  journalEntries:state.journalEntries,bulkUploads:state.bulkUploads,cpoInstruments:state.cpoInstruments,
  signatures:state.signatures,biometrics:state.biometrics,notifications:state.notifications,alerts:state.alerts,
  tasks:state.tasks,documents:state.documents,messages:state.messages,atms:state.atms,posTerminals:state.posTerminals,
  merchants:state.merchants,investments:state.investments,apiLogs:state.apiLogs
}));}catch(e){}}
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);if(!r)return false;Object.assign(state,JSON.parse(r));return true;}catch(e){return false;}}

function seed(){
  state.branches=[];state.customers=[];state.accounts=[];state.transactions=[];
  state.userAccounts=[];state.pendingAuth=[];state.kycRecords=[];state.tdAccounts=[];
  state.standingInstructions=[];state.chequeBooks=[];state.stockInventory=[];
  state.lienBlocks=[];state.journalEntries=[];state.bulkUploads=[];state.cpoInstruments=[];
  state.signatures=[];state.biometrics=[];state.notifications=[];state.alerts=[];state.approvals=[];
  state.tasks=[];state.documents=[];state.messages=[];state.atms=[];state.posTerminals=[];state.merchants=[];
  state.investments=[];state.apiLogs=[];
  state.audit=[{id:uid('AUD'),ts:nowISO(),user:'SYSTEM',role:'SYSTEM',action:'SYSTEM_INIT',entity:'System',detail:'FLEXCUBE Neo v14.5 initialized',ip:'127.0.0.1',session:'SYS'}];
  state.users=[
    {id:'SUPERADMIN',username:'SUPERADMIN',name:'Super Admin',email:'admin@bank.com',phone:'+251-911-000-001',employeeId:'EMP-001',role:'SUPER_ADMIN',department:'IT',branch:'000',status:'ACTIVE',lastLogin:null,createdAt:nowISO(),password:'password123'},
    {id:'YISMAW',username:'YISMAW',name:'Yismaw Alemayehu',email:'yismaw@bank.com',phone:'+251-911-000-002',employeeId:'EMP-002',role:'MAKER',department:'Operations',branch:'000',status:'ACTIVE',lastLogin:null,createdAt:nowISO(),password:'password123'},
    {id:'CHECKER1',username:'CHECKER1',name:'Checker One',email:'checker1@bank.com',phone:'+251-911-000-003',employeeId:'EMP-003',role:'CHECKER',department:'Risk',branch:'000',status:'ACTIVE',lastLogin:null,createdAt:nowISO(),password:'password123'},
    {id:'TELLER1',username:'TELLER1',name:'Teller One',email:'teller1@bank.com',phone:'+251-911-000-004',employeeId:'EMP-004',role:'TELLER',department:'Finance',branch:'000',status:'ACTIVE',lastLogin:null,createdAt:nowISO(),password:'password123'}
  ];
  state.roles=[
    {id:'SUPER_ADMIN',name:'Super Administrator',desc:'Full system access'},
    {id:'MAKER',name:'Maker',desc:'Create customers/accounts/transactions'},
    {id:'CHECKER',name:'Checker',desc:'Approve records'},
    {id:'TELLER',name:'Teller',desc:'Cash transactions'},
    {id:'BRANCH_MANAGER',name:'Branch Manager',desc:'Branch approvals'}
  ];
  ['CPO','CHQ','GUAR','SHAR','PASS'].forEach(code=>{
    for(const denom of [1,5,10,25,50,100]){
      state.stockInventory.push({id:uid('STK'),stockCode:code,denom,currency:'ETB',branch:'000',
        qty:code==='CHQ'?(denom===25?500:denom===50?300:100):code==='CPO'?200:1000,reorderLevel:50});
    }
  });
  state.tasks.push({id:uid('TASK'),title:'Review pending KYC records',priority:'HIGH',due:dstr(new Date(Date.now()+86400000)),status:'OPEN',assignee:'SUPERADMIN',createdAt:nowISO()});
  state.tasks.push({id:uid('TASK'),title:'End of day batch closure',priority:'MEDIUM',due:dstr(new Date(Date.now()+2*86400000)),status:'OPEN',assignee:'SUPERADMIN',createdAt:nowISO()});
  state.atms=[
    {id:'ATM-001',location:'Bole Road',bank:'CBE',status:'ONLINE',cash:850000},
    {id:'ATM-002',location:'Meskel Square',bank:'Awash',status:'ONLINE',cash:420000},
    {id:'ATM-003',location:'Piassa',bank:'Dashen',status:'LOW_CASH',cash:85000}
  ];
  state.posTerminals=[
    {id:'POS-1001',merchant:'Fresh Corner',terminal:'T-9921',status:'ACTIVE'},
    {id:'POS-1002',merchant:'Addis Market',terminal:'T-3387',status:'ACTIVE'}
  ];
  state.merchants=[
    {id:'MER-001',name:'Fresh Corner Supermarket',tin:'0001234567',status:'ACTIVE'},
    {id:'MER-002',name:'Addis Market PLC',tin:'0007654321',status:'ACTIVE'}
  ];
  state.documents=[
    {id:uid('DOC'),name:'Board Resolution 2026.pdf',cat:'Corporate',size:'245 KB',uploaded:nowISO(),by:'SUPERADMIN'},
    {id:uid('DOC'),name:'KYC Policy v3.docx',cat:'Compliance',size:'118 KB',uploaded:nowISO(),by:'CHECKER1'}
  ];
  state.investments=[
    {id:'INV-001',product:'Treasury Bill 91-day',principal:5000000,rate:12.5,status:'ACTIVE'},
    {id:'INV-002',product:'Corporate Bond A',principal:2000000,rate:14.0,status:'ACTIVE'}
  ];
}

const findAcc=a=>state.accounts.find(x=>x.acc===String(a||'').trim())||null;
const findCust=c=>state.customers.find(x=>x.cif.toUpperCase()===String(c||'').trim().toUpperCase())||null;
const acctsOf=c=>state.accounts.filter(a=>a.cif===c);
const findKyc=k=>state.kycRecords.find(x=>x.refNo===k)||null;
const findTd=t=>state.tdAccounts.find(x=>x.tdAcc===t)||null;

function logAudit(action,entity,detail,refNo){
  state.audit.unshift({id:uid('AUD'),ts:nowISO(),user:state.user.id||'SYSTEM',name:state.user.name||'System',
    role:state.user.role||'SYSTEM',branch:state.branch.code,action,entity:entity||PLACEHOLDER,detail:detail||'',
    ref:refNo||'',ip:'10.12.4.87',session:state.session||'—'});
  saveState();
}
function submitForApproval(kind,id,label,amount,ccy){
  const item={id:uid('APV'),kind,ref:id,label:label||'',amount:amount||0,ccy:ccy||'',
    maker:state.user.id,makerName:state.user.name,submittedAt:nowISO(),status:'PENDING_AUTHORIZATION',checker:null};
  state.approvals.unshift(item);
  logAudit('SUBMIT_FOR_APPROVAL',id,`${kind} · ${label||''}`);
  return item;
}
function updateSidebarBadges(){
  const pending=state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION').length;
  const kycPending=state.kycRecords.filter(k=>k.authStatus==='UNAUTHORIZED').length;
  const custPending=state.customers.filter(c=>c.authStatus==='UNAUTHORIZED').length;
  const accPending=state.accounts.filter(a=>a.authStatus==='UNAUTHORIZED').length;
  const taskPending=state.tasks.filter(t=>t.status==='OPEN').length;
  const map={'m3-kyc-badge':kycPending,'m3-cust-badge':custPending,'m4-acc-badge':accPending,'m19-apv-badge':pending,'m25-task-badge':taskPending};
  Object.entries(map).forEach(([k,v])=>{const el=document.querySelector(`[data-nav-badge="${k}"]`);if(el){el.textContent=v;el.classList.toggle('zero',!v);}});
  const ni=$('#notifIcon');if(ni)ni.setAttribute('data-badge',pending>0?pending:'');
}

const availBal=a=>+(a.balance-(a.hold||0)).toFixed(2);
function validAmt(v){const n=num(v);return(n>0&&n<=1e12)?+n.toFixed(2):0;}
function postingBlock(a,side){
  const st=String(a.status||'').toUpperCase();
  if(['ACTIVE','POSTING ALLOWED','DEBIT OVERRIDE','CREDIT OVERRIDE'].includes(st))return '';
  if(st==='NO DEBIT')return side==='DR'?'Account is marked No-Debit':'';
  if(st==='NO CREDIT')return side==='CR'?'Account is marked No-Credit':'';
  return 'Account status is '+(a.status||'UNKNOWN')+' — posting not allowed';
}
function recTxn(o){
  const t={id:uid('TX'),ref:ref(o.p||'TXN'),type:o.type,amount:o.amount,account:o.account,customerName:o.name,title:o.title,
    bank:'FLEXCUBE NEO',status:'POSTED',timestamp:nowISO(),teller:state.user.id,till:(state.till||{}).id,...(o.extra||{})};
  state.transactions.unshift(t);return t;
}
function addMonths(d,n){const x=new Date(d.getTime()),day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+n);
  x.setDate(Math.min(day,new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));return x;}
function canAuthorize(rec){
  if(!CHECKER_ROLES.includes(state.user.role)){toast('Your role is not allowed to authorize records','e');return false;}
  if(ENFORCE_MAKER_CHECKER&&rec&&rec.maker&&rec.maker===state.user.id){toast('Maker cannot authorize their own record (four-eyes rule). Sign in as a different checker.','e');return false;}
  return true;
}
function pendingAuthCount(){
  const P=state.approvals.filter(a=>a.status==='PENDING_AUTHORIZATION');
  const has=(k,r)=>P.some(a=>a.kind===k&&a.ref===r);
  return P.length+state.kycRecords.filter(k=>k.authStatus==='UNAUTHORIZED'&&!has('KYC',k.refNo)).length
    +state.customers.filter(c=>c.authStatus==='UNAUTHORIZED'&&!has('CUSTOMER',c.cif)).length
    +state.accounts.filter(a=>a.authStatus==='UNAUTHORIZED'&&!has('ACCOUNT',a.acc)).length;
}

function applyAuth(kind,refNo,ok,quiet){
  let rec=null;
  if(kind==='KYC'){rec=findKyc(refNo);if(rec&&canAuthorize(rec)){rec.authStatus=ok?'AUTHORIZED':'REJECTED';rec.recordStatus=rec.authStatus;}else rec=null;}
  else if(kind==='CUSTOMER'){rec=findCust(refNo);if(rec&&canAuthorize(rec)){rec.authStatus=ok?'AUTHORIZED':'REJECTED';rec.status=ok?'ACTIVE':'DRAFT';rec.recordStatus=rec.authStatus;}else rec=null;}
  else if(kind==='ACCOUNT'){rec=findAcc(refNo);if(rec&&canAuthorize(rec)){rec.authStatus=ok?'AUTHORIZED':'REJECTED';rec.status=ok?'ACTIVE':'DRAFT';rec.recordStatus=rec.authStatus;}else rec=null;}
  else if(kind==='TD'){rec=findTd(refNo);if(rec&&canAuthorize(rec)){rec.authStatus=ok?'AUTHORIZED':'REJECTED';rec.status=ok?'ACTIVE':'REJECTED';rec.recordStatus=rec.authStatus;}else rec=null;}
  else if(kind==='JOURNAL'){
    rec=state.journalEntries.find(x=>x.batch===refNo&&x.status==='PENDING_AUTHORIZATION')||null;
    if(rec&&canAuthorize(rec)){
      if(ok){
        for(const l of rec.lines){const a=findAcc(l.acc);if(!a)continue;
          const b=postingBlock(a,l.side);if(b){toast(l.acc+': '+b,'e');return null;}
          if(l.side==='DR'&&availBal(a)<l.amt){toast(l.acc+': insufficient available balance','e');return null;}}
        rec.lines.forEach(l=>{const a=findAcc(l.acc);if(a)a.balance=+(a.balance+(l.side==='CR'?l.amt:-l.amt)).toFixed(2);});
      }
      rec.status=ok?'POSTED':'REJECTED';
    }else rec=null;
  }
  else{const a=state.approvals.find(x=>x.kind===kind&&x.ref===refNo&&x.status==='PENDING_AUTHORIZATION');if(a&&canAuthorize(a))rec=a;}
  if(!rec)return null;
  rec.checker=state.user.id;rec.checkerAt=nowISO();
  const ap=state.approvals.find(x=>x.kind===kind&&x.ref===refNo&&x.status==='PENDING_AUTHORIZATION');
  if(ap){ap.status=ok?'AUTHORIZED':'REJECTED';ap.checker=state.user.id;ap.checkerAt=nowISO();}
  logAudit((ok?'AUTHORIZE_':'REJECT_')+kind,refNo);
  if(!quiet){toast(ok?kind+' authorized':kind+' rejected',ok?'s':'w');saveState();mount();updateSidebarBadges();}
  return rec;
}
