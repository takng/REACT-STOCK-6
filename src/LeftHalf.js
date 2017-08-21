import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Button, Card, Row, Col } from 'react-materialize';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'; 




// const data = [
//       // {name: 'Page A', uv: 1},
//       // {name: 'Page A', uv: 2},
//       // {name: 'Page A', uv: 3},
//       // {name: 'Page A', uv: 7},
//       // {name: 'Page A', uv: 5},
//       // {name: 'Page A', uv: 2},
//       // {name: 'Page A', uv: 6},
// ];

const d = []

export default ({ stocks, handleAdd, lows }) => {
  return (
      <div className="left-half">
          <article>
          <table className ="bordered">
            <tbody>
              <tr>
                <td>Name</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{stocks.longName}</td>
              </tr>
              <tr>
                <td>Symbol</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{stocks.symbol}</td>
              </tr>
              <tr>
               <td>Price</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               <td>{stocks.regularMarketPrice}</td>
              </tr>
              <tr>
               <td>Open</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               <td>{stocks.regularMarketOpen}</td>
              </tr>
              <tr>
               <td>High</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               <td>{stocks.regularMarketDayHigh}</td>
              </tr>
              <tr>
               <td>Low</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{stocks.regularMarketDayLow}</td>
              </tr>
              <tr>
               <td>52 Week High</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               <td>{stocks.fiftyTwoWeekHigh}</td>
              </tr>
              <tr>
               <td>52 Week Low</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               <td>{stocks.fiftyTwoWeekLow}</td>
              </tr>
              <tr>
               <td>Volume</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               <td>{stocks.regularMarketVolume}</td>
              </tr>
            </tbody>
          </table>
             <div><br/></div>

             <LineChart width={400} height={300} data={lows}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="Date" />
                <YAxis />
              </LineChart>
            <div className = "button">
              <RaisedButton
                label="Add Stock"
                labelPosition="before"
                icon={<ContentAdd/>}
                onClick= {handleAdd}
              />
            </div>
          </article>
        </div>  
  )
}
  