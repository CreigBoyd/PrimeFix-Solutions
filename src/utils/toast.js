/**
 * PrimeFix Lightweight Toast System
 * @param {string} message - Text to display in the toast
 * @param {string} type - Theme variant ('teal')
 * @param {number} duration - Display time in ms (default: 3200ms)
 */
export function showToast(message, type = 'teal', duration = 3200) {
  // Ensure global container exists
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Build toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  // SVG Checkmark Icon
  const icon = `
    <span class="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
  `;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  // Trigger enter animation on next repaint frame
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Handle auto-removal
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    }, { once: true });
  }, duration);
}