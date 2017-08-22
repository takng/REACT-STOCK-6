import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Button, Card, Row, Col } from 'react-materialize';

export default ({news}) =>
	<div className="right-half">
    <article>
    	<div className ="news" >
        	<h1 className = "news">Related News</h1>
        </div>
      <ul>{news}</ul>
      </article>
   </div>