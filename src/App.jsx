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
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RightHalf from './RightHalf';
import LeftHalf from './LeftHalf';
import { Button, Card, Row, Col } from 'react-materialize';
import Modal from'react-modal';
import FlatButton from 'material-ui/FlatButton';
  
export const grey900 = '#212121';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: null,
      userName : "" ,
      userPassword: "",
      newUser: "",
      newPassword:"",
      email: "",
      stocks: {},
      news: [],
      open: false,  
      isActive: false,
      lows: [],
      //new Set acts like an array
      names: {},
      currentTicker:""
    }
    
    this.searchTicker = this.searchTicker.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.saveUserName = this.saveUserName.bind(this);
    // this.saveUserPassword = this.saveUserPassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    // this.handlePasswordChange = this.handlePasswordChange.bind(this);
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

    fetch(`https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=max`)
      .then(results => {
        return results.json()
      }).then(data => {
        // console.log("this one")
         // console.log(data)
        let array = []
        // for (let i of data.chart.result[0].indicators.quote[0].low) {
        let timestamps = data.chart.result[0].timestamp;
        for (let z = 0; z < timestamps.length; z++) {
          let low = data.chart.result[0].indicators.quote[0].low[z]
          let a = new String(timestamps[z]) + '000'
          let y = new Date(parseInt(a))
          
          array.push({name: y, price: low});
          //console.log('parsing return', y, low)
          // }
        }
        //console.log('array', array)
        this.setState({lows: array.splice(-100)}, function() {
          //console.log('lows', this.state.lows)
        });
        
      })
      
    Modal.setAppElement('body');
  }

  componentDidMount() {
  }

  //------------------------------Ticker------------------------------------------------------
  
   searchTicker(event) {
    if(event.key === "Enter")  {
      fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${this.state.currentTicker}?range=max`)
      .then(results => {
        return results.json()
      }).then(data => {
        // console.log("this one")
         console.log(data)
        let array = []
        // for (let i of data.chart.result[0].indicators.quote[0].low) {
        let timestamps = data.chart.result[0].timestamp;
        for (let z = 0; z < timestamps.length; z++) {
          let low = data.chart.result[0].indicators.quote[0].low[z]
          let a = new String(timestamps[z]) + '000'
          let y = new Date(parseInt(a))
          
          array.push({name: y, price: low});
        }
        console.log('array', array)
        //const stateArray = array;
        this.setState({lows: array.splice(-100)}, function() {
          console.log('lows', this.state.lows)
        });
        
      })

      fetch(`https://query2.finance.yahoo.com/v7/finance/options/${this.state.currentTicker}`)
      .then(results => {
        if (results.status === 404) {
          this.setState({ currentTicker: '', wrongInput: true })
        }
        else return results.json()
      }).then(data => {
        //console.log(data);
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

      

      event.preventDefault();
    }
  }

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
            this.setState({currentTicker: ""})
            console.log(this.state)
          })
      })
    }  
  }

  handleOnChange = (event) => {
    this.setState({wrongInput: false})
    this.setState({currentTicker: event.target.value.toUpperCase()});
  }

  //----------------------Login-----------------------------------------------

  handleInputChange = (event) => {
    this.setState({userName: event.target.value})
  }

  // saveUserName = (event) =>{
  //   this.setState({userName: userName})
  // }

  // handlePasswordChange = (event) => {
  //   this.setState({userPassword: event.target.value})
  // }

  // saveUserPassword = (event) => {
  //   this.setState({userPassword: userPassword})
  // }

   handleLogin = (event) => {
    const userName = this.refs.loginUserName.value;
    const password = this.refs.loginPassword.value;

    let symObj = {}
    let currentUserId = this.state.currentUserId
     fetch(`http://localhost:3002/login/${userName}/${password}`)
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
            this.setState({
              userName: userName
            })
            this.refs.loginUserName.value = '';
            this.refs.loginPassword.value = '';
            console.log(this.state)
          })
        })
    }

//--------------------------Registration--------------------------------

  handleUserChange = (event) => {
      this.setState({newUser: event.target.value})
    }

  saveRegisterName = (event) =>{
      this.setState({newUser: newUser})
    }


  handlePasswordRegisterChange = (event) => {
      this.setState({newPassword: event.target.value})
    }

  savePassword = (event) => {
      this.setState({newPassword: newPassword})
    }

  handleEmailChange =(event) => {
      this.setState({email: event.target.value})
    }

  saveEmail = (event) => {
    this.setState({email: email})
  }

  handleRegistration  = (event) => {
    let symObj = {}
    fetch(`http://localhost:3002/register/${this.state.newUser}/${this.state.email}/${this.state.newPassword}`, { 
      method: 'POST'
    })
      .then(results => {
        return results.json()
      }).then(data => {
        console.log("data",data)
          this.setState({currentUserId: data[0]})
          console.log("id",this.state.currentUserId)
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
            this.setState({
              userName: this.state.newUser
            })
            console.log("newstate",this.state)
          })
      })
  }

