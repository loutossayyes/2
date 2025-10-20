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

  // ============================
  // لعبة بسيطة: اضغط على القلوب
  // ============================
  const startBtn = document.getElementById('startGame');
  const playArea = document.getElementById('playArea');
  const timeEl = document.getElementById('gameTime');
  const scoreEl = document.getElementById('gameScore');
  const gameMsg = document.getElementById('gameMsg');

  if (startBtn && playArea && timeEl && scoreEl) {
    let time = 15;
    let score = 0;
    let countdown = null;
    let spawnTimer = null;

    function updateDisplays() {
      timeEl.textContent = String(time);
      scoreEl.textContent = String(score);
    }

    function clearHearts() {
      const hearts = playArea.querySelectorAll('.heart');
      hearts.forEach(h => h.remove());
    }

    function endGame() {
      clearInterval(countdown);
      clearTimeout(spawnTimer);
      clearHearts();
      startBtn.disabled = false;
      gameMsg.textContent = `انتهت اللعبة! نتيجتك: ${score} ❤️`;
      startBtn.textContent = 'جربي مرة أخرى';
    }

    function spawnHeart() {
      // create heart element
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '❤️';
      const areaRect = playArea.getBoundingClientRect();
      const size = 30 + Math.floor(Math.random() * 40); // 30-70px
      heart.style.fontSize = size + 'px';

      // random position inside playArea
      const maxX = Math.max(0, areaRect.width - size);
      const maxY = Math.max(0, areaRect.height - size);
      const x = Math.floor(Math.random() * (maxX + 1));
      const y = Math.floor(Math.random() * (maxY + 1));
      heart.style.position = 'absolute';
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.userSelect = 'none';
      heart.style.cursor = 'pointer';
      heart.style.transition = 'transform 0.12s ease';

      // click handler
      const onClick = (e) => {
        score += 1;
        updateDisplays();
        heart.removeEventListener('click', onClick);
        heart.remove();
      };
      heart.addEventListener('click', onClick);

      playArea.appendChild(heart);

      // auto-remove after short time
      const removeDelay = 900 + Math.floor(Math.random() * 700);
      const rm = setTimeout(() => {
        if (heart.parentNode) heart.remove();
        clearTimeout(rm);
      }, removeDelay);

      // schedule next spawn only if game still running
      if (time > 0) {
        spawnTimer = setTimeout(spawnHeart, 300 + Math.floor(Math.random() * 700));
      }
    }

    function startGame() {
      // reset
      time = 15;
      score = 0;
      updateDisplays();
      gameMsg.textContent = '';
      startBtn.disabled = true;
      startBtn.textContent = 'اللعبة جارية...';

      // start spawning and countdown
      spawnHeart();
      countdown = setInterval(() => {
        time -= 1;
        updateDisplays();
        if (time <= 0) {
          endGame();
        }
      }, 1000);
    }

    startBtn.addEventListener('click', startGame);
  }
});
