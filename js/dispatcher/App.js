const Bacon = require("baconjs")
import {Error as c } from '../constants.js'

var App = new class App {

  constructor() {
    this._bus = new Bacon.Bus()
    this._acts = new Map()
  }

  act(name, act) {
    if (!name) {
      console.warn(`name is empty`)
    }
    if (this._acts[name]) {
      console.warn(`"${name}" already exists as act name`)
    }
    
    const self = this
    const ctx = {
      push(data) {
        const p = {_type: name, data: data}
        self._bus.push(p)
        console.log(name, data);
        return data
      },
      run(st, f) {
        var a = st.map(e => this.push(f(e)))
        a.onValue(v => v)
        a.onError(err => ErrorActions.handle(err))
      }
    }
    
    this._acts[name] = ctx

    var f = function() { act.apply(null, [ctx].concat(Array.prototype.slice.call(arguments))) }
    f.run = f
    f._type = name;
    return f;
  }

  on(name, f) {
    if (!name) {
      console.warn(`name is empty`)
    }
    this._bus.filter(e => e._type === name)
            .map(e => e.data)
            .onValue(f)
  }

}

//TODO: move out somehow
var ErrorActions = {

  handle: (err) => {
    console.error(err);
  },

};

export default App;
