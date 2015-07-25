"use strict"
var express        = require('express'),
    passport       = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    jade           = require("jade"),
    assets         = require("connect-assets"),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    logger         = require("morgan"),
    cookieParser   = require("cookie-parser"),
    cookieSession  = require("cookie-session"),
    path           = require("path"),
    fs             = require("fs");

var Bacon = require("baconjs"),
    xhr   = require("jquery-xhr"),
    kii   = require("./vendor/assets/KiiSDK.js").create();

const VERSION = require("./package.json").version;

//
var PORT               = process.env.PORT               || 3000;
var BASEURL            = process.env.BASEURL            || ("http://localhost:" + PORT);
var PASSWORD_SALT      = process.env.PASSWORD_SALT      || "greedy-frog"
var COOKIE_SESSION_KEY = process.env.COOKIE_SESSION_KEY || '35c64d6a5c3ffe483e2aadf18d4bf4bd'
const KII_CONFIG = {
    app_id: process.env.KII_APP_ID,
   app_key: process.env.KII_APP_KEY,
  endpoint: process.env.KII_ENDPOINT,
}
require("./js/helper/KiiHelper.js").init(kii, KII_CONFIG);

//---------------- Configure passport ----------------
passport.use(new GitHubStrategy({
    clientID:     process.env['GITHUB_CLIENT_ID'],
    clientSecret: process.env['GITHUB_CLIENT_SECRET'],
    callbackURL: BASEURL + "/auth/github/callback",  //NOTE: Must be matched to the confiuration in github.com
    scope: ["read:org", /*"gist"*/],
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(_ => done(null, {
      github: {
        profile: profile,
        accessToken: accessToken,
      },
    }));
  }
));

// NOTE: This stores serialized user in req.session.user.
//       Unique ID must be stored to deserialize.
passport.serializeUser(function(user, done) {
  done(null, user);
});

// NOTE: This restore a user object in req.user.
passport.deserializeUser(function(user, done) {
  done(null, user);
});

//---------------- Configure express ----------------
var app = express();
app.set('port', PORT);
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "jade");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({keys: [COOKIE_SESSION_KEY]}));  //TODO: secure
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(function(req, res, next) {
  res.locals.session = req.session
  next()
});
app.use('/', express.static(__dirname + "/"));
//app.use('/assets', express.static(__dirname + "/assets"));
app.use(function(req, res, next) {
  if (req.is('text/*')) {
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { req.text += chunk; });
    req.on('end', next);
  } else {
    next();
  }
});

//---------------- Configure paths ----------------
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res) {
    // never called becase of redirect to github
  });

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login?reason=failureRedirect' }),
  function(req, res) {
    res.redirect('/')
  });

app.get('/github/token', function(req, res) {
  if (req.session.passport.user) {
    res.set("content-type", "text/plain");
    res.send(req.session.passport.user.github.accessToken);
  } else {
    res.set("content-type", "application/json");
    res.status(404).send({message:"not logged in"});
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function passwdgen(seed) {
  var shasum = require('crypto').createHash('sha1');
  shasum.update(seed + (PASSWORD_SALT || "salt"));
  return shasum.digest("hex");
}

function to_me(req) {
  return {
    github: {
      user: req.user.github.profile,
    },
    kiicloud: {
      config: KII_CONFIG,
      user: {
        password: passwdgen(req.user.github.profile.username),
        username: req.user.github.profile.username,
      }
    },
  }
}

app.get('/me', function(req, res) {
  if (!req.session.passport.user) {
    return res.status(404).send({});
  }

  var me = to_me(req); 
  res.set("content-type", "application/json");
  res.send(me);
});

app.get('/:username/:_id', function(req, res) {
  if (!req.session.passport.user) {
    return res.status(404).render("404");
  }

  var me = to_me(req);
  kii.KiiUser.authenticate(me.kiicloud.user.username, me.kiicloud.user.password)
    .then(user => {
      var q = kii.KiiClause.equals("_id", req.params._id)
      return user.bucketWithName("diagrams").executeQuery(kii.KiiQuery.queryWithClause(q))
    })
    .then(results => {
      var obj = results[1][0];
      res.render("diagram", {
        username: req.params.username, 
        name: obj.get("name"),
        body: obj.get("body"),
      });
    })
    .catch(ex => {
      console.log(ex.stack);
      res.send(ex);
    });
});

app.get('/_meta', (req, res) => {
  res.send({
    version: VERSION,
  });
});

app.listen(app.get("port"), _ => console.log("server started."));

