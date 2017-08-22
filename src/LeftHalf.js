import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Button, Card, Row, Col } from 'react-materialize';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'; 

//const d = []

export default ({ stocks, handleAdd, lows }) => {
  console.log(stocks.regularMarketChangePercent)
  if (stocks.regularMarketChangePercent >= 1) {
      return (
      <div className="left-half">
          <article>
          <div className = "stats" >
          <h1 className = "stats"> Stock Details</h1>
          </div>
          <div><br/></div>
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
               <td>Previous Close</td>
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
               <td>{stocks.regularMarketPreviousClose}</td>
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
               <td>Percentage Change</td>
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
               <td className = "percentage">{stocks.regularMarketChangePercent}</td>
              </tr>
              <tr className= "last-tr">
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
             <LineChart width={500} height={300} data={lows}>
                <Line type="monotone" dataKey="price" stroke="#026ed1" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="Date" />
                <Tooltip />
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
    } else {

  return (
      <div className="left-half">
          <article>
          <div className = "stats" >
          <h1 className = "stats"> Stock Details</h1>
          </div>
          <div><br/></div>
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
               <td>Previous Close</td>
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
               <td>{stocks.regularMarketPreviousClose}</td>
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
               <td>Percentage Change</td>
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
               <td>{stocks.regularMarketChangePercent}</td>
              </tr>
              <tr className= "last-tr">
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

             <LineChart width={500} height={300} data={lows}>
                <Line type="monotone" dataKey="price" stroke="#026ed1" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="Date" />
                <Tooltip />
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
}
  