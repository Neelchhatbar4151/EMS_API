import React from 'react'
import { useEffect } from 'react'
import { developement } from '../processes/userData'

function Home() {
	useEffect(() => {
		document.getElementsByClassName('words')[0].style.animation = "EMS 2s"
		setTimeout(() => {
			document.getElementsByClassName('specialwords')[0].style.display = 'block'
			document.getElementsByClassName('specialwords')[0].style.animation = "Up 1s"
		}, 500);
		setTimeout(() => {
			document.getElementsByClassName('words')[0].style.top = '43%'
		}, 1999);
		setTimeout(() => {
			document.getElementsByClassName('sariVato1')[0].style.animation = 'slide 1s ease-in-out'
		}, 800);
		setTimeout(() => {
			document.getElementsByClassName('sariVato1')[0].style.left = '50%'
			document.getElementsByClassName('sariVato1')[0].style.opacity = 1;
		}, 1799);
		setTimeout(() => {
			document.getElementsByClassName('sariVato2')[0].style.animation = 'sli 1s ease-in-out'
		}, 1300);
		setTimeout(() => {
			document.getElementsByClassName('sariVato2')[0].style.left = '50%'
			document.getElementsByClassName('sariVato2')[0].style.opacity = 1;
		}, 1299);
		setTimeout(() => {
			document.getElementsByClassName('sariVato3')[0].style.animation = 'slide 1s ease-in-out'
		}, 1600);
		setTimeout(() => {
			document.getElementsByClassName('sariVato3')[0].style.left = '50%'
			document.getElementsByClassName('sariVato3')[0].style.opacity = 1;
		}, 1599);
		setTimeout(() => {
			document.getElementsByClassName('bovSariVato')[0].style.animation = 'UpAfter 1s ease-in-out'
		}, 1599);
		setTimeout(() => {

			document.getElementsByClassName('bovSariVato')[0].style.display = 'block'
			document.getElementsByClassName('bovSariVato')[0].style.top = '55%'
		}, 2599);
	}, [])
	const Interface = async () => {
		if (document.getElementsByName('email')[0].value === '') {
			alert("Email is required")
		}
		else if (document.getElementsByName('text')[0].value === '') {
			alert("Enter message before sending ")
		}
		else if (!document.getElementsByName('email')[0].value.includes('@')) {
			alert("Email field must include a ' @ '")
		}
		else {
			document.getElementsByClassName('goLogin')[0].disabled = true
			const res = await fetch((developement) ? "http://localhost:5000/SendUserMsg" : "/SendUserMsg", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					email: document.getElementsByName('email')[0].value, name: document.getElementsByName('name')[0].value, msg: document.getElementsByName('text')[0].value
				})
			})
			const data = await res.json();
			if(data.status === 200){
				alert("Sent !!")
			}
			else{
				alert("Internal server error")
			}
			document.getElementsByClassName('goLogin')[0].disabled = false;
		}
	}
	return (
		<>
			<span className="Partlogo">
				<span className="words">EMS</span>
				<span className="specialwords">Employee Management System</span>
			</span>
			<div className="containerHistory">
				<span className="goodis">
					<span className="sariVato1">
						Secure
					</span>
					<span className="sariVato2">
						Reliable
					</span>
					<span className="sariVato3">
						Easy to Use
					</span>
					<span className="bovSariVato">
						All the things related to employee management at one place
					</span>
				</span>

				<div className="contactMain">
					<span className="words1">Contact Us</span>
					<form className='contactSub'>
						<input name="name" type="text" placeholder="Name" />
						<input name="email" type="text" placeholder="Email" />
						<textarea name="text" className="Margin TA" placeholder="Message" ></textarea><br />
						<input type="button" className='goLogin' value="SEND" onClick={Interface} />
					</form>
				</div>

			</div>


		</>
	)
}

export default Home