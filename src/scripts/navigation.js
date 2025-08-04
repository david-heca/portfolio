// Navigation functionality
export function initNavigation() {
  const nav = document.getElementById('navigation');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!nav || !mobileBtn || !mobileMenu) return;

  let isMenuOpen = false;

  // Show/hide navigation on scroll
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const heroHeight = window.innerHeight;
    
    if (scroll > heroHeight) {
      nav.classList.remove('-translate-y-full');
    } else {
      nav.classList.add('-translate-y-full');
      if (isMenuOpen) closeMobileMenu();
    }
  });

  // Mobile menu toggle
  mobileBtn.addEventListener('click', () => {
    isMenuOpen ? closeMobileMenu() : openMobileMenu();
  });

  function openMobileMenu() {
    isMenuOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    toggleIcons(true);
  }

  function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.style.maxHeight = '0px';
    toggleIcons(false);
  }

  function toggleIcons(isOpen) {
    const menuIcon = mobileBtn.querySelector('.menu-icon');
    const closeIcon = mobileBtn.querySelector('.close-icon');
    
    if (menuIcon && closeIcon) {
      menuIcon.classList.toggle('hidden', isOpen);
      closeIcon.classList.toggle('hidden', !isOpen);
    }
  }

  // Close menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
