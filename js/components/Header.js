const React     = require("react");
const Bacon     = require("baconjs");
const UserStore = require("../stores/UserStore.js");

const Header = React.createClass({
  render() {
    return (
      <div className="container">
        <div className="columns">
          <div className="one-half column">
            <h1 className="logo">tapioca</h1>
          </div>
          <div className="one-half column sign-up">
            <span>
              <ul className="menu-items">
                <li><a href="http://jumly.tmtk.net/reference.html" target="reference">DSL Reference</a></li>
              </ul>
              &nbsp;
              <a target="//github.com/settings/applications"
                 href="https://github.com/settings/applications"
                 className="tooltipped tooltipped-w"
                 aria-label={this.state.user.username}>
                 <img className="avatar"
                      src={"https://avatars3.githubusercontent.com/u/" + this.state.user.id + "?v=3&s=24"}
                      width="24" height="24"/>
              </a>
              &nbsp;
              <a href="/logout" className="btn" type="button">Sign out</a>
            </span>
          </div>
        </div>
      </div>
      )
  },

  getInitialState() {
    return {
      user: {},
    }
  },

  componentDidMount() {
    UserStore.me_.onValue(me => {
      this.setState({user: me.github.user})
    })
  },

});


export default React.createClass({
  render() {
    return <div className="header">
             <Header />
           </div>
  }
})
