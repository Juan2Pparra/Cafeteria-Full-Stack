$(document).ready(function () {
  $('#loginForm').submit(function (e) {
    e.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (res) {
        localStorage.setItem('token', res.token);
        if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
        toast('ok', 'Login exitoso', 'Bienvenido 👋');
        setTimeout(() => window.location.href = 'index.html', 600);
      },
      error: function (err) {
        console.log(err.responseJSON || err);
        toast('danger', 'Error', err.responseJSON?.error || 'Error al iniciar sesión');
      }
    });
  });
});
