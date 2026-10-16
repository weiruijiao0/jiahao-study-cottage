import knowledgeData from './data/knowledge.json';
import levelData from './data/levels.json';
export type Kind='match'|'judge'|'choice'|'keywords'|'scene'|'source';
export type Knowledge=Omit<typeof knowledgeData[number],'parts'|'keywords'|'confusion'|'reviewLevels'|'suitableTypes'> & {parts:string[];keywords:string[];confusion:string[];reviewLevels:number[];suitableTypes:string[]};
export const knowledge=knowledgeData as Knowledge[];
export const levels=levelData;
export const byId=Object.fromEntries(knowledge.map(k=>[k.id,k])) as Record<string,Knowledge>;
export const STORE_KEY='jiahao-cottage-v1';
export const DAY=86400000;
export type Mastery='尚未学习'|'初步接触'|'需要复习'|'基本掌握'|'较稳定掌握';
export type Stat={attempts:number;correct:number;errors:number;streak:number;intervalStep?:number;lastCorrect:boolean;due:number;last:number;days:string[];history:{at:number;correct:boolean;kind:Kind;session:string}[]};
export type Task={uid:string;id:string;kind:Kind;options:string[];truth:boolean;statement:string;pairs:string[];rightPairs:string[];tokens:string[];correctTokens:string[];ordered:boolean;review:boolean;recorded:boolean;pairAssessed?:string[];complete:boolean;widget:{matches:string[];tokens:string[]}};
export type Session={id:string;level:number|null;index:number;tasks:Task[];readIndex:number;readDone:boolean;finished:boolean;started:number};
export type Save={version:1;stats:Record<string,Stat>;completed:number[];session:Session|null;paused?:Record<string,Session>;favorites:string[];notes:string[];settings:{sound:boolean;music:boolean;reduceMotion:boolean};lastVisit:number};
export function freshSave():Save{return {version:1,stats:{},completed:[],session:null,favorites:[],notes:[],settings:{sound:true,music:false,reduceMotion:typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches},lastVisit:Date.now()};}
export function isSave(v:unknown):v is Save{
 if(!v||typeof v!=='object')return false;const x=v as Save;
 if(x.version!==1||!x.stats||typeof x.stats!=='object'||!Array.isArray(x.completed)||!x.completed.every(n=>Number.isInteger(n)&&n>=1&&n<=30)||!Array.isArray(x.favorites)||!x.favorites.every(id=>byId[id])||!Array.isArray(x.notes)||!x.settings||['sound','music','reduceMotion'].some(k=>typeof x.settings[k as keyof Save['settings']]!=='boolean'))return false;
 if(!Object.entries(x.stats).every(([id,s])=>byId[id]&&s&&Number.isFinite(s.attempts)&&s.attempts>=0&&Number.isFinite(s.correct)&&Number.isFinite(s.errors)&&Number.isFinite(s.streak)&&Number.isFinite(s.due)&&Number.isFinite(s.last)&&typeof s.lastCorrect==='boolean'&&Array.isArray(s.days)&&Array.isArray(s.history)))return false;
 if(x.session){const s=x.session;if(typeof s.id!=='string'||!Array.isArray(s.tasks)||!s.tasks.length||!Number.isInteger(s.index)||s.index<0||s.index>=s.tasks.length||!(s.level===null||Number.isInteger(s.level)&&s.level>=1&&s.level<=30)||!s.tasks.every(t=>byId[t.id]&&['match','judge','choice','keywords','scene','source'].includes(t.kind)&&Array.isArray(t.options)&&Array.isArray(t.pairs)&&t.pairs.every(id=>byId[id])&&Array.isArray(t.rightPairs)&&Array.isArray(t.tokens)&&Array.isArray(t.correctTokens)&&t.widget&&Array.isArray(t.widget.matches)&&Array.isArray(t.widget.tokens)))return false;}
 if(x.session&&(!Number.isInteger(x.session.readIndex)||x.session.readIndex<0||x.session.readIndex>100||typeof x.session.readDone!=='boolean'||typeof x.session.finished!=='boolean'))return false;
 if(x.paused){if(typeof x.paused!=='object'||Array.isArray(x.paused)||Object.keys(x.paused).length>31)return false;for(const [key,s] of Object.entries(x.paused)){if(!isSave({...x,paused:undefined,session:s})||key!==String(s.level||'review'))return false;}}
 return true;
}
export function loadSave():{save:Save;warning:string|null;recovery:string|null}{let raw:string|null=null;try{raw=localStorage.getItem(STORE_KEY);if(!raw)return {save:freshSave(),warning:null,recovery:localStorage.getItem(STORE_KEY+'-recovery')};const parsed=JSON.parse(raw);if(!isSave(parsed))throw Error('invalid');return {save:parsed,warning:null,recovery:localStorage.getItem(STORE_KEY+'-recovery')};}catch{if(raw){let kept=false;try{localStorage.setItem(STORE_KEY+'-recovery',raw);kept=true;}catch{/* 存储被禁用时仍可从本次页面导出原文 */}return {save:freshSave(),warning:kept?'旧存档格式不完整，原文已单独保留，可从设置导出待恢复数据。':'旧存档无法读取，请在关闭页面前从设置导出待恢复数据。',recovery:raw};}return {save:freshSave(),warning:'浏览器暂时无法读取存档，请在设置中定期导出进度。',recovery:null};}}
export function saveProgress(save:Save){try{localStorage.setItem(STORE_KEY,JSON.stringify(save));return true;}catch{return false;}}
export function mastery(s?:Stat):Mastery{if(!s)return '尚未学习';if(!s.lastCorrect)return '需要复习';if(s.streak>=4&&s.days.length>=3)return '较稳定掌握';if(s.streak>=2)return '基本掌握';return '初步接触';}
export function nextStat(prev:Stat|undefined,correct:boolean,kind:Kind,session:string,now=Date.now()):Stat{
 const p=prev||{attempts:0,correct:0,errors:0,streak:0,lastCorrect:false,due:0,last:0,days:[],history:[]};
 const streak=correct?p.streak+1:0;const day=new Date(now+8*3600000).toISOString().slice(0,10);
 const intervalStep=correct?(p.lastCorrect&&now-p.last>=20*3600000?Math.min((p.intervalStep||0)+1,3):p.intervalStep||0):0;
 return {...p,attempts:p.attempts+1,correct:p.correct+Number(correct),errors:p.errors+Number(!correct),streak,intervalStep,lastCorrect:correct,due:now+(correct?[1,3,7,14][intervalStep]*DAY:10*60000),last:now,days:correct?[...new Set([...p.days,day])]:p.days,history:[...p.history,{at:now,correct,kind,session}].slice(-80)};
}
function hash(s:string){let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
export function shuffled<T>(arr:T[],seed:string):T[]{const out=[...arr];let n=hash(seed);for(let i=out.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
function peerRecords(k:Knowledge){const near=knowledge.filter(p=>p.id!==k.id&&![25,48,161].includes(p.number)&&p.term!==k.term&&p.meaning!==k.meaning&&(k.confusion.includes(p.term)||p.chapter===k.chapter)).sort((a,b)=>Number(k.confusion.includes(b.term))-Number(k.confusion.includes(a.term))||Math.abs(a.number-k.number)-Math.abs(b.number-k.number));const unique:Knowledge[]=[];for(const p of near)if(!unique.some(q=>q.term===p.term||q.meaning===p.meaning))unique.push(p);return unique;}
export function makeTask(id:string,kind:Kind,seed:string,review=false,previousKind?:Kind):Task{
 const k=byId[id];let chosen=kind;if(review&&previousKind===chosen)chosen=chosen==='judge'?'scene':'judge';
 if(chosen==='keywords'&&!k.parts.length)chosen='scene';
 if(chosen==='source'&&![25,48,161].includes(k.number))chosen='judge';
 if([25,48,161].includes(k.number))chosen='source';
 const peers=peerRecords(k);
 const distractors=shuffled(k.confusion,seed+'distractors').slice(0,2);
 const truth=hash(seed+'truth')%2===0;
 const wrong=peers.find(p=>p.meaning!==k.meaning)?.meaning||'不属于这张知识卡的解释';
 let correctTokens=k.parts.length>6?k.parts.slice(0,6):k.parts;
 if(!k.ordered&&correctTokens.length>4)correctTokens=shuffled(correctTokens,seed+'subset').slice(0,4);
 const otherParts=shuffled(knowledge.filter(p=>p.chapter===k.chapter&&p.id!==id).flatMap(p=>p.parts),seed+'parts');
 const extra=[...new Set([...otherParts,...distractors])].filter(p=>!k.parts.includes(p)&&!correctTokens.includes(p)).slice(0,2);
 const pairs=[k.id,...peers.slice(0,2).map(p=>p.id)];
 return {uid:seed,id,kind:chosen,options:shuffled(chosen==='source'?['保留疑问，暂不背作定论','去掉疑问，直接背成结论','删除原文和编号']:[k.term,...distractors],seed+'options'),truth,statement:`${k.term}：${truth?k.meaning:wrong}`,pairs,rightPairs:shuffled(pairs,seed+'right'),tokens:shuffled([...correctTokens,...extra],seed+'tokens'),correctTokens,ordered:k.ordered,review,recorded:false,pairAssessed:[],complete:false,widget:{matches:[],tokens:[]}};
}
export function reviewQueue(save:Save,now=Date.now()):string[]{return knowledge.filter(k=>![25,48,161].includes(k.number)&&save.stats[k.id]).sort((a,b)=>{
 const score=(id:string)=>{const s=save.stats[id];return (!s.lastCorrect?1000000:0)+(s.due<=now?100000:0)+Math.min(10000,(now-s.due)/DAY)*100+s.errors*5-s.streak*10;};return score(b.id)-score(a.id)||a.number-b.number;
 }).map(k=>k.id);}
export function makeSession(save:Save,level:number|null,requested?:string[],now=Date.now()):Session{
 const id=`${level||'review'}-${now}`;let tasks:Task[];
 if(level){const plan=levels[level-1];const weak=reviewQueue(save,now).filter(i=>!plan.newIds.includes(i));let wi=0;const used=new Set<string>(plan.newIds);
 tasks=plan.tasks.map((t,i)=>{let kid=t.id;if(t.review){const candidate=weak.slice(wi).find(v=>!used.has(v));if(candidate){kid=candidate;wi=weak.indexOf(candidate)+1;}used.add(kid);}return makeTask(kid,t.kind as Kind,`${id}-${i}`,t.review,save.stats[kid]?.history.at(-1)?.kind);});
 }else{let ids=requested||reviewQueue(save,now).slice(0,8);if(!ids.length)ids=shuffled(knowledge.filter(k=>![25,48,161].includes(k.number)).map(k=>k.id),id).slice(0,8);tasks=ids.map((kid,i)=>makeTask(kid,(['judge','scene','match','keywords'] as Kind[])[i%4],`${id}-${i}`,true,save.stats[kid]?.history.at(-1)?.kind));}
 return {id,level,index:0,tasks,readIndex:0,readDone:true,finished:false,started:now};
}
export function recordAttempt(save:Save,correct:boolean,now=Date.now()):Save{
 const s=save.session;if(!s||s.finished)return save;const t=s.tasks[s.index];if(t.recorded)return save;
 if(t.kind==='source')return {...save,notes:[...new Set([...save.notes,t.id])],session:{...s,tasks:s.tasks.map((x,i)=>i===s.index?{...x,recorded:true}:x)}};
 return {...save,stats:{...save.stats,[t.id]:nextStat(save.stats[t.id],correct,t.kind,s.id,now)},session:{...s,tasks:s.tasks.map((x,i)=>i===s.index?{...x,recorded:true}:x)}};
}
export function sourceChunks(k:Knowledge){const text=k.original;const chunks:string[]=[];let part='';for(const c of text){part+=c;if(part.length>=42&&'，。、；：'.includes(c)||part.length>=52){chunks.push(part);part='';}}if(part)chunks.push(part);return chunks;}
export function dueCount(save:Save,now=Date.now()){return Object.values(save.stats).filter(s=>s.due<=now).length;}
export function learnedCount(save:Save){return new Set([...Object.keys(save.stats),...save.notes]).size;}
export function unlockedLevel(save:Save){let n=1;while(save.completed.includes(n)&&n<30)n++;return n;}
export const kindNames:Record<Kind,string>={match:'知识卡片配对',judge:'真假小判断',choice:'三选一挑战',keywords:'关键词拼拼乐',scene:'迷你教学情境',source:'原文疑问小卡'};
