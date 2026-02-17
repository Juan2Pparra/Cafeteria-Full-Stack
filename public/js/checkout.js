$(document).ready(function () {
  const token = localStorage.getItem('token');
  if (!token) return (window.location.href = 'login.html');

  cargarResumen();

  $('#btnConfirmar').on('click', function () {
    confirmarPedido();
  });
});

function cargarResumen() {
  const token = localStorage.getItem('token');

  $('#checkout-resumen').html('<p class="helper">Cargando...</p>');

  $.ajax({
    url: '/api/cart',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    success: function (cart) {
      const items = cart?.items || [];
      if (!items.length) {
        toast('warn', 'Carrito vacío', 'Agrega productos antes de confirmar');
        return setTimeout(() => window.location.href = 'index.html', 700);
      }

      let total = 0;
      let html = '';

      items.forEach((it) => {
        const nombre = it.product?.nombre || 'Producto';
        const precio = Number(it.product?.precio || 0);
        const cantidad = Number(it.cantidad || 1);
        const azucar = it.azucar ? 'Con azúcar' : 'Sin azúcar';
        total += precio * cantidad;

        html += `
          <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; gap:10px;">
              <div>
                <b>${escapeHtml(nombre)}</b>
                <div class="helper" style="margin-top:6px;">${azucar} · x${cantidad}</div>
              </div>
              <div style="text-align:right;">
                <b>${formatMoney(precio * cantidad)}</b>
                <div class="helper" style="margin-top:6px;">${formatMoney(precio)} c/u</div>
              </div>
            </div>
          </div>
        `;
      });

      $('#checkout-resumen').html(html);
      $('#checkout-total').text(formatMoney(total));
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', 'No se pudo cargar el carrito');
    }
  });
}

function confirmarPedido() {
  const token = localStorage.getItem('token');

  const nombre = $('#custNombre').val().trim();
  const telefono = $('#custTelefono').val().trim();
  const direccion = $('#custDireccion').val().trim();
  const referencia = $('#custReferencia').val().trim();

  if (!nombre || !telefono || !direccion) {
    toast('warn', 'Faltan datos', 'Nombre, teléfono y dirección son obligatorios');
    return;
  }

  $('#btnConfirmar').prop('disabled', true).css('opacity', 0.7).text('Procesando...');

  // ✅ crea la orden tomando items del carrito en backend
  $.ajax({
    url: '/api/orders',
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    contentType: 'application/json',
    data: JSON.stringify({
      customer: { nombre, telefono, direccion, referencia }
    }),
    success: function () {
      toast('ok', 'Pedido creado', 'Listo ✅ revisa tu mini-factura');
      setTimeout(() => window.location.href = 'orders.html', 700);
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', err.responseJSON?.message || 'No se pudo crear el pedido');
      $('#btnConfirmar').prop('disabled', false).css('opacity', 1).html('<i class="fa-solid fa-check"></i> Confirmar pedido');
    }
  });
}

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
