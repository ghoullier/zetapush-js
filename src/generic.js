/*
  ZetaPush GenericService Class v1.0
  Javascript GenericService Class for ZetaPush
  Grégory Houllier - 2015
*/
import zp from './zetapush';

export defaut class GenericService {
  constructor(deploymentId) {
    this._deploymentId = deploymentId
    this._subscriptions = [];
  }
  getChannel(verb) {
    return zp.generateChannel(this._deploymentId, verb)
  }
  on(verb, callback) {
    return zp.on(this.getChannel(verb), callback);
  }
  off(subscription) {
    zp.off(subscription)
  }
  send(verb, param) {
    zp.send(this.getChannel(verb), param)
  }
  onError(callback) {
    this._subscriptions.push(this.on('error', callback));
  }
  releaseService() {
    this._subscriptions.forEach((subscription) => {
      that.off(subscription)
    })
  }
}

zp.service.Generic = GenericService
