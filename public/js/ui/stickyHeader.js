$(document).ready(function () {
  const fixedHeader = $('#fixedHeader');
  const menuOffsetTop = $('#menu').length ? $('#menu').offset().top : 400;

  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= menuOffsetTop - 40) {
      fixedHeader.css('margin-top', 0);
    } else if ($(window).scrollTop() <= menuOffsetTop / 2) {
      fixedHeader.css('margin-top', '-90px');
    }
  });
});
