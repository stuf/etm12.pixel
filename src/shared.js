import * as K from 'kefir';
import * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';

// Convenience

/**
 * @param {ImageData} data
 * @param {[number, number]} dxy
 * @param {CanvasRenderingContext2D} ctx
 */
export function _putContextImageData(data, dxy, ctx) {
  ctx.putImageData(data, dxy[0], dxy[1]);
}

// Canvas

export const getCanvasContext = U.liftRec(R.invoker(1, 'getContext'));

export const getScaledCoordinates = (scale, coords) =>
  U.combine(
    [scale, coords],
    (s, [x, y]) => [s * x, s * y],
  );

export const putContextImageData = U.liftRec(R.curry(_putContextImageData));

// Kefir

export const diff = R.curry(_Kefir_diff);

export const takeEvents = R.curry((type, obs) => U.thru(
  obs,
  U.flatMapLatest(source => K.fromEvents(source, type)),
  U.toProperty,
));

export const getPixelCoordinates = R.curry((scale, coords) =>
  U.thru(
    U.combine(
      [scale, coords],
      (s, c) => [c[0] / s, c[1] / s],
    ),
    U.liftRec(R.map(Math.floor))
  )
);

//

export const _mkImageData3 = R.constructN(3, ImageData);
export const mkImageData = R.curry((w, h, xs) => _mkImageData3(xs, w, h));
export const mkClampedArr1 = U.liftRec(R.constructN(1, Uint8ClampedArray));

export const createPixel = color => R.pipe(
  L.modify('opacity', R.multiply(255)),
  R.values,
  mkClampedArr1,
  mkImageData(1, 1),
)(color);

export const makeImageData = U.liftRec(R.curry((w, h, xs) => new ImageData(xs, w, h)));

//

/**
 * @param {Function} fn
 * @param {K.Observable<any, any>} obs
 */
function _Kefir_diff (fn, obs) {
  return obs.diff(fn);
}

function _Kefir_fromEvents (fn, source) {
  return K.fromEvents(source, fn);
}
