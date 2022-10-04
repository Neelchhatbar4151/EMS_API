import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';
import Moment from 'moment'

function History() {
	const history = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			history('/Login')
		}
	}, [state, history])
	const [inputValues, setInputValues] = React.useState({
		nameOrEmail: "", date: "", eType: '', eventType: ''
	});

	const handleOnChange = event => {
		const { name, value } = event.target;
		setInputValues({ ...inputValues, [name]: value });
	};
	if (loginUser) {
		const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'wgwgw']
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let reverseRecords = [];
		for (let i = (loginUser.records.length - 1); i >= 0; i--) {
			reverseRecords.push(loginUser.records[i]);
		}
		const RenderRecords = (n) => {
			const date = new Date(n.rDate)
			const opponentdate = Moment(date).format('yyyy-MM-DD')
			const matchdate = (inputValues.date ==="")?"":Moment(inputValues.date).format('yyyy-MM-DD')
			if(matchdate !== "" && matchdate !== opponentdate){
				
				return ""
			}
			if(inputValues.nameOrEmail !== "" && inputValues.nameOrEmail !== n.rEmployeeName && inputValues.nameOrEmail !== n.rEmployeeEmail){
				return ""
			}
			if(inputValues.eType !== "" && inputValues.eType !== n.rEmployeeType){
				return ""
			}
			if(inputValues.eventType !== "" && inputValues.eventType !== n.rType){
				return ""
			}
			return (

				<tr id={n._id} key={n._id}>
					<td className='ename'>{n.rEmployeeName + " ( " + n.rEmployeeEmail + " )"}</td>
					<td>{n.rType} </td>
					<td>{day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear()}</td>
					<td>{n.rEmployeeType}</td>
					<td className="noteName">{n.rNote}</td>
				</tr>
			)

		}

		const d = Moment(inputValues.date).format('yyyy-MM-DD')
		return (
			<>
				<h1 className='titleheader'>History</h1>
				<div className="editText">
					<input type="text" value={inputValues.nameOrEmail} name="nameOrEmail" id="nOe" onChange={handleOnChange} placeholder='Name Or Email Of employee'/>
				</div>
				
				<input type="date" value={d} name="date" id="d" onChange={handleOnChange}/>
				<input type="text" value={inputValues.eType} name="eType" id="eT" onChange={handleOnChange} placeholder='Employee Type'/>
				<input type="text" value={inputValues.eventType} name="eventType" id="evT" onChange={handleOnChange} placeholder='Event type' />
				
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
			</>

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