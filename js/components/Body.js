const React  = require("react");
const _      = require("lodash");
const Actions  = require("../actions/Actions.js");
const Store    = require("../stores/DiagramStore.js");
const Footer   = require("./Footer.js");
const examples = require("./examples.js");

const ERR_LESS_THAN_3 = 1
const ERR_SAME_NAME   = 2

const Item = React.createClass({

  propTypes: {
    diagram:  React.PropTypes.object,
    selected: React.PropTypes.bool,
    handler:  React.PropTypes.shape({
      _select: React.PropTypes.func,
      _remove: React.PropTypes.func,
    }),
  },

  render() {
    var e = this.props.diagram;
    var ctime = moment(e.ctime).format("YYYY-MM-DD hh:mm:ss");
    var mtime = moment(e.mtime).fromNow();
    var clz = classNames({selected: this.props.selected});
    var uname = e._kii.getBucket().getUser().getUsername();
    return <tr className={clz}>
             <td className="name">
               <a href="#" onClick={this.props.handler._select(e)}>{e.name}</a></td>
             <td className="mtime tooltipped tooltipped-n" aria-label={"created at " + ctime}>
               {mtime}</td>
             <td className="remove">
               <a href="#" onClick={this.props.handler._remove(e)} className="octicon octicon-x"></a></td>
             <td className="ulink">
               <a href={"/" + uname + "/" + e._id} target="ulink" className="octicon octicon-link-external"></a></td>
             <td className="image">
               <a href={this.imageURL(e)} target="image" className="octicon octicon-file-media"></a></td>
           </tr>
  },

  imageURL(diag) {
    return "http://jumly.tmtk.net/api/diagrams?data=" + encodeURIComponent(diag.body);
  },

});

const Content = React.createClass({

  render() {
    var thead = <thead>
                  <th>Name</th>
                  <th>Last modified</th>
                </thead>
    return (
      <div>
        <div className="columns">
          <div className="column one-half">
            <div>
              <textarea className="diagram-text"/>
            </div>
            <div>
              Name: <input size="32" className="diagram-name" placeholder="needs more than 2 characters"/>
              <button disabled={this._isCreateDisabled()}
                      onClick={this._onCreate} className="btn" type="button">Create</button>
              <button disabled={this._isUpdateDisabled()}
                      onClick={this._onUpdateBody} className="btn" type="button">Update</button>
            </div>
            <ul className="examples">
            Examples: 
              <li><a href="#" onClick={this._examples("ex0")}>1</a></li>
              <li><a href="#" onClick={this._examples("ex1")}>2</a></li>
              <li><a href="#" onClick={this._examples("ex2")}>3</a></li>
              <li><a href="#" onClick={this._examples("ex3")}>4</a></li>
            </ul>
          </div>

          <div className="column one-half">
            <table className="diagrams">
              {this.state.diagrams.length > 0 ? thead  : null}
              {this.state.diagrams.map(e => <Item diagram={e}
                                                  selected={this.state.selectedDiagram === e}
                                                  handler={this}
                                                  key={e._id}/>)}
            </table>
            {this.state.diagrams.length == 0 ? <div className="blankslate"><p>There is no diagram.</p></div> : null}
          </div>
        </div>

        {this.state.error ? <div className="flash flash-error">{this.state.error.message}</div> : null}

        <hr/>

        <div id="_diagram"></div>

        <hr/>
        <Footer />
      </div>
    );
  },

  getInitialState() {
    return {
      diagrams: [],
      selectedDiagram: null,
      name: "",
      error: null,
    }
  },

  componentDidMount() {
    $(".diagram-text", this.getDOMNode()).asEventStream("keyup")
      .map(".target.value")
      .skipDuplicates()
      .debounce(300)
      .onValue(text => this._updateBody(text));

    $(".diagram-name", this.getDOMNode()).asEventStream("keyup")
      .map(".target.value")
      .skipDuplicates()
      .onValue(name => this._onUpdateName(name))

    Store.diagrams().onValue(e => this.setState({diagrams: e}));

    Store.selectedDiagram()
         .onValue(diag => this.setState({selectedDiagram: diag, name: diag.name}, _ => this._onSelected(diag)));
  },

  _onUpdateName(name) {
    this.setState({name: name});
    var diag = _.find(this.state.diagrams, e => e.name === name);
    if (diag) {
      this._select(diag)();
    } else {
      this._unselect();
    }
  },

  _onCreate() {
    var name = $(".diagram-name", this.getDOMNode()).val();
    var text = $(".diagram-text", this.getDOMNode()).val();
    Actions.create.run(name, text)
  },

  _onSelected(diag) {
    $(".diagram-name", this.getDOMNode()).val(diag.name);
    $(".diagram-text", this.getDOMNode()).val(diag.body);
    this._clearDiagram();
    this._updateBody(diag.body);
  },

  _onUpdateBody() {
    var text = $(".diagram-text", this.getDOMNode()).val();
    Actions.update(this.state.selectedDiagram, text)
  },

  _unselect() {
    this.setState({selectedDiagram: null});
  },

  _select(diag) {
    return _ => {
      Actions.select(diag);
    }
  },

  _remove(diag) {
    return _ => {
      if (confirm("Are you sure to delete '" + diag.name + "'?")) {
        Actions.delete(diag);
        $(".diagram-name", this.getDOMNode()).val("");
        $(".diagram-text", this.getDOMNode()).val("");
        this._clearDiagram();
      }
    }
  },

  _clearDiagram() {
    $("#_diagram > *").remove();
  },

  _updateBody(jmcode) {
    try {
      JUMLY.eval($("<div>").text(jmcode), {into:"#_diagram"});
      this.setState({error: null});
    } catch (ex) {
      this.setState({error: ex});
    }
  },

  _examples(key) {
    return _ => {
      $(".diagram-text", this.getDOMNode()).val(examples[key]).trigger("keyup");
    }
  },

  _isUpdateDisabled() {
    var a = !this._isCreateDisabled();
    var b = this.state.diagrams.length == 0;
    var c = this._isLessThan3(this.state.name);
    //console.log(a, b, c);
    return a || b || c;
  },

  _isCreateDisabled() {
    var name = this.state.name;
    var a = _.find(this.state.diagrams, e => e.name === name) ? ERR_SAME_NAME : 0;
    var b = this._isLessThan3(name)
    return a || b;
  },

  _isLessThan3(name) {
    return name.length < 3 ? ERR_LESS_THAN_3 : 0;
  },

});

export default React.createClass({

  render() {
    return <div className="container">
             <Content />
           </div>
  }

})
