/*
  ZetaPush Generic Service Class v1.0
  Mickael Morvan, Grégory Houllier - 2015
*/
;(function(zp) {
  /**
   * @class GenericService
   */
  class ZetaPushService {
    constructor(deploymentId) {
      this.deploymentId = deploymentId
      this.subscriptions = []
    }
    on(verb, callback) {
      return zp.on(zp.generateChannel(this.deploymentId, verb), callback)
    }
    off(value) {
      return zp.off(value)
    }
    send(verb, objectParam) {
      zp.send(zp.generateChannel(this.deploymentId, verb), objectParam)
    }
    onError(callback) {
      this.subscriptions.push(this.on('error', callback))
    }
    releaseService() {
      this.subscriptions.forEach((value, key) => {
        this.off(value);
      })
    }
  }

  zp.service.Generic = ZetaPushService
}(window.zp))
