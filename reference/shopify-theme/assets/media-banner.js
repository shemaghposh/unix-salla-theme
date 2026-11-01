(()=>{let t=e=>{let a,r=(a=document.currentScript?document.currentScript.parentElement:e).querySelectorAll(".media-banner__collections-item");a.querySelector(".media-banner__collections");r.forEach(t=>{t.addEventListener("mouseover",e=>{r.forEach(e=>{e.classList.add("media-banner__collections-item--opacity")}),t.classList.remove("media-banner__collections-item--opacity"),t.addEventListener("mouseout",()=>{r.forEach(e=>{e.classList.remove("media-banner__collections-item--opacity")})})})});e=a.querySelector(".banner__marquee");if(e){let r=575<document.documentElement.clientWidth?7e3*e.getAttribute("data-ticker-speed"):3e3*e.getAttribute("data-ticker-speed");if(!e.querySelector(".js-marquee-wrapper")){e.classList.add("marquee");let t=$(e);t.marquee({delayBeforeStart:0,direction:"left",allowCss3Support:!0,startVisible:!0,duration:r,gap:0}),new ResizeObserver(e=>{var[,]=e;t.marquee("destroy"),t.marquee({delayBeforeStart:0,direction:"left",allowCss3Support:!0,startVisible:!0,duration:r,gap:0})}).observe(a)}}};t(),document.addEventListener("shopify:section:load",function(e){t(e.target)});

/* ============================================================
   Premium hero: content animations + scroll indicator
   - IntersectionObserver only, no external libraries
   - Respects prefers-reduced-motion
   ============================================================ */
var initPremiumHero=function(root){
  var scope=root&&root.querySelectorAll?root:document;

  /* Content animation */
  scope.querySelectorAll("[data-hero-animate]").forEach(function(el){
    if(el.dataset.heroAnimateInit)return;
    el.dataset.heroAnimateInit="1";
    var blocks=el.querySelectorAll(".media-banner__block");
    if(el.hasAttribute("data-hero-stagger")){
      blocks.forEach(function(b,i){b.style.transitionDelay=(i*90)+"ms"});
    }
    var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced||!("IntersectionObserver" in window)){
      el.classList.add("is-inview");
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          el.classList.add("is-inview");
          io.disconnect();
        }
      });
    },{threshold:.15});
    io.observe(el);
  });

  /* Scroll indicator */
  scope.querySelectorAll("[data-scroll-indicator]").forEach(function(btn){
    if(btn.dataset.scrollIndicatorInit)return;
    btn.dataset.scrollIndicatorInit="1";
    var onScroll=function(){
      if(window.scrollY>60){
        btn.classList.add("is-hidden");
        window.removeEventListener("scroll",onScroll);
      }
    };
    window.addEventListener("scroll",onScroll,{passive:!0});
    btn.addEventListener("click",function(){
      var section=btn.closest(".shopify-section");
      var next=section?section.nextElementSibling:null;
      var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if(next){next.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"})}
    });
  });
};
initPremiumHero();
document.addEventListener("shopify:section:load",function(e){initPremiumHero(e.target)});})();