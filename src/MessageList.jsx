import React, {Component} from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';


class MessageList extends Component {
  renderMessage = (message) => {
      if (message.type === "incomingMessage"){
        return <Message key={message.id} message={message} />
      } if (message.type === "incomingNotification"){
        return <Notification key={message.id} message={message} />
      }
  }

  render() {
    return (
      <main className="messages">
        { this.props.messages.map(this.renderMessage) }
      </main>
    );
  }
}

export default MessageList;
