import React from 'react'
import { useNavigate } from 'react-router-dom';
import { setEmail } from '../processes/userData';
import { developement } from '../processes/userData';
import { NavLink } from 'react-router-dom';

function Register() {
      
      const history = useNavigate();
      const [inputValues, setInputValues] = React.useState({
            email: '', password: ''
      });

      const handleOnChange = event => {
            const { name, value } = event.target;
            setInputValues({ ...inputValues, [name]: value });
      };

      const registerUser = async (e) => {
            e.preventDefault();
            const { email, password } = inputValues;

            const res = await fetch((developement)?"http://localhost:5000/register":"/register", {
                  method: "POST",
                  crossDomain: true,
                  headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                  },
                  body: JSON.stringify({
                        email, password
                  })
            })
            const data = await res.json();
            if (data.status === 406) {
                  alert("Fill the fields properly");
            }
            else if (data.status === 422) {
                  alert("Email already exist");
                  history("/Register");
            }
            else if (data.status === 201) {
                  setEmail({email, password, allow:true});
                  history('/Authorize')
            }
            else {
                  alert("Unknown Error");
            }

      }

      return (
            <>
                  <section className='login mla' id='login'>
                        <div className='head'>
                              <h1 className='company'>Sign up</h1>
                        </div>
                        <p className='msg'>Register Yourself</p>
                        <div className="form">
                              <form>
                                    <input type="email" name="email" placeholder='Your email ' onChange={handleOnChange} autoComplete="off" required />
                                    <input type="password" name="password" placeholder='Your password ' onChange={handleOnChange} autoComplete="off" required />
                                    <button type='submit' className='btn-login' id='do-login' onClick={registerUser}>Sign up</button>
                                    <NavLink to='/login' className='suggestion'>Already have an account?</NavLink>
                              </form>
                        </div>
                  </section>
            </>
      )
}

export default Register