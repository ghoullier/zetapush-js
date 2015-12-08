/*
  ZetaPush Generic Service Class v1.0
  Grégory Houllier - 2015
*/
;(function() {
  org.cometd.JSON.toJSON = JSON.stringify
  org.cometd.JSON.fromJSON = JSON.parse

  function _setHeaders(headersArray, headers) {
    if (headers) {
      for (var headerName in headers) {
        headersArray[headerName] = headers[headerName]
      }
    }
  }

  function LongPollingTransport() {
    var _super = new org.cometd.LongPollingTransport()
    var that = org.cometd.Transport.derive(_super)

    that.xhrSend = function(packet) {
      var headers = {}
      headers['Content-Type'] = 'application/json;charset=UTF-8'
      setHeaders(headers, packet.headers)

      qwest.post(packet.url, packet.body, {
            async: packet.sync !== true,
            headers: headers,
            dataType: '-',
            withCredentials: true,
            timeout: 120000
          })
        .then(packet.onSuccess)
        .catch(function(e, url) {
          var reason = "Connection Failed for server " + url
          packet.onError(reason, e)
        })
    }
    return that
  }

  // Bind CometD
  const cometd = new org.cometd.CometD()

  let _clientId
  let _serverList = []
  let _serverUrl = ''

  // Registration order is important.
  if (org.cometd.WebSocket) {
    cometd.registerTransport('websocket', new org.cometd.WebSocketTransport())
  }
  cometd.registerTransport('long-polling', new LongPollingTransport())

  /*
    Listeners for cometD meta channels
  */
  cometd.onTransportException = function(_cometd, transport) {
    if (transport === 'long-polling') {
      log.debug('onTransportException for long-polling')

      // Try to find an other available server
      // Remove the current one from the _serverList array
      for (var i = _serverList.length - 1; i >= 0; i--) {
        if (_serverList[i] === _serverUrl) {
          _serverList.splice(i, 1)
          break
        }
      }
      if (_serverList.length === 0) {
        log.info("No more server available")
      } else {
        _serverUrl = _serverList[Math.floor(Math.random()*_serverList.length)]
        cometd.configure({
          url: _serverUrl + '/strd'
        });
        log.debug('CometD Url', _serverUrl)
        setTimeout(function() {
          cometd.handshake(_connectionData)
        },500)
      }
    }
  }

  // http://cometd.org/documentation/cometd-javascript/subscription
  cometd.onListenerException = function(exception, subscriptionHandle, isListener, message) {
    log.error('Uncaught exception for subscription', subscriptionHandle, ':', exception, 'message:', message)
    if (isListener) {
      cometd.removeListener(subscriptionHandle)
      log.error('removed listener')
    } else {
      cometd.unsubscribe(subscriptionHandle)
      log.error('unsubscribed');
    }
  }

  window.cometd = cometd
}())
