import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';
// import LoginOrNot from '../processes/loginOrNot';
// import { developement } from '../processes/userData';

function Mentions() {
	const history = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			history('/Login');
		}
	}, [state, history])

	if (loginUser) {
		const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat','wgwgw']
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let reverseMentions = [];
		for (let i = (loginUser.mentions.length - 1); i >= 0; i--) {
			reverseMentions.push(loginUser.mentions[i]);
		}
		const RenderMentions = (n) =>{ 
			const date = new Date(n.mDate)
			return (
				<tr id={n._id} key={n._id}>
					<td>{n.mfrom} </td>
					<td className="noteName">{n.mNote}</td>
					<td>{day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth() + 1] + " " + date.getFullYear()}</td>
					<td>{n.mType} </td>
				</tr>
			)
		}
		return (
			<div className='upper'>
				<table>
					<thead>
						<tr>
							<th>From</th>
							<th>Note</th>
							<th>Date</th>
							<th>Event Type</th>
						</tr>
					</thead>
					<tbody>

						{reverseMentions.map(RenderMentions)}
					</tbody>
				</table>
			</div>
		)
	}
	else {
		return (
			<>
				Error
			</>
		)
	}
}

export default Mentions