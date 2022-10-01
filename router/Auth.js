const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv');
const Express = require('express');
const R = Express.Router();
const App = Express();
const Bcrypt = require('bcrypt');
const CookieParser = require('cookie-parser');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

Dotenv.config({ path: './config.env' })

require('../DB/Conn');    //connection to database 
const User = require('../model/UserSchema');    //importing our collection schema for our users collection
const { findOne } = require('../model/UserSchema');

App.use(CookieParser());

const sendMail = async (to) => {
      const deleteIt = async () => {
            const res = await User.findOne({ email: to }, { otp: 1 })
            if (res.otp !== 0) {
                  User.findOneAndDelete({ email: to }, function (err) {
                        if (err) {
                              console.log(err)
                        }
                  });
            }
      }

      setTimeout(deleteIt, 60000);

      const CODE = Math.floor(100000 + Math.random() * 900000)
      const msg = {
            to: to,
            from: 'CoinControl21@gmail.com', // Use the email address or domain you verified above
            subject: 'Verification',
            text: 'Bring a good habit into your life..',
            html: `Your coin control CODE: <strong>${CODE}</strong>`,
      };

      try {
            await sgMail.send(msg);
            await User.findOneAndUpdate({ email: to }, { otp: Number(CODE) }); //Bcrypt.hash(CODE,12)

      } catch (error) {
            console.log(error)
      }
}

const checkCode = async (req, res, next) => {

      const { email, myCode } = req.body;

      const otp = await User.findOne({ email: email }, { otp: 1 })
      if (Number(otp.otp) != Number(myCode)) {
            return res.status(406).json({ status: 406 }); //	Not Acceptable
      }
      else {
            await User.findOneAndUpdate({ email: email }, { otp: 0, authorized: true })
            next();
      }

}

R.post('/checkCode', checkCode, (req, res) => {
      return res.status(200).json({ status: 200 }); //	ok
})

R.post('/register', async (req, res) => {

      const { email, password } = req.body;

      const eTypes = [{ eType: "Manager" }, { eType: "Clerk" }, { eType: 'Junior' }, { eType: 'senior' }];
      const rTypes = [{ rType: "New Employee" }, { rType: 'Salary Increment/Decrement of Employee(s)' }, { rType: 'Transfer of Employee(s)' }, { rType: 'Bonus to Emplyee(s)' }, { rType: 'Custom' }];

      if (!email || !password) {

            return res.status(406).json({ status: 406 }); //	Not Acceptable

      }

      try {

            const Exist = await User.findOne({ email: email });

            if (Exist) {
                  return res.status(422).json({ status: 422 }); //already exist
            }

            const user = new User({ email: email, password: password, employeeTypes: eTypes, rTypes: rTypes });

            await user.save();

            res.status(201).send({ status: 201 }); //user created

            sendMail(email);

      } catch (err) {

            console.log(err);

      }

});


R.post('/signin', async (req, res) => {

      try {

            const { email, password } = req.body;

            if (!email || !password) {

                  return res.status(406).json({ status: 406 });  //fill data properly

            }

            const Exist = await User.findOne({ email: email });

            if (!Exist) {

                  return res.status(417).json({ status: 417 });   //Incorrect Email or Password

            }

            const ismatch = await Bcrypt.compare(password, Exist.password);

            if (!ismatch) {

                  return res.status(417).json({ status: 417 });    //Incorrect Email or Password

            }
            else {
                  if (Exist.authorized) {
                        const token = await Exist.GenerateAuthToken();
                        return res.status(202).json({ status: 202, jwtToken: token });    //login successfull
                  }
                  else {
                        return res.status(401).json({ status: 401 });       //not acceptable
                  }

            }

      } catch (err) {

            console.log(err);

      }

});

const authenticate = async (req, res, next) => {

      try {

            const token = req.body.token;

            if (!token) {

                  throw new Error;  //Token not found

            }

            const verifyToken = Jwt.verify(token, process.env.SECRET_KEY);

            const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

            if (!rootUser) { throw new Error }  //User not found

            req.token = token;
            req.rootUser = rootUser;

            next();

      } catch (err) {

            console.log(err);

            res.status(401).json({ status: 401 }); //Token or User not found    

      }
}

R.post('/getData', authenticate, (req, res) => {

      res.status(200).json({ status: 200, data: req.rootUser }); //ok, Token and User found

})

