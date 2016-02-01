import Reflux from 'reflux';

export var route = Reflux.createStore({
  init(){
    this.route = {};
    this.trigger(this.route);
  },
  set(id, title, content){
    this.route.id = id;
    this.route.title = title;
    this.route.content = content;
    this.trigger(this.route);
  }
});
export var editorValue = Reflux.createStore({
  init(){
    this.value = null;
  },
  set(value){
    this.value = value;
    this.trigger(this.value);
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
  save(script){
    var scriptObject = {timeStamp: Date.now(), title: null, document: script};
    this.scripts.push(scriptObject);
    chrome.storage.local.set({scripts: this.scripts});
    this.trigger(this.scripts);
  }
});