import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { UserContext } from '../App';
import LoginOrNot from '../processes/loginOrNot';
import { setEmail } from '../processes/userData';
import { developement } from '../processes/userData';
import { NavLink } from 'react-router-dom';


function Login() {
	const cookie = new Cookies();
	const { dispatch } = useContext(UserContext);
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
		if (!email || !password) {
			document.getElementsByClassName('danger')[0].innerText = "*Fill the fields properly"
		}
		else if (!email.includes('@')) {
			document.getElementsByClassName('danger')[0].innerText = "*Email field must include a ' @ '"
		}
		else {
			document.getElementById('do-login').disabled = true;
			const res = await fetch((developement) ? "http://localhost:5000/signin" : "/signin", {
				method: "POST",
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
				document.getElementsByClassName('danger')[0].innerText = "*Fill the fields properly"

				dispatch({ type: 'USER', payload: false })
			}
			else if (data.status === 417) {
				document.getElementsByClassName('danger')[0].innerText = "*Incorrect Email or Password"
				dispatch({ type: 'USER', payload: false })

			}
			else if (data.status === 401) {
				setEmail({ email, password, allow: false });
				dispatch({ type: 'USER', payload: false })
				document.getElementsByClassName('danger')[0].innerText = "*Not Authorized"
			}
			else if (data.status === 202) {
				cookie.set("EMSToken", data.jwtToken, { maxAge: 3.154e+10 })
				alert("Login Successfull ");

				dispatch({ type: 'USER', payload: true });
				LoginOrNot().then((result) => {
					history('/Dashboard')
				})
			}
			else {
				alert("Internal server error");
			}
			document.getElementById('do-login').disabled = false;
		}
	}
	const Interface =async() => {
		if (!document.getElementsByClassName('forG')[0].style.display || document.getElementsByClassName('forG')[0].style.display === 'none') {
			document.getElementsByClassName('forG')[0].style.display = 'block'
		}
		else {
			if (document.getElementById('email1').value === '') {

				document.getElementsByClassName('forG')[0].style.display = 'none'
			}
			else if (!document.getElementById('email1').value.includes('@')) {
				alert("Email field must include a ' @ '")
			}
			else {
				document.getElementsByClassName('done')[0].disabled = true;
				setEmail({ email: document.getElementById('email1').value, password: '', allow: true })
				const res = await fetch((developement) ? "http://localhost:5000/SendForgotCode" : "/SendForgotCode", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({
						email: document.getElementById('email1').value 
					})
				})

				const data = await res.json();
				if(data.status === 406){
					alert('fill the fields properly')
				}
				else if(data.status === 200){
					history('/Forgot')
				}
				else if(data.status === 417) {
					alert("This email is not registered to EMS")
				}
				document.getElementsByClassName('done')[0].disabled = false;
			}
		}
	}
	const Render = () => {
		return (

			<>
				<div className="popUpAdd">
					<div className="editP">
						<input type="email" id='email1' placeholder='Enter your email' autoComplete="on" required />
						<button className='done' onClick={() => { Interface() }}>Done</button>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<span className="forG"><Render /></span>
			<section className='login mla' id='login'>
				<div className='head'>
					<h1 className='company'>Login</h1>
				</div>
				<p className='msg'>Welcome Back</p>
				<div className="form">
					<form method="POST">
						<input type="email" name="email" id="email" placeholder='Your email ' onChange={handleOnChange} autoComplete="off" required />
						<button type="button" className='forgot' onClick={Interface}>Forgot Password ? </button>
						<input type="password" name="password" placeholder='Your password ' onChange={handleOnChange} autoComplete="off" required />
						<button type='submit' className='btn-login' onClick={loginUser} id='do-login'>Login</button> <span className="danger"></span>
						<div className="suggestion"><span><NavLink to='/register' className='suggestion'>Don't have an account?</NavLink></span></div>

					</form>
				</div>
			</section>
		</>
	)
}

export default Login