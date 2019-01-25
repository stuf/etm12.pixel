import * as React from 'karet';
import * as K from 'kefir';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';
import * as L from 'partial.lenses';

import * as S from '../shared';
import * as M from './meta';

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
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
      }}>
        <code>{U.stringify(state)}</code>
      </div>

      <div className="editor__canvas-wrapper">
        <div className="editor__canvas-wrapper__grid-element" />
        <div className="editor__canvas-wrapper__grid-element--empty" />
        <div className="editor__canvas-wrapper__grid-element" />

        <div className="editor__canvas-wrapper__grid-element--empty" />

        <canvas ref={U.refTo(canvas)}
                className="editor__canvas"
                width={width}
                height={height}
                style={{
                  width: U.view(0, scaledSize),
                  height: U.view(1, scaledSize),
                }} />
        <div className="editor__canvas-wrapper__grid-element--empty" />

        <div className="editor__canvas-wrapper__grid-element" />
        <div className="editor__canvas-wrapper__grid-element--empty" />
        <div className="editor__canvas-wrapper__grid-element" />
      </div>

      <div className="palette">
        {U.thru(
          state,
          U.view('palette'),
          U.mapElems((it, i) =>
            <button key={i}
                    className={U.cns(
                      'palette__item',
                      U.when(R.identical(it, U.view('color', currentState)), 'palette__item--selected')
                    )}
                    onClick={() => U.view('color', currentState).set(it.get())}
                    style={{
                      backgroundColor: R.toString(it),
                      borderColor: R.toString(it.map(c => c.darker(1)))
                    }} />)
        )}
      </div>
    </section>
  );
};

export default Editor;
