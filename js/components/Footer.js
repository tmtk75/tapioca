const React  = require("react");

export default React.createClass({

  render() {
    return <div className="footer">
             &copy; 2015 <a href="https://github.com/tmtk75">tmtk75</a> v{this.state.version}
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
