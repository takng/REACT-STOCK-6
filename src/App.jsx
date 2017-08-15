import React, {Component} from 'react';
import ChatBar     from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import Fetch from 'react-fetch';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


// function searchingFor(term) {
//   return function(x) {
//     return x.title.toLowerCase().includes(term.toLowerCase()) || !term;
//   }
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser : { name: 'Anonymous' },
      messages    : [],
      userCount: 0,
      stocks: {},
      news: [],
      open: false
    }
    //this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.searchTicker = this.searchTicker.bind(this);

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
      const newUser = {...this.state.currentUser, name};
      this.state.currentUser.name = name;
      this.setState({currentUser: newUser});

      const newMessage = {type: "postNotification", content: content};
      this.websocket.send(JSON.stringify(newMessage));
  }

  searchHandler(event) {
    this.setState({term: event.target.value})
  }

  searchTicker(event) {
    if(event.key === "Enter") {
      fetch(`https://query2.finance.yahoo.com/v7/finance/options/${event.target.value}`)
      .then(results => {
        return results.json()
      }).then(data => {
        let stocks = data.optionChain.result[0].quote
        this.setState({stocks: stocks});
      })

      fetch(`http://finance.yahoo.com/rss/headline?s=${event.target.value}`)
      .then(results => {
        return results.text()
      }).then(data => {
         let news = this.parseXml(data).rss.channel.item
        this.setState({news: news});
      })
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  parseXml(xml, arrayTags) {
    var dom = null;
    if (window.DOMParser){
        dom = (new DOMParser()).parseFromString(xml, "text/xml");
    } else if (window.ActiveXObject) {
        dom = new ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml)) {
            throw dom.parseError.reason + " " + dom.parseError.srcText;
        }
    } else {
        throw "cannot parse xml string!";
    }

    function isArray(o) {
        return Object.prototype.toString.apply(o) === '[object Array]';
    }

    function parseNode(xmlNode, result) {
        if (xmlNode.nodeName == "#text") {
            var v = xmlNode.nodeValue;
            if (v.trim()) {
               result['#text'] = v;
            }
            return;
        }

        var jsonNode = {};
        var existing = result[xmlNode.nodeName];
        if(existing) {
            if(!isArray(existing)) {
                result[xmlNode.nodeName] = [existing, jsonNode];
            } else{
                result[xmlNode.nodeName].push(jsonNode);
            }
        } else {
            if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1) {
                result[xmlNode.nodeName] = [jsonNode];
            } else {
                result[xmlNode.nodeName] = jsonNode;
            }
        }

        if(xmlNode.attributes) {
            var length = xmlNode.attributes.length;
            for(var i = 0; i < length; i++) {
                var attribute = xmlNode.attributes[i];
                jsonNode[attribute.nodeName] = attribute.nodeValue;
            }
        }

        var length = xmlNode.childNodes.length;
        for(var i = 0; i < length; i++) {
            parseNode(xmlNode.childNodes[i], jsonNode);
        }
    }

    var result = {};
    if(dom.childNodes.length) {
        parseNode(dom.childNodes[0], result);
    }

    return result;
}

// onSetSidebarOpen = (open)  => {
//     this.setState({sidebarOpen: open});
//   }

  render() {
    //var sidebarContent = <b>Sidebar content</b>;
    let news = this.state.news.map((item) => {
      return <div><b>{item.title['#text']}</b><br/>{item.description['#text']} <br/><a href={item.link['#text']}>{item.link['#text']}</a><br/><br/></div>
    });
    let stocks = this.state.stocks
    if (Object.keys(stocks).length > 0) {
        return (
          <MuiThemeProvider>
            <div className = "container">
              <div>
                <RaisedButton
                  label="Toggle Drawer"
                  onClick={this.handleToggle}
                />
                <Drawer open={this.state.open}>
                  <MenuItem>Menu Item</MenuItem>
                  <MenuItem>Menu Item 2</MenuItem>
                </Drawer>
              </div>
            <nav className="navbar">
              <a href="/" className="navbar-brand">REACT-STOCK</a>
              <h3 className="navbar-user-count">{this.state.userCount} users online</h3>
            </nav>
            <input onKeyPress={this.searchTicker} type="text" placeholder="Enter a Ticker"/>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>52 Week High</th>
                  <th>52 Week Low</th>
                  <th>Volume</th>
                  <th>Market Cap</th>
                  <th>Dividend Yield</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{stocks.longName}</td>
                  <td>{stocks.symbol}</td>
                  <td>{stocks.regularMarketPrice}</td>
                  <td>{stocks.regularMarketOpen}</td>
                  <td>{stocks.regularMarketDayHigh}</td>
                  <td>{stocks.regularMarketDayLow}</td>
                  <td>{stocks.fiftyTwoWeekHigh}</td>
                  <td>{stocks.fiftyTwoWeekLow}</td>
                  <td>{stocks.regularMarketVolume}</td>
                  <td>{stocks.marketCap}</td>
                  <td>{stocks.trailingAnnualDividendYield}</td>
                </tr>
              </tbody>
            </table>
            <ul>{news}</ul>
            <div><br/></div>
            <MessageList messages={this.state.messages}/>
            <ChatBar
              currentUser={this.state.currentUser}
              onMessageSend={this.sendMessage}
             />
          </div>
          </MuiThemeProvider>
        );
      }
      else{
        return (
<MuiThemeProvider>
          <div>
           <div>
            <RaisedButton
              label="Toggle Drawer"
              onClick={this.handleToggle}
            />
            <Drawer open={this.state.open}>
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
            </Drawer>
          </div>

            <nav className="navbar">
              <a href="/" className="navbar-brand">REACT-STOCK</a>
              <h3 className="navbar-user-count">{this.state.userCount} users online</h3>
            </nav>

            <input onKeyPress={this.searchTicker} type="text" placeholder="Enter a Ticker"/>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>52 Week High</th>
                  <th>52 Week Low</th>
                  <th>Volume</th>
                  <th>Market Cap</th>
                  <th>Dividend Yield</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <ul>{news}</ul>
            <div><br/></div>
            <MessageList messages={this.state.messages}/>
            <ChatBar
              currentUser={this.state.currentUser}
              onMessageSend={this.sendMessage}
             />
          </div>
          </MuiThemeProvider>
        )
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
