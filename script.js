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

    // new: return Arabic message for final score
    function getEndMessage(s) {
      switch (s) {
        case 1: return 'شدي حيلك';
        case 2: return 'ايه منيح';
        case 3: return 'كل شي حلو لونه بني مثل حبات البن وعيونك اكيد';
        case 4: return ' تاكلك الضبعة';
        case 5: return 'حظ اوفر مافي لاين';
        case 6: return ' حظ اوفر مافي عبارة';
        case 7: return 'الناس تشوف القمر في السماء وانا اشوفه فيك';
        case 8: return 'تسمعي على sey yas to heaven لانو وانا عبضيف اللعبة كانت مشغلة كتير حلوة';
        case 10: return 'الجمال له تعريف — انتي اول السطور';
        case 12: return 'حسني الاداء لل13';
        case 13: return 'مرحبا انا 13 وبقلك لل14';
        case 14: return ' بجوز ما توصالي لل15 لذالك احببتك، لا لشيء، إلا لأنك أنتِ أنتِ.';
        case 15: return 'أحببتك، لا لشيء، إلا لأنك أنتِ أنتِ';
        default: return 'انتهت اللعبة — نتيجتك تظهر هنا!';
      }
    }

    function endGame() {
      clearInterval(countdown);
      clearTimeout(spawnTimer);
      clearHearts();
      startBtn.disabled = false;
      startBtn.textContent = 'جربي مرة أخرى';

      // عرض الرسالة الخاصة بالنتيجة
      const phrase = getEndMessage(score);
      // نعرض النتيجة مع العبارة (يحافظ على السطر الجديد إذا وُجد)
      gameMsg.textContent = `انتهت اللعبة! نتيجتك: ${score} ❤️\n${phrase}`;

      // استعادة سلوك التمرير
      document.body.style.overflow = '';
      const mobileHint = document.getElementById('mobileHint');
      if (mobileHint) mobileHint.style.display = 'none';
    }

    function spawnHeart() {
      // create heart element
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '❤️';

      // use client sizes (أكثر ثباتًا على الموبايل)
      const areaW = playArea.clientWidth;
      const areaH = playArea.clientHeight;

      // size: أكبر قليلًا على الجوال لمسه أسهل
      const base = (window.innerWidth <= 640) ? 40 : 30;
      const size = base + Math.floor(Math.random() * 50); // تتراوح حسب الجهاز
      heart.style.fontSize = size + 'px';
      heart.style.padding = '6px'; // يزيد منطقة اللمس
      heart.style.borderRadius = '50%';

      // random position inside playArea
      const maxX = Math.max(0, areaW - size);
      const maxY = Math.max(0, areaH - size);
      const x = Math.floor(Math.random() * (maxX + 1));
      const y = Math.floor(Math.random() * (maxY + 1));
      heart.style.position = 'absolute';
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.userSelect = 'none';
      heart.style.cursor = 'pointer';
      heart.style.transition = 'transform 0.12s ease';

      // click / touch handler
      const onHit = (e) => {
        // عند اللمس نمنع تمرير الصفحة الافتراضي
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        score += 1;
        updateDisplays();
        heart.removeEventListener('click', onHit);
        heart.removeEventListener('touchstart', onHit);
        heart.remove();
      };
      heart.addEventListener('click', onHit);
      heart.addEventListener('touchstart', onHit, {passive: false});

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

      // منع التمرير أثناء اللعب (مهم للجوال)
      document.body.style.overflow = 'hidden';
      const mobileHint = document.getElementById('mobileHint');
      if (mobileHint && window.innerWidth <= 640) mobileHint.style.display = 'block';

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
