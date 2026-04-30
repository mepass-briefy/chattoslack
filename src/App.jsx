import { useState, useEffect, createContext, useContext } from "react";
import * as XLSX from "xlsx";

/* ── Tokens ────────────────────────────────────────────────── */
var TEAL_DARK={primary:"#6AADAA",onPrimary:"#00403B",primaryCont:"#1C3A38",error:"#E07070",errorCont:"rgba(224,112,112,0.11)",errorBorder:"rgba(224,112,112,0.22)",success:"#65B365",successCont:"rgba(101,179,101,0.11)",successBorder:"rgba(101,179,101,0.22)",warn:"#D4A244",warnCont:"rgba(212,162,68,0.11)",warnBorder:"rgba(212,162,68,0.22)",bg:"#1A1D1D",surface:"#1F2424",sc:"#252C2C",scHi:"#2B3333",scHst:"#313B3A",onSurf:"#D8E4E2",onSurfVar:"#90AEAD",outline:"#4E6E6C",outlineVar:"#232E2E"};
var TEAL_LIGHT={primary:"#0D9488",onPrimary:"#FFFFFF",primaryCont:"#F0FDFA",error:"#DC2626",errorCont:"rgba(220,38,38,0.06)",errorBorder:"rgba(220,38,38,0.20)",success:"#16A34A",successCont:"rgba(22,163,74,0.06)",successBorder:"rgba(22,163,74,0.18)",warn:"#D97706",warnCont:"rgba(217,119,6,0.06)",warnBorder:"rgba(217,119,6,0.20)",bg:"#F5F6FA",surface:"#FFFFFF",sc:"#FFFFFF",scHi:"#F8F9FC",scHst:"#F1F3F8",onSurf:"#111827",onSurfVar:"#6B7280",outline:"#9CA3AF",outlineVar:"#E5E7EB"};
var BLUE_DARK={primary:"#5B9FD4",onPrimary:"#0A2A4A",primaryCont:"#163350",error:"#E07070",errorCont:"rgba(224,112,112,0.11)",errorBorder:"rgba(224,112,112,0.22)",success:"#65B365",successCont:"rgba(101,179,101,0.11)",successBorder:"rgba(101,179,101,0.22)",warn:"#D4A244",warnCont:"rgba(212,162,68,0.11)",warnBorder:"rgba(212,162,68,0.22)",bg:"#191C20",surface:"#1E2228",sc:"#23282F",scHi:"#292F38",scHst:"#2F3641",onSurf:"#DCE4F0",onSurfVar:"#8FA0B8",outline:"#4E6070",outlineVar:"#21272E"};
var BLUE_LIGHT={primary:"#2563EB",onPrimary:"#FFFFFF",primaryCont:"#EFF6FF",error:"#DC2626",errorCont:"rgba(220,38,38,0.06)",errorBorder:"rgba(220,38,38,0.20)",success:"#16A34A",successCont:"rgba(22,163,74,0.06)",successBorder:"rgba(22,163,74,0.18)",warn:"#D97706",warnCont:"rgba(217,119,6,0.06)",warnBorder:"rgba(217,119,6,0.20)",bg:"#F5F6FA",surface:"#FFFFFF",sc:"#FFFFFF",scHi:"#F8F9FC",scHst:"#F1F3F8",onSurf:"#111827",onSurfVar:"#6B7280",outline:"#9CA3AF",outlineVar:"#E5E7EB"};
var AMBER_DARK={primary:"#918070",onPrimary:"#1A1410",primaryCont:"#201E18",error:"#E07070",errorCont:"rgba(224,112,112,0.11)",errorBorder:"rgba(224,112,112,0.22)",success:"#65B365",successCont:"rgba(101,179,101,0.11)",successBorder:"rgba(101,179,101,0.22)",warn:"#C4A060",warnCont:"rgba(196,160,96,0.11)",warnBorder:"rgba(196,160,96,0.22)",bg:"#161514",surface:"#1B1A18",sc:"#21201C",scHi:"#272622",scHst:"#2D2C28",onSurf:"#E0DBD0",onSurfVar:"#A89E90",outline:"#585450",outlineVar:"#282420"};
var AMBER_LIGHT={primary:"#6A5C50",onPrimary:"#FFFFFF",primaryCont:"#E8E0D8",error:"#DC2626",errorCont:"rgba(220,38,38,0.06)",errorBorder:"rgba(220,38,38,0.20)",success:"#16A34A",successCont:"rgba(22,163,74,0.06)",successBorder:"rgba(22,163,74,0.18)",warn:"#A07030",warnCont:"rgba(160,112,48,0.07)",warnBorder:"rgba(160,112,48,0.22)",bg:"#F6F4F2",surface:"#FFFFFF",sc:"#FFFFFF",scHi:"#F2F0EC",scHst:"#EAE8E0",onSurf:"#181410",onSurfVar:"#706860",outline:"#A09888",outlineVar:"#E4E0D8"};
var ROSE_DARK={primary:"#8C96A8",onPrimary:"#0E1018",primaryCont:"#181E2A",error:"#E07070",errorCont:"rgba(224,112,112,0.11)",errorBorder:"rgba(224,112,112,0.22)",success:"#65B365",successCont:"rgba(101,179,101,0.11)",successBorder:"rgba(101,179,101,0.22)",warn:"#C4A060",warnCont:"rgba(196,160,96,0.11)",warnBorder:"rgba(196,160,96,0.22)",bg:"#141517",surface:"#191B1F",sc:"#1F2228",scHi:"#252A32",scHst:"#2B3038",onSurf:"#DDE2EB",onSurfVar:"#9098AA",outline:"#505660",outlineVar:"#20242C"};
var ROSE_LIGHT={primary:"#566080",onPrimary:"#FFFFFF",primaryCont:"#E0E4F0",error:"#DC2626",errorCont:"rgba(220,38,38,0.06)",errorBorder:"rgba(220,38,38,0.20)",success:"#16A34A",successCont:"rgba(22,163,74,0.06)",successBorder:"rgba(22,163,74,0.18)",warn:"#D97706",warnCont:"rgba(217,119,6,0.06)",warnBorder:"rgba(217,119,6,0.20)",bg:"#F3F4F7",surface:"#FFFFFF",sc:"#FFFFFF",scHi:"#F0F1F5",scHst:"#E8EAF0",onSurf:"#0E1018",onSurfVar:"#626878",outline:"#9098A8",outlineVar:"#DFE2EA"};
var M = Object.assign({}, TEAL_DARK);

/* ── Status / Rate Tables ────────────────────────────────────── */
var ST = { "신규접수":"#90CAF9","RM배정":"#80CBC4","브리핑완료":"#80CB6E","미팅완료":"#FFB950","RFP":"#CE93D8","계약성사":"#A5D6A7","이탈":"#F2B8B5" };
var STATUS_ORDER = ["신규접수","RM배정","브리핑완료","미팅완료","RFP","계약성사","이탈"];
var GRADES = ["신입(1년)","초급(2~3년)","중급(4~6년)","중급2(7~8년)","고급(9년+)"];
var GRADE_KEY = {"신입(1년)":"신입","초급(2~3년)":"초급","중급(4~6년)":"중급","중급2(7~8년)":"중급2","고급(9년+)":"고급"};
var POSITIONS = ["프로젝트 매니저","기획자","UX/UI 디자이너","그래픽 디자이너","Web 개발자","Server 개발자","Mobile 개발자","Data 엔지니어","DevOps","QA 엔지니어","퍼블리셔","Tech Lead","CrossPlatform 개발자"];
var DEFAULT_RATES = {
  "프로젝트 매니저":{신입:0,초급:28220,중급:46480,중급2:64740,고급:83000},
  "기획자":{신입:20750,초급:26560,중급:43160,중급2:63080,고급:83000},
  "UX/UI 디자이너":{신입:24900,초급:28220,중급:33200,중급2:45650,고급:58100},
  "그래픽 디자이너":{신입:24900,초급:28220,중급:33200,중급2:45650,고급:58100},
  "Web 개발자":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
  "Server 개발자":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
  "Mobile 개발자":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
  "Data 엔지니어":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
  "DevOps":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
  "QA 엔지니어":{신입:0,초급:24900,중급:33200,중급2:37350,고급:41500},
  "퍼블리셔":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
  "Tech Lead":{신입:0,초급:28220,중급:46480,중급2:64740,고급:83000},
  "CrossPlatform 개발자":{신입:20750,초급:24900,중급:38180,중급2:56440,고급:74700},
};
var LOCAL_USER = { id:"local", name:"로컬 RM", email:"local@gridge.io", grade:"관리자", isAdmin:true, tagOnly:false };

/* ── Helpers ─────────────────────────────────────────────────── */
var store = {
  get: async function(k,fb){
    try{
      var r=await fetch("/api/kv/"+encodeURIComponent(k));
      if(!r.ok) return fb!==undefined?fb:null;
      var data=await r.json();
      return data.value!=null?data.value:(fb!==undefined?fb:null);
    }catch(e){ return fb!==undefined?fb:null; }
  },
  set: async function(k,v){
    try{
      await fetch("/api/kv/"+encodeURIComponent(k),{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({value:v})
      });
    }catch(e){}
  },
  del: async function(k){
    try{
      await fetch("/api/kv/"+encodeURIComponent(k),{method:"DELETE"});
    }catch(e){}
  },
};
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function today(){ return new Date().toISOString().split("T")[0]; }
function fmt(iso){ return iso?iso.slice(0,10):""; }
function diffDays(iso){ return iso?Math.floor((Date.now()-new Date(iso))/86400000):0; }
function getMonday(d){ var dt=new Date(d); var day=dt.getDay(); var diff=dt.getDate()-day+(day===0?-6:1); return new Date(dt.setDate(diff)); }
function addDays(d,n){ var r=new Date(d); r.setDate(r.getDate()+n); return r; }
function fmtMD(d){ return (d.getMonth()+1)+"/"+d.getDate(); }
var _ratesCache = null;
function getRate(position,grade){
  var tbl=_ratesCache||DEFAULT_RATES;
  var p=tbl[position]; if(!p)return 0; var gk=GRADE_KEY[grade]||grade; return p[gk]||0;
}
/* ── Pager ──────────────────────────────────────────────────── */
function Pager(pp){
  var total=pp.total; var cur=pp.cur; var size=pp.size||20; var set=pp.set;
  var pages=Math.ceil(total/size); if(pages<=1)return null;
  var items=[];
  for(var i=0;i<pages;i++) items.push(i);
  return(
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:4,padding:"20px 0 4px"}}>
      <button onClick={function(){set(Math.max(0,cur-1));}} disabled={cur===0} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+M.outlineVar,background:"transparent",color:cur===0?M.outlineVar:M.onSurfVar,cursor:cur===0?"default":"pointer",fontSize:13,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>이전</button>
      {items.map(function(i){var act=i===cur; return(
        <button key={i} onClick={function(){set(i);}} style={{width:34,height:34,borderRadius:6,border:"1px solid "+(act?M.primary:M.outlineVar),background:act?M.primaryCont:"transparent",color:act?M.primary:M.onSurfVar,cursor:"pointer",fontSize:13,fontFamily:"'Noto Sans KR',system-ui,sans-serif",transition:"all .2s cubic-bezier(.2,0,0,1)"}}>{i+1}</button>
      );})}
      <button onClick={function(){set(Math.min(pages-1,cur+1));}} disabled={cur===pages-1} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+M.outlineVar,background:"transparent",color:cur===pages-1?M.outlineVar:M.onSurfVar,cursor:cur===pages-1?"default":"pointer",fontSize:13,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>다음</button>
    </div>
  );
}

/* Customer status = most advanced non-이탈 project status */
function customerStatus(customer){
  var projs=(customer.projects||[]);
  if(projs.length===0) return "신규접수";
  var best=0;
  projs.forEach(function(p){
    var idx=STATUS_ORDER.indexOf(p.status||"신규접수");
    if(p.status!=="이탈"&&idx>best) best=idx;
  });
  return STATUS_ORDER[best];
}

/* Project status derived from data */
function projectStatus(proj){
  if(proj.contract_id) return "계약성사";
  if(proj.rfp_data) return "RFP";
  if((proj.notes_count||0)>0) return "미팅완료";
  if(proj.briefing) return "브리핑완료";
  if(proj.rm_name) return "RM배정";
  return "신규접수";
}

async function callAI(userMsg,sysMsg,maxTok,webSearch){
  var res=await fetch("/api/ai",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userMsg,sysMsg,maxTok,webSearch})
  });
  var data=await res.json();
  if(data.error) throw new Error(data.error);
  return data.text||"";
}

/* ── Dummy Data Seeder ───────────────────────────────────────── */
async function seedDummyData(userId){
  /* 최초 실행 시 빈 구조만 초기화 — 더미 데이터 없음 */
  var existing=await store.get("customers:"+userId,[]);
  if(existing&&existing.length>0) return;
  await store.set("customers:"+userId,[]);
}





/* ── Context ─────────────────────────────────────────────────── */
var Ctx = createContext(null);
function useApp(){ return useContext(Ctx); }
var ThemeCtx = createContext(true);
function useIsDark(){ return useContext(ThemeCtx); }

/* ── UI Primitives ───────────────────────────────────────────── */
function Btn(p){
  var v=p.variant||"filled", sz=p.size||"md", dis=p.disabled||false;
  var isDark=useIsDark();
  var base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,border:"none",borderRadius:20,cursor:dis?"not-allowed":"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif",fontWeight:500,opacity:dis?.38:1,whiteSpace:"nowrap",letterSpacing:".025em",fontSize:sz==="sm"?12:14,padding:sz==="sm"?"6px 16px":"9px 22px",transition:"box-shadow .2s cubic-bezier(.2,0,0,1),opacity .15s"};
  var filledBg=isDark?M.primaryCont:M.primary;
  var filledColor=isDark?M.primary:M.onPrimary;
  var filledShadow=isDark?"none":"0 1px 2px rgba(0,0,0,.15),0 1px 3px 1px rgba(0,0,0,.1)";
  var styles={
    filled:{background:filledBg,color:filledColor,boxShadow:filledShadow},
    tonal:{background:M.scHst,color:M.onSurf,boxShadow:"none"},
    outline:{background:"transparent",color:M.primary,border:"1px solid "+M.outline,boxShadow:"none"},
    ghost:{background:"transparent",color:M.onSurfVar,border:"none",borderRadius:8,boxShadow:"none"},
    danger:{background:M.errorCont,color:M.error,border:"1px solid "+M.errorBorder,boxShadow:"none"},
    success:{background:M.successCont,color:M.success,border:"1px solid "+M.successBorder,boxShadow:"none"},
  };
  return <button className="m3-btn" style={Object.assign({},base,styles[v]||styles.filled,p.style)} onClick={dis?undefined:p.onClick} disabled={dis}>{p.children}</button>;
}
function Card(p){
  var isDark=useIsDark();
  var v=p.variant||"elevated";
  var shadow=isDark
    ? (v==="elevated"?"0 1px 2px rgba(0,0,0,.3),0 2px 6px 2px rgba(0,0,0,.15)":"none")
    : (v==="elevated"?"0 1px 2px rgba(0,0,0,.08),0 1px 3px 1px rgba(0,0,0,.04)":"none");
  var border=v==="outlined"?"1.5px solid "+M.outlineVar:(isDark?".5px solid "+M.outlineVar+"80":"1px solid "+M.outlineVar);
  var cls="m3-card"+(p.onClick?" m3-card-click":"");
  return <div className={cls} style={Object.assign({background:M.sc,borderRadius:12,border:border,overflow:"hidden",transition:"background .15s cubic-bezier(.2,0,0,1),box-shadow .2s cubic-bezier(.2,0,0,1),border-color .15s",boxShadow:shadow},p.style)} onClick={p.onClick}>{p.children}</div>;
}
function SBadge(p){
  var s=p.status||"신규접수"; var c=ST[s]||M.onSurfVar;
  return <span className="m3-chip" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,fontSize:12,fontWeight:500,background:M.scHst,color:c,border:"1px solid "+M.outlineVar,letterSpacing:".01em",transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
    {s}
  </span>;
}
function Spinner(p){ return <div style={{width:p.size||18,height:p.size||18,borderRadius:"50%",border:"2px solid "+M.primaryCont,borderTopColor:M.primary,animation:"g-spin .7s linear infinite",flexShrink:0}}/>; }

