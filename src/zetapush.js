/*
  ZetaPush Generic Service Class v1.0
  Mickael Morvan, Grégory Houllier - 2015
*/
;(function() {
  // @TODO Use ES6 Import
  const cometd = window.cometd
  const log = window.log
  const qwest = window.qwest

  const SERVERS_LIST = []
  const DEFAULT_API_URL = 'http://api.zpush.io/'

  function getRandomIndex(length) {
    return Math.floor(Math.random() * length)
  }

  function getServer(businessId, apiUrl) {
    const url = `${apiUrl}${businessId}`
    const args = {
      dataType: '-',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      responseType: 'json',
      cache: true
    }

    return new Promise((resolve, reject) => {
      qwest.get(url, null, args)
        .then((data) => {
          data.lastCheck = Date.now()
          data.lastBusinessId = businessId
          SERVERS_LIST.push.apply(SERVERS_LIST, data.servers);
          const server = data.servers[getRandomIndex(data.servers.length)]
          resolve(server);
        }, (error) => {
          log.error(`Error retrieving server url list for businessId: ${businessId}`)

          reject(error)
        })
    })
  }

  class ZetaPushCore {
    constructor() {
      this.authent = {}
      this.service = {}
      this.subscriptions = []
      this.clientId = null
      this.connected = false

      cometd.addListener('/meta/connect', (msg) => {
        if (cometd.isDisconnected()) {
          this.connected = false
          log.info('connection closed')
          return
        }

        var wasConnected = this.connected
        this.connected = msg.successful
        if (!wasConnected && this.connected) { // reconnected
          log.info('connection established')
          cometd.notifyListeners('/meta/connected', msg)
          cometd.batch(() => {
            this.refresh()
          })
        }
        else if (wasConnected && !connected) {
          log.warn('connection broken')
        }
      })

      cometd.addListener('/meta/handshake', (handshake) => {
        if (handshake.successful) {
          log.debug('successful handshake', handshake)
          this.clientId = handshake.clientId
        }
        else {
          log.warn('unsuccessful handshake')
          this.clientId = null
        }
      })
    }
    init(businessId, debugLevel = 'info') {
      this.businessId = businessId
      this.debugLevel = debugLevel

      log.setLevel(debugLevel)
    }
    connect(connectionData, apiUrl = DEFAULT_API_URL) {
      if (this.isConnected()) {
        return
      }
      this.connectionData = connectionData

      getServer(this.businessId, apiUrl)
        .then((serverUrl) => {
          this.serverUrl = serverUrl

          if ('debug' === this.debugLevel) {
            cometd.websocketEnabled = false
          }

          cometd.configure({
            url: `${serverUrl}/strd`,
            logLevel: this.debugLevel,
            backoffIncrement: 100,
            maxBackoff: 500,
            appendMessageTypeToURL: false
          })

          cometd.handshake(connectionData)
        })
    }
    onConnected(callback) {
      this.on('/meta/connected', callback)
    }
    onHandshake(callback) {
      this.on('/meta/handshake', callback)
    }
    isConnected(authentType) {
      if (authentType) {
        return (authentType === this.connectionData.ext.authentication.type) && !cometd.isDisconnected()
      }
      return !cometd.isDisconnected()
    }
    generateChannel(deploymentId, verb) {
      return `/service/${this.businessId}/${deploymentId}/${verb}`
    }
    generateMetaChannel(deploymentId, verb) {
      return `/meta/${this.businessId}/${deploymentId}/${verb}`
    }
    disconnect() {
      cometd.disconnect(true);
    }
    getServerUrl() {
      return this.serverUrl
    }
    getRestServerUrl() {
      return `${this.serverUrl}/rest/deployed`
    }
    makeResourceId() {
      const id = []
      var possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 5; i++) {
        id.push(possible.charAt(Math.floor(Math.random() * possible.length)))
      }
      return id.join('')
    }
    reconnect() {
      connect(this.connectionData)
    }
    getBusinessId(){
      return this.businessId
    }
    off(key) {
      if (!key || key.sub == null) {
        return;
      }
      if (key.isService) {
        cometd.unsubscribe(key.sub)
        key.sub = null
      } else {
        cometd.removeListener(key.sub)
        key.sub = null
      }
      log.debug('unsubscribed', key)
      key.renewOnReconnect = false;
    }
    refresh() {
      log.debug('refreshing subscriptions');
      const renew = [];
      this.subscriptions.forEach((key) => {
        if (key.sub) {
          if (key.isService) {
            cometd.unsubscribe(key.sub)
          }
          else {
            cometd.removeListener(key.sub)
          }
        }
        if (key.renewOnReconnect) {
          renew.push(key)
        }
      })
      renew.forEach((key) => {
        this.on(key);
      })
    }
    on(businessId, deploymentId, verb, callback) {
      // One can call the function with a key
      if (arguments.length == 1) {
        var key= arguments[0]
      }
      else if (arguments.length == 2) {
        var key = {};
        key.channel = arguments[0]
        key.callback = arguments[1]
        this.subscriptions.push(key)
      }
      else if (arguments.length == 4) {
        var key = {}
        key.channel = this.generateChannel(businessId, deploymentId, verb)
        key.callback = callback
        this.subscriptions.push(key)
      }
      else {
        throw "zetaPush.on - bad arguments"
      }

      var tokens = key.channel.split("/")
      if (tokens.length <= 1) {
        cometd.notifyListeners('/meta/error', "Syntax error in the channel name")
        return null
      }

      if (tokens[1] == 'service') {
        key.isService = true

        if (this.connected) {
          key.sub = cometd.subscribe(key.channel, key.callback)
          log.debug('subscribed', key)
        }
        else {
          log.debug('queuing subscription request', key)
        }

      }
      else if (tokens[1] == 'meta'){
        key.isService = false
        key.sub = cometd.addListener(key.channel, key.callback)
      }
      else {
        log.error("This event can t be managed by ZetaPush", evt)
        return null
      }
      if (key.renewOnReconnect == null) {
        key.renewOnReconnect = true
      }

      return key
    }
    send(businessId, deploymentId, verb, data) {
      var evt, sendData;

      if ((arguments.length == 2) || (arguments.length == 1)) {
        evt = arguments[0]
        sendData = arguments[1]
      }
      else if ((arguments.length == 3) || (arguments.length == 4)) {
        evt = this.generateChannel(businessId, deploymentId, verb)
        sendData = data;
      }

      var tokens = evt.split("/")
      if (tokens.length <= 1) {
        cometd.notifyListeners('/meta/error', "Syntax error in the channel name")
        return
      }

      if (tokens[1] == 'service') {
        if (this.connected) {
          cometd.publish(evt, sendData)
        }
      }
      else if (tokens[1] == 'meta') {
        cometd.notifyListeners(evt, sendData)
      }
    }
  }

  window.zp = new ZetaPushCore()
}())
