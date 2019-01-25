import * as U from 'karet.util';
import { color } from 'd3-color'

const initialState = {
  editor: {
    width: 24,
    height: 24,
    scale: 16,
    current: {
      color: color('#f00'),
    },
  },
};

const store = U.atom(initialState);

export default store;

//

store.log('store');
