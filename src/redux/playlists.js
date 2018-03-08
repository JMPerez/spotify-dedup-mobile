export const STATES = {
  LOADING: 0,
  FINDING_DUPLICATES: 1,
  DONE: 2
};

const initialState = { items: [], libraryState: STATES.LOADING };
export function playlistsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case FETCH_PLAYLISTS: {
      return initialState;
    }
    case FETCH_PLAYLISTS_SUCCESS: {
      return {
        ...state,
        items: action.playlists,
        libraryState: STATES.FINDING_DUPLICATES
      };
    }
    case FIND_DUPLICATES: {
      return {
        ...state,
        items: state.items.map(playlist => {
          return { ...playlist, duplicates: [], processing: true };
        }),
        libraryState: STATES.FINDING_DUPLICATES
      };
    }
    case FIND_DUPLICATES_IN_PLAYLIST: {
      return { ...state, processing: action.playlist };
    }
    case FIND_DUPLICATES_IN_PLAYLIST_SUCCESS: {
      return {
        ...state,
        processing: null,
        items: state.items.map(playlist => {
          if (playlist.uri === action.playlist.uri) {
            return {
              ...playlist,
              duplicates: action.duplicates,
              processing: false
            };
          }
          return playlist;
        })
      };
    }
    case FIND_DUPLICATES_SUCCESS: {
      return { ...state, libraryState: STATES.DONE };
    }
    case REMOVE_DUPLICATES_SUCCESS: {
      return {
        ...state,
        items: state.items.map(playlist => {
          if (playlist.uri === action.playlist.uri) {
            return { ...playlist, duplicates: [] };
          }
          return playlist;
        })
      };
    }
    default:
      return state;
  }
}
export const FETCH_PLAYLISTS = 'FETCH_PLAYLISTS';
export function fetchPlaylists() {
  return {
    type: FETCH_PLAYLISTS
  };
}

export const FETCH_PLAYLISTS_SUCCESS = 'FETCH_PLAYLISTS_SUCCESS';
export function fetchPlaylistsSuccess(playlists) {
  return {
    type: FETCH_PLAYLISTS_SUCCESS,
    playlists
  };
}

export const FIND_DUPLICATES = 'FIND_DUPLICATES';
export const FIND_DUPLICATES_SUCCESS = 'FIND_DUPLICATES_SUCCESS';
export const FIND_DUPLICATES_IN_PLAYLIST = 'FIND_DUPLICATES_IN_PLAYLIST';
export const FIND_DUPLICATES_IN_PLAYLIST_SUCCESS =
  'FIND_DUPLICATES_IN_PLAYLIST_SUCCESS';

export function findDuplicates() {
  return {
    type: FIND_DUPLICATES
  };
}
export function findDuplicatesSuccess() {
  return {
    type: FIND_DUPLICATES_SUCCESS
  };
}

export function findDuplicatesInPlaylist(playlist) {
  return {
    type: FIND_DUPLICATES_IN_PLAYLIST,
    playlist
  };
}

export function findDuplicatesInPlaylistSuccess(playlist, duplicates) {
  return {
    type: FIND_DUPLICATES_IN_PLAYLIST_SUCCESS,
    playlist,
    duplicates
  };
}

export const REMOVE_DUPLICATES = 'REMOVE_DUPLICATES';
export const REMOVE_DUPLICATES_SUCCESS = 'REMOVE_DUPLICATES_SUCCESS';
export function removeDuplicates(playlist) {
  // should this be an async action returning a promise?
  return {
    type: REMOVE_DUPLICATES,
    playlist
  };
}
export function removeDuplicatesSuccess(playlist) {
  return {
    type: REMOVE_DUPLICATES_SUCCESS,
    playlist
  };
}

// export selectors
export const getPlaylists = state =>
  (state.playlists && state.playlists.items) || [];
export const getTotalDuplicates = state =>
  state.reduce((a, p) => a + p.duplicates.length, 0);
export const getPlaylistsWithDuplicates = state =>
  state.playlists.items.filter(i => i.duplicates && i.duplicates.length > 0) ||
  [];
export const getProgress = state => {
  if (state.playlists.items.length) {
    const processing = state.playlists.items.filter(i => i.processing).length;
    const total = state.playlists.items.length;
    return total === 0 ? 100 : 100 - processing * 100 / total;
  }
  return 0;
};
