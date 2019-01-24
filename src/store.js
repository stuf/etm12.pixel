import * as U from 'karet.util';

const initialState = {
  editor: {
    width: 24,
    height: 24,
    scale: 16,
  },
};

const store = U.atom(initialState);

export default store;

//

store.log('store');
