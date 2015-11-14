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
        'github': this.openLink('http://github.com/ramanjitkhakh'),
        'resume': this.openLink('https://github.com/RamanjitKhakh/ramanjitkhakh.github.io/blob/master/Ramanjit%20Khakh%20Resume.pdf'),
        'weather': this.weather,
        'ayy': this.ayylmao,
        'contact': this.contactMe
      }
    });
  },
  contactMe: function() {

    this.addHistory("Wanna contact me?");
    this.addHistory("Email: person@temple.edu (promise it's a real email)");
    this.addHistory("Alternative Email: ramanjit456@yahoo.co.in");
    this.addHistory("Github: ramanjitkhakh (type command \'github\' to go to my profile)");
    this.addHistory("Website: press f5");
  },
  listFiles: function() {
      this.addHistory("README.md");
  },
  showWelcomeMsg: function() {
      this.addHistory("Welcome! To my homepage");
      this.addHistory("Type `help` to view all possible commands");
  },
  ayylmao: function() {
    document.getElementById('ayy').style.bottom = 0; 
  },
  weather: function(arg){   
    this.addHistory(this.state.location);
    this.addHistory('current temp: ' + this.state.temp + '°F');
    this.addHistory('It is ' + this.state.cond + '.');
  
  },
  catFile: function(arg) {
      if (arg === "README.md") {
          this.addHistory('#########################################################################');
          this.addHistory("Hello, my name is Ramanjit Khakh. I am a Computer Science student attending Temple University in Philadelphia " +
                          "I started programming in 10th grade of High school and I remember looking at System.out.println statement and " +
                          "thought to myself, \"this isn\'t enough...\" so from that moment on, I decided to pursue a career in computing " +
                          "always looking for more. I enjoy working on low level programming using C and x86 asm. I am always fascinated in " +
                          "operating systems and video games development (not so much video games, weird right?). I hope you enjoyed my cave " +
                          "of the internet. Have a look around!");
          this.addHistory(" Type \'help\' to list some possible commands");
          this.addHistory("(there are hidden commands too :^) )");
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
      this.addHistory("intro - print intro message");
      this.addHistory("blog - read some stuff that I've written");
      this.addHistory("clear - clear screen");
      this.addHistory("cat - print contents of a file");
      this.addHistory("ls - list files");
      this.addHistory("resume - view my resume");
      this.addHistory("weather - view Philadelphia weather");
      this.addHistory("contact - list ways to contact me");
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
          if(input_text.trim() != ''){
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
          }
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
