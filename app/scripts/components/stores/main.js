import Reflux from 'reflux';
import _ from 'lodash';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export var route = Reflux.createStore({
  init(){
    this.route = {title: 'Powermonkey'};
    this.trigger(this.route);
  },
  set(id, title, content, scriptId){
    // route props - id: page state, title: page/document title, content: document itself, scriptId: ref key for document
    this.route.id = id;
    this.route.title = title;
    this.route.content = content;
    this.route.scriptId = scriptId;
    this.trigger(this.route);
  },
  get(){
    return this.route;
  }
});
export var editorValue = Reflux.createStore({
  init(){
    this.content = null;
    this.id = null;
  },
  set(content, scriptId){
    // editorValue props - content: code editor state, scriptId: ref key for document
    this.content = content;
    this.trigger(this.content);
  },
  setId(scriptId){
    this.id = scriptId;
  },
  getId(){
    return this.id;
  }
});

export var scripts = Reflux.createStore({
  init(){
    var getScripts = new Promise ((resolve, reject)=>{
      chrome.storage.local.get('scripts', (s)=>{
        if (s && s.scripts) {
          resolve(s.scripts);
        } else {
          reject();
        }
      });
    });
    getScripts.then((scripts)=>{
      console.log('Scripts: ', scripts);
      this.scripts = scripts;
      this.trigger(this.scripts);
    }).catch(()=>{
      this.scripts = [];
      chrome.storage.local.set({scripts: this.scripts});
      this.trigger(this.scripts);
    });
  },
  save(script, title){
    var id = editorValue.getId();
    if (id) {
      var existingScript = _.find(this.scripts, {id: id});
    }
    var _title = title ? title : existingScript ? existingScript.title : 'Untitled';
    var scriptObject = null;
    if (existingScript) {
      console.log('existing...',existingScript);
      scriptObject = {timeStamp: Date.now(), title: _title, content: script, id: existingScript.id};
      this.scripts = _.without(this.scripts, existingScript);
    } else {
      scriptObject = {timeStamp: Date.now(), title: _title, content: script, id: _.floor(Date.now() / Math.random())};
    }
    this.scripts.push(scriptObject);
    chrome.storage.local.set({scripts: this.scripts});
    this.trigger(this.scripts);
  },
  remove(script){
    this.scripts = _.without(this.scripts, script);
    chrome.storage.local.set({scripts: this.scripts});
    this.trigger(this.scripts);
  }
});

export var scriptTitleField = Reflux.createStore({
  init(){
    this.title = null;
  }, 
  set(title){
    this.title = title;
    this.trigger(this.title);
  },
  save(){
    var _route = route.get();
    var title = this.title ? this.title : _route.title;
    route.set(_route.id, title, _route.content, _route.scriptId);
  }
});

export var editorRelay = Reflux.createStore({
  init(){
    this.editor = null;
  },
  set(editor){
    this.editor = editor;
    this.trigger(this.editor);
  }
});

export var appTheme = Reflux.createStore({
  init(){
    this.theme = {
      spacing: Spacing,
      zIndex: zIndex,
      fontFamily: 'Roboto, sans-serif',
      palette: {
        primary1Color: '#BFE2EC',
        primary2Color: '#4D4F48',
        primary3Color: '#62645D',
        accent1Color: '#5F6259',
        accent2Color: '#4D4F48',
        accent3Color: '#BFE2EC',
        textColor: '#FFF',
        alternateTextColor: 'rgba(255, 255, 255, 0.81)',
        canvasColor: '#4D4F48',
        borderColor: '#62645D',
        disabledColor: '#969696',
        pickerHeaderColor: '#62645D',
      }
    };
    this.trigger(this.appTheme);
  },
  set(prop, value){
    this.theme.palette[prop] = value;
    this.trigger(this.theme);
  },
  get(){
    return this.theme;
  }
});