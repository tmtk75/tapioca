import {Diagram as c} from '../constants.js'

const App          = require('../dispatcher/App.js');
const UserStore    = require("../stores/UserStore.js");
const KiiHelper    = require('../helper/KiiHelper.js');
const BaconHelper  = require('../helper/BaconHelper.js');
const Immutable    = require("immutable");

const diagrams_ = UserStore.diagrams_;

function to_diagram(e) {
  var a = Immutable.fromJS({
    _id: e.getUUID(),
  });
  //console.log(a.get("_id"));
  //return a;
  //console.log(e);
  return {
    _id: e.getUUID(),
    ctime: e.getCreated(),
    mtime: e.getModified(),
    name: e.get("name"),
    body: e.get("body"),
    _kii: e,
  }
}

const Actions = {

  load: App.act(c.LOAD, (ctx) => {
    var a = BaconHelper.query_(diagrams_, null)
             .map(objs => objs.map(e => to_diagram(e)))
    ctx.run(a, e => ({diagrams: e}));
  }),

  create: App.act(c.CREATE, (ctx, name, body) => {
    var a = BaconHelper.query_(diagrams_, KiiClause.equals("name", name))
        .filter(objs => objs.length == 0)
        .map(_ =>
          diagrams_.map(bucket => {
            var p = KiiHelper.createObject(bucket, obj => {
              obj.set("name", name);
              obj.set("body", body);
            });
            return Bacon.fromPromise(p);
          })
          .flatMap(e => e)
        )
        .flatMap(e => e)
    ctx.run(a, e => ({diagram: to_diagram(e)}))
  }),

  select: App.act(c.SELECT, (ctx, diag) => {
    ctx.push({diagram: diag})
  }),

  update: App.act(c.UPDATE, (ctx, diag, body) => {
    var r = Bacon.constant(diag) 
             .map(diag => {
               var p = KiiHelper.updateObject(diag._kii, obj => { obj.set("body", body); });
               return Bacon.fromPromise(p);
             })
             .flatMap(e => e)
    ctx.run(r, e => ({diagram: to_diagram(e)}));
  }),

  delete: App.act(c.DELETE, (ctx, diag) => {
    var a = Bacon.constant(null).map(_ => {
        var p = KiiHelper.deleteObject(diag._kii)
        return Bacon.fromPromise(p)
      })
    ctx.run(a, _ => ({diagram: diag}))
  }),

};

export default Actions;
