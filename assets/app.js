(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  const backTop = document.getElementById("back-top");
  const year = document.getElementById("current-year");
  const programSelect = document.getElementById("program-choice");
  const form = document.getElementById("inquiry-form");
  const formNote = document.getElementById("form-note");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka menu");
    nav.classList.remove("open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      nav.classList.toggle("open", open);
    });

    nav.querySelectorAll('a[href^="#"]').forEach(link =>
      link.addEventListener("click", closeMenu)
    );

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const onScroll = () => {
    const scrolled = window.scrollY > 18;
    if (header) header.classList.toggle("scrolled", scrolled);
    if (backTop) backTop.classList.toggle("visible", window.scrollY > 650);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll("[data-program]").forEach(link => {
    link.addEventListener("click", () => {
      if (!programSelect) return;
      const value = link.getAttribute("data-program");
      if (Array.from(programSelect.options).some(option => option.value === value)) {
        programSelect.value = value;
      }
    });
  });

  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.09, rootMargin: "0px 0px -22px 0px" });

    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
  }

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const name = document.getElementById("parent-name").value.trim();
      const program = programSelect.value;
      const message = document.getElementById("inquiry-message").value.trim();
      if (!name || !program || !message) return;

      const subject = "Konsultasi Program Tunas Edukasi — " + program;
      const body = [
        "Halo Tim Tunas Edukasi,",
        "",
        "Saya ingin berkonsultasi tentang program belajar.",
        "",
        "Nama orang tua/wali: " + name,
        "Program yang diminati: " + program,
        "",
        "Pertanyaan:",
        message,
        "",
        "Terima kasih."
      ].join("\n");

      const emailURL = "mailto:tunasedukasi@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (formNote) {
        formNote.textContent = "Aplikasi email Anda akan dibuka. Jika tidak terbuka, silakan email langsung ke tunasedukasi@gmail.com.";
        formNote.setAttribute("role", "status");
      }
      window.location.href = emailURL;
    });
  }
})();