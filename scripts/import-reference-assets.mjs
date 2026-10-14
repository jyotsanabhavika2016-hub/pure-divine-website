// Import browser-observed public stylesheet assets and their font references.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const project=path.resolve(import.meta.dirname,'..');
const assets=path.join(project,'src','assets');
const manifest=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
const localPath=url=>'/assets/'+crypto.createHash('sha256').update(url).digest('hex').slice(0,20)+(path.extname(new URL(url).pathname)||'.css');
const downloaded=new Map();
async function download(url){
  if(!downloaded.has(url))downloaded.set(url,(async()=>{const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(url+' '+response.status);const target=localPath(url);await fs.writeFile(path.join(assets,path.basename(target)),Buffer.from(await response.arrayBuffer()));return target})());
  return downloaded.get(url);
}
for(const asset of manifest.assets){
  if(asset.kind!=='stylesheet')continue;
  let css=await fs.readFile(asset.path,'utf8');
  const urls=[...new Set([...css.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)].map(match=>match[1]).filter(url=>!url.startsWith('data:')&&!url.startsWith('#')))];
  for(let offset=0;offset<urls.length;offset+=6){await Promise.all(urls.slice(offset,offset+6).map(async raw=>{const url=new URL(raw,asset.url).href;const local=await download(url);css=css.split(raw).join(local)}))}
  await fs.writeFile(path.join(assets,path.basename(localPath(asset.url))),css);
}
await fs.mkdir(path.join(assets,'icons'),{recursive:true});
const emojiUrl='https://s.w.org/images/core/emoji/17.0.2/svg/1f4ab.svg';
const emoji=await fetch(emojiUrl);if(!emoji.ok)throw Error('Could not retrieve observed sparkle icon.');
await fs.writeFile(path.join(assets,'icons','sparkle.svg'),await emoji.text());
await fs.writeFile(path.join(project,'REFERENCE-ASSETS.json'),JSON.stringify({source:'https://puredivineenergy.com/',retrieved:'2026-10-13',stylesheets:manifest.assets.map(a=>({url:a.url,local:localPath(a.url)})),fontsAndImages:[...downloaded.keys()],emoji:emojiUrl},null,2));
console.log(`Imported ${manifest.assets.length} browser-delivered stylesheets and ${downloaded.size} referenced files.`);
