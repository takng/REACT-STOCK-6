import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default ({news}) =>
	<div className="right-half">
    <article>
      <h1>Related News</h1>
      <ul>{news}</ul>
      </article>
   </div>