import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import './App.css';
import './Menu.css';



function App() {

  const [currenciesList, setCurrenciesList] = useState(null);
  const [selectedCurrency, setStelectedCurrency] = useState(null);

  useEffect(() => {
    fetch('http://api.nbp.pl/api/exchangerates/tables/a/')
      .then(res => res.json())
      // .then(data => console.log(data[0].rates))
      .then(data => setCurrenciesList(data[0].rates))
      .catch(err => console.log(err));
  })


  function selectCurrency(code) {
    fetch('http://api.nbp.pl/api/exchangerates/rates/a/' + code)
      .then(res => res.json())
      // .then(data => console.log(data))

      .then(function (data) {
        const currinfo = ReactDOM.createRoot(
          document.getElementById('currinfo')
        );
        const element = <div>
          <h2>{data.currency.toUpperCase()}</h2>
          <p>1 {data.code} = {data.rates[0].mid} PLN </p>
        </div>
          ;
        currinfo.render(element);
      })
      .then(data => setStelectedCurrency(data))
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
      {/* animated bg */}
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      {/* content */}
      <div id="content" className="content">
        <h1>Kalkulator walutowy Currex</h1>

        <div id="currinfo">Wybierz walutę z menu po lewej stronie, aby poznać kurs</div>
      </div>
    </div >
  );
}

export default App;
