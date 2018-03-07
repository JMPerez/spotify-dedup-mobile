import Api from '../api/api';
import { FETCH_ME, fetchMeSuccess } from './session';
import {
  FETCH_PLAYLISTS,
  fetchPlaylistsUpdate,
  fetchPlaylistsSuccess,
  FIND_DUPLICATES,
  findDuplicates,
  findDuplicatesSuccess,
  findDuplicatesInPlaylist,
  findDuplicatesInPlaylistSuccess,
  REMOVE_DUPLICATES,
  removeDuplicatesSuccess,
  FETCH_PLAYLISTS_SUCCESS
} from './playlists';
import PromiseThrottle from 'promise-throttle';
import promiseForPages from '../api/promiseForPages';
import Deduplicator from '../deduplicator';

const promiseThrottle = new PromiseThrottle({ requestsPerSecond: 5 });

export default store => next => action =>
  (async () => {
    const result = next(action);
    switch (action.type) {
      case FETCH_ME:
        Api.getInstance()
          .getMe()
          .then(user => {
            store.dispatch(fetchMeSuccess(user));
          })
          .catch(e => {
            console.error(e);
          });
        break;

      case FETCH_PLAYLISTS:
        Api.getInstance()
          .getMe()
          .then(user => {
            const userId = user.id;
            promiseForPages(
              promiseThrottle.add(() =>
                // fetch user's playlists, 50 at a time
                Api.getInstance().getUserPlaylists({ limit: 50 })
              ),
              promiseThrottle,
              Api.getInstance()
            )
              .then((
                pagePromises // wait for all promises to be finished
              ) => Promise.all(pagePromises))
              .then(pages => {
                // combine and filter playlists
                let userOwnedPlaylists = [];
                pages.forEach(page => {
                  userOwnedPlaylists = userOwnedPlaylists.concat(
                    page.items.filter(playlist => playlist.owner.id === userId)
                  );
                });
                // add starred
                userOwnedPlaylists.push({
                  id: 'starred',
                  owner: {
                    id: userId
                  },
                  name: 'Starred',
                  href: `https://api.spotify.com/v1/users/${userId}/starred`,
                  tracks: {
                    href: `https://api.spotify.com/v1/users/${userId}/starred/tracks`
                  }
                });
                return userOwnedPlaylists;
              })
              .then(userOwnedPlaylists => {
                store.dispatch(fetchPlaylistsSuccess(userOwnedPlaylists));
              });
          })
          .catch(e => {
            console.error('error');
            console.error(e);
          });
        break;

      case FETCH_PLAYLISTS_SUCCESS: {
        store.dispatch(findDuplicates());
        const deduplicator = new Deduplicator(
          Api.getInstance(),
          promiseThrottle
        );
        const playlists = store.getState().playlists.items;
        const result = await (async () => {
          for (let playlist of playlists) {
            store.dispatch(findDuplicatesInPlaylist(playlist));
            const duplicates = await deduplicator.findDuplicates(playlist);
            store.dispatch(
              findDuplicatesInPlaylistSuccess(playlist, duplicates)
            );
          }
          store.dispatch(findDuplicatesSuccess());
        })();
        break;
      }

      case REMOVE_DUPLICATES: {
        const deduplicator = new Deduplicator(
          Api.getInstance(),
          promiseThrottle
        );
        deduplicator.removeDuplicates(action.playlist).then(() => {
          store.dispatch(removeDuplicatesSuccess(action.playlist));
        });
        break;
      }
    }
  })();
