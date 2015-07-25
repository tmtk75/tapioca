var Bacon     = require('baconjs'),
    KiiHelper = require('../helper/KiiHelper.js');

class BaconHelper {

  /*
   * bucket_    stream to provider KiiBucket
   * clause     KiiClause
   */
  query_(bucket_, clause /* query all if undefined */) {
    var q = KiiQuery.queryWithClause(clause);
    return bucket_.map(bucket => KiiHelper.Bacon.queryObjects(bucket, q))
                  .flatMap(e => e);
  }

  latest_(bucket_) {
    var q = KiiQuery.queryWithClause()
    q.sortByDesc("_modified")
    q.setLimit(1)
    return bucket_.map(bucket => KiiHelper.Bacon.queryObjects(bucket, q))
                  .flatMap(e => e)
                  .map(objs => objs.length == 0 ? null : objs[0]);
  }

  /** */
  KiiUser(username, password, ctx) {
    var auth_ = Bacon.fromCallback(callback => {
                  ctx.KiiUser.authenticate(username, password, {
                    success: (user) => { callback(user) },
                    failure: (user, err) => { callback(false) },
                  });
                });

    var a = auth_.filter(user => user);
    
    var b = auth_.filter(b => !b)
                 .map(_ => Bacon.fromCallback(callback => {
                     ctx.KiiUser.userWithUsername(username, password).register({
                       success: (user) => { callback(user) },
                       failure: (user, err) => { callback(new Bacon.Error(err)) },
                     })
                   })
                 )
                 .flatMap(e => e);
    
    return a.merge(b)
            .fold(null, (a, b) => a || b)
            .filter(e => e != null);
  }

}

export default new BaconHelper;
