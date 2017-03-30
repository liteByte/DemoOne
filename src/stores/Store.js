const minSendTimeout = 50;
const maxSendTimeout = 1000;

export default class Store {

  static error(code, msg) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          code,
          msg
        });
      }, minSendTimeout + Math.random() * (maxSendTimeout - minSendTimeout))
    });
  }

  static send(code, content = null) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          code,
          content
        });
      }, minSendTimeout + Math.random() * (maxSendTimeout - minSendTimeout))
    });
  }

}
