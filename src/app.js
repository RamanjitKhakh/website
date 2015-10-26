var React = require('react');
var weather = require('weather');
var request = require('request');

 
var App = React.createClass({
  getInitialState: function() {
      return {
        commands: {},
        history: [],
        prompt: '$ ',
        promptHistory: [],
        index: 0,
        temp: '',
        cond: '',
        location: ''
      }
  },
  clearHistory: function() {
      this.setState({ history: [] });
  },
  registerCommands: function() {
    this.setState({
      commands: {
        'clear' : this.clearHistory,
        'ls'    : this.listFiles,
        'intro' : this.showWelcomeMsg,
        'help'  : this.showHelp,
        'cat'   : this.catFile,
        'source': this.openLink('https://github.com/prakhar1989/react-term/blob/master/src/app.js'),
        'github': this.openLink('http://github.com/ramanjitkhakh'),
        'blog'  : this.openLink('http://prakhar.me'),
        'resume': this.openLink('http://google.com'),
        'weather': this.weather
      }
    });
  },
  listFiles: function() {
      this.addHistory("README.md");
  },
  showWelcomeMsg: function() {
      this.addHistory("Welcome! To my homepage");
      this.addHistory("Type `help` to view all possible commands");
  },
  weather: function(arg){

    
    this.addHistory(this.state.location);
    this.addHistory('current temp: ' + this.state.temp + '°F');
    this.addHistory('It is ' + this.state.cond + '.');
  
  },
  catFile: function(arg) {
      if (arg === "README.md") {
          this.addHistory('### REACT TERM');
          this.addHistory("A couple of days back, I got an email from Columbia (the university that I'm stated to join) informing me that my new email ID and other student IT services were ready. Hosting my own webpage on a university's domain had long been a wish of mine, so as soon as I learnt about having some server space on the university's server I got excited wanted to put something interesting. Since I already have " +
                          "a boring about me page, I went " +
                          "with something different and built a simple terminal emulator in React!");
          
      } else {
          this.addHistory("cat: " +  arg + ": No such file or directory");
      }
  },
  openLink: function(link) {
      return function() {
        window.open(link, '_blank');
      }
  },
  showHelp: function() {
      this.addHistory("help - this help text");
      this.addHistory("github - view my github profile");
      this.addHistory("source - browse the code for this page");
      this.addHistory("intro - print intro message");
      this.addHistory("blog - read some stuff that I've written");
      this.addHistory("clear - clear screen");
      this.addHistory("cat - print contents of a file");
      this.addHistory("ls - list files");
      this.addHistory("resume - view my resume");
  },
  componentDidMount: function() {
      var term = this.refs.term.getDOMNode();

      this.registerCommands();
      this.showWelcomeMsg();
      term.focus();
      var options = {
      url: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\'19122\')&format=json',
      headers: {
        'User-Agent': 'request'
      }
    };
    
    
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var content = JSON.parse(body);
        console.log(content.query.results.channel.item.condition);
        this.state.temp = content.query.results.channel.item.condition.temp; 
        this.state.cond = content.query.results.channel.item.condition.text;
        this.state.location = content.query.results.channel.item.title;
        //i need this -> content.query.results.channel.item;
      }
    })

  },
  componentDidUpdate: function() {
      var el = React.findDOMNode(this);
      //var container = document.getElementsByClassName('container')[0];
      var container = document.getElementById("main");
      container.scrollTop = el.scrollHeight;
  },
  handleInput: function(e) {
      if (e.key === "Enter") {
          var input_text = this.refs.term.getDOMNode().value;

          var promptHistory = this.state.promptHistory;
          var index = this.state.index;
          promptHistory.push(input_text);
          index = promptHistory.length-1;
          this.setState({
            'promptHistory' : promptHistory,
            'index' : index
          });
          

          var input_array = input_text.split(' ');
          var input = input_array[0];
          var arg = input_array[1];
          var command = this.state.commands[input];

          this.addHistory(this.state.prompt + " " + input_text);

          if (command === undefined) {
              this.addHistory("sh: command not found: " + input);
          } else {
              command(arg);
          }
          this.clearInput();
      } else if (e.key === "ArrowUp"){
        var promptHistory = this.state.promptHistory;
        var index = this.state.index;
        if( !(promptHistory.length == 0) ){
          this.refs.term.getDOMNode().value = promptHistory[index];
        }
        if(index <= 0 ){
          index = 0;
        }else{
          index--;
        }
        this.setState({
          'index' : index
        });

      } else if (e.key === 'ArrowDown'){
        var promptHistory = this.state.promptHistory;
        var index = this.state.index;
        if (index < promptHistory.length-1){
          index++;
        }
        if( !(promptHistory.length == 0) ){
          this.refs.term.getDOMNode().value = promptHistory[index];
        }
        this.setState({
          'index' : index
        });
      }
  },
  clearInput: function() {
      this.refs.term.getDOMNode().value = "";
  },
  addHistory: function(output) {
    var history = this.state.history;
    history.push(output)
    this.setState({
      'history': history
    });
  },
  handleClick: function() {
    var term = this.refs.term.getDOMNode();
    term.focus();
  },
  render: function() {
      var output = this.state.history.map(function(op, i) {
          return <p key={i}>{op}</p>
      });
      return (
        <div className='input-area' onClick={this.handleClick}>
          {output}
          <p>
            <span className="prompt">{this.state.prompt}</span> 
            <input type="text" onKeyDown={this.handleInput} ref="term" />
          </p>
        </div>
      )
  }
});

// render it dawg!
var AppComponent = React.createFactory(App);
React.render(AppComponent(), document.getElementById('app'));
