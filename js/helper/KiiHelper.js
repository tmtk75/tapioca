const KiiHelper = {

  init: (ctx, conf) => {
    if (!(conf.app_id && conf.app_key && conf.endpoint)) {
      throw new Error("invalid config: " + conf);
    }
    ctx.Kii.initializeWithSite(conf.app_id, conf.app_key, conf.endpoint);
  },

  queryObjects: (bucket, query /* query all if undefined */) =>
    new Promise((resolve, reject) =>
      bucket.executeQuery(query, {
        success: (p, r, n) => { resolve(r); },
        failure: (u, err) => { reject(err, u); }
      })),

  createObject: (bucket, f) =>
    new Promise((resolve, reject) => {
      var obj = bucket.createObject();
      f(obj);
      obj.save({
        success: resolve,
        failure: (u, err) => { reject(err, u); }
      })
    }),

  updateObject: (obj, f) =>
    new Promise((resolve, reject) => {
      f(obj);
      obj.save({
        success: resolve,
        failure: (u, err) => { reject(err, u); }
      }, false);
    }),

  deleteObject: (obj) =>
    new Promise((resolve, reject) =>
      obj.delete({
        success: (p, r, n) => { resolve(obj); },
        failure: (u, err) => { reject(err, u); }
      })),

  Bacon: {
    queryObjects: (bucket, q) => {
      var p = KiiHelper.queryObjects(bucket, q);
      return Bacon.fromPromise(p);
    }
  }

}

export default KiiHelper;
