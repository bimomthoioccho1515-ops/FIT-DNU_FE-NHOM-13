document.addEventListener('DOMContentLoaded', () => {
  const megaDropdown = document.querySelector('.mega-dropdown');
  const menuButton = document.querySelector('.mega-dropdown .dropbtn');
  const content = document.querySelector('.mega-dropdown-content');
  const header = document.querySelector('.main-header');

  if (!megaDropdown || !menuButton || !content || !header) {
    return;
  }

  function updateDropdownPosition() {
    const headerRect = header.getBoundingClientRect();
    content.style.top = `${headerRect.bottom}px`;
  }

  updateDropdownPosition();
  window.addEventListener('resize', updateDropdownPosition);

  menuButton.addEventListener('mouseover', () => {
    updateDropdownPosition();
  });

  window.addEventListener('scroll', () => {
    const computed = getComputedStyle(content);
    if (computed.visibility === 'visible' && computed.opacity === '1') {
      updateDropdownPosition();
    }
  });

  document.querySelectorAll('.mega-dropdown-content a').forEach(link => {
    link.addEventListener('click', () => {
      content.style.display = 'none';
      content.style.opacity = '0';
      content.style.visibility = 'hidden';
    });
  });
});