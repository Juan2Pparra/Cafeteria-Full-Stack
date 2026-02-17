$(document).ready(function () {
  cargarCarrito();
});

function getToken() {
  return localStorage.getItem('token');
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

function cargarCarrito() {
  const token = getToken();
  if (!token) return (window.location.href = 'login.html');

  $('#cart-items').html('<p class="helper">Cargando...</p>');

  $.ajax({
    url: '/api/cart',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    success: function (cart) {
      const items = cart?.items || [];
      $('#cart-items').html('');

      if (!items.length) {
        $('#cart-items').html(`
          <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px;">
            <h3>Carrito vacío</h3>
            <p class="helper" style="margin-top:8px;">Ve a la tienda y agrega productos.</p>
          </div>
        `);
        $('#btnCheckout').prop('disabled', true).css('opacity', 0.6);
        $('#sum-items').text('0');
        $('#sum-total').text(formatMoney(0));
        return;
      }

      let total = 0;
      let count = 0;

      items.forEach((item) => {
        const nombre = item.product?.nombre || 'Producto';
        const desc = item.product?.descripcion || '';
        const precio = Number(item.product?.precio || 0);
        const cantidad = Number(item.cantidad || 1);
        const azucarTxt = item.azucar ? 'Con azúcar' : 'Sin azúcar';
        const img = item.product?.imagen || 'https://via.placeholder.com/600x400';

        total += precio * cantidad;
        count += cantidad;

        const row = `
          <div class="panel" style="border-radius:18px; margin-bottom:12px; background:rgba(255,255,255,0.03);">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <div style="width:92px; height:92px; border-radius:18px; overflow:hidden; border:1px solid rgba(255,255,255,0.10); background:rgba(0,0,0,0.2);">
                <img src="${img}" style="width:100%; height:100%; object-fit:cover;" />
              </div>

              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; gap:10px;">
                  <div>
                    <h3 style="font-size:1.05rem;">${escapeHtml(nombre)}</h3>
                    <p class="helper" style="margin-top:6px;">${escapeHtml(desc)}</p>
                    <p class="helper" style="margin-top:6px;"><b>${azucarTxt}</b></p>
                  </div>
                  <div style="text-align:right;">
                    <div class="badge" style="position:static; display:inline-flex;">
                      <i class="fa-solid fa-tag"></i> ${formatMoney(precio)}
                    </div>
                  </div>
                </div>

                <div style="height:10px;"></div>

                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                  <div class="qty">
                    <button onclick="cambiarCantidad('${item._id}', ${cantidad - 1})"><i class="fa-solid fa-minus"></i></button>
                    <span>${cantidad}</span>
                    <button onclick="cambiarCantidad('${item._id}', ${cantidad + 1})"><i class="fa-solid fa-plus"></i></button>
                  </div>

                  <button class="btn-mini" onclick="eliminarItem('${item._id}')" style="max-width:160px;">
                    <i class="fa-solid fa-trash"></i> Quitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        $('#cart-items').append(row);
      });

      $('#sum-items').text(String(count));
      $('#sum-total').text(formatMoney(total));
      $('#btnCheckout').prop('disabled', false).css('opacity', 1);
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', 'No se pudo cargar el carrito');
    }
  });
}

function cambiarCantidad(itemId, nuevaCantidad) {
  const token = getToken();
  if (!token) return (window.location.href = 'login.html');
  if (nuevaCantidad < 1) nuevaCantidad = 1;

  $.ajax({
    url: '/api/cart/' + itemId,
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token },
    contentType: 'application/json',
    data: JSON.stringify({ cantidad: nuevaCantidad }),
    success: function () {
      cargarCarrito();
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', 'No se pudo actualizar la cantidad');
    }
  });
}

function eliminarItem(itemId) {
  const token = getToken();
  if (!token) return (window.location.href = 'login.html');

  $.ajax({
    url: '/api/cart/' + itemId,
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
    success: function () {
      toast('ok', 'Listo', 'Producto eliminado del carrito');
      cargarCarrito();
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', 'No se pudo eliminar');
    }
  });
}

// ✅ Nuevo flujo: ir a pantalla de confirmación de datos
function irAConfirmar() {
  window.location.href = 'checkout.html';
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
