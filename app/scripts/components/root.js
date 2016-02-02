import '../../styles/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Reflux from 'reflux';
import { Paper } from 'material-ui';
import Row from './FlexboxGrid/Row.js';
import Col from './FlexboxGrid/Col.js';
import Box from './FlexboxGrid/Box.js';
import AppBar from './appbar.js';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import brace from 'brace';
import AceEditor from './aceEditor';
 
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/ext/settings_menu';

import {route, editorValue, scripts, scriptTitleField, editorRelay} from './stores/main';

var Editor = React.createClass({
  handleOnChange(e){
    editorValue.set(e, this.props.scriptId);
    console.log(this.props.editor.session.doc.$lines.length)
  },
  render: function() {
    var p = this.props;
    return (
      <div className="Editor">
        <Row>
          <Col auto={ true }>
            <Box>
              <Paper
                style={{backgroundColor: '#272822'}}
                zDepth={ 1 }
                rounded={ true }>
                <AceEditor
                  height="100%"
                  width="100%"
                  fontSize={16}
                  mode="javascript"
                  theme="monokai"
                  onChange={this.handleOnChange}
                  name="mk-code-editor"
                  editorProps={{$blockScrolling: 'Infinity'}}
                  value={p.editorValue}
                  minLines={1}
                />
              </Paper>
            </Box>
          </Col>
        </Row>
      </div>
    );
  }
});

var Root = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState(){
    return {
      route: {id: 'index', title: 'Powermonkey'},
      scriptTitleField: '',
      editorValue: '',
      scripts: [],
      editor: null
    };
  },
  componentDidMount(){
    // Reflux listeners
    this.listenTo(route, this.routeChange);
    this.listenTo(editorValue, this.editorValueChange);
    this.listenTo(scripts, this.scriptsChange);
    this.listenTo(scriptTitleField, this.scriptTitleFieldChange);
    this.listenTo(editorRelay, this.editorRelayChange);
  },
  routeChange(e){
    this.setState({route: e});
    if (e.id === 'loadScript') {
      this.setState({editorValue: e.content});
    } else if (e.id === 'newScript') {
      this.setState({editorValue: ''});
    }
  },
  editorValueChange(e){ 
    this.setState({editorValue: e});
  },
  editorRelayChange(e){
    this.setState({editor: e});
    console.log('..',e,e.se)
  },
  scriptsChange(e){
    this.setState({scripts: e});
  },
  scriptTitleFieldChange(e){
    this.setState({scriptTitleField: e});
  },
  render() {
    var s = this.state;
    return (
        <div {...this.props}>
          <AppBar route={s.route} editorValue={s.editorValue} scripts={s.scripts} scriptTitleField={s.scriptTitleField}/>
          {s.route.id === 'index' ? <div /> : null}
          {s.route.id === 'newScript' ? <Editor editor={s.editor} editorValue={s.editorValue}/> : null}
          {s.route.id === 'loadScript' ? <Editor editor={s.editor} editorValue={s.editorValue} scriptId={s.route.scriptId ? s.route.scriptId : null} /> : null}
        </div>
      );
    }
});

ReactDOM.render(<Root />, document.getElementById('main'));
