import Cookies from 'universal-cookie';
import userData from './userData';
import { developement } from './userData';

const LoginOrNot = async () => {
      
      const cookie = new Cookies();
      const optionsForFetching = {

            method: "POST",

            headers: {

                  "Content-Type" : "application/json",
                  Accept: "application/json",
                  "Access-Control-Allow-Origin": "*",

            },

            body: JSON.stringify({

                  token: cookie.get("EMSToken") ? cookie.get('EMSToken') : ""

            })

      }

      try {
            const res = await fetch( (developement)?"http://localhost:5000/getData":"/getData", optionsForFetching )

            const data = await res.json();

            if( data.status !== 200 ){
                  throw new Error(res.error);
            }
            
            await userData(data)
            return true

      } catch (error) {
            return false;
      }

      

}

export default LoginOrNot;