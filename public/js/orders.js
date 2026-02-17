$(document).ready(function () {
  const token = localStorage.getItem('token');
  if (!token) return (window.location.href = 'login.html');
  cargarMisPedidos();
});

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

function cargarMisPedidos() {
  const token = localStorage.getItem('token');
  $('#orders-container').html('<p class="helper">Cargando...</p>');

  $.ajax({
    url: '/api/orders/my',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    success: function (orders) {
      if (!Array.isArray(orders) || !orders.length) {
        $('#orders-container').html(`
          <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px;">
            <h3>Aún no tienes pedidos</h3>
            <p class="helper" style="margin-top:8px;">Ve a la tienda y realiza tu primer pedido.</p>
          </div>
        `);
        return;
      }

      let html = '';
      orders.forEach((o) => {
        const idShort = String(o._id || '').slice(-6);
        const fecha = o.createdAt ? new Date(o.createdAt).toLocaleString() : '';
        const status = o.status || 'pendiente';
        const total = Number(o.total || 0);

        const cust = o.customer || {};
        const items = o.items || [];

        let itemsHtml = '';
        items.forEach((it) => {
          const n = it.nombre || it.product?.nombre || 'Producto';
          const cantidad = Number(it.cantidad || 1);
          const az = it.azucar ? 'Con azúcar' : 'Sin azúcar';
          const sub = Number((it.precio || 0) * cantidad);
          itemsHtml += `
            <tr>
              <td>${escapeHtml(n)}</td>
              <td>x${cantidad}</td>
              <td>${az}</td>
              <td><b>${formatMoney(sub)}</b></td>
            </tr>
          `;
        });

        html += `
          <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; align-items:center;">
              <div>
                <div class="badge" style="position:static; display:inline-flex;">
                  <i class="fa-solid fa-receipt"></i> Pedido #${idShort}
                </div>
                <div class="helper" style="margin-top:8px;">${fecha}</div>
              </div>
              <div style="text-align:right;">
                <div class="badge" style="position:static; display:inline-flex;">
                  <i class="fa-solid fa-circle-info"></i> Estado: <b style="margin-left:6px;">${escapeHtml(status)}</b>
                </div>
                <div style="height:8px;"></div>
                <div style="font-size:1.2rem;"><b>${formatMoney(total)}</b></div>
              </div>
            </div>

            <div style="height:12px;"></div>

            <div class="row">
              <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px;">
                <h3 style="font-size:1.05rem;">Datos de entrega</h3>
                <p class="helper" style="margin-top:8px; line-height:1.8;">
                  <b>Nombre:</b> ${escapeHtml(cust.nombre || '')}<br/>
                  <b>Teléfono:</b> ${escapeHtml(cust.telefono || '')}<br/>
                  <b>Dirección:</b> ${escapeHtml(cust.direccion || '')}<br/>
                  ${cust.referencia ? `<b>Referencia:</b> ${escapeHtml(cust.referencia)}<br/>` : ``}
                </p>
              </div>

              <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px;">
                <h3 style="font-size:1.05rem;">Mini factura</h3>
                <table class="table" style="margin-top:10px;">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Azúcar</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr>
                      <td colspan="3" style="text-align:right;"><b>Total</b></td>
                      <td><b>${formatMoney(total)}</b></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      });

      $('#orders-container').html(html);
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', 'No se pudieron cargar tus pedidos');
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
