import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Button, Card, Row, Col } from 'react-materialize';

export default ({news}) =>
	<div className="right-half">
    <article>
      <h1 className ="news">Related News</h1>
      <ul>{news}</ul>
      </article>
   </div>