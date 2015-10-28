/*
  ZetaPush Weak Authentication Class v1.0
  Javascript WeakAuthentication Class for ZetaPush
  Grégory Houllier - 2015
*/
import zp from '../zetapush'

export default class WeakAuthentification {
  constructor(deploymentId) {
    this._deploymentId = deploymentId
    this._authType = `${zp.getBusinessId()}.${_deploymentId}.weak`

    zp.on('/meta/handshake', (message) => {
      if (message.successful) {
        const { publicToken, token, userId } = message.ext.authentication
        this._publicToken = publicToken
        this._token = token
        this._userId = userId
      }
    })

    zp.on(zp.generateChannel(_deploymentId, 'control'), (message) => {
      if (zp.isConnected(_authType)) {
        zp.reconnect()
      }
    })

    zp.on(zp.generateChannel(_deploymentId, 'release'), (message) => {
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
