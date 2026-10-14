import fs from 'node:fs/promises';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..','src');
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(file.endsWith('.html')){let html=await fs.readFile(file,'utf8');html=html.replaceAll('/assets/24eb5276a87ddb9baa0e.css','/assets/ad7cb860415d8a38a8bc.css').replaceAll('/assets/21db63d9c8a7294ffbea.css','/assets/de63b02cdf55d44a63e5.css');await fs.writeFile(file,html)}}}await walk(root);
