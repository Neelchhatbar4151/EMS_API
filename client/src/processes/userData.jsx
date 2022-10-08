export let loginUser ;
export let emailParent = {email:"demo@gmail.com", password:undefined, allow: false} ; 
export const developement = true ;

export const setEmail = (data ) =>{ 
      emailParent = data;
}

const userData = (data) => {
      loginUser = {
            email: data.data.email,
            name: data.data.name,
            employeeTypes: data.data.employeeTypes,
            employees: data.data.employees,
            rTypes: data.data.rTypes,
            records: data.data.records,
            mentions: data.data.mentions,
            _id : data.data._id,
      } ;
      return loginUser;
}

export const cleanData = (data) => {
      loginUser = data ;
      return loginUser;
}

export default userData