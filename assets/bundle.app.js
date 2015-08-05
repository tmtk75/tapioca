/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8090/assets";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);
	__webpack_require__(20);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Actions = __webpack_require__(2);
	var Main = __webpack_require__(12);

	React.render(React.createElement(Main, null), document.getElementById('main'));
	Actions.load();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _constantsJs = __webpack_require__(3);

	var App = __webpack_require__(4);
	var UserStore = __webpack_require__(6);
	var KiiHelper = __webpack_require__(8);
	var BaconHelper = __webpack_require__(7);
	var Immutable = __webpack_require__(11);

	var diagrams_ = UserStore.diagrams_;

	function to_diagram(e) {
	  var a = Immutable.fromJS({
	    _id: e.getUUID()
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
	    _kii: e
	  };
	}

	var Actions = {

	  load: App.act(_constantsJs.Diagram.LOAD, function (ctx) {
	    var a = BaconHelper.query_(diagrams_, null).map(function (objs) {
	      return objs.map(function (e) {
	        return to_diagram(e);
	      });
	    });
	    ctx.run(a, function (e) {
	      return { diagrams: e };
	    });
	  }),

	  create: App.act(_constantsJs.Diagram.CREATE, function (ctx, name, body) {
	    var a = BaconHelper.query_(diagrams_, KiiClause.equals("name", name)).filter(function (objs) {
	      return objs.length == 0;
	    }).map(function (_) {
	      return diagrams_.map(function (bucket) {
	        var p = KiiHelper.createObject(bucket, function (obj) {
	          obj.set("name", name);
	          obj.set("body", body);
	        });
	        return Bacon.fromPromise(p);
	      }).flatMap(function (e) {
	        return e;
	      });
	    }).flatMap(function (e) {
	      return e;
	    });
	    ctx.run(a, function (e) {
	      return { diagram: to_diagram(e) };
	    });
	  }),

	  select: App.act(_constantsJs.Diagram.SELECT, function (ctx, diag) {
	    ctx.push({ diagram: diag });
	  }),

	  update: App.act(_constantsJs.Diagram.UPDATE, function (ctx, diag, body) {
	    var r = Bacon.constant(diag).map(function (diag) {
	      var p = KiiHelper.updateObject(diag._kii, function (obj) {
	        obj.set("body", body);
	      });
	      return Bacon.fromPromise(p);
	    }).flatMap(function (e) {
	      return e;
	    });
	    ctx.run(r, function (e) {
	      return { diagram: to_diagram(e) };
	    });
	  }),

	  'delete': App.act(_constantsJs.Diagram.DELETE, function (ctx, diag) {
	    var a = Bacon.constant(null).map(function (_) {
	      var p = KiiHelper.deleteObject(diag._kii);
	      return Bacon.fromPromise(p);
	    });
	    ctx.run(a, function (_) {
	      return { diagram: diag };
	    });
	  })

	};

	exports['default'] = Actions;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Diagram = {
	  LOAD: "Diagram Load",
	  CREATE: "Diagram Create",
	  SELECT: "Diagram Select",
	  UPDATE: "Diagram Update",
	  DELETE: "Diagram Delete"
	};

	exports.Diagram = Diagram;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _constantsJs = __webpack_require__(3);

	var Bacon = __webpack_require__(5);

	var App = new ((function () {
	  function App() {
	    _classCallCheck(this, App);

	    this._bus = new Bacon.Bus();
	    this._acts = new Map();
	  }

	  _createClass(App, [{
	    key: "act",
	    value: function act(name, _act) {
	      if (!name) {
	        console.warn("name is empty");
	      }
	      if (this._acts[name]) {
	        console.warn("\"" + name + "\" already exists as act name");
	      }

	      var self = this;
	      var ctx = {
	        push: function push(data) {
	          var p = { _type: name, data: data };
	          self._bus.push(p);
	          console.log(name, data);
	          return data;
	        },
	        run: function run(st, f) {
	          var _this = this;

	          var a = st.map(function (e) {
	            return _this.push(f(e));
	          });
	          a.onValue(function (v) {
	            return v;
	          });
	          a.onError(function (err) {
	            return ErrorActions.handle(err);
	          });
	        }
	      };

	      this._acts[name] = ctx;

	      var f = function f() {
	        _act.apply(null, [ctx].concat(Array.prototype.slice.call(arguments)));
	      };
	      f.run = f;
	      f._type = name;
	      return f;
	    }
	  }, {
	    key: "on",
	    value: function on(name, f) {
	      if (!name) {
	        console.warn("name is empty");
	      }
	      this._bus.filter(function (e) {
	        return e._type === name;
	      }).map(function (e) {
	        return e.data;
	      }).onValue(f);
	    }
	  }]);

	  return App;
	})())();

	//TODO: move out somehow
	var ErrorActions = {

	  handle: function handle(err) {
	    console.error(err);
	  }

	};

	exports["default"] = App;
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = Bacon;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BaconHelper = __webpack_require__(7),
	    KiiHelper = __webpack_require__(8);

	var me_ = Bacon.fromCallback(function (callback) {
	  return $.get("./me", function (res) {
	    return callback(res);
	  });
	}).fold(null, function (a, b) {
	  return a || b;
	});

	var user_ = me_.map(function (me) {
	  var username = me.kiicloud.user.username;
	  var password = me.kiicloud.user.password;
	  console.log(me);
	  KiiHelper.init(global, me.kiicloud.config);
	  return BaconHelper.KiiUser(username, password, global);
	}).flatMap(function (e) {
	  return e;
	}).fold(null, function (a, b) {
	  return a || b;
	});

	var diagrams_ = user_.map(function (u) {
	  return u.bucketWithName("diagrams");
	});

	var UserStore = function UserStore() {
	  _classCallCheck(this, UserStore);

	  this.diagrams_ = diagrams_;
	  this.me_ = me_;
	};

	exports["default"] = new UserStore();
	module.exports = exports["default"];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Bacon = __webpack_require__(5),
	    KiiHelper = __webpack_require__(8);

	var BaconHelper = (function () {
	  function BaconHelper() {
	    _classCallCheck(this, BaconHelper);
	  }

	  _createClass(BaconHelper, [{
	    key: 'query_',

	    /*
	     * bucket_    stream to provider KiiBucket
	     * clause     KiiClause
	     */
	    value: function query_(bucket_, clause /* query all if undefined */) {
	      var q = KiiQuery.queryWithClause(clause);
	      return bucket_.map(function (bucket) {
	        return KiiHelper.Bacon.queryObjects(bucket, q);
	      }).flatMap(function (e) {
	        return e;
	      });
	    }
	  }, {
	    key: 'latest_',
	    value: function latest_(bucket_) {
	      var q = KiiQuery.queryWithClause();
	      q.sortByDesc("_modified");
	      q.setLimit(1);
	      return bucket_.map(function (bucket) {
	        return KiiHelper.Bacon.queryObjects(bucket, q);
	      }).flatMap(function (e) {
	        return e;
	      }).map(function (objs) {
	        return objs.length == 0 ? null : objs[0];
	      });
	    }

	    /** */
	  }, {
	    key: 'KiiUser',
	    value: function KiiUser(username, password, ctx) {
	      var auth_ = Bacon.fromCallback(function (callback) {
	        ctx.KiiUser.authenticate(username, password, {
	          success: function success(user) {
	            callback(user);
	          },
	          failure: function failure(user, err) {
	            callback(false);
	          }
	        });
	      });

	      var a = auth_.filter(function (user) {
	        return user;
	      });

	      var b = auth_.filter(function (b) {
	        return !b;
	      }).map(function (_) {
	        return Bacon.fromCallback(function (callback) {
	          ctx.KiiUser.userWithUsername(username, password).register({
	            success: function success(user) {
	              callback(user);
	            },
	            failure: function failure(user, err) {
	              callback(new Bacon.Error(err));
	            }
	          });
	        });
	      }).flatMap(function (e) {
	        return e;
	      });

	      return a.merge(b).fold(null, function (a, b) {
	        return a || b;
	      }).filter(function (e) {
	        return e != null;
	      });
	    }
	  }]);

	  return BaconHelper;
	})();

	exports['default'] = new BaconHelper();
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var KiiHelper = {

	  init: function init(ctx, conf) {
	    if (!(conf.app_id && conf.app_key && conf.endpoint)) {
	      throw new Error("invalid config: " + conf);
	    }
	    ctx.Kii.initializeWithSite(conf.app_id, conf.app_key, conf.endpoint);
	  },

	  queryObjects: function queryObjects(bucket, query /* query all if undefined */) {
	    return (new Promise(function (resolve, reject) {
	        return bucket.executeQuery(query, {
	          success: function success(p, r, n) {
	            resolve(r);
	          },
	          failure: function failure(u, err) {
	            reject(err, u);
	          }
	        });
	      })
	    );
	  },

	  createObject: function createObject(bucket, f) {
	    return new Promise(function (resolve, reject) {
	      var obj = bucket.createObject();
	      f(obj);
	      obj.save({
	        success: resolve,
	        failure: function failure(u, err) {
	          reject(err, u);
	        }
	      });
	    });
	  },

	  updateObject: function updateObject(obj, f) {
	    return new Promise(function (resolve, reject) {
	      f(obj);
	      obj.save({
	        success: resolve,
	        failure: function failure(u, err) {
	          reject(err, u);
	        }
	      }, false);
	    });
	  },

	  deleteObject: function deleteObject(obj) {
	    return new Promise(function (resolve, reject) {
	      return obj["delete"]({
	        success: function success(p, r, n) {
	          resolve(obj);
	        },
	        failure: function failure(u, err) {
	          reject(err, u);
	        }
	      });
	    });
	  },

	  Bacon: {
	    queryObjects: function queryObjects(bucket, q) {
	      var p = KiiHelper.queryObjects(bucket, q);
	      return Bacon.fromPromise(p);
	    }
	  }

	};

	exports["default"] = KiiHelper;
	module.exports = exports["default"];

/***/ },
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	module.exports = Immutable;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(14);
	var Bacon = __webpack_require__(5);
	var UserStore = __webpack_require__(6);
	var Header = __webpack_require__(13);
	var Body = __webpack_require__(15);
	var Footer = __webpack_require__(18);

	var Login = React.createClass({
	  displayName: "Login",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "container" },
	      React.createElement(
	        "div",
	        { className: "columns" },
	        React.createElement(
	          "div",
	          { className: "signin-form column one-half centered" },
	          React.createElement(
	            "h1",
	            null,
	            "tapioca"
	          ),
	          React.createElement(
	            "a",
	            { href: "/auth/github", className: "btn", type: "button" },
	            "Sign in with ",
	            React.createElement("span", { className: "octicon octicon-mark-github" }),
	            " account"
	          ),
	          React.createElement("hr", null),
	          React.createElement(Footer, null)
	        )
	      )
	    );
	  }

	});

	var Main = React.createClass({
	  displayName: "Main",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "main" },
	      this.state.username ? React.createElement(Header, null) : null,
	      this.state.username ? React.createElement(Body, null) : null,
	      this.state.username ? null : React.createElement(Login, null)
	    );
	  },

	  getInitialState: function getInitialState() {
	    return {
	      username: null
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    UserStore.me_.onValue(function (me) {
	      _this.setState({ username: me.github.user.username });
	    });
	  }

	});

	exports["default"] = Main;
	module.exports = exports["default"];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(14);
	var Bacon = __webpack_require__(5);
	var UserStore = __webpack_require__(6);

	var Header = React.createClass({
	  displayName: "Header",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "container" },
	      React.createElement(
	        "div",
	        { className: "columns" },
	        React.createElement(
	          "div",
	          { className: "one-half column" },
	          React.createElement(
	            "h1",
	            { className: "logo" },
	            "tapioca"
	          )
	        ),
	        React.createElement(
	          "div",
	          { className: "one-half column sign-up" },
	          React.createElement(
	            "span",
	            null,
	            React.createElement(
	              "ul",
	              { className: "menu-items" },
	              React.createElement(
	                "li",
	                null,
	                React.createElement(
	                  "a",
	                  { href: "http://jumly.tmtk.net/reference.html", target: "reference" },
	                  "DSL Reference"
	                )
	              )
	            ),
	            " ",
	            React.createElement(
	              "a",
	              { target: "//github.com/settings/applications",
	                href: "https://github.com/settings/applications",
	                className: "tooltipped tooltipped-w",
	                "aria-label": this.state.user.username },
	              React.createElement("img", { className: "avatar",
	                src: "https://avatars3.githubusercontent.com/u/" + this.state.user.id + "?v=3&s=24",
	                width: "24", height: "24" })
	            ),
	            " ",
	            React.createElement(
	              "a",
	              { href: "/logout", className: "btn", type: "button" },
	              "Sign out"
	            )
	          )
	        )
	      )
	    );
	  },

	  getInitialState: function getInitialState() {
	    return {
	      user: {}
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    UserStore.me_.onValue(function (me) {
	      _this.setState({ user: me.github.user });
	    });
	  }

	});

	exports["default"] = React.createClass({
	  displayName: "Header",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "header" },
	      React.createElement(Header, null)
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(14);
	var _ = __webpack_require__(17);
	var Actions = __webpack_require__(2);
	var Store = __webpack_require__(16);
	var Footer = __webpack_require__(18);
	var examples = __webpack_require__(19);

	var ERR_LESS_THAN_3 = 1;
	var ERR_SAME_NAME = 2;

	var Item = React.createClass({
	  displayName: "Item",

	  propTypes: {
	    diagram: React.PropTypes.object,
	    selected: React.PropTypes.bool,
	    handler: React.PropTypes.shape({
	      _select: React.PropTypes.func,
	      _remove: React.PropTypes.func
	    })
	  },

	  render: function render() {
	    var e = this.props.diagram;
	    var ctime = moment(e.ctime).format("YYYY-MM-DD hh:mm:ss");
	    var mtime = moment(e.mtime).fromNow();
	    var clz = classNames({ selected: this.props.selected });
	    var uname = e._kii.getBucket().getUser().getUsername();
	    return React.createElement(
	      "tr",
	      { className: clz },
	      React.createElement(
	        "td",
	        { className: "name" },
	        React.createElement(
	          "a",
	          { href: "#", onClick: this.props.handler._select(e) },
	          e.name
	        )
	      ),
	      React.createElement(
	        "td",
	        { className: "mtime tooltipped tooltipped-n", "aria-label": "created at " + ctime },
	        mtime
	      ),
	      React.createElement(
	        "td",
	        { className: "remove" },
	        React.createElement("a", { href: "#", onClick: this.props.handler._remove(e), className: "octicon octicon-x" })
	      ),
	      React.createElement(
	        "td",
	        { className: "ulink" },
	        React.createElement("a", { href: "/" + uname + "/" + e._id, target: "ulink", className: "octicon octicon-link-external" })
	      ),
	      React.createElement(
	        "td",
	        { className: "image" },
	        React.createElement("a", { href: this.imageURL(e), target: "image", className: "octicon octicon-file-media" })
	      )
	    );
	  },

	  imageURL: function imageURL(diag) {
	    return "http://jumly.tmtk.net/api/diagrams?data=" + encodeURIComponent(diag.body);
	  }

	});

	var Content = React.createClass({
	  displayName: "Content",

	  render: function render() {
	    var _this = this;

	    var thead = React.createElement(
	      "thead",
	      null,
	      React.createElement(
	        "th",
	        null,
	        "Name"
	      ),
	      React.createElement(
	        "th",
	        null,
	        "Last modified"
	      )
	    );
	    var c_alert = classNames({ flash: true, "flash-warn": true, "go-off": this.state.alertOff });
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "div",
	        { className: c_alert },
	        React.createElement("span", { onClick: this._turnOffAlert, className: "octicon octicon-x flash-close js-flash-close" }),
	        React.createElement("span", { className: "octicon octicon-alert" }),
	        "This service is in beta. Your data may be vanished without notice."
	      ),
	      React.createElement(
	        "div",
	        { className: "columns" },
	        React.createElement(
	          "div",
	          { className: "column one-half" },
	          React.createElement(
	            "div",
	            null,
	            React.createElement("textarea", { className: "diagram-text" })
	          ),
	          React.createElement(
	            "div",
	            null,
	            "Name: ",
	            React.createElement("input", { size: "32", className: "diagram-name", placeholder: "needs more than 2 characters" }),
	            React.createElement(
	              "button",
	              { disabled: this._isCreateDisabled(),
	                onClick: this._onCreate, className: "btn", type: "button" },
	              "Create"
	            ),
	            React.createElement(
	              "button",
	              { disabled: this._isUpdateDisabled(),
	                onClick: this._onUpdateBody, className: "btn", type: "button" },
	              "Update"
	            )
	          ),
	          React.createElement(
	            "ul",
	            { className: "examples" },
	            "Examples:",
	            React.createElement(
	              "li",
	              null,
	              React.createElement(
	                "a",
	                { href: "#", onClick: this._examples("ex0") },
	                "1"
	              )
	            ),
	            React.createElement(
	              "li",
	              null,
	              React.createElement(
	                "a",
	                { href: "#", onClick: this._examples("ex1") },
	                "2"
	              )
	            ),
	            React.createElement(
	              "li",
	              null,
	              React.createElement(
	                "a",
	                { href: "#", onClick: this._examples("ex2") },
	                "3"
	              )
	            ),
	            React.createElement(
	              "li",
	              null,
	              React.createElement(
	                "a",
	                { href: "#", onClick: this._examples("ex3") },
	                "4"
	              )
	            ),
	            React.createElement(
	              "li",
	              null,
	              React.createElement(
	                "a",
	                { href: "#", onClick: this._examples("ex4") },
	                "5"
	              )
	            )
	          )
	        ),
	        React.createElement(
	          "div",
	          { className: "column one-half diagram-list-container" },
	          React.createElement(
	            "table",
	            { className: "diagram-list" },
	            this.state.diagrams.length > 0 ? thead : null,
	            React.createElement(
	              "tbody",
	              null,
	              this.state.diagrams.map(function (e) {
	                return React.createElement(Item, { diagram: e,
	                  selected: _this.state.selectedDiagram === e,
	                  handler: _this,
	                  key: e._id });
	              })
	            )
	          ),
	          this.state.diagrams.length == 0 ? React.createElement(
	            "div",
	            { className: "blankslate" },
	            React.createElement(
	              "p",
	              null,
	              "There is no diagram."
	            )
	          ) : null
	        )
	      ),
	      this.state.error ? React.createElement(
	        "div",
	        { className: "flash flash-error" },
	        this.state.error.message
	      ) : null,
	      React.createElement("hr", null),
	      React.createElement("div", { id: "_diagram" }),
	      React.createElement("hr", null),
	      React.createElement(Footer, null)
	    );
	  },

	  getInitialState: function getInitialState() {
	    return {
	      diagrams: [],
	      selectedDiagram: null,
	      name: "",
	      error: null,
	      alertOff: false
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    var _this2 = this;

	    $(".diagram-text", this.getDOMNode()).asEventStream("keyup").map(".target.value").skipDuplicates().debounce(300).onValue(function (text) {
	      return _this2._updateBody(text);
	    });

	    $(".diagram-name", this.getDOMNode()).asEventStream("keyup").map(".target.value").skipDuplicates().onValue(function (name) {
	      return _this2._onUpdateName(name);
	    });

	    Store.diagrams().onValue(function (e) {
	      return _this2.setState({ diagrams: e });
	    });

	    Store.selectedDiagram().onValue(function (diag) {
	      return _this2.setState({ selectedDiagram: diag, name: diag.name }, function (_) {
	        return _this2._onSelected(diag);
	      });
	    });
	  },

	  _onUpdateName: function _onUpdateName(name) {
	    this.setState({ name: name });
	    var diag = _.find(this.state.diagrams, function (e) {
	      return e.name === name;
	    });
	    if (diag) {
	      this._select(diag)();
	    } else {
	      this._unselect();
	    }
	  },

	  _onCreate: function _onCreate() {
	    var name = $(".diagram-name", this.getDOMNode()).val();
	    var text = $(".diagram-text", this.getDOMNode()).val();
	    Actions.create.run(name, text);
	  },

	  _onSelected: function _onSelected(diag) {
	    $(".diagram-name", this.getDOMNode()).val(diag.name);
	    $(".diagram-text", this.getDOMNode()).val(diag.body);
	    this._clearDiagram();
	    this._updateBody(diag.body);
	  },

	  _onUpdateBody: function _onUpdateBody() {
	    var text = $(".diagram-text", this.getDOMNode()).val();
	    Actions.update(this.state.selectedDiagram, text);
	  },

	  _unselect: function _unselect() {
	    this.setState({ selectedDiagram: null });
	  },

	  _select: function _select(diag) {
	    return function (_) {
	      Actions.select(diag);
	    };
	  },

	  _remove: function _remove(diag) {
	    var _this3 = this;

	    return function (_) {
	      if (confirm("Are you sure to delete '" + diag.name + "'?")) {
	        Actions["delete"](diag);
	        $(".diagram-name", _this3.getDOMNode()).val("");
	        $(".diagram-text", _this3.getDOMNode()).val("");
	        _this3._clearDiagram();
	      }
	    };
	  },

	  _clearDiagram: function _clearDiagram() {
	    $("#_diagram > *").remove();
	  },

	  _updateBody: function _updateBody(jmcode) {
	    try {
	      JUMLY.eval($("<div>").text(jmcode), { into: "#_diagram" });
	      this.setState({ error: null });
	    } catch (ex) {
	      this.setState({ error: ex });
	    }
	  },

	  _examples: function _examples(key) {
	    var _this4 = this;

	    return function (_) {
	      $(".diagram-text", _this4.getDOMNode()).val(examples[key]).trigger("keyup");
	    };
	  },

	  _isUpdateDisabled: function _isUpdateDisabled() {
	    var a = !this._isCreateDisabled();
	    var b = this.state.diagrams.length == 0;
	    var c = this._isLessThan3(this.state.name);
	    //console.log(a, b, c);
	    return a || b || c;
	  },

	  _isCreateDisabled: function _isCreateDisabled() {
	    var name = this.state.name;
	    var a = _.find(this.state.diagrams, function (e) {
	      return e.name === name;
	    }) ? ERR_SAME_NAME : 0;
	    var b = this._isLessThan3(name);
	    return a || b;
	  },

	  _isLessThan3: function _isLessThan3(name) {
	    return name.length < 3 ? ERR_LESS_THAN_3 : 0;
	  },

	  _turnOffAlert: function _turnOffAlert() {
	    this.setState({ alertOff: true });
	  }

	});

	exports["default"] = React.createClass({
	  displayName: "Body",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "container" },
	      React.createElement(Content, null)
	    );
	  }

	});
	module.exports = exports["default"];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _constantsJs = __webpack_require__(3);

	var _ = __webpack_require__(17);

	var app = __webpack_require__(4);
	var UserStore = __webpack_require__(6);

	var DiagramStore = (function () {
	  function DiagramStore() {
	    var _this = this;

	    _classCallCheck(this, DiagramStore);

	    this._diagrams = {};
	    this._diagrams_bus = new Bacon.Bus();
	    this._selected_bus = new Bacon.Bus();

	    app.on(_constantsJs.Diagram.LOAD, function (data) {
	      _this._diagrams = data.diagrams;
	      _this._diagrams_bus.push(data.diagrams);
	      if (data.diagrams.length) {
	        _this._selected_bus.push(data.diagrams[0]);
	      }
	    });
	    app.on(_constantsJs.Diagram.CREATE, function (data) {
	      _this._diagrams.push(data.diagram);
	      _this._diagrams_bus.push(_this._diagrams);
	      _this._selected_bus.push(data.diagram);
	    });
	    app.on(_constantsJs.Diagram.SELECT, function (data) {
	      _this._selected_bus.push(data.diagram);
	    });
	    app.on(_constantsJs.Diagram.UPDATE, function (data) {
	      var d = _.find(_this._diagrams, function (e) {
	        return e._id === data.diagram._id;
	      });
	      _.assign(d, data.diagram);
	      _this._diagrams_bus.push(_this._diagrams);
	      _this._selected_bus.push(d);
	    });
	    app.on(_constantsJs.Diagram.DELETE, function (data) {
	      _.remove(_this._diagrams, function (e) {
	        return e._id === data.diagram._id;
	      });
	      _this._diagrams_bus.push(_this._diagrams);
	    });
	  }

	  _createClass(DiagramStore, [{
	    key: 'diagrams',
	    value: function diagrams() {
	      return this._diagrams_bus;
	    }
	  }, {
	    key: 'selectedDiagram',
	    value: function selectedDiagram() {
	      return this._selected_bus;
	    }
	  }]);

	  return DiagramStore;
	})();

	exports['default'] = new DiagramStore();
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = _;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(14);

	exports["default"] = React.createClass({
	  displayName: "Footer",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "footer" },
	      React.createElement(
	        "div",
	        null,
	        "© 2015 ",
	        React.createElement(
	          "a",
	          { href: "https://github.com/tmtk75" },
	          "tmtk75"
	        ),
	        " v",
	        this.state.version
	      ),
	      React.createElement(
	        "div",
	        null,
	        React.createElement("span", { className: "octicon octicon-mark-github" }),
	        " ",
	        React.createElement(
	          "a",
	          { target: "github.com", href: "https://github.com/tmtk75/tapioca" },
	          "Fork me!"
	        )
	      )
	    );
	  },

	  getInitialState: function getInitialState() {
	    return { version: "" };
	  },

	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    $.get('/_meta').then(function (meta) {
	      console.log(meta);
	      _this.setState(meta);
	    });
	  }

	});
	module.exports = exports["default"];

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = {
	  ex0: "@found \"You\", ->\n  @message \"Think\", ->\n    @message \"Write your idea\", \"JUMLY\", ->\n      @create \"Diagram\"",

	  ex1: "@found \"User\", ->\n  @message \"search\", \"Browser\", ->\n    @create asynchronous:\"connection\", \"Web Server\"\n    @message \"GET\", \"Web Server\", ->\n      @message \"find the resource\", -> @reply \"\"\n    @reply \"\", \"User\"",

	  ex2: "@found \"You\", ->\n  @alt\n    \"[found]\": ->\n      @loop ->\n        @message \"request\", \"HTTP Server\"\n        @note \"NOTE: This doesn't make sense :) just an example\"\n    \"[missing]\": ->\n      @message \"new\", \"HTTP Session\"\n  @ref \"respond resource\"",

	  ex3: "@found \"Browser\", ->\n  @message \"http request\", \"HTTP Server\", ->\n    @create \"HTTP Session\", ->\n      @message \"init\"\n      @message \"aquire lock\", \"Database\"\n    @message \"do something\"\n    @message \"release lock\", \"Database\"\n    @reply \"\", \"Browser\"",

	  ex4: "@found \"Client\", ->\n\n  @message \"ClientHello\", \"Server\", ->\n    @note \"Hi! I'm a client, let's talk in SSL.\"\n    @message \"ServerHello\", \"Client\", ->\n    @message \"Certificate\", \"Client\", ->\n    @message \"ServerKeyExchange\", \"Client\", ->\n    @message \"ServerHelloDone\", \"Client\", ->\n\n  @message \"ClientKeyExchange\", \"Server\", ->\n  @message \"[ChangeCipherSpec]\", \"Server\", ->\n  @message \"Finished\", \"Server\", ->\n    @message \"Finished\", \"Client\"\n\nclient.css \"margin-right\":\"140px\""

	};
	module.exports = exports["default"];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(21);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(23)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./styles.styl", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./styles.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(22)();
	// imports


	// module
	exports.push([module.id, ".header .menu-items {\n  display: inline-block;\n  margin-right: 1rem;\n}\n.signin-form {\n  text-align: center;\n  margin-top: 8rem;\n}\n.footer {\n  text-align: center;\n}\n.main > .header {\n  padding: 10px 0 10px 0;\n  min-width: 960px;\n  background-color: #f5f5f5;\n  border-bottom: 1px solid #e5e5e5;\n  margin-bottom: 2px;\n}\n.main > .header .logo {\n  margin: 0;\n  padding: 0;\n}\n.main > .header .sign-up {\n  text-align: right;\n}\n.diagram-text {\n  width: 100%;\n  height: 12rem;\n  font-family: \"consolas\", \"monospace\";\n  margin-bottom: 0.25rem;\n}\ninput,\nbutton {\n  margin-right: 0.25rem;\n}\nli {\n  list-style-type: none;\n}\n.examples li {\n  display: inline-block;\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n.diagram {\n  margin-left: auto;\n  margin-right: auto;\n}\n.go-off {\n  display: none;\n}\n.diagram-list-container {\n  height: 16rem;\n  overflow-y: auto;\n}\ntable.diagram-list {\n  width: 100%;\n}\ntable.diagram-list th {\n  height: 1.5rem;\n}\ntable.diagram-list td {\n  height: 1.5rem;\n  padding-right: 1rem;\n}\ntable.diagram-list .name {\n  padding-left: 1rem;\n  min-width: 8rem;\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n}\ntable.diagram-list .image {\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\ntable.diagram-list tr.selected {\n  background-color: #e2eef9;\n}\ntable.diagram-list .name {\n  width: 50%;\n}\ntable.diagram-list .mtime {\n  width: 20%;\n}\ntable.diagram-list .remove,\ntable.diagram-list .ulink,\ntable.diagram-list .image {\n  width: 10%;\n  text-align: center;\n}\n", ""]);

	// exports


/***/ },
/* 22 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	"use strict";

	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);