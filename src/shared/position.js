import * as U from 'karet.util';
import * as R from 'kefir.ramda';

//

/**
 *
 * @param {MouseEvent} event
 * @param {HTMLCanvasElement} canvas
 */
function _positionRelativeToCanvas (event, canvas) {
  const evPos = [event.pageX, event.pageY];
  const rect = canvas.getBoundingClientRect();
  const cPos = [rect.left, rect.top];

  return U.thru(
    [evPos, cPos],
    R.apply(R.zip),
    R.map(R.apply(R.subtract)),
  );
}

/**
 *
 * @param {number} scale
 * @param {[number, number]} pos
 */
function _pixelPositionForScale (scale, pos) {
  return U.thru(
    pos,
    R.map(R.pipe(
      R.divide(R.__, scale),
      U.floor,
    )),
  );
}

//

export const positionRelativeToCanvas = U.liftRec(R.curry(_positionRelativeToCanvas))
export const pixelPositionForScale = U.liftRec(R.curry(_pixelPositionForScale));
