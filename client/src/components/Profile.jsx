import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate, NavLink } from 'react-router-dom';
import person from '../images/person.svg'
import { loginUser } from '../processes/userData';


function Profile() {
	const Profile = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			Profile('/Login');
		}
	}, [state])
	if (loginUser) {
		return (
			<>
				<div className="main">
					<div className="card">
						<img className='user' src={person} alt="" /><br />
						<h5 className="label top">Username: <span className="content"> {loginUser ? loginUser.name : "no"}</span></h5><br />
						<h5 className="label">Email: <span className="content">{loginUser ? loginUser.email : "no"}</span> </h5><br />
						<NavLink to='/ProfileEdit' className="lebel edit">Edit</NavLink>

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