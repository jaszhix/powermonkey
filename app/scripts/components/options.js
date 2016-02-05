import React from 'react';
import _ from 'lodash';
import {TextField} from 'material-ui';
import {appTheme} from './stores/main';

var Options = React.createClass({
  render: function() {
    var p = this.props;
    console.log(p.appTheme);
    return (
      <div className="Options">
      {_.keys(p.appTheme.palette).map((key, i)=>{
        return <TextField style={{backgroundColor: p.appTheme.palette[key]}} key={i} value={p.appTheme.palette[key]} underlineFocusStyle={{borderColor: p.appTheme.palette[key]}} underlineStyle={{borderColor: p.appTheme.palette[key]}} onChange={(e)=>appTheme.set(key, e.target.value)} floatingLabelText={key} hintText={key} />;
      })}
      </div>
    );
  }
});

export default Options;
