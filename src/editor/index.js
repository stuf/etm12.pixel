import * as React from 'karet';
import * as K from 'kefir';
import * as U from 'karet.util';
import * as R from 'ramda';
import * as L from 'partial.lenses';

import * as S from './shared';
import * as M from './meta';

const Editor = ({ state }) => {
  const { width, height, scale } = U.destructure(state);
  const currentState = M.currentStateIn(state);

  const scaledSize = S.getScaledCoordinates(scale, [width, height])

  const canvas = U.variable();
  const context = S.getCanvasContext('2d', canvas);
  const canvasOffset = U.thru(
    canvas,
    U.mapValue(R.invoker(0, 'getBoundingClientRect')),
  );

  //

  const onMouseClick = S.takeEvents('click', canvas);
  const onMouseDown = S.takeEvents('mousedown', canvas);
  const onMouseMove = S.takeEvents('mousemove', canvas);

  const onMouseDrag = U.thru(
    onMouseDown,
    U.flatMapLatest(() => {
      const onMouseUp = S.takeEvents('mouseup', canvas).take(1);

      return U.thru(
        onMouseMove,
        U.takeUntilBy(onMouseUp),
      );
    }),
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

    /** FIXME Rewrite me pls */
    U.mapValue(L.get([L.pick({
      c1: [0, L.props('pageX', 'pageY'), L.reread(R.values)],
      c2: [1, L.props('x', 'y'), L.reread(R.values)],
    })])),


    U.mapValue(R.pipe(
      R.values,
      R.apply(R.zip),
      R.map(R.apply(R.subtract)),
    )),
  )

  const drawPixel = U.thru(
    U.combine([context, currentState, S.getPixelCoordinates(scale, pixelOnCoordinates)], R.unapply(R.identity)),
    U.mapValue(([ctx, cur, coords]) => {
      const imageData = S.createPixel(cur.color);
      return [ctx, cur, coords, imageData];
    }),
    U.on({ value: ([ctx, cur, coords, imageData]) => {
      console.log({ ctx, cur, coords, imageData});
      ctx.putImageData(imageData, coords[0], coords[1]);
    }}),
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
        {/* Dummy elements */}
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
    </section>
  );
};

export default Editor;
