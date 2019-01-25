import * as U from 'karet.util';
import * as R from 'kefir.ramda';

/**
 * @param {ImageData} data
 * @param {number} dx
 * @param {number} dy
 * @param {CanvasRenderingContext2D} ctx
 */
function _putDataToContext (data, dx, dy, ctx) {
  ctx.putImageData(data, dx, dy);
}

/**
 * @param {number} w
 * @param {number} h
 * @param {Uint8ClampedArray} data
 */
function _makeImageData (w, h, data) {
  return new ImageData(data, w, h);
}

//

// #region Base functions
export const putDataToContext = U.liftRec(R.curry(_putDataToContext));
export const makeImageData = U.liftRec(R.curry(_makeImageData));
// #endregion
