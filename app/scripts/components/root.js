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
import AceEditor from 'react-ace';
 
import 'brace/mode/javascript';
import 'brace/theme/monokai';

import {route, editorValue, scripts} from './stores/main';

var Editor = React.createClass({
  handleOnChange(e){
    editorValue.set(e, this.props.scriptId);
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
                  name="UNIQUE_ID_OF_DIV"
                  editorProps={{$blockScrolling: true}}
                  value={p.editorValue}
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
      editorValue: '',
      scripts: []
    };
  },
  componentDidMount(){
    this.listenTo(route, this.routeChange);
    this.listenTo(editorValue, this.editorValueChange);
    this.listenTo(scripts, this.scriptsChange);
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
  scriptsChange(e){
    this.setState({scripts: e});
  },
  render() {
    var s = this.state;
    return (
        <div {...this.props}>
          <AppBar title={s.route.title} route={s.route} editorValue={s.editorValue} scripts={s.scripts}/>
          {s.route.id === 'index' ? <div /> : null}
          {s.route.id === 'newScript' ? <Editor editorValue={s.editorValue}/> : null}
          {s.route.id === 'loadScript' ? <Editor editorValue={s.editorValue} scriptId={s.route.scriptId ? s.route.scriptId : null} /> : null}
        </div>
      );
    }
});

ReactDOM.render(<Root />, document.getElementById('main'));
