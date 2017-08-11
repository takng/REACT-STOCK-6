import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
        <div className="message">
          <span className="message-content">{this.props.message.content}</span>
        </div>
    );
  }
}
export default Message;
