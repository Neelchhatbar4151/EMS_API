import React from 'react';
import { useContext } from 'react';
import {useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { UserContext } from '../App';
import LoginOrNot from '../processes/loginOrNot';
import { setEmail } from '../processes/userData';
import { developement } from '../processes/userData';
import { NavLink } from 'react-router-dom';


function Login() {
  const cookie = new Cookies();
      const {dispatch} = useContext(UserContext);
  const history = useNavigate();
  const [inputValues, setInputValues] = React.useState({
    email: '', password: ''
  });

  const handleOnChange = event => {
  const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  }; 

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = inputValues;

    const res = await fetch((developement)?"http://localhost:5000/signin":"/signin", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email, password
      })
    })

    const data = await res.json();
    if(data.status === 406) {
      alert("Fill the fields properly");
      
      dispatch({type:'USER', payload:false})
    }
    else if(data.status === 417) {
      alert("Incorrect Email or Password");
      dispatch({type:'USER', payload:false})

    }
    else if(data.status === 401){
      setEmail({email, password, allow: false});
      dispatch({type:'USER', payload:false})
      alert('Not authorized');
    }
    else if(data.status === 202) {
      cookie.set("EMSToken",data.jwtToken, {maxAge:3.154e+10})
      alert("Login Successfull ");
      
      dispatch({type:'USER', payload:true});
      LoginOrNot().then((result)=>{
        history('/Dashboard')
      })
    }
    else {
      alert("Unknown Error");
    }
  }

  return (
    <>
      <section className='login mla' id='login'>
        <div className='head'>
          <h1 className='company'>Login</h1>
        </div>
        <p className='msg'>Welcome Back</p>
        <div className="form">
          <form method= "POST">
            <input type="email" name="email" id="email" placeholder='Your email ' onChange={handleOnChange} autoComplete="off" required/>
            <input type="password" name="password" placeholder='Your password ' onChange={handleOnChange} autoComplete="off" required />
            <button type='submit' className='btn-login' onClick={loginUser} id='do-login'>Login</button>
            <NavLink to='/register' className='suggestion'>Don't have an account?</NavLink>
          </form>
        </div>
      </section>
    </>
  )
}

export default Login