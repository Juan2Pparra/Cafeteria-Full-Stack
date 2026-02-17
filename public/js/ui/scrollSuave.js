$(document).ready(function () {
  $('a.volver-arriba').on('click', function (e) {
    e.preventDefault();
    $('html, body').stop().animate({ scrollTop: 0 }, 900);
  });

  $('a.scroll-suave').on('click', function (e) {
    e.preventDefault();
    const target = $($(this).attr('href'));
    if (!target.length) return;
    const top = target.offset().top - 30;
    $('html, body').stop().animate({ scrollTop: top }, 900);
  });
});
