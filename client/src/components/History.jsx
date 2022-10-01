import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';

function History() {
	const history = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			history('/Login')
		}
	}, [state, history])

	if (loginUser) {
		const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'wgwgw']
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let reverseRecords = [];
		for (let i = (loginUser.records.length - 1); i >= 0; i--) {
			reverseRecords.push(loginUser.records[i]);
		}
		const RenderRecords = (n) => {
			const date = new Date(n.rDate)
			return (

				<tr id={n._id} key={n._id}>
					<td className='ename'>{n.rEmployeeName + " ( " + n.rEmployeeEmail + " )"}</td>
					<td>{n.rType} </td>
					<td>{day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth() + 1] + " " + date.getFullYear()}</td>
					<td>{n.rEmployeeType}</td>
					<td className="noteName">{n.rNote}</td>
				</tr>
			)

		}
		return (
			<div className='upper'>
				<table>
					<thead>
						<tr>
							<th>Employee</th>
							<th>Event Type</th>
							<th>Date</th>
							<th>Employee type</th>
							<th>Note</th>
						</tr>
					</thead>
					<tbody>

						{reverseRecords.map(RenderRecords)}
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

export default History