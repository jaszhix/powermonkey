import React from 'react';
import _ from 'lodash';

import { MenuItem, Toolbar, ToolbarGroup, ToolbarTitle, LeftNav, FlatButton, TextField } from 'material-ui';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import MenuButton from 'material-ui/lib/svg-icons/navigation/menu';

import {route, scripts, scriptTitleField} from './stores/main';

const styles = {
  menuButton: {width: '30px', height: '30px', marginTop: '13px', marginLeft: '10px', marginRight: '10px', color: '#FFF', cursor: 'pointer'},
  leftNav: {zIndex: '49', color: 'rgba(255, 255, 255, 0.81)', backgroundColor: 'rgb(77, 79, 72)', top: '56px'},
  toolbarTitle: {zIndex: '9999', color: '#FFF', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, paddingTop: 0, letterSpacing: 0, fontSize: 24},
  saveButton: {color: '#FFF'}
};

var Field = React.createClass({
  render: function() {
    var p = this.props;
    return (
      <div style={{position: 'absolute', top: '-15px'}} >
        <TextField style={{color: '#FFF'}} value={p.scriptTitleField} onChange={(e)=>scriptTitleField.set(e.target.value)} onEnterKeyDown={()=>scriptTitleField.save()} floatingLabelText="Enter Title" floatingLabelStyle={{color: 'rgb(191, 226, 236)'}} underlineFocusStyle={{borderColor: '#77959D'}} underlineStyle={{borderColor: '#77959D'}} hintStyle={{color: '#FFF'}} inputStyle={{color: '#FFF'}}/>
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
      <Delete style={{float: 'right', marginTop: '11px'}} color="rgb(221, 222, 220)" hoverColor="rgb(187, 221, 231)" onTouchTap={this.handleClick}/>
    );
  }
});

var Appbar = React.createClass({
  getInitialState(){
    return {
      leftNavOpen: false,
      loadScript: 0
    };
  },
  propTypes: {
    title: React.PropTypes.string
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
      {title: 'New Script', id: 'newScript'},
      {title: 'Load Script', id: 'loadScript'},
      {title: 'Settings', id: 'settings'}
    ];
    if (p.scripts.length === 0) {
      menuItems = _.without(menuItems, menuItems[1]);
    }
    return (
      <div>
        <Toolbar style={{backgroundColor: 'rgb(77, 79, 72)', color: 'rgba(255, 255, 255, 0.81)'}} >
          <ToolbarGroup firstChild={true} float="left">
            <MenuButton color="#FFF" onTouchTap={this.showLeftNavClick} style={styles.menuButton} />
            <LeftNav className="mk-left-nav" 
              style={styles.leftNav} 
              ref="leftNav" 
              docked={true} 
              width={200} 
              open={this.state.leftNavOpen}>
                {s.loadScript > 0 ? p.scripts.map((script, i)=>{
                  return <MenuItem {...this.props} key={script.timeStamp} style={{color: 'rgba(255, 255, 255, 0.81)'}} primaryText={_.truncate(script.title, {length: 20})} onTouchTap={(e)=>this.handleLinkClick(e, 'loadScript', script.title, script.content, script.id)}><RemoveScriptBtn script={script}/></MenuItem>;
                }) :
                menuItems.map((item, i)=>{
                  var title = item.id === 'newScript' ? 'Untitled' : item.title;
                  return <MenuItem key={i} style={{color: 'rgba(255, 255, 255, 0.81)'}} primaryText={item.title} onTouchTap={(e)=>this.handleLinkClick(e, item.id, title)} />;
                })}
            </LeftNav>
          </ToolbarGroup>
          <ToolbarGroup {...this.props} float="left">
            {p.route.title ? <ToolbarTitle {...this.props} onTouchTap={this.handleTitle} text={p.route.title} style={styles.toolbarTitle} /> : <Field scriptTitleField={p.scriptTitleField}/>}
          </ToolbarGroup>
          <ToolbarGroup float="right">
            {p.route.id === 'newScript' || p.route.id === 'loadScript' ? 
            <FlatButton
              label="Save"
              labelPosition="after"
              style={styles.saveButton}
              primary={true}
              onTouchTap={()=>scripts.save(p.editorValue, p.route.title)} /> : null}
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
});

export default Appbar;