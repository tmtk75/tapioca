var Actions = require("./actions/Actions.js");
var Main    = require("./components/Main.js");

React.render(<Main />, document.getElementById('main'));
Actions.load();

