export const THEME_FILES = [
  {
    filename: "sections/app-hero-banner.liquid",
    content: `{{ 'app-base.css' | asset_url | stylesheet_tag }}
{{ 'hero-banner.css' | asset_url | stylesheet_tag }}

<section class="hero-banner" data-section-id="{{ section.id }}">
  <div class="hero-banner__container">
    {% if section.settings.image %}
      <div class="hero-banner__image">
        <img
          src="{{ section.settings.image | image_url: width: 1920 }}"
          alt="{{ section.settings.image.alt | escape }}"
          loading="lazy"
          width="{{ section.settings.image.width }}"
          height="{{ section.settings.image.height }}"
        >
      </div>
    {% endif %}
    <div class="hero-banner__content">
      {% if section.settings.heading != blank %}
        <h2 class="hero-banner__heading">{{ section.settings.heading }}</h2>
      {% endif %}
      {% if section.settings.subheading != blank %}
        <p class="hero-banner__subheading">{{ section.settings.subheading }}</p>
      {% endif %}
      {% if section.settings.button_text != blank and section.settings.button_url != blank %}
        {% render 'app-button', text: section.settings.button_text, url: section.settings.button_url %}
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "App Hero Banner",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background Image"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Welcome to Our Store"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Discover amazing products"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Shop Now"
    },
    {
      "type": "url",
      "id": "button_url",
      "label": "Button URL"
    }
  ],
  "presets": [
    {
      "name": "App Hero Banner"
    }
  ]
}
{% endschema %}`,
  },
  {
    filename: "sections/app-faq-accordion.liquid",
    content: `{{ 'app-base.css' | asset_url | stylesheet_tag }}
{{ 'faq-accordion.css' | asset_url | stylesheet_tag }}
{{ 'faq-accordion.js' | asset_url | script_tag }}

<section class="faq-accordion" data-section-id="{{ section.id }}">
  <div class="faq-accordion__container">
    {% if section.settings.heading != blank %}
      <h2 class="faq-accordion__heading">{{ section.settings.heading }}</h2>
    {% endif %}
    {% if section.settings.subheading != blank %}
      <p class="faq-accordion__subheading">{{ section.settings.subheading }}</p>
    {% endif %}
    
    <div class="faq-accordion__items" data-allow-multiple="{{ section.settings.allow_multiple }}">
      {% for block in section.blocks %}
        {% if block.type == 'faq_item' %}
          <div class="faq-item" {{ block.shopify_attributes }}>
            <button
              class="faq-item__question"
              type="button"
              aria-expanded="false"
              aria-controls="faq-{{ section.id }}-{{ block.id }}"
            >
              <span>{{ block.settings.question }}</span>
              <span class="faq-item__icon" aria-hidden="true">+</span>
            </button>
            <div
              class="faq-item__answer"
              id="faq-{{ section.id }}-{{ block.id }}"
              hidden
            >
              <div class="faq-item__answer-content">
                {{ block.settings.answer }}
              </div>
            </div>
          </div>
        {% endif %}
      {% endfor %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "App FAQ Accordion",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Frequently Asked Questions"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading"
    },
    {
      "type": "checkbox",
      "id": "allow_multiple",
      "label": "Allow Multiple Open",
      "default": false
    }
  ],
  "blocks": [
    {
      "type": "faq_item",
      "name": "FAQ Item",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Question",
          "default": "Your question here"
        },
        {
          "type": "richtext",
          "id": "answer",
          "label": "Answer",
          "default": "<p>Your answer here</p>"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "App FAQ Accordion",
      "blocks": [
        {
          "type": "faq_item",
          "settings": {
            "question": "What is your return policy?",
            "answer": "<p>We accept returns within 30 days of purchase.</p>"
          }
        },
        {
          "type": "faq_item",
          "settings": {
            "question": "How long does shipping take?",
            "answer": "<p>Standard shipping takes 5-7 business days.</p>"
          }
        }
      ]
    }
  ]
}
{% endschema %}`,
  },
  {
    filename: "sections/app-testimonials-slider.liquid",
    content: `{{ 'app-base.css' | asset_url | stylesheet_tag }}
{{ 'testimonials-slider.css' | asset_url | stylesheet_tag }}
{{ 'testimonials-slider.js' | asset_url | script_tag }}

<section class="testimonials-slider" data-section-id="{{ section.id }}">
  <div class="testimonials-slider__container">
    {% if section.settings.heading != blank %}
      <h2 class="testimonials-slider__heading">{{ section.settings.heading }}</h2>
    {% endif %}
    
    <div class="testimonials-slider__wrapper">
      <div class="testimonials-slider__track" data-autoplay="{{ section.settings.autoplay }}">
        {% for block in section.blocks %}
          {% if block.type == 'testimonial' %}
            <div class="testimonial-card" {{ block.shopify_attributes }}>
              <div class="testimonial-card__content">
                {% if block.settings.avatar %}
                  <img
                    class="testimonial-card__avatar"
                    src="{{ block.settings.avatar | image_url: width: 80 }}"
                    alt="{{ block.settings.name | escape }}"
                    width="80"
                    height="80"
                    loading="lazy"
                  >
                {% endif %}
                <div class="testimonial-card__info">
                  {% if block.settings.name != blank %}
                    <p class="testimonial-card__name">{{ block.settings.name }}</p>
                  {% endif %}
                  {% if block.settings.role != blank %}
                    <p class="testimonial-card__role">{{ block.settings.role }}</p>
                  {% endif %}
                </div>
              </div>
              {% if block.settings.rating > 0 %}
                <div class="testimonial-card__rating">
                  {% render 'app-stars', rating: block.settings.rating %}
                </div>
              {% endif %}
              {% if block.settings.review != blank %}
                <div class="testimonial-card__review">
                  {{ block.settings.review }}
                </div>
              {% endif %}
            </div>
          {% endif %}
        {% endfor %}
      </div>
      
      {% if section.blocks.size > 1 %}
        <div class="testimonials-slider__controls">
          <button
            class="testimonials-slider__button testimonials-slider__button--prev"
            type="button"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <button
            class="testimonials-slider__button testimonials-slider__button--next"
            type="button"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "App Testimonials Slider",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "What Our Customers Say"
    },
    {
      "type": "checkbox",
      "id": "autoplay",
      "label": "Autoplay",
      "default": false
    }
  ],
  "blocks": [
    {
      "type": "testimonial",
      "name": "Testimonial",
      "settings": [
        {
          "type": "image_picker",
          "id": "avatar",
          "label": "Avatar"
        },
        {
          "type": "text",
          "id": "name",
          "label": "Name",
          "default": "Customer Name"
        },
        {
          "type": "text",
          "id": "role",
          "label": "Role",
          "default": "Verified Buyer"
        },
        {
          "type": "range",
          "id": "rating",
          "label": "Rating",
          "min": 0,
          "max": 5,
          "step": 1,
          "default": 5
        },
        {
          "type": "richtext",
          "id": "review",
          "label": "Review",
          "default": "<p>This product exceeded my expectations!</p>"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "App Testimonials Slider",
      "blocks": [
        {
          "type": "testimonial",
          "settings": {
            "name": "John Doe",
            "role": "Verified Buyer",
            "rating": 5,
            "review": "<p>Amazing quality and fast shipping!</p>"
          }
        },
        {
          "type": "testimonial",
          "settings": {
            "name": "Jane Smith",
            "role": "Verified Buyer",
            "rating": 5,
            "review": "<p>Highly recommend this product to everyone.</p>"
          }
        }
      ]
    }
  ]
}
{% endschema %}`,
  },
  {
    filename: "snippets/app-stars.liquid",
    content: `{% comment %}
  Renders star rating
  
  Usage:
  {% render 'app-stars', rating: 5 %}
{% endcomment %}

<div class="app-stars" role="img" aria-label="{{ rating }} out of 5 stars">
  {% for i in (1..5) %}
    {% if i <= rating %}
      <span class="app-stars__star app-stars__star--filled" aria-hidden="true">★</span>
    {% else %}
      <span class="app-stars__star app-stars__star--empty" aria-hidden="true">☆</span>
    {% endif %}
  {% endfor %}
</div>`,
  },
  {
    filename: "snippets/app-button.liquid",
    content: `{% comment %}
  Renders a button/link
  
  Usage:
  {% render 'app-button', text: 'Click Me', url: '/collections/all' %}
{% endcomment %}

<a href="{{ url }}" class="app-button">
  {{ text }}
</a>`,
  },
  {
    filename: "assets/app-base.css",
    content: `/* Base styles for app sections */

:root {
  --app-color-primary: #000;
  --app-color-secondary: #666;
  --app-color-border: #e5e5e5;
  --app-color-background: #fff;
  --app-spacing-base: 1rem;
  --app-spacing-section: 4rem;
  --app-border-radius: 0.5rem;
  --app-transition: 0.3s ease;
}

.app-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--app-color-primary);
  color: var(--app-color-background);
  text-decoration: none;
  border-radius: var(--app-border-radius);
  transition: opacity var(--app-transition);
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
}

.app-button:hover,
.app-button:focus {
  opacity: 0.8;
}

.app-button:focus-visible {
  outline: 2px solid var(--app-color-primary);
  outline-offset: 2px;
}

.app-stars {
  display: flex;
  gap: 0.25rem;
  font-size: 1.25rem;
  line-height: 1;
}

.app-stars__star--filled {
  color: #ffc107;
}

.app-stars__star--empty {
  color: var(--app-color-border);
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`,
  },
  {
    filename: "assets/hero-banner.css",
    content: `.hero-banner {
  position: relative;
  overflow: hidden;
  padding: var(--app-spacing-section) 0;
}

.hero-banner__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--app-spacing-base);
  position: relative;
}

.hero-banner__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-banner__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-banner__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--app-border-radius);
  max-width: 600px;
  margin: 0 auto;
}

.hero-banner__heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--app-color-primary);
}

.hero-banner__subheading {
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  color: var(--app-color-secondary);
}

@media (max-width: 768px) {
  .hero-banner__heading {
    font-size: 2rem;
  }

  .hero-banner__subheading {
    font-size: 1rem;
  }
}`,
  },
  {
    filename: "assets/faq-accordion.css",
    content: `.faq-accordion {
  padding: var(--app-spacing-section) 0;
}

.faq-accordion__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--app-spacing-base);
}

.faq-accordion__heading {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 1rem 0;
  color: var(--app-color-primary);
}

.faq-accordion__subheading {
  font-size: 1.125rem;
  text-align: center;
  margin: 0 0 3rem 0;
  color: var(--app-color-secondary);
}

.faq-accordion__items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid var(--app-color-border);
  border-radius: var(--app-border-radius);
  overflow: hidden;
}

.faq-item__question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: var(--app-color-background);
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--app-color-primary);
  transition: background-color var(--app-transition);
  min-height: 44px;
}

.faq-item__question:hover,
.faq-item__question:focus {
  background-color: #f9f9f9;
}

.faq-item__question:focus-visible {
  outline: 2px solid var(--app-color-primary);
  outline-offset: -2px;
}

.faq-item__icon {
  font-size: 1.5rem;
  font-weight: 300;
  transition: transform var(--app-transition);
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-item__question[aria-expanded="true"] .faq-item__icon {
  transform: rotate(45deg);
}

.faq-item__answer {
  overflow: hidden;
  transition: height var(--app-transition);
}

.faq-item__answer[hidden] {
  display: none;
}

.faq-item__answer-content {
  padding: 0 1.25rem 1.25rem 1.25rem;
  color: var(--app-color-secondary);
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .faq-item__icon,
  .faq-item__answer {
    transition: none;
  }
}`,
  },
  {
    filename: "assets/testimonials-slider.css",
    content: `.testimonials-slider {
  padding: var(--app-spacing-section) 0;
  background-color: #f9f9f9;
}

.testimonials-slider__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--app-spacing-base);
}

.testimonials-slider__heading {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 3rem 0;
  color: var(--app-color-primary);
}

.testimonials-slider__wrapper {
  position: relative;
  overflow: hidden;
  padding: 0 3rem;
}

.testimonials-slider__track {
  display: flex;
  gap: 2rem;
  transition: transform var(--app-transition);
  scroll-behavior: smooth;
}

.testimonial-card {
  flex: 0 0 100%;
  max-width: 600px;
  margin: 0 auto;
  background: var(--app-color-background);
  border-radius: var(--app-border-radius);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.testimonial-card__content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.testimonial-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.testimonial-card__info {
  flex: 1;
}

.testimonial-card__name {
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0 0 0.25rem 0;
  color: var(--app-color-primary);
}

.testimonial-card__role {
  font-size: 0.875rem;
  margin: 0;
  color: var(--app-color-secondary);
}

.testimonial-card__rating {
  margin-bottom: 1rem;
}

.testimonial-card__review {
  color: var(--app-color-secondary);
  line-height: 1.6;
}

.testimonials-slider__controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.testimonials-slider__button {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  border: 1px solid var(--app-color-border);
  background: var(--app-color-background);
  color: var(--app-color-primary);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--app-transition);
}

.testimonials-slider__button:hover,
.testimonials-slider__button:focus {
  background: var(--app-color-primary);
  color: var(--app-color-background);
  border-color: var(--app-color-primary);
}

.testimonials-slider__button:focus-visible {
  outline: 2px solid var(--app-color-primary);
  outline-offset: 2px;
}

.testimonials-slider__button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .testimonial-card {
    flex: 0 0 calc(50% - 1rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .testimonials-slider__track {
    transition: none;
    scroll-behavior: auto;
  }
}`,
  },
  {
    filename: "assets/faq-accordion.js",
    content: `(function() {
  'use strict';

  function initFAQAccordion(sectionId) {
    const section = document.querySelector(\`.faq-accordion[data-section-id="\${sectionId}"]\`);
    if (!section) return;

    const container = section.querySelector('.faq-accordion__items');
    if (!container) return;

    const allowMultiple = container.dataset.allowMultiple === 'true';

    // Clean up existing listeners
    const buttons = section.querySelectorAll('.faq-item__question');
    buttons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });

    // Add new listeners
    section.querySelectorAll('.faq-item__question').forEach(button => {
      button.addEventListener('click', handleClick);
      button.addEventListener('keydown', handleKeydown);
    });

    function handleClick(e) {
      const button = e.currentTarget;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      if (!allowMultiple) {
        section.querySelectorAll('.faq-item__question').forEach(btn => {
          if (btn !== button) {
            btn.setAttribute('aria-expanded', 'false');
            const answer = btn.nextElementSibling;
            if (answer) {
              answer.hidden = true;
            }
          }
        });
      }

      button.setAttribute('aria-expanded', !isExpanded);
      const answer = button.nextElementSibling;
      if (answer) {
        answer.hidden = isExpanded;
      }
    }

    function handleKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    }
  }

  function cleanupFAQAccordion(sectionId) {
    const section = document.querySelector(\`.faq-accordion[data-section-id="\${sectionId}"]\`);
    if (!section) return;

    const buttons = section.querySelectorAll('.faq-item__question');
    buttons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-accordion').forEach(section => {
      const sectionId = section.dataset.sectionId;
      if (sectionId) {
        initFAQAccordion(sectionId);
      }
    });
  });

  // Theme Editor events
  document.addEventListener('shopify:section:load', function(e) {
    initFAQAccordion(e.detail.sectionId);
  });

  document.addEventListener('shopify:section:unload', function(e) {
    cleanupFAQAccordion(e.detail.sectionId);
  });
})();`,
  },
  {
    filename: "assets/testimonials-slider.js",
    content: `(function() {
  'use strict';

  const sliders = new Map();

  function initTestimonialsSlider(sectionId) {
    const section = document.querySelector(\`.testimonials-slider[data-section-id="\${sectionId}"]\`);
    if (!section) return;

    const track = section.querySelector('.testimonials-slider__track');
    const prevBtn = section.querySelector('.testimonials-slider__button--prev');
    const nextBtn = section.querySelector('.testimonials-slider__button--next');
    
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    const autoplay = track.dataset.autoplay === 'true';

    // Clean up existing instance
    if (sliders.has(sectionId)) {
      cleanupTestimonialsSlider(sectionId);
    }

    const slider = {
      currentIndex,
      autoplayInterval,
      prevBtn,
      nextBtn,
      track,
      cards
    };

    sliders.set(sectionId, slider);

    function updateSlider() {
      const offset = -currentIndex * 100;
      track.style.transform = \`translateX(\${offset}%)\`;
      
      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex === cards.length - 1;
      }

      slider.currentIndex = currentIndex;
    }

    function goToNext() {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    }

    function goToPrev() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = cards.length - 1;
      }
      updateSlider();
    }

    function startAutoplay() {
      if (!autoplay) return;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      stopAutoplay();
      autoplayInterval = setInterval(goToNext, 5000);
      slider.autoplayInterval = autoplayInterval;
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        slider.autoplayInterval = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToNext();
        stopAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToPrev();
        stopAutoplay();
      });
    }

    updateSlider();
    startAutoplay();

    // Pause autoplay on hover
    section.addEventListener('mouseenter', stopAutoplay);
    section.addEventListener('mouseleave', startAutoplay);
  }

  function cleanupTestimonialsSlider(sectionId) {
    const slider = sliders.get(sectionId);
    if (!slider) return;

    if (slider.autoplayInterval) {
      clearInterval(slider.autoplayInterval);
    }

    const section = document.querySelector(\`.testimonials-slider[data-section-id="\${sectionId}"]\`);
    if (section) {
      const newSection = section.cloneNode(true);
      section.parentNode.replaceChild(newSection, section);
    }

    sliders.delete(sectionId);
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.testimonials-slider').forEach(section => {
      const sectionId = section.dataset.sectionId;
      if (sectionId) {
        initTestimonialsSlider(sectionId);
      }
    });
  });

  // Theme Editor events
  document.addEventListener('shopify:section:load', function(e) {
    initTestimonialsSlider(e.detail.sectionId);
  });

  document.addEventListener('shopify:section:unload', function(e) {
    cleanupTestimonialsSlider(e.detail.sectionId);
  });
})();`,
  },
];

export const FILENAMES = THEME_FILES.map((f) => f.filename);
