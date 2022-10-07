import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';
import { developement } from '../processes/userData';
import LoginOrNot from '../processes/loginOrNot';
import Moment from 'moment';

import MegaInput from './MegaInput';

function Ne() {
	const history = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			history('/Login');
		}
	}, [state, history])
	const [inputValues, setInputValues] = useState({
		name: '', email: '', eType: 'Manager', date: new Date(), phone: '', salary: 0, note: ''
	});
	const handleOnChange = event => {
		const { name, value } = event.target;
		setInputValues({ ...inputValues, [name]: value });
		if (name === "eType" && value === "New") {
			if (document.getElementsByClassName("render")[0].style.display === 'none' || !document.getElementsByClassName("render")[0].style.display) {
				
				document.getElementsByClassName("render")[0].style.display = 'block';
			} else {
				console.log(document.getElementsByClassName("render")[0].style.display)
			}
		}
	};
	if (loginUser) {

		const RenderOptions = (n) => {
			return (
				<option key={n._id} value={n.eType}>{n.eType}</option>
			)
		}
		const Interface = async () => {
			if (document.getElementById('CEN').value === "") {
				setInputValues({ ...inputValues, eType: "Manager" });
				document.getElementsByClassName("render")[0].style.display = 'none';
			}
			else {
				document.getElementsByClassName('done')[0].disabled = true
				const res = await fetch((developement) ? "http://localhost:5000/CustomType" : "/CustomType", {
					method: "POST",
					crossDomain: true,
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({
						_id: loginUser._id, eType: document.getElementById('CEN').value  
					})
				})
				const data = await res.json();
				if (data.status === 406) {
					alert("Fill the fields properly");
				}
				else if (data.status === 400) {
					alert("Enter unique Employee Type")
				}
				else if (data.status === 500) {
					alert("Internal server error")
				}
				else if (data.status === 201) {
					alert("Added !")
					LoginOrNot().then(() =>{
						history('.')
					})
				}
				else {
					alert("unknown error");
				}
				document.getElementsByClassName('done')[0].disabled = true
				setInputValues({ ...inputValues, eType: "Manager" });
				document.getElementsByClassName("render")[0].style.display = 'none';
				
			}

		}
		const Render = () => {
			return (
				<>
					<div className="popUpAdd">
						<div className="prompt">
							<input type="text" id='CEN' placeholder='Custom employee type' autoComplete="off" required />
							<button type="submit" className='done' onClick={() => { Interface(); }}>Done</button>
						</div>
					</div>
				</>
			)
		}

		const NewEmployee = async () => {

			const { email, name, eType, date, phone, salary, note } = inputValues;
			const UserEmail = loginUser.email

			if (!email || !name || !eType || !date) {
				alert("Fill the fields properly");
			}
			else if (!inputValues.email.includes('@')) {
				alert("Email field must contain a ' @ '")
			}
			else if(phone.length !== 10 && phone.length >=1 ){
				alert("Phone number must be 10 digit number")
			}
			else {
				document.getElementById('main-submit').disabled = true
				const res = await fetch((developement) ? "http://localhost:5000/NewEmployee" : '/NewEmployee', {
					method: "POST",
					crossDomain: true,
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({
						email, name, eType, date, phone, salary, note, UserEmail
					})
				})

				const data = await res.json();
				if (data.status === 406) {
					alert("Fill the fields properly");
				}
				else if (data.status === 422) {
					alert('Employee with this email already exist')
				}
				else if (data.status === 500) {
					alert("Internal server error")
				}
				else if (data.status === 201) {
					alert("Employee recorded")
					LoginOrNot().then(() =>{
						history('.')
					})
				}
				else {
					alert("unknown error");
				}
				document.getElementById('main-submit').disabled = false
			}
		}
		const d = Moment(inputValues.date).format('yyyy-MM-DD')
		return (
			<>
				<span className="render"><Render /></span>
				<div className="main">
					<div className="main-card back">

						<MegaInput input="New Employee" />
						<span className='f'><span className='red'>*</span> mandatory fields</span> <span className='pvr'></span> <span className='s'><span className='blue'>-</span> optional fields</span>
						<div className="hr"></div>
						<form>
							<div className="demored">*</div> <input type="text" value={inputValues.name} name="name" placeholder='Employee name' onChange={handleOnChange} autoComplete="off" required />
							<div className="demored">*</div><input type="email" name="email" placeholder='Employee Email ' onChange={handleOnChange} autoComplete="off" required />
							<div className="demored">*</div>
							<select name="eType" id="eType" value={inputValues.eType} onChange={handleOnChange}>
								{loginUser.employeeTypes.map(RenderOptions)}
								<option key='custom' value="New">Custom Type +</option>
							</select>
							<input placeholder='hiring date' type="date" name="date" id="eDate" onChange={handleOnChange} value={d} autoComplete='off' required />
							<div className="demoblue">-</div><input placeholder='Employee Phone number' type="number" name="phone" id="phone" onChange={handleOnChange} value={inputValues.phone} />
							<div className="demoblue">-</div><input placeholder='Employee salary' type="number" name="salary" id="salary" onChange={handleOnChange} value={!inputValues.salary ? "" : inputValues.salary} />
							<div className="demoblue">-</div><textarea className='TA' placeholder='address of employee' type="textarea" name="note" id="note" onChange={handleOnChange} value={inputValues.note}> </textarea>
							<br />
							<button type='submit' id='main-submit' className='goHome' onClick={(e) => { e.preventDefault(); NewEmployee() }}>Submit</button>
						</form>
					</div>
				</div>
			</>
		)

	}
	else {
		return "Error";
	}
}

export default Ne