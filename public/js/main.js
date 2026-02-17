$(document).ready(function () {
  const token = localStorage.getItem('token');

  // auth buttons desktop
  if (token) {
    $('#auth-buttons').hide();
    $('#user-buttons').show();
    $('#m-login').hide();
    $('#m-register').hide();
    $('#m-logout').show();
  } else {
    $('#auth-buttons').show();
    $('#user-buttons').hide();
    $('#m-login').show();
    $('#m-register').show();
    $('#m-logout').hide();
  }

  // role detect
  if (token) {
    $.ajax({
      url: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      success: function (res) {
        const isAdmin = res.user && res.user.role === 'admin';
        if (isAdmin) {
          $('#admin-products-link').show();
          $('#admin-orders-link').show();
          $('#m-admin-products').show();
          $('#m-admin-orders').show();
        }
      },
      error: function () {
        localStorage.clear();
        $('#auth-buttons').show();
        $('#user-buttons').hide();
        $('#m-login').show();
        $('#m-register').show();
        $('#m-logout').hide();
      }
    });
  }

  // products state
  window.__products = [];
  window.__filter = 'all';
  window.__query = '';

  // load products
  loadProducts();

  // search
  $('#searchInput').on('input', function () {
    window.__query = ($(this).val() || '').toLowerCase().trim();
    renderProducts();
  });

  // filter chips
  $('.chip').on('click', function () {
    $('.chip').removeClass('active');
    $(this).addClass('active');
    window.__filter = $(this).data('filter');
    renderProducts();
  });

  // contacto fake submit (solo UI)
  $('#btnEnviar').on('click', function () {
    toast('ok', 'Enviado', '¡Gracias! (UI demo — aún no se guarda en backend)');
    $('#nombre').val(''); $('#email').val(''); $('#mensaje').val('');
  });
});

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

function loadProducts() {
  $.ajax({
    url: '/api/products',
    method: 'GET',
    success: function (productos) {
      window.__products = Array.isArray(productos) ? productos : [];
      renderProducts();
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', 'No se pudieron cargar los productos');
    }
  });
}

function renderProducts() {
  const container = $('#productos-container');
  container.html('');

  let list = [...window.__products];

  // query
  if (window.__query) {
    list = list.filter(p => {
      const n = (p.nombre || '').toLowerCase();
      const d = (p.descripcion || '').toLowerCase();
      return n.includes(window.__query) || d.includes(window.__query);
    });
  }

  // filter
  if (window.__filter === 'price-asc') {
    list.sort((a,b) => (a.precio||0) - (b.precio||0));
  } else if (window.__filter === 'price-desc') {
    list.sort((a,b) => (b.precio||0) - (a.precio||0));
  } else if (window.__filter === 'newest') {
    list.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0));
  }

  if (!list.length) {
    container.html(`<div class="panel" style="grid-column:1/-1; text-align:center;">
      <h3>No hay resultados</h3>
      <p class="helper" style="margin-top:8px;">Prueba con otra búsqueda o filtro.</p>
    </div>`);
    return;
  }

  list.forEach((producto) => {
    const img = producto.imagen || 'https://via.placeholder.com/600x400';
    const id = producto._id;

    const card = `
      <div class="card" data-product-id="${id}">
        <div class="media">
          <img src="${img}" alt="producto" />
          <div class="badge"><i class="fa-solid fa-mug-hot"></i> Recomendado</div>
        </div>
        <div class="content">
          <h3>${escapeHtml(producto.nombre || '')}</h3>
          <p>${escapeHtml(producto.descripcion || '')}</p>

          <div class="price-row">
            <div class="price">${formatMoney(producto.precio || 0)}</div>
            <div class="small">ID: ${String(id).slice(-6)}</div>
          </div>

          <div class="controls">
            <div class="radio-group">
              <label class="radio">
                <input type="radio" name="azucar-${id}" value="true" checked />
                Con azúcar
              </label>
              <label class="radio">
                <input type="radio" name="azucar-${id}" value="false" />
                Sin azúcar
              </label>
            </div>

            <div class="qty">
              <button onclick="cambiarCantidadUI('${id}', -1)"><i class="fa-solid fa-minus"></i></button>
              <span id="qty-${id}">1</span>
              <button onclick="cambiarCantidadUI('${id}', 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>

          <div class="actions">
            <button class="btn-mini" onclick='verProducto("${id}")'>
              <i class="fa-solid fa-eye"></i> Ver
            </button>
            <button class="btn-mini primary" onclick="agregarAlCarrito('${id}')">
              <i class="fa-solid fa-cart-shopping"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    `;

    container.append(card);
  });
}

function verProducto(productId){
  const product = (window.__products || []).find(p => p._id === productId);
  if (!product) return;
  if (typeof window.openProductModal === 'function') {
    window.openProductModal(product);
  }
}

function cambiarCantidadUI(productoId, delta) {
  const el = document.getElementById(`qty-${productoId}`);
  let qty = Number(el.textContent) || 1;
  qty += delta;
  if (qty < 1) qty = 1;
  el.textContent = qty;
}

function agregarAlCarrito(productoId) {
  const token = localStorage.getItem('token');

  if (!token) {
    toast('warn', 'Necesitas login', 'Inicia sesión para agregar al carrito');
    window.location.href = 'login.html';
    return;
  }

  const qty = Number(document.getElementById(`qty-${productoId}`).textContent) || 1;
  const azucarValue = $(`input[name="azucar-${productoId}"]:checked`).val();
  const azucar = azucarValue === 'true';

  $.ajax({
    url: '/api/cart/add',
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    contentType: 'application/json',
    data: JSON.stringify({ productoId, cantidad: qty, azucar }),
    success: function () {
      toast('ok', 'Agregado', 'Producto agregado al carrito 🛒');
    },
    error: function (err) {
      console.log(err.responseJSON || err);
      toast('danger', 'Error', err.responseJSON?.message || 'No se pudo agregar al carrito');
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
