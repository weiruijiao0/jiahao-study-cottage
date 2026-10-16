import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(dist);const cacheFiles=files.filter(f=>!f.endsWith('sw.js')&&!f.endsWith('.tgz')).map(f=>'./'+path.relative(dist,f).replaceAll('\\','/'));
const version=crypto.createHash('sha256').update('jiahao-cache-v3-navigation'+files.filter(f=>!f.endsWith('sw.js')).map(f=>fs.readFileSync(f)).join('')).digest('hex').slice(0,12);
fs.writeFileSync(path.join(dist,'sw.js'),`const CACHE='jiahao-${version}';const FILES=${JSON.stringify(cacheFiles)};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('jiahao-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;const cached=e.request.mode==='navigate'?new URL('./index.html',self.registration.scope).href:e.request;e.respondWith(caches.match(cached,{ignoreVary:true}).then(hit=>hit||fetch(e.request)));});`);
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const js=html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const css=html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/);
if(!js||!css)throw Error('构建缺少JS/CSS');
const assets={};for(const f of files.filter(f=>f.endsWith('.webp'))){assets[path.relative(dist,f).replaceAll('\\','/')]='data:image/webp;base64,'+fs.readFileSync(f).toString('base64');}
html=html.replace(css[0],()=>`<style>${fs.readFileSync(path.resolve(dist,css[1]),'utf8')}</style>`);
html=html.replace(js[0],()=>`<script>window.__JIAHAO_ASSETS__=${JSON.stringify(assets)};</script><script type="module">${fs.readFileSync(path.resolve(dist,js[1]),'utf8').replaceAll('</script','<\\/script')}</script>`);
html=html.replace(/<link[^>]+rel="manifest"[^>]*>/,'').replace('href="./icon.svg"','href="data:image/svg+xml;base64,'+fs.readFileSync(path.join(dist,'icon.svg')).toString('base64')+'"');
html=html.replace('href="./apple-touch-icon.png"','href="data:image/png;base64,'+fs.readFileSync(path.join(dist,'apple-touch-icon.png')).toString('base64')+'"');
const standalone=path.resolve(root,'../加号的教资闯关小屋.html');fs.writeFileSync(standalone,html);
console.log(`可直接双击的单文件游戏：${standalone} (${Math.round(Buffer.byteLength(html)/1024)} KB)`);
console.log(`离线缓存：${cacheFiles.length} files, ${version}`);
