import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
async function files(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);out.push(...(e.isDirectory()?await files(p):[p]))}return out}
const reports=await Promise.all(['mirror-report.json','learn-report.json','verify-report.json'].map(async f=>JSON.parse(await fs.readFile(f,'utf8'))));
for(const f of await files(root)){if(!f.endsWith('.html'))continue;let t=await fs.readFile(f,'utf8');
t=t.replace(/<script[^>]*id=["']pde-chat-widget-js-js[^"']*["'][^>]*>[\s\S]*?<\/script>/gi,'');
t=t.replace(/<script[^>]*id=["']puredivine-header-script-js-after["'][^>]*>[\s\S]*?<\/script>/gi,'');
t=t.replace('</body>','<script src="/clone-chat.js"></script></body>');
for(const [origin,prefix,report] of [['https://puredivineenergy.com','',reports[0]],['https://course.puredivineenergy.com','/learn',reports[1]],['https://verify.puredivineenergy.com','/verify',reports[2]]]){for(const url of [...report.pages].sort((a,b)=>b.length-a.length)){const p=new URL(url).pathname;const dest=prefix+p+(p.endsWith('/')?'':'/');t=t.split(url).join(dest)}}
t=t.replace(/<input[^>]*name=["']_token["'][^>]*>/g,'');
await fs.writeFile(f,t);
}
// Convert URL-encoded article directory names to filesystem Unicode names.
for(const e of await fs.readdir(root,{withFileTypes:true})){if(e.isDirectory()&&e.name.includes('%')){const dest=path.join(root,decodeURIComponent(e.name));try{await fs.rename(path.join(root,e.name),dest)}catch{}}}
console.log(JSON.stringify(reports.map(r=>({pages:r.pages.length,assets:r.assets,failures:r.failures})),null,2));
