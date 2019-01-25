import * as React from 'karet';
// eslint-disable-next-line
import * as K from 'kefir';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';

import * as S from '../../shared';
import * as M from '../meta';
import * as E from '../events';
import * as D from '../draw';
import * as P from '../../shared/position';

// #region GridItem
const GridItem = ({ col, row, children, className, style = {} }) =>
  <div className={U.cns(
    'editor__canvas-wrapper__grid-element',
    className,
  )}
       style={R.merge({
         gridColumn: col,
         gridRow: row,
       }, style)}>
    {children}
  </div>;
// #endregion

// #region Position and coordinates

// #endregion

// #region Canvas

/**
 * @param {object} props
 * @param {any} props.state - Current editor state
 */
const Canvas = ({ state }) => {
  const { width, height, scale, current } = U.destructure(state);

  // Current editor state specifics
  const curColor = U.view(M.colorL, M.colorIn(current));

  // Canvas-related
  const canvasDom = U.variable();

  /** @type {K.Property<CanvasRenderingContext2D, any>} */
  const context = U.mapValue(canvas => canvas.getContext('2d'), canvasDom);

  /** @type {K.Property<MouseEvent, any>} */
  const onClick = E.mouseClickFor(canvasDom);

  const positionRelative = P.positionRelativeToCanvas(onClick, canvasDom);
  const pixelPosRelative = P.pixelPositionForScale(scale, positionRelative);

  //

  const imageDataForCurrentColor = U.thru(
    curColor,
    U.mapValue(R.pipe(
      R.constructN(1, Uint8ClampedArray)),
      D.makeImageData(1, 1),
    ),
  );

  // #region Create side-effects
  const drawPixel = U.thru(
    U.combine(
      [imageDataForCurrentColor, pixelPosRelative, context],
      R.unapply(R.identity),
    ),
    U.on({
      value: R.pipe(
        R.flatten,
        R.apply(D.putDataToContext),
      )
    }),
  );
  // #endregion

  // #region Side-effects - Perform

  const effs = U.parallel([
    drawPixel,
    imageDataForCurrentColor,
  ]);

  // #endregion

  return (
    <section className="editor">
      {/* Remember to subscribe to side-effects */}
      {U.sink(effs)}
      <pre><code>{U.stringify(state)}</code></pre>

      <div className="editor__canvas-wrapper">
        <GridItem row={1} col={1} className="corner corner--nw" />
        <GridItem row={1} col={3} className="corner corner--ne" />
        <GridItem row={3} col={1} className="corner corner--sw" />
        <GridItem row={3} col={3} className="corner corner--se" />

        <GridItem row={2} col={2}
                  style={{
                    width: R.multiply(scale, width),
                    height: R.multiply(scale, height),
                  }}>
          <canvas ref={U.refTo(canvasDom)}
                  width={width}
                  height={height}
                  style={{
                    width: R.multiply(scale, width),
                    height: R.multiply(scale, height),
                  }}
                  className="editor__canvas" />
        </GridItem>
      </div>
    </section>
  )
};

// #endregion

export default Canvas;
