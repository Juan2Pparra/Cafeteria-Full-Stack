$(document).ready(function () {
  const contacto = $('#contacto');
  if (!contacto.length) return;

  // fondo “parallax” suave con scroll
  contacto.css({
    backgroundImage: "url('/img/bg-contacto.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center 0px'
  });

  $(window).on('scroll', function () {
    const top = $(window).scrollTop();
    const off = contacto.offset().top;
    const h = contacto.outerHeight();

    if (top + $(window).height() >= off && top <= off + h) {
      const pos = -(top - off) * 0.18;
      contacto.css('background-position', 'center ' + pos + 'px');
    }
  });
});
