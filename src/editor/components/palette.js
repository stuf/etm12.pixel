import * as React from 'karet';
import * as U from 'karet.util';
import * as R from 'kefir.ramda';

const Palette = ({ colors, selected }) =>
  <section className="palette">
    {U.thru(
      colors,
      U.mapElems((color, i) =>
        <button key={i}
                className={U.cns(
                  'palette__item',
                  U.when(R.identical(color, selected), 'palette__item--selected'),
                )}
                onClick={() => selected.set(color.get())} />)
    )}
  </section>;

export default Palette;
