/**
 * IKTGM FEST VOL. 2 — Main UI & WhatsApp Ordering Logic
 * Vanilla JavaScript (No frameworks)
 */

(function () {
  'use strict';

  // =========================================================================
  // Configurable Committee WhatsApp Numbers & Google Drive Archive Link
  // =========================================================================
  const MERCH_WHATSAPP = "62822906121256";  // nomor WhatsApp Merchandise panitia
  const SPONSOR_WHATSAPP = "62822906121256"; // nomor WhatsApp Sponsorship panitia
  const GDRIVE_ARCHIVE_URL = "https://drive.google.com/"; //link folder Google Drive dokumentasi resmi panitia

  // =========================================================================
  // 1. Navigation & Header State
  // =========================================================================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  // Sync Google Drive Archive URLs
  document.querySelectorAll('#gdrive-archive-link, #header-gdrive-btn').forEach(el => {
    el.setAttribute('href', GDRIVE_ARCHIVE_URL);
  });

  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  // Mobile Menu Toggle & Smooth Drawer Handling
  function openMobileDrawer() {
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileDrawer.classList.add('is-open');
    document.documentElement.classList.add('nav-drawer-open');
    document.body.classList.add('nav-drawer-open');
    if (window.lenis) window.lenis.stop();
  }

  function closeMobileDrawer() {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileDrawer.classList.remove('is-open');
    document.documentElement.classList.remove('nav-drawer-open');
    document.body.classList.remove('nav-drawer-open');
    if (window.lenis) window.lenis.start();
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    // Close menu and navigate when a drawer link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        closeMobileDrawer();

        if (href && href.startsWith('#') && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            setTimeout(() => {
              if (window.lenis) {
                window.lenis.scrollTo(target, { offset: -70 });
              } else {
                const targetPos = target.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
              }
            }, 120);
          }
        }
      });
    });

    // Close drawer on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer();
      }
    });
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 2. Merchandise Product Selectors & Quantity Controls
  // =========================================================================
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    // T-Shirt Front / Back View Switcher
    const viewToggleBtns = card.querySelectorAll('.view-toggle-pill .view-btn');
    const viewImg = card.querySelector('.product-image');
    if (viewToggleBtns.length && viewImg) {
      viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          viewToggleBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const newSrc = this.getAttribute('data-src');
          const newAlt = this.getAttribute('data-alt');
          if (newSrc) {
            viewImg.src = newSrc;
            if (newAlt) viewImg.alt = newAlt;
          }
        });
      });
    }

    // Size pill selection
    const sizePills = card.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
      pill.addEventListener('click', function () {
        sizePills.forEach(p => {
          p.classList.remove('active');
          p.removeAttribute('aria-checked');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-checked', 'true');
      });
    });

    // Quantity stepper
    const minusBtn = card.querySelector('.btn-minus');
    const plusBtn = card.querySelector('.btn-plus');
    const qtyInput = card.querySelector('.qty-input');

    if (minusBtn && plusBtn && qtyInput) {
      minusBtn.addEventListener('click', function () {
        let current = parseInt(qtyInput.value, 10) || 1;
        if (current > 1) {
          qtyInput.value = current - 1;
        }
      });

      plusBtn.addEventListener('click', function () {
        let current = parseInt(qtyInput.value, 10) || 1;
        if (current < 10) {
          qtyInput.value = current + 1;
        }
      });
    }

    // Order via WhatsApp button
    const orderBtn = card.querySelector('.btn-order-wa');
    if (orderBtn) {
      orderBtn.addEventListener('click', function () {
        const productName = card.getAttribute('data-product-name') || 'Official T-Shirt';
        const activeSizePill = card.querySelector('.size-pill.active');
        const selectedSize = activeSizePill ? activeSizePill.getAttribute('data-size') : '';
        const sizeLine = selectedSize ? `Size: ${selectedSize}\n` : '';
        const quantity = qtyInput ? qtyInput.value : '1';
        
        const nameInput = card.querySelector('.customer-input-group input');
        let customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : '';

        if (!customerName) {
          customerName = prompt('Silakan masukkan nama Anda untuk pemesanan:', '') || 'Teman IKTGM';
        }

        // WhatsApp message template in Indonesian as specified in guide
        const waMessage = 
`Halo panitia IKTGM FEST!

Saya mau order merchandise:

Produk: ${productName}
${sizeLine}Jumlah: ${quantity}
Nama: ${customerName}

Mohon info untuk konfirmasi pesanan dan pembayaran ya. Terima kasih!`;

        const waUrl = `https://wa.me/${MERCH_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }
  });

  // =========================================================================
  // 3. Sponsorship WhatsApp Flow
  // =========================================================================
  const sponsorBtn = document.getElementById('btn-sponsor-wa');
  if (sponsorBtn) {
    sponsorBtn.addEventListener('click', function () {
      const brandInput = document.getElementById('sponsor-brand');
      const picInput = document.getElementById('sponsor-pic');
      const fieldInput = document.getElementById('sponsor-field');
      const notesInput = document.getElementById('sponsor-notes');

      const brand = brandInput && brandInput.value.trim() ? brandInput.value.trim() : '';
      const pic = picInput && picInput.value.trim() ? picInput.value.trim() : '';
      const field = fieldInput && fieldInput.value.trim() ? fieldInput.value.trim() : '-';
      const notes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'Sponsorship & Brand Partnership';

      if (!brand || !pic) {
        alert('Mohon lengkapi Nama Brand dan Nama PIC sebelum melanjutkan ke WhatsApp.');
        if (!brand && brandInput) brandInput.focus();
        else if (!pic && picInput) picInput.focus();
        return;
      }

      // Sponsor WhatsApp template as specified in guide
      const sponsorMessage =
`Halo panitia IKTGM FEST VOL. 2!

Saya tertarik untuk menjalin kerja sama sponsorship dengan IKTGM FEST.

Nama brand/perusahaan: ${brand}
Nama PIC: ${pic}
Bidang usaha: ${field}
Bentuk kerja sama yang ingin ditawarkan: ${notes}

Mohon informasi lebih lanjut mengenai proposal sponsorship dan pilihan partnership yang tersedia. Terima kasih!`;

      const waUrl = `https://wa.me/${SPONSOR_WHATSAPP}?text=${encodeURIComponent(sponsorMessage)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

})();
