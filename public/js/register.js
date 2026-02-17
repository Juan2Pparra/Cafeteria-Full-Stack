$(document).ready(function () {
  $('#registerForm').submit(function (e) {
    e.preventDefault();

    const nombre = $('#nombre').val();
    const email = $('#email').val();
    const password = $('#password').val();

    // backend espera "name" (tu register usa name)
    $.ajax({
      url: '/api/auth/register',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ name: nombre, email, password }),
      success: function () {
        toast('ok', 'Cuenta creada', 'Ahora inicia sesión');
        setTimeout(() => window.location.href = 'login.html', 700);
      },
      error: function (err) {
        console.log(err.responseJSON || err);
        toast('danger', 'Error', err.responseJSON?.error || 'Error al registrarse');
      }
    });
  });
});
