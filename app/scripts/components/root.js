import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import _ from 'lodash';
import v from 'vquery';
window.v = v;
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Paper, MenuItem, Table, TableHeader, TableRow, TableBody, TableFooter, TableRowColumn, TableHeaderColumn } from 'material-ui';
import Row from './FlexboxGrid/Row.js';
import Col from './FlexboxGrid/Col.js';
import Box from './FlexboxGrid/Box.js';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import ace from 'brace';
window.ace = ace;
import AceEditor from './aceEditor';
import AppBar from './appbar.js';
import Options from './options';
 
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/ext/settings_menu';
import 'brace/ext/language_tools';

import {route, editorValue, scripts, scriptTitleField, editorRelay, appTheme} from './stores/main';

var Editor = React.createClass({
  getInitialState(){
    return {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      minLines: 1,
      tabSize: 2,
      highlightActiveLine: true,
      readOnly: false
    };
  },
  componentWillReceiveProps(nextProps){
    editorValue.setId(nextProps.scriptId);
  },
  handleOnChange(e){
    editorValue.set(e, this.props.scriptId);
    console.log('Lines: ',this.props.editor.session.doc.$lines.length);
  },
  render: function() {
    var p = this.props;
    var s = this.state;
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
                    setOptions={s}
                  />
                <div ref="statusBar" />
              </Paper>
            </Box>
          </Col>
        </Row>
      </div>
    );
  }
});

var Index = React.createClass({
  getInitialState(){
    return {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: true,
      showRowHover: true,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: true,
      deselectOnClickaway: true,
      height: '300px',
    };
  },
  render: function() {
    var p = this.props;
    console.log(p.scripts);
    return (
      <div className="Index">
        <Table 
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this._onRowSelection}
         
        >
          <TableHeader enableSelectAll={this.state.enableSelectAll}>
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Super Header">
                Scripts
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {p.scripts.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{row.title}</TableRowColumn>
                <TableRowColumn>{row.timeStamp}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn>ID</TableRowColumn>
              <TableRowColumn>Name</TableRowColumn>
              <TableRowColumn>Status</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                Super Footer
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
});

var Route = React.createClass({
  render: function() {
    var p = this.props;
    return (
      <div className="route">
        {p.route.id === 'index' ? <Index scripts={p.scripts} /> : null}
        {p.route.id === 'newScript' ? <Editor editor={p.editor} editorValue={p.editorValue}/> : p.route.id === 'loadScript' ? <Editor editor={p.editor} editorValue={p.editorValue} routeId={p.route.id} scriptId={p.route.scriptId} /> : null}
        {p.route.id === 'options' ? <Options appTheme={p.appTheme} /> : null}
      </div>
    );
  }
});

var Root = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState(){
    return {
      route: v('#options').node() ? {id: 'options', title: 'Options'} : {id: 'index', title: 'Powermonkey'},
      scriptTitleField: '',
      editorValue: '',
      scripts: [],
      editor: null,
      appTheme: appTheme.get()
    };
  },
  componentWillMount(){
    require('../../styles/app.scss');
  },
  componentDidMount(){
    // Reflux listeners
    this.listenTo(route, this.routeChange);
    this.listenTo(editorValue, this.editorValueChange);
    this.listenTo(scripts, this.scriptsChange);
    this.listenTo(scriptTitleField, this.scriptTitleFieldChange);
    this.listenTo(editorRelay, this.editorRelayChange);
    this.listenTo(appTheme, this.appThemeChange);
  },
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(this.state.appTheme),
    };
  },
  routeChange(e){
    var s = this.state;
    this.setState({route: e});
    if (e.id === 'loadScript') {
      this.setState({editorValue: e.content});
    } else if (e.id === 'newScript' && s.route.title.length > 0 && s.scriptTitleField.length === 0) {
      this.setState({editorValue: ''});
    }
  },
  editorValueChange(e){ 
    this.setState({editorValue: e});
  },
  editorRelayChange(e){
    this.setState({editor: e});
    console.log('..',e);
  },
  scriptsChange(e){
    this.setState({scripts: e});
  },
  scriptTitleFieldChange(e){
    this.setState({scriptTitleField: e});
  },
  appThemeChange(e){
    this.setState({appTheme: e});
  },
  render() {
    var s = this.state;
    return (
        <div {...this.props}>
          <AppBar route={s.route} editorValue={s.editorValue} scripts={s.scripts} scriptTitleField={s.scriptTitleField} appTheme={s.appTheme} />
          <Route route={s.route} editor={s.editor} editorValue={s.editorValue} scripts={s.scripts} appTheme={s.appTheme} />
        </div>
      );
    }
});

var Action = React.createClass({
  componentWillMount(){
    require('../../styles/action.scss');
  },
  openApp(){
    chrome.tabs.create({url: chrome.runtime.getURL('./index.html')});
  },
  render: function() {
    return (
      <div>
        <MenuItem onTouchTap={this.openApp} style={{color: 'rgba(255, 255, 255, 0.81)'}} primaryText="Powermonkey" />
        <MenuItem onTouchTap={()=>chrome.runtime.openOptionsPage()} style={{color: 'rgba(255, 255, 255, 0.81)'}} primaryText="Options" />
      </div>
    );
  }
});

v(document).ready(()=>{
  ReactDOM.render(v('#action').node() ? <Action /> : <Root />, document.getElementById('main'));
});
