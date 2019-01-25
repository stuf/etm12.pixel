import * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';
import { rgb } from 'd3-color';

export const currentStateIn = U.view('current');
export const paletteIn = U.view('palette');

export const fstIn = U.view(0);
export const sndIn = U.view(1);

export const colorIn = U.view('color');

//

export const asClampedArrL = L.lens(
  R.constructN(1, Uint8ClampedArray),
  R.concat([]),
);

export const opacityL = L.lens(
  L.modify('opacity', R.multiply(255)),
  L.modify('opacity', R.divide(255)),
);

export const colorL = L.lens(
  color => [color.r, color.g, color.b, color.opacity * 255],
  ([r, g, b, opacity]) => rgb(r, g, b, opacity / 255),
);

export const colorArrL = [
  'color',
  opacityL,
];
