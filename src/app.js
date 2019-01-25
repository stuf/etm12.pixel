import * as React from 'karet';
import * as U from 'karet.util';

import Editor from './editor';

const App = ({ state }) =>
  <main>
    <Editor state={U.view('editor', state)} />
  </main>;

export default App;
