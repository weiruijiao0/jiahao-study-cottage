export type Sound='tap'|'slide'|'match'|'correct'|'wrong'|'clear';
let ctx:AudioContext|null=null;let musicTimer:ReturnType<typeof setInterval>|null=null;let musicStep=0;
export function unlockAudio(){try{ctx ||= new AudioContext();if(ctx.state!=='running')void ctx.resume().catch(()=>{});}catch{/* 浏览器不支持音频时继续文字玩法 */}}
function note(f:number,start:number,duration:number,volume:number,type:OscillatorType='sine'){
 if(!ctx||ctx.state!=='running')return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.value=f;gain.gain.setValueAtTime(0,ctx.currentTime+start);gain.gain.linearRampToValueAtTime(volume,ctx.currentTime+start+.015);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+start+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start(ctx.currentTime+start);osc.stop(ctx.currentTime+start+duration+.03);osc.onended=()=>{osc.disconnect();gain.disconnect();};
}
export function playSound(name:Sound,enabled=true){if(!enabled)return;unlockAudio();const configs:Record<Sound,number[]>={tap:[660],slide:[420,510],match:[523,659,784],correct:[659,784,1046],wrong:[392,349],clear:[523,659,784,1046,1318]};configs[name].forEach((f,i)=>note(f,i*(name==='clear'?.12:.075),name==='wrong'?.28:.18,name==='tap'?.018:.035));}
export function setMusic(enabled:boolean){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}if(!enabled||document.hidden)return;unlockAudio();const tune=[261.63,329.63,392,329.63,293.66,349.23,440,349.23,261.63,329.63,392,523.25,349.23,329.63,293.66,261.63];musicTimer=setInterval(()=>{note(tune[musicStep++%tune.length],0,.8,.012);},1050);}
export function pauseAudio(){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}if(ctx?.state==='running')void ctx.suspend();}
