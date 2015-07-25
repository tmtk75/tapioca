const React     = require("react");
const Bacon     = require("baconjs");
const UserStore = require("../stores/UserStore.js");
const Header = require("./Header.js");
const Body   = require("./Body.js");
const Footer = require("./Footer.js");

const Login = React.createClass({

  render() {
      return <div className="container">
               <div className="columns">
                 <div className="signin-form column one-half centered">
                   <h1>tapioca</h1>
                   <a href="/auth/github" className="btn" type="button">
                     Sign in with <span className="octicon octicon-mark-github"/> account
                   </a>
                   <hr/>
                   <Footer />
                 </div>
               </div>
             </div>
  },

})

const Main = React.createClass({

  render() {
    return <div className="main">
             {this.state.username ? <Header/> : null}
             {this.state.username ? <Body/> : null}
             {this.state.username ? null : <Login/>}
           </div>
  },

  getInitialState() {
    return {
      username: null,
    }
  },

  componentDidMount() {
    UserStore.me_.onValue(me => {
      this.setState({username: me.github.user.username})
    })
  },

})

export default Main;
