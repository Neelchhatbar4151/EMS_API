import React, { useState } from 'react'
import { emailParent, setEmail } from '../processes/userData'
import { useNavigate } from 'react-router-dom';
import { developement } from '../processes/userData';
import IR from '../images/logo.png'


function Autho() {
	const [myCode, setMyCode] = useState(0);
	const history = useNavigate();
	if (emailParent.allow) {

		const handleOnChange = event => {
			setMyCode(event.target.value)
		};
		const disable = () =>{
			if (emailParent.allow) {
				alert("Expired")
				setEmail({ email: emailParent.email, password: emailParent.password, allow: false })
				history('/Login')
			}
		}
		const Interface = async () => {
			if (!document.getElementsByClassName('render')[0].style.display || document.getElementsByClassName('render')[0].style.display === 'none') {
				document.getElementsByClassName('render')[0].style.display = 'block'
				document.getElementsByClassName('main')[0].style.display = 'none'
			}
			else{
				if(document.getElementById('new').value === '' || document.getElementById('RE').value === ''){
					alert("Fill the fields properly")
  				}
				else if(document.getElementById('new').value !== document.getElementById('RE').value){
					alert('Both Passwords are different')
				}
				else if(emailParent.allow === true){
					alert("You're not authorized")
				}
				else{
					document.getElementsByClassName('done')[0].disabled = true
					const res = await fetch((developement) ? "http://localhost:5000/ChangePasswordThroughForgot":"/ChangePasswordThroughForgot", {
						method: "POST",
						crossDomain: true,
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
							"Access-Control-Allow-Origin": "*",
						},
						body: JSON.stringify({
							email: emailParent.email, pass: document.getElementById('new').value
						})
					})
					const data = await res.json();
					if(data.status === 406){
						alert("Fill the fields properly")
					}
					else if(data.status === 500){
						alert('Internal server error')
					}
					else if(data.status === 201){
						alert('Updated !')
						history('/Login')
					}
					else{
						alert('unknown error')
					}
					document.getElementsByClassName('done')[0].disabled = false
					document.getElementsByClassName('render')[0].style.display = 'none'
					document.getElementsByClassName('main')[0].style.display = 'block'
				}
			}
		}
		const Render = ( ) =>{
			return (
				<>
					<div className="popUpAdd">
						<div className="editP">
							<input type="password" name="pass" id="new" placeholder='New Password' required />
							<input type="password" name="reEnter" id="RE" placeholder='ReEnter your password' required/>
							<button className='done' onClick={() =>{ Interface() }}>Done</button>
						</div>
					</div>
				</>
			)
		}
		const checkCode = async () => {
			if (!myCode) {
				document.getElementById('suggest').innerHTML = "<strong>*Please fill the fields properly.</strong>";
				document.getElementById('suggest').style.color = 'red';
				document.getElementById('verify').style.display = 'inline-block';
				return 0;
			}
			const res = await fetch((developement) ? "http://localhost:5000/checkForgotCode" : "/checkForgotCode", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					email: emailParent.email, otp: myCode
				})
			})
			const data = await res.json();
			if (data.status === 401) {
				document.getElementById('suggest').innerHTML = "<strong>*Incorrect code.</strong>";
				document.getElementById('suggest').style.color = 'red';
				document.getElementById('verify').style.display = 'inline-block';

			}
			else if (data.status === 200) {
				document.getElementsByClassName('render')[0].style.display = 'block';
				alert("Successfull")
				setEmail({ email: emailParent.email, password: "", allow: false })
			}
			else {
				alert("unknown error")
			}
		}
		setTimeout(disable, 60000); 
		return (
			<>
			<span className="render"><Render /></span>
				<div className="main">
					<div className="main-card">
						<h1 className='heading'>Forgot Password !!</h1>
						<h4>We have sent you a code on </h4><h3 className='email'><strong>{emailParent.email}</strong></h3>
						<div className="hr"></div>
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