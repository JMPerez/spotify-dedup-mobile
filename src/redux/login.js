import { Constants, WebBrowser } from 'expo';
import { Linking } from 'react-native';
import qs from 'qs';

function toQueryString(obj) {
  let parts = [];
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return parts.join('&');
}

export default forceUser =>
  new Promise((resolve, reject) => {
    Linking.getInitialURL().then(url => {
      processAccessToken(url);
    });

    const handleRedirect = ({ url }) => {
      WebBrowser.dismissBrowser();
      processAccessToken(url);
    };

    const addLinkListener = () => {
      Linking.addEventListener('url', handleRedirect);
    };

    const removeLinkListener = () => {
      Linking.removeEventListener('url', handleRedirect);
    };
    const processAccessToken = url => {
      let query = url.replace(Constants.linkingUri, '').replace('#', '');
      let data = query ? qs.parse(query) : null;
      if (data !== null) {
        const accessToken = data['access_token'];
        if (accessToken) {
          resolve(accessToken);
        }
      }
    };

    const showLoginModal = async showDialog => {
      addLinkListener();
      const redirectUrl = Constants.linkingUri;

      const params = {
        client_id: '04dca0de1c4e4aca88cc615ac23581be',
        redirect_uri:
          redirectUrl.indexOf('#') >= 0
            ? redirectUrl.substr(0, redirectUrl.indexOf('#'))
            : redirectUrl,
        response_type: 'token',
        scope: [
          'playlist-read-private',
          'playlist-read-collaborative',
          'playlist-modify-public',
          'playlist-modify-private'
        ].join(' ')
      };

      if (showDialog === true) params['show_dialog'] = true;

      const url = `https://accounts.spotify.com/authorize?${toQueryString(
        params
      )}`;

      let result = await WebBrowser.openBrowserAsync(url);
      removeLinkListener();
    };

    showLoginModal(forceUser);
  });
