(function main(app) {
  // # Étape - 03

  var ZP_RESSOURCE_ID = 'zp:ressource-id';
  var ZP_TOKEN = 'zp:token';

  // ZetaPush events

  zp.onHandshake(function(message) {
    console.log('onHandshake', message);
  });
  zp.onConnected(function(message) {
    console.log('onConnected', message);

    localStorage.setItem(ZP_TOKEN, authentification.getToken());
  });

  var ZP_AUTHENTIFICATION_DEPLOYMENT_ID = 'DBdP';
  var authentification = new zp.authent.Simple(ZP_AUTHENTIFICATION_DEPLOYMENT_ID);

  // Gestion de la soumission du formulaire

  var $form = document.querySelector('form')
  var $login = document.querySelector('[name="login"]')
  var $password = document.querySelector('[name="password"]')

  $form.addEventListener('submit', onSubmit);

  function onSubmit(event) {
    event.preventDefault();

    var data = authentification.getConnectionData($login.value, $password.value, getResourceId());
    zp.connect(data);
  }

  function getResourceId() {
    var id = localStorage.getItem(ZP_RESSOURCE_ID);
    if (null === id) {
      id = zp.makeResourceId();
      localStorage.setItem(ZP_RESSOURCE_ID, id)
    }
    return id;
  }



  // Exports
  app.authentification = authentification;
  app.getResourceId = getResourceId;
}(window.app = window.app || {}));
