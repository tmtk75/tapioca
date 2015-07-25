const _ = require("lodash");
import {Diagram as c} from '../constants.js'
const app = require('../dispatcher/App.js');
var UserStore = require('./UserStore.js');

class DiagramStore {

  constructor() {
    this._diagrams = {};
    this._diagrams_bus    = new Bacon.Bus();
    this._selected_bus = new Bacon.Bus();

    app.on(c.LOAD, data => {
      this._diagrams = data.diagrams;
      this._diagrams_bus.push(data.diagrams);
      if (data.diagrams.length) {
        this._selected_bus.push(data.diagrams[0]);
      }
    });
    app.on(c.CREATE, data => {
      this._diagrams.push(data.diagram);
      this._diagrams_bus.push(this._diagrams);
      this._selected_bus.push(data.diagram);
    });
    app.on(c.SELECT, data => {
      this._selected_bus.push(data.diagram);
    });
    app.on(c.UPDATE, data => {
      var d = _.find(this._diagrams, e => e._id === data.diagram._id);
      _.assign(d, data.diagram);
      this._diagrams_bus.push(this._diagrams);
      this._selected_bus.push(d);
    });
    app.on(c.DELETE, data => {
      _.remove(this._diagrams, e => e._id === data.diagram._id);
      this._diagrams_bus.push(this._diagrams);
    });
  }

  diagrams() {
    return this._diagrams_bus;
  }

  selectedDiagram() {
    return this._selected_bus;
  }

}

export default new DiagramStore();

