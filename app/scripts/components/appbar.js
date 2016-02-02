import React from 'react';
import _ from 'lodash';

import { AppBar } from 'material-ui';
import { MenuItem } from 'material-ui';
import { LeftNav, FlatButton, TextField } from 'material-ui';
import Delete from 'material-ui/lib/svg-icons/action/delete';

import {route, scripts, scriptTitleField} from './stores/main';

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
  getAppBarChildren(){
    var p = this.props;
    var save = ()=>{
      return (
        <FlatButton
          label="Save"
          labelPosition="after"
          primary={true}
          onTouchTap={()=>scripts.save(p.editorValue, p.route.title)} />
      );
    };
    if (p.route.id === 'newScript' || p.route.id === 'loadScript') {
      return save();
    } else {
      return <div />;
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
        <AppBar onTitleTouchTap={this.handleTitle} 
          title={p.route.title ? p.route.title : <Field scriptTitleField={p.scriptTitleField}/>}
          titleStyle={{cursor: 'pointer'}}
          style={{backgroundColor: 'rgb(77, 79, 72)', color: 'rgba(255, 255, 255, 0.81)'}} 
          onLeftIconButtonTouchTap={this.showLeftNavClick} 
          iconElementRight={this.getAppBarChildren()} zDepth={0}/>
        <LeftNav className="mk-left-nav" 
          style={{color: 'rgba(255, 255, 255, 0.81)', backgroundColor: 'rgb(77, 79, 72)', zIndex: '9999', top: '64px'}} 
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
          })
        }
        </LeftNav>
      </div>
    );
  }
});

export default Appbar;