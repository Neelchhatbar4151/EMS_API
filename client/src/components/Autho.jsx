import React, { useState } from 'react'
import { emailParent, setEmail } from '../processes/userData'
import Cookies from 'universal-cookie';
import { UserContext } from '../App';
import LoginOrNot from '../processes/loginOrNot';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { developement } from '../processes/userData';
import IR from '../images/realIR.png'


function Autho() {
	const [myCode, setMyCode] = useState(0);
	const { dispatch } = useContext(UserContext)
	const history = useNavigate();
	if (emailParent.allow) {

		const handleOnChange = event => {
			setMyCode(event.target.value)
		};
		const cookie = new Cookies();
		const disable = () =>{
			if (emailParent.allow) {
				alert("Expired")
				setEmail({ email: emailParent.email, password: emailParent.password, allow: false })
				history('/register')
			}
		}
		const checkCode = async () => {
			if (!myCode) {
				document.getElementById('suggest').innerHTML = "<strong>*Please fill the fields properly.</strong>";
				document.getElementById('suggest').style.color = 'red';
				document.getElementById('verify').style.display = 'inline-block';
				return 0;
			}
			const res = await fetch((developement) ? "http://localhost:5000/checkCode" : "/checkCode", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					email: emailParent.email, myCode
				})
			})
			const data = await res.json();
			if (data.status === 406) {
				document.getElementById('suggest').innerHTML = "<strong>*Incorrect code.</strong>";
				document.getElementById('suggest').style.color = 'red';
				document.getElementById('verify').style.display = 'inline-block';

			}
			else if (data.status === 200) {
				const res = await fetch((developement) ? "http://localhost:5000/signin" : "/signin", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({
						email: emailParent.email, password: emailParent.password
					})
				})
				const data = await res.json();
				cookie.set("EMSToken", data.jwtToken, { maxAge: 3.154e+10 })
				document.getElementById('verify').innerText = "Login successfull !";
				document.getElementById('verify').style.color = "rgb(11, 198, 11);";
				dispatch({ type: 'USER', payload: true })
				LoginOrNot().then((result) => {
					setEmail({ email: emailParent.email, password: emailParent.password, allow: false })
					history('/Dashboard')
				})
			}
			else {
				alert("unknown error")
			}
		}
		setTimeout(disable, 60000); 
		return (
			<>
				<div className="main">
					<div className="main-card">
						<h1 className='heading'>Verification Verification !!</h1>
						<h4>We have sent you a code on </h4><h3 className='email'><strong>{emailParent.email}</strong></h3>
						<hr />
						<input className='vCode' onChange={handleOnChange} type="number" name="code" id="code" placeholder='Enter verification code here..' autoComplete='off' required />
						<br />
						<div id="suggest"></div>
						<button id='verify' className='goHome' type="submit" onClick={()=>{document.getElementById('verify').style.display = "none";checkCode();}}>Verify</button>
						<br />
						<div className='notice'>
							<h3 id='e402' >
								NOTE:-
							</h3>
							<ul className='warning'>
								<li>CODE will expire after one min.</li>
								<li>Don't refresh the page.</li>
								<li>Don't close the page.</li>
							</ul>
						</div>
					</div>
				</div>
			</>
		)
	}
	else {
		setTimeout(() => {
			document.getElementById('not').innerText = "You're Not Allowed To Visit This Page."
		}, 5000);
		return (
			<>
				<div className="load" id='not'><img className='loader' src={IR} alt="" /></div>
			</>
		)
	}

}

export default Autho