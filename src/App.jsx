import React, {Component} from 'react';
import ChatBar     from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
// import TestComponent from './TestComponent.jsx';
import Fetch from 'react-fetch';
import Request from 'superagent';

function searchingFor(term) {
  return function(x) {
    return x.title.toLowerCase().includes(term.toLowerCase()) || !term;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser : { name: 'Anonymous' },
      messages    : [],
      userCount: 0,
      articles: [],
      term: '',
      stocks: []
    }

    this.searchHandler = this.searchHandler.bind(this);
  }

  componentWillMount() {
    fetch('https://newsapi.org/v1/articles?source=the-wall-street-journal&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  .then(results => {
    return results.json();
     //console.log(results)
  }).then(data => {
    let articles = data.articles
    //console.log(articles)
    this.setState({articles: articles});
  //console.log("state", this.state.articles);
  })

  fetch('https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  .then(results => {
    return results.json();
     //console.log(results)
  }).then(data => {
    let articles = this.state.articles.concat(data.articles)
    //console.log(articles)
    this.setState({articles: articles});
  //console.log("state", this.state.articles);
  })

  fetch('https://newsapi.org/v1/articles?source=bloomberg&sortBy=top&apiKey=1a3af869aa784532972c9711041e4037')
  .then(results => {
    return results.json();
     //console.log(results)
  }).then(data => {
    let articles = this.state.articles.concat(data.articles)
    //console.log(articles)
    this.setState({articles: articles});
  //console.log("state", this.state.articles);
  })

  // fetch('https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=rL7FiX8-ZQyXoEjg5YMa', {
  //   mode: 'no-cors'
  // })
  // .then(results => {
  //   console.log(results)
  //   //return results.json();
  //    //console.log(results)
  // }).then(data => {
  //   let stocks = data.dataset
  //   //console.log(stocks)
  //   this.setState({stocks: stocks});
  //   //console.log("stocks", stocks);
  // //console.log("names", stocks.column_names);
  // //console.log("details", stocks.data[0]);
  // //stocks.data[0].forEach(item => { console.log(item) })
  // })

  fetch('https://query2.finance.yahoo.com/v7/finance/options/AAPL')
    .then(results => {
      return results.json()
    }).then(data => {
      let stocks = data.optionChain.result[0].quote
      console.log(stocks)
      this.setState({stocks: stocks});
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

  searchHandler(event) {
    this.setState({term: event.target.value})
  }


  render() {
    let stocks = this.state.stocks
    let articles = this.state.articles.filter(searchingFor(this.state.term)).map((article) => {
      return <div><b>{article.title}</b><br/><img src={article.urlToImage}/><br/>{article.description} <br/><a href={article.url}>{article.url}</a><br/><br/></div>
    });

if (stocks.length > 0) {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">REACT-STOCK</a>
          <h3 className="navbar-user-count">{this.state.userCount} users online</h3>
        </nav>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <input onChange={this.searchHandler} type="text" />
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
  else{
    return <div> loading...</div>
  }
  }


  // search(query){
  //   var searchRegEx = new RegExp(`${query}`, 'i')
  //   var articles = JSON.parse(this.state.articles);
  //   var search = articles.filter(function(article){
  //       return searchRegEx.test(article.title);
  //   });
  // }

}

export default App;

