var Bacon = require("baconjs");
var $ = require("jquery");

var access_token_ = Bacon.fromCallback(callback => $.get("./github/token", res => callback(res)))
                         .fold(null, (a, b) => b)

class GithubHelper {

  user(login) {
    return access_token_.map(token =>
      Bacon.fromPromise(
        $.ajax({
          type: 'GET',
          url: 'https://api.github.com/users/' + login,
          //headers: { Authorization: "token " + token},
        }))).flatMap(e => e)
  }

  query_teams_() {
    return access_token_.map(token =>
      Bacon.fromPromise(
        $.ajax({
          type: 'GET',
          url: 'https://api.github.com/user/teams',
          headers: { Authorization: "token " + token},
        }))).flatMap(e => e)
  }

  users(text) {
    return Bacon.fromPromise(
      $.ajax({
        type: 'GET',
        url: 'https://api.github.com/search/users',
        data: {q: text},
        //headers: { Authorization: "token " + config.access_token},
      }))
  }

  members_() {
    return Bacon.fromPromise(
             $.ajax({
               type: 'GET',
               url: 'https://api.github.com/orgs/KiiCorp/members',
             }))
  }

  issues() {
    var baseurl = 'https://api.github.com/orgs/' + config.organization + '/issues?filter=all&per_page=100';
    
    var pages_ = access_token_.map(token =>
      Bacon.fromCallback(callback =>
        $.ajax({
          type: 'HEAD',
          url: baseurl + '&page=1',
          headers: { Authorization: "token " + token },
          error: (err) => {
            callback(new Bacon.Error(err))
          },
          success: (res, stat, ajax) => {
            var link = ajax.getResponseHeader("Link")
            var page = link.split(",")[1].match(/[^_]page=([0-9]+)/)[1];
            callback(parseInt(page));
          },
        })))
      .flatMap(e => e)
      .map(a => _.range(1, a + 1));
    
    var responses_ = pages_.flatMap(a =>
      Bacon.fromArray(a)
        .flatMap(e => 
          access_token_.map(token =>
            Bacon.fromPromise($.ajax(baseurl + '&page=' + e + '&access_token=' + token))
          )
          .flatMap(e => e)
        )
    );
    
    var issues_ = responses_.scan([], (a, b) => a.concat(b));
    
    // Progress
    var prog_max_ = pages_.map(e => e.length);
    var prog_val_ = responses_.map(e => 1)
                              .scan(0, (acc, v) => acc + v);
    
    var progress_ = prog_max_.combine(prog_val_,
                      (max, val) => ({value: val, max: max}));
    // For test
    issues_ = Bacon.fromPromise($.ajax("./sample/issues.json")).fold([], (a, b) => a.concat(b));
    progress_ = Bacon.constant({value: 4, max:11});
    
    return {issues_: issues_, progress_: progress_};
  }
}

export default new GithubHelper
