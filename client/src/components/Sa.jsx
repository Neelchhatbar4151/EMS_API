import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';
import { developement } from '../processes/userData';
import Moment from 'moment'

import MegaInput from './MegaInput';

function Sa() {
	const history = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			history('/Login');
		}
	}, [state])
	const [inputValues, setInputValues] = React.useState({
		salaryID: 0, IorD: "I", note: "", date: new Date()
	});

	const handleOnChange = event => {
		const { name, value } = event.target;
		setInputValues({ ...inputValues, [name]: value });
	};
	if (loginUser) {
		let selectedEmployees = [];
		const recordGroup = (e, groupName) => {
			setTimeout(() => {
				if (e.target.checked) {
					let elements = document.getElementsByClassName(groupName);
					for (let i = 0; i < elements.length; i++) {
						console.log(elements[i])
						if (elements[i].checked === false) {
							elements[i].click()
						}
					}
				}
				else {
					let elements = document.getElementsByClassName(groupName);
					for (let i = 0; i < elements.length; i++) {
						if (elements[i].checked === true) {
							elements[i].click()
						}
					}
				}
			}, 100);

			console.log(selectedEmployees)
		}
		const recordEmployee = (e, id) => {
			setTimeout(() => {
				if (e.target.checked) {
					for (let i = 0; i < loginUser.employees.length; i++) {
						if (loginUser.employees[i]._id === id) {
							selectedEmployees.push(loginUser.employees[i])
						}
					}
				}
				else {
					for (let i = 0; i < selectedEmployees.length; i++) {
						if (selectedEmployees[i]._id === id) {
							selectedEmployees.splice(i, i + 1)
						}
					}
				}
				console.log(selectedEmployees)
			}, 100);

		}
		const Types = (n) => {
			return (
				<div key={n._id}>
					<div className='custom' key={n._id}>
						Select all {n.eType}
					</div>
					<input type='checkbox' className='cb' onClick={(e) => { recordGroup(e, n.eType) }} />
				</div>


			)
		}
		const RenderEmployees = (n) => {
			return (
				<div key={n._id}>
					<div className="custom E" key={n._id}>
						{n.eName + " ( " + n.eEmail + " ) , "} <span className='spc'>{n.eType}</span>
					</div>
					<input type='checkbox' className={'cb ' + n.eType} onClick={(e) => { recordEmployee(e, n._id) }} />
				</div>
			)
		}
		const Render = () => {
			return (
				<>
					<div className="popUpAdd">
						<div className="miniBox">
							<div className="limit">
								{loginUser.employeeTypes.map(Types)}
								{loginUser.employees.map(RenderEmployees)}
							</div>
							<button type="submit" className='done' onClick={() => { Interface() }}>Done</button>
						</div>
					</div>
				</>
			)
		}
		const Interface = () => {
			const element = document.getElementsByClassName('render')[0];
			if (element.style.display === "block") {
				document.getElementsByClassName('limit')[0].style.animation = "closing 0.5s"
				setTimeout(() => {
					element.style.display = 'none';
				}, 490);
				document.getElementById('emps').value = ((selectedEmployees.length === 0) ? "Select Employees" : selectedEmployees.length + " Employees selected")
			}
			else {
				// element.style.display = "block";
				document.getElementsByClassName('limit')[0].style.animation = "opening 0.5s"
				element.style.display = "block";
			}
		}
		const salaryIorD = async () => {
			if (inputValues.salaryID <= 0) {
				alert("Salary Increment/decrement value must be higher than 0")
			}
			else if (selectedEmployees.length === 0) {
				alert("Select atleast one employee")
			}
			else {
				const res = await fetch((developement) ? "http://localhost:5000/salaryIorD" : "/salaryIorD", {
					method: "POST",
					crossDomain: true,
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({
						amount: inputValues.salaryID, email: loginUser.email, _id: loginUser._id, note: inputValues.note, emps: selectedEmployees, IorD: inputValues.IorD, date: inputValues.date
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
					alert("Successfull !")
				}
				else {
					alert("unknown error");
				}
			}

		}
		const d = Moment(inputValues.date).format('yyyy-MM-DD')
		return (
			<>
				<span className="render"><Render /></span>
				<div className="main ">
					<div className="main-card SI">
						<MegaInput input="Salary Increment/Decrement of Employee(s)" />
						<span className='f'><span className='red'>*</span> mandatory fields</span> <span className='pvr'></span> <span className='s'><span className='blue'>-</span> optional fields</span>
						<div className="hr"></div>
						<form >
							<div className="demored">*</div>
							<select name="IorD" id="IorD" value={inputValues.IorD} onChange={(e) => { e.preventDefault(); handleOnChange(e) }}>
								<option value="I">Increment</option>
								<option value="D">Decrement</option>
							</select>
							<input placeholder='hiring date' type="date" name="date" id="eDate" onChange={handleOnChange} value={d} autoComplete='off' required />
							<div className="demored">*</div><input type="number" name="salaryID" value={(inputValues.salaryID) ? inputValues.salaryID : ""} onChange={handleOnChange} placeholder={"Amount of salary " + ((inputValues.IorD === "D") ? "Decrement" : "Increment")} />
							<div className="demoblue">-</div><textarea className='pta TA' placeholder={'NOTE: Any information or note related to Salary ' + ((inputValues.IorD === "D") ? "Decrement" : "Increment")} type="textarea" name="note" id="note" onChange={handleOnChange} value={inputValues.note}> </textarea>
							<div className="demored">*</div><input className='SE goLogin' id="emps" type="button" value="Select Employees" onClick={(e) => { e.preventDefault(); Interface(); }} />
							<br /> <button type="submit" className='goHome' onClick={(e) => { e.preventDefault(); salaryIorD() }}>Submit</button>
						</form>
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

export default Sa