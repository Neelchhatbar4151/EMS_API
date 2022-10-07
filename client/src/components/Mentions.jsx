import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';
import Moment from 'moment';
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
	const [inputValues, setInputValues] = React.useState({
		nameOrEmail: "", date: "", eventType: ''
	});

	const handleOnChange = event => {
		const { name, value } = event.target;
		setInputValues({ ...inputValues, [name]: value });
		document.getElementsByClassName('upper')[0].style.opacity = 0;
		setTimeout(() => {
			document.getElementsByClassName('upper')[0].style.opacity = 1;
		}, 400);
	};
	if (loginUser) {
		const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'wgwgw']
		const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let reverseMentions = [];
		for (let i = (loginUser.mentions.length - 1); i >= 0; i--) {
			reverseMentions.push(loginUser.mentions[i]);
		}
		const Interface = () => {
			if (document.getElementsByClassName('filter')[0].style.display === 'none' || !document.getElementsByClassName('filter')[0].style.display) {
				document.getElementsByClassName('filter')[0].style.display = 'block'
				document.getElementsByClassName('filter')[0].style.animation = 'Show 0.8s'
				document.getElementById('PFR').innerText = "Remove Filter"
				document.getElementById('PFR').style.backgroundColor = 'red';
			}
			else {
				document.getElementsByClassName('filter')[0].style.animation = 'Hide 0.4s'
				document.getElementById('PFR').innerText = "Filter Mentions"
				document.getElementById('PFR').style.backgroundColor = 'rgb(2, 204, 2)';
				setTimeout(() => {
					document.getElementsByClassName('filter')[0].style.display = 'none';

					setInputValues({ ...inputValues, nameOrEmail: "", date: "", eType: "", eventType: "" });


				}, 390);
			}
		}
		const RenderMentions = (n) => {
			const date = new Date(n.mDate)
			const opponentdate = Moment(date).format('yyyy-MM-DD')
			const matchdate = (inputValues.date === "") ? "" : Moment(inputValues.date).format('yyyy-MM-DD')
			if (matchdate !== "" && matchdate !== opponentdate) {

				return ""
			}
			if (inputValues.nameOrEmail !== "" && (inputValues.nameOrEmail.toLowerCase() !== n.mfrom.toLowerCase())) {
				return ""
			}
			if (inputValues.eventType !== "" &&( inputValues.eventType.toLowerCase() !== n.mType.toLowerCase())) {
				return ""
			}
			return (
				<tr id={n._id} key={n._id}>
					<td className='fName'>{n.mfrom} </td>
					<td className='evType'>{n.mType} </td>
					<td className='mDate'>{day[date.getDay()] + ", " + date.getDate() + " " + month[date.getMonth() + 1] + " " + date.getFullYear()}</td>
					<td className="mNote">{n.mNote?n.mNote:"No note"}</td>
				</tr>
			)
		}
		const d = Moment(inputValues.date).format('yyyy-MM-DD')
		return (
			<>
				<div className="containerHistory">
					<h1 className='titleheader'>Mentions</h1>

					<button className="goHome PFR" id='PFR' onClick={Interface}>Filter Mentions</button>
					<div className="filter">
						<div className="editText">
							<input type="text" value={inputValues.nameOrEmail} name="nameOrEmail" id="nOe" onChange={handleOnChange} placeholder='Email for " From " field' />
						</div>
						<div className="editText">
							<input type="text" value={inputValues.eventType} name="eventType" id="evT" onChange={handleOnChange} placeholder='Event type' />
						</div>
						<div className="editdate">
							<strong>Date: </strong><input type="date" value={d} name="date" id="d" onChange={handleOnChange} />
						</div>
					</div>
					<div className='upper'>
						<table>
							<thead>
								<tr>
									<th>From</th>
									<th>Event Type</th>
									<th>Date</th>
									<th>Note</th>
								</tr>
							</thead>
							<tbody>

								{reverseMentions.map(RenderMentions)}
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

export default Mentions