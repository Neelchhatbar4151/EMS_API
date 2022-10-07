import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';
import DD from '../images/DD.png'
import LoginOrNot from '../processes/loginOrNot';
import { developement } from '../processes/userData';

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
		for (let i = (loginUser.employees.length - 1); i >= 0; i--) {
			reverseRecords.push(loginUser.employees[i]);
		}
            const deleteRecord = async (dId, eEmail) =>{
                  const res = await fetch((developement) ? "http://localhost:5000/deleteEmployee" : "/deleteEmployee", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					dId, _id: loginUser._id, eEmail, email: loginUser.email
				})
			})
			const data = await res.json();
                  if(data.status === 500) {
				alert("Error");
			}
                  else if(data.status === 201){
                        LoginOrNot().then(() => {
                              history('.');
                        })
                  }
			else {
				alert("Unknown error")
			}
            }
		const RenderRecords = (n) => {
			const date = new Date(n.eDate)
			return (

				<tr id={n._id} key={n._id}>
					<td className='ename'>{n.eName + " ( " + n.eEmail + " )"}</td>
					<td>{n.eType} </td>
					<td>{day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear()}</td>
                              <td>{n.eSalary}</td>
                              <td>{n.ePhone?n.ePhone:"No Phone Number"}</td>
					<td className="noteName">{n.eNote?n.eNote:"No note"}</td>
                              <td className='delete'> <button className='dB' onClick={() => {  deleteRecord(n._id, n.eEmail);  document.getElementById(n._id).innerHTML = '';}} > <img className='dImg' src={DD} alt="" /></button></td>
				</tr>
			)

		}
		return (
			<>
				<div className="containerHistory">
					<h1 className='titleheader'>Employees</h1>
					<div className='upper'>
						<table>
							<thead>
								<tr>
									<th>Employee</th>
									<th>Employee Type</th>
									<th>Hire Date</th>
									<th>Salary</th>
									<th>Phone</th>
                                                      <th>Address or Note</th>
								</tr>
							</thead>
							<tbody>

								{reverseRecords.map(RenderRecords)}
							</tbody>
						</table>
					</div>
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