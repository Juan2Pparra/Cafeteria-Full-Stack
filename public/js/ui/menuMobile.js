$(document).ready(function () {
  let abierto = false;

  $('#btnMenu').on('click', function (e) {
    e.preventDefault();
    if (!abierto) {
      $('.menu-mobile .menu-principal').animate({ left: 0 }, 260, function () {
        abierto = true;
      });
    } else {
      $('.menu-mobile .menu-principal').animate({ left: '-100%' }, 260, function () {
        abierto = false;
      });
    }
  });

  $('.menu-mobile .menu-principal a').on('click', function () {
    $('.menu-mobile .menu-principal').animate({ left: '-100%' }, 260, function () {
      abierto = false;
    });
  });

  // logout mobile (si existe)
  $('#m-logout').on('click', function (e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
