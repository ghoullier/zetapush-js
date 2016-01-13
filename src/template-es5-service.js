;(function () {
  'use strict';

  /**
   * ${ServiceDescription}
   *
   * @class ZetaPush${ServiceName}Service
   * @extends zp.service.Generic
   * @constructor
   * @param String deploymentId
   */
  function ZetaPush${ServiceName}Service(deploymentId) {
    // ES5 Class preconditions
    if (!(this instanceof ZetaPush${ServiceName}Service)) {
      throw new TypeError('Cannot call a class as a function')
    }
    // ES5 super()
    zp.service.Generic.call(this, deploymentId)
  }

  /**
   * @extends zp.service.Generic
   */
  ZetaPush${ServiceName}Service.prototype = Object.create(zp.service.Generic.prototype)

  /**
   * ${VerbImplementatioNotes}
   * @param Function callback
   * @return Object subscription
   */
  ZetaPush${ServiceName}Service.prototype.on${VerbToPascalCase} = function(callback) {
    return this.on('${Verb}', callback)
  }

  /**
   * ${VerbImplementatioNotes}
   * @param Object callback
   * @return void
   */
  ZetaPush${ServiceName}Service.prototype.${Verb} = function(parameters) {
    this.send('${Verb}', parameters)
  }

  zp.service.${ServiceName} = ZetaPush${ServiceName}Service;
}())
