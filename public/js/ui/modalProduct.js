// Abre modal con data que le pase main.js
window.openProductModal = function (product) {
  const img = product.imagen || 'https://via.placeholder.com/800x500';
  const html = `
    <div class="modal" id="productModal">
      <div class="box">
        <div class="top">
          <b>${escapeHtml(product.nombre || 'Producto')}</b>
          <button class="close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="content">
          <div class="img"><img src="${img}" alt=""></div>
          <div class="info">
            <div class="badge"><i class="fa-solid fa-tag"></i> ${formatMoney(product.precio || 0)}</div>
            <p>${escapeHtml(product.descripcion || '')}</p>
            <div class="actions">
              <a class="btn btn-ghost" href="#menu" onclick="closeProductModal()">
                <i class="fa-solid fa-magnifying-glass"></i> Seguir viendo
              </a>
              <a class="btn btn-primary" href="cart.html">
                <i class="fa-solid fa-cart-shopping"></i> Ir al carrito
              </a>
            </div>
            <p class="helper" style="margin-top:10px;">Tip: ajusta cantidad y azúcar en la tarjeta para agregar.</p>
          </div>
        </div>
      </div>
    </div>
  `;
  $('body').append(html);

  $('#closeModal').on('click', closeProductModal);
  $(document).on('keyup.productModal', function (e) {
    if (e.which === 27) closeProductModal();
  });
  $('#productModal').on('click', function (e) {
    if (e.target.id === 'productModal') closeProductModal();
  });
};

window.closeProductModal = function () {
  $('#productModal').remove();
  $(document).off('keyup.productModal');
};

function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");
}
function formatMoney(n){
  try { return new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP' }).format(Number(n)||0); }
  catch { return '$' + (Number(n)||0); }
}
