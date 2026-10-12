for(const u of ['https://puredivineenergy.com/','https://course.puredivineenergy.com/','https://verify.puredivineenergy.com/']){
try{let r=await fetch(u,{signal:AbortSignal.timeout(20000)});let t=await r.text();console.log(u,r.status);if(u==='https://puredivineenergy.com/')console.log(t.match(/<script[\s\S]*?<\/script>/g)?.filter(s=>s.includes('pde')||s.includes('ajax')).join('\n'));else console.log(t.slice(0,800))}catch(e){console.log(u,e.message)}
}
