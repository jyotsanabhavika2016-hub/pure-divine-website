// One-time migration of the existing authorized public-page recovery.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const project=path.resolve(import.meta.dirname,'..');
const source=path.join(project,'src');
const output=path.join(project,'dist');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex').slice(0,12);
const partials=new Map();
const styles=new Map();
async function walk(dir){const result=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);result.push(...(entry.isDirectory()?await walk(file):[file]))}return result}
await fs.mkdir(path.join(source,'pages'),{recursive:true});
await fs.mkdir(path.join(source,'partials'),{recursive:true});
for(const name of await fs.readdir(path.join(source,'partials'))){if(/^(header|footer)-[a-f0-9]{12}\.html$/.test(name))await fs.unlink(path.join(source,'partials',name))}
await fs.cp(path.join(output,'assets'),path.join(source,'assets'),{recursive:true});
await fs.mkdir(path.join(source,'assets','styles'),{recursive:true});
for(const file of await walk(output)){
  if(!file.endsWith('.html'))continue;
  let html=await fs.readFile(file,'utf8');
  html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
  html=html.replace(/<link[^>]*(?:rel=["'](?:https:\/\/api\.w\.org\/|EditURI|pingback|alternate)["'])[^>]*>/gi,'');
  html=html.replace(/\sclass=["']([^"']*)["']/gi,(_,classes)=>` class="${classes.split(/\s+/).filter(c=>!/^current[-_]|^page_item$|^page-item-\d+$/.test(c)).join(' ')}"`);
  html=html.replace(/\saria-current=["']page["']/g,'');
  for(const tag of ['header','footer']){
    html=html.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`,'gi'),markup=>{
      if(tag==='header'&&!/^<header\b[^>]*class="(?:pde-site-header|site-header|header)"/i.test(markup))return markup;
      const name=`${tag}-${hash(markup)}.html`;
      // Writes are awaited after collection below.
      partials.set(name,markup);
      return `<!-- include:${name} -->`;
    });
  }
  html=html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi,(_,attrs,css)=>{
    const name=`inline-${hash(css)}.css`;
    styles.set(name,css);
    return `<link rel="stylesheet" href="/assets/styles/${name}">`;
  });
  html=html.replace('</head>','<link rel="stylesheet" href="/assets/styles/frontend.css">\n</head>');
  html=html.replace('</body>','<script type="module" src="/assets/scripts/frontend.js"></script>\n<script type="module" src="/assets/scripts/chat.js"></script>\n</body>');
  const destination=path.join(source,'pages',path.relative(output,file));
  await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.writeFile(destination,html);
}
for(const [name,markup] of partials)await fs.writeFile(path.join(source,'partials',name),markup);
for(const [name,css] of styles)await fs.writeFile(path.join(source,'assets','styles',name),css);
console.log(`Extracted ${partials.size} reusable headers/footers and ${styles.size} shared style files.`);
