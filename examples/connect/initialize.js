(function main(app) {
  // # Étape - 02

  // Identifiant de votre organisation
  var ZP_BUSINESS_ID = '2uMaPJfp';
  // Niveau de log de ZetaPush
  var ZP_DEBUG_LEVEL = 'info';
  // Initialization of ZetaPush connection with a log level parameter
  zp.init(ZP_BUSINESS_ID, ZP_DEBUG_LEVEL);
}(window.app = window.app || {}));
