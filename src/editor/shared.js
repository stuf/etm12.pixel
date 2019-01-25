import * as K from 'kefir';
import * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';

// Canvas

export const getCanvasContext = U.liftRec(R.invoker(1, 'getContext'));

export const getScaledCoordinates = (scale, coords) =>
  U.combine(
    [scale, coords],
    (s, [x, y]) => [s * x, s * y],
  );

// Kefir

export const diff = R.curry((fn, obs) => obs.diff(fn));

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
export const mkClampedArr1 = R.constructN(1, Uint8ClampedArray);

export const createPixel = color => R.pipe(
  L.modify('opacity', R.multiply(255)),
  R.values,
  mkClampedArr1,
  mkImageData(1, 1),
)(color);
