import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import LoginOrNot from './processes/loginOrNot';
import IR from './images/realIR.png'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>

		<div className="load"><img className='loader' src={IR} alt="" /></div>
	</BrowserRouter>
);

LoginOrNot().then((result) => {
	if (result) {
		root.render(
			<BrowserRouter>
				<App what={true} />
			</BrowserRouter>
		);
	}
	else {
		root.render(
			<BrowserRouter>
				<App what={false} />
			</BrowserRouter>
		);
	}


})



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
