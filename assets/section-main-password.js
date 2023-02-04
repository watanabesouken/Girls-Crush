function showHide(show, hide) {
  var show = document.getElementById(show);
  show.classList.remove("hide");
  show.classList.add("show");
  show.style.display = 'block';

  var hide = document.getElementById(hide);
  hide.classList.remove("show");
  hide.classList.add("hide");
  hide.style.display='none';
}

function passwordToggle(container) {
  container.querySelector('.js-toggle-login').addEventListener('click', function(event) {
    event.preventDefault();

    showHide('login-form', 'register-form');
  });

  container.querySelector('.js-toggle-register').addEventListener('click', function(event) {
    event.preventDefault();

    showHide('register-form', 'login-form');
  });
}

document.querySelectorAll('[data-section-type="password-page"]').forEach(function(container){
  passwordToggle(container);
});

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="password-page"]') ) return false;
  let context = event.target;
  passwordToggle(context);
});
