import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate, NavLink } from 'react-router-dom';
import person from '../images/person.svg'
import { loginUser } from '../processes/userData';
import { developement } from '../processes/userData';
import LoginOrNot from '../processes/loginOrNot';


function Profile() {
	const Profile = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			Profile('/Login');
		}
	}, [state])
	if (loginUser) {
		const Render = () => {
			return (
				<>
					<div className="popUpAdd">
						<div className="editP">
							<input type="text" id='UN' placeholder='Type new username' autoComplete="off" required />
							<button type="submit" className='done' onClick={() => { Interface() }}>Done</button>
						</div>
					</div>
				</>
			)
		}
		const Interface = async () => {
			if (!document.getElementsByClassName('render')[0].style.display || document.getElementsByClassName('render')[0].style.display === 'none') {
				document.getElementsByClassName('render')[0].style.display = 'block'
				document.getElementsByClassName('main')[0].style.display = 'none'
			}
			else {
				if (document.getElementById('UN').value === '') {
					document.getElementsByClassName('render')[0].style.display = 'none'
					document.getElementsByClassName('main')[0].style.display = 'block'
				}
				else {
					const res = await fetch((developement) ? "http://localhost:5000/ChangeUserName" : "/ChangeUserName", {
						method: "POST",
						crossDomain: true,
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
							"Access-Control-Allow-Origin": "*",
						},
						body: JSON.stringify({
							_id: loginUser._id, name: document.getElementById('UN').value
						})
					})
					const data = await res.json();
					if (data.status === 406) {
						alert("Fill the fields properly");
					}
					else if (data.status === 500) {
						alert("Internal server error")
					}
					else if (data.status === 201) {
						alert("Updated !")
						LoginOrNot().then(() => {
							Profile('.')
						})
					}
					else {
						alert("unknown error");
					}
					document.getElementsByClassName('render')[0].style.display = 'none'
					document.getElementsByClassName('main')[0].style.display = 'block'
				}
			}
		}
		return (
			<>
				<span className="render"><Render /></span>
				<div className="main">
					<div className="card">
						<img className='user' src={person} alt="" /><br />
						<h5 className="label top">Username: <span className="content"> {loginUser ? loginUser.name : "no"}</span></h5><br />
						<h5 className="label">Email: <span className="content">{loginUser ? loginUser.email : "no"}</span> </h5><br />
						<h5 className="label">Total Employees: <span className="content">{loginUser ? loginUser.employees.length : "no"}</span></h5>
						<button className="lebel edit" onClick={Interface}>Change User Name</button>

						<NavLink className="lebel button-p" to='/History'>Show History</NavLink>
					</div>
				</div>
			</>
		)
	}
	else {
		return "Error"
	}

}

export default Profile