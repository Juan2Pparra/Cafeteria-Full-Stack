window.toast = function (type, title, message) {
  const root = document.getElementById('toasts');
  if (!root) return alert(title + ': ' + message);

  const icons = {
    ok: 'fa-circle-check',
    warn: 'fa-triangle-exclamation',
    danger: 'fa-circle-xmark'
  };

  const el = document.createElement('div');
  el.className = `toast ${type || 'ok'}`;
  el.innerHTML = `
    <div class="ico"><i class="fa-solid ${icons[type] || icons.ok}"></i></div>
    <div class="txt">
      <b>${title || 'Listo'}</b>
      <span>${message || ''}</span>
    </div>
  `;

  root.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'all .25s ease';
  }, 2800);

  setTimeout(() => el.remove(), 3200);
};
