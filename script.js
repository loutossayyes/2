document.addEventListener('DOMContentLoaded', function () {
  // Toggle mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (nav.style.display === 'flex') {
        nav.style.display = '';
      } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.gap = '10px';
        nav.style.alignItems = 'flex-start';
      }
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
        // on small screens hide nav after click
        if (window.innerWidth <= 640 && nav) nav.style.display = '';
      }
    });
  });

  // Simple contact form validation & feedback
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        if (msg) {
          msg.style.color = 'crimson';
          msg.textContent = 'يرجى ملء جميع الحقول.';
        }
        return;
      }
      // محاكاة إرسال
      if (msg) {
        msg.style.color = 'green';
        msg.textContent = 'تم إرسال الرسالة بنجاح — شكراً لتواصلك.';
      }
      form.reset();
    });
  }
});
