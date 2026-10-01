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
  window.addEventListener('scroll',()=>{
    header.classList.toggle('scrolled',window.scrollY>30);
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

const businessCarousel=document.querySelector('.business-carousel');
if(businessCarousel){
  const imageRoot='Public/Images/';
  const items=[
    {name:'Bars',label:'BARS & LOUNGES',first:'Keep every',accent:'drink ice cold.',description:'Reliable ice supply for bars, lounges and entertainment venues that need consistently cold drinks.',image:'Focused Bartender Pouring Crystal Ice.png',alt:'Bartender pouring a drink over crystal ice',position:'63% center',mobilePosition:'43% center'},
    {name:'Restaurants',label:'RESTAURANTS',first:'Perfect ice',accent:'for every table.',description:'Keep beverages fresh and customers refreshed with dependable ice supply for restaurants and food-service businesses.',image:'Warm Restaurant Table with Iced Drinks.png',alt:'Iced drinks served at a restaurant table',position:'60% center',mobilePosition:'56% center'},
    {name:'Hotels',label:'HOTELS',first:'Cool service.',accent:'Happy guests.',description:'Reliable ice for hotel bars, restaurants, pools, events and everyday guest service.',image:'Poolside Ice Bucket Service.png',alt:'Poolside server carrying an ice bucket',position:'63% center',mobilePosition:'66% center'},
    {name:'Events',label:'EVENTS & CATERERS',first:'Keep every',accent:'occasion cool.',description:'Ice supply for events, catering operations, celebrations and large hospitality requirements.',image:'Industrial Ice Handling Scene.png',alt:'Worker handling a large block of ice',position:'62% center',mobilePosition:'38% center'},
    {name:'Retail',label:'RETAIL & SUPPLY',first:'Ice when your',accent:'customers need it.',description:'Dependable ice supply for retail outlets and businesses requiring regular stock.',image:'Scooping Crushed Ice in Blue Bins.png',alt:'Worker scooping crushed ice from blue bins',position:'63% center',mobilePosition:'55% center'},
    {name:'Corporate',label:'BULK ORDERS',first:'Reliable supply.',accent:'Delivered.',description:'Talk to Alliance about regular commercial deliveries and larger ice requirements for your business.',image:'Alliance Ice Cubes Delivery.png',alt:'Delivery worker with Alliance Ice Cubes bags',position:'64% center',mobilePosition:'65% center'}
  ];
  const slides=businessCarousel.querySelector('.business-slides');
  const content=businessCarousel.querySelector('.business-content');
  const nav=businessCarousel.querySelector('.business-nav');
  const progress=businessCarousel.querySelector('.business-progress span');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const businessLink='https://wa.me/254768668668?text=Hello%20Alliance%20Ice%20Cubes%2C%20I%27m%20interested%20in%20a%20business%20or%20bulk%20order.';
  let active=0,timer=0,started=0,remaining=4000,paused=false,transitioning=false,touchX=null;
  const slideEls=items.map((item,index)=>{
    const slide=document.createElement('div');slide.className='business-slide'+(index===0?' is-active':'');
    const img=document.createElement('img');img.alt=item.alt;img.src=imageRoot+encodeURIComponent(item.image);img.style.setProperty('--desktop-position',item.position);img.style.setProperty('--mobile-position',item.mobilePosition);
    img.loading=index<2?'eager':'lazy';if(index===0)img.fetchPriority='high';
    slide.append(img);slides.append(slide);return slide;
  });
  const navButtons=items.map((item,index)=>{
    const button=document.createElement('button');button.type='button';button.className='business-nav-item';button.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span><b>${item.name}</b>`;
    button.setAttribute('aria-label',`${String(index+1).padStart(2,'0')} ${item.label}`);
    button.addEventListener('click',()=>go(index));nav.append(button);return button;
  });
  function preload(index){slideEls[index].querySelector('img').loading='eager';}
  function render(index){
    const item=items[index];
    content.dataset.slide=String(index);
    content.innerHTML=`<div class="business-overline"><span>FOR BUSINESSES</span><span>${String(index+1).padStart(2,'0')} / 06</span></div><p class="business-label">${item.label}</p><h2>${item.first}<br><span>${item.accent}</span></h2><p class="business-description">${item.description}</p><a class="business-cta" href="${businessLink}">${index===5?'Request bulk supply':'Business & bulk orders'} <span aria-hidden="true">&#8594;</span></a>`;
    navButtons.forEach((button,i)=>{button.classList.toggle('is-active',i===index);button.setAttribute('aria-pressed',String(i===index));});
    businessCarousel.style.setProperty('--business-position',item.position);
  }
  function stopTimer(){if(timer)remaining=Math.max(0,remaining-(performance.now()-started));clearTimeout(timer);timer=0;progress.style.animationPlayState='paused';}
  function startTimer(reset=true){
    if(reduced.matches||paused||document.hidden)return;
    if(timer)clearTimeout(timer);
    if(reset){remaining=4000;progress.style.animation='none';progress.offsetWidth;progress.style.animation='business-fill 4s linear forwards';}
    progress.style.animationPlayState='running';started=performance.now();timer=setTimeout(()=>go((active+1)%items.length),remaining);
  }
  function go(index){
    index=(index+items.length)%items.length;
    if(index===active)return startTimer();
    if(transitioning)return;
    const nextImage=slideEls[index].querySelector('img');
    preload(index);
    if(!nextImage.complete){
      transitioning=true;stopTimer();
      nextImage.decode().catch(()=>{}).then(()=>{transitioning=false;go(index);});
      return;
    }
    stopTimer();preload(index);
    const old=active;active=index;transitioning=true;
    const outgoing=slideEls[old],incoming=slideEls[index];
    incoming.classList.remove('to-left','to-right','is-active');
    incoming.classList.add(index<old&&!(old===5&&index===0)?'to-left':'to-right');
    if(old===0&&index===5)incoming.classList.remove('to-right'),incoming.classList.add('to-left');
    content.classList.add('is-exiting');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      outgoing.classList.add(incoming.classList.contains('to-left')?'to-right':'to-left');outgoing.classList.remove('is-active');
      incoming.classList.remove('to-left','to-right');incoming.classList.add('is-active');
    }));
    setTimeout(()=>{render(index);content.classList.remove('is-exiting');content.classList.add('is-entering');requestAnimationFrame(()=>content.classList.remove('is-entering'));},reduced.matches?0:280);
    setTimeout(()=>{outgoing.classList.remove('to-left','to-right');transitioning=false;preload((active+1)%items.length);startTimer();},reduced.matches?50:950);
  }
  render(0);preload(1);startTimer();
  businessCarousel.querySelector('.business-prev').addEventListener('click',()=>go(active-1));
  businessCarousel.querySelector('.business-next').addEventListener('click',()=>go(active+1));
  businessCarousel.addEventListener('mouseenter',()=>{paused=true;stopTimer();});
  businessCarousel.addEventListener('mouseleave',()=>{paused=false;startTimer(false);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTimer();else startTimer(false);});
  businessCarousel.addEventListener('touchstart',event=>{touchX=event.changedTouches[0].clientX;},{passive:true});
  businessCarousel.addEventListener('touchend',event=>{if(touchX===null)return;const difference=event.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(difference)>45)go(active+(difference<0?1:-1));},{passive:true});
  businessCarousel.addEventListener('keydown',event=>{if(event.target!==businessCarousel)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(active+(event.key==='ArrowRight'?1:-1));}});
  reduced.addEventListener('change',()=>{stopTimer();startTimer();});
  const businessNavLinks=[...document.querySelectorAll('.desktop-nav a,.mobile-menu a')].filter(link=>link.getAttribute('href')==='business.html'||link.getAttribute('href')==='#business');
  const markBusinessNav=visible=>businessNavLinks.forEach(link=>{link.classList.toggle('business-current',visible);if(visible)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  if(location.pathname.endsWith('/business.html'))markBusinessNav(true);
  else if('IntersectionObserver' in window){
    const activeObserver=new IntersectionObserver(entries=>markBusinessNav(entries[0].isIntersecting),{threshold:.35});
    activeObserver.observe(document.getElementById('business'));
  }
}

