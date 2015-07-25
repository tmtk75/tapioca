var BaconHelper = require("../helper/BaconHelper.js"),
    KiiHelper   = require("../helper/KiiHelper.js");

var me_ = Bacon.fromCallback(callback => $.get("./me", res => callback(res)))
               .fold(null, (a, b) => a || b)

var user_ = me_.map(me => {
                 var username = me.kiicloud.user.username;
                 var password = me.kiicloud.user.password;
                 console.log(me);
                 KiiHelper.init(global, me.kiicloud.config);
                 return BaconHelper.KiiUser(username, password, global);
               })
               .flatMap(e => e)
               .fold(null, (a, b) => a || b)

var diagrams_ = user_.map(u => u.bucketWithName("diagrams"));

class UserStore {
  constructor() {
    this.diagrams_ = diagrams_
    this.me_       = me_;
  }
}

export default new UserStore;
