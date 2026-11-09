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

// Floating WhatsApp button
const wa = document.createElement('a');
wa.href = 'https://wa.me/5511955811912?text=Ol%C3%A1%2C+gostaria+de+agendar+uma+sess%C3%A3o+de+contexto+gratuita+com+a+BTA+Brasil.';
wa.className = 'whatsapp-float';
wa.target = '_blank';
wa.rel = 'noopener noreferrer';
wa.setAttribute('aria-label', 'Fale conosco pelo WhatsApp');
wa.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
document.body.appendChild(wa);

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
