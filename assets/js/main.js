/**
 * BrandCraft Merchandise — main.js
 * Site-wide behaviour: theme toggle, mobile nav, accordions, tabs,
 * scroll reveal, toasts, sticky mobile CTA, footer year.
 * Loaded on every page (deferred).
 */
(function () {
  'use strict';

  /* ---------- Theme toggle (light / dark / system) ---------- */
  var THEME_KEY = 'bcm-theme';

  function applyStoredTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage blocked */ }
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var effectiveDark = current ? current === 'dark' : prefersDark;
    var next = effectiveDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked */ }
  }

  applyStoredTheme();

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }

    /* ---------- Header scroll shadow ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (navToggle && mobileNav) {
      var closeNav = function () {
        mobileNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };
      var openNav = function () {
        mobileNav.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };
      navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        if (expanded) { closeNav(); } else { openNav(); }
      });
      var navClose = mobileNav.querySelector('[data-nav-close]');
      if (navClose) { navClose.addEventListener('click', closeNav); }
      mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) { closeNav(); }
      });
    }

    /* ---------- Accordions ---------- */
    document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
      var triggers = accordion.querySelectorAll('.accordion-trigger');
      var allowMultiple = accordion.hasAttribute('data-accordion-multi');
      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var panel = document.getElementById(trigger.getAttribute('aria-controls'));
          var isOpen = trigger.getAttribute('aria-expanded') === 'true';
          if (!allowMultiple) {
            triggers.forEach(function (t) {
              if (t !== trigger) {
                t.setAttribute('aria-expanded', 'false');
                var p = document.getElementById(t.getAttribute('aria-controls'));
                if (p) { p.style.maxHeight = null; }
              }
            });
          }
          trigger.setAttribute('aria-expanded', String(!isOpen));
          if (panel) { panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null; }
        });
      });
    });

    /* ---------- Tabs ---------- */
    document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
      var buttons = tabGroup.querySelectorAll('.tabs-list button');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
          tabGroup.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('is-active'); });
          btn.setAttribute('aria-selected', 'true');
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          if (panel) { panel.classList.add('is-active'); }
        });
        btn.addEventListener('keydown', function (e) {
          var list = Array.prototype.slice.call(buttons);
          var idx = list.indexOf(btn);
          if (e.key === 'ArrowRight') { (list[idx + 1] || list[0]).focus(); }
          if (e.key === 'ArrowLeft') { (list[idx - 1] || list[list.length - 1]).focus(); }
        });
      });
    });

    /* ---------- Scroll reveal ---------- */
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Sticky mobile CTA ---------- */
    var stickyCta = document.querySelector('[data-sticky-cta]');
    if (stickyCta) {
      var heroEl = document.querySelector('.hero, .page-hero');
      var stickyIo = ('IntersectionObserver' in window) && heroEl
        ? new IntersectionObserver(function (entries) {
            stickyCta.classList.toggle('is-visible', !entries[0].isIntersecting);
          }, { threshold: 0 })
        : null;
      if (stickyIo && heroEl) { stickyIo.observe(heroEl); }
      else { stickyCta.classList.add('is-visible'); }
    }

    /* ---------- Footer year ---------- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ---------- Quantity steppers ---------- */
    document.querySelectorAll('.qty-stepper').forEach(function (stepper) {
      var input = stepper.querySelector('input');
      var min = parseInt(input.getAttribute('min') || '1', 10);
      var max = parseInt(input.getAttribute('max') || '100000', 10);
      stepper.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var val = parseInt(input.value || min, 10);
          val = btn.hasAttribute('data-decrease') ? Math.max(min, val - (parseInt(input.step, 10) || 1)) : Math.min(max, val + (parseInt(input.step, 10) || 1));
          input.value = val;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });
  });

  /* ---------- Toast utility (exposed globally) ---------- */
  window.BCM = window.BCM || {};
  window.BCM.toast = function (message, type) {
    var region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    var toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast-' + type : '');
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span>' + message + '</span>';
    region.appendChild(toast);
    window.setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      window.setTimeout(function () { toast.remove(); }, 320);
    }, 4200);
  };
})();
