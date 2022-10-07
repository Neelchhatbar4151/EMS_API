import React, { createContext, useReducer, useLayoutEffect } from 'react';
import { Route, Routes } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import './index.css';
import './autho.css';
import './error.css';
import './EMS.css';
import './history.css';
import './main.css';
import './profile.css'
import './Home.css'

import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Error from './components/Error';
import Register from './components/Register';
import Autho from './components/Autho';
import Mentions from './components/Mentions';
import Profile from './components/Profile'
import History from './components/History';
import Dashboard from './components/Dashboard';
import Ne from './components/Ne'
import Tr from './components/Tr';
import Sa from './components/Sa';
import Cu from './components/Cu';
import Bo from './components/Bo';
import Forgot from './components/Forgot'
import Employees from './components/Employees'

export const UserContext = createContext();

function reducer(state, action) {
	if (action.type === 'USER') {
		return action.payload;
	}
	return state;
}

function Routing() {
	return (
		<>
			<Routes>
				<Route exact path='/Authorize' element={<Autho />} />
				<Route exact path='/' element={<Home />} />
				<Route exact path='/History' element={<History />} />
				<Route exact path='/Register' element={<Register />} />
				<Route exact path='/Login' element={<Login />} />
				<Route exact path='/Profile' element={<Profile />} /> 
				<Route exact path='/Mentions' element={<Mentions />} />
				<Route exact path='/Dashboard' element={<Dashboard />} />
				<Route exact path='/Ne' element={<Ne />} />
				<Route exact path='/Tr' element={<Tr />} />
				<Route exact path='/Sa' element={<Sa />} />
				<Route exact path='/Bo' element={<Bo />} />
				<Route exact path='/Cu' element={<Cu />} />
				<Route exact path='/Forgot' element={<Forgot />}/>
				<Route exact path="/Employees" element={<Employees />}/>
				<Route path='*' element={<Error />} />
			</Routes>
		</>
	)
}

function App(Props) {
  const [state, dispatch] = useReducer(reducer, true);
	
	useLayoutEffect(() => {
		console.log("APP: " + Props.what)
		dispatch({ type: "USER", payload: Props.what })
	}, [])

	return (
		<>
			<UserContext.Provider value={{ state, dispatch }}>
				<Navbar />
				<Routing />
			</UserContext.Provider>
		</>
	)
}

export default App;
