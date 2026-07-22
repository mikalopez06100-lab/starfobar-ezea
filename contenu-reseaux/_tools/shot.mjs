import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'url';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'shell',args:['--no-sandbox','--hide-scrollbars']});
const p=await b.newPage();
await p.setViewport({width:1200,height:1000,deviceScaleFactor:1.4});
await p.goto(pathToFileURL('C:/Users/ppmpc/starfobar/proposition.html').href,{waitUntil:'networkidle0',timeout:60000});
try{await p.evaluate(()=>document.fonts.ready);}catch{}
await new Promise(r=>setTimeout(r,500));
const el=await p.$('.vp-section');
await el.screenshot({path:'C:/Users/ppmpc/AppData/Local/Temp/claude/C--Users-ppmpc-starfobar/1941e225-4461-4a8d-888c-442ba0c2937c/scratchpad/vp2.png'});
await b.close();console.log('ok');
