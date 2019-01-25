import * as React from 'karet';
import * as U from 'karet.util';

const Debug = ({ data }) =>
  <aside>
    <pre><code>{U.stringify(data, null, 2)}</code></pre>
  </aside>;

export default Debug;
