import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { UserContext } from '../App';
import { useLayoutEffect } from 'react';
import { loginUser, cleanData } from '../processes/userData';
import Cookies from 'universal-cookie';


const Navbar = () => {

      const { state, dispatch } = useContext(UserContext);

      const history = useNavigate();
      function Logout() {
            const cookie = new Cookies();
            cookie.remove('EMSToken');
            cleanData(undefined);
            dispatch({ type: "USER", payload: false });
            history('/')
      }
      console.log(state)
      const ShowOptions = () => {

            if (state === true) {
                  console.log("ok")
                  return (
                        <>

                              {/* <li className="nav-item item active">
                                    <NavLink className="nav-link" to='/Profile'>Profile</NavLink>
                              </li> */}
                              <li className="nav-item item active">
                                    <span className="nav-link" onClick={Logout} >Logout</span>
                              </li>
                        </>
                  )
            }
            else {
                  console.log("not ok")
                  return (
                        <>
                              <li className="nav-item item active">
                                    <NavLink className="nav-link" to='/Login'>Login</NavLink>
                              </li>
                              <li className="nav-item item">
                                    <NavLink className="nav-link" to='/Register'>Register</NavLink>
                              </li>
                        </>
                  )
            }

      }
      const ModifiedMenu = () => {

            if (state === true) {

                  return (
                        <>
                              <li className="nav-item dropdown item">
                                    <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          Menu
                                    </span>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                          <NavLink className="dropdown-item" to='/History' >History</NavLink>
                                          <div className="dropdown-divider"></div>
                                          <NavLink className="dropdown-item" to='/Mentions'>Mentions</NavLink>
                                    </div>
                              </li>
                              <li className="nav-item item active">
                                    <NavLink className="nav-link" to='/Profile'>Profile</NavLink>
                              </li>
                              <li className="nav-item item">
                                    <NavLink className="nav-link" to='/Dashboard'>Dashboard</NavLink>
                              </li>
                        </>
                  )

            }

      }
      useLayoutEffect(() => {
            // setTimeout(() => {

            //       loginUser ? console.log(loginUser) : console.log("No data");
            // }, 1000);
            console.log("refresh")
      }, [state])
      return (
            <>

                  <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <NavLink to='/' className="navbar-brand ml"><img className='logo' src={logo} alt="wgw" /> </NavLink>
                        <button className="navbar-toggler mr" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                              <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse ml-5" id="navbarSupportedContent">
                              <ul className="navbar-nav mr">

                                    <ModifiedMenu />

                                    <ShowOptions />
                              </ul>
                        </div>
                  </nav>
            </>
      )
}

export default Navbar