//---------------------------Logout--------------------------------------
   toggleLogout = () => this.setState({currentUserId: null});



//-----------------------Side Drawer------------------------------------

  handleToggle = () => this.setState({open: !this.state.open});

  toggleModal= () => { this.setState({isActive: !this.state.isActive})

  }

//-----------------------Registration----------------------------------
  
  showLogoutButton = () => {
    if (this.state.currentUserId) {
      return (
        <div>
          Welcome {this.state.userName}
          <FlatButton className ="new" onClick = {this.toggleLogout} label="Logout" />
        </div>
      )
    }
    return null;
  }

  render() {

    let news = this.state.news.map((item, index) => {
      return <div key={index}><b>{item.title['#text']}</b><br/>{item.description['#text']} <br/><a href={item.link['#text']}>Read More </a><br/><br/></div>
    });
    let currentUserId = this.state.currentUserId;
  
    let symbols = this.state.names[currentUserId] && this.state.names[currentUserId][`symbol`]

    let names = symbols && symbols.map((name, index) => {
      return (
        <MenuItem key={index} onClick={ 
          (event) => this.handleClick(name) 
        } >
          {name}
          <IconButton tooltip="SVG Icon" >
              <ContentRemove color={grey500} onClick={ (event) => this.handleRemove(name) }/>
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
                <div className="navbar-brand">
                <a href="/" className="navbar-brand">REACT-STOCK</a>
                <div className= "login">
                <label className= "user" ><b>Username</b></label>
                <input ref="loginUserName" type="text" onChange={this.handleInputChange} placeholder="Enter User Name" name="uname" required/>
                <label className = "password"  ><b>Password</b></label>
                <input ref="loginPassword" className = "password" type="password" placeholder="Enter Password" name="psw" required/>
                <FlatButton className ="new" type="submit" onClick={this.handleLogin} label="Login"  />
                <FlatButton className ="new" onClick = {this.toggleModal} label="Create Account" />
              </div>
                </div>
                
              </nav>
              <div><br/></div>
              <div><br/></div>
              <div><br/></div>
                { this.showLogoutButton() }
              <div className = "raised-button">
                <RaisedButton
                  label="WatchList"
                  onClick={this.handleToggle}
                /> 
                <Drawer open={this.state.open}>
                <AppBar title="WatchList" style={{backgroundColor: grey900}} />
                <div><br/></div>
                  {names}
                </Drawer>
                </div> 
                
                  <Modal isOpen ={this.state.isActive} onRequestClose = {this.toggleModal} style={customStyles}>
                    <label className= "user" ><b>Username</b></label>
                    <input className = "user-reg" type="text" onChange={this.handleUserChange} onKeyPress={this.saveRegisterName} value={this.state.newUser} placeholder="Enter User Name" name="uname" required/><br/>
                    <label className= "email" ><b>Email</b></label>
                    <input className = "email"type="text" onChange={this.handleEmailChange} onKeyPress={this.saveEmail} value={this.state.email} placeholder="Enter Your Email" name="uname" required/><br/>
                    <label className = "password"  ><b>Password</b></label>
                    <input className = "password-reg" type="password" onChange={this.handlePasswordRegisterChange} onKeyPress={this.saveRegisterPassword} value={this.state.newPassword}placeholder="Enter Password" name="psw" required/><br/>
                    <button className = "register-button" type="submit" onClick={this.handleRegistration}>Register</button>
                    <button className = "close" onClick = {this.toggleModal}>Close</button>
                  </Modal> 
                <div><br/></div>
              <form>
              <input className = "ticker"
                onKeyPress={this.searchTicker} 
                onChange={this.handleOnChange} 
                value={this.state.currentTicker} 
                type="text" 
                placeholder="Enter a Ticker"
              />
              </form>
              {this.state.wrongInput && <span style={{ color: 'tomato' }}>symbol doesn't exist</span>}
              <div><br/></div>
              <section className="container">
                <LeftHalf stocks={stocks} handleAdd={this.handleAdd} lows={this.state.lows}/>
                <RightHalf news={news} />
              </section>
            <div><br/></div>
           <div className="chatbar"></div>
          </div>
          </MuiThemeProvider>
        );
      } else {
        return (
          <MuiThemeProvider>
          <div className = "container">
          <nav className="navbar">
              <a href="/" className="navbar-brand">REACT-STOCK</a>
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
