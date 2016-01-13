/*
  ZetaPush Weak Authentication Class v1.0
  Grégory Houllier - 2015
*/
;(function(zp) {
  /**
   * @class WeakAuthentification
   */
  class WeakAuthentification {
    constructor(deploymentId) {
      this._deploymentId = deploymentId
      this._authType = `${zp.getBusinessId()}.${_deploymentId}.weak`

      zp.on('/meta/handshake', ({ ext, successful }) => {
        if (successful) {
          const { publicToken, token, userId } = ext.authentication
          this._publicToken = publicToken
          this._token = token
          this._userId = userId
        }
      })

      zp.on(zp.generateChannel(_deploymentId, 'control'), () => {
        if (zp.isConnected(_authType)) {
          zp.reconnect()
        }
      })

      zp.on(zp.generateChannel(_deploymentId, 'release'), () => {
        if (zp.isConnected(_authType)) {
          zp.reconnect()
        }
      })
    }
    getConnectionData(token, resource){
      const action = 'authenticate'
      const data = {
        token: this._token || token
      }
      const type = this._authType
      return {
        ext: {
          authentication: { action, type, resource, data }
        }
      }
    }
    getUserId() {
      return this._userId
    }
    getToken() {
      return this._token
    }
    getPublicToken() {
      return this._publicToken
    }
    getQRCodeUrl(publicToken) {
      return `${zp.getRestServerUrl()}/${zp.getBusinessId()}/${this._deploymentId}/weak/qrcode/${publicToken}`
    }
  }

  zp.authent.Weak = WeakAuthentification
}(window.zp))
