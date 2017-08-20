import Fetch from 'react-fetch';
import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {blue500} from 'material-ui/styles/colors';
import {red500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RightHalf from './RightHalf';
import LeftHalf from './LeftHalf';
import { Button, Card, Row, Col } from 'react-materialize';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: 0,
      userName : "" ,
      userPassword: "",
      stocks: {},
      news: [],
      open: false,
      //new Set acts like an array
      names: {},
      currentTicker:""
    }
    
    this.searchHandler = this.searchHandler.bind(this);
    this.searchTicker = this.searchTicker.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveUserName = this.saveUserName.bind(this);
    this.saveUserPassword = this.saveUserPassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  
  
  }

  componentWillMount() {
    let symObj = {}
    fetch(`https://query2.finance.yahoo.com/v7/finance/options/AAPL`)
      .then(results => {
        return results.json()
      }).then(data => {
        let stocks = data.optionChain.result[0].quote
        this.setState({stocks: stocks});
        })

    fetch(`http://finance.yahoo.com/rss/headline?s=AAPL`)
      .then(results => {
        return results.text()
      }).then(data => {
         let news = this.parseXml(data).rss.channel.item
        this.setState({news: news});
      })

      // fetch(`http://localhost:3002/users`)
      //  .then(results => {
      //   return results.json()
      // }).then(data => {
      //   let users = data
      //   //console.log(this.state, users)
        // this.state.users.map((user) => {
          fetch(`http://localhost:3002/symbols/${this.state.currentUserId}`)
            .then(results => {
              return results.json()
          }).then(data => {
            //console.log(data)
            symObj[this.state.currentUserId.toString()] = {symbol: data.map((obj) => {
              return obj.symbol
            })}
            this.setState({names: symObj});
            console.log(this.state)
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
      const newUser = {...this.state.currentUser, name};
      this.state.currentUser.name = name;
      this.setState({currentUser: newUser});

      const newMessage = {type: "postNotification", content: content};
      this.websocket.send(JSON.stringify(newMessage));
  }

  searchHandler(event) {
    this.setState({term: event.target.value})
  }
  
  

  handleClick(name) {
      fetch(`https://query2.finance.yahoo.com/v7/finance/options/${name}`)
      .then(results => {
        return results.json()
      }).then(data => {
        let stocks = data.optionChain.result[0].quote
        this.setState({stocks: stocks});
      })

      fetch(`http://finance.yahoo.com/rss/headline?s=${name}`)
      .then(results => {
        return results.text()
      }).then(data => {
         let news = this.parseXml(data).rss.channel.item
        this.setState({news: news});
      })
  }

  handleRemove(name) {
    // let updatedScope = this.state.names.filter((item) => { 
    //     return item != name 
    //   })
    let symObj = {}
    fetch(`http://localhost:3002/symbol/${this.state.currentUserId}/${name}`, { 
      method: 'POST'
    })
        .then(results => {
          return results.json()
      })
      fetch(`http://localhost:3002/symbols/${this.state.currentUserId}`)
            .then(results => {
              return results.json()
          }).then(data => {
            //console.log(data)
            symObj[this.state.currentUserId.toString()] = {symbol: data.map((obj) => {
              return obj.symbol
            })}
            this.setState({names: symObj});
            console.log(this.state)
          })

    // this.state.names[this.state.currentUser.id].delete(name)
    
  }

  handleAdd() {
    // if currentTicker is false for example empty is false it should not do anything
    let symObj = {}
    if(this.state.names[this.state.currentUserId].symbol.includes(this.state.currentTicker)){

      return this.setState({currentTicker: '', names: this.state.names});
    } else {
      fetch(`http://localhost:3002/ins_user_symbol/${this.state.currentUserId}/${this.state.currentTicker}`, { 
        method: 'POST'
      })
      .then(results => {
        return results.json()
      }).then(resultsBody => {
        // wait 
        fetch(`http://localhost:3002/symbols/${this.state.currentUserId}`)
          .then(results => {
            return results.json()
          }).then(data => {
            //console.log(data)
            symObj[this.state.currentUserId.toString()] = {symbol: data.map((obj) => {
              return obj.symbol
            })}
            this.setState({names: symObj});
            console.log(this.state)
          })
      })
    }  
  }

    // let local_userid = this.state.currentUser.id
    // let local_currentTicker = this.state.currentTicker
    // const formData = new FormData();
    // formData.append('user_id', local_userid);
    // formData.append('symbol', local_currentTicker);
    // fetch(`http://localhost:3002/ins_user_symbol/${this.state.currentUser.id}/${this.state.currentTicker}`, { 
    //   method: 'POST'
    // })
    //     .then(results => {
    //       return results.json()
    //   })
    //   fetch(`http://localhost:3002/symbols/${this.state.currentUser.id}`)
    //         .then(results => {
    //           return results.json()
    //       }).then(data => {
    //         //console.log(data)
    //         symObj[this.state.currentUser.id.toString()] = {symbol: data.map((obj) => {
    //           return obj.symbol
    //         })}
    //         this.setState({names: symObj});
    //         console.log(this.state)
    //       })

      // if (!this.state.currentTicker) return
      // //so this adds currentTicker to the state.names and then set the state 
      // this.state.names.add(this.state.currentTicker)
      // this.setState({currentTicker: '', names: this.state.names});
 

  handleOnChange = (event) => {
    this.setState({wrongInput: false})
    this.setState({currentTicker: event.target.value.toUpperCase()});
  }

  handleInputChange = (event) => {
    this.setState({userName: event.target.value})
  }

  saveUserName = (event) =>{
    this.setState({userName: userName})
  }

  handlePasswordChange = (event) => {
    this.setState({userPassword: event.target.value})
  }

  saveUserPassword = (event) =>{
    this.setState({userPassword: userPassword})
  }

   handleLogin = (event) => {
    let symObj = {}
    let currentUserId = this.state.currentUserId
     fetch(`http://localhost:3002/login/${this.state.userName}/${this.state.userPassword}`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
          this.setState({currentUserId: data[0].id})
          console.log(this.state)
          fetch(`http://localhost:3002/symbols/${this.state.currentUserId}`)
          .then(results => {
            return results.json()
          }).then(data => {
            console.log("TEST MESSAGE")
            //console.log(data)
            symObj[this.state.currentUserId.toString()] = {symbol: data.map((obj) => {
              return obj.symbol
            })}
            this.setState({names: symObj});
            console.log(this.state)
          })
        })
        
    }

  searchTicker(event) {
    if(event.key === "Enter")  {
      fetch(`https://query2.finance.yahoo.com/v7/finance/options/${this.state.currentTicker}`)
      .then(results => {
        if (results.status === 404) {
          this.setState({ currentTicker: '', wrongInput: true })
        }
        else return results.json()
      }).then(data => {
        let stocks = data.optionChain.result[0].quote
        this.setState({
          stocks: stocks,
        })
      })

      fetch(`http://finance.yahoo.com/rss/headline?s=${this.state.currentTicker}`)
      .then(results => {
        return results.text()
      }).then(data => {
         let news = this.parseXml(data).rss.channel.item
         if(news) {
          this.setState({news: news});
         }
        else {
          this.prevState({ news: news});
        }
      })

      fetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${this.state.currentTicker}?formatted=true&lang=en-CA&region=CA&modules=defaultKeyStatistics,financialData,calendarEvents`)
      .then(results => {
        return results.json()
      }).then(data => {
        let stats = data
        console.log(stats)
      })

      event.preventDefault();
    }
  }

// handleInputChange (event) {
//   let userName = this.state.userName
//   console.log("username". userName)
//   this.setState({userName: event.target.value})
//   console.log("new", userName)
// }


  handleToggle = () => this.setState({open: !this.state.open});

  parseXml(xml, arrayTags) {
    var dom = null;
    if (window.DOMParser){
        dom = (new DOMParser()).parseFromString(xml, "text/xml");
    }else if (window.ActiveXObject) {
        dom = new ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml)) {
            throw dom.parseError.reason + " " + dom.parseError.srcText;
        }
    }else {
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

  render() {

    let news = this.state.news.map((item, index) => {
      return <div key={index}><b>{item.title['#text']}</b><br/>{item.description['#text']} <br/><a href={item.link['#text']}>Read More </a><br/><br/></div>
    });
    let currentUserId = this.state.currentUserId;
    //console.log(this.state)
    //console.log(this.state.names[currentUserId] && this.state.names[currentUserId][`symbol`])
    let symbols = this.state.names[currentUserId] && this.state.names[currentUserId][`symbol`]

    let names = symbols && symbols.map((name, index) => {
          return (
            <MenuItem key={index} onClick={ 
              (event) => this.handleClick(name) 
            } >
              {name}
              <IconButton tooltip="SVG Icon" >
                  <ContentRemove color={blue500} onClick={ (event) => this.handleRemove(name) }/>
              </IconButton>
            </MenuItem>
          )
    });

    let stocks = this.state.stocks
    if (Object.keys(stocks).length > 0) {
        return (
          <MuiThemeProvider>
            <div className = "container">
              <nav className="navbar">
                <a href="/" className="navbar-brand">REACT-STOCK</a>
                <div className= "login">
                <h3 className="navbar-login>"></h3>
                <label className= "user" ><b>Username</b></label>
                <input type="text" onChange={this.handleInputChange} onKeyPress={this.saveUserName} value={this.state.userName} placeholder="Enter User Name" name="uname" required/>
                <label className = "password"  ><b>Password</b></label>
                <input className = "password" type="password" onChange={this.handlePasswordChange} onKeyPress={this.saveUserPassword} value={this.state.userPassword}placeholder="Enter Password" name="psw" required/>
                <button type="submit" onClick={this.handleLogin}>Login</button>
              </div>
              </nav>
              <div><br/></div>
              <div><br/></div>
              <div><br/></div>
              <div className = "raised-button">
                <RaisedButton
                  label="WatchList"
                  onClick={this.handleToggle}
                />  
                <div><br/></div>
                <Drawer open={this.state.open}>
                <div><br/></div>
                <h1><b>Your WatchList</b></h1>
                  {names}
                </Drawer>
              </div>
              <form>
              <input className = "ticker"
                onKeyPress={this.searchTicker} 
                onChange={this.handleOnChange} 
                value={this.state.currentTicker} 
                type="text" 
                placeholder="Enter a Ticker"
                // style={{
                //   ...(this.state.wrongInput ? 
                //     {
                //       borderColor: '#ff3667',
                //       outline: 0,
                //       boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6)'
                //     }
                //     : {})
                // }}
              />
              </form>
              {this.state.wrongInput && <span style={{ color: 'tomato' }}>symbol doesn't exist</span>}
              <div><br/></div>
              <section className="container">
                <LeftHalf stocks={stocks} handleAdd={this.handleAdd}/>
                <RightHalf news={news} />
              </section>
            <div><br/></div>
           <div className="chatbar"></div>
          </div>
          </MuiThemeProvider>
        );
      }else {
        return (
          <MuiThemeProvider>
          <div className = "container">
          <nav className="navbar">
              <a href="/" className="navbar-brand">REACT-STOCK</a>
              <h3 className="navbar-user-count">{this.state.userCount} users online</h3>
            </nav>
             <div>
            <RaisedButton
              label="WatchList"
              onClick={this.handleToggle}
            />
            <div><br/></div>
            <Drawer open={this.state.open}>
              <div><br/></div>
              <h1>Your WatchList</h1>
              <MenuItem>{names}</MenuItem>
            </Drawer>
          </div>
          <input onKeyPress={this.searchTicker} type="text" placeholder="Enter a Ticker"/>
           <div><br/></div>
           <section className="container">
                <LeftHalf stocks={stocks} handleAdd={this.handleAdd}/>
                <RightHalf news={news} /> 
              </section>
            <div><br/></div>
            <div className="chatbar"></div>
          </div>
          </MuiThemeProvider>
        )
      }
    }

  }

    export default App;
