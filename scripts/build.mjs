import fs from 'node:fs/promises';
import path from 'node:path';
const project=path.resolve(import.meta.dirname,'..');
const source=path.join(project,'src');
const output=path.join(project,process.env.OUTPUT_DIR||'dist');
const siteOrigin='https://puredivineenergy.com';
const pageDescriptions={
  '/':'Pure Divine Energy Healing Centre in Jaipur offers Reiki learning, spiritual guidance and supportive wellness sessions with Jyotsana Jain.',
  '/about/':'Learn about Pure Divine Energy Healing Centre, Jyotsana Jain and the centre’s approach to Reiki learning and spiritual guidance in Jaipur.',
  '/services/':'Explore Reiki healing, chakra balancing, spiritual guidance and distance-support services from Pure Divine Energy in Jaipur.',
  '/courses/':'Explore Reiki and energy-healing courses from Pure Divine Energy, from foundational learning to advanced practice.',
  '/contact/':'Contact Pure Divine Energy Healing Centre in Jaipur for guidance about services, courses and session enquiries.',
  '/book-session/':'Send a session enquiry to Pure Divine Energy Healing Centre and share the support or course guidance you are looking for.',
  '/faq/':'Find clear answers about Pure Divine Energy services, courses, enquiries and learning paths.',
  '/learn/':'Browse published Reiki and energy-healing learning paths from Pure Divine Energy.',
  '/privacy-policy/':'Read the Pure Divine Energy privacy policy.',
  '/terms-conditions/':'Read the Pure Divine Energy terms and conditions.',
  '/refund-policy/':'Read the Pure Divine Energy refund policy.',
  '/disclaimer/':'Read the Pure Divine Energy wellness and website disclaimer.'
};
const courseData={
  '/learn/package/reiki-level-1/':{name:'Reiki Level 1',price:'5111',description:'Begin your Reiki journey with essential healing principles, self-practice and spiritual awareness.'},
  '/learn/package/reiki-level-2/':{name:'Reiki Level 2',price:'7111',description:'Deepen your Reiki study through symbols, distance healing and more confident practice.'},
  '/learn/package/reiki-level-3-and-master-teacher-level-4/':{name:'Reiki Level 3 and Master Teacher Level 4',price:'15111',description:'Move into advanced Reiki practice and the teacher path.'},
  '/learn/package/ricky-grandmaster-full-course/':{name:'Reiki Grandmaster Full Course',price:'21511',description:'Explore a complete advanced learning path for deeper Reiki study and continued practice.'},
  '/learn/package/basic-colour-prana-healing-course/':{name:'Basic Colour Prana Healing',price:'7111',description:'Explore colour vibration, pranic principles and simple approaches to energy awareness.'},
  '/learn/package/advance-prana-energy/':{name:'Advanced Prana Energy',price:'9999',description:'Develop a deeper understanding of pranic techniques and refined energy practice.'}
};
const noIndexRoutes=['/author/','/category/','/verify/','/learn/checkout/','/blog/page/'];
const escapeAttribute=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const stripTags=value=>String(value).replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code))).replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const faqMarkup=html=>{
  const mainEntity=[...html.matchAll(/<details\b[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)].map(([,question,answer])=>({
    '@type':'Question',
    name:stripTags(question),
    acceptedAnswer:{'@type':'Answer',text:stripTags(answer)}
  })).filter(item=>item.name&&item.acceptedAnswer.text);
  return mainEntity.length?{'@context':'https://schema.org','@type':'FAQPage',mainEntity}:null;
};
function seoMarkup(html,route){
  const title=stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'Pure Divine Energy');
  const canonical=`${siteOrigin}${route}`;
  const noIndex=noIndexRoutes.some(prefix=>route.startsWith(prefix));
  const derived=`Explore ${title.replace(/\s*[–-]\s*Pure Divine Energy\s*$/i,'')} with Pure Divine Energy Healing Centre in Jaipur.`;
  const description=pageDescriptions[route]||derived;
  const additions=[];
  if(!/<meta\s+name=["']description["']/i.test(html))additions.push(`<meta name="description" content="${escapeAttribute(description)}">`);
  if(!/<link\s+rel=["']canonical["']/i.test(html)&&!noIndex)additions.push(`<link rel="canonical" href="${canonical}">`);
  if(noIndex&&!/<meta\s+name=["']robots["']/i.test(html))additions.push('<meta name="robots" content="noindex,follow">');
  if(!/<meta\s+property=["']og:title["']/i.test(html)){
    additions.push(`<meta property="og:title" content="${escapeAttribute(title)}">`);
    additions.push(`<meta property="og:description" content="${escapeAttribute(description)}">`);
    additions.push(`<meta property="og:type" content="${route==='/'?'website':'article'}">`);
    additions.push(`<meta property="og:url" content="${canonical}">`);
    additions.push(`<meta property="og:site_name" content="Pure Divine Energy">`);
    additions.push(`<meta property="og:image" content="${siteOrigin}/assets/pde/pure-divine-energy-logo.jpeg">`);
    additions.push('<meta name="twitter:card" content="summary_large_image">');
  }
  if(route==='/')additions.push(`<script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org',
    '@type':'LocalBusiness',
    name:'Pure Divine Energy Healing Centre',
    url:siteOrigin,
    image:`${siteOrigin}/assets/pde/pure-divine-energy-logo.jpeg`,
    telephone:'+917691011395',
    email:'hello@puredivineenergy.com',
    address:{'@type':'PostalAddress',streetAddress:'Bani Park',addressLocality:'Jaipur',addressRegion:'Rajasthan',addressCountry:'IN'}
  }).replace(/</g,'\\u003c')}</script>`);
  if(courseData[route]){
    const course=courseData[route];
    additions.push(`<script type="application/ld+json">${JSON.stringify({
      '@context':'https://schema.org',
      '@type':'Course',
      name:course.name,
      description:course.description,
      provider:{'@type':'Organization',name:'Pure Divine Energy Healing Centre',url:siteOrigin},
      offers:{'@type':'Offer',price:course.price,priceCurrency:'INR',url:canonical}
    }).replace(/</g,'\\u003c')}</script>`);
  }
  if(route==='/faq/'){
    const faq=faqMarkup(html);
    if(faq)additions.push(`<script type="application/ld+json">${JSON.stringify(faq).replace(/</g,'\\u003c')}</script>`);
  }
  return additions.join('\n');
}
if(!output.startsWith(project+path.sep)||output===source||output.startsWith(source+path.sep))throw Error('Output must be a separate directory inside this project.');
const baseFlag=process.argv.indexOf('--base');
let base=baseFlag>=0?process.argv[baseFlag+1]:process.env.BASE_PATH||'/';
if(!base||!/^\/[a-zA-Z0-9_./-]*\/$|^\/$/.test(base)||base.split('/').some(part=>part==='.'||part==='..')||base.includes('//'))throw Error('Use a base path such as / or /repository-name/.');
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){let file=path.join(dir,entry.name);files.push(...(entry.isDirectory()?await walk(file):[file]))}return files}
function prefixPaths(text){if(base==='/')return text;return text.replace(/((?:href|src|action|poster)\s*=\s*["'])\/(?!\/)/gi,`$1${base}`).replace(/(url\(\s*["']?)\/(?!\/)/gi,`$1${base}`)}
await fs.mkdir(output,{recursive:true});
// Always copy from authoritative src; builds never edit the source.
await fs.cp(path.join(source,'assets'),path.join(output,'assets'),{recursive:true});
// GitHub Pages reads this file to keep the configured custom domain on every deploy.
try{await fs.copyFile(path.join(source,'CNAME'),path.join(output,'CNAME'))}catch(error){if(error.code!=='ENOENT')throw error}
for(const file of ['robots.txt','sitemap.xml']){
  try{await fs.copyFile(path.join(source,file),path.join(output,file))}catch(error){if(error.code!=='ENOENT')throw error}
}
const files=await walk(path.join(source,'pages'));
for(const file of files){if(!file.endsWith('.html'))continue;
  let html=await fs.readFile(file,'utf8');
  const includes=[...html.matchAll(/<!-- include:([a-zA-Z0-9.-]+) -->/g)];
  for(const include of includes){html=html.replace(include[0],await fs.readFile(path.join(source,'partials',include[1]),'utf8'))}
  const relative=path.relative(path.join(source,'pages'),file);
  const route='/'+relative.split(path.sep).join('/').replace(/index\.html$/,'');
  // The refreshed catalogue is now the single public Courses experience. Keep
  // the archived source markup available for rollback, but exclude it from the
  // generated production page so it cannot create duplicate content.
  if(route==='/courses/')html=html.replace(/\s*<section class="pde-courses-hero">[\s\S]*?<\/main>/,'\n</main>');
  // The archived WordPress comment endpoint does not exist on this static
  // deployment. Remove that unusable interface and its archive links from the
  // generated site rather than presenting visitors with a broken form.
  html=html.replace(/\s*<section class="pde-section pde-comments-section">[\s\S]*?<\/section>/g,'');
  html=html.replace(/\s*<span class="comments-link">[\s\S]*?<\/span>/g,'');
  html=html.replace(/(<a\b[^>]*href=["'])([^"']+)(["'][^>]*)(>)/gi,(all,start,href,attrs,end)=>{
    if(href===route&&/menu-link|nav-link/.test(attrs))return `${start}${href}${attrs} aria-current="page"${end}`;
    return all;
  });
  html=html.replace(/(<li\b[^>]*class=")([^"]*)("[^>]*>\s*<a\b[^>]*aria-current="page"[^>]*>)/gi,'$1$2 current-menu-item$3');
  // Keep the shared interaction bundle fresh after each visual update without
  // requiring visitors to manually clear their browser cache.
  html=html.replace(/src=(["'])\/assets\/scripts\/frontend\.js(?:\?[^"']*)?\1/gi,'src="/assets/scripts/frontend.js?v=site-scroll-reveal-3"');
  html=html.replace('</head>',`${seoMarkup(html,route)}\n<meta name="site-base" content="${base}">\n</head>`);
  if(!html.includes('data-pde-tracking'))html=html.replace('</body>','<script type="module" src="/assets/scripts/tracking.js" data-pde-tracking></script>\n</body>');
  html=html.replace(/(<body\b[\s\S]*?<\/body>)/i,body=>body.split(/(<[^>]+>)/).map(part=>part.startsWith('<')?part:part.replaceAll('💫','<img class="emoji" draggable="false" role="img" alt="💫" src="/assets/icons/sparkle.svg">')).join(''));
  const destination=path.join(output,relative);
  await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,prefixPaths(html));
}
for(const file of await walk(path.join(output,'assets'))){if(file.endsWith('.css'))await fs.writeFile(file,prefixPaths(await fs.readFile(file,'utf8')))}
await fs.writeFile(path.join(output,'.nojekyll'),'');
console.log(`Built ${files.filter(f=>f.endsWith('.html')).length} pages in ${path.relative(project,output)} (base ${base}).`);
