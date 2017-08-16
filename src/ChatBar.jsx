import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValue: this.props.currentUser.name,
      messageValue: ""
    };
  }

  handleMessageChange = (event) => {

    this.setState({messageValue: event.target.value});
  }

  handleNameChange = (event) => {
    const username = event.target.value;
    this.setState({nameValue: username});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onMessageSend({
      name: this.state.nameValue,
      message: this.state.messageValue
    });
    this.setState({messageValue: ''});
  }

  render() {
    const hiddenStyles = {
      height: '0px', width: '0px', border: 'none', padding: '0px'
    };
    return (
        <div className="chatbar">
        </div>
    );
  }
}

export default ChatBar;
