import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default ({ stocks, handleAdd }) =>
	<div className="left-half">
      <article>
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
            </tr>
          </tbody>
        </table>
         <div><br/></div>
        <div>
          <RaisedButton
            label="Add Stock"
            labelPosition="before"
            primary={true}
            icon={<ContentAdd/>}
            onClick= {handleAdd}
          />
        </div>
      </article>
    </div>