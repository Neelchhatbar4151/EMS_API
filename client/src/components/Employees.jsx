import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { emailParent, loginUser } from '../processes/userData';
import DD from '../images/DD.png'
import edit from '../images/edit.png'
import LoginOrNot from '../processes/loginOrNot';
import { developement } from '../processes/userData';
import Moment from 'moment';

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
		const deleteRecord = async (dId, eEmail) => {
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
			if (data.status === 500) {
				alert("Error");
			}
			else if (data.status === 201) {
				LoginOrNot().then(() => {
					history('.');
				})
			}
			else {
				alert("Unknown error")
			}
		}
		const Interface = async(n) =>{
			document.getElementsByClassName('render')[0].style.display = 'block'
			locals = n;
		}
		const Submit = async () =>{
			if(document.getElementsByName('inputs')[0].value === '' || document.getElementsByName('inputs')[1].value === '' || document.getElementsByName('inputs')[2].value === '' || document.getElementsByName('inputs')[3].value === ''){
				alert("Fill the fields properly")
			}
			else if(!document.getElementsByName('inputs')[1].value.includes('@')){
				alert("Email field must contain a ' @ '")
			}
			else if(document.getElementsByName('inputs')[6].value.length !== 10 && document.getElementsByName('inputs')[6].value.length >=1 ){
				alert("Phone number must be 10 digit number")
			}
			else{
				document.getElementsByClassName('done')[0].disabled = true
				const res = await fetch((developement) ? "http://localhost:5000/UpdateEmployee" : '/UpdateEmployee', {
					method: "POST",
					crossDomain: true,
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({
						EmailNow:locals.eEmail, email: document.getElementsByName('inputs')[1].value ,dept: document.getElementsByName('inputs')[3].value, name: document.getElementsByName('inputs')[0].value, eType: document.getElementsByName('inputs')[2].value, date:document.getElementsByName('inputs')[4].value, phone:document.getElementsByName('inputs')[6].value, salary:document.getElementsByName('inputs')[5].value, note:document.getElementsByName('inputs')[7].value, UserEmail: loginUser.email
					})
				})

				const data = await res.json();
				if (data.status === 406) {
					alert("Fill the fields properly");
				}
				else if (data.status === 500) {
					alert("Internal server error")
				}
				else if (data.status === 200) {
					alert("Employee Edited")
					LoginOrNot().then(() =>{
						history('.')
					})
				}
				else {
					alert("unknown error");
				}
				document.getElementsByClassName('done')[0].disabled = false
				document.getElementsByClassName('render')[0].style.display = 'none'
			}
		}
		const Defaults = (n) =>{
			const d = Moment(n.eDate).format('yyyy-MM-DD')
			document.getElementsByName('inputs')[0].value = n.eName;
			document.getElementsByName('inputs')[1].value = n.eEmail;
			document.getElementsByName('inputs')[2].value = n.eType;
			document.getElementsByName('inputs')[3].value = n.eDept;
			document.getElementsByName('inputs')[4].value = d;
			document.getElementsByName('inputs')[5].value = n.eSalary;
			document.getElementsByName('inputs')[6].value = n.ePhone;
			document.getElementsByName('inputs')[7].value = n.eNote;
		}
		let locals= "";
		const Render = () => {
			return (
				<>
					<div className="popUpAdd">
						<div className="miniBox1">
							<div className="limit1">
								<input type="text" name="inputs" id="name" placeholder='Employee Name' />
								<input type="email" name="inputs" id="eEmail" placeholder='Employee Email' />
								<input type="text" name="inputs" id="eType" placeholder='Employee Type' />
								<input type="text" name="inputs" id="eDept" placeholder='Employee Department' />
								<input type="date" name="inputs" id="eDate" placeholder='Employee Hire Date' />
								<input type="number" name="inputs" id="eSalary" placeholder='Employee Salary' />
								<input type="number" name="inputs" id="ePhone" placeholder='Employee Phone Number' />
								<textarea className='TA' name="inputs" id="eNote" placeholder='Employee Address or Any note' />
							</div>
							<button type='button' className='goLogin' onClick={() => { Defaults(locals) }}>Defaults</button><button type="button" className='goCancel' onClick={() =>{for(let i=0;i<document.getElementsByName('inputs').length;i++){document.getElementsByName('inputs')[i].value = ""}document.getElementsByClassName('render')[0].style.display = 'none'; }}> Cancel </button>
							<button type="submit" className='done' onClick={() => { Submit() }}>Done</button>
						</div>
					</div>
				</>
			)
		}
		const RenderRecords = (n) => {
			const date = new Date(n.eDate)
			return (

				<tr id={n._id} key={n._id}>
					<td className='ename'>{n.eName + " ( " + n.eEmail + " )"}</td>
					<td>{n.eType} </td>
					<td>{n.eDept}</td>
					<td>{day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear()}</td>
					<td>{n.eSalary}</td>
					<td>{n.ePhone ? n.ePhone : "No Phone Number"}</td>
					<td className="noteName">{n.eNote ? n.eNote : "No note"}</td>
					<td className='delete'> <button className='dB' onClick={() => { Interface(n) }} > <img className='dImg' src={edit} alt="" /></button></td>
					<td className='delete'> <button className='dB' onClick={() => { deleteRecord(n._id, n.eEmail); document.getElementById(n._id).innerHTML = ''; }} > <img className='dImg' src={DD} alt="" /></button></td>
				</tr>
			)

		}
		
		return (
			<>
			<span className="render"><Render /></span>
				<div className="containerHistory">
					<h1 className='titleheader'>Employees</h1>
					<div className='upper'>
						<table>
							<thead>
								<tr>
									<th>Employee</th>
									<th>Employee Type</th>
									<th>Employee Department</th>
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