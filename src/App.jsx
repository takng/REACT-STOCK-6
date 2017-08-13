import React, {Component} from 'react';
import ChatBar     from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
// import TestComponent from './TestComponent.jsx';
import Fetch from 'react-fetch';
import Request from 'superagent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser : { name: 'Anonymous' },
      messages    : [],
      userCount: 0,
      articles: []
    }
  }

  componentWillMount() {
    fetch('https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
   // fetch('https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  .then(results => {
    return results.json();
     console.log(results)
  }).then(data => {
    let articles = data.articles
    console.log(articles)
    this.setState({articles: articles});
  //console.log("state", this.state.articles);
  })
  //fetch('https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  fetch('https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  .then(results => {
    return results.json();
     console.log(results)
  }).then(data => {
    let articles = this.state.articles.concat(data.articles)
    console.log(articles)
    this.setState({articles: articles});
  //console.log("state", this.state.articles);
  })
}

  componentDidMount() {
    this.websocket = new WebSocket("ws://localhost:3001");
    this.websocket.onopen = (event) => {
      console.log('Connected to server');
    };
    this.websocket.onmessage = (event) => {
      const userData = JSON.parse(event.data);
      switch (userData.type) {
        case "incomingCount":
          this.setState({userCount: userData.count});
          break;
        case "incomingMessage":
        case "incomingNotification":
          const messages = this.state.messages.concat(userData);
          this.setState({messages: messages});
          break;
        default:
          throw new Error("Unknown message type: " + userData.type);
      }
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUpdate(nextProps, nextState) {
  }

  sendMessage = (messageEvent) => {
    const {name, message} = messageEvent;
    const newMessage = {type: "incomingMessage", username: name, content: message};

    this.websocket.send(JSON.stringify(newMessage));
    this.setName(name);
  }

  setName = (name) => {
    if (name === this.state.currentUser.name) {
      return;
    }
    const content = this.state.currentUser.name + " name changed to " + name;

    // const newUser = Object.assign({}, this.state.currentUser, { name });
    const newUser = {...this.state.currentUser, name};
    this.state.currentUser.name = name;
    this.setState({currentUser: newUser});

    const newMessage = {type: "postNotification", content: content};
    this.websocket.send(JSON.stringify(newMessage));
  }

  updateSearch(){
    this.search(this.refs.query.value)
  }



  render() {
    let articles = this.state.articles.map((article) => {
      return <div><b>{article.title}</b> <br/>{article.description} <br/>{article.url}<br/><br/></div>
    });

    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">REACT-STOCK</a>
          <h3 className="navbar-user-count">{this.state.userCount} users online</h3>
        </nav>
        <input ref="query" onChange={(e) => {this.updateSearch();}} type="text" />
        <ul>{articles}</ul>
        <div><br/></div>
        <MessageList messages={this.state.messages}/>
        <ChatBar
          currentUser={this.state.currentUser}
          onMessageSend={this.sendMessage}
         />
      </div>
    );
  }

  search(query){
    var searchRegEx = new RegExp(`${query}`, 'i')
    var articles = JSON.parse(this.state.articles);
    var search = articles.filter(function(article){
        return searchRegEx.test(article.title);
    });
  }

}

export default App;

