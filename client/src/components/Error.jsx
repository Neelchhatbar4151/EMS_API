import React from 'react';
import {useNavigate} from 'react-router-dom';

function Error() {
	// let [num,setNum] = React.useState(0);
	const animation = () => {
		num++;
		document.getElementById('e403').innerText = num;
		if (num === 404) {
			clearInterval(ok);
			document.getElementById('page').style.display = "block";
			ok = 0;
		}

	}
	let ok = setInterval(animation, 1);  //0.1
	let num = 0;
	const history = useNavigate();
	return (
		<>

			<div className="e404" id='e403'>0</div>
			<p id='page'>
				<span> Page not found</span>
				<br />
				<button className='goHome' onClick={()=>{history('/')}}>Go to Home</button>
				<button className='goLogin' onClick={()=>{history('/login')}}>Go to Login</button>
			</p>

		</>
	)
}

export default Error