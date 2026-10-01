const header=document.getElementById('header');
const intro=document.getElementById('intro');
const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();
if(intro){
  const video=intro.querySelector('.intro-video');
  const pageParts=[document.querySelector('.skip-link'),header,document.getElementById('main'),document.querySelector('footer')].filter(Boolean);
  const finishIntro=()=>{
    if(!intro.isConnected||intro.classList.contains('is-final'))return;
    intro.classList.add('is-final');
    video?.pause();
    window.setTimeout(()=>{
      intro.classList.add('is-leaving');
      pageParts.forEach(part=>part.inert=false);
      window.setTimeout(()=>intro.remove(),500);
    },250);
  };
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){intro.remove();}
  else{
    pageParts.forEach(part=>part.inert=true);
    video.addEventListener('ended',finishIntro,{once:true});
    video.addEventListener('error',finishIntro,{once:true});
    video.play().catch(finishIntro);
    window.setTimeout(finishIntro,5000);
  }
}
document.querySelectorAll('.mobile-menu').forEach(menu=>{
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')menu.open=false;});
  document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
});
if(header){
  let lastScrollY=window.scrollY;
  window.addEventListener('scroll',()=>{
    const scrollY=Math.max(0,window.scrollY);
    header.classList.toggle('scrolled',scrollY>30);
    if(intro?.isConnected&&!intro.classList.contains('is-leaving'))return;
    if(scrollY<120||scrollY<lastScrollY-4){
      header.classList.remove('is-hidden');
      header.inert=false;
    }else if(scrollY>180&&scrollY>lastScrollY+4&&!header.contains(document.activeElement)){
      header.classList.add('is-hidden');
      header.inert=true;
    }
    if(Math.abs(scrollY-lastScrollY)>4)lastScrollY=scrollY;
  },{passive:true});
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}

const whySection=document.querySelector('.why-section');
if(whySection&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
  whySection.classList.add('why-ready');
  const whyObserver=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      whySection.classList.add('why-visible');
      whyObserver.disconnect();
    }
  },{threshold:.12});
  whyObserver.observe(whySection);
}

const showcaseCards=[...document.querySelectorAll('.showcase-card')];
if(showcaseCards.length){
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
  if(!reducedMotion.matches){
    document.querySelector('.showcase-grid')?.classList.add('showcase-ready');
    if('IntersectionObserver' in window){
      const cardObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('showcase-revealed');
          cardObserver.unobserve(entry.target);
        }
      }),{threshold:.12});
      showcaseCards.forEach((card,index)=>{
        card.style.setProperty('--reveal-delay',`${index*70}ms`);
        cardObserver.observe(card);
      });
    }else showcaseCards.forEach(card=>card.classList.add('showcase-revealed'));
  }
  showcaseCards.forEach(card=>{
    let frame=0;
    let pointerX=0;
    let pointerY=0;
    const update=()=>{
      frame=0;
      const bounds=card.getBoundingClientRect();
      const x=Math.max(-1,Math.min(1,(pointerX-bounds.left-bounds.width/2)/(bounds.width/2)));
      const y=Math.max(-1,Math.min(1,(pointerY-bounds.top-bounds.height/2)/(bounds.height/2)));
      card.style.setProperty('--tilt-x',`${(-y*5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y',`${(x*5).toFixed(2)}deg`);
      card.style.setProperty('--image-x',`${(-x*8).toFixed(1)}px`);
      card.style.setProperty('--image-y',`${(-y*8).toFixed(1)}px`);
      card.style.setProperty('--mouse-x',`${((x+1)*50).toFixed(1)}%`);
      card.style.setProperty('--mouse-y',`${((y+1)*50).toFixed(1)}%`);
    };
    card.addEventListener('pointermove',event=>{
      if(!finePointer.matches||reducedMotion.matches)return;
      pointerX=event.clientX;
      pointerY=event.clientY;
      if(!frame)frame=requestAnimationFrame(update);
    });
    card.addEventListener('pointerleave',()=>{
      if(frame){cancelAnimationFrame(frame);frame=0;}
      card.style.setProperty('--tilt-x','0deg');
      card.style.setProperty('--tilt-y','0deg');
      card.style.setProperty('--image-x','0px');
      card.style.setProperty('--image-y','0px');
      card.style.setProperty('--mouse-x','50%');
      card.style.setProperty('--mouse-y','50%');
    });
  });
}
