import React from 'react'
import { loginUser } from '../processes/userData'
import { NavLink } from 'react-router-dom';

function MegaInput(Props) {
	const toggleMenu = () => {
		if((!document.getElementById('hideit').style.display) || (document.getElementById('hideit').style.display == "none"))
		{
			(document.getElementById('hideit').style.display = 'inline-block')
			document.getElementById('hideit').style.animation = "smooth 0.5s"
			document.getElementById('toggle').style.background = "rgba(149, 138, 138, 0.2)"
			document.getElementById('toggle').style.color = "black"

		}
		else{
			document.getElementById('hideit').style.animation = "remove 0.5s "
			document.getElementById('toggle').style.background = "rgb(149, 138, 138)"
			document.getElementById('toggle').style.color = "white"
			setTimeout(() => {
				(document.getElementById('hideit').style.display = 'none')
			}, 490);
		}
	}
	const RenderOptions = (n) => {
		if(Props.input === n.rType){
			return <div key={n._id} className='divopt'><span>--Select an Option--</span> <hr /></div>
		}
		return (
			<div key={n._id} className='divopt' >
				<NavLink className='opt' to={'/' + (n.rType[0] + n.rType[1])}>{n.rType}</NavLink>
				<hr />
			</div>


		)
	}
	return (
		<div>
			<button className='cap' id="toggle" onClick={() => { toggleMenu() }}>{Props.input}</button>
			<br />
			<div id='hideit'>
				{loginUser.rTypes.map(RenderOptions)}
			</div>
		</div>

	)
}

export default MegaInput

