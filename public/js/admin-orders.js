$(document).ready(function () {
  requireAdminOrRedirect();
  cargarPedidos();
});

function getToken(){ return localStorage.getItem('token'); }
function logout(){ localStorage.clear(); window.location.href='login.html'; }

function requireAdminOrRedirect(){
  const token = getToken();
  if (!token) return (window.location.href='login.html');

  $.ajax({
    url:'/api/auth/me',
    method:'GET',
    headers:{ Authorization:'Bearer '+token },
    success:function(res){
      if (!res.user || res.user.role !== 'admin'){
        toast('danger','Acceso denegado','No eres admin');
        setTimeout(()=> window.location.href='index.html', 600);
      }
    },
    error:function(){
      localStorage.clear();
      window.location.href='login.html';
    }
  });
}

function cargarPedidos(){
  const token = getToken();
  $('#adminOrders').html('<p class="helper">Cargando...</p>');

  $.ajax({
    url:'/api/orders',
    method:'GET',
    headers:{ Authorization:'Bearer '+token },
    success:function(list){
      if (!Array.isArray(list) || !list.length){
        $('#adminOrders').html(`<div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px;">
          <h3>Sin pedidos</h3><p class="helper" style="margin-top:8px;">Aún no han comprado.</p>
        </div>`);
        return;
      }

      let html = `
        <table class="table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
      `;

      list.forEach(o=>{
        const idShort = String(o._id||'').slice(-6);
        const cust = o.customer || {};
        const total = Number(o.total||0);
        const status = o.status || 'pendiente';

        html += `
          <tr>
            <td><b>#${idShort}</b><div class="helper" style="margin-top:4px;">${o.createdAt ? new Date(o.createdAt).toLocaleString():''}</div></td>
            <td>${escapeHtml(cust.nombre||'')}</td>
            <td>${escapeHtml(cust.telefono||'')}</td>
            <td>${escapeHtml(cust.direccion||'')}${cust.referencia ? `<div class="helper" style="margin-top:4px;">${escapeHtml(cust.referencia)}</div>`:''}</td>
            <td><b>${formatMoney(total)}</b></td>
            <td>
              <select class="select" onchange="cambiarEstado('${o._id}', this.value)">
                ${opt('pendiente', status)}
                ${opt('preparando', status)}
                ${opt('listo', status)}
                ${opt('entregado', status)}
                ${opt('cancelado', status)}
              </select>
            </td>
            <td>
              <button class="btn-mini" onclick='verDetalle(${JSON.stringify(o).replaceAll("'", "\\'")})'>
                <i class="fa-solid fa-eye"></i> Ver
              </button>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      $('#adminOrders').html(html);
    },
    error:function(err){
      console.log(err.responseJSON||err);
      toast('danger','Error','No se pudieron cargar pedidos');
    }
  });
}

function opt(val, current){
  const sel = val === current ? 'selected' : '';
  return `<option value="${val}" ${sel}>${val}</option>`;
}

function cambiarEstado(id, status){
  const token = getToken();

  $.ajax({
    url: '/api/orders/' + id + '/status',
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token },
    contentType: 'application/json',
    data: JSON.stringify({ status }),
    success: function(){
      toast('ok','Estado actualizado', `Ahora está: ${status}`);
    },
    error: function(err){
      console.log(err.responseJSON||err);
      toast('danger','Error','No se pudo actualizar el estado');
    }
  });
}

function verDetalle(o){
  const items = o.items || [];
  let rows = '';
  items.forEach(it=>{
    const n = it.nombre || it.product?.nombre || 'Producto';
    const cant = Number(it.cantidad||1);
    const az = it.azucar ? 'Con azúcar' : 'Sin azúcar';
    const sub = Number((it.precio||0) * cant);
    rows += `<tr><td>${escapeHtml(n)}</td><td>x${cant}</td><td>${az}</td><td><b>${formatMoney(sub)}</b></td></tr>`;
  });

  const html = `
    <div class="modal" id="modalDetalle">
      <div class="box">
        <div class="top">
          <b>Detalle pedido</b>
          <button class="close" onclick="cerrarModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="content" style="grid-template-columns:1fr;">
          <div class="panel" style="background:rgba(255,255,255,0.03); border-radius:18px;">
            <table class="table">
              <thead><tr><th>Producto</th><th>Cant.</th><th>Azúcar</th><th>Subtotal</th></tr></thead>
              <tbody>
                ${rows}
                <tr><td colspan="3" style="text-align:right;"><b>Total</b></td><td><b>${formatMoney(o.total||0)}</b></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  $('body').append(html);
  $(document).on('keyup.adminModal', function(e){ if(e.which===27) cerrarModal(); });
  $('#modalDetalle').on('click', function(e){ if(e.target.id==='modalDetalle') cerrarModal(); });
}
function cerrarModal(){
  $('#modalDetalle').remove();
  $(document).off('keyup.adminModal');
}

function escapeHtml(str){
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
}
function formatMoney(n){
  try { return new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP' }).format(Number(n)||0); }
  catch { return '$' + (Number(n)||0); }
}
