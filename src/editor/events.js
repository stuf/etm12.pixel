import * as U from 'karet.util';
import * as S from '../shared';

// Plain events for usage as-is

export const mouseClickFor = S.takeEvents('click');
export const mouseDownFor = S.takeEvents('mousedown');
export const mouseMoveFor = S.takeEvents('mousemove');
export const mouseUpFor = S.takeEvents('mouseup');

// Derived events

export const mouseDragFor = source => U.thru(
  mouseDownFor(source),
  U.flatMapLatest(() =>
    U.takeUntilBy(
      U.takeFirst(1, mouseUpFor(source)),
      mouseMoveFor(source),
    )),
);
