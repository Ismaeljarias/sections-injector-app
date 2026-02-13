/**
 * testimonials-slider.js
 * Horizontal scroll-snap slider with navigation.
 * Vanilla JS, respects prefers-reduced-motion.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  class TestimonialsSlider {
    constructor(element) {
      this.slider = element;
      this.track = this.slider.querySelector(
        "[data-slider] .app-testimonials__track",
      );
      this.dotsContainer = this.slider.querySelector("[data-dots-container]");
      this.slides = Array.from(this.slider.querySelectorAll("[data-slide]"));
      this.prevButton = this.slider.querySelector("[data-prev]");
      this.nextButton = this.slider.querySelector("[data-next]");

      this.autoplayEnabled =
        this.slider.querySelector("[data-slider]").dataset.autoplay === "true";
      this.autoplayInterval = null;
      this.isScrolling = false;
      this.scrollTimeout = null;

      this.itemsPerView = 1;
      this.pageCount = 1;
      this.currentPage = 0;

      this._onResize = this.handleResize.bind(this);

      if (!this.track || this.slides.length === 0) return;

      this.init();
    }

    init() {
      this.slides = Array.from(this.slider.querySelectorAll("[data-slide]"));
      if (this.slides.length === 0) return;

      this.setupNavigation();
      this.setupAutoplay();
      this.setupMutationObserver();

      this.resizeObserver = new ResizeObserver((entries) => {
        window.requestAnimationFrame(() => this.handleResize());
      });
      this.resizeObserver.observe(this.slider);
      this.handleEditorEvents();

      this.updateMetricsAndControls();
    }

    setupMutationObserver() {
      if (!this.track) return;
      if (this.observer) this.observer.disconnect();

      this.observer = new MutationObserver(() => {
        this.reinit();
      });
      this.observer.observe(this.track, { childList: true, subtree: true });
    }

    handleResize() {
      this.updateMetricsAndControls();
    }

    updateMetricsAndControls() {
      if (this.slides.length > 0 && this.slides[0].offsetWidth === 0) {
        requestAnimationFrame(() => this.updateMetricsAndControls());
        return;
      }
      this.updateMetrics();
      this.createDots();
      this.updateControls();
    }

    updateMetrics() {
      if (this.slides.length === 0) {
        this.pageCount = 0;
        return;
      }

      const itemCount = this.slides.length;
      const containerWidth = this.slider.clientWidth;

      this.track.removeAttribute("data-item-count");
      this.track.removeAttribute("data-item-count-gt");

      let itemsPerView;

      if (containerWidth <= 500) {
        itemsPerView = 1;
      } else if (containerWidth <= 768) {
        itemsPerView = Math.min(itemCount, 2);
      } else {
        itemsPerView = Math.min(itemCount, 3);
      }

      if (itemCount === 1) {
        this.track.setAttribute("data-item-count", "1");
      } else if (itemCount === 2) {
        this.track.setAttribute("data-item-count", "2");
      } else if (itemCount === 3) {
        this.track.setAttribute("data-item-count", "3");
      } else {
        this.track.setAttribute("data-item-count-gt", "3");
      }

      this.itemsPerView = itemsPerView;
      this.pageCount = Math.ceil(this.slides.length / this.itemsPerView);

      if (this.currentPage >= this.pageCount) {
        this.currentPage = Math.max(0, this.pageCount - 1);
      }
    }

    createDots() {
      if (!this.dotsContainer) return;
      this.dotsContainer.innerHTML = "";

      if (this.pageCount <= 1) {
        this.dots = [];
        return;
      }

      const dots = [];
      for (let i = 0; i < this.pageCount; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "app-testimonials__dot";
        btn.setAttribute("aria-label", `Go to page ${i + 1}`);
        if (i === this.currentPage) {
          btn.classList.add("app-testimonials__dot--active");
          btn.setAttribute("aria-selected", "true");
        }

        btn.addEventListener("click", () => {
          this.stopAutoplay();
          this.goToPage(i);
        });
        this.dotsContainer.appendChild(btn);
        dots.push(btn);
      }
      this.dots = dots;
    }

    setupNavigation() {
      if (this.prevButton) {
        this.prevButton.onclick = () => {
          this.stopAutoplay();
          this.goToPrevious();
        };
      }

      if (this.nextButton) {
        this.nextButton.onclick = () => {
          this.stopAutoplay();
          this.goToNext();
        };
      }

      this.track.addEventListener(
        "scroll",
        () => {
          if (this.isScrolling) return;
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = setTimeout(() => {
            this.handleScroll();
          }, 100);
        },
        { passive: true },
      );
    }

    setupAutoplay() {
      if (!this.autoplayEnabled || prefersReducedMotion) return;

      this.startAutoplay();
      this.slider.addEventListener("mouseenter", () => this.stopAutoplay());
      this.slider.addEventListener("mouseleave", () => {
        if (this.autoplayEnabled) this.startAutoplay();
      });
      this.slider.addEventListener("focusin", () => this.stopAutoplay());
    }

    startAutoplay() {
      if (this.autoplayInterval) return;
      this.autoplayInterval = setInterval(() => this.goToNext(), 5000);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }

    goToPrevious() {
      const newPage =
        this.currentPage > 0 ? this.currentPage - 1 : this.pageCount - 1;
      this.goToPage(newPage);
    }

    goToNext() {
      const newPage =
        this.currentPage < this.pageCount - 1 ? this.currentPage + 1 : 0;
      this.goToPage(newPage);
    }

    goToPage(pageIndex) {
      if (pageIndex < 0 || pageIndex >= this.pageCount) return;

      this.currentPage = pageIndex;
      const slideIndex = pageIndex * this.itemsPerView;
      const slide = this.slides[slideIndex];
      if (!slide) return;

      this.isScrolling = true;
      slide.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "start",
      });

      this.updateControls();

      setTimeout(() => {
        this.isScrolling = false;
      }, 500);
    }

    handleScroll() {
      const scrollLeft = this.track.scrollLeft;
      const trackWidth = this.track.clientWidth;
      if (trackWidth === 0) return;

      const newPage = Math.round(scrollLeft / trackWidth);

      if (
        newPage !== this.currentPage &&
        newPage >= 0 &&
        newPage < this.pageCount
      ) {
        this.currentPage = newPage;
        this.updateControls();
      }
    }

    updateControls() {
      if (this.dots) {
        this.dots.forEach((dot, index) => {
          const isActive = index === this.currentPage;
          dot.classList.toggle("app-testimonials__dot--active", isActive);
          dot.setAttribute("aria-selected", isActive);
        });
      }

      const hasMultiplePages = this.pageCount > 1;

      const footer = this.slider.querySelector(".app-testimonials__footer");
      if (footer) {
        if (hasMultiplePages) {
          footer.classList.remove("is-hidden");
          footer.style.display = "";
        } else {
          footer.classList.add("is-hidden");
          footer.style.display = "none";
        }
      }

      if (this.prevButton) {
        this.prevButton.disabled = !hasMultiplePages;
        this.prevButton.style.display = hasMultiplePages ? "" : "none";
      }
      if (this.nextButton) {
        this.nextButton.disabled = !hasMultiplePages;
        this.nextButton.style.display = hasMultiplePages ? "" : "none";
      }

      if (this.dotsContainer) {
        this.dotsContainer.style.display = hasMultiplePages ? "" : "none";
      }
    }

    reinit() {
      this.slides = Array.from(this.slider.querySelectorAll("[data-slide]"));
      if (this.slides.length === 0) {
        this.pageCount = 0;
        this.createDots();
        this.updateControls();
        return;
      }
      this.updateMetricsAndControls();
    }

    handleEditorEvents() {
      if (typeof Shopify === "undefined" || !Shopify.designMode) return;

      document.addEventListener("shopify:section:load", (e) => {
        if (e.target.contains(this.slider)) this.init();
      });

      document.addEventListener("shopify:section:unload", (e) => {
        if (e.target.contains(this.slider)) this.destroy();
      });

      document.addEventListener("shopify:section:rerender", (e) => {
        if (e.target.contains(this.slider)) this.reinit();
      });

      document.addEventListener("shopify:block:select", (e) => {
        if (!e.target.hasAttribute("data-slide")) return;
        const index = this.slides.indexOf(e.target);
        if (index !== -1) {
          this.stopAutoplay();
          const page = Math.floor(index / this.itemsPerView);
          this.goToPage(page);
        }
      });
    }

    destroy() {
      this.stopAutoplay();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.observer) this.observer.disconnect();
    }
  }

  window.TestimonialsSlider = TestimonialsSlider;

  function initSliders() {
    const sliders = document.querySelectorAll("[data-slider]");
    sliders.forEach((slider) => {
      if (slider.dataset.initialized) return;

      new TestimonialsSlider(slider.closest(".app-testimonials"));
      slider.dataset.initialized = "true";
    });
  }

  window.initTestimonialsSliders = initSliders;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSliders);
  } else {
    initSliders();
  }

  document.addEventListener("shopify:section:load", (e) => {
    const sliders = e.target.querySelectorAll("[data-slider]");
    sliders.forEach((slider) => {
      if (!slider.dataset.initialized) {
        new TestimonialsSlider(slider.closest(".app-testimonials"));
        slider.dataset.initialized = "true";
      }
    });

    if (e.target.hasAttribute("data-slider")) {
      if (!e.target.dataset.initialized) {
        new TestimonialsSlider(e.target.closest(".app-testimonials"));
        e.target.dataset.initialized = "true";
      }
    }
  });

  document.addEventListener("app:testimonials:update", () => {
    initSliders();
  });
})();
