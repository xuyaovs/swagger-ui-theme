import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  ...((require('E:/react_workspace/api-doc/src/dva.js').config || (() => ({})))()),
});

window.g_app = app;
app.use(createLoading());
app.use(require('E:/react_workspace/api-doc/node_modules/dva-immer/lib/index.js').default());
app.model({ namespace: 'DocInfoModel', ...(require('E:/react_workspace/api-doc/src/models/DocInfoModel.js').default) });
app.model({ namespace: 'I18nModel', ...(require('E:/react_workspace/api-doc/src/models/I18nModel.js').default) });
app.model({ namespace: 'IndexModel', ...(require('E:/react_workspace/api-doc/src/models/IndexModel.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
