/*
  ZetaPush Generic Service Class v1.0
  Mickael Morvan, Grégory Houllier - 2015
*/
;(function(zp) {
  /**
   * @class ZetaPushService
   */
  class ZetaPushService {
    /**
     * @constructor
     * @param String deploymentId
     */
    constructor(deploymentId) {
      this.deploymentId = deploymentId
      this.subscriptions = []
    }
    /**
     * Add subscription for a specific verb
     * @param String verb
     * @param Function callback
     * @return Object subscription
     */
    on(verb, callback) {
      const channel = zp.generateChannel(this.deploymentId, verb)
      const subscription = zp.on(channel, callback)

      this.subscriptions.push(subscription)

      return subscription
    }
    /**
     * Unsubscribe ZetaPush subscription
     * @param Object subscription
     * @return void
     */
    off(subscription) {
      return zp.off(subscription)
    }
    /**
     * Send message for a specific verb
     * @param String verb
     * @param Object params
     * @return void
     */
    send(verb, params = {}) {
      const channel = zp.generateChannel(this.deploymentId, verb)

      zp.send(channel, params)
    }
    /**
     * Shortcut to handle error
     * @param Function callback
     * @return Object subscription
     */
    onError(callback) {
      return this.on('error', callback)
    }
    /**
     * Unsubscribe all ZetaPush subscriptions
     * @return void
     */
    releaseService() {
      this.subscriptions.forEach((subscription) => {
        this.off(subscription)
      })
    }
  }

  zp.service.Generic = ZetaPushService
}(window.zp))
