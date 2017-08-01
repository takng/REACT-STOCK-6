// exported into MessageList

import React, { Component } from 'react';

class Notification extends Component {
  render() {
    return (
      <div className="message system">
        {this.props.message.content}
      </div>
    );
  }
}

export default Notification;
