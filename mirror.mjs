import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve('dist');
const origin=process.argv[2]||'https://puredivineenergy.com';
const prefix=process.argv[3]||'';
const pages=new Map(), assets=new Map(), failures=[];
const queue=[origin+'/'];
const clean=u=>{const x=new URL(u);x.hash='';return x.href};
const pagePath=u=>{let p=prefix+new URL(u).pathname;return p.endsWith('/')?p+'index.html':path.extname(p)?p:p+'/index.html'};
const isPage=u=>{let x=new URL(u);return x.origin===origin&&!x.search&&!/\/(wp-|feed|comments|author|tag|category)|\/r\/?$|\.xml$|\.json$/.test(x.pathname)&&!path.extname(x.pathname)};
async function get(u){for(let n=0;n<3;n++){try{let r=await fetch(u,{signal:AbortSignal.timeout(40000)});if(!r.ok)throw Error('HTTP '+r.status);return {data:Buffer.from(await r.arrayBuffer()),type:r.headers.get('content-type')||''}}catch(e){if(n===2)throw e}}}
function asset(u){u=clean(u);if(!assets.has(u)){let ext=path.extname(new URL(u).pathname);if(!ext||ext.length>8)ext=new URL(u).hostname==='fonts.googleapis.com'?'.css':'.bin';assets.set(u,{local:'/assets/'+crypto.createHash('sha256').update(u).digest('hex').slice(0,20)+ext});}return assets.get(u).local}
function discover(text,base){const urls=[];for(const m of text.matchAll(/(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)["']?\s*\)|(?:https?:)?\/\/[^\s"'<>\\)]+/gi)){let raw=m[1]||m[2]||m[0];raw=raw.replaceAll('&amp;','&');try{let u=new URL(raw,base);if(!/^https?:$/.test(u.protocol))continue;urls.push(u.href)}catch{}}return [...new Set(urls)]}
await fs.mkdir(root,{recursive:true});
while(queue.length&&pages.size<250){const u=queue.shift();if(pages.has(u))continue;try{const r=await get(u);if(!r.type.includes('text/html'))continue;const text=r.data.toString();pages.set(u,{text,local:pagePath(u)});console.log('Page',pages.size,new URL(u).pathname);for(let v of discover(text,u)){v=clean(v);if(isPage(v)){if(!pages.has(v)&&!queue.includes(v))queue.push(v)}else if(/\.(css|js|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|pdf)(\?|$)/i.test(v)||new URL(v).hostname==='fonts.googleapis.com'){asset(v)}}}catch(e){failures.push({url:u,error:e.message})}}
let pending=[...assets.keys()];const done=new Set();
while(pending.length){const batch=pending.splice(0,8);await Promise.all(batch.map(async u=>{if(done.has(u))return;done.add(u);try{let r=await get(u);let a=assets.get(u);a.data=r.data;a.type=r.type;if(a.local.endsWith('.css')){for(let v of discover(r.data.toString(),u)){if(/\.(woff2?|ttf|otf|png|jpe?g|svg|webp)(\?|$)/i.test(v)||new URL(v).hostname==='fonts.googleapis.com'){asset(v);if(!done.has(clean(v)))pending.push(clean(v))}}}}catch(e){failures.push({url:u,error:e.message});assets.get(u).failed=true}}));console.log('Assets',done.size,'remaining',pending.length)}
function rewrite(text,base){for(const u of discover(text,base)){const key=clean(u);const a=assets.get(key);const p=pages.get(key);const target=a&&!a.failed?a.local:p?p.local.replace(/index\.html$/,''):null;if(target){text=text.split(u).join(target).split(u.replaceAll('&','&amp;')).join(target);const relative=new URL(u).origin===new URL(base).origin?new URL(u).pathname+new URL(u).search:null;if(relative)text=text.replaceAll('"'+relative+'"','"'+target+'"').replaceAll("'"+relative+"'","'"+target+"'")}}return text}
for(const [u,p] of pages){let text=rewrite(p.text,u);text=text.replace(/<script[^>]*src=["'][^"']*(?:contact-form-7|swv)[^"']*["'][^>]*><\/script>/gi,'');text=text.replace('</body>','<script src="/clone-support.js"></script></body>');const dest=path.join(root,p.local);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,text)}
for(const [u,a] of assets){if(a.failed)continue;const dest=path.join(root,a.local);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,a.local.endsWith('.css')?rewrite(a.data.toString(),u):a.data)}
await fs.writeFile(prefix?prefix.slice(1)+'-report.json':'mirror-report.json',JSON.stringify({pages:[...pages.keys()],assets:assets.size,failures},null,2));
console.log(JSON.stringify({pages:pages.size,assets:assets.size,failures:failures.length}));
