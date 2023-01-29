import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import './App.css';
import './Menu.css';




function App() {

  let newDate = new Date()
  let day = newDate.getDate();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);


  let year = newDate.getFullYear();

  const [currenciesList, setCurrenciesList] = useState(null);
  const [data, setData] = useState([]);
  let selectedCurrency

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="desc">{`${payload[0].value}PLN`}</p>
        </div>
      );
    }
  }

  useEffect(() => {
    fetch('http://api.nbp.pl/api/exchangerates/tables/a/')
      .then(res => res.json())
      .then(data => setCurrenciesList(data[0].rates))
      .catch(err => console.log(err));
  })


  const chartData = data.map(rate => ({
    name: rate.effectiveDate,
    PLN: rate.mid
  }));

  function roundToTwo(value) {
    return Math.round(value * 100) / 100
  }

  function currencyChange(value) {
    const currencyParagraph = ReactDOM.createRoot(document.getElementById('currencyParagraph'));
    const plnParagraph = ReactDOM.createRoot(document.getElementById('plnParagraph'));

    const currencyElement = <p id="currencyParagraph"><input type="number" id="currency" name="currency" value={roundToTwo(value)} onChange={e => currencyChange(e.target.value)} />
      {selectedCurrency.code}</p>
    const plnElement = <p id="plnParagraph"><input type="number" id="pln" name="pln" value={roundToTwo(selectedCurrency.rates[0].mid * value)} onChange={e => plnChange(e.target.value)} />
      PLN</p>;

    currencyParagraph.render(currencyElement);
    plnParagraph.render(plnElement);
  }

  function plnChange(value) {
    const currencyParagraph = ReactDOM.createRoot(document.getElementById('currencyParagraph'));
    const plnParagraph = ReactDOM.createRoot(document.getElementById('plnParagraph'));

    const currencyElement = <p id="currencyParagraph"><input type="number" id="currency" name="currency" value={roundToTwo(value / selectedCurrency.rates[0].mid)} onChange={e => currencyChange(e.target.value)} />
      {selectedCurrency.code}</p>
    const plnElement = <p id="plnParagraph"><input type="number" id="pln" name="pln" value={roundToTwo(value)} onChange={e => plnChange(e.target.value)} />
      PLN</p>;

    currencyParagraph.render(currencyElement);
    plnParagraph.render(plnElement);
  }

  function selectCurrency(code) {
    fetch("http://api.nbp.pl/api/exchangerates/rates/a/" + code + "/" + (year - 1) + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day)
      .then(response => response.json())
      .then(response => {
        setData(response.rates);
      });
    fetch('http://api.nbp.pl/api/exchangerates/rates/a/' + code)
      .then(res => res.json())
      .then(function (data) {
        selectedCurrency = data;
        const currinfo = ReactDOM.createRoot(document.getElementById('currinfo'));
        const element = <div>
          <h2>{data.currency.toUpperCase()}</h2>
          <div id="calculator">
            <p id="currencyParagraph"><input type="number" id="currency" name="currency" value="1" onChange={e => currencyChange(e.target.value)} />
              {data.code}</p>
            <p id="plnParagraph"><input type="number" id="pln" name="pln" value={roundToTwo(selectedCurrency.rates[0].mid)} onChange={e => plnChange(e.target.value)} />
              PLN</p>
          </div>
        </div>
          ;
        currinfo.render(element);
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="App">
      {/* sidemenu */}
      <div className="sidemenu">
        <h3>Waluty</h3>
        {currenciesList && currenciesList.map(currency =>
          <p key={currency.code}> <button onClick={(e) => selectCurrency(currency.code, e)} className='sidemenu-button'> {currency.code} </button></p>
        )}
      </div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div id="content" className="content">
        <h1>Kalkulator walutowy Currex</h1>
        <div id="currinfo">Wybierz walutę z menu po lewej stronie, aby poznać kurs</div>
        { }
        {data.length > 0 &&
          <ResponsiveContainer width="100%" height={200}>

            <LineChart width={500} height={300} data={chartData}>
              <XAxis dataKey="name" tick={false} />
              <YAxis domain={['dataMin', 'dataMax']} tick={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="PLN" stroke="rgb(200, 50, 50)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        }
      </div>
    </div >
  );
}

export default App;

