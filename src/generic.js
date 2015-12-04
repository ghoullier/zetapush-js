/*
  ZetaPush Generic Service Class v1.0
  Grégory Houllier - 2015
*/
(function(zp) {
  /**
   * @class GenericService
   */
  class GenericService {
    constructor(deploymentId) {
      this._deploymentId = deploymentId
      this._subscribeKeyArray = []
    }
    on(verb, callback) {
      return zp.on(zp.generateChannel(this._deploymentId,verb), callback)
    }
    off(value) {
      return zp.off(value)
    }
    send(verb, objectParam) {
      zp.send(zp.generateChannel(this._deploymentId,verb), objectParam)
    }
    onError(callback) {
      this._subscribeKeyArray.push(this.on('error', callback))
    }
    releaseService() {
      this._subscribeKeyArray.forEach((value, key) => {
        this.off(value);
      })
    }
  }

  zp.service.Generic = GenericService
}(window.zp))
