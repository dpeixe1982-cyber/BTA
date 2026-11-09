// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Mobile hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu');
    }
  });
}

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Contact form: envio real via fetch para enviar-contato.php
const form = document.querySelector('.contact-form-el');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const success = form.querySelector('.success-message');
    const error = form.querySelector('.error-message');
    const original = btn.textContent;

    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json().catch(() => ({ ok: false }));

      if (response.ok && data.ok) {
        if (success) {
          success.style.display = 'block';
          setTimeout(() => { success.style.display = 'none'; }, 8000);
        }
        form.reset();
      } else if (error) {
        error.style.display = 'block';
      }
    } catch (err) {
      if (error) error.style.display = 'block';
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

// Animate cards on scroll
const animateOnScroll = () => {
  const cards = document.querySelectorAll('.service-card, .diferential-card, .reforma-card, .mission-card, .offer-card, .pillar-card, .pricing-card, .num-row, .update-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
};

document.addEventListener('DOMContentLoaded', animateOnScroll);


// Vídeo da seção "Ferramenta em ação": toca sem som só quando está visível
const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.tool-video video').forEach((toolVideo) => {
  if (!('IntersectionObserver' in window)) return;
  const reduz = reduzMovimento;
  let pausadoPeloUsuario = false;
  toolVideo.addEventListener('pause', () => { if (toolVideo.dataset.auto !== '1') pausadoPeloUsuario = true; });
  toolVideo.addEventListener('play', () => { pausadoPeloUsuario = false; });
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !reduz && !pausadoPeloUsuario) {
        toolVideo.play().catch(() => {});
      } else if (!entry.isIntersecting && !toolVideo.paused) {
        toolVideo.dataset.auto = '1'; toolVideo.pause(); toolVideo.dataset.auto = '';
      }
    });
  }, { threshold: 0.4 }).observe(toolVideo);
});

// Link com âncora vindo de outra página (ex.: servicos.html -> index.html#ferramenta):
// garante a chegada na seção mesmo se a rolagem suave for interrompida pelo carregamento.
window.addEventListener('load', () => {
  const alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!alvo) return;
  setTimeout(() => {
    const topo = alvo.getBoundingClientRect().top;
    if (topo > 120 || topo < -20) alvo.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, 300);
});

// Vídeos do YouTube: só carrega o player (youtube-nocookie) quando a pessoa clica.
// Antes da data de estreia, mostra a etiqueta "Estreia dd/mm às hh:mm".
document.querySelectorAll('.yt-play').forEach((btn) => {
  const estreia = btn.dataset.estreia ? new Date(btn.dataset.estreia) : null;
  if (estreia && Date.now() < estreia.getTime()) {
    const tag = document.createElement('span');
    tag.className = 'yt-estreia';
    const dia = estreia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });
    const hora = estreia.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    tag.textContent = `Estreia ${dia} às ${hora}`;
    btn.appendChild(tag);
  }
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    iframe.title = btn.getAttribute('aria-label') || 'Vídeo';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    btn.replaceWith(iframe);
  });
});
