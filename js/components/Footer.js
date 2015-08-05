const React  = require("react");

export default React.createClass({

  render() {
    return <div className="footer">
             <div>
               &copy; 2015 <a href="https://github.com/tmtk75">tmtk75</a> v{this.state.version}
             </div>
             <div>
               <span className="octicon octicon-mark-github"></span>
               &nbsp;
               <a target="github.com" href="https://github.com/tmtk75/tapioca">Fork me!</a>
             </div>
           </div>
  },

  getInitialState() {
    return {version: ""}
  },

  componentDidMount() {
    $.get('/_meta').then(meta => {
      console.log(meta);
      this.setState(meta);
    })
  }

});
