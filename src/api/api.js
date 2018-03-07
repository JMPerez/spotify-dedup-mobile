import SpotifyWebApi from './index';

export default class Api {
  static instance = null;
  static setStore(store) {
    const update = s => {
      this.getInstance().setAccessToken(s.getState().session.accessToken);
    };
    store.subscribe(() => update(store));
    update(store);
  }
  static getInstance() {
    if (this.instance === null) {
      this.instance = new SpotifyWebApi();
    }
    return this.instance;
  }
}
