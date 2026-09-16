const DEFAULT_PRODUCTS=[
 {name:"SERFORTX ULTIMATE",price:309,category:"SETTING",description:"Gaming optimization package"},
 {name:"SERFORTX RESHADE",price:399,category:"RESHADE",description:"Custom ReShade preset"},
 {name:"SERFORTX WINDOWS",price:509,category:"WINDOWS",description:"Gaming Windows setup"},
 {name:"SERFORTX NETWORK",price:309,category:"NETWORK",description:"Network and latency tuning"}
];

async function getProducts(){
 try{
  const r=await fetch("products.json");
  if(r.ok)return await r.json();
 }catch(e){}
 return DEFAULT_PRODUCTS;
}
function card(p){
 return `<article class="product">
  <div class="category">${p.category||"PRODUCT"}</div>
  <div class="glow"></div>
  <h3>${safe(p.name)}</h3>
  <p>${safe(p.description||"Premium gaming setup product")}</p>
  <div class="price">฿${Number(p.price||0).toLocaleString()}</div>
  <button onclick="buy('${safeAttr(p.name)}')">BUY NOW</button>
 </article>`;
}
function safe(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function safeAttr(s){return String(s).replaceAll("'","\\'")}
function buy(name){alert("ตัวอย่าง Order: "+name+"\\n\\nขั้นต่อไปสามารถเชื่อม Payment + Order API ได้")}
async function renderProducts(){
  const products=document.getElementById("products");
  products.innerHTML=(await getProducts()).map(card).join("");

  [...products.children].forEach((el,i)=>{
    el.classList.add("reveal");
    el.style.transitionDelay=(i*90)+"ms";

    el.addEventListener("pointermove",(e)=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");
      el.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");
    });
    el.addEventListener("pointerleave",()=>{
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    });
  });
}

function setupStarfield(){
  const field=document.getElementById("starfield");
  if(!field) return;
  field.innerHTML="";
  const count=Math.min(170,Math.max(95,Math.floor(window.innerWidth/11)));
  const fragment=document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const star=document.createElement("span");
    const cross=Math.random()<0.12;
    star.className=cross?"star cross":"star";
    star.style.left=(Math.random()*100).toFixed(3)+"%";
    star.style.top=(Math.random()*100).toFixed(3)+"%";
    star.style.setProperty("--size",(Math.random()*1.45+.45).toFixed(2)+"px");
    star.style.setProperty("--duration",(Math.random()*4.8+3.2).toFixed(2)+"s");
    star.style.setProperty("--delay",(-Math.random()*8).toFixed(2)+"s");
    star.style.setProperty("--peak",(Math.random()*.55+.35).toFixed(2));
    if(cross){
      star.style.setProperty("--flash-duration",(Math.random()*2.5+2.5).toFixed(2)+"s");
      star.style.setProperty("--flash-delay",(-Math.random()*5).toFixed(2)+"s");
    }
    fragment.appendChild(star);
  }
  field.appendChild(fragment);
}



function setupHeroLogoTilt(){
  const logo=document.querySelector('.hero-logo img');
  const hero=document.querySelector('.hero');
  if(!logo || !hero) return;

  let targetX=0, targetY=0;
  let currentX=0, currentY=0;
  let raf=null;

  function render(){
    currentX += (targetX-currentX)*0.10;
    currentY += (targetY-currentY)*0.10;
    logo.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(18px)`;

    if(Math.abs(targetX-currentX)>0.02 || Math.abs(targetY-currentY)>0.02){
      raf=requestAnimationFrame(render);
    }else{
      raf=null;
    }
  }

  function move(e){
    const r=hero.getBoundingClientRect();
    // Clamp the mouse position so the tilt remains stable at the edges.
    const x=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-0.5)*2));
    const y=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-0.5)*2));

    // Increase these numbers for stronger movement.
    targetX=x*24;
    targetY=-y*18;

    logo.classList.add('mouse-tilt-active');
    if(!raf) raf=requestAnimationFrame(render);
  }

  function reset(){
    targetX=0;
    targetY=0;
    logo.classList.remove('mouse-tilt-active');
    if(!raf) raf=requestAnimationFrame(render);
  }

  // Listen on the whole hero, not the logo itself, so the effect works reliably.
  hero.addEventListener('mousemove',move);
  hero.addEventListener('mouseleave',reset);

  // Start the animation loop immediately so the logo always has a valid transform.
  render();
}

function setupAnimations(){
  const header=document.querySelector("header");
  const revealItems=document.querySelectorAll(".reveal, .reveal-section");

  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -40px 0px"});

  revealItems.forEach(el=>observer.observe(el));

  const onScroll=()=>{
    if(header) header.classList.toggle("scrolled",window.scrollY>18);
  };
  window.addEventListener("scroll",onScroll,{passive:true});
  onScroll();
}

(async()=>{
  setupStarfield();
  setupHeroLogoTilt();
  await renderProducts();
  setupAnimations();
})();