const recordNewEmployee = async (req, res, next) => {
      try {
            const { email, name, eType, date, phone, salary, note, UserEmail } = req.body;

            if (!email || !name || !eType || !date) {

                  return res.status(406).json({ status: 406 });  //fill data properly

            }
            let filter = { email: UserEmail };

            let data = await User.findOne(filter, { records: 1, employees: 1 })

            for (let i = 0; i < data.employees.length; i++) {
                  if (data.employees[i].eEmail == email) {
                        return res.status(422).json({ status: 422 }); // already exist
                  }
            }

            let update = {
                  records: data.records.concat({ rType: "New Employee", rDate: date, rEmployeeName: name, rEmployeeEmail: email, rEmployeeType: eType, rNote: note }),
                  employees: data.employees.concat({ eName: name, eType: eType, eDate: date, eEmail: email, ePhone: phone, eSalary: salary, eNote: note })
            }
            await User.findOneAndUpdate(filter, update)

            filter = { email: email }

            data = await User.findOne(filter, { mentions: 1 })
            if (data) {
                  update = {
                        mentions: data.mentions.concat({ mfrom: UserEmail, mDate: date, mType: "New Employee", mNote: ("Hired you as a " + eType) })
                  }
                  await User.findOneAndUpdate(filter, update)
            }

            next();

      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 }) //internal server error
      }

}

R.post('/NewEmployee', recordNewEmployee, (req, res) => {

      res.status(201).json({ status: 201 })

})

const IDsalary = async (req, res, next) => {
      try {
            const { _id, email, amount, note, emps, IorD, date } = req.body

            if (!amount || emps.length === 0) {
                  return res.status(406).json({ status: 406 })  //fill the fields properly
            }

            let data = await User.findOne({ _id }, { records: 1 })
            const which = (IorD === "I") ? "Increment" : "Decrement";
            const demoIorD = "Salary " + which + " of Employee"
            const demoNote = "Your Salary " + which + " by " + amount + " ₹"
            for (let i = 0; i < emps.length; i++) {
                  await User.findOneAndUpdate({ _id, 'employees._id': emps[i]._id }, { '$set': { 'employees.$.eSalary': (IorD === "I") ? (Number(emps[i].eSalary) + Number(amount)) : (Number(emps[i].eSalary) - Number(amount)) } })
                  await User.findOneAndUpdate({ _id, records: data.records.concat({ rType: demoIorD, rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: note }) })
                  let d = await User.findOne({ email: emps[i].eEmail }, { mentions: 1 })
                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: demoIorD, mNote: demoNote })
                        }
                        await User.findOneAndUpdate({ email: emps[i].eEmail }, update)
                  }
            }

            next();

      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 }) //internal server error
      }
}

R.post('/salaryIorD', IDsalary, (req, res) => {
      res.status(201).json({ status: 201 })
})

const ET = async (req, res, next) => {
      try {
            const { _id, email, note, date, address, emps } = req.body;
            if (!address || emps.length === 0) {
                  return res.status(406).json({ status: 406 })  //fill the fields properly
            }
            let data = await User.findOne({ _id }, { records: 1 })
            for (let i = 0; i < emps.length; i++) {
                  await User.findOneAndUpdate({ _id, 'employees._id': emps[i]._id }, { "$set": { 'employees.$.eNote': address } })

                  await User.findOneAndUpdate({ _id }, { records: data.records.concat({ rType: "Transfer of employee", rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: note }) })

                  let d = await User.findOne({ email: emps[i].eEmail }, { mentions: 1 })

                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: "Transfer of employee", mNote: "You got transfered to: " + address })
                        }
                        await User.findOneAndUpdate({ email: emps[i].eEmail }, update)
                  }
            }
            next();
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 }) //internal server error
      }
}

R.post('/EmployeeTransfer', ET, (req, res) => {
      res.status(201).json({ status: 201 })
})

const BE = async (req, res, next) => {
      try {
            const { bonusAmount, note, date, emps, email, _id } = req.body;
            if (!bonusAmount || emps.length === 0) {
                  return res.status(406).json({ status: 406 })  //fill the fields properly
            }
            let data = await User.findOne({ _id }, { records: 1 })
            for (let i = 0; i < emps.length; i++) {
                  await User.findOneAndUpdate({ _id }, { records: data.records.concat({ rType: "Bonus to Employee ( +" + bonusAmount + " )", rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: note }) })

                  let d = await User.findOne({ email: emps[i].eEmail }, { mentions: 1 })

                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: "Bonus To Employee", mNote: "You got Bonus of "+bonusAmount+" ₹" })
                        }
                        await User.findOneAndUpdate({ email: emps[i].eEmail }, update)
                  }
            }
            next();
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/BonusToEmployee', BE, (req, res) => {
      res.status(201).json({ status: 201 })
})

module.exports = R;  //exporting routes