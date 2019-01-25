import * as U from 'karet.util';
import { color } from 'd3-color'

const palette = [
  color('#f00'),
  color('#0f0'),
  color('#00f'),
];

const initialState = {
  editor: {
    width: 24,
    height: 24,
    scale: 16,
    palette,
    current: {
      color: palette[0],
    },
  },
};

const store = U.atom(initialState);

export default store;

//

store.log('store');
