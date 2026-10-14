import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const project=path.resolve(import.meta.dirname,'..');
const root=path.join(project,process.env.OUTPUT_DIR||'dist');
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);files.push(...(entry.isDirectory()?await walk(file):[file]))}return files}
const files=await walk(root);const htmlFiles=files.filter(file=>file.endsWith('.html'));
const failures=[];const cssFiles=new Set();
async function checkReference(raw,file,base){
  if(!raw||/^(?:data:|https?:|mailto:|tel:|#|\/\/)/i.test(raw))return;
  let target=raw.split('#')[0].split('?')[0];if(!target)return;
  if(target.startsWith(base)&&base!=='/')target=target.slice(base.length-1);
  const resolved=target.startsWith('/')?path.join(root,decodeURIComponent(target)):path.resolve(path.dirname(file),decodeURIComponent(target));
  try{const stat=await fs.stat(resolved);if(stat.isDirectory())await fs.stat(path.join(resolved,'index.html'));if(resolved.endsWith('.css'))cssFiles.add(resolved)}catch{failures.push({file:path.relative(root,file),reference:raw})}
}
for(const file of htmlFiles){
  const html=await fs.readFile(file,'utf8');const base=html.match(/name="site-base" content="([^"]+)"/)?.[1]||'/';
  if(html.includes('<!-- include:'))failures.push({file:path.relative(root,file),reference:'Unresolved partial'});
  for(const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g))await checkReference(match[1],file,base);
}
const base=(await fs.readFile(path.join(root,'index.html'),'utf8')).match(/name="site-base" content="([^"]+)"/)?.[1]||'/';
for(const file of cssFiles){const css=await fs.readFile(file,'utf8');for(const match of css.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g))await checkReference(match[1],file,base)}
for(const file of ['scripts/build.mjs','server.mjs','src/assets/scripts/frontend.js','src/assets/scripts/chat.js']){
  const result=spawnSync(process.execPath,['--check',path.join(project,file)],{encoding:'utf8'});
  if(result.status!==0)failures.push({file,error:result.stderr});
}
const unique=[...new Map(failures.map(f=>[JSON.stringify(f),f])).values()];
console.log(JSON.stringify({pages:htmlFiles.length,stylesheets:cssFiles.size,basePath:base,failures:unique},null,2));
if(unique.length)process.exitCode=1;
