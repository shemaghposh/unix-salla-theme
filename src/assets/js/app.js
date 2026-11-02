import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";
import initAnnouncement from "./partials/unix-announcement";
import initHeader from "./partials/unix-header";
import initMenuDrawer from "./partials/unix-drawer";
import initFooter from "./partials/unix-footer";
import initCartDrawer from "./partials/unix-cart-drawer"; // ROADMAP 4.3 (DS §8.33)

/**
 * ROADMAP 6.2: SweetAlert2 (~75KB min, about two thirds of the old app.js) is only needed when Salla
 * shows a notification, so it loads on the first one instead of on every page (docs/PERFORMANCE.md §4).
 * The module promise is cached: later notifications reuse it. A failed chunk load is not cached, so the
 * next notification tries again.
 */
let swalModule = null;
const loadSwal = () => {
  if (!swalModule) {
    swalModule = import(/* webpackChunkName: "sweetalert2" */ 'sweetalert2')
      .then(({ default: Swal }) => Swal)
      .catch((error) => {
        swalModule = null;
        throw error;
      });
  }
  return swalModule;
};

/**
 * DS §10 (Notifications): if SweetAlert2 can't load, errors and confirmation dialogs fall back to the
 * browser dialog; success/info toasts may be dropped (logged only). Markup is reduced to plain text with
 * DOMParser, which neither runs scripts nor loads images.
 */
const toPlainText = (value) => {
  if (value === undefined || value === null) return '';
  return new DOMParser().parseFromString(String(value), 'text/html').body.textContent.trim();
};

const fallbackNotify = (message, type) => {
  const isObject = message && typeof message === 'object';
  const text = isObject
    ? [message.title, message.text || message.html].map(toPlainText).filter(Boolean).join('\n')
    : toPlainText(message);

  if (isObject) {
    if (text) window.alert(text);
    // Same shape as a confirmed Swal result, so `.then(type)` callers carry on as if accepted
    return { isConfirmed: true, isDismissed: false };
  }
  if (text && type === 'error') {
    window.alert(text);
    return;
  }
  salla.log(`Notification (${type}): ${text}`);
};

/**
 * Warm the SweetAlert2 chunk once the page is idle after `load`, so the first notification doesn't
 * wait on the network. It stays off the critical path; a failure here is ignored (the notifier retries).
 */
const warmSwal = () => {
  const run = () => loadSwal().catch(() => {});
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 5000 });
  else setTimeout(run, 2000);
};
if (document.readyState === 'complete') warmSwal();
else window.addEventListener('load', warmSwal, { once: true });

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
  }

  loadTheApp() {
    this.commonThings();
    initAnnouncement();
    this.initiateNotifier();
    initMenuDrawer();
    initHeader({ sticky: !!window.header_is_sticky });
    initFooter();
    this.cartDrawer = initCartDrawer();
    this.initAddToCart();
    this.initiateModals();
    this.initiateCollapse();

    initTootTip();
    this.loadModalImgOnclick();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  loadModalImgOnclick(){
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let modal = document.querySelector('#' + link.dataset.modalId),
          img = modal.querySelector('img'),
          imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      })
    })
  }

  commonThings() {
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ')
      })
    }
  }

isElementLoaded(selector){
  return new Promise((resolve=>{
    const interval=setInterval(()=>{
    if(document.querySelector(selector)){
      clearInterval(interval)
      return resolve(document.querySelector(selector))
    }
   },160)
}))

  
  };

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
    btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true)
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier(function (message, type, data) {
      // The add-product toast or (ROADMAP 4.3, D85) the cart drawer already confirms the add
      const addConfirmed = window.enable_add_product_toast || window.app?.cartDrawer;
      if (addConfirmed && data?.data?.googleTags?.event === "addToCart") {
        return;
      }
      if (typeof message == 'object') {
        return loadSwal()
          .then(Swal => Swal.fire(message))
          .catch(() => fallbackNotify(message, type))
          .then(type);
      }

      return loadSwal().then(Swal => Swal.mixin({
        toast: true,
        position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true
      })).catch(() => fallbackNotify(message, type));
    });
  }

  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      let id = '#' + e.target.dataset.modalTrigger;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true)); //small amont of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', //add these classes
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', //remove these classes
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector('#' + trigger.dataset.show);
        if (!content) return;

        const state = { isOpen: false }

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen;
          this.toggleElementClassIf([content, trigger], 'is-closed', 'is-opened', () => isOpen);
        }

        trigger.addEventListener('click', () => {
          const { isOpen } = state;
          toggleState(isOpen);
        });
      });
  }


  // ROADMAP 6.2: Raed's app.anime() helper is gone (no caller). animejs is no longer in app.js: the blog
  // like count updates as plain text, and loyalty.js import()s animejs on the loyalty page only.

  /**
   * These actions are responsible for pressing "add to cart" button,
   * they can be from any page, especially when mega-menu is enabled
   */
  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerHTML = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      // ROADMAP 4.3 (D85): the cart drawer opens instead of the image flying to the header cart
      if (this.cartDrawer) return;
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }
}

salla.onReady(() => (new App).loadTheApp());
