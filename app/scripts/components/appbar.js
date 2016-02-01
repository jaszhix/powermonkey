import React from 'react';

import { AppBar } from 'material-ui';
import { MenuItem } from 'material-ui';
import { LeftNav, FlatButton } from 'material-ui';

import {route, scripts} from './stores/main';

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
    this.setState({leftNavOpen: !this.state.leftNavOpen});
  },
  handleLinkClick(event, id, title, content){
    var s = this.state;
    
    if (id === 'loadScript' && s.loadScript === 0) {
      this.setState({loadScript: ++s.loadScript});
    } else {
      if (s.loadScript > 0) {
        this.setState({loadScript: 0});
      }
      route.set(id, title, content);
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
          onTouchTap={()=>scripts.save(p.editorValue)} />
      );
    };
    if (p.route.id === 'newScript') {
      return save();
    } else {
      return <div />;
    }
  },
  render() {
    var s = this.state;
    var p = this.props;
    var menuItems = [
      {text: 'New Script', id: 'newScript'},
      {text: 'Load Script', id: 'loadScript'},
      {text: 'Settings', id: 'settings'}
    ];
    return (
      <div>
        <AppBar {...this.props} style={{backgroundColor: 'rgb(77, 79, 72)', color: 'rgba(255, 255, 255, 0.81)'}} 
          onLeftIconButtonTouchTap={this.showLeftNavClick} iconElementRight={this.getAppBarChildren()}/>
        <LeftNav className="mk-left-nav" style={{color: 'rgba(255, 255, 255, 0.81)', backgroundColor: 'rgb(71, 75, 62)', zIndex: '9999'}} 
          ref="leftNav" 
          docked={true} 
          width={200} 
          open={this.state.leftNavOpen}>
          {s.loadScript > 0 ? p.scripts.map((script, i)=>{
            return <MenuItem key={script.timeStamp} style={{color: 'rgba(255, 255, 255, 0.81)'}} primaryText={script.timeStamp} onTouchTap={(e)=>this.handleLinkClick(e, 'loadScript', script.timeStamp, script.document)}/>;
          }) :
          menuItems.map((item, i)=>{
            return <MenuItem key={i} style={{color: 'rgba(255, 255, 255, 0.81)'}} primaryText={item.text} onTouchTap={(e)=>this.handleLinkClick(e, item.id, item.text)}/>;
          })
        }
        </LeftNav>
      </div>
    );
  }
});

export default Appbar;