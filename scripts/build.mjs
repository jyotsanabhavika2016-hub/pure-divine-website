import fs from 'node:fs/promises';
import path from 'node:path';
const project=path.resolve(import.meta.dirname,'..');
const source=path.join(project,'src');
const output=path.join(project,process.env.OUTPUT_DIR||'dist');
if(!output.startsWith(project+path.sep)||output===source||output.startsWith(source+path.sep))throw Error('Output must be a separate directory inside this project.');
const baseFlag=process.argv.indexOf('--base');
let base=baseFlag>=0?process.argv[baseFlag+1]:process.env.BASE_PATH||'/';
if(!base||!/^\/[a-zA-Z0-9_./-]*\/$|^\/$/.test(base)||base.split('/').some(part=>part==='.'||part==='..')||base.includes('//'))throw Error('Use a base path such as / or /repository-name/.');
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){let file=path.join(dir,entry.name);files.push(...(entry.isDirectory()?await walk(file):[file]))}return files}
function prefixPaths(text){if(base==='/')return text;return text.replace(/((?:href|src|action|poster)\s*=\s*["'])\/(?!\/)/gi,`$1${base}`).replace(/(url\(\s*["']?)\/(?!\/)/gi,`$1${base}`)}
await fs.mkdir(output,{recursive:true});
// Always copy from authoritative src; builds never edit the source.
await fs.cp(path.join(source,'assets'),path.join(output,'assets'),{recursive:true});
const files=await walk(path.join(source,'pages'));
for(const file of files){if(!file.endsWith('.html'))continue;
  let html=await fs.readFile(file,'utf8');
  const includes=[...html.matchAll(/<!-- include:([a-zA-Z0-9.-]+) -->/g)];
  for(const include of includes){html=html.replace(include[0],await fs.readFile(path.join(source,'partials',include[1]),'utf8'))}
  const relative=path.relative(path.join(source,'pages'),file);
  const route='/'+relative.split(path.sep).join('/').replace(/index\.html$/,'');
  html=html.replace(/(<a\b[^>]*href=["'])([^"']+)(["'][^>]*)(>)/gi,(all,start,href,attrs,end)=>{
    if(href===route&&/menu-link|nav-link/.test(attrs))return `${start}${href}${attrs} aria-current="page"${end}`;
    return all;
  });
  html=html.replace(/(<li\b[^>]*class=")([^"]*)("[^>]*>\s*<a\b[^>]*aria-current="page"[^>]*>)/gi,'$1$2 current-menu-item$3');
  html=html.replace('</head>',`<meta name="site-base" content="${base}">\n</head>`);
  html=html.replace(/(<body\b[\s\S]*?<\/body>)/i,body=>body.split(/(<[^>]+>)/).map(part=>part.startsWith('<')?part:part.replaceAll('💫','<img class="emoji" draggable="false" role="img" alt="💫" src="/assets/icons/sparkle.svg">')).join(''));
  const destination=path.join(output,relative);
  await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,prefixPaths(html));
}
for(const file of await walk(path.join(output,'assets'))){if(file.endsWith('.css'))await fs.writeFile(file,prefixPaths(await fs.readFile(file,'utf8')))}
await fs.writeFile(path.join(output,'.nojekyll'),'');
console.log(`Built ${files.filter(f=>f.endsWith('.html')).length} pages in ${path.relative(project,output)} (base ${base}).`);
