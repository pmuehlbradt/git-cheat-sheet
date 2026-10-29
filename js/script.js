// Copy controls are available only when the browser supports clipboard access.
if (navigator.clipboard && window.isSecureContext) {
  document.querySelectorAll('pre').forEach((block) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy commands');

    button.addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      try {
        await navigator.clipboard.writeText(block.querySelector('code').textContent);
        status.textContent = 'Commands copied to clipboard.';
        button.textContent = 'Copied!';
        window.setTimeout(() => { button.textContent = 'Copy'; }, 2000);
      } catch {
        status.textContent = 'Could not copy. Select the commands to copy them manually.';
      }
    });

    block.append(button);
  });
}

// Native anchors handle navigation; this only marks the section in view.
const navigationLinks = [...document.querySelectorAll('.nav-group a')];
const navigationSections = navigationLinks.map((link) =>
  document.getElementById(link.hash.slice(1))
);

function updateActiveSection() {
  let activeSection = navigationSections[0];
  for (const section of navigationSections) {
    if (section.getBoundingClientRect().top <= 120 &&
        section.getBoundingClientRect().top >= activeSection.getBoundingClientRect().top) {
      activeSection = section;
    }
  }
  navigationLinks.forEach((link) => {
    if (link.hash === `#${activeSection.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

let navigationUpdatePending = false;
window.addEventListener('scroll', () => {
  if (navigationUpdatePending) return;
  navigationUpdatePending = true;
  window.requestAnimationFrame(() => {
    updateActiveSection();
    navigationUpdatePending = false;
  });
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
