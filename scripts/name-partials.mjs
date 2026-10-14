import fs from 'node:fs/promises';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..','src');
const names={
  'header-b3d7b5abafc7.html':'site-header.html',
  'footer-3e8b41f0baea.html':'site-footer.html',
  'header-1f61011ea210.html':'courses-header.html',
  'footer-0452096b9a1d.html':'courses-footer.html',
  'header-1f22b0d0c4d2.html':'verification-header.html',
  'header-4e3ee96e1f15.html':'verification-admin-header.html',
  'footer-ccb3b6e7a373.html':'verification-footer.html'
};
for(const [oldName,newName] of Object.entries(names)){try{await fs.rename(path.join(root,'partials',oldName),path.join(root,'partials',newName))}catch(error){if(error.code!=='ENOENT')throw error}}
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(file.endsWith('.html')){let html=await fs.readFile(file,'utf8');for(const [oldName,newName] of Object.entries(names))html=html.replaceAll('include:'+oldName,'include:'+newName);await fs.writeFile(file,html)}}}await walk(path.join(root,'pages'));
