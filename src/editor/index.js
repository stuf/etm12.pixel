import * as React from 'karet';
import * as K from 'kefir';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';
import * as L from 'partial.lenses';

import * as S from '../shared';
import * as M from './meta';
import { Canvas, Palette } from './components';

const Editor = ({ state }) => {
  const { width, height, scale } = U.destructure(state);
  const currentState = M.currentStateIn(state);

  const scaledSize = S.getScaledCoordinates(scale, [width, height])

  const canvas = U.variable();
  const context = S.getCanvasContext('2d', canvas);
  const canvasOffset = U.mapValue(R.invoker(0, 'getBoundingClientRect'), canvas);

  // Mouse events

  const onMouseClick = S.takeEvents('click', canvas);
  const onMouseDown = S.takeEvents('mousedown', canvas);
  const onMouseMove = S.takeEvents('mousemove', canvas);

  const onMouseDrag = U.thru(
    onMouseDown,
    U.flatMapLatest(() =>
      U.takeUntilBy(
        U.takeFirst(1, S.takeEvents('mouseup', canvas)),
        onMouseMove,
      ),
    ),
  );

  const onDragSteps = U.thru(
    onMouseDrag,
    S.diff((a, b) => [a.pageX - b.pageX, a.pageY - b.pageY]),
    U.foldPast((xs, x) => [xs[0] - x[0], xs[1] - x[1]], [0, 0]),
  );

  //

  const pixelOnCoordinates = U.thru(
    U.combine(
      [onMouseClick, canvasOffset],
      R.unapply(R.identity),
    ),
    U.mapValue(([ev, rect]) => [ev.pageX - rect.x, ev.pageY - rect.y]),
  );

  const pixelForCurrentColor = U.view(['color', M.colorL, M.asClampedArrL], currentState);
  const pixelImageData = S.makeImageData(1, 1, pixelForCurrentColor);
  const clickedPixelCoords = S.getPixelCoordinates(scale, pixelOnCoordinates);

  const drawPixel = U.thru(
    U.combine(
      [pixelImageData, clickedPixelCoords, context],
      R.unapply(R.identity),
    ),
    U.on({
      value: R.apply(S.putContextImageData),
    })
  );

  //

  return (
    <section className="editor">
      {U.sink(U.parallel([
        drawPixel,
      ]))}
      <Canvas state={state} />
    </section>
  );
};

export default Editor;
