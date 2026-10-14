import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,process.env.OUTPUT_DIR||'dist');
const port=Number(process.env.PORT||4173);
const homepage=await fs.readFile(path.join(root,'index.html'),'utf8');
const base=homepage.match(/name="site-base" content="([^"]+)"/)?.[1]||'/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');let pathname=decodeURIComponent(url.pathname);
    if(base!=='/'){if(!pathname.startsWith(base)){res.writeHead(404);res.end('Page not found');return}pathname=pathname.slice(base.length-1)}
    let file=path.resolve(root,'.'+pathname);
    if((!file.startsWith(root+path.sep)&&file!==root)||pathname.split('/').some(part=>part.startsWith('.')&&part!=='.nojekyll'))throw Error('Invalid path');
    if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
    const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
  }catch{res.writeHead(404);res.end('Page not found')}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${base}`));
