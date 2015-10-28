/*
  ZetaPush Weak Authentication Class v1.0
  Javascript WeakAuthentication Class for ZetaPush
  Grégory Houllier - 2015
*/
import zp from '../zetapush'

export default class SimpleAuthentification {
  constructor(deploymentId) {
    this._deploymentId = deploymentId
    this._authType = `${zp.getBusinessId()}.${this._deploymentId}.simple`

    zp.on('/meta/handshake', (message) {
      if (message.successful) {
        const { token, userId } = message.ext.authentication
        this._token = token
        this._userId = userId
      }
    })
  }
  getConnectionData(login, password, resource = null) {
    const action = 'authenticate'
    const type = this._authType
    let data = { login, password }

    // If parameters == 2, the first parameter is a connection token
    if (null === resource) {
      data = {
        token: login
      }
      resource = password
    }

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
}

zp.authent.Simple = SimpleAuthentification
