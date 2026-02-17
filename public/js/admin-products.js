$(document).ready(function () {
  requireAdminOrRedirect();

  cargarProductos();

  $('#btnGuardar').on('click', guardarProducto);
  $('#btnCancelar').on('click', limpiarFormulario);

  // preview de imagen
  $('#imagenFile').on('change', function () {
    const f = this.files?.[0];
    if (!f) return hidePreview();
    const url = URL.createObjectURL(f);
    showPreview(url);
  });

  // pegar imagen Ctrl+V
  document.addEventListener('paste', function (event) {
    const items = event.clipboardData?.items || [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        const input = document.getElementById('imagenFile');

        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;

        showPreview(URL.createObjectURL(file));
        toast('ok', 'Imagen pegada', 'Listo para guardar');
      }
    }
  });
});

function getToken(){ return localStorage.getItem('token'); }
function logout(){ localStorage.clear(); window.location.href = 'login.html'; }

function requireAdminOrRedirect(){
  const token = getToken();
  if (!token) return (window.location.href='login.html');

  $.ajax({
    url: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    success: function (res) {
      if (!res.user || res.user.role !== 'admin') {
        toast('danger','Acceso denegado','No eres admin');
        setTimeout(()=> window.location.href='index.html', 600);
      }
    },
    error: function () {
      localStorage.clear();
      window.location.href='login.html';
    }
  });
}

function showPreview(url){
  $('#previewImg').attr('src', url);
  $('#previewBox').show();
}
function hidePreview(){
  $('#previewImg').attr('src', '');
  $('#previewBox').hide();
}

function cargarProductos(){
  $('#productsGrid').html('<p class="helper">Cargando...</p>');

  $.ajax({
    url:'/api/products',
    method:'GET',
    success:function(list){
      if (!Array.isArray(list) || !list.length){
        $('#productsGrid').html(`<div class="panel" style="grid-column:1/-1; background:rgba(255,255,255,0.03); border-radius:18px;">
          <h3>Sin productos</h3><p class="helper" style="margin-top:8px;">Crea el primero.</p>
        </div>`);
        return;
      }

      let html='';
      list.forEach(p=>{
        const img = p.imagen || 'https://via.placeholder.com/600x400';
        html += `
          <div class="card">
            <div class="media"><img src="${img}" /><div class="badge"><i class="fa-solid fa-tag"></i> ${formatMoney(p.precio||0)}</div></div>
            <div class="content">
              <h3>${escapeHtml(p.nombre||'')}</h3>
              <p>${escapeHtml(p.descripcion||'')}</p>
              <div class="actions">
                <button class="btn-mini" onclick='editarProducto(${JSON.stringify(p).replaceAll("'", "\\'")})'>
                  <i class="fa-solid fa-pen"></i> Editar
                </button>
                <button class="btn-mini" onclick="eliminarProducto('${p._id}')">
                  <i class="fa-solid fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        `;
      });

      $('#productsGrid').html(html);
    },
    error:function(err){
      console.log(err.responseJSON||err);
      toast('danger','Error','No se pudieron cargar productos');
    }
  });
}

function editarProducto(p){
  $('#productId').val(p._id);
  $('#nombre').val(p.nombre||'');
  $('#descripcion').val(p.descripcion||'');
  $('#precio').val(p.precio||'');
  hidePreview();
  $('#btnCancelar').show();
  toast('ok','Edición','Modifica y guarda');
}

function limpiarFormulario(){
  $('#productId').val('');
  $('#nombre').val('');
  $('#descripcion').val('');
  $('#precio').val('');
  document.getElementById('imagenFile').value = '';
  hidePreview();
  $('#btnCancelar').hide();
}

function guardarProducto(){
  const token = getToken();
  const id = $('#productId').val();
  const isEdit = Boolean(id);

  const nombre = $('#nombre').val().trim();
  const descripcion = $('#descripcion').val().trim();
  const precio = $('#precio').val();

  if (!nombre || !descripcion || !precio){
    toast('warn','Faltan datos','Nombre, descripción y precio son obligatorios');
    return;
  }

  const fd = new FormData();
  fd.append('nombre', nombre);
  fd.append('descripcion', descripcion);
  fd.append('precio', precio);

  const fileInput = document.getElementById('imagenFile');
  if (fileInput.files[0]) fd.append('imagen', fileInput.files[0]);

  $('#btnGuardar').prop('disabled', true).css('opacity',0.7);

  $.ajax({
    url: isEdit ? '/api/products/' + id : '/api/products',
    method: isEdit ? 'PUT' : 'POST',
    headers: { Authorization: 'Bearer ' + token },
    processData: false,
    contentType: false,
    data: fd,
    success: function () {
      toast('ok','Listo', isEdit ? 'Producto actualizado' : 'Producto creado');
      $('#btnGuardar').prop('disabled', false).css('opacity',1);
      limpiarFormulario();
      cargarProductos();
    },
    error: function (err) {
      console.log(err.responseJSON||err);
      toast('danger','Error', err.responseJSON?.message || 'No se pudo guardar');
      $('#btnGuardar').prop('disabled', false).css('opacity',1);
    }
  });
}

function eliminarProducto(id){
  const token = getToken();
  if (!confirm('¿Eliminar producto?')) return;

  $.ajax({
    url:'/api/products/' + id,
    method:'DELETE',
    headers:{ Authorization: 'Bearer ' + token },
    success:function(){
      toast('ok','Eliminado','Producto eliminado');
      cargarProductos();
    },
    error:function(err){
      console.log(err.responseJSON||err);
      toast('danger','Error','No se pudo eliminar');
    }
  });
}

function escapeHtml(str){
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
}
function formatMoney(n){
  try { return new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP' }).format(Number(n)||0); }
  catch { return '$' + (Number(n)||0); }
}
