import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../processes/userData';

import MegaInput from './MegaInput';

function Dashboard() {
	const history = useNavigate();
	const { state } = useContext(UserContext);
	useEffect(() => {
		if (!state) {
			history('/Login');
		}
	}, [state])

	if (loginUser) {

		return (
			<>
				<div className="main">
					<div className="main-card">

						<MegaInput input="--Select an Option--" />
						<div className="ull">
							<ul>
								<li>Select a option to do operations related to employee</li>
							</ul>
						</div>

					</div>
				</div>
			</>
		)

	}
	else{
		return "Error";
	}

}

export default Dashboard