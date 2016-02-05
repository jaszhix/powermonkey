import React from 'react';
import _ from 'lodash';

import { MenuItem, Toolbar, ToolbarGroup, ToolbarTitle, LeftNav, FlatButton, TextField } from 'material-ui';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import MenuButton from 'material-ui/lib/svg-icons/navigation/menu';
import onClickOutside from 'react-onclickoutside';

import {route, scripts, scriptTitleField, appTheme} from './stores/main';
//rgba(255, 255, 255, 0.81)
//rgb(77, 79, 72)

var _appTheme = appTheme.get();
const styles = {
  menuButton: {width: '30px', height: '30px', marginTop: '13px', marginLeft: '10px', marginRight: '10px', cursor: 'pointer'},
  leftNav: {zIndex: '49', top: '56px'},
  removeScriptButton: {float: 'right', marginTop: '11px'},
  toolbarTitle: {color: _appTheme.palette.textColor, zIndex: '9999', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, paddingTop: 0, letterSpacing: 0, fontSize: 24},
  flatButton: {color: _appTheme.palette.textColor},
  underlineStyle: {borderColor: '#77959D'},
  floatingLabelStyle: {color: 'rgb(191, 226, 236)'}
};

var Field = React.createClass({
  mixins: [onClickOutside],
  handleClickOutside(){
    scriptTitleField.save();
  },
  render: function() {
    var p = this.props;
    return (
      <div style={{position: 'absolute', top: '-15px'}} >
        <TextField style={styles.flatButton} value={p.scriptTitleField} onChange={(e)=>scriptTitleField.set(e.target.value)} onEnterKeyDown={()=>scriptTitleField.save()} floatingLabelText="Enter Title" floatingLabelStyle={styles.floatingLabelStyle} underlineStyle={styles.underlineStyle} hintStyle={styles.flatButton} inputStyle={styles.flatButton}/>
      </div>
    );
  }
});

var RemoveScriptBtn = React.createClass({
  handleClick(e){
    e.preventDefault();
    e.stopPropagation();
    scripts.remove(this.props.script);
  },
  render: function() {
    return (
      <Delete style={styles.removeScriptButton} color="rgb(221, 222, 220)" hoverColor="rgb(187, 221, 231)" onTouchTap={this.handleClick}/>
    );
  }
});

var Appbar = React.createClass({
  mixins: [onClickOutside],
  getInitialState(){
    return {
      leftNavOpen: false,
      loadScript: 0
    };
  },
  propTypes: {
    title: React.PropTypes.string
  },
  componentWillReceiveProps(nextProps){
    styles.toolbarTitle.color = nextProps.appTheme.palette.textColor;
    styles.flatButton.color = nextProps.appTheme.palette.textColor;

  },
  handleClickOutside(){
    if (this.state.leftNavOpen) {
      this.showLeftNavClick();
    }
  },
  showLeftNavClick() {
    var s = this.state;
    this.setState({leftNavOpen: !s.leftNavOpen});
    if (s.loadScript > 0 && !s.leftNavOpen) {
      this.setState({loadScript: 0});
    }
  },
  handleLinkClick(event, id, title, content, scriptId){
    var s = this.state;
    
    if (id === 'loadScript' && s.loadScript === 0) {
      this.setState({loadScript: ++s.loadScript});
    } else {
      if (s.loadScript > 0 || !s.leftNavOpen) {
        this.setState({loadScript: 0});
      }
      route.set(id, title, content, scriptId);
      this.showLeftNavClick();
    }
  },
  handleTitle(){
    var p = this.props;
    if (p.route.title && p.route.id === 'newScript' || p.route.id === 'loadScript') {
      route.set(p.route.id, '', p.editorValue, p.route.scriptId);
    }
  },
  render() {
    var s = this.state;
    var p = this.props;
    var menuItems = [
      {title: 'Manage', id: 'index'},
      {title: 'New Script', id: 'newScript'},
      {title: 'Load Script', id: 'loadScript'},
      {title: 'Options', id: 'options'}
    ];
    if (p.scripts.length === 0) {
      menuItems = _.without(menuItems, menuItems[1]);
    }
    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true} float="left">
            <MenuButton color="#FFF" onTouchTap={this.showLeftNavClick} style={styles.menuButton} />
            <LeftNav className="mk-left-nav" 
              style={styles.leftNav} 
              ref="leftNav" 
              docked={true} 
              width={200} 
              open={this.state.leftNavOpen}>
                {s.loadScript > 0 ? p.scripts.map((script, i)=>{
                  return <MenuItem {...this.props} key={script.timeStamp} primaryText={_.truncate(script.title, {length: 20})} onTouchTap={(e)=>this.handleLinkClick(e, 'loadScript', script.title, script.content, script.id)}><RemoveScriptBtn script={script}/></MenuItem>;
                }) :
                menuItems.map((item, i)=>{
                  var title = item.id === 'newScript' ? 'Untitled' : item.title;
                  return <MenuItem key={i} primaryText={item.title} onTouchTap={(e)=>this.handleLinkClick(e, item.id, title)} />;
                })}
            </LeftNav>
          </ToolbarGroup>
          <ToolbarGroup {...this.props} float="left">
            {p.route.title ? <ToolbarTitle onTouchTap={this.handleTitle} text={p.route.title} style={styles.toolbarTitle} /> : <Field scriptTitleField={p.scriptTitleField}/>}
          </ToolbarGroup>
          <ToolbarGroup float="right">
            {p.route.id === 'newScript' || p.route.id === 'loadScript' ? 
            <FlatButton
              label="Save"
              labelPosition="after"
              style={styles.flatButton}
              primary={true}
              onTouchTap={()=>scripts.save(p.editorValue, p.route.title)} /> : null}
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
});

export default Appbar;