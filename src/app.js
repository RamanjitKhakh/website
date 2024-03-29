var React = require('react');
var weather = require('weather');
var request = require('request');
var source = [];

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
        location: '',
        cenaRun: false
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
        'contact': this.contactMe,
        'cena': this.cena
      }
    });
  },
  loading: function(){
    document.getElementsByTagName('input')[0].disabled = true;
    document.getElementsByClassName('prompt')[0].textContent = '';
    setTimeout(function(){
      this.addHistory('loading...')
    }.bind(this),200)
    setTimeout(function(){
      this.addHistory('installing local runtime')
    }.bind(this),300)
    setTimeout(function(){
      this.addHistory('configuring graphics')
    }.bind(this),1200)
    setTimeout(function(){
      this.addHistory('installing dependencies...')
    }.bind(this),1700)
    setTimeout(function(){
      this.addHistory('loading Box2d Physics Engine...')
    }.bind(this),2000)
    setTimeout(function(){
      this.addHistory('loading Web Audio Context...')
    }.bind(this),2400)
    setTimeout(function(){
      this.addHistory('cleaning temp files...')
    }.bind(this),2900)
    setTimeout(function(){
      this.addHistory('complete!')
    }.bind(this),3300)
    setTimeout(function(){
      this.showWelcomeMsg();
    }.bind(this),3500)
    setTimeout(function(){
      document.getElementsByTagName('input')[0].disabled = false;
      document.getElementsByClassName('prompt')[0].textContent = '$ ';
      document.getElementsByTagName('input')[0].focus();
    }.bind(this),3700)
  },
  cena: function(){
    var newHeight = '';
    var eventStart = true;
    document.getElementById('theCena').addEventListener('transitionend',function(e){
      if(eventStart){
        eventStart = false;

        var initialWidth = document.getElementById('terminal').offsetWidth;
        var initialHeight = document.getElementById('terminal').offsetHeight;

        document.getElementById('theCena').style.bottom = '-' + window.innerHeight + 'px';
        document.getElementById('terminal').style.transition = 'all 5s';

        var initialWidth = document.getElementById('terminal').offsetWidth;

        document.getElementById('terminal').style.width = initialWidth + 'px';


        document.getElementById('terminal').style.position = 'absolute';


        document.getElementById('terminal').offsetWidth = initialWidth + 'px';
        var adjustHeight = parseInt(newHeight.substring(0, newHeight.length-2));

        document.getElementById('terminal').style.top =  document.getElementById('terminal').style.top = window.innerHeight - 40 + 'px';


        document.getElementById('terminal').addEventListener('transitionend', function(){

          document.getElementById('terminal').style.transition = 'all 0s';
        }, false);
      }


    });
    if(this.state.cenaRun === false){
      this.setState({cenaRun: true});


      var initialTop = document.getElementById('terminal').offsetTop + 'px';
      document.getElementById('terminal').style.top = initialTop;


      var terminalLeft = document.getElementById('terminal').style.left;

      main = document.getElementById('main')
      mw = parseInt(window.getComputedStyle(main).width, 10)
      pw = parseInt(window.getComputedStyle(main.parentElement).width, 10)
      var marginOffset = (pw - mw)/2


      if(terminalLeft === ''){

        terminalLeft = marginOffset;
      }else{
        terminalLeft = parseInt(terminalLeft.substring(0, terminalLeft.length-2));
        terminalLeft += marginOffset;
      }
      document.getElementById('theCena').style.left =  terminalLeft + 'px';
      newHeight = (window.innerHeight - document.getElementById('terminal').offsetTop - 260) + 'px';
      document.getElementById('theCena').style.bottom = (window.innerHeight - document.getElementById('terminal').offsetTop - 270) + 'px';



      var context = new AudioContext();


      var request = new XMLHttpRequest();

      source = context.createBufferSource();
      request.open('GET', './src/cena.mp3', true);
      request.responseType = 'arraybuffer';
      request.onload = function(){
        var AudioDate = request.response;
        context.decodeAudioData(AudioDate, function(b){
          source.buffer = b;
          source.connect(context.destination);// to speakers
          source.loop = true;
        }, function(e){"error! with data " + e});
      }

      request.send();

      source.start(0);
      setTimeout(function(){
        source.stop()
        this.setState({'cenaRun' : false});
      }.bind(this), 15500);
    }

  }
  ,
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
          this.addHistory("Hello, my name is Ramanjit Khakh. I am a Computer Science student attending Temple University in Philadelphia. " +
                          "I started programming in 10th grade of High school and I remember looking at System.out.println statement " +
                          "thinking to myself, \"this isn\'t enough...\", so from that moment on, I decided to pursue a career in computing " +
                          "always looking for more. I enjoy working on low level programming using C and x86 asm. I am always fascinated in " +
                          "operating systems and video games development (not so much video games, weird right?). " +
                          "I like building and tinkering with things and I will go to various Hackathons with kids from my School, feel free to say Hi if you see me. " +
                          "Please Check out my Github account for things I am working on. I hope you enjoyed my cave " +
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
      this.loading();
      term.focus();
      var options = {
      url: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\'19122\')&format=json',
      headers: {
        'User-Agent': 'request'
      }
    };
    //setTimeout(this.showWelcomeMsg(), 400);

    request(options, this.weatherRequest)


  },
  componentWillMount: function(){
    console.log("%cTryna find some secrets?", "background: black; color: lime; font-size: x-large");
  },
  weatherRequest: function(error, response, body){
      if (!error && response.statusCode == 200) {
        var content = JSON.parse(body);
        this.setState({
          temp: content.query.results.channel.item.condition.temp,
          cond: content.query.results.channel.item.condition.text,
          location: content.query.results.channel.item.title
        });
      }
  },
  componentDidUpdate: function() {
      var el = React.findDOMNode(this);
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


var AppComponent = React.createFactory(App);
React.render(AppComponent(), document.getElementById('app'));