function Inp(p){
  var [foc,setFoc]=useState(false);
  var isDark=useIsDark();
  var bdColor=p.error?M.error:foc?M.primary:M.outlineVar;
  var ring=(!isDark&&foc&&!p.error)?"0 0 0 3px "+M.primaryCont:"none";
  var s={width:"100%",padding:"10px 13px",borderRadius:8,border:"1.5px solid "+bdColor,background:isDark?M.scHst:"#FFFFFF",fontSize:14,color:M.onSurf,outline:"none",boxSizing:"border-box",fontFamily:"'Noto Sans KR',system-ui,sans-serif",opacity:p.disabled?.5:1,transition:"border-color .15s,box-shadow .15s",boxShadow:ring};
  return (
    <div style={{marginBottom:p.mb!==undefined?p.mb:14}}>
      {p.label&&<div style={{fontSize:12,fontWeight:500,color:M.onSurfVar,marginBottom:5}}>{p.label}{p.required&&<span style={{color:M.error,marginLeft:2}}>*</span>}</div>}
      {p.multiline?<textarea value={p.value} onChange={p.onChange} onFocus={function(){setFoc(true);}} onBlur={function(){setFoc(false);}} placeholder={p.placeholder} rows={p.rows||3} style={Object.assign({},s,{resize:"vertical",lineHeight:1.65})}/>
        :<input type={p.type||"text"} value={p.value} onChange={p.onChange} onFocus={function(){setFoc(true);}} onBlur={function(){setFoc(false);}} onKeyDown={p.onKeyDown} placeholder={p.placeholder} disabled={p.disabled} style={s}/>}
      {p.hint&&<div style={{fontSize:12,color:M.onSurfVar,marginTop:4}}>{p.hint}</div>}
    </div>
  );
}
function Sel(p){
  var isDark=useIsDark();
  return (
    <div style={{marginBottom:p.mb!==undefined?p.mb:14}}>
      {p.label&&<div style={{fontSize:12,fontWeight:500,color:M.onSurfVar,marginBottom:5}}>{p.label}{p.required&&<span style={{color:M.error,marginLeft:2}}>*</span>}</div>}
      <select value={p.value} onChange={p.onChange} style={{width:"100%",padding:"10px 13px",borderRadius:8,border:"1.5px solid "+M.outlineVar,background:isDark?M.scHst:"#FFFFFF",fontSize:14,color:M.onSurf,outline:"none",boxSizing:"border-box",fontFamily:"'Noto Sans KR',system-ui,sans-serif",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
        {p.placeholder&&<option value="">{p.placeholder}</option>}
        {(p.options||[]).map(function(o){ var val=o.value||o; var lbl=o.label||o; return <option key={val} value={val}>{lbl}</option>; })}
      </select>
    </div>
  );
}
function Modal(p){
  if(!p.open) return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"g-fade .15s cubic-bezier(.2,0,0,1)"}}
      onClick={function(e){if(e.target===e.currentTarget&&p.onClose)p.onClose();}}>
      <div style={{background:M.sc,borderRadius:28,border:"none",maxWidth:p.maxWidth||520,width:"100%",maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",
        boxShadow:"0 4px 8px 3px rgba(0,0,0,.15),0 1px 3px rgba(0,0,0,.3)",margin:"auto",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
        <div style={{padding:"24px 24px 16px",flexShrink:0}}>
          <div style={{fontSize:18,fontWeight:600,color:M.onSurf,letterSpacing:"-.01em"}}>{p.title}</div>
          {p.subtitle&&<div style={{fontSize:13,color:M.onSurfVar,marginTop:4}}>{p.subtitle}</div>}
        </div>
        <div style={{padding:"0 24px",overflowY:"auto",flex:1}}>{p.children}</div>
        {p.footer&&<div style={{padding:"20px 24px 24px",display:"flex",justifyContent:"flex-end",gap:8,flexShrink:0}}>{p.footer}</div>}
      </div>
    </div>
  );
}
function MarkdownSimple(p){
  var lines=(p.content||"").split("\n");
  return <div>{lines.map(function(line,i){
    if(line.startsWith("## "))
      return <div key={i} style={{fontSize:10,fontWeight:700,color:M.primary,textTransform:"uppercase",letterSpacing:".09em",marginTop:14,marginBottom:5}}>{line.slice(3)}</div>;
    if(line.startsWith("### "))
      return <div key={i} style={{fontSize:13,fontWeight:600,color:M.onSurf,marginTop:10,marginBottom:4}}>{line.slice(4)}</div>;
    if(line.startsWith("**")&&line.includes(":**")){
      var inner=line.replace(/\*\*/g,"");
      var ci=inner.indexOf(":");
      return <div key={i} style={{display:"flex",gap:6,marginBottom:4}}>
        <span style={{fontSize:13,fontWeight:600,color:M.onSurf,flexShrink:0,whiteSpace:"nowrap"}}>{inner.slice(0,ci)}:</span>
        <span style={{fontSize:13,color:M.onSurfVar,lineHeight:1.7}}>{inner.slice(ci+1).trim()}</span>
      </div>;
    }
    if(line.startsWith("- "))
      return <div key={i} style={{display:"flex",gap:8,marginBottom:3,paddingLeft:4}}><span style={{color:M.primary,flexShrink:0,marginTop:2}}>·</span><span style={{fontSize:13,color:M.onSurfVar,lineHeight:1.7}}>{line.slice(2)}</span></div>;
    if(line.trim()==="") return <div key={i} style={{height:4}}/>;
    return <div key={i} style={{fontSize:13,color:M.onSurfVar,lineHeight:1.75}}>{line}</div>;
  })}</div>;
}

/* ── Icons ───────────────────────────────────────────────────── */
var IC = {
  home:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  customer:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  rfp:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>,
  contract:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>,
  worker:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>,
  settings:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  logout:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>,
  sun:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zM4.22 4.22a1 1 0 0 1 1.42 0l.7.7a1 1 0 0 1-1.42 1.42l-.7-.7a1 1 0 0 1 0-1.42zm14.14 14.14a1 1 0 0 1 1.42 0l.7.7a1 1 0 0 1-1.42 1.42l-.7.7a1 1 0 0 1-1.42 0zM2 12a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm18 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1zM4.22 19.78a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0zm14.14-14.14a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0z"/></svg>,
  moon:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  add:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  search:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  back:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
  chevron:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>,
  copy:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>,
  check:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>,
  trash:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  spark:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>,
  warning:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  folder:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>,
  project:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>,
  analysis:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
  cal:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
};

/* ── Sidebar ─────────────────────────────────────────────────── */
var NAV=[
  {id:"home",icon:IC.home,label:"홈"},
  {id:"customers",icon:IC.customer,label:"고객관리"},
  {id:"projects",icon:IC.project,label:"프로젝트"},
  {id:"contracts",icon:IC.contract,label:"계약관리"},
  {id:"analysis",icon:IC.analysis,label:"계약 분석"},
  {id:"workers",icon:IC.worker,label:"작업자"},
];
function Sidebar(p){
  var app=useApp(); var isDark=useIsDark();
  function NavBtn(np){
    var active=np.active;
    var indicatorBg=isDark?M.primaryCont+"60":M.primary;
    var indicatorColor=isDark?M.primary:M.onPrimary;
    return(
      <button className="m3-nav-btn" onClick={np.onClick}
        style={{width:"100%",height:44,border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:"0 12px",borderRadius:8,background:"transparent",color:active?indicatorColor:M.onSurfVar,boxSizing:"border-box",position:"relative",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>
        {active&&<span style={{position:"absolute",inset:0,borderRadius:8,background:indicatorBg,transition:"background .2s cubic-bezier(.2,0,0,1)"}}/>}
        <span style={{position:"relative",display:"flex",alignItems:"center",flexShrink:0}}>{np.icon}</span>
        {np.label&&<span className="nav-label" style={{position:"relative",fontSize:14,fontWeight:active?600:400,letterSpacing:"-.01em"}}>{np.label}</span>}
      </button>
    );
  }
  return(
    <div className="app-sidebar" style={{background:isDark?M.surface:"#FFFFFF",borderRight:"1px solid "+M.outlineVar,display:"flex",flexDirection:"column",padding:"12px 0",zIndex:10,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s,width .2s"}}>
      <div style={{width:36,height:36,borderRadius:10,background:isDark?M.primaryCont:M.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",flexShrink:0}}>
        <span style={{fontSize:16,fontWeight:700,color:isDark?M.primary:M.onPrimary}}>G</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:2,width:"100%",padding:"0 6px"}}>
        {NAV.map(function(item){
          var active=p.page===item.id||(item.id==="customers"&&(p.page==="customerDetail"));
          return <NavBtn key={item.id} active={active} icon={item.icon} label={item.label} onClick={function(){p.setPage(item.id);}}/>;
        })}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:2,padding:"0 6px"}}>
        <NavBtn active={p.page==="settings"} icon={IC.settings} label="설정" onClick={function(){p.setPage("settings");}}/>
        <NavBtn active={false} icon={isDark?IC.sun:IC.moon} label={isDark?"라이트":"다크"} onClick={p.onToggleTheme}/>
        <NavBtn active={false} icon={IC.logout} label="로그아웃" onClick={app.logout}/>
      </div>
    </div>
  );
}

/* ── Login Screen ────────────────────────────────────────────── */
function LoginScreen(p){
  var [email,setEmail]=useState(""); var [pw,setPw]=useState(""); var [loading,setLoading]=useState(false); var [err,setErr]=useState("");
  async function doLogin(){
    if(!email||!pw){setErr("이메일과 비밀번호를 입력해주세요."); return;}
    setErr(""); setLoading(true);
    try{
      var teams=await store.get("teams",[]);
      var found=teams.find(function(m){return (m.email===email||m.name===email)&&m.password===pw&&!m.tagOnly;});
      if(!found){setErr("이메일 또는 비밀번호가 올바르지 않습니다."); setLoading(false); return;}
      await store.set("session",{userId:found.id}); p.onLogin(found);
    }catch(e){setErr("오류: "+e.message);}
    setLoading(false);
  }
  async function localAccess(){ await store.set("session",{userId:"local",isLocal:true}); p.onLogin(LOCAL_USER); }
  return (
    <div style={{minHeight:"100vh",background:M.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Noto Sans KR',system-ui,sans-serif",padding:20,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
      <div style={{width:"100%",maxWidth:380,animation:"g-fade .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:52,height:52,borderRadius:16,background:M.primaryCont,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
            <span style={{fontSize:26,fontWeight:700,color:M.primary}}>G</span>
          </div>
          <div style={{fontSize:24,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>GRIDGE RM</div>
          <div style={{fontSize:13,color:M.onSurfVar,marginTop:4}}>IT 리소스 매칭 CRM</div>
        </div>
        {!p.hasAccounts&&(
          <div style={{marginBottom:16,padding:"14px 16px",borderRadius:12,background:M.primaryCont,border:"1px solid "+M.outlineVar,textAlign:"center",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
            <div style={{fontSize:13,color:M.primary,marginBottom:10,fontWeight:500}}>로컬 환경에서 혼자 사용 중이에요</div>
            <Btn onClick={localAccess} style={{width:"100%",padding:"11px",fontSize:15}}>로컬 접속으로 시작</Btn>
            <div style={{fontSize:12,color:M.onSurfVar,marginTop:8}}>설정 → 계정에서 RM을 추가하면 로그인으로 전환됩니다</div>
          </div>
        )}
        {!p.hasAccounts&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{flex:1,height:1,background:M.outlineVar}}/><span style={{fontSize:12,color:M.onSurfVar}}>또는</span><div style={{flex:1,height:1,background:M.outlineVar}}/></div>}
        <Card style={{padding:"24px"}}>
          <Inp label="이메일 또는 이름" value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="admin@gridge.io"/>
          <Inp label="비밀번호" value={pw} onChange={function(e){setPw(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")doLogin();}} type="password" placeholder="••••••••" mb={0}/>
          {err&&<div style={{marginTop:12,padding:"8px 12px",borderRadius:8,background:M.errorCont,border:"1px solid "+M.errorBorder,fontSize:13,color:M.error}}>{err}</div>}
          <Btn onClick={doLogin} disabled={loading} style={{width:"100%",marginTop:20,padding:"11px",fontSize:15}}>{loading?<Spinner/>:"로그인"}</Btn>
          {p.hasAccounts&&<button onClick={localAccess} style={{width:"100%",marginTop:10,padding:"9px",fontSize:13,background:"transparent",border:"none",color:M.onSurfVar,cursor:"pointer",borderRadius:8,fontFamily:"inherit"}}>계정 없이 로컬 접속</button>}
        </Card>
      </div>
    </div>
  );
}

/* ── Weekly Calendar ─────────────────────────────────────────── */
function WeeklyCalendar(p){
  var user=p.user; var customers=p.customers||[];
  var SK="schedule:"+user.id;
  var [scheds,setScheds]=useState([]); var [loaded,setLoaded]=useState(false);
  var [weekStart,setWeekStart]=useState(function(){return getMonday(new Date());});
  var [showAdd,setShowAdd]=useState(false); var [addSlot,setAddSlot]=useState(null);
  var [af,setAF]=useState({title:"",customer_id:"",note:"",slackAvailable:false});
  var [viewSlot,setViewSlot]=useState(null);
  var [typeSelect,setTypeSelect]=useState(null);
  var [slackRequests,setSlackRequests]=useState([]);
  var [slotRequests,setSlotRequests]=useState([]);
  var [slackSt,setSlackSt]=useState("idle");
  var [slackErr,setSlackErr]=useState("");
  var [channelId,setChannelId]=useState("");
  var [threadUrl,setThreadUrl]=useState("");
  var [dmInput,setDmInput]=useState("");
  useEffect(function(){(async function(){var s=await store.get(SK,[]); setScheds(s); setLoaded(true);})();}, [user.id]);
  useEffect(function(){(async function(){var r=await fetch("/api/slack/requests"); var d=await r.json(); setSlackRequests(d.requests||[]);})();}, []);
  useEffect(function(){
    if(!viewSlot){setSlotRequests([]); return;}
    (async function(){var r=await fetch("/api/slack/requests?date="+viewSlot.date+"&hour="+parseInt(viewSlot.start)); var d=await r.json(); setSlotRequests(d.requests||[]);})();
  }, [viewSlot]);
  var HOURS=[9,10,11,12,13,14,15,16,17,18,19];
  var wDays=[0,1,2,3,4].map(function(i){return addDays(weekStart,i);});
  var todayMs=new Date().setHours(0,0,0,0); var nowH=new Date().getHours();
  function isPast(date,hour){var dm=new Date(date).setHours(0,0,0,0); if(dm<todayMs)return true; if(dm===todayMs&&hour<nowH)return true; return false;}
  function getSlot(date,hour){var ds=date.toISOString().split("T")[0]; return scheds.find(function(s){return s.date===ds&&parseInt(s.start)===hour;});}
  function isToday(date){return new Date(date).setHours(0,0,0,0)===todayMs;}
  function setAf(k,v){setAF(function(f){var n=Object.assign({},f); n[k]=v; return n;});}
  async function saveAdd(){
    if(!addSlot||!af.title.trim()) return;
    var ds=addSlot.date.toISOString().split("T")[0];
    var e={id:uid(),date:ds,start:addSlot.hour+":00",end:(addSlot.hour+1)+":00",title:af.title,customer_id:af.customer_id,note:af.note,slackAvailable:af.slackAvailable||false};
    var upd=scheds.concat([e]); await store.set(SK,upd); setScheds(upd);
    setShowAdd(false); setAF({title:"",customer_id:"",note:"",slackAvailable:false});
  }
  async function delSlot(id){var upd=scheds.filter(function(s){return s.id!==id;}); await store.set(SK,upd); setScheds(upd); setViewSlot(null);}
  function parseThreadUrl(url){
    var m=url.match(/archives\/([A-Z0-9]+)\/p(\d+)/);
    if(!m) return null;
    return {channelId:m[1], threadTs:m[2].slice(0,-6)+"."+m[2].slice(-6)};
  }
  async function sendToSlack(cid){
    setSlackSt("sending");
    try{
      var body={scheduleKey:SK};
      if(cid) body.channelId=cid;
      if(threadUrl.trim()){
        var parsed=parseThreadUrl(threadUrl.trim());
        if(parsed){body.channelId=parsed.channelId; body.threadTs=parsed.threadTs;}
      }
      var dms=dmInput.split(/[\s,]+/).map(function(s){return s.trim();}).filter(function(s){return /^U[A-Z0-9]+$/.test(s);});
      if(dms.length) body.dmUserIds=dms;
      var r=await fetch("/api/slack/send-availability",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      var d=await r.json();
      if(!d.ok){
        var msg=d.error||d.message||"전송 실패";
        if(msg.includes("SLACK_CHANNEL_ID")){setSlackSt("nochannel"); return;}
        throw new Error(msg);
      }
      setSlackSt("done"); setTimeout(function(){setSlackSt("idle");},3000);
    }catch(e){setSlackErr(e.message); setSlackSt("error"); setTimeout(function(){setSlackSt("idle");setSlackErr("");},5000);}
  }
  async function syncSlackMessages(){
    setSlackSt("syncing");
    try{
      var r=await fetch("/api/slack/sync-messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});
      var d=await r.json();
      setSlackSt(d.ok?"synced":"error");
    }catch(e){setSlackSt("error");}
  }
  async function confirmRequest(requestId){
    var r=await fetch("/api/slack/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId,scheduleKey:SK})});
    var d=await r.json();
    if(d.ok){
      var s=await store.get(SK,[]); setScheds(s); setViewSlot(null); setSlotRequests([]);
      var rr=await fetch("/api/slack/requests"); var dd=await rr.json(); setSlackRequests(dd.requests||[]);
    }
  }
  async function closeSlot(slot){
    await fetch("/api/slack/disable-slot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date:slot.date,hour:parseInt(slot.start)})});
    delSlot(slot.id);
    setViewSlot(null);
  }
  function openGuestAdd(){
    setAddSlot(typeSelect); setTypeSelect(null);
    setAF({title:"",customer_id:"",note:"",slackAvailable:false}); setShowAdd(true);
  }
  function openSlackAdd(){
    setAddSlot(typeSelect); setTypeSelect(null);
    setAF({title:(user.name||"RM")+" 미팅 가능 일정",customer_id:"",note:"",slackAvailable:true}); setShowAdd(true);
  }
  var DAY_KO=["월","화","수","목","금"];
  var btnSt={padding:"4px 10px",borderRadius:6,border:"1px solid "+M.outlineVar,background:"transparent",color:M.onSurfVar,cursor:"pointer",fontSize:14,fontFamily:"'Noto Sans KR',system-ui,sans-serif"};
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:600,color:M.onSurf}}>주간 상담 일정</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {slackSt==="idle"&&<button onClick={function(){setSlackSt("confirm");}} style={{padding:"4px 12px",borderRadius:6,border:"1px solid "+M.primary,background:M.primaryCont,color:M.primary,cursor:"pointer",fontSize:13,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>슬랙에 미팅 일정 보내기</button>}
          {(slackSt==="idle"||slackSt==="synced"||slackSt==="syncing")&&<button onClick={function(){syncSlackMessages();}} disabled={slackSt==="syncing"} style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+M.outlineVar,background:"transparent",color:M.onSurfVar,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>{slackSt==="syncing"?"동기화 중...":slackSt==="synced"?"✅ 동기화됨":"🔄 버튼 동기화"}</button>}
          {slackSt==="confirm"&&<div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:13,color:M.onSurfVar,whiteSpace:"nowrap"}}>전송 대상:</span>
            <input value={threadUrl} onChange={function(e){setThreadUrl(e.target.value);}} placeholder="스레드 URL (선택)" style={{padding:"3px 8px",borderRadius:6,border:"1px solid "+M.outlineVar,background:M.surface,color:M.onSurf,fontSize:12,width:160,fontFamily:"inherit",outline:"none"}}/>
            <input value={dmInput} onChange={function(e){setDmInput(e.target.value);}} placeholder="DM 유저 ID (U…)" style={{padding:"3px 8px",borderRadius:6,border:"1px solid "+M.outlineVar,background:M.surface,color:M.onSurf,fontSize:12,width:140,fontFamily:"inherit",outline:"none"}}/>
            <button onClick={function(){sendToSlack();}} style={{padding:"4px 12px",borderRadius:6,border:"1px solid "+M.primary,background:M.primaryCont,color:M.primary,cursor:"pointer",fontSize:13,fontFamily:"'Noto Sans KR',system-ui,sans-serif",whiteSpace:"nowrap"}}>확인</button>
            <button onClick={function(){setSlackSt("idle");setThreadUrl("");setDmInput("");}} style={btnSt}>취소</button>
          </div>}
          {slackSt==="sending"&&<span style={{fontSize:13,color:M.onSurfVar}}>⏳ 전송 중...</span>}
          {slackSt==="done"&&<span style={{fontSize:13,color:M.success}}>✓ 전송 완료</span>}
          {slackSt==="error"&&<span style={{fontSize:13,color:M.error,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>오류: {slackErr}</span>}
          {slackSt==="nochannel"&&<div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12,color:M.onSurfVar,whiteSpace:"nowrap"}}>채널 ID 입력:</span>
            <input value={channelId} onChange={function(e){setChannelId(e.target.value);}} placeholder="C12345678" style={{padding:"3px 8px",borderRadius:6,border:"1px solid "+M.outlineVar,background:M.surface,color:M.onSurf,fontSize:13,width:130,fontFamily:"inherit",outline:"none"}}/>
            <button onClick={function(){sendToSlack(channelId.trim());}} disabled={!channelId.trim()} style={{padding:"4px 12px",borderRadius:6,border:"1px solid "+M.primary,background:M.primaryCont,color:M.primary,cursor:"pointer",fontSize:13,fontFamily:"'Noto Sans KR',system-ui,sans-serif",opacity:channelId.trim()?1:.5}}>전송</button>
            <button onClick={function(){setSlackSt("idle");setChannelId("");}} style={btnSt}>취소</button>
          </div>}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={function(){setWeekStart(function(w){return addDays(w,-7);});}} style={btnSt}>{"<"}</button>
            <span style={{fontSize:13,color:M.onSurfVar,minWidth:150,textAlign:"center"}}>{fmtMD(wDays[0])} – {fmtMD(wDays[4])} {weekStart.getFullYear()}</span>
            <button onClick={function(){setWeekStart(function(w){return addDays(w,7);});}} style={btnSt}>{">"}</button>
          </div>
        </div>
      </div>
      <div className="cal-scroll">
        <div className="cal-inner" style={{minWidth:480}}>
          <div className="cal-grid" style={{marginBottom:5}}>
            <div/>
            {wDays.map(function(d,i){var iT=isToday(d); return(
              <div key={i} style={{textAlign:"center",padding:"5px 0",borderRadius:6,background:iT?M.primaryCont:"transparent",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
                <div style={{fontSize:12,color:iT?M.primary:M.onSurfVar,fontWeight:500}}>{DAY_KO[i]}</div>
                <div style={{fontSize:16,fontWeight:iT?700:500,color:iT?M.primary:M.onSurf}}>{d.getDate()}</div>
              </div>);
            })}
          </div>
          {HOURS.map(function(hour){
            var isLunch=hour===12;
            return(
              <div key={hour} className="cal-grid" style={{marginBottom:3}}>
                <div style={{fontSize:12,color:M.onSurfVar,textAlign:"right",paddingRight:8,paddingTop:10,lineHeight:1}}>{hour}:00</div>
                {wDays.map(function(d,i){
                  if(isLunch) return <div key={i} style={{height:36,borderRadius:5,background:M.scHst,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s cubic-bezier(.2,0,0,1)"}}><span style={{fontSize:11,color:M.onSurfVar}}>점심</span></div>;
                  var slot=getSlot(d,hour); var past=isPast(d,hour);
                  if(past) return <div key={i} style={{height:36,borderRadius:5,background:M.scHst,opacity:.35}}/>;
                  if(slot){
                    if(slot.slackAvailable){
                      var reqCnt=slackRequests.filter(function(r){return r.date===slot.date&&r.hour===parseInt(slot.start);}).length;
                      return <div key={i} onClick={function(){setViewSlot(slot);}}
                        style={{height:36,borderRadius:5,background:M.warnCont,border:"1px solid "+M.warnBorder,cursor:"pointer",padding:"0 6px",display:"flex",alignItems:"center",gap:4,overflow:"hidden",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
                        <span style={{fontSize:10,color:M.warn,flexShrink:0}}>💬</span>
                        <span style={{fontSize:11,fontWeight:600,color:M.warn,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{reqCnt>0?reqCnt+"건 요청":"슬랙"}</span>
                      </div>;
                    }
                    {var pCnt=slackRequests.filter(function(r){return r.date===slot.date&&r.hour===parseInt(slot.start);}).length; return <div key={i} onClick={function(){setViewSlot(slot);}}
                      style={{height:36,borderRadius:5,background:M.primaryCont,border:"1px solid "+(pCnt>0?M.warn:M.primary+"70"),cursor:"pointer",padding:"0 6px",display:"flex",alignItems:"center",gap:4,overflow:"hidden",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
                      {pCnt>0&&<span style={{fontSize:10,color:M.warn,flexShrink:0}}>🔔</span>}
                      <span style={{fontSize:12,fontWeight:600,color:pCnt>0?M.warn:M.primary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{pCnt>0?pCnt+"건 요청":slot.title}</span>
                    </div>;}
                  }
                  /* 상담 가능 슬롯 — 기본 활성 상태 */
                  return <div key={i} onClick={function(){setTypeSelect({date:d,hour:hour});}}
                    style={{height:36,borderRadius:5,background:M.successCont,border:"1px solid "+M.successBorder,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,transition:"all .12s"}}>
                    <span style={{fontSize:11,fontWeight:500,color:M.success}}>가능</span>
                  </div>;
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Modal open={!!typeSelect} title="일정 유형 선택" onClose={function(){setTypeSelect(null);}} maxWidth={320}
        footer={null}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"4px 0 8px"}}>
          <button onClick={openGuestAdd} style={{padding:"20px 8px",borderRadius:10,border:"1px solid "+M.outlineVar,background:M.scHst,color:M.onSurf,cursor:"pointer",fontSize:14,fontFamily:"'Noto Sans KR',system-ui,sans-serif",lineHeight:1.6,transition:"all .15s"}}>
            <div style={{fontSize:20,marginBottom:6}}>{"👥"}</div>
            <div style={{fontWeight:600}}>고객상담</div>
          </button>
          <button onClick={openSlackAdd} style={{padding:"20px 8px",borderRadius:10,border:"1px solid "+M.primary+"60",background:M.primaryCont,color:M.primary,cursor:"pointer",fontSize:14,fontFamily:"'Noto Sans KR',system-ui,sans-serif",lineHeight:1.6,transition:"all .15s"}}>
            <div style={{fontSize:20,marginBottom:6}}>{"💬"}</div>
            <div style={{fontWeight:600}}>슬랙 미팅<br/>가능 일정</div>
          </button>
        </div>
      </Modal>
            <Modal open={showAdd} title={(addSlot?fmtMD(addSlot.date)+" "+addSlot.hour+":00 – "+(addSlot.hour+1)+":00":"")+" "+(af.slackAvailable?"슬랙 미팅 가능 일정":"상담 예약")} onClose={function(){setShowAdd(false);setAF({title:"",customer_id:"",note:"",slackAvailable:false});}} maxWidth={420}
        footer={<><Btn variant="ghost" onClick={function(){setShowAdd(false);}}>취소</Btn><Btn onClick={saveAdd} disabled={!af.title.trim()}>등록</Btn></>}>
        <Inp label="제목" required value={af.title} onChange={function(e){setAf("title",e.target.value);}} placeholder={af.slackAvailable?"예: 로빈 미팅 가능 일정":"고객사명 또는 미팅 목적"} mb={12}/>
        {!af.slackAvailable&&<Sel label="고객사 연결 (선택)" value={af.customer_id} onChange={function(e){setAf("customer_id",e.target.value);}} options={customers.map(function(c){return{value:c.id,label:c.company};})} placeholder="선택 안함"/>}
        <Inp label="메모" value={af.note} onChange={function(e){setAf("note",e.target.value);}} multiline rows={2} placeholder="참고사항" mb={0}/>
      </Modal>
      <Modal open={!!viewSlot} title={viewSlot&&viewSlot.slackAvailable?"슬랙 미팅 요청":"일정 상세"} onClose={function(){setViewSlot(null);}} maxWidth={380}
        footer={<><Btn variant="danger" size="sm" onClick={function(){if(viewSlot)delSlot(viewSlot.id);}}>삭제</Btn><Btn variant="ghost" size="sm" onClick={function(){setViewSlot(null);}}>닫기</Btn></>}>
        {viewSlot&&<div>
          <div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>{viewSlot.date} · {viewSlot.start} – {viewSlot.end}</div>
          {viewSlot.slackAvailable?(
            <div>
              <div style={{fontSize:13,color:M.onSurfVar,marginBottom:12}}>요청 {slotRequests.length}건</div>
              {slotRequests.length===0&&<div style={{fontSize:13,color:M.onSurfVar,padding:"12px 0"}}>아직 요청이 없습니다.</div>}
              {slotRequests.map(function(req){return(
                <div key={req.id} style={{padding:"10px 12px",marginBottom:8,borderRadius:8,background:M.scHst,border:"1px solid "+M.outlineVar}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:M.onSurf,marginBottom:2}}>{req.requesterName}</div>
                      {req.requesterTitle&&<div style={{fontSize:11,color:M.primary,marginBottom:2}}>{req.requesterTitle}</div>}
                      {req.requesterEmail&&<div style={{fontSize:11,color:M.onSurfVar,marginBottom:2}}>{req.requesterEmail}</div>}
                      <div style={{fontSize:11,color:M.onSurfVar}}>@{req.requesterUsername}{req.requestedAt&&" · "+new Date(req.requestedAt).toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                    <Btn size="sm" onClick={function(){confirmRequest(req.id);}}>확정</Btn>
                  </div>
                </div>
              );})}
              <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid "+M.outlineVar}}><Btn variant="outline" size="sm" style={{color:M.warn,borderColor:M.warn}} onClick={function(){closeSlot(viewSlot);}}>🔒 마감 처리</Btn></div>
            </div>
          ):(
            <div>
              <div style={{fontSize:16,fontWeight:600,color:M.onSurf,marginBottom:6}}>{viewSlot.title}</div>
              {viewSlot.customer_id&&<div style={{fontSize:14,color:M.onSurfVar,marginBottom:4}}>고객사: {(customers.find(function(c){return c.id===viewSlot.customer_id;})||{}).company||""}</div>}
              {viewSlot.note&&<div style={{marginTop:10,padding:"10px 12px",borderRadius:8,background:M.scHst,fontSize:14,color:M.onSurfVar,lineHeight:1.7}}>{viewSlot.note}</div>}
              {slotRequests.length>0&&<div style={{marginTop:14}}>
                <div style={{fontSize:13,fontWeight:600,color:M.warn,marginBottom:8}}>🔔 미결 요청 {slotRequests.length}건</div>
                {slotRequests.map(function(req){return(
                  <div key={req.id} style={{padding:"10px 12px",marginBottom:8,borderRadius:8,background:M.scHst,border:"1px solid "+M.outlineVar}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:M.onSurf,marginBottom:2}}>{req.requesterName}</div>
                        {req.requesterTitle&&<div style={{fontSize:11,color:M.primary,marginBottom:2}}>{req.requesterTitle}</div>}
                        {req.requesterEmail&&<div style={{fontSize:11,color:M.onSurfVar,marginBottom:2}}>{req.requesterEmail}</div>}
                        <div style={{fontSize:11,color:M.onSurfVar}}>@{req.requesterUsername}{req.requestedAt&&" · "+new Date(req.requestedAt).toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                      </div>
                      <Btn size="sm" onClick={function(){confirmRequest(req.id);}}>확정</Btn>
                    </div>
                  </div>
                );})}
              </div>}
            </div>
          )}
        </div>}
      </Modal>
    </div>
  );
}

/* ── Pipeline Mini Chart ─────────────────────────────────────── */
function PipelineMiniChart(p){
  var counts=p.counts||{};
  var ORDER=["신규접수","RM배정","브리핑완료","미팅완료","RFP","계약성사","이탈"];
  var total=ORDER.reduce(function(s,k){return s+(counts[k]||0);},0);
  if(total===0) return <div style={{fontSize:13,color:M.onSurfVar}}>데이터 없음</div>;
  return(
    <div>
      <div style={{height:10,borderRadius:5,overflow:"hidden",display:"flex",marginBottom:10}}>
        {ORDER.map(function(s){var c=counts[s]||0; if(c===0)return null; return <div key={s} style={{flex:c,background:ST[s],transition:"flex .3s"}}/>;  })}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
        {ORDER.map(function(s){var c=counts[s]||0; if(c===0)return null; return(
          <span key={s} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:M.onSurfVar}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:ST[s],flexShrink:0}}/>{s} <span style={{fontWeight:700,color:ST[s]}}>{c}</span>
          </span>
        );})}
      </div>
    </div>
  );
}

/* ── Home Page ───────────────────────────────────────────────── */
function HomePage(p){
  var app=useApp(); var user=app.user;
  var [customers,setCustomers]=useState([]); var [loaded,setLoaded]=useState(false);
  useEffect(function(){(async function(){var cs=await store.get("customers:"+user.id,[]); setCustomers(cs); setLoaded(true);})();}, []);
  var now=new Date(); var hr=now.getHours();
  var greet=hr<12?"좋은 아침이에요":hr<18?"안녕하세요":"수고 많으셨어요";
  var allProjects=[]; customers.forEach(function(c){(c.projects||[]).forEach(function(proj){allProjects.push({proj:proj,company:c.company,custId:c.id,customer:c});});});
  var inProgress=allProjects.filter(function(x){return x.proj.status!=="이탈"&&x.proj.status!=="계약성사";});
  var alerts=inProgress.filter(function(x){return diffDays(x.proj.updatedAt||x.proj.createdAt)>=3;});
  var pipeCount={}; Object.keys(ST).forEach(function(s){pipeCount[s]=0;}); allProjects.forEach(function(x){var s=x.proj.status||"신규접수"; if(pipeCount[s]!==undefined)pipeCount[s]++;});
  var SHORTCUTS=[
    {label:"고객관리",icon:IC.customer,page:"customers",color:M.primary},
    {label:"프로젝트",icon:IC.project,page:"projects",color:M.success},
    {label:"계약관리",icon:IC.contract,page:"contracts",color:M.warn},
    {label:"계약 분석",icon:IC.analysis,page:"analysis",color:"#C084FC"},
  ];
  var STATUS_ORDER=["신규접수","RM배정","브리핑완료","미팅완료","RFP","계약성사","이탈"];

  return(
    <div className="page-scroll" style={{animation:"g-fade .2s ease"}}>

      {/* 인사 + 요약 */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:24,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>{greet}, {user.name}</div>
        <div style={{fontSize:13,color:M.onSurfVar,marginTop:5}}>
          {today()} · 고객 {customers.length}명 · 진행 {inProgress.length}건
          {alerts.length>0&&<span style={{color:M.error}}> · 미응답 {alerts.length}건</span>}
        </div>
      </div>

      {/* Row 1: [바로가기+파이프라인] | [주간 일정] */}
      <div className="home-row1">

        {/* 왼쪽: 바로가기 2×2 → 파이프라인 → 즉시확인 */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* 바로가기 2×2 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {SHORTCUTS.map(function(s){return(
              <button key={s.label} onClick={function(){p.setPage(s.page);}}
                style={{background:M.sc,border:"1px solid "+M.outlineVar,borderRadius:12,padding:"16px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:9,cursor:"pointer",transition:"background .2s cubic-bezier(.2,0,0,1)",minHeight:82}}>
                <div style={{width:34,height:34,borderRadius:10,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",color:s.color}}>{s.icon}</div>
                <span style={{fontSize:12,fontWeight:500,color:M.onSurfVar,textAlign:"center",lineHeight:1.4}}>{s.label}</span>
              </button>
            );})}
          </div>

          {/* 파이프라인 — 자연 높이 */}
          <Card style={{padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:600,color:M.onSurf}}>파이프라인</div>
              <span style={{fontSize:12,color:M.onSurfVar,cursor:"pointer"}} onClick={function(){p.setPage("projects");}}>전체 보기 →</span>
            </div>
            <PipelineMiniChart counts={pipeCount}/>
          </Card>

          {/* 즉시 확인 — 파이프라인 아래 */}
          <Card style={{flex:1}}>
            <div style={{padding:"13px 16px",borderBottom:"1px solid "+M.outlineVar,display:"flex",alignItems:"center",gap:8}}>
              <div style={{color:M.error,display:"flex"}}>{IC.warning}</div>
              <div style={{fontSize:14,fontWeight:600,color:M.onSurf}}>즉시 확인</div>
              {alerts.length>0
                ? <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:10,background:M.errorCont,color:M.error,border:"1px solid "+M.errorBorder}}>{alerts.length}</span>
                : <span style={{marginLeft:"auto",fontSize:11,color:M.success}}>없음</span>}
            </div>
            <div style={{padding:"4px 0"}}>
              {alerts.length===0&&<div style={{padding:"16px 12px",fontSize:13,color:M.onSurfVar,textAlign:"center"}}>긴급 없음</div>}
              {alerts.slice(0,5).map(function(x,i){return(
                <div key={x.proj.id} onClick={function(){p.setCustomer(x.customer);p.setPage("customerDetail");}}
                  style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 16px",cursor:"pointer",borderBottom:i<Math.min(alerts.length,5)-1?"1px solid "+M.outlineVar+"50":"none"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:M.error,flexShrink:0,marginTop:4}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:M.onSurf,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.company}</div>
                    <div style={{fontSize:11,color:M.error,marginTop:1}}>{diffDays(x.proj.updatedAt||x.proj.createdAt)}일째 미응답</div>
                  </div>
                </div>
              );})}
            </div>
          </Card>
        </div>

        {/* 오른쪽: 주간 일정 */}
        <Card style={{padding:"20px 22px"}}>
          <WeeklyCalendar user={user} customers={customers}/>
        </Card>
      </div>

      {/* Row 2: 이번 주 핵심 액션 | 진행 중 프로젝트 */}
      <div className="home-row2">

        {/* 이번 주 핵심 액션 */}
        <Card>
          <div style={{padding:"14px 18px",borderBottom:"1px solid "+M.outlineVar}}>
            <div style={{fontSize:14,fontWeight:600,color:M.onSurf}}>이번 주 핵심 액션</div>
            <div style={{fontSize:12,color:M.onSurfVar,marginTop:2}}>우선순위 순</div>
          </div>
          <div style={{padding:"4px 0"}}>
            {(function(){
              var actions=[];
              alerts.forEach(function(x){actions.push({label:"미응답 "+diffDays(x.proj.updatedAt||x.proj.createdAt)+"일",title:x.company,sub:x.proj.name,color:M.error,customer:x.customer});});
              allProjects.filter(function(x){return x.proj.status==="미팅완료";}).forEach(function(x){actions.push({label:"팀빌딩 제안 대기",title:x.company,sub:x.proj.name,color:"#C084FC",customer:x.customer});});
              allProjects.filter(function(x){return !x.proj.briefing&&x.proj.status!=="이탈"&&x.proj.status!=="계약성사";}).forEach(function(x){actions.push({label:"브리핑 미완성",title:x.company,sub:x.proj.name,color:M.warn,customer:x.customer});});
              allProjects.filter(function(x){return x.proj.status==="RFP";}).forEach(function(x){actions.push({label:"제안서 작성 중",title:x.company,sub:x.proj.name,color:M.primary,customer:x.customer});});
              if(!loaded) return <div style={{padding:24,display:"flex",justifyContent:"center"}}><Spinner/></div>;
              if(actions.length===0) return <div style={{padding:"24px 16px",fontSize:13,color:M.onSurfVar,textAlign:"center"}}>액션 없음</div>;
              return actions.slice(0,6).map(function(a,i){return(
                <div key={i} onClick={function(){p.setCustomer(a.customer);p.setPage("customerDetail");}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 18px",borderBottom:i<Math.min(actions.length,6)-1?"1px solid "+M.outlineVar+"50":"none",cursor:"pointer"}}>
                  <div style={{width:3,height:28,borderRadius:2,background:a.color,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:M.onSurf,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div>
                    <div style={{fontSize:11,color:M.onSurfVar,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.sub}</div>
                  </div>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:a.color+"18",color:a.color,border:"1px solid "+a.color+"30",flexShrink:0,whiteSpace:"nowrap"}}>{a.label}</span>
                </div>
              );});
            })()}
          </div>
        </Card>

        {/* 진행 중 프로젝트 */}
        <Card>
          <div style={{padding:"14px 18px",borderBottom:"1px solid "+M.outlineVar,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:14,fontWeight:600,color:M.onSurf}}>진행 중 프로젝트</div>
            <span style={{fontSize:12,color:M.onSurfVar}}>{inProgress.length}건</span>
          </div>
          <div style={{padding:"4px 0",maxHeight:320,overflowY:"auto"}}>
            {!loaded&&<div style={{padding:24,display:"flex",justifyContent:"center"}}><Spinner/></div>}
            {loaded&&inProgress.length===0&&<div style={{padding:"24px 16px",fontSize:13,color:M.onSurfVar,textAlign:"center"}}>진행 중 프로젝트 없음</div>}
            {inProgress.map(function(x,i){
              var d=diffDays(x.proj.updatedAt||x.proj.createdAt); var late=d>=3;
              return(
                <div key={x.proj.id} onClick={function(){p.setCustomer(x.customer);p.setPage("customerDetail");}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 18px",cursor:"pointer",borderBottom:i<inProgress.length-1?"1px solid "+M.outlineVar+"50":"none"}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:ST[x.proj.status]||M.outline,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,color:M.onSurf,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.company}</div>
                    <div style={{fontSize:11,color:M.onSurfVar,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.proj.name}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
                    <span style={{fontSize:11,padding:"1px 7px",borderRadius:6,background:M.scHst,color:ST[x.proj.status]||M.onSurfVar,fontWeight:500}}>{x.proj.status}</span>
                    {late&&<span style={{fontSize:11,color:M.error}}>{d}일</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}

/* ── Customer List ───────────────────────────────────────────── */
var STAGES=["전체","신규접수","RM배정","브리핑완료","미팅완료","RFP","계약성사","이탈"];
var EMPTY_C={company:"",contact_name:"",contact_title:"",phone:"",email:"",website:"",industry:"",domain:"",budget:"",rm_name:"",memo:""};
function CustomerListPage(p){
  var app=useApp(); var user=app.user;
  var [list,setList]=useState([]); var [filter,setFilter]=useState("전체"); var [q,setQ]=useState(""); var [loaded,setLoaded]=useState(false);
  var [dateFrom,setDateFrom]=useState(""); var [dateTo,setDateTo]=useState("");
  var [page,setPage]=useState(0); var PAGE=20;
  var [showAdd,setShowAdd]=useState(false); var [form,setForm]=useState(Object.assign({},EMPTY_C)); var [saving,setSaving]=useState(false);
  useEffect(function(){load();}, []);
  async function load(){var cs=await store.get("customers:"+user.id,[]); setList(cs); setLoaded(true);}
  function setF(k,v){setForm(function(pr){var n=Object.assign({},pr); n[k]=v; return n;});}
  async function save(){
    if(!form.company)return; setSaving(true);
    var now2=new Date().toISOString();
    var c=Object.assign({},form,{id:uid(),createdAt:now2,updatedAt:now2,userId:user.id,projects:[]});
    var updated=list.concat([c]); await store.set("customers:"+user.id,updated); setList(updated);
    setShowAdd(false); setForm(Object.assign({},EMPTY_C)); setSaving(false);
  }
  var filtered=list.filter(function(c){
    var cs=customerStatus(c); var ms=filter==="전체"||cs===filter;
    var mq=!q||c.company.toLowerCase().includes(q.toLowerCase())||(c.contact_name||"").toLowerCase().includes(q.toLowerCase());
    var dt=c.updatedAt||c.createdAt||""; var mdf=!dateFrom||dt>=dateFrom; var mdt=!dateTo||dt<=dateTo+"T23:59:59";
    return ms&&mq&&mdf&&mdt;
  }).slice().sort(function(a,b){return new Date(b.updatedAt||b.createdAt||0)-new Date(a.updatedAt||a.createdAt||0);});
  var paged=filtered.slice(page*PAGE,(page+1)*PAGE);
  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"20px 28px 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div><div style={{fontSize:22,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>고객관리</div><div style={{fontSize:13,color:M.onSurfVar,marginTop:3}}>총 {list.length}명 · 검색 결과 {filtered.length}명</div></div>
          <Btn onClick={function(){setShowAdd(true);}} style={{gap:6}}>{IC.add} 고객 추가</Btn>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:"1 1 200px"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:M.onSurfVar}}>{IC.search}</span>
            <input value={q} onChange={function(e){setQ(e.target.value);setPage(0);}} placeholder="회사명, 담당자 검색" style={{width:"100%",padding:"10px 13px 10px 38px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:14,color:M.onSurf,outline:"none",boxSizing:"border-box",transition:"background .2s cubic-bezier(.2,0,0,1)",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <input type="date" value={dateFrom} onChange={function(e){setDateFrom(e.target.value);setPage(0);}} style={{padding:"9px 10px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
            <span style={{fontSize:12,color:M.onSurfVar}}>~</span>
            <input type="date" value={dateTo} onChange={function(e){setDateTo(e.target.value);setPage(0);}} style={{padding:"9px 10px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
            {(dateFrom||dateTo)&&<button onClick={function(){setDateFrom("");setDateTo("");}} style={{fontSize:12,color:M.onSurfVar,background:"transparent",border:"none",cursor:"pointer",padding:"2px 6px"}}>초기화</button>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingBottom:16,borderBottom:"1px solid "+M.outlineVar}}>
          {STAGES.map(function(s){var act=filter===s; var cnt=s==="전체"?list.length:list.filter(function(c){return customerStatus(c)===s;}).length; return(
            <button key={s} onClick={function(){setFilter(s);setPage(0);}} style={{padding:"5px 14px",borderRadius:20,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",background:act?M.primaryCont:M.scHst,color:act?M.primary:M.onSurfVar,transition:"background .15s,color .15s",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>
              {s} {cnt>0&&<span style={{opacity:.7}}>{cnt}</span>}
            </button>
          );})}
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"16px 28px 28px"}}>
        {!loaded&&<div style={{display:"flex",justifyContent:"center",padding:48}}><Spinner/></div>}
        {loaded&&filtered.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>{q||filter!=="전체"||dateFrom||dateTo?"검색 결과 없음":"아직 고객이 없어요"}</div><div style={{fontSize:13,color:M.onSurfVar}}>고객 추가 버튼으로 첫 고객을 등록하세요</div></div>}
        {paged.map(function(c){
          var cs=customerStatus(c); var projCount=(c.projects||[]).length;
          var latestUpdate=c.updatedAt||c.createdAt; var d=diffDays(latestUpdate); var danger=d>=3&&cs!=="계약성사"&&cs!=="이탈";
          return(
            <div key={c.id} onClick={function(){p.setCustomer(c);p.setPage("customerDetail");}}
              style={{background:M.sc,borderRadius:12,border:".5px solid "+(danger?M.errorBorder:M.outlineVar),padding:"16px 18px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:16,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
              <div style={{width:40,height:40,borderRadius:12,flexShrink:0,background:M.scHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:M.primary,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>{(c.company||"?").slice(0,1)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:16,fontWeight:600,color:M.onSurf}}>{c.company}</span>
                  <SBadge status={cs}/>
                  {danger&&<span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:12,color:M.error}}><span style={{width:4,height:4,borderRadius:"50%",background:M.error,display:"inline-block"}}></span>{d}일째 미응답</span>}
                </div>
                <div style={{fontSize:13,color:M.onSurfVar,marginBottom:5}}>{[c.contact_name,c.contact_title,c.industry].filter(Boolean).join(" · ")}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,color:M.outline}}>{IC.folder}<span>프로젝트 {projCount}개</span></span>
                  {c.budget&&<span style={{fontSize:12,color:M.onSurfVar}}>· 예산 {c.budget}</span>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                <div style={{color:M.onSurfVar}}>{IC.chevron}</div>
                <div style={{fontSize:12,color:M.onSurfVar}}>{fmt(latestUpdate)}</div>
              </div>
            </div>
          );
        })}
        <Pager total={filtered.length} cur={page} size={PAGE} set={setPage}/>
      </div>
      <Modal open={showAdd} title="고객 추가" onClose={function(){setShowAdd(false);setForm(Object.assign({},EMPTY_C));}} maxWidth={540}
        footer={<><Btn variant="ghost" onClick={function(){setShowAdd(false);}}>취소</Btn><Btn onClick={save} disabled={saving||!form.company}>{saving?<Spinner/>:"저장"}</Btn></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <div style={{gridColumn:"1 / -1"}}><Inp label="회사명" required value={form.company} onChange={function(e){setF("company",e.target.value);}} placeholder="㈜스타트업"/></div>
          <Inp label="담당자 이름" value={form.contact_name} onChange={function(e){setF("contact_name",e.target.value);}} placeholder="홍길동"/>
          <Inp label="직책" value={form.contact_title} onChange={function(e){setF("contact_title",e.target.value);}} placeholder="대표이사"/>
          <Inp label="전화번호" value={form.phone} onChange={function(e){setF("phone",e.target.value);}} placeholder="010-0000-0000"/>
          <Inp label="이메일" value={form.email} type="email" onChange={function(e){setF("email",e.target.value);}} placeholder="contact@company.com"/>
          <Inp label="산업군" value={form.industry} onChange={function(e){setF("industry",e.target.value);}} placeholder="핀테크, SaaS..."/>
          <Inp label="예산" value={form.budget} onChange={function(e){setF("budget",e.target.value);}} placeholder="3,000만원"/>
          <div style={{gridColumn:"1 / -1"}}><Inp label="홈페이지" value={form.website} onChange={function(e){setF("website",e.target.value);}} placeholder="https://company.com"/></div>
          <div style={{gridColumn:"1 / -1"}}><Inp label="메모" value={form.memo} onChange={function(e){setF("memo",e.target.value);}} multiline rows={2} mb={0}/></div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Customer Detail — Project List ──────────────────────────── */
function CustomerDetailPage(p){
  var app=useApp(); var user=app.user;
  var [customer,setCustomer]=useState(p.customer);
  var [showAddProj,setShowAddProj]=useState(false);
  var [projName,setProjName]=useState(""); var [saving,setSaving]=useState(false);
  var [selProject,setSelProject]=useState(null);
  var [initTab,setInitTab]=useState("briefing");
  function openProject(proj,tab){setInitTab(tab||"briefing");setSelProject(proj);}

  async function saveCustomer(updates){
    var updated=Object.assign({},customer,updates,{updatedAt:new Date().toISOString()});
    setCustomer(updated);
    var list=await store.get("customers:"+user.id,[]);
    await store.set("customers:"+user.id,list.map(function(c){return c.id===updated.id?updated:c;}));
  }

  async function addProject(){
    if(!projName.trim())return; setSaving(true);
    var now2=new Date().toISOString();
    var proj={id:uid(),name:projName.trim(),status:"신규접수",briefing:null,rm_memo:"",notes_count:0,rfp_data:null,contract_id:null,createdAt:now2,updatedAt:now2};
    var projs=(customer.projects||[]).concat([proj]);
    await saveCustomer({projects:projs});
    setShowAddProj(false); setProjName(""); setSaving(false);
  }

  async function updateProject(projId,updates){
    var projs=(customer.projects||[]).map(function(pr){return pr.id===projId?Object.assign({},pr,updates,{updatedAt:new Date().toISOString(),status:projectStatus(Object.assign({},pr,updates))}):pr;});
    await saveCustomer({projects:projs});
  }

  if(selProject){
    return <ProjectDetailPage
      customer={customer} project={selProject} initialTab={initTab}
      onBack={function(){setSelProject(null);}}
      onUpdate={function(updates){
        updateProject(selProject.id,updates);
        setSelProject(function(prev){return Object.assign({},prev,updates,{status:projectStatus(Object.assign({},prev,updates))});});
      }}
      setPage={p.setPage}
    />;
  }

  var projs=customer.projects||[];
  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      {/* Header */}
      <div style={{padding:"14px 24px 0",flexShrink:0,background:M.surface,borderBottom:"1px solid "+M.outlineVar,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={function(){p.setPage("customers");}} style={{background:"none",border:"none",cursor:"pointer",color:M.onSurfVar,display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>
            {IC.back}<span style={{fontSize:13}}>목록</span>
          </button>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{fontSize:20,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>{customer.company}</span>
              <SBadge status={customerStatus(customer)}/>
            </div>
            <div style={{fontSize:12,color:M.onSurfVar,marginTop:2}}>{[customer.contact_name,customer.contact_title,customer.phone].filter(Boolean).join(" · ")}</div>
          </div>
          <Btn size="sm" onClick={function(){setShowAddProj(true);}} style={{gap:4}}>{IC.add} 프로젝트 추가</Btn>
        </div>
        {/* 고객 기본 정보 요약 */}
        <div style={{display:"flex",alignItems:"center",gap:0,paddingBottom:14,fontSize:13,color:M.onSurfVar,flexWrap:"wrap",rowGap:4}}>
          {[
            customer.industry&&("산업: "+customer.industry),
            customer.budget&&("예산: "+customer.budget),
            customer.email,
            customer.website,
          ].filter(Boolean).map(function(item,i){return(
            <span key={i} style={{display:"inline-flex",alignItems:"center"}}>
              {i>0&&<span style={{margin:"0 10px",opacity:.35}}>·</span>}
              <span style={{color:item.startsWith("http")?M.primary:item.startsWith("산업")||item.startsWith("예산")?M.onSurfVar:M.onSurfVar}}>{item}</span>
            </span>
          );})}
        </div>
      </div>
      {/* Project List */}
      <div style={{overflowY:"auto",flex:1,padding:"16px 24px"}}>
        <div style={{fontSize:14,fontWeight:600,color:M.onSurf,marginBottom:12}}>프로젝트 목록 <span style={{fontSize:12,fontWeight:400,color:M.onSurfVar}}>({projs.length}개)</span></div>
        {projs.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:32,marginBottom:12}}>📁</div>
            <div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>아직 프로젝트가 없어요</div>
            <div style={{fontSize:13,color:M.onSurfVar,marginBottom:20}}>프로젝트 추가 버튼으로 첫 프로젝트를 만드세요</div>
            <Btn onClick={function(){setShowAddProj(true);}}>+ 프로젝트 추가</Btn>
          </div>
        )}
        {projs.map(function(proj){
          var d=diffDays(proj.updatedAt||proj.createdAt); var danger=d>=3&&proj.status!=="계약성사"&&proj.status!=="이탈";
          var badgeSt={display:"inline-flex",alignItems:"center",gap:4,fontSize:12,padding:"4px 11px",borderRadius:6,cursor:"pointer",border:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif",transition:"opacity .1s"};
          return(
            <div key={proj.id} onClick={function(){openProject(proj,"briefing");}}
              style={{background:M.sc,borderRadius:12,border:".5px solid "+(danger?M.errorBorder:M.outlineVar),padding:"16px 18px",marginBottom:10,cursor:"pointer",transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:15,fontWeight:600,color:M.onSurf}}>{proj.name}</span>
                    <SBadge status={proj.status}/>
                    {danger&&<span style={{fontSize:12,color:M.error}}>{d}일 업데이트 없음</span>}
                  </div>
                  <div style={{fontSize:12,color:M.onSurfVar,marginTop:3}}>생성일 {fmt(proj.createdAt)}</div>
                </div>
                <div style={{color:M.onSurfVar}}>{IC.chevron}</div>
              </div>
              {/* Progress indicators — 클릭 시 해당 탭으로 바로 이동 */}
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                <button onClick={function(e){e.stopPropagation();openProject(proj,"briefing");}}
                  style={Object.assign({},badgeSt,{background:proj.briefing?M.successCont:M.scHst,color:proj.briefing?M.success:M.onSurfVar,border:"1px solid "+(proj.briefing?M.successBorder:M.outlineVar)})}>
                  <span style={{display:"inline-flex",alignItems:"center",flexShrink:0}}>{IC.check}</span>
                  <span>브리핑 {proj.briefing?"완료":"대기"}</span>
                </button>
                <button onClick={function(e){e.stopPropagation();openProject(proj,"consulting");}}
                  style={Object.assign({},badgeSt,{background:(proj.notes_count||0)>0?M.successCont:M.scHst,color:(proj.notes_count||0)>0?M.success:M.onSurfVar,border:"1px solid "+((proj.notes_count||0)>0?M.successBorder:M.outlineVar)})}>
                  상담기록 {proj.notes_count||0}건
                </button>
                <button onClick={function(e){e.stopPropagation();openProject(proj,"rfp");}}
                  style={Object.assign({},badgeSt,{background:proj.rfp_data?M.successCont:M.scHst,color:proj.rfp_data?M.success:M.onSurfVar,border:"1px solid "+(proj.rfp_data?M.successBorder:M.outlineVar)})}>
                  팀빌딩 {proj.rfp_data?"완료":"대기"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={showAddProj} title="프로젝트 추가" onClose={function(){setShowAddProj(false);setProjName("");}}
        footer={<><Btn variant="ghost" onClick={function(){setShowAddProj(false);}}>취소</Btn><Btn onClick={addProject} disabled={saving||!projName.trim()}>{saving?<Spinner/>:"추가"}</Btn></>}>
        <Inp label="프로젝트명" required value={projName} onChange={function(e){setProjName(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")addProject();}} placeholder="예: 모바일 앱 MVP, 관리자 백오피스" mb={0}/>
      </Modal>
    </div>
  );
}

/* ── Project Detail — 4 Tabs ─────────────────────────────────── */
function ProjectDetailPage(p){
  var [tab,setTab]=useState(p.initialTab||"briefing");
  var TABS=[{id:"briefing",label:"브리핑"},{id:"consulting",label:"상담기록"},{id:"requirements",label:"요구사항"},{id:"rfp",label:"팀빌딩 제안서"}];
  var content;
  if(tab==="briefing") content=<BriefingTab customer={p.customer} project={p.project} onUpdate={p.onUpdate}/>;
  else if(tab==="consulting") content=<ConsultingTab project={p.project} onUpdate={p.onUpdate}/>;
  else if(tab==="requirements") content=<RequirementsTab project={p.project}/>;
  else content=<RFPTab customer={p.customer} project={p.project} onUpdate={p.onUpdate}/>;
  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"12px 24px 0",flexShrink:0,background:M.surface,borderBottom:"1px solid "+M.outlineVar,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <button onClick={p.onBack} style={{background:"none",border:"none",cursor:"pointer",color:M.onSurfVar,display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>
            {IC.back}<span style={{fontSize:13}}>{p.customer.company}</span>
          </button>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18,fontWeight:700,color:M.onSurf}}>{p.project.name}</span>
              <SBadge status={p.project.status}/>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:0}}>
          {TABS.map(function(t){var act=tab===t.id; return(
            <button key={t.id} onClick={function(){setTab(t.id);}} style={{padding:"9px 16px",fontSize:14,fontWeight:act?600:400,color:act?M.primary:M.onSurfVar,background:"transparent",border:"none",cursor:"pointer",borderBottom:act?"2px solid "+M.primary:"2px solid transparent",marginBottom:-1,transition:"all .2s cubic-bezier(.2,0,0,1)",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>
              {t.label}
            </button>
          );})}
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>{content}</div>
    </div>
  );
}

/* ── Briefing Tab ────────────────────────────────────────────── */
function BriefingTab(p){
  var proj=p.project; var c=p.customer;
  var HIST_KEY="briefing_hist:"+proj.id;
  var [hist,setHist]=useState([]); var [briefing,setBriefing]=useState(proj.briefing||null);
  var [signal,setSignal]=useState("warmup"); var [hasComp,setHasComp]=useState(false); var [compName,setCompName]=useState(""); var [memo,setMemo]=useState(proj.rm_memo||"");
  var [gen,setGen]=useState(false); var [genMsg,setGenMsg]=useState(""); var [showSum,setShowSum]=useState(true); var [viewId,setViewId]=useState(null); var [copied,setCopied]=useState(false);
  useEffect(function(){(async function(){var h=await store.get(HIST_KEY,[]); setHist(h);})();}, []);
  var SYS="당신은 GRIDGE IT 리소스 매칭 RM의 내부 브리핑 에이전트입니다. 상담 전 고객 예측 문서입니다. RM만 보는 내부 문서로 솔직하고 날카롭게 작성하세요.\n\n절대 금지:\n- 이모지 사용 금지 (모두 금지)\n- 섹션 외 안내 문구 금지 (브리핑 작성 전 안내, 참고 등)\n- 웹 검색 실패 안내 금지 (공개 정보를 확인하기 어려웠습니다 등)\n- 검색 결과 부재 언급 금지\n\n웹 검색 결과가 없으면:\n- 회사 브리핑 섹션 전체 생략 (다른 섹션은 정상 작성)\n- 안내 문구 없이 그냥 다음 섹션으로 이동\n\n출력 형식은 반드시 아래 섹션만:\n## 요약 3줄\n**상황:** [고객 상황 1줄]\n**진짜 니즈:** [말한 것과 실제 차이 1줄]\n**핵심 리스크:** [계약을 막을 요인 1줄]\n\n## 회사 브리핑 (웹 검색 결과 있을 때만 작성)\n[회사 산업, 사업 2줄]\n\n## 예측 니즈\n- **말한 것:** [표면 요청]\n- **실제 원하는 것:** [심층 동기]\n- **놓치면 안 되는 포인트:** [핵심]\n\n## 이탈 리스크 진단\n**레벨:** [높음/중간/낮음]\n- [시나리오 1]\n- [시나리오 2]\n\n## 미팅 전 확인사항\n1. [항목]\n2. [항목]\n\n## 미팅 질문셋\n**[상황]** [자연스러운 질문]\n\n## 팀 구성 힌트\n**추천:** [포지션] [등급] x [인원]\n\n## RM Next Step\n[다음 액션 2~3줄]";
  async function contributeToRequirements(briefingText, version){
    try{
      var reqKey="requirements:"+proj.id;
      var existing=await store.get(reqKey,null);
      var base={must_have:[],should_have:[],nice_to_have:[],tech_spec:{platforms:[],stack:[],integrations:[],existing_system:false},constraints:{deadline:"",budget_type:"",budget_amount:""},open_questions:[],team_hints:[],version:1,last_updated:""};
      if(!existing) existing=base;
      var extracted=await callAI(
        "브리핑:\n"+briefingText+"\n\n위 브리핑에서 추출 가능한 요구사항을 JSON으로만 출력:\n{\"nice_to_have\":[{\"feature\":\"...\",\"reason\":\"...\"}],\"team_hints\":[{\"position\":\"...\",\"grade\":\"...\",\"reason\":\"...\"}],\"tech_spec\":{\"platforms\":[],\"stack\":[]}}",
        "요구사항 추출 에이전트. JSON만 출력. 마크다운 없이. 코드블록 없이.",
        1000,false
      );
      var parsed=null;
      try{ var clean=extracted.replace(/```json|```/g,"").trim(); parsed=JSON.parse(clean); }catch(e2){}
      if(!parsed) return;
      var src="브리핑 v"+version;
      var newNice=(parsed.nice_to_have||[]).map(function(r){return{id:uid(),feature:r.feature||"",source:src,confidence:"low",status:"AI추론",rm_memo:"",phase:null};});
      var newHints=(parsed.team_hints||[]).map(function(h){return{position:h.position||"",grade:h.grade||"",reason:h.reason||"",source:src};});
      var newPlat=(parsed.tech_spec&&parsed.tech_spec.platforms)||[];
      var newStack=(parsed.tech_spec&&parsed.tech_spec.stack)||[];
      var merged=Object.assign({},existing);
      var existPlat=merged.tech_spec.platforms||[];
      var conflict=null;
      if(existPlat.length>0&&newPlat.length>0){
        var overlap=existPlat.some(function(p2){return newPlat.indexOf(p2)!==-1;});
        if(!overlap) conflict={type:"플랫폼 변경",from:existPlat.join(","),to:newPlat.join(",")};
      }
      if(conflict){
        merged.must_have=merged.must_have.map(function(r){return r.status==="RM확정"?r:Object.assign({},r,{status:"충돌대기",conflict:conflict});});
      }
      var existNiceFeatures=merged.nice_to_have.map(function(r){return r.feature;});
      newNice.forEach(function(r){
        var dup=existNiceFeatures.indexOf(r.feature)!==-1;
        if(!dup) merged.nice_to_have=merged.nice_to_have.concat([r]);
      });
      merged.team_hints=merged.team_hints.concat(newHints);
      if(newPlat.length>0) merged.tech_spec=Object.assign({},merged.tech_spec,{platforms:newPlat});
      if(newStack.length>0) merged.tech_spec=Object.assign({},merged.tech_spec,{stack:merged.tech_spec.stack.concat(newStack)});
      merged.version=(merged.version||1)+1;
      merged.last_updated=new Date().toISOString();
      await store.set(reqKey,merged);
    }catch(e){console.error("contributeToRequirements error",e);}
  }
  async function generate(){
    setGen(true); setViewId(null); setGenMsg("웹 검색 중...");
    try{
      var sigL={hot:"핫",warmup:"워밍업",cold:"콜드"};
      var msg=["고객: "+c.company,"프로젝트: "+proj.name,"홈페이지: "+(c.website||"미입력"),"산업: "+(c.industry||"미입력"),"예산: "+(c.budget||"미입력"),"계약 가능성: "+sigL[signal],"경쟁사: "+(hasComp?(compName||"있음"):"없음"),memo?"특이사항: "+memo:"","\n위 정보와 웹 검색을 종합해 브리핑을 작성하세요."].filter(Boolean).join("\n");
      setGenMsg("AI 브리핑 생성 중...");
      var tx=await callAI(msg,SYS,3000,true);
      var prevH=await store.get(HIST_KEY,[]);
      var entry={id:uid(),content:tx,timestamp:new Date().toISOString(),version:prevH.length+1,signal:signal};
      var newH=prevH.concat([entry]); await store.set(HIST_KEY,newH); setHist(newH);
      setBriefing(tx); await p.onUpdate({briefing:tx,rm_memo:memo});
      setGenMsg("요구사항 추출 중...");
      await contributeToRequirements(tx,entry.version);
    }catch(e){setBriefing("오류: "+e.message);}
    setGen(false); setGenMsg("");
  }
  function extractSummary(t){ if(!t)return null; var m=t.match(/## 요약 3줄([\s\S]*?)(?=\n##|$)/); return m?m[1].trim():null; }
  function copyBriefing(){ navigator.clipboard.writeText(briefing||"").then(function(){setCopied(true);setTimeout(function(){setCopied(false);},2000);}); }
  var viewEntry=viewId?hist.find(function(h){return h.id===viewId;}):null;
  var displayContent=viewEntry?viewEntry.content:briefing;
  var summary=!gen&&briefing?extractSummary(briefing):null;
  var sigC={hot:{label:"핫",color:"#FF6B35"},warmup:{label:"워밍업",color:M.warn},cold:{label:"콜드",color:M.onSurfVar}};
  return (
    <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
      <Card style={{padding:"16px 20px",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:600,color:M.onSurf,marginBottom:14}}>브리핑 전 RM 입력 <span style={{fontSize:12,fontWeight:400,color:M.onSurfVar}}>— 입력할수록 분석이 정확해집니다</span></div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:500,color:M.onSurfVar,marginBottom:7}}>계약 가능성 체감</div>
          <div style={{display:"flex",gap:6}}>
            {[["hot","핫","#FF6B35","rgba(255,107,53,0.15)"],["warmup","워밍업",M.warn,"rgba(255,185,80,0.15)"],["cold","콜드",M.onSurfVar,M.scHi]].map(function(o){
              var act=signal===o[0];
              return <button key={o[0]} onClick={function(){setSignal(o[0]);}} style={{padding:"6px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:act?600:400,border:"1px solid "+(act?o[2]:M.outlineVar),background:act?o[3]:"transparent",color:act?o[2]:M.onSurfVar,transition:"all .2s cubic-bezier(.2,0,0,1)",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>{o[1]}</button>;
            })}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:500,color:M.onSurfVar,marginBottom:7}}>경쟁사 언급</div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            {[["없음",false],["있음",true]].map(function(o){var act=hasComp===o[1]; return <button key={o[0]} onClick={function(){setHasComp(o[1]);if(!o[1])setCompName("");}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+(act?M.primary:M.outlineVar),background:act?M.primaryCont:"transparent",color:act?M.primary:M.onSurfVar,fontSize:13,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>{o[0]}</button>;})}
            {hasComp&&<input value={compName} onChange={function(e){setCompName(e.target.value);}} placeholder="업체명" style={{flex:1,minWidth:140,padding:"6px 10px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>}
          </div>
        </div>
        <Inp label="특이사항 메모" value={memo} onChange={function(e){setMemo(e.target.value);}} multiline rows={2} placeholder="예) CTO 직접 참여, 이전 업체 불만, 2주 안에 결정" mb={8}/>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <Btn onClick={generate} disabled={gen} style={{padding:"8px 28px"}}>
            {gen?<><Spinner size={14}/><span style={{marginLeft:6}}>{genMsg}</span></>:briefing?"재생성":"브리핑 생성"}
          </Btn>
        </div>
      </Card>
      {summary&&!gen&&(
        <Card style={{padding:"12px 16px",marginBottom:12,background:"rgba(77,130,200,0.07)",border:"1px solid "+M.primaryCont+"50"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:10,fontWeight:700,color:M.primary,textTransform:"uppercase",letterSpacing:".08em"}}>요약 3줄</span>
            <button onClick={function(){setShowSum(function(v){return !v;});}} style={{fontSize:12,padding:"2px 8px",borderRadius:6,border:"1px solid "+M.primaryCont+"60",background:"transparent",color:M.primary,cursor:"pointer"}}>{showSum?"접기":"펼치기"}</button>
          </div>
          {showSum&&<MarkdownSimple content={summary}/>}
        </Card>
      )}
      {displayContent&&!gen&&(
        <Card style={{marginBottom:16}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+M.outlineVar,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:viewEntry?M.onSurfVar:M.primary}}></span>
              <span style={{fontSize:12,fontWeight:600,color:viewEntry?M.onSurfVar:M.primary,textTransform:"uppercase"}}>{viewEntry?(viewEntry.version+"차 브리핑"):"최신 브리핑"}</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              {viewEntry&&<Btn variant="outline" size="sm" onClick={function(){setViewId(null);}}>최신 보기</Btn>}
              {!viewEntry&&<Btn variant="ghost" size="sm" onClick={copyBriefing}>{copied?<>{IC.check}복사됨</>:<>{IC.copy}복사</>}</Btn>}
            </div>
          </div>
          <div style={{padding:"16px 20px"}}><MarkdownSimple content={displayContent}/></div>
        </Card>
      )}
      {hist.length>1&&!gen&&(
        <Card style={{marginBottom:16}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+M.outlineVar,fontSize:14,fontWeight:600,color:M.onSurf}}>히스토리 <span style={{fontSize:12,fontWeight:400,color:M.onSurfVar}}>({hist.length}건)</span></div>
          {[].concat(hist).reverse().map(function(entry,i){
            var isCur=!viewId&&i===0; var isView=viewId===entry.id; var act=isCur||isView;
            var sm=entry.signal?sigC[entry.signal]:null;
            return(
              <div key={entry.id} onClick={function(){setViewId(isCur?null:entry.id);}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",cursor:"pointer",background:act?M.primaryCont+"20":"transparent",transition:"background .2s cubic-bezier(.2,0,0,1)",borderBottom:i<hist.length-1?"1px solid "+M.outlineVar:"none"}}>
                <div style={{width:26,height:26,borderRadius:6,flexShrink:0,background:act?M.primaryCont:M.scHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:act?M.primary:M.onSurfVar}}>{entry.version}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,fontWeight:act?600:400,color:act?M.primary:M.onSurf}}>{entry.version}차 브리핑</span>
                    {isCur&&<span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:M.primary,color:M.onPrimary,fontWeight:500}}>최신</span>}
                    {sm&&<span style={{fontSize:10,padding:"1px 5px",borderRadius:4,background:"rgba(255,185,80,0.15)",color:sm.color}}>{sm.label}</span>}
                  </div>
                  <div style={{fontSize:12,color:M.onSurfVar,marginTop:1}}>{fmt(entry.timestamp)}</div>
                </div>
                <div style={{color:M.onSurfVar}}>{IC.chevron}</div>
              </div>
            );
          })}
        </Card>
      )}
      {!briefing&&!gen&&(
        <div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:32,marginBottom:12}}>💡</div><div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>브리핑이 아직 없어요</div><div style={{fontSize:13,color:M.onSurfVar}}>위에서 정보를 입력하고 브리핑 생성을 눌러주세요</div></div>
      )}
    </div>
  );
}

/* ── Consulting Tab ──────────────────────────────────────────── */
function ConsultingTab(p){
  var proj=p.project;
  var NOTES_KEY="notes:"+proj.id;
  var [notes,setNotes]=useState([]); var [loaded,setLoaded]=useState(false);
  var [showAdd,setShowAdd]=useState(false); var [noteForm,setNoteForm]=useState({title:"",date:today(),content:""});
  var [saving,setSaving]=useState(false); var [analyzing,setAnalyzing]=useState(null); var [expandId,setExpandId]=useState(null);
  useEffect(function(){(async function(){var ns=await store.get(NOTES_KEY,[]); setNotes(ns); setLoaded(true);})();}, [proj.id]);
  function setNF(k,v){setNoteForm(function(pr){var n=Object.assign({},pr); n[k]=v; return n;});}
  async function addNote(){
    if(!noteForm.content.trim())return; setSaving(true);
    var note={id:uid(),title:noteForm.title||(proj.name+" "+(notes.length+1)+"차 상담"),date:noteForm.date,content:noteForm.content,analysis:null,createdAt:new Date().toISOString()};
    var updated=notes.concat([note]); await store.set(NOTES_KEY,updated); setNotes(updated);
    await p.onUpdate({notes_count:updated.length}); setShowAdd(false); setNoteForm({title:"",date:today(),content:""}); setSaving(false);
  }
  async function analyze(noteId){
    setAnalyzing(noteId);
    var note=notes.find(function(n){return n.id===noteId;}); if(!note){setAnalyzing(null);return;}
    try{
      var CONSULT_SYS="당신은 GRIDGE IT 리소스 매칭 RM의 상담 분석 에이전트입니다.\n\nRM의 사고 패턴 6단계로 분석하세요:\n1. 방문 이유 (표면 니즈) — 고객이 말한 그대로의 요청\n2. 진짜 니즈 (내재 니즈) — 말 속의 실제 목적. 반드시 표면 니즈와 분리해서 쓰세요. 합치지 마세요.\n3. 현실 충돌 지점 — 니즈와 현실 사이의 갭 (예산/일정/기술/조직). 수치 포함.\n4. 제공 가능한 솔루션 — 충돌을 해소할 현실적 대안\n5. 수용 불가 요구사항 — 현실적으로 받아들일 수 없는 요청 + 설득 방향\n6. 액션 아이템 — 반드시 [주체] + [행동] + [기한] 형식으로. \"확인 필요\" 금지.\n\n절대 금지: 이모지, 수동태, \"~할 수 있다\", 모호한 표현\n출력 형식:\n## 방문 이유\n[고객이 말한 그대로]\n\n## 진짜 니즈\n[표면 뒤의 실제 목적 — 비즈니스 목표 관점으로]\n\n## 현실 충돌\n- [갭 항목]: [현재 상황] vs [요구 상황] — [차이 수치나 조건]\n\n## 솔루션 방향\n- [대안 1]\n- [대안 2]\n\n## 수용 불가\n- [요청]: [이유] → 설득 포인트: [방향]\n\n## 액션 아이템\n- [주체]가 [기한]까지 [행동]합니다";
      var userMsg="프로젝트: "+proj.name+"\n\n상담 기록:\n"+note.content;
      var tx=await callAI(userMsg,CONSULT_SYS,2500,false);
      var updated=notes.map(function(n){return n.id===noteId?Object.assign({},n,{analysis:tx}):n;});
      await store.set(NOTES_KEY,updated); setNotes(updated);
      await contributeConsultingToRequirements(tx,note.title,note.date);
    }catch(e){console.error(e);}
    setAnalyzing(null);
  }
  async function contributeConsultingToRequirements(analysis, noteTitle, noteDate){
    try{
      var reqKey="requirements:"+proj.id;
      var existing=await store.get(reqKey,null);
      var base={surface_needs:"",real_needs:"",must_have:[],should_have:[],nice_to_have:[],conflicts:[],unacceptable:[],action_items:[],tech_spec:{platforms:[],stack:[],integrations:[],existing_system:false},constraints:{deadline:"",budget_type:"",budget_amount:""},open_questions:[],team_hints:[],version:1,last_updated:""};
      if(!existing) existing=base;
      /* 필드 하위호환 */
      if(!existing.conflicts) existing.conflicts=[];
      if(!existing.unacceptable) existing.unacceptable=[];
      if(!existing.action_items) existing.action_items=[];
      if(!existing.surface_needs) existing.surface_needs="";
      if(!existing.real_needs) existing.real_needs="";
      var extracted=await callAI(
        "상담 분석 결과:\n"+analysis+"\n\n위 분석에서 아래 JSON으로만 출력. 코드블록 없이:\n"+
        "{"+
          "\"surface_needs\":\"방문 이유 1줄\","+
          "\"real_needs\":\"진짜 니즈 1줄\","+
          "\"must_have\":[{\"feature\":\"기능명\",\"reason\":\"근거\"}],"+
          "\"should_have\":[{\"feature\":\"기능명\",\"reason\":\"근거\"}],"+
          "\"conflicts\":[{\"issue\":\"충돌 항목\",\"current\":\"현재\",\"required\":\"요구\",\"gap\":\"차이\"}],"+
          "\"unacceptable\":[{\"request\":\"요청\",\"reason\":\"이유\",\"persuasion\":\"설득 방향\"}],"+
          "\"action_items\":[{\"who\":\"주체\",\"action\":\"행동\",\"deadline\":\"기한\"}],"+
          "\"open_questions\":[{\"question\":\"미결 질문\"}],"+
          "\"tech_spec\":{\"platforms\":[],\"stack\":[]}"+
        "}",
        "요구사항 추출 에이전트. JSON만 출력. 마크다운 없이. 코드블록 없이.",
        1500,false
      );
      var parsed=null;
      try{ var clean=extracted.replace(/```json|```/g,"").trim(); parsed=JSON.parse(clean); }catch(e2){}
      if(!parsed) return;
      var src=noteTitle+" "+noteDate;
      var merged=Object.assign({},existing);
      /* 표면/진짜 니즈: 가장 최신 상담 기준으로 업데이트 (RM 확정 없으면) */
      if(parsed.surface_needs&&!existing.surface_needs_confirmed) merged.surface_needs=parsed.surface_needs;
      if(parsed.real_needs&&!existing.real_needs_confirmed) merged.real_needs=parsed.real_needs;
      /* 플랫폼 충돌 감지 */
      var newPlat=(parsed.tech_spec&&parsed.tech_spec.platforms)||[];
      var existPlat=merged.tech_spec.platforms||[];
      var platConflict=null;
      if(existPlat.length>0&&newPlat.length>0){
        var overlap=existPlat.some(function(pl){return newPlat.indexOf(pl)!==-1;});
        if(!overlap) platConflict={type:"플랫폼 변경",from:existPlat.join(","),to:newPlat.join(",")};
      }
      if(platConflict) merged.must_have=merged.must_have.map(function(r){return r.status==="RM확정"?r:Object.assign({},r,{status:"충돌대기",conflict:platConflict});});
      /* must/should have */
      (parsed.must_have||[]).forEach(function(r){
        var dup=merged.must_have.some(function(e2){return e2.feature===r.feature;});
        if(!dup) merged.must_have=merged.must_have.concat([{id:uid(),feature:r.feature,source:src,confidence:"high",status:"AI추론",rm_memo:"",phase:null}]);
      });
      (parsed.should_have||[]).forEach(function(r){
        var dup=merged.should_have.some(function(e2){return e2.feature===r.feature;});
        if(!dup) merged.should_have=merged.should_have.concat([{id:uid(),feature:r.feature,source:src,confidence:"high",status:"AI추론",rm_memo:"",phase:null}]);
      });
      /* 현실 충돌 */
      (parsed.conflicts||[]).forEach(function(c){
        merged.conflicts=merged.conflicts.concat([Object.assign({},c,{source:src,id:uid()})]);
      });
      /* 수용 불가 */
      (parsed.unacceptable||[]).forEach(function(u){
        merged.unacceptable=merged.unacceptable.concat([Object.assign({},u,{source:src,id:uid()})]);
      });
      /* 액션 아이템 */
      (parsed.action_items||[]).forEach(function(a){
        merged.action_items=merged.action_items.concat([Object.assign({},a,{source:src,id:uid(),done:false})]);
      });
      /* 미결 */
      (parsed.open_questions||[]).forEach(function(q){
        merged.open_questions=merged.open_questions.concat([{question:q.question,source:src}]);
      });
      if(newPlat.length>0) merged.tech_spec=Object.assign({},merged.tech_spec,{platforms:newPlat});
      var newStack=(parsed.tech_spec&&parsed.tech_spec.stack)||[];
      if(newStack.length>0) merged.tech_spec=Object.assign({},merged.tech_spec,{stack:(merged.tech_spec.stack||[]).concat(newStack)});
      merged.version=(merged.version||1)+1;
      merged.last_updated=new Date().toISOString();
      await store.set(reqKey,merged);
    }catch(e){console.error("consulting contributeToReq error",e);}
  }
  async function deleteNote(noteId){
    var updated=notes.filter(function(n){return n.id!==noteId;}); await store.set(NOTES_KEY,updated); setNotes(updated);
    await p.onUpdate({notes_count:updated.length});
  }
  var sorted=[].concat(notes).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});
  return (
    <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:16,fontWeight:600,color:M.onSurf}}>상담 기록</div><div style={{fontSize:12,color:M.onSurfVar,marginTop:2}}>총 {notes.length}건 · 브리핑과 독립적으로 관리됩니다</div></div>
        <Btn onClick={function(){setShowAdd(true);}} size="sm" style={{gap:4}}>{IC.add} 기록 추가</Btn>
      </div>
      {!loaded&&<div style={{display:"flex",justifyContent:"center",padding:40}}><Spinner/></div>}
      {loaded&&sorted.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:32,marginBottom:12}}>📋</div><div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>상담 기록이 없어요</div><div style={{fontSize:13,color:M.onSurfVar}}>미팅 후 기록 추가 버튼으로 회의록을 등록하세요</div></div>}
      {sorted.map(function(note){
        var expanded=expandId===note.id;
        return(
          <Card key={note.id} style={{marginBottom:12}}>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:M.onSurf,marginBottom:2}}>{note.title}</div><div style={{fontSize:12,color:M.onSurfVar}}>{note.date}</div></div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  {!note.analysis&&<Btn variant="outline" size="sm" onClick={function(){analyze(note.id);}} disabled={analyzing===note.id}>{analyzing===note.id?<Spinner size={12}/>:<>{IC.spark}AI 분석</>}</Btn>}
                  <Btn variant="ghost" size="sm" onClick={function(){setExpandId(expanded?null:note.id);}}>{expanded?"접기":"펼치기"}</Btn>
                  <Btn variant="ghost" size="sm" onClick={function(){deleteNote(note.id);}}>{IC.trash}</Btn>
                </div>
              </div>
              {expanded&&(
                <div style={{marginTop:12}}>
                  <div style={{padding:"12px 14px",borderRadius:8,background:M.scHst,fontSize:14,color:M.onSurfVar,lineHeight:1.75,whiteSpace:"pre-wrap",marginBottom:note.analysis?12:0,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>{note.content}</div>
                  {note.analysis&&<div style={{padding:"12px 14px",borderRadius:8,background:"rgba(77,130,200,0.07)",border:"1px solid "+M.primaryCont+"40"}}><div style={{fontSize:12,fontWeight:700,color:M.primary,marginBottom:10}}>AI 분석</div><MarkdownSimple content={note.analysis}/></div>}
                  {analyzing===note.id&&!note.analysis&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px",borderRadius:8,background:M.scHst}}><Spinner size={14}/><span style={{fontSize:13,color:M.onSurfVar}}>분석 중...</span></div>}
                </div>
              )}
            </div>
          </Card>
        );
      })}
      <Modal open={showAdd} title="상담 기록 추가" onClose={function(){setShowAdd(false);}} maxWidth={540}
        footer={<><Btn variant="ghost" onClick={function(){setShowAdd(false);}}>취소</Btn><Btn onClick={addNote} disabled={saving||!noteForm.content.trim()}>{saving?<Spinner/>:"저장"}</Btn></>}>
        <Inp label="제목" value={noteForm.title} onChange={function(e){setNF("title",e.target.value);}} placeholder="1차 미팅"/>
        <Inp label="날짜" type="date" value={noteForm.date} onChange={function(e){setNF("date",e.target.value);}}/>
        <Inp label="내용" required value={noteForm.content} onChange={function(e){setNF("content",e.target.value);}} multiline rows={8} placeholder="미팅 내용, 고객 발언, 논의 사항을 자유롭게 입력하세요" mb={0}/>
      </Modal>
    </div>
  );
}

/* ── Requirements Tab ───────────────────────────────────────── */
function RequirementsTab(p){
  var proj=p.project;
  var REQ_KEY="requirements:"+proj.id;
  var [req,setReq]=useState(null); var [loaded,setLoaded]=useState(false);
  useEffect(function(){(async function(){var r=await store.get(REQ_KEY,null); setReq(r); setLoaded(true);})();}, [proj.id]);
  async function saveReq(updated){
    var next=Object.assign({},updated,{last_updated:new Date().toISOString()});
    await store.set(REQ_KEY,next); setReq(next);
  }
  async function confirmItem(section, id){
    var next=Object.assign({},req);
    next[section]=next[section].map(function(r){return r.id===id?Object.assign({},r,{status:"RM확정"}):r;});
    await saveReq(next);
  }
  async function setPhase(section, id, phase){
    var next=Object.assign({},req);
    next[section]=next[section].map(function(r){return r.id===id?Object.assign({},r,{phase:phase}):r;});
    await saveReq(next);
  }
  async function setMemo(section, id, val){
    var next=Object.assign({},req);
    next[section]=next[section].map(function(r){return r.id===id?Object.assign({},r,{rm_memo:val}):r;});
    setReq(next);
  }
  async function saveMemo(section, id){
    await store.set(REQ_KEY,Object.assign({},req,{last_updated:new Date().toISOString()}));
  }
  async function resolveConflict(chosenPlatform){
    var next=Object.assign({},req);
    next.must_have=next.must_have.map(function(r){return r.status==="충돌대기"?Object.assign({},r,{status:"AI추론",conflict:null}):r;});
    next.should_have=(next.should_have||[]).map(function(r){return r.status==="충돌대기"?Object.assign({},r,{status:"AI추론",conflict:null}):r;});
    next.tech_spec=Object.assign({},next.tech_spec,{platforms:[chosenPlatform]});
    await saveReq(next);
  }

  var STATUS_COLORS={"AI추론":M.onSurfVar,"충돌대기":M.warn,"RM확정":M.success};
  var STATUS_BG={"AI추론":M.scHst,"충돌대기":M.warnCont||"rgba(255,185,80,0.12)","RM확정":M.successCont};
  var CONF_LABEL={"high":"높음","low":"낮음"};

  function ReqCard(pp){
    var r=pp.item; var sec=pp.section;
    var stColor=STATUS_COLORS[r.status]||M.onSurfVar;
    var stBg=STATUS_BG[r.status]||M.scHst;
    return(
      <div style={{background:M.scHi,borderRadius:10,padding:"12px 14px",marginBottom:8,border:"1px solid "+(r.status==="충돌대기"?M.warnBorder||"rgba(255,185,80,0.28)":M.outlineVar),transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:500,color:M.onSurf,marginBottom:3}}>{r.feature}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:12,color:M.onSurfVar}}>출처: {r.source}</span>
              <span style={{fontSize:12,padding:"1px 7px",borderRadius:6,background:r.confidence==="high"?M.successCont:M.scHst,color:r.confidence==="high"?M.success:M.onSurfVar,border:"1px solid "+(r.confidence==="high"?M.successBorder:M.outlineVar)}}>신뢰도 {CONF_LABEL[r.confidence]||r.confidence}</span>
              <span style={{fontSize:12,padding:"1px 7px",borderRadius:6,background:stBg,color:stColor,border:"1px solid "+(r.status==="충돌대기"?(M.warnBorder||"rgba(255,185,80,0.28)"):(r.status==="RM확정"?(M.successBorder):M.outlineVar))}}>{r.status}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
            <select value={r.phase||""} onChange={function(e){setPhase(sec,r.id,e.target.value?parseInt(e.target.value):null);}} style={{padding:"3px 6px",borderRadius:6,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:12,color:M.onSurfVar,cursor:"pointer"}}>
              <option value="">Phase-</option>
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
            </select>
            {r.status!=="RM확정"&&<button onClick={function(){confirmItem(sec,r.id);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid "+M.primary,background:M.primaryCont,color:M.primary,fontSize:12,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>확정</button>}
          </div>
        </div>
        <textarea value={r.rm_memo||""} onChange={function(e){setMemo(sec,r.id,e.target.value);}} onBlur={function(){saveMemo(sec,r.id);}} placeholder="RM 메모 (AI 해석과 독립)" rows={1} style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:12,color:M.onSurf,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"'Noto Sans KR',system-ui,sans-serif",lineHeight:1.6}}/>
      </div>
    );
  }

  function SectionBlock(pp){
    return(
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:M.primary,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>{pp.label} ({pp.items.length})</div>
        {pp.items.length===0&&<div style={{fontSize:13,color:M.onSurfVar,padding:"10px 0"}}>항목 없음 — 브리핑/상담 AI 분석 후 자동 채워집니다</div>}
        {pp.items.map(function(r){return <ReqCard key={r.id} item={r} section={pp.section}/>;}) }
      </div>
    );
  }

  if(!loaded) return <div style={{display:"flex",justifyContent:"center",padding:48}}><Spinner/></div>;

  var hasConflict=req&&(
    (req.must_have||[]).some(function(r){return r.status==="충돌대기";}) ||
    (req.should_have||[]).some(function(r){return r.status==="충돌대기";})
  );
  var conflictItem=req&&((req.must_have||[]).concat(req.should_have||[])).find(function(r){return r.status==="충돌대기"&&r.conflict;});

  return(
    <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
      {/* 충돌 배너 */}
      {hasConflict&&(
        <div style={{padding:"12px 16px",borderRadius:10,background:M.warnCont||"rgba(255,185,80,0.12)",border:"1px solid "+(M.warnBorder||"rgba(255,185,80,0.28)"),marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:M.warn,marginBottom:6}}>요구사항 충돌 감지됨</div>
          {conflictItem&&conflictItem.conflict&&(
            <div style={{fontSize:13,color:M.onSurfVar,marginBottom:10}}>
              {conflictItem.conflict.type}: {conflictItem.conflict.from} 에서 {conflictItem.conflict.to} 로 변경됨. 어떤 플랫폼으로 확정하시겠어요?
            </div>
          )}
          <div style={{display:"flex",gap:8}}>
            {conflictItem&&conflictItem.conflict&&(
              <Btn size="sm" onClick={function(){resolveConflict(conflictItem.conflict.from);}}>{conflictItem.conflict.from} 확정</Btn>
            )}
            {conflictItem&&conflictItem.conflict&&(
              <Btn size="sm" variant="outline" onClick={function(){resolveConflict(conflictItem.conflict.to);}}>{conflictItem.conflict.to} 확정</Btn>
            )}
          </div>
        </div>
      )}

      {!req&&(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>요구사항이 아직 없어요</div>
          <div style={{fontSize:13,color:M.onSurfVar}}>브리핑을 생성하거나 상담기록 AI 분석을 실행하면 자동으로 채워집니다</div>
        </div>
      )}

      {req&&(
        <div>
          {/* 방문 이유 vs 진짜 니즈 */}
          {(req.surface_needs||req.real_needs)&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              <div style={{padding:"14px 16px",borderRadius:10,background:M.scHi,border:"1px solid "+M.outlineVar}}>
                <div style={{fontSize:10,fontWeight:700,color:M.onSurfVar,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>방문 이유 (표면 니즈)</div>
                <div style={{fontSize:13,color:M.onSurf,lineHeight:1.6}}>{req.surface_needs||"아직 분석 전"}</div>
              </div>
              <div style={{padding:"14px 16px",borderRadius:10,background:M.primaryCont,border:"1px solid "+M.primary+"30"}}>
                <div style={{fontSize:10,fontWeight:700,color:M.primary,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>진짜 니즈 (내재 목적)</div>
                <div style={{fontSize:13,color:M.onSurf,lineHeight:1.6,fontWeight:500}}>{req.real_needs||"아직 분석 전"}</div>
              </div>
            </div>
          )}

          {/* 기술 스펙 */}
          {(req.tech_spec&&((req.tech_spec.platforms||[]).length>0||(req.tech_spec.stack||[]).length>0))&&(
            <div style={{padding:"10px 14px",borderRadius:8,background:M.scHi,border:"1px solid "+M.outlineVar,marginBottom:16,display:"flex",gap:16,flexWrap:"wrap"}}>
              {(req.tech_spec.platforms||[]).length>0&&<span style={{fontSize:12,color:M.onSurfVar}}>플랫폼: <span style={{color:M.onSurf,fontWeight:500}}>{req.tech_spec.platforms.join(", ")}</span></span>}
              {(req.tech_spec.stack||[]).length>0&&<span style={{fontSize:12,color:M.onSurfVar}}>스택: <span style={{color:M.onSurf,fontWeight:500}}>{req.tech_spec.stack.join(", ")}</span></span>}
            </div>
          )}

          <SectionBlock label="Must Have" section="must_have" items={req.must_have||[]}/>
          <SectionBlock label="Should Have" section="should_have" items={req.should_have||[]}/>
          <SectionBlock label="Nice to Have" section="nice_to_have" items={req.nice_to_have||[]}/>

          {/* 현실 충돌 */}
          {(req.conflicts||[]).length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:M.warn,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>현실 충돌 ({req.conflicts.length})</div>
              {req.conflicts.map(function(c,i){return(
                <div key={c.id||i} style={{padding:"12px 14px",borderRadius:8,background:M.warnCont,border:"1px solid "+M.warnBorder,marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:600,color:M.onSurf}}>{c.issue}</span>
                    <span style={{fontSize:11,color:M.onSurfVar}}>{c.source}</span>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",fontSize:12,flexWrap:"wrap"}}>
                    <span style={{color:M.onSurfVar}}>현재: <span style={{color:M.onSurf}}>{c.current}</span></span>
                    <span style={{color:M.warn}}>→</span>
                    <span style={{color:M.onSurfVar}}>요구: <span style={{color:M.onSurf}}>{c.required}</span></span>
                    {c.gap&&<span style={{color:M.warn,fontWeight:500}}>({c.gap})</span>}
                  </div>
                </div>
              );})}
            </div>
          )}

          {/* 수용 불가 */}
          {(req.unacceptable||[]).length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:M.error,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>수용 불가 항목 ({req.unacceptable.length})</div>
              {req.unacceptable.map(function(u,i){return(
                <div key={u.id||i} style={{padding:"12px 14px",borderRadius:8,background:M.errorCont,border:"1px solid "+M.errorBorder,marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:600,color:M.onSurf,marginBottom:4}}>{u.request}</div>
                  <div style={{fontSize:12,color:M.onSurfVar,marginBottom:6}}>{u.reason}</div>
                  {u.persuasion&&<div style={{fontSize:12,color:M.primary,padding:"5px 10px",borderRadius:6,background:M.primaryCont}}><span style={{fontWeight:500}}>설득 방향:</span> {u.persuasion}</div>}
                </div>
              );})}
            </div>
          )}

          {/* 액션 아이템 */}
          {(req.action_items||[]).length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:M.success,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>
                액션 아이템 ({(req.action_items||[]).filter(function(a){return !a.done;}).length}개 미완료)
              </div>
              {req.action_items.map(function(a,i){return(
                <div key={a.id||i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:8,background:a.done?M.scHst:M.successCont,border:"1px solid "+(a.done?M.outlineVar:M.successBorder),marginBottom:6,opacity:a.done?.55:1,transition:"opacity .2s"}}>
                  <div onClick={async function(){var n=Object.assign({},req,{action_items:(req.action_items||[]).map(function(x,xi){return xi===i?Object.assign({},x,{done:!x.done}):x;})});await store.set("requirements:"+proj.id,n);setReq(n);}}
                    style={{width:18,height:18,borderRadius:4,border:"1.5px solid "+(a.done?M.success:M.successBorder),background:a.done?M.success:"transparent",flexShrink:0,cursor:"pointer",marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {a.done&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:M.onSurf,textDecoration:a.done?"line-through":"none",lineHeight:1.5}}>
                      <span style={{color:M.primary,fontWeight:600}}>{a.who}</span>가 {a.action}
                    </div>
                    <div style={{fontSize:11,color:M.onSurfVar,marginTop:2}}>기한: {a.deadline||"미정"} · {a.source}</div>
                  </div>
                </div>
              );})}
            </div>
          )}

          {/* 미결 사항 */}
          {(req.open_questions||[]).length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:M.error,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>미결 사항 ({req.open_questions.length})</div>
              {req.open_questions.map(function(q,i){return(
                <div key={i} style={{padding:"10px 14px",borderRadius:8,background:M.errorCont,border:"1px solid "+M.errorBorder,marginBottom:6}}>
                  <div style={{fontSize:13,color:M.onSurf,marginBottom:2}}>{q.question}</div>
                  <div style={{fontSize:11,color:M.onSurfVar}}>출처: {q.source} · 다음 미팅 확인 필요</div>
                </div>
              );})}
            </div>
          )}

          {/* 팀 구성 힌트 */}
          {(req.team_hints||[]).length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:M.primary,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>팀 구성 힌트 ({req.team_hints.length})</div>
              {req.team_hints.map(function(h,i){return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:M.scHi,marginBottom:6,border:"1px solid "+M.outlineVar}}>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13,fontWeight:500,color:M.onSurf}}>{h.position}</span>
                    {h.grade&&<span style={{fontSize:12,color:M.onSurfVar,marginLeft:6}}>{h.grade}</span>}
                    {h.reason&&<span style={{fontSize:12,color:M.onSurfVar,marginLeft:6}}>— {h.reason}</span>}
                  </div>
                  <span style={{fontSize:11,color:M.onSurfVar}}>{h.source}</span>
                </div>
              );})}
            </div>
          )}

          <div style={{fontSize:11,color:M.onSurfVar,marginTop:8,paddingTop:12,borderTop:"1px solid "+M.outlineVar}}>마지막 업데이트: {fmt(req.last_updated)||"없음"} · 버전 {req.version||1}</div>
        </div>
      )}
    </div>
  );
}

/* ── RFP Tab ─────────────────────────────────────────────────── */
function RFPTab(p){
  var proj=p.project; var c=p.customer;
  var app=useApp(); var user=app.user;
  /* 두 문서 완전 독립 상태 */
  var [doc1,setDoc1]=useState(proj.rfp_doc1||null);
  var [doc2,setDoc2]=useState(proj.rfp_doc2||null);
  var [gen1,setGen1]=useState(false);
  var [gen2,setGen2]=useState(false);
  var [similarCase,setSimilarCase]=useState(null);
  /* 팀 구성 상태 */
  var [team,setTeam]=useState(doc2?doc2.team.slice():[]);
  var [harnessMode,setHarnessMode]=useState(doc2?!!doc2.harness_mode:false);
  var [showFigma,setShowFigma]=useState(false);
  var [figmaText,setFigmaText]=useState(null);
  var [copied,setCopied]=useState(false);

  async function findSimilarCase(){
    try{
      var cases=await store.get("similar_cases:"+user.id,[]);
      var signed=cases.filter(function(sc){return sc.contract_signed===true;});
      if(signed.length===0) return null;
      var reqData=await store.get("requirements:"+proj.id,null);
      var myIndustry=c.industry||"";
      var myPlatforms=(reqData&&reqData.tech_spec&&reqData.tech_spec.platforms)||[];
      var myKeywords=(reqData&&reqData.must_have)?reqData.must_have.map(function(r){return r.feature;}).slice(0,5):[];
      var best=null; var bestScore=0;
      signed.forEach(function(sc){
        var score=0;
        if(sc.industry===myIndustry) score+=40;
        if(myPlatforms.length>0&&sc.platforms.length>0){
          var platMatch=myPlatforms.some(function(pl){return sc.platforms.indexOf(pl)!==-1;});
          if(platMatch) score+=30;
        }
        if(myKeywords.length>0&&sc.scope_keywords.length>0){
          var kMatch=myKeywords.filter(function(k){return sc.scope_keywords.indexOf(k)!==-1;}).length;
          score+=Math.round(30*(kMatch/Math.max(myKeywords.length,sc.scope_keywords.length)));
        }
        if(score>=60&&score>bestScore){bestScore=score;best=sc;}
      });
      return best;
    }catch(e){return null;}
  }

  /* 팀 구성 헬퍼 */
  function addMember(){setTeam(function(prev){return prev.concat([{id:uid(),position:"Web 개발자",grade:"중급(4~6년)",weekly_hours:40,is_harness:false}]);});}
  function updMember(id,k,v){setTeam(function(prev){return prev.map(function(m){return m.id===id?Object.assign({},m,Object.fromEntries([[k,v]])):m;});});}
  function remMember(id){setTeam(function(prev){return prev.filter(function(m){return m.id!==id;});});}
  function calcM(m){var r=getRate(m.position,m.grade);var ar=m.is_harness?Math.round(r*.5):r;return{hourly_rate:ar,monthly_cost:ar*(m.weekly_hours*4)};}
  var totalMonthly=team.reduce(function(s,m){return s+calcM(m).monthly_cost;},0);

  /* 문서 1 생성 — 요구사항 정의서 */
  async function generateDoc1(){
    setGen1(true);
    try{
      var reqKey="requirements:"+proj.id;
      var reqData=await store.get(reqKey,null);
      var notesData=await store.get("notes:"+proj.id,[]);
      var mustStr=(reqData&&reqData.must_have)?reqData.must_have.map(function(r){return"- "+r.feature+" ("+r.status+")";}).join("\n"):"(요구사항 없음)";
      var shouldStr=(reqData&&reqData.should_have)?reqData.should_have.map(function(r){return"- "+r.feature;}).join("\n"):"";
      var techStr=(reqData&&reqData.tech_spec)?JSON.stringify(reqData.tech_spec):"{}";
      var notesStr=notesData.slice(-3).map(function(n){return n.title+": "+n.content.slice(0,150);}).join("\n");
      var SYS="당신은 IT 프로젝트 요구사항 정의서 작성 전문가입니다. FR-APP-01 수준의 기능 명세서를 작성하세요.\n\n출력 형식:\n## 1. 사업 개요\n### 1.1 사업명\n[사업명]\n### 1.2 배경\n[배경]\n### 1.3 목적\n[목적]\n### 1.4 범위 요약\n포함: [포함 항목]\n제외: [제외 항목]\n\n## 2. 기능 요구사항\n### [카테고리명]\nFR-[코드]-01 [기능명]\n- [세부 요구사항]\n- 우선순위: Must Have\n\n## 3. 비기능 요구사항\n- 호환성: [내용]\n- 성능: [내용]\n\n## 4. 기술 스택\n확정: [스택]\n권장: [AI 추천]\n\n## 5. 예상 일정\n[요구사항 기반 산출]\n\n## 6. 비고\n[미결 사항]";
      var userMsg="고객: "+c.company+"\n프로젝트: "+proj.name+"\nMust Have:\n"+mustStr+"\nShould Have:\n"+shouldStr+"\n기술 스펙: "+techStr+"\n상담 요약:\n"+notesStr+"\n\n위 내용을 바탕으로 요구사항 정의서를 작성하세요.";
      var tx=await callAI(userMsg,SYS,3000,false);
      setDoc1(tx);
      await p.onUpdate({rfp_doc1:tx});
    }catch(e){setDoc1("생성 오류: "+e.message);}
    setGen1(false);
  }

  /* 문서 2 생성 — 팀 매칭 제안서 */
  async function generateDoc2(){
    if(team.length===0)return;
    setGen2(true);
    try{
      var simCase=await findSimilarCase();
      if(simCase) setSimilarCase(simCase);
      var teamDesc=team.map(function(m){var c2=calcM(m);return m.position+"("+m.grade+",주"+m.weekly_hours+"h,"+c2.hourly_rate.toLocaleString()+"원/h)"+(m.is_harness?"[하네스]":"");}).join(", ");
      var SYS2="당신은 IT 리소스 매칭 제안서 작성 전문가입니다.\n\n섹션 A: 프로젝트 개요\n[고객명] 대표님\n[프로젝트 현재상황 1줄 + 목표 1줄]\n\n섹션 B: 주요 업무 범위\n각 포지션별:\n[포지션명] — [등급]\n기간: [N]개월\n기간 근거: [왜 이 기간인지 업무 단계 세분화. 구체적으로]\n주요 스킬: [필요 기술 스택]\n(운영 중인 서비스 투입시 주요 스킬 생략)\n\n섹션 C는 코드에서 렌더링하므로 작성 불필요. 섹션 A와 B만 작성하세요.";
      var userMsg2="고객: "+c.company+"\n프로젝트: "+proj.name+"\n팀 구성: "+teamDesc+"\n\n섹션 A(개요)와 섹션 B(업무범위+기간근거)를 작성하세요.";
      var tx2=await callAI(userMsg2,SYS2,2000,false);
      var doc2Data={overview_and_scope:tx2,team:team.map(function(m){var c2=calcM(m);return Object.assign({},m,c2);}),harness_mode:harnessMode,total_monthly:totalMonthly,created_at:new Date().toISOString()};
      setDoc2(doc2Data);
      await p.onUpdate({rfp_doc2:doc2Data});
    }catch(e){console.error(e);}
    setGen2(false);
  }

  async function generateFigmaText(){
    setShowFigma(true);if(figmaText)return;
    var lines=["━━━ 팀 매칭 제안서 ━━━","",c.company+" 대표님","GRIDGE 담당자: 담당 RM",""];
    if(doc2&&doc2.overview_and_scope){lines.push(doc2.overview_and_scope.trim(),"");}
    lines.push("━━━ 구독 작업자 비용 (VAT 별도) ━━━","");
    team.forEach(function(m){var c2=calcM(m);lines.push(m.position+"  "+m.grade+"  주"+m.weekly_hours+"h  "+c2.hourly_rate.toLocaleString()+"원/h  →  월 "+c2.monthly_cost.toLocaleString()+"원"+(m.is_harness?" [하네스]":""));});
    lines.push("","월 합계: "+totalMonthly.toLocaleString()+"원");
    setFigmaText(lines.join("\n"));
  }
  function copyFigma(){navigator.clipboard.writeText(figmaText||"").then(function(){setCopied(true);setTimeout(function(){setCopied(false);},2000);});}

  return(
    <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
      {/* 두 문서 독립 영역 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>

        {/* 문서 1: 요구사항 정의서 */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:M.onSurf}}>문서 1</div>
              <div style={{fontSize:12,color:M.onSurfVar,marginTop:1}}>요구사항 정의서 (FR 수준)</div>
            </div>
            <Btn size="sm" onClick={generateDoc1} disabled={gen1}>
              {gen1?<><Spinner size={12}/><span style={{marginLeft:5}}>생성 중...</span></>:doc1?"재생성":"생성"}
            </Btn>
          </div>
          {!doc1&&!gen1&&<Card style={{padding:"20px",textAlign:"center",minHeight:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{fontSize:26}}>📋</div>
            <div style={{fontSize:13,color:M.onSurfVar}}>요구사항 탭의 확정 항목을<br/>기반으로 자동 생성됩니다</div>
          </Card>}
          {gen1&&<Card style={{padding:"20px",textAlign:"center",minHeight:160,display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner/></Card>}
          {doc1&&!gen1&&<Card style={{maxHeight:480,overflowY:"auto"}}>
            <div style={{padding:"10px 14px",borderBottom:"1px solid "+M.outlineVar,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:M.success}}></span>
              <span style={{fontSize:12,fontWeight:600,color:M.success,textTransform:"uppercase",letterSpacing:".06em"}}>생성 완료</span>
            </div>
            <div style={{padding:"14px 16px"}}><MarkdownSimple content={doc1}/></div>
          </Card>}
        </div>

        {/* 문서 2: 팀 매칭 제안서 */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:M.onSurf}}>문서 2</div>
              <div style={{fontSize:12,color:M.onSurfVar,marginTop:1}}>팀 매칭 제안서</div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {doc2&&<Btn size="sm" variant="outline" onClick={generateFigmaText}>{IC.copy} Figma</Btn>}
              <Btn size="sm" onClick={generateDoc2} disabled={gen2||team.length===0}>
                {gen2?<><Spinner size={12}/><span style={{marginLeft:5}}>생성 중...</span></>:doc2?"재생성":"생성"}
              </Btn>
            </div>
          </div>
          {/* 섹션 C: 구독 작업자 비용 (항상 노출 — 팀 구성 먼저) */}
          <Card style={{padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:M.primary,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span>섹션 C — 구독 작업자 비용</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:M.onSurfVar}}>하네스</span>
                <div onClick={function(){setHarnessMode(function(v){return !v;});}} style={{width:36,height:20,borderRadius:10,background:harnessMode?M.primaryCont:M.scHst,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 2px",transition:"background .2s",border:"1px solid "+(harnessMode?M.primary:M.outlineVar)}}>
                  <div style={{width:16,height:16,borderRadius:"50%",background:harnessMode?M.primary:M.onSurfVar,transform:harnessMode?"translateX(16px)":"translateX(0)",transition:"transform .2s"}}/>
                </div>
              </div>
            </div>
            {team.map(function(m){var c2=calcM(m);return(
              <div key={m.id} style={{marginBottom:8}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px auto",gap:6,alignItems:"center"}}>
                  <Sel value={m.position} onChange={function(e){updMember(m.id,"position",e.target.value);}} options={POSITIONS} mb={0}/>
                  <Sel value={m.grade} onChange={function(e){updMember(m.id,"grade",e.target.value);}} options={GRADES} mb={0}/>
                  <input type="number" value={m.weekly_hours} onChange={function(e){updMember(m.id,"weekly_hours",parseInt(e.target.value)||40);}} min={1} max={60} style={{width:"100%",padding:"8px 6px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",textAlign:"center"}}/>
                  <button onClick={function(){remMember(m.id);}} style={{background:"none",border:"none",cursor:"pointer",color:M.error,padding:4}}>{IC.trash}</button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5,paddingLeft:2}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {harnessMode&&<div onClick={function(){updMember(m.id,"is_harness",!m.is_harness);}} style={{fontSize:12,padding:"2px 6px",borderRadius:5,cursor:"pointer",border:"1px solid "+(m.is_harness?"#CE93D8":M.outlineVar),background:m.is_harness?"rgba(206,147,216,0.15)":"transparent",color:m.is_harness?"#CE93D8":M.onSurfVar}}>⚡ 하네스</div>}
                    <span style={{fontSize:12,color:M.onSurfVar}}>{c2.hourly_rate?c2.hourly_rate.toLocaleString()+"원/h":""}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:600,color:M.onSurf}}>월 {c2.monthly_cost?c2.monthly_cost.toLocaleString():"—"}원</span>
                </div>
              </div>
            );})}
            <button onClick={addMember} style={{width:"100%",padding:"8px",borderRadius:8,border:"1px dashed "+M.outlineVar,background:"transparent",color:M.onSurfVar,cursor:"pointer",fontSize:13,marginTop:4,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>+ 포지션 추가</button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,marginTop:8,borderTop:"1px solid "+M.outlineVar}}>
              <span style={{fontSize:13,color:M.onSurfVar}}>월 합계 (VAT 별도)</span>
              <span style={{fontSize:22,fontWeight:800,color:M.onSurf,letterSpacing:"-0.02em"}}>{totalMonthly.toLocaleString()}원</span>
            </div>
          </Card>
          {/* 섹션 A+B: 생성 후 노출 */}
          {similarCase&&(
            <div style={{padding:"10px 14px",borderRadius:8,background:M.successCont,border:"1px solid "+M.successBorder,marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:600,color:M.success,marginBottom:3}}>유사 계약 사례 발견됨</div>
              <div style={{fontSize:12,color:M.onSurfVar}}>{similarCase.company}와 유사합니다 (계약 성사). 팀 구성 참고할까요?</div>
            </div>
          )}
          {doc2&&!gen2&&<Card>
            <div style={{padding:"10px 14px",borderBottom:"1px solid "+M.outlineVar,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:M.success}}></span>
              <span style={{fontSize:12,fontWeight:600,color:M.success,textTransform:"uppercase",letterSpacing:".06em"}}>섹션 A+B 생성 완료</span>
            </div>
            <div style={{padding:"14px 16px"}}><MarkdownSimple content={doc2.overview_and_scope||""}/></div>
          </Card>}
          {gen2&&<Card style={{padding:"20px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><Spinner/><span style={{fontSize:13,color:M.onSurfVar}}>섹션 A+B 생성 중...</span></Card>}
          {!doc2&&!gen2&&team.length>0&&<Card style={{padding:"14px 16px",background:M.primaryCont+"15",border:"1px solid "+M.primaryCont+"40"}}>
            <div style={{fontSize:13,color:M.primary}}>팀 구성 완료 후 생성 버튼을 눌러 섹션 A(개요)와 B(업무범위+기간근거)를 자동 작성하세요.</div>
          </Card>}
        </div>
      </div>

      <Modal open={showFigma} title="Figma 붙여넣기 출력" onClose={function(){setShowFigma(false);}}
        maxWidth={600} footer={<><Btn variant="ghost" onClick={function(){setShowFigma(false);}}>닫기</Btn><Btn onClick={copyFigma} disabled={!figmaText}>{copied?<>{IC.check}복사됨</>:<>{IC.copy}복사</>}</Btn></>}>
        {!figmaText?<div style={{display:"flex",justifyContent:"center",padding:40}}><Spinner/></div>
          :<textarea value={figmaText} onChange={function(e){setFigmaText(e.target.value);}} rows={22} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:12,color:M.onSurf,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"'Courier New',monospace",lineHeight:1.75}}/>}
      </Modal>
    </div>
  );
}


/* ── Projects Page ───────────────────────────────────────────── */
function ProjectsPage(p){
  var app=useApp(); var user=app.user;
  var [customers,setCustomers]=useState([]); var [loaded,setLoaded]=useState(false);
  var [segment,setSegment]=useState("pre"); var [curPage,setCurPage]=useState(0);
  var PAGE_SZ=20;
  useEffect(function(){(async function(){var cs=await store.get("customers:"+user.id,[]); setCustomers(cs); setLoaded(true);})();}, []);
  var all=[];
  customers.forEach(function(c){(c.projects||[]).forEach(function(proj){all.push({proj:proj,customer:c});});});
  var filtered=all.filter(function(x){return segment==="done"?x.proj.status==="계약성사":x.proj.status!=="계약성사";});
  filtered.sort(function(a,b){return new Date(b.proj.updatedAt||b.proj.createdAt)-new Date(a.proj.updatedAt||a.proj.createdAt);});
  var totalPages=Math.ceil(filtered.length/PAGE_SZ);
  var paged=filtered.slice(curPage*PAGE_SZ,(curPage+1)*PAGE_SZ);
  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"18px 24px 0",flexShrink:0,background:M.surface,borderBottom:"1px solid "+M.outlineVar,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>프로젝트</div>
            <div style={{fontSize:13,color:M.onSurfVar,marginTop:2}}>전체 {filtered.length}건</div>
          </div>
          <div style={{display:"flex",borderRadius:8,border:"1px solid "+M.outlineVar,overflow:"hidden"}}>
            {[["pre","계약 전"],["done","계약 완료"]].map(function(s){
              var act=segment===s[0];
              return <button key={s[0]} onClick={function(){setSegment(s[0]);setCurPage(0);}} style={{padding:"8px 22px",border:"none",background:act?M.primaryCont:"transparent",color:act?M.primary:M.onSurfVar,fontSize:14,fontWeight:act?600:400,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif",transition:"all .2s cubic-bezier(.2,0,0,1)"}}>{s[1]}</button>;
            })}
          </div>
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"16px 24px"}}>
        {!loaded&&<div style={{display:"flex",justifyContent:"center",padding:48}}><Spinner/></div>}
        {loaded&&paged.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:16,fontWeight:600,color:M.onSurf,marginBottom:6}}>{segment==="done"?"계약 완료 프로젝트가 없어요":"진행 중인 프로젝트가 없어요"}</div>
        </div>}
        {paged.map(function(x){
          var proj=x.proj; var cust=x.customer;
          var d=diffDays(proj.updatedAt||proj.createdAt);
          var danger=d>=3&&proj.status!=="계약성사"&&proj.status!=="이탈";
          return(
            <div key={proj.id} onClick={function(){p.setCustomer(cust);p.setPage("customerDetail");}}
              style={{background:M.sc,borderRadius:12,border:".5px solid "+(danger?M.errorBorder:M.outlineVar),padding:"14px 18px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:16,fontWeight:600,color:M.onSurf}}>{proj.name}</span>
                  <SBadge status={proj.status}/>
                  {danger&&<span style={{fontSize:12,color:M.error}}>{d}일 업데이트 없음</span>}
                </div>
                <div style={{fontSize:13,color:M.onSurfVar}}>{cust.company} · {cust.industry||"산업 미입력"}</div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                {[["브리핑",!!proj.briefing],["상담",(proj.notes_count||0)>0],["팀빌딩",!!proj.rfp_data]].map(function(t){return(
                  <span key={t[0]} style={{fontSize:12,padding:"3px 9px",borderRadius:6,background:t[1]?M.successCont:M.scHst,color:t[1]?M.success:M.onSurfVar,border:"1px solid "+(t[1]?M.successBorder:M.outlineVar)}}>{t[0]}</span>
                );})}
              </div>
              <div style={{color:M.onSurfVar}}>{IC.chevron}</div>
            </div>
          );
        })}
        {totalPages>1&&<div style={{display:"flex",justifyContent:"center",gap:6,padding:"16px 0"}}>
          {Array.from({length:totalPages},function(_,i){return i;}).map(function(i){
            return <button key={i} onClick={function(){setCurPage(i);}} style={{width:34,height:34,borderRadius:6,border:"1px solid "+(curPage===i?M.primary:M.outlineVar),background:curPage===i?M.primaryCont:"transparent",color:curPage===i?M.primary:M.onSurfVar,cursor:"pointer",fontSize:14,fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>{i+1}</button>;
          })}
        </div>}
      </div>
    </div>
  );
}

/* ── Contract Analysis Page ──────────────────────────────────── */
function ContractAnalysisPage(){
  var app=useApp(); var user=app.user;
  var [tab,setTab]=useState("estimate");
  var [cases,setCases]=useState([]); var [loaded,setLoaded]=useState(false);
  var [indFilter,setIndFilter]=useState("전체");
  useEffect(function(){(async function(){var sc=await store.get("similar_cases:"+user.id,[]); setCases(sc); setLoaded(true);})();}, []);
  var industries=["전체"].concat(cases.map(function(s){return s.industry;}).filter(function(v,i,a){return v&&a.indexOf(v)===i;}));
  var filtered=cases.filter(function(s){return s.contract_signed&&(indFilter==="전체"||s.industry===indFilter);});
  var ATABS=[["estimate","견적 유형"],["team","팀 유형"]];
  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"18px 24px 0",flexShrink:0,background:M.surface,borderBottom:"1px solid "+M.outlineVar,transition:"background .2s cubic-bezier(.2,0,0,1),border-color .2s"}}>
        <div style={{fontSize:22,fontWeight:700,color:M.onSurf,marginBottom:14,letterSpacing:"-0.02em"}}>계약 분석</div>
        <div style={{display:"flex",gap:0}}>
          {ATABS.map(function(t){var act=tab===t[0]; return(
            <button key={t[0]} onClick={function(){setTab(t[0]);}} style={{padding:"9px 18px",fontSize:15,fontWeight:act?600:400,color:act?M.primary:M.onSurfVar,background:"transparent",border:"none",cursor:"pointer",borderBottom:act?"2px solid "+M.primary:"2px solid transparent",marginBottom:-1,transition:"all .2s cubic-bezier(.2,0,0,1)",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>{t[1]}</button>
          );})}
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
        {!loaded&&<div style={{display:"flex",justifyContent:"center",padding:48}}><Spinner/></div>}
        {loaded&&cases.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:16,fontWeight:600,color:M.onSurf,marginBottom:6}}>계약 성사 데이터가 없어요</div>
            <div style={{fontSize:13,color:M.onSurfVar}}>계약 등록 완료 후 자동으로 쌓입니다</div>
          </div>
        )}
        {loaded&&cases.length>0&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
              {industries.map(function(ind){var act=indFilter===ind; return(
                <button key={ind} onClick={function(){setIndFilter(ind);}} style={{padding:"5px 14px",borderRadius:20,border:"1px solid "+(act?M.primary:M.outlineVar),background:act?M.primaryCont:"transparent",color:act?M.primary:M.onSurfVar,fontSize:13,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif",transition:"all .2s cubic-bezier(.2,0,0,1)"}}>{ind}</button>
              );})}
            </div>
            {filtered.length===0&&<div style={{fontSize:13,color:M.onSurfVar,textAlign:"center",padding:"30px 0"}}>해당 산업 데이터 없음</div>}
            {tab==="estimate"&&filtered.map(function(sc){return(
              <Card key={sc.id} style={{padding:"16px 18px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:16,fontWeight:600,color:M.onSurf,marginBottom:4}}>{sc.company}</div>
                    <div style={{fontSize:13,color:M.onSurfVar}}>{sc.industry}{sc.platforms&&sc.platforms.length>0?" · "+sc.platforms.join(", "):""}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:22,fontWeight:800,color:M.onSurf,letterSpacing:"-0.02em"}}>{(sc.total_monthly||0).toLocaleString()}원</div>
                    <div style={{fontSize:12,color:M.onSurfVar}}>/월</div>
                  </div>
                </div>
                {sc.scope_keywords&&sc.scope_keywords.length>0&&(
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                    {sc.scope_keywords.map(function(k,i){return <span key={i} style={{fontSize:12,padding:"2px 9px",borderRadius:6,background:M.scHst,color:M.onSurfVar}}>{k}</span>;})}
                  </div>
                )}
                {sc.team_composition&&sc.team_composition.length>0&&(
                  <div style={{fontSize:13,color:M.onSurfVar}}>팀: {sc.team_composition.map(function(t){return t.position+(t.grade?"("+t.grade+")":"");}).join(" · ")}</div>
                )}
                <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,padding:"2px 9px",borderRadius:6,background:M.successCont,color:M.success,border:"1px solid "+M.successBorder}}>계약 성사</span>
                  <span style={{fontSize:12,color:M.onSurfVar}}>{fmt(sc.created_at)}</span>
                </div>
              </Card>
            );})}
            {tab==="team"&&filtered.map(function(sc){
              if(!sc.team_composition||sc.team_composition.length===0) return null;
              return(
                <Card key={sc.id} style={{padding:"16px 18px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:600,color:M.onSurf}}>{sc.company}</div>
                      <div style={{fontSize:13,color:M.onSurfVar,marginTop:3}}>{sc.industry}{sc.platforms&&sc.platforms.length>0?" · "+sc.platforms.join(", "):""}</div>
                    </div>
                    <span style={{fontSize:16,fontWeight:600,color:M.onSurf}}>{(sc.total_monthly||0).toLocaleString()}원/월</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {sc.team_composition.map(function(m,i){return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,background:M.scHst,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
                        <span style={{fontSize:14,fontWeight:500,color:M.onSurf,flex:1}}>{m.position}</span>
                        <span style={{fontSize:13,color:M.onSurfVar}}>{m.grade}</span>
                        {m.weekly_hours&&<span style={{fontSize:13,color:M.onSurfVar}}>주 {m.weekly_hours}h</span>}
                      </div>
                    );})}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Contract Page ───────────────────────────────────────────── */
function ContractPage(){
  var app=useApp(); var user=app.user;
  var [contracts,setContracts]=useState([]); var [customers,setCustomers]=useState([]); var [loaded,setLoaded]=useState(false);
  var [showAdd,setShowAdd]=useState(false); var [saving,setSaving]=useState(false);
  var [form,setForm]=useState({customer_id:"",project_id:"",start_date:today(),end_date:"",monthly_amount:"",memo:"",status:"active"});
  useEffect(function(){(async function(){var cs=await store.get("contracts:"+user.id,[]); var cust=await store.get("customers:"+user.id,[]); setContracts(cs); setCustomers(cust); setLoaded(true);})();}, []);
  function setF(k,v){setForm(function(pr){var n=Object.assign({},pr); n[k]=v; return n;});}
  function customerName(id){var c=customers.find(function(c){return c.id===id;}); return c?c.company:id;}
  function customerProjects(customerId){var c=customers.find(function(c){return c.id===customerId;}); return c?(c.projects||[]):[];}
  async function save(){
    if(!form.customer_id||!form.monthly_amount)return; setSaving(true);
    var contract=Object.assign({},form,{id:uid(),created_at:new Date().toISOString(),monthly_amount:parseInt((form.monthly_amount||"0").replace(/,/g,""))||0});
    var updated=contracts.concat([contract]); await store.set("contracts:"+user.id,updated); setContracts(updated);
    /* similar_cases 저장 */
    try{
      var custObj=customers.find(function(c){return c.id===form.customer_id;});
      if(custObj){
        var projObj=custObj.projects&&custObj.projects.find(function(pr){return pr.id===form.project_id;});
        var reqData=form.project_id?await store.get("requirements:"+form.project_id,null):null;
        var existCases=await store.get("similar_cases:"+user.id,[]);
        var newCase={id:uid(),company:custObj.company,industry:custObj.industry||"",
          platforms:(reqData&&reqData.tech_spec&&reqData.tech_spec.platforms)||[],
          scope_keywords:(reqData&&reqData.must_have)?reqData.must_have.map(function(r){return r.feature;}).slice(0,5):[],
          team_composition:(projObj&&projObj.rfp_doc2&&projObj.rfp_doc2.team)||[],
          total_monthly:contract.monthly_amount,
          duration_months:0,
          contract_signed:true,
          created_at:new Date().toISOString(),
          success_signals:{client_renewed:false}};
        await store.set("similar_cases:"+user.id,existCases.concat([newCase]));
      }
    }catch(e){console.error("similar_cases save error",e);}
    setShowAdd(false); setForm({customer_id:"",project_id:"",start_date:today(),end_date:"",monthly_amount:"",memo:"",status:"active"}); setSaving(false);
  }
  async function updateStatus(id,status){var updated=contracts.map(function(c){return c.id===id?Object.assign({},c,{status:status}):c;}); await store.set("contracts:"+user.id,updated); setContracts(updated);}
  var statusC={active:M.success,paused:M.warn,ended:M.onSurfVar};
  var statusL={active:"운영중",paused:"일시정지",ended:"종료"};
  var grouped={active:contracts.filter(function(c){return c.status==="active";}),paused:contracts.filter(function(c){return c.status==="paused";}),ended:contracts.filter(function(c){return c.status==="ended";})};
  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"18px 24px 14px",flexShrink:0,borderBottom:"1px solid "+M.outlineVar,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"border-color .15s"}}>
        <div><div style={{fontSize:22,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>계약관리</div><div style={{fontSize:12,color:M.onSurfVar,marginTop:2}}>운영중 {grouped.active.length}건 · 월 {grouped.active.reduce(function(s,c){return s+c.monthly_amount;},0).toLocaleString()}원</div></div>
        <Btn onClick={function(){setShowAdd(true);}} style={{gap:6}}>{IC.add} 계약 등록</Btn>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"16px 24px"}}>
        {!loaded&&<div style={{display:"flex",justifyContent:"center",padding:48}}><Spinner/></div>}
        {loaded&&contracts.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:32,marginBottom:12}}>📝</div><div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>등록된 계약이 없어요</div></div>}
        {["active","paused","ended"].map(function(status){var group=grouped[status]; if(group.length===0)return null; return(
          <div key={status} style={{marginBottom:24}}>
            <div style={{fontSize:12,fontWeight:600,color:statusC[status],textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{statusL[status]} ({group.length})</div>
            {group.map(function(contract){var projName=""; var cProj=customerProjects(contract.customer_id); if(contract.project_id){var proj=cProj.find(function(pr){return pr.id===contract.project_id;}); if(proj)projName=" — "+proj.name;} return(
              <Card key={contract.id} style={{padding:"14px 16px",marginBottom:8,borderLeft:"3px solid "+(statusC[contract.status]||M.outlineVar)}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:4}}>{customerName(contract.customer_id)}{projName}</div><div style={{fontSize:12,color:M.onSurfVar,marginBottom:6}}>{contract.start_date}{contract.end_date?" ~ "+contract.end_date:""}</div><div style={{fontSize:20,fontWeight:800,color:M.onSurf,letterSpacing:"-0.02em"}}>{contract.monthly_amount.toLocaleString()}원<span style={{fontSize:12,fontWeight:400,color:M.onSurfVar}}>/월</span></div></div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <span style={{padding:"3px 8px",borderRadius:6,fontSize:12,fontWeight:600,background:statusC[contract.status]+"20",color:statusC[contract.status]}}>{statusL[contract.status]}</span>
                    {contract.status==="active"&&<button onClick={function(){updateStatus(contract.id,"paused");}} style={{fontSize:12,padding:"3px 8px",borderRadius:6,background:"transparent",border:"1px solid "+M.outlineVar,color:M.onSurfVar,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>정지</button>}
                    {contract.status==="paused"&&<button onClick={function(){updateStatus(contract.id,"active");}} style={{fontSize:12,padding:"3px 8px",borderRadius:6,background:"transparent",border:"1px solid "+M.outlineVar,color:M.onSurfVar,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>재개</button>}
                    {contract.status!=="ended"&&<button onClick={function(){updateStatus(contract.id,"ended");}} style={{fontSize:12,padding:"3px 8px",borderRadius:6,background:M.errorCont,border:"1px solid "+M.errorBorder,color:M.error,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>종료</button>}
                  </div>
                </div>
              </Card>
            );})}
          </div>
        );})}
      </div>
      <Modal open={showAdd} title="계약 등록" onClose={function(){setShowAdd(false);}} maxWidth={500}
        footer={<><Btn variant="ghost" onClick={function(){setShowAdd(false);}}>취소</Btn><Btn onClick={save} disabled={saving||!form.customer_id||!form.monthly_amount}>{saving?<Spinner/>:"등록"}</Btn></>}>
        <Sel label="고객사" required value={form.customer_id} onChange={function(e){setF("customer_id",e.target.value);setF("project_id","");}} options={customers.map(function(c){return{value:c.id,label:c.company};})} placeholder="선택"/>
        {form.customer_id&&customerProjects(form.customer_id).length>0&&<Sel label="프로젝트" value={form.project_id} onChange={function(e){setF("project_id",e.target.value);}} options={customerProjects(form.customer_id).map(function(pr){return{value:pr.id,label:pr.name};})} placeholder="선택 (선택사항)"/>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}><Inp label="시작일" type="date" value={form.start_date} onChange={function(e){setF("start_date",e.target.value);}}/><Inp label="종료일" type="date" value={form.end_date} onChange={function(e){setF("end_date",e.target.value);}}/></div>
        <Inp label="월 금액 (원)" required value={form.monthly_amount} onChange={function(e){setF("monthly_amount",e.target.value);}} placeholder="5000000"/>
        <Inp label="메모" value={form.memo} onChange={function(e){setF("memo",e.target.value);}} multiline rows={2} mb={0}/>
      </Modal>
    </div>
  );
}

/* ── Worker Page ─────────────────────────────────────────────── */
function WorkerPage(){
  var app=useApp(); var user=app.user;
  var [workers,setWorkers]=useState([]); var [loaded,setLoaded]=useState(false);
  var [showAdd,setShowAdd]=useState(false); var [saving,setSaving]=useState(false);
  var [editW,setEditW]=useState(null);
  var [form,setForm]=useState({name:"",email:"",phone:"",position:"Web 개발자",grade:"중급(4~6년)",status:"available",memo:""});
  var [q,setQ]=useState(""); var [statusF,setStatusF]=useState("전체");
  var [dateFrom,setDateFrom]=useState(""); var [dateTo,setDateTo]=useState("");
  var [page,setPage]=useState(0); var PAGE=20;
  var [confirmId,setConfirmId]=useState(null);
  useEffect(function(){(async function(){var ws=await store.get("workers",[]); setWorkers(ws); setLoaded(true);})();}, []);
  function setF(k,v){setForm(function(pr){var n=Object.assign({},pr); n[k]=v; return n;});}
  async function save(){
    if(!form.name)return; setSaving(true);
    var updated;
    if(editW){ updated=workers.map(function(w){return w.id===editW.id?Object.assign({},w,form):w;}); }
    else { var w=Object.assign({},form,{id:uid(),createdAt:new Date().toISOString()}); updated=workers.concat([w]); }
    await store.set("workers",updated); setWorkers(updated);
    setShowAdd(false); setEditW(null); setForm({name:"",email:"",phone:"",position:"Web 개발자",grade:"중급(4~6년)",status:"available",memo:""}); setSaving(false);
  }
  function openEdit(w){ setEditW(w); setForm({name:w.name||"",email:w.email||"",phone:w.phone||"",position:w.position||"Web 개발자",grade:w.grade||"중급(4~6년)",status:w.status||"available",memo:w.memo||""}); setShowAdd(true); }
  async function removeW(id){ var updated=workers.filter(function(w){return w.id!==id;}); await store.set("workers",updated); setWorkers(updated); setConfirmId(null); }
  var statusC={available:M.success,busy:M.warn,inactive:M.onSurfVar};
  var statusL={available:"가용",busy:"투입중",inactive:"비활성"};
  var filtered=workers.filter(function(w){
    var mq=!q||(w.name||"").toLowerCase().includes(q.toLowerCase())||(w.position||"").toLowerCase().includes(q.toLowerCase());
    var ms=statusF==="전체"||w.status===statusF;
    var dt=w.createdAt||""; var mdf=!dateFrom||dt>=dateFrom; var mdt=!dateTo||dt<=dateTo+"T23:59:59";
    return mq&&ms&&mdf&&mdt;
  });
  var paged=filtered.slice(page*PAGE,(page+1)*PAGE);
  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"20px 28px 0",flexShrink:0,borderBottom:"1px solid "+M.outlineVar,transition:"border-color .15s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div><div style={{fontSize:22,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em"}}>작업자 관리</div><div style={{fontSize:13,color:M.onSurfVar,marginTop:3}}>등록 {workers.length}명 · 가용 {workers.filter(function(w){return w.status==="available";}).length}명</div></div>
          <Btn onClick={function(){setEditW(null);setForm({name:"",email:"",phone:"",position:"Web 개발자",grade:"중급(4~6년)",status:"available",memo:""});setShowAdd(true);}} style={{gap:6}}>{IC.add} 작업자 추가</Btn>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:"1 1 200px"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:M.onSurfVar}}>{IC.search}</span>
            <input value={q} onChange={function(e){setQ(e.target.value);setPage(0);}} placeholder="이름, 직무 검색" style={{width:"100%",padding:"10px 13px 10px 38px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:14,color:M.onSurf,outline:"none",boxSizing:"border-box",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <input type="date" value={dateFrom} onChange={function(e){setDateFrom(e.target.value);setPage(0);}} style={{padding:"9px 10px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
            <span style={{fontSize:12,color:M.onSurfVar}}>~</span>
            <input type="date" value={dateTo} onChange={function(e){setDateTo(e.target.value);setPage(0);}} style={{padding:"9px 10px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:6,paddingBottom:16}}>
          {["전체","available","busy","inactive"].map(function(s){var act=statusF===s; var lbl=s==="전체"?"전체":statusL[s]; var cnt=s==="전체"?workers.length:workers.filter(function(w){return w.status===s;}).length; return(
            <button key={s} onClick={function(){setStatusF(s);setPage(0);}} style={{padding:"5px 14px",borderRadius:20,fontSize:13,border:"none",cursor:"pointer",background:act?M.primaryCont:M.scHst,color:act?M.primary:M.onSurfVar,fontWeight:act?600:400,transition:"all .2s cubic-bezier(.2,0,0,1)",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>{lbl} {cnt>0&&<span style={{opacity:.7}}>{cnt}</span>}</button>
          );})}
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"16px 28px 28px"}}>
        {!loaded&&<div style={{display:"flex",justifyContent:"center",padding:48}}><Spinner/></div>}
        {loaded&&filtered.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>작업자가 없어요</div><div style={{fontSize:13,color:M.onSurfVar}}>작업자 추가 버튼으로 긱워커를 등록하세요</div></div>}
        {paged.map(function(w){var rate=getRate(w.position,w.grade); return(
          <Card key={w.id} style={{padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:40,height:40,borderRadius:12,flexShrink:0,background:M.scHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:M.success,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>{(w.name||"?").slice(0,1)}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <span style={{fontSize:15,fontWeight:600,color:M.onSurf}}>{w.name}</span>
                <span style={{fontSize:12,padding:"3px 9px",borderRadius:6,background:statusC[w.status]+"18",color:statusC[w.status],border:"1px solid "+statusC[w.status]+"40"}}>{statusL[w.status]}</span>
              </div>
              <div style={{fontSize:13,color:M.onSurfVar}}>{w.position} · {w.grade}{rate?" · "+rate.toLocaleString()+"원/h":""}</div>
              {w.phone&&<div style={{fontSize:12,color:M.onSurfVar,marginTop:3}}>{w.phone}</div>}
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button onClick={function(){openEdit(w);}} style={{fontSize:13,padding:"5px 12px",borderRadius:6,background:M.scHst,border:"1px solid "+M.outlineVar,color:M.onSurfVar,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>수정</button>
              {confirmId===w.id?(
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <span style={{fontSize:12,color:M.onSurfVar}}>삭제할까요?</span>
                  <button onClick={function(){removeW(w.id);}} style={{fontSize:12,padding:"4px 10px",borderRadius:6,background:M.error,border:"none",color:"#fff",cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>확인</button>
                  <button onClick={function(){setConfirmId(null);}} style={{fontSize:12,padding:"4px 10px",borderRadius:6,background:M.scHst,border:"1px solid "+M.outlineVar,color:M.onSurfVar,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>취소</button>
                </div>
              ):(
                <button onClick={function(){setConfirmId(w.id);}} style={{fontSize:13,padding:"5px 12px",borderRadius:6,background:M.errorCont,border:"1px solid "+M.errorBorder,color:M.error,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>삭제</button>
              )}
            </div>
          </Card>
        );})}
        <Pager total={filtered.length} cur={page} size={PAGE} set={setPage}/>
      </div>
      <Modal open={showAdd} title={editW?"작업자 수정":"작업자 추가"} onClose={function(){setShowAdd(false);setEditW(null);}} maxWidth={500}
        footer={<><Btn variant="ghost" onClick={function(){setShowAdd(false);setEditW(null);}}>취소</Btn><Btn onClick={save} disabled={saving||!form.name}>{saving?<Spinner/>:"저장"}</Btn></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <Inp label="이름" required value={form.name} onChange={function(e){setF("name",e.target.value);}} placeholder="홍길동"/>
          <Inp label="전화번호" value={form.phone} onChange={function(e){setF("phone",e.target.value);}} placeholder="010-0000-0000"/>
          <Inp label="이메일" value={form.email} type="email" onChange={function(e){setF("email",e.target.value);}} placeholder="dev@email.com"/>
          <Sel label="상태" value={form.status} onChange={function(e){setF("status",e.target.value);}} options={[{value:"available",label:"가용"},{value:"busy",label:"투입중"},{value:"inactive",label:"비활성"}]}/>
          <Sel label="직무" value={form.position} onChange={function(e){setF("position",e.target.value);}} options={POSITIONS}/>
          <Sel label="등급" value={form.grade} onChange={function(e){setF("grade",e.target.value);}} options={GRADES}/>
          <div style={{gridColumn:"1 / -1"}}><Inp label="메모" value={form.memo} onChange={function(e){setF("memo",e.target.value);}} multiline rows={2} mb={0}/></div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Settings Page ───────────────────────────────────────────── */
function SettingsPage(){
  var app=useApp(); var user=app.user; var isDark=useIsDark();
  var seed=app.seed||"teal"; var changeSeed=app.changeSeed||function(){};
  var isAdmin=(user.isAdmin||user.grade==="관리자"||user.grade==="팀장"||user.id==="local");
  var [tab,setTab]=useState("account");
  var STABS=[{id:"account",label:"내 계정"},{id:"team",label:"RM 팀"},{id:"rates",label:"시급표"},{id:"design",label:"디자인"}];

  /* ── 계정 탭 ─────────────────────── */
  var [acf,setAcf]=useState({name:user.name||"",phone:user.phone||"",pw:"",pw2:""});
  var [acSaving,setAcSaving]=useState(false); var [acMsg,setAcMsg]=useState("");
  function setAC(k,v){setAcf(function(p){var n=Object.assign({},p); n[k]=v; return n;});}
  async function saveAccount(){
    if(acf.pw&&acf.pw!==acf.pw2){setAcMsg("비밀번호가 일치하지 않아요"); return;}
    setAcSaving(true);
    var teams=await store.get("teams",[]);
    var updated=teams.map(function(m){
      if(m.id!==user.id) return m;
      var upd=Object.assign({},m,{name:acf.name,phone:acf.phone});
      if(acf.pw) upd.password=acf.pw;
      return upd;
    });
    await store.set("teams",updated);
    setAcMsg("저장됐어요"); setTimeout(function(){setAcMsg("");},2500);
    setAcSaving(false); setAcf(function(p){return Object.assign({},p,{pw:"",pw2:""}); });
  }

  /* ── 팀 탭 ──────────────────────── */
  var [teams,setTeams]=useState([]); var [tLoaded,setTLoaded]=useState(false);
  var [showAdd,setShowAdd]=useState(false); var [editMember,setEditMember]=useState(null);
  var [mf,setMf]=useState({name:"",email:"",phone:"",password:"",grade:"Mid RM",tagOnly:false});
  var [mSaving,setMSaving]=useState(false);
  var [tPage,setTPage]=useState(0); var TPAGE=20;
  var [tQ,setTQ]=useState("");
  useEffect(function(){(async function(){var ts=await store.get("teams",[]); setTeams(ts); setTLoaded(true);})();}, []);
  function setMF(k,v){setMf(function(pr){var n=Object.assign({},pr); n[k]=v; return n;});}
  function openAddMember(){setEditMember(null);setMf({name:"",email:"",phone:"",password:"",grade:"Mid RM",tagOnly:false});setShowAdd(true);}
  function openEditMember(m){
    setEditMember(m);
    setMf({name:m.name||"",email:m.email||"",phone:m.phone||"",password:"",grade:m.grade||"Mid RM",tagOnly:!!m.tagOnly});
    setShowAdd(true);
  }
  async function saveMember(){
    if(!mf.name)return; setMSaving(true);
    var updated;
    if(editMember){
      updated=teams.map(function(m){
        if(m.id!==editMember.id) return m;
        var upd=Object.assign({},m,{name:mf.name,email:mf.email,phone:mf.phone,grade:mf.grade,tagOnly:mf.tagOnly});
        if(mf.password) upd.password=mf.password;
        return upd;
      });
    } else {
      var nm=Object.assign({},mf,{id:uid(),isAdmin:false,createdAt:new Date().toISOString()});
      if(nm.tagOnly) delete nm.password;
      updated=teams.concat([nm]);
    }
    await store.set("teams",updated); setTeams(updated); setShowAdd(false); setMSaving(false);
  }
  async function removeMember(id){if(id===user.id||id==="local"){return;} var updated=teams.filter(function(m){return m.id!==id;}); await store.set("teams",updated); setTeams(updated);}
  var tFiltered=teams.filter(function(m){return !tQ||(m.name||"").toLowerCase().includes(tQ.toLowerCase())||(m.email||"").toLowerCase().includes(tQ.toLowerCase());});
  var tPaged=tFiltered.slice(tPage*TPAGE,(tPage+1)*TPAGE);

  /* ── 시급표 탭 ───────────────────── */
  var [rates,setRates]=useState(null); var [rLoaded,setRLoaded]=useState(false);
  var [editMode,setEditMode]=useState(false); var [rSaving,setRSaving]=useState(false);
  var [newPos,setNewPos]=useState(""); var [rMsg,setRMsg]=useState("");
  var GRADE_COLS=["신입","초급","중급","중급2","고급"];
  useEffect(function(){(async function(){
    var stored=await store.get("rates_table",null);
    var tbl=stored||DEFAULT_RATES;
    _ratesCache=tbl;
    setRates(JSON.parse(JSON.stringify(tbl)));
    setRLoaded(true);
  })();}, []);
  function setCell(pos,grade,val){
    setRates(function(prev){
      var n=JSON.parse(JSON.stringify(prev));
      if(!n[pos]) n[pos]={};
      n[pos][grade]=parseInt(val.replace(/[^0-9]/g,""))||0;
      return n;
    });
  }
  async function saveRates(){
    setRSaving(true);
    await store.set("rates_table",rates);
    window._ratesCache=rates;
    setEditMode(false); setRMsg("저장됐어요"); setTimeout(function(){setRMsg("");},2500); setRSaving(false);
  }
  function addRow(){
    if(!newPos.trim()) return;
    setRates(function(prev){var n=JSON.parse(JSON.stringify(prev)); if(!n[newPos.trim()]){n[newPos.trim()]={신입:0,초급:0,중급:0,중급2:0,고급:0};} return n;});
    setNewPos("");
  }
  function removeRow(pos){setRates(function(prev){var n=JSON.parse(JSON.stringify(prev)); delete n[pos]; return n;});}
  function handleExcel(e){
    var file=e.target.files[0]; if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      try{
        var wb=XLSX.read(ev.target.result,{type:"binary"});
        var ws=wb.Sheets[wb.SheetNames[0]];
        var rows=XLSX.utils.sheet_to_json(ws,{header:1});
        if(rows.length<2){setRMsg("데이터가 부족해요 (헤더+1행 이상 필요)"); return;}
        var headers=rows[0];
        var newRates={};
        for(var i=1;i<rows.length;i++){
          var row=rows[i]; if(!row[0])continue;
          var pos=String(row[0]).trim(); newRates[pos]={};
          GRADE_COLS.forEach(function(g,gi){
            var val=parseInt(row[gi+1])||0; newRates[pos][g]=val;
          });
        }
        setRates(newRates);
        setRMsg("엑셀을 불러왔어요. 저장을 눌러 반영하세요.");
        setEditMode(true);
      }catch(err){setRMsg("엑셀 파싱 오류: "+err.message);}
    };
    reader.readAsBinaryString(file);
    e.target.value="";
  }

  var inpSt={padding:"5px 8px",borderRadius:6,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:13,color:M.onSurf,outline:"none",width:"100%",textAlign:"right",fontFamily:"'Noto Sans KR',system-ui,sans-serif"};

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",animation:"g-fade .2s ease"}}>
      <div style={{padding:"20px 28px 0",flexShrink:0,borderBottom:"1px solid "+M.outlineVar,transition:"border-color .15s"}}>
        <div style={{fontSize:22,fontWeight:700,color:M.onSurf,letterSpacing:"-0.02em",marginBottom:16}}>설정</div>
        <div style={{display:"flex",gap:0}}>
          {STABS.map(function(t){var act=tab===t.id; return(<button key={t.id} onClick={function(){setTab(t.id);}} style={{padding:"10px 18px",fontSize:14,fontWeight:act?600:400,color:act?M.primary:M.onSurfVar,background:"transparent",border:"none",cursor:"pointer",borderBottom:act?"2px solid "+M.primary:"2px solid transparent",marginBottom:-1,transition:"all .2s cubic-bezier(.2,0,0,1)",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>{t.label}</button>);})}
        </div>
      </div>

      <div style={{overflowY:"auto",flex:1,padding:"28px 28px"}}>

        {/* ─ 내 계정 ─ */}
        {tab==="account"&&(
          <div style={{maxWidth:520}}>
            <Card style={{padding:"24px 28px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
                <div style={{width:52,height:52,borderRadius:14,background:M.primaryCont,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:M.primary,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>{(user.name||"?").slice(0,1)}</div>
                <div>
                  <div style={{fontSize:18,fontWeight:600,color:M.onSurf}}>{user.name}</div>
                  <div style={{fontSize:13,color:M.onSurfVar,marginTop:3}}>{user.email}</div>
                </div>
              </div>
              <div style={{padding:"12px 16px",borderRadius:8,background:M.scHst,marginBottom:24,display:"flex",gap:20,flexWrap:"wrap"}}>
                <div><div style={{fontSize:11,color:M.onSurfVar,marginBottom:3,textTransform:"uppercase",letterSpacing:".06em"}}>계정</div><div style={{fontSize:14,color:M.onSurf}}>{user.email||"로컬"}</div></div>
                <div><div style={{fontSize:11,color:M.onSurfVar,marginBottom:3,textTransform:"uppercase",letterSpacing:".06em"}}>등급</div><div style={{fontSize:14,color:M.onSurf}}>{user.grade}</div></div>
                {!isAdmin&&<div style={{fontSize:12,color:M.onSurfVar,alignSelf:"center"}}>계정·등급 변경은 관리자에게 문의하세요</div>}
              </div>
              <div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:16}}>직접 수정 가능한 항목</div>
              <Inp label="이름" value={acf.name} onChange={function(e){setAC("name",e.target.value);}}/>
              <Inp label="연락처" value={acf.phone} onChange={function(e){setAC("phone",e.target.value);}} placeholder="010-0000-0000"/>
              <div style={{borderTop:"1px solid "+M.outlineVar,paddingTop:18,marginTop:6}}>
                <div style={{fontSize:13,color:M.onSurfVar,marginBottom:12}}>비밀번호 변경 — 변경하지 않으려면 비워두세요</div>
                <Inp label="새 비밀번호" type="password" value={acf.pw} onChange={function(e){setAC("pw",e.target.value);}} placeholder="새 비밀번호"/>
                <Inp label="비밀번호 확인" type="password" value={acf.pw2} onChange={function(e){setAC("pw2",e.target.value);}} placeholder="다시 입력" mb={0}/>
              </div>
              {acMsg&&<div style={{marginTop:12,fontSize:13,color:acMsg.includes("않")? M.error:M.success,padding:"8px 12px",borderRadius:6,background:acMsg.includes("않")?M.errorCont:M.successCont}}>{acMsg}</div>}
              <div style={{marginTop:18,display:"flex",justifyContent:"flex-end"}}>
                <Btn onClick={saveAccount} disabled={acSaving}>{acSaving?<Spinner/>:"저장"}</Btn>
              </div>
            </Card>
          </div>
        )}

        {/* ─ RM 팀 ─ */}
        {tab==="team"&&(
          <div style={{maxWidth:680}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:15,fontWeight:600,color:M.onSurf}}>RM 팀 멤버 {teams.length}명</div>
              {isAdmin&&<Btn size="sm" onClick={openAddMember} style={{gap:4}}>{IC.add} 멤버 추가</Btn>}
            </div>
            <div style={{position:"relative",marginBottom:16}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:M.onSurfVar}}>{IC.search}</span>
              <input value={tQ} onChange={function(e){setTQ(e.target.value);setTPage(0);}} placeholder="이름, 이메일 검색" style={{width:"100%",padding:"10px 13px 10px 38px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:14,color:M.onSurf,outline:"none",boxSizing:"border-box",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}/>
            </div>
            {!tLoaded&&<div style={{display:"flex",justifyContent:"center",padding:40}}><Spinner/></div>}
            {tPaged.map(function(m){var isSelf=m.id===user.id; return(
              <Card key={m.id} style={{padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:40,height:40,borderRadius:12,background:isSelf?M.primaryCont:M.scHi,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:isSelf?M.primary:M.onSurfVar,flexShrink:0,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>{(m.name||"?").slice(0,1)}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{fontSize:15,fontWeight:600,color:M.onSurf}}>{m.name}</span>
                    {isSelf&&<span style={{fontSize:11,padding:"2px 7px",borderRadius:6,background:M.primaryCont,color:M.primary}}>나</span>}
                    {m.isAdmin&&<span style={{fontSize:11,padding:"2px 7px",borderRadius:6,background:M.warnCont,color:M.warn}}>관리자</span>}
                    {m.tagOnly&&<span style={{fontSize:11,padding:"2px 7px",borderRadius:6,background:M.scHst,color:M.onSurfVar}}>태그전용</span>}
                  </div>
                  <div style={{fontSize:13,color:M.onSurfVar}}>{m.email} · {m.grade}</div>
                </div>
                {isAdmin&&m.id!=="local"&&(
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={function(){openEditMember(m);}} style={{fontSize:13,padding:"5px 12px",borderRadius:6,background:M.scHst,border:"1px solid "+M.outlineVar,color:M.onSurfVar,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>수정</button>
                    {!isSelf&&<button onClick={function(){removeMember(m.id);}} style={{fontSize:13,padding:"5px 12px",borderRadius:6,background:M.errorCont,border:"1px solid "+M.errorBorder,color:M.error,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>삭제</button>}
                  </div>
                )}
              </Card>
            );})}
            <Pager total={tFiltered.length} cur={tPage} size={TPAGE} set={setTPage}/>
          </div>
        )}

        {/* ─ 시급표 ─ */}
        {tab==="rates"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:M.onSurf}}>시급표</div>
                <div style={{fontSize:13,color:M.onSurfVar,marginTop:3}}>단위: 원/시간 · VAT 별도 · {editMode?"편집 중":"읽기 모드"}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {rMsg&&<span style={{fontSize:13,color:rMsg.includes("오류")||rMsg.includes("부족")?M.error:M.success}}>{rMsg}</span>}
                {!editMode&&(
                  <label style={{padding:"8px 16px",borderRadius:20,border:"1px solid "+M.outlineVar,background:"transparent",color:M.onSurfVar,fontSize:13,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif",display:"inline-flex",alignItems:"center",gap:6}}>
                    엑셀 업로드
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcel} style={{display:"none"}}/>
                  </label>
                )}
                {!editMode&&<Btn variant="outline" size="sm" onClick={function(){setEditMode(true);}}>편집</Btn>}
                {editMode&&<Btn variant="ghost" size="sm" onClick={function(){setEditMode(false); store.get("rates_table",null).then(function(s){var t=s||DEFAULT_RATES; setRates(JSON.parse(JSON.stringify(t)));});}}>취소</Btn>}
                {editMode&&<Btn size="sm" onClick={saveRates} disabled={rSaving}>{rSaving?<Spinner/>:"저장"}</Btn>}
              </div>
            </div>
            {editMode&&(
              <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
                <input value={newPos} onChange={function(e){setNewPos(e.target.value);}} placeholder="새 직무명 입력" style={{padding:"9px 12px",borderRadius:8,border:"1px solid "+M.outlineVar,background:M.scHst,fontSize:14,color:M.onSurf,outline:"none",fontFamily:"'Noto Sans KR',system-ui,sans-serif",flex:"1 1 200px"}}/>
                <Btn size="sm" onClick={addRow} disabled={!newPos.trim()}>행 추가</Btn>
              </div>
            )}
            {!rLoaded&&<Spinner/>}
            {rLoaded&&rates&&(
              <div style={{overflowX:"auto",borderRadius:12,border:"1px solid "+M.outlineVar}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                  <thead>
                    <tr style={{background:M.scHi,transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
                      {["직무","신입","초급","중급","중급2","고급"].map(function(h,i){return(
                        <th key={h} style={{padding:"13px 14px",textAlign:i===0?"left":"right",color:M.onSurfVar,fontWeight:600,whiteSpace:"nowrap",borderBottom:"1px solid "+M.outlineVar}}>{h}</th>
                      );})}
                      {editMode&&<th style={{padding:"13px 14px",borderBottom:"1px solid "+M.outlineVar}}></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(rates).map(function(pos,i){var r=rates[pos]; return(
                      <tr key={pos} style={{borderBottom:"1px solid "+M.outlineVar,background:i%2===0?"transparent":M.scHst+"40",transition:"background .2s cubic-bezier(.2,0,0,1)"}}>
                        <td style={{padding:"12px 14px",color:M.onSurf,fontWeight:500,whiteSpace:"nowrap"}}>{pos}</td>
                        {GRADE_COLS.map(function(g){return(
                          <td key={g} style={{padding:"10px 14px",textAlign:"right"}}>
                            {editMode
                              ? <input value={r[g]?r[g].toLocaleString():"0"} onChange={function(e){setCell(pos,g,e.target.value);}} style={inpSt}/>
                              : <span style={{color:r[g]?M.onSurfVar:M.outlineVar}}>{r[g]?r[g].toLocaleString():"—"}</span>
                            }
                          </td>
                        );})}
                        {editMode&&<td style={{padding:"10px 14px",textAlign:"center"}}><button onClick={function(){removeRow(pos);}} style={{fontSize:12,padding:"3px 8px",borderRadius:6,background:M.errorCont,border:"1px solid "+M.errorBorder,color:M.error,cursor:"pointer",fontFamily:"'Noto Sans KR',system-ui,sans-serif"}}>삭제</button></td>}
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}
            {editMode&&(
              <div style={{marginTop:12,padding:"12px 14px",borderRadius:8,background:M.scHst}}>
                <div style={{fontSize:13,fontWeight:500,color:M.onSurf,marginBottom:4}}>엑셀 업로드 형식</div>
                <div style={{fontSize:12,color:M.onSurfVar}}>A열: 직무명 / B~F열: 신입, 초급, 중급, 중급2, 고급 시급 (숫자만)</div>
                <div style={{fontSize:12,color:M.onSurfVar,marginTop:2}}>1행: 헤더 / 2행부터 데이터</div>
              </div>
            )}
          </div>
        )}

        {/* ─ 디자인 ─ */}
        {tab==="design"&&(
          <div style={{maxWidth:520}}>
            <Card style={{padding:"24px 28px",marginBottom:20}}>
              <div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:6}}>시드 컬러</div>
              <div style={{fontSize:13,color:M.onSurfVar,marginBottom:20}}>선택한 컬러가 다크·라이트 모드 전체에 적용됩니다</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
                {[["teal","Teal","#6AADAA","차갑고 전문적"],["blue","Blue","#5B9FD4","친숙하고 신뢰감"],["amber","Amber","#918070","따뜻한 뉴트럴"],["rose","Rose","#8C96A8","쿨 블루-그레이"]].map(function(s){var act=seed===s[0]; return(
                  <button key={s[0]} onClick={function(){changeSeed(s[0]);}} style={{padding:"20px 16px",borderRadius:12,border:"2px solid "+(act?s[2]:M.outlineVar),background:act?M.primaryCont:"transparent",cursor:"pointer",textAlign:"center",fontFamily:"'Noto Sans KR',system-ui,sans-serif",transition:"all .2s cubic-bezier(.2,0,0,1)"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:s[2],margin:"0 auto 10px"}}></div>
                    <div style={{fontSize:15,fontWeight:act?600:400,color:act?s[2]:M.onSurf}}>{s[1]}</div>
                    <div style={{fontSize:12,color:M.onSurfVar,marginTop:4}}>{s[3]}</div>
                    {act&&<div style={{fontSize:12,marginTop:6,color:s[2],fontWeight:600}}>적용 중</div>}
                  </button>
                );})}
              </div>
              <div style={{fontSize:15,fontWeight:600,color:M.onSurf,marginBottom:14}}>테마</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderRadius:10,background:M.scHst}}>
                <div><div style={{fontSize:14,color:M.onSurf}}>{isDark?"다크 모드":"라이트 모드"}</div><div style={{fontSize:12,color:M.onSurfVar,marginTop:3}}>사이드바 하단 버튼으로도 전환 가능</div></div>
                <div onClick={function(){(app.toggleTheme||function(){})();}} style={{width:44,height:24,borderRadius:12,background:isDark?M.primary:M.outline,cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}><div style={{position:"absolute",top:3,left:isDark?"calc(100% - 21px)":3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}></div></div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal open={showAdd} title={editMember?"멤버 수정":"멤버 추가"} onClose={function(){setShowAdd(false);setEditMember(null);}} maxWidth={460}
        footer={<><Btn variant="ghost" onClick={function(){setShowAdd(false);setEditMember(null);}}>취소</Btn><Btn onClick={saveMember} disabled={mSaving||!mf.name}>{mSaving?<Spinner/>:"저장"}</Btn></>}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
          <Inp label="이름" required value={mf.name} onChange={function(e){setMF("name",e.target.value);}} placeholder="홍길동"/>
          <Inp label="연락처" value={mf.phone} onChange={function(e){setMF("phone",e.target.value);}} placeholder="010-0000-0000"/>
          <Inp label="이메일" value={mf.email} type="email" onChange={function(e){setMF("email",e.target.value);}} placeholder="rm@gridge.io"/>
          <Sel label="직급" value={mf.grade} onChange={function(e){setMF("grade",e.target.value);}} options={["Junior RM","Mid RM","Senior RM","팀장","관리자"]}/>
          <div style={{gridColumn:"1 / -1"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div onClick={function(){setMF("tagOnly",!mf.tagOnly);}} style={{width:40,height:22,borderRadius:11,background:mf.tagOnly?M.primaryCont:M.scHst,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 3px",transition:"background .2s",border:"1px solid "+(mf.tagOnly?M.primary:M.outlineVar)}}><div style={{width:16,height:16,borderRadius:"50%",background:mf.tagOnly?M.primary:M.onSurfVar,transform:mf.tagOnly?"translateX(18px)":"translateX(0)",transition:"transform .2s"}}/></div>
              <div><div style={{fontSize:13,fontWeight:500,color:M.onSurf}}>태그 전용</div><div style={{fontSize:12,color:M.onSurfVar}}>로그인 불가, 견적서에 이름만 표시</div></div>
            </div>
          </div>
          {!mf.tagOnly&&<div style={{gridColumn:"1 / -1"}}><Inp label={editMember?"새 비밀번호 (변경 시만 입력)":"비밀번호"} type="password" value={mf.password} onChange={function(e){setMF("password",e.target.value);}} placeholder="••••••••" mb={0}/></div>}
        </div>
      </Modal>
    </div>
  );
}

/* ── Root App ────────────────────────────────────────────────── */
export default function App(){
  var [appState,setAppState]=useState("loading");
  var [user,setUser]=useState(null);
  var [page,setPage]=useState("home");
  var [selectedCustomer,setSelectedCustomer]=useState(null);
  var [hasAccounts,setHasAccounts]=useState(false);
  var [isDark,setIsDark]=useState(true);
  var [seed,setSeedState]=useState("teal");

  function getTokens(dark,s){
    if(s==="blue")  return dark?BLUE_DARK:BLUE_LIGHT;
    if(s==="amber") return dark?AMBER_DARK:AMBER_LIGHT;
    if(s==="rose")  return dark?ROSE_DARK:ROSE_LIGHT;
    return dark?TEAL_DARK:TEAL_LIGHT;
  }
  function toggleTheme(){
    setIsDark(function(prev){
      var next=!prev;
      var tokens=getTokens(next,seed);
      Object.keys(tokens).forEach(function(k){ M[k]=tokens[k]; });
      return next;
    });
  }
  function changeSeed(s){
    setSeedState(s);
    var tokens=getTokens(isDark,s);
    Object.keys(tokens).forEach(function(k){ M[k]=tokens[k]; });
    store.set("seed",s);
  }

  useEffect(function(){
    var settled=false;
    function go(state){ if(!settled){settled=true; setAppState(state);} }
    var safety=setTimeout(function(){go("login");},8000);
    (async function(){
      try{
        var savedSeed=await store.get("seed","teal"); if(savedSeed==="lavender")savedSeed="teal";
        if(savedSeed){
          setSeedState(savedSeed);
          var initTokens=getTokens(true,savedSeed);
          Object.keys(initTokens).forEach(function(k){M[k]=initTokens[k];});
        }
        var teams=await store.get("teams",[]);
        var accounts=(teams||[]).filter(function(m){return !m.tagOnly&&m.password;});
        setHasAccounts(accounts.length>0);
        var session=await store.get("session",null);
        if(session){
          if(session.isLocal){
            await seedDummyData("local");
            setUser(LOCAL_USER); clearTimeout(safety); go("app"); return;
          }
          if(session.userId){
            var found=accounts.find(function(m){return m.id===session.userId;});
            if(found){ await seedDummyData(found.id); setUser(found); clearTimeout(safety); go("app"); return; }
          }
        }
      }catch(e){ console.error("init error:",e); }
      clearTimeout(safety); go("login");
    })();
  }, []);

  function handleLogin(member){
    (async function(){
      await seedDummyData(member.id);
      setUser(member); setAppState("app");
    })();
  }
  async function logout(){ await store.del("session"); setUser(null); setAppState("login"); setPage("home"); setSelectedCustomer(null); }

  var ctx={user:user,logout:logout,changeSeed:changeSeed,seed:seed,isDark:isDark,toggleTheme:toggleTheme};

  /* ── Loading ── */
  if(appState==="loading") return(
    <div style={{minHeight:"100vh",background:M.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{"@keyframes g-spin{to{transform:rotate(360deg)}}@keyframes g-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box}"}</style>
      <Spinner/>
    </div>
  );

  /* ── Login ── */
  if(appState==="login") return(
    <ThemeCtx.Provider value={isDark}>
      <Ctx.Provider value={ctx}>
        <style>{"@keyframes g-spin{to{transform:rotate(360deg)}}@keyframes g-fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box}input,textarea,button,select{font-family:'Noto Sans KR',system-ui,sans-serif}input::placeholder,textarea::placeholder{color:"+M.onSurfVar+";opacity:.5}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:"+M.outlineVar+";border-radius:4px}"}</style>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"/>
        <LoginScreen onLogin={handleLogin} hasAccounts={hasAccounts}/>
      </Ctx.Provider>
    </ThemeCtx.Provider>
  );

  /* ── App ── */
  var pageEl;
  if(page==="home") pageEl=<HomePage setPage={setPage} setCustomer={setSelectedCustomer}/>;
  else if(page==="customers") pageEl=<CustomerListPage setPage={setPage} setCustomer={setSelectedCustomer}/>;
  else if(page==="customerDetail"&&selectedCustomer) pageEl=<CustomerDetailPage customer={selectedCustomer} setPage={setPage}/>;
  else if(page==="projects") pageEl=<ProjectsPage setPage={setPage} setCustomer={setSelectedCustomer}/>;
  else if(page==="contracts") pageEl=<ContractPage/>;
  else if(page==="analysis") pageEl=<ContractAnalysisPage/>;
  else if(page==="workers") pageEl=<WorkerPage/>;
  else if(page==="settings") pageEl=<SettingsPage/>;
  else pageEl=<HomePage setPage={setPage} setCustomer={setSelectedCustomer}/>;

  return(
    <ThemeCtx.Provider value={isDark}>
      <Ctx.Provider value={ctx}>
        <div className="app-root" style={{background:M.bg,fontFamily:"'Noto Sans KR',system-ui,sans-serif",color:M.onSurf,WebkitFontSmoothing:"antialiased",transition:"background .15s,color .15s"}}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
            @keyframes g-spin{to{transform:rotate(360deg)}}
            @keyframes g-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
            @keyframes g-ripple{from{transform:scale(0);opacity:.3}to{transform:scale(2.5);opacity:0}}
            *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
            input,textarea,button,select{font-family:'Noto Sans KR',system-ui,sans-serif}
            input::placeholder,textarea::placeholder{color:${M.onSurfVar};opacity:.5;transition:color .15s}
            ::-webkit-scrollbar{width:4px;height:4px}
            ::-webkit-scrollbar-track{background:transparent}
            ::-webkit-scrollbar-thumb{background:${M.outlineVar};border-radius:4px}

            /* MD3 State Layers */
            .m3-nav-btn{position:relative;overflow:hidden;transition:color .2s cubic-bezier(.2,0,0,1)}
            .m3-nav-btn:hover::after{content:'';position:absolute;inset:0;background:currentColor;opacity:.08;border-radius:inherit;pointer-events:none}
            .m3-nav-btn:active::after{content:'';position:absolute;inset:0;background:currentColor;opacity:.12;border-radius:inherit;pointer-events:none}

            .m3-btn{position:relative;overflow:hidden;transition:box-shadow .2s cubic-bezier(.2,0,0,1),background .2s cubic-bezier(.2,0,0,1)}
            .m3-btn:hover::after{content:'';position:absolute;inset:0;background:currentColor;opacity:.08;pointer-events:none}
            .m3-btn:active::after{content:'';position:absolute;inset:0;background:currentColor;opacity:.12;pointer-events:none}
            .m3-btn:focus-visible{outline:2px solid ${M.primary};outline-offset:2px}

            .m3-card-click{transition:background .15s cubic-bezier(.2,0,0,1)}
            .m3-card-click:hover{background:${M.scHi} !important}
            .m3-card-click:active{background:${M.scHst} !important}

            .m3-list-item{transition:background .15s cubic-bezier(.2,0,0,1)}
            .m3-list-item:hover{background:${M.scHi}}
            .m3-list-item:active{background:${M.scHst}}

            .m3-chip{transition:background .15s cubic-bezier(.2,0,0,1),border-color .15s,color .15s}
            .m3-chip:hover{filter:brightness(1.08)}
            .m3-chip:active{filter:brightness(.95)}

            table{border-spacing:0}
            a{color:inherit;text-decoration:none}
            button{cursor:pointer}

          `}</style>
          <Sidebar page={page} setPage={setPage} onToggleTheme={toggleTheme} seed={seed}/>
          <div className="app-content" style={{transition:"background .2s cubic-bezier(.2,0,0,1)"}}>{pageEl}</div>
        </div>
      </Ctx.Provider>
    </ThemeCtx.Provider>
  );
}
