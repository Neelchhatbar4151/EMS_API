const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv');
const Express = require('express');
const R = Express.Router();
const App = Express();
const Bcrypt = require('bcrypt');
const CookieParser = require('cookie-parser');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//made by neel

Dotenv.config({ path: './config.env' })

const User = require('../model/UserSchema');    //importing our collection schema for our users collection
const { findOne } = require('../model/UserSchema');

App.use(CookieParser());

const sendMail = async (to) => {
      const deleteIt = async () => {
            console.log("Checking for authorization.. ")
            const res = await User.findOne({ email: to }, { otp: 1 })
            if (res.otp !== 0) {
                  console.log("Deleting it..")
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
            from: 'neelchhatbar@gmail.com', // Use the email address or domain you verified above
            subject: 'Verification',
            text: 'OTP verification..',
            html: `Your EMS Login CODE: <strong>${CODE}</strong>`,
      };

      try {
            await sgMail.send(msg);
            await User.findOneAndUpdate({ email: to }, { otp: Number(CODE) }); //Bcrypt.hash(CODE,12)

      } catch (error) {
            console.log(error)
      }
}

const sendForgotCode = async (to) => {
      const deleteIt = async () => {
            const res = await User.findOne({ email: to }, { otp: 1 })
            if (res.otp !== 0) {
                  User.findOneAndUpdate({ email: to }, { otp: 0 })
            }
      }

      setTimeout(deleteIt, 60000);
      const CODE = Math.floor(100000 + Math.random() * 900000)
      const msg = {
            to: to,
            from: 'neelchhatbar@gmail.com', // Use the email address or domain you verified above
            subject: 'Verification',
            text: 'OTP verification..',
            html: `Your Forgot verification CODE: <strong>${CODE}</strong>`,
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
      if (Number(otp.otp) !== Number(myCode)) {
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

const SFC = async (req, res, next) => {
      try {
            const { email } = req.body;
            if (!email) {
                  return res.status(406).json({ status: 406 })
            }
            const data = await User.findOne({ email: email })
            if (!data) {
                  return res.status(417).json({ status: 417 })
            }
            await sendForgotCode(email);
            next();
      } catch (error) {
            console.log(err)
            return res.status(500).json({ status: 500 })
      }
}

R.post('/SendForgotCode', SFC, (req, res) => {
      return res.status(200).json({ status: 200 });
})

const CFC = async (req, res, next) => {
      try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                  return res.status(406).json({ status: 406 })
            }
            const data = await User.findOne({ email }, { otp: 1 })
            if (Number(data.otp) !== Number(otp)) {
                  return res.status(401).json({ status: 401 })
            }
            await User.findOneAndUpdate({ email }, { otp: 0 })
            next();
      } catch (error) {
            console.log(error)
            return res.status(500).json({ status: 500 })
      }
}

R.post('/CheckForgotCode', CFC, (req, res) => {
      return res.status(200).json({ status: 200 });
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
            // console.log(token);
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
            const { email, dept, name, eType, date, phone, salary, note, UserEmail } = req.body;

            if (!email || !name || !eType || !date || !dept) {

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
                  employees: data.employees.concat({ eName: name, eDept: dept, eType: eType, eDate: date, eEmail: email, ePhone: phone, eSalary: salary, eNote: note })
            }
            await User.findOneAndUpdate(filter, update)

            filter = { email: email }

            data = await User.findOne(filter, { mentions: 1 })
            if (data) {
                  update = {
                        mentions: data.mentions.concat({ mfrom: UserEmail, mDate: date, mType: "New Employee", mNote: ("Hired you as a " + eType + " With Salary " + salary + "₹") })
                  }
                  await User.findOneAndUpdate(filter, update)
            } else {
                  const Msg = {
                        to: email,
                        from: 'neelchhatbar@gmail.com', // Use the email address or domain you verified above
                        subject: 'You missed a Update',
                        text: 'Someone mentioned you',
                        html: `<h2 style="text-align: center">Register Your Email on <strong>ems3.herokuapp.com</strong></h2> <h4 style="text-align: center">To not miss any other updates/mentions from now</h4>`,
                  };
                  await sgMail.send(Msg)
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
            const { _id, email, amount, note, emps, IorD, date, unit } = req.body

            if (!amount || emps.length === 0) {
                  return res.status(406).json({ status: 406 })  //fill the fields properly
            }

            const which = (IorD === "I") ? "Increment" : "Decrement";
            const demoIorD = "Salary " + which + " of Employee"
            for (let i = 0; i < emps.length; i++) {
                  let data = await User.findOne({ _id }, { records: 1 })
                  let realAmount = (unit === 'N') ? amount : (amount * emps[i].eSalary) / 100
                  const demoNote = "Your Salary " + which + "ed by " + realAmount + " ₹"
                  await User.findOneAndUpdate({ _id, 'employees._id': emps[i]._id }, { '$set': { 'employees.$.eSalary': (IorD === "I") ? (Number(emps[i].eSalary) + Number(realAmount)) : (Number(emps[i].eSalary) - Number(realAmount)) } })
                  await User.findOneAndUpdate({ _id }, { records: data.records.concat({ rType: demoIorD, rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: note }) })
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

            for (let i = 0; i < emps.length; i++) {
                  let data = await User.findOne({ _id }, { records: 1 })
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

            for (let i = 0; i < emps.length; i++) {
                  let data = await User.findOne({ _id }, { records: 1 })
                  await User.findOneAndUpdate({ _id }, { records: data.records.concat({ rType: "Bonus to Employee ( +" + bonusAmount + " )", rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: note }) })

                  let d = await User.findOne({ email: emps[i].eEmail }, { mentions: 1 })

                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: "Bonus To Employee", mNote: "You got Bonus of " + bonusAmount + " ₹" })
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

const CE = async (req, res, next) => {
      try {
            const { email, _id, emps, note, eventType, date } = req.body;
            if (!eventType || !note) {
                  return res.status(406).json({ status: 406 })
            }
            for (let i = 0; i < emps.length; i++) {
                  let data = await User.findOne({ _id }, { records: 1 })
                  await User.findOneAndUpdate({ _id }, { records: data.records.concat({ rType: eventType, rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: note }) })

                  let d = await User.findOne({ email: emps[i].eEmail }, { mentions: 1 })

                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: eventType, mNote: note })
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

R.post('/CustomEvent', CE, (req, res) => {
      res.status(201).json({ status: 201 })
})

const CT = async (req, res, next) => {
      try {
            const { _id, eType } = req.body;
            if (!eType) {
                  return res.status(406).json({ status: 406 })
            }
            let data = await User.findOne({ _id }, { employeeTypes: 1 })
            for (let i = 0; i < data.employeeTypes.length; i++) {
                  if (data.employeeTypes[i].eType === eType) {
                        return res.status(400).json({ status: 400 })
                  }
            }
            let update = {
                  employeeTypes: data.employeeTypes.concat({ eType })
            }
            await User.findOneAndUpdate({ _id }, update)
            next();
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/CustomType', CT, (req, res) => {
      res.status(201).json({ status: 201 })
})

R.post('/Leave', async (req, res) => {
      try {
            const { leaveType, note, date, selectedEmployees, email } = req.body;
            for (let i = 0; i < selectedEmployees.length; i++) {
                  let data = await User.findOne({ email }, { records: 1 })
                  await User.findOneAndUpdate({ email }, { records: data.records.concat({ rType: leaveType + " Leave", rDate: date, rEmployeeName: selectedEmployees[i].eName, rEmployeeEmail: selectedEmployees[i].eEmail, rEmployeeType: selectedEmployees[i].eType, rNote: note }) })
                  let d = await User.findOne({ email: selectedEmployees[i].eEmail }, { mentions: 1 })
                  if (leaveType === "Without Pay") {
                        let date = new Date()
                        let charge = 0;
                        if (date.getMonth() === 0 ||
                              date.getMonth() === 2 ||
                              date.getMonth() === 4 ||
                              date.getMonth() === 6 ||
                              date.getMonth() === 7 ||
                              date.getMonth() === 9 ||
                              date.getMonth() === 11) {
                              charge = selectedEmployees[i].eSalary / 31
                        }
                        else if (date.getMonth() === 1) {
                              if (date.getFullYear % 4 === 0) {
                                    charge = selectedEmployees[i].eSalary / 28
                              }
                              else {
                                    charge = selectedEmployees[i].eSalary / 29
                              }
                        }
                        else {
                              charge = selectedEmployees[i].eSalary / 30
                        }
                        charge = Math.round(charge)
                        console.log(charge)
                        await User.findOneAndUpdate({ email, 'employees._id': selectedEmployees[i]._id }, { "$set": { 'employees.$.eSalary': Math.round(selectedEmployees[i].eSalary) - charge } })
                        if (d) {
                              let update = {
                                    mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: leaveType + " Leave, Deducted " + charge + " From your Salary", mNote: note })
                              }
                              await User.findOneAndUpdate({ email: selectedEmployees[i].eEmail }, update)
                        }
                  }
                  else if (leaveType === "Half Pay") {
                        let date = new Date()
                        let charge = 0;
                        if (date.getMonth() === 0 ||
                              date.getMonth() === 2 ||
                              date.getMonth() === 4 ||
                              date.getMonth() === 6 ||
                              date.getMonth() === 7 ||
                              date.getMonth() === 9 ||
                              date.getMonth() === 11) {
                              charge = selectedEmployees[i].eSalary / 31
                        }
                        else if (date.getMonth() === 1) {
                              if (date.getFullYear % 4 === 0) {
                                    charge = selectedEmployees[i].eSalary / 28
                              }
                              else {
                                    charge = selectedEmployees[i].eSalary / 29
                              }
                        }
                        else {
                              charge = selectedEmployees[i].eSalary / 30
                        }
                        charge = Math.round(charge / 2)
                        await User.findOneAndUpdate({ email, 'employees._id': selectedEmployees[i]._id }, { "$set": { 'employees.$.eSalary': Math.round(selectedEmployees[i].eSalary) - charge } })
                        if (d) {
                              let update = {
                                    mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: leaveType + " Leave, Deducted " + charge + " From your Salary", mNote: note })
                              }
                              await User.findOneAndUpdate({ email: selectedEmployees[i].eEmail }, update)
                        }
                  }
                  else {
                        if (d) {
                              let update = {
                                    mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: leaveType + " Leave", mNote: note })
                              }
                              await User.findOneAndUpdate({ email: selectedEmployees[i].eEmail }, update)
                        }
                  }

            }
            res.status(201).json({ status: 201 })
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 })
      }
})

const CUN = async (req, res, next) => {
      try {
            const { _id, name } = req.body;
            if (!name) {
                  return res.status(406).json({ status: 406 })
            }
            await User.findOneAndUpdate({ _id }, { name })
            next();
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/ChangeUserName', CUN, (req, res) => {
      res.status(201).json({ status: 201 })
})

const CP = async (req, res, next) => {
      try {
            const { _id, pass, oldPass } = req.body;
            let data = await User.findOne({ _id }, { password: 1 })
            const ismatch = await Bcrypt.compare(oldPass, data.password);
            if (!oldPass || !pass) {
                  return res.status(406).json({ status: 406 })
            }
            if (!ismatch) {
                  return res.status(401).json({ status: 401 })
            }
            if (pass === oldPass) {
                  return res.status(409).json({ status: 409 });
            }
            const password = await Bcrypt.hash(pass, 12);
            await User.findOneAndUpdate({ _id }, { password })
            next();

      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/ChangePassword', CP, (req, res) => {
      res.status(201).json({ status: 201 })
})

const CPTF = async (req, res, next) => {
      try {
            const { email, pass } = req.body;
            if (!pass || !email) {
                  return res.status(406).json({ status: 406 })
            }
            const data = await User.findOne({ email }, 'password')
            const ismatch = await Bcrypt.compare(pass, data.password);
            if (ismatch) {
                  return res.status(409).json({ status: 409 })
            }
            const password = await Bcrypt.hash(pass, 12);
            await User.findOneAndUpdate({ email }, { password })
            next();

      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/ChangePasswordThroughForgot', CPTF, (req, res) => {
      res.status(201).json({ status: 201 })
})

const DE = async (req, res, next) => {
      try {
            const { dId, _id, eEmail, email } = req.body;
            await User.findOneAndUpdate({ _id }, { $pull: { employees: { _id: dId } } })
            const data = await User.findOne({ email: eEmail }, { mentions: 1 })
            if (data) {
                  let update = {
                        mentions: data.mentions.concat({ mfrom: email, mDate: new Date(), mType: "Removed You", mNote: "You got Removed from their employee list" })
                  }
                  await User.findOneAndUpdate({ email: eEmail }, update)
            }
            next();
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/deleteEmployee', DE, (req, res) => {
      res.status(201).json({ status: 201 })
})

const SUM = async (req, res, next) => {
      try {
            const { email, name, msg } = req.body;
            const Msg = {
                  to: "fakefake2109@gmail.com",
                  from: 'neelchhatbar@gmail.com', // Use the email address or domain you verified above
                  subject: `Message from EMS User ${name}, ${email}`,
                  text: `Reply to <strong>${email}</strong>`,
                  html: msg,
            };
            await sgMail.send(Msg);
            next();
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/SendUserMsg', SUM, (req, res) => {
      res.status(200).json({ status: 200 })
})

const UE = async (req, res, next) => {
      try {
            const { EmailNow, email, note, date, eType, dept, phone, salary, name, UserEmail } = req.body;
            if (!email || !date || !eType || !dept || !name) {
                  return res.status(406).json({ status: 406 })
            }
            let d = await User.findOne({ email: UserEmail, 'employees.eEmail': email })
            // console.log(d)
            if (d && EmailNow !== email) {
                  return res.status(409).json({ status: 409 });
            }
            else {
                  await User.findOneAndUpdate({ email: UserEmail, 'employees.eEmail': EmailNow }, { '$set': { 'employees.$.eEmail': email, 'employees.$.eType': eType, 'employees.$.eDate': date, 'employees.$.eDept': dept, 'employees.$.eName': name, 'employees.$.eNote': note, 'employees.$.ePhone': phone, 'employees.$.eSalary': salary } })
                  d = await User.findOne({ email: email }, { mentions: 1 })

                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: UserEmail, mDate: date, mType: "New Employee / Edit", mNote: "Edited Your Data as a Employee / Hired You" })
                        }
                        await User.findOneAndUpdate({ email: email }, update)
                  }
                  next()
            }

      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
}

R.post('/UpdateEmployee', UE, (req, res) => {
      res.status(200).json({ status: 200 })
})

const s3 = require('./s3')
const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });

R.post('/EditProfile', upload.single('image'), async (req, res) => {
      try {
            const file = req.file;
            if (file) {
                  await User.findOneAndUpdate({ email: req.body.email }, { hasProfilePic: true })
                  await s3.putObject(file, req.body.email);
                  fs.unlink('./uploads/' + file.filename, (err) => {
                        if (err) {
                              console.log(err)
                        }
                  })
            }
            const { name, phoneNumber, address, workAt, profession, userType, userStatus, country } = req.body;
            console.log(userStatus)
            await User.findOneAndUpdate({ email: req.body.email }, { name, phoneNumber, address, workAt, profession, userType, userStatus, country })
            return res.status(200).json({ status: 200 })
      } catch (error) {
            console.log(error)
            return res.status(500).json({ status: 500 })
      }
})

R.post('/GetProfilePic', async (req, res) => {
      try {
            const data = await User.findOne({ email: req.body.email }, { hasProfilePic: 1 })
            if (data.hasProfilePic === false) {
                  return res.status(404).json({ status: 404 })
            }
            const signedUrl = await s3.GetObject(req.body.email)
            res.json({ URL: signedUrl, status: 200 })
      } catch (error) {
            if (error.name === 'NotFound') { // Note with v3 AWS-SDK use error.code
                  res.status(404).json({ status: 404 })
            } else {
                  res.status(500).json({ status: 500 })
            }
      }
})

R.post('/GetProfiles', async (req, res) => {
      try {
            const data = await User.find({}).select('name email phoneNumber address workAt userType userStatus country profession employees');
            let sendData = [];
            const NOE = req.body.nameOrEmail;
            const C = req.body.country;
            const T = req.body.userType;
            await (async () => {
                  for (let i = 0; i < data.length; i++) {
                        if (req.body.email === data[i].email.toUpperCase()) {
                              continue;
                        }
                        if (NOE) {
                              if (NOE !== data[i].name.toUpperCase() || NOE !== data[i].email.toUpperCase()) {
                                    continue;
                              }
                        }
                        if (C) {
                              if (C !== data[i].country.toUpperCase()) {
                                    continue;
                              }
                        }
                        if (T) {
                              if (T !== data[i].userType.toUpperCase() && data[i].userType.toUpperCase() !== "RE") {
                                    continue;
                              }
                        }
                        sendData.push(data[i])
                  }
            })()
            res.status(200).json({ status: 200, data: sendData })
      }
      catch (error) {
            req.status(500).json({ status: 500 })
      }
})

R.post('/TodayAttendance', async (req, res) => {
      try {
            const data = req.body.data;
            let generatedData = [];
            let x = await User.findOne({ email: req.body.email }, { attendance: 1 })
            for (let i = 0; i < data.length; i++) {
                  generatedData.push({ eName: data[i].data.eName, eEmail: data[i].data.eEmail, checked: (data[i].checked) ? true : false })
            }
            x.attendance.push({ attendanceDate: new Date(), attendanceData: generatedData })
            await User.findOneAndUpdate({ email: req.body.email }, { attendance: x.attendance })
            res.status(200).json({ status: 200 })
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 });
      }
})

R.post("/CheckForAttendance", async (req, res) => {
      try {
            const data = await User.findOne({ email: req.body.email }, { attendance: 1 })
            if (data.attendance.length === 0) {
                  console.log("HIU")
                  return res.status(200).json({ status: 200 })
            }
            let date = new Date(data.attendance[data.attendance.length - 1].attendanceDate);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            let dummy = new Date();
            let today = new Date(dummy.getFullYear(), dummy.getMonth(), dummy.getDate())
            console.log(date + " K " + today)
            if (today > date) {
                  return res.status(200).json({ status: 200 })
            }
            res.status(500).json({ status: 500 })
      }
      catch (err) {
            res.status(500).json({ status: 500 })
      }
})

R.post('/GetUserData', async (req, res) => {
      try {
            const data = await User.findOne({ email: req.body.email }, { name: 1, phoneNumber: 1, address: 1, workAt: 1, userType: 1, userStatus: 1, country: 1, profession: 1, email: 1, password: 1 })
            return res.status(200).json({ status: 200, data })
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 })
      }
})

R.post('/PaySalary', async (req, res) => {
      try {
            const { email, emps, date } = req.body;
            for (let i = 0; i < emps.length; i++) {
                  let data = await User.findOne({ email }, { records: 1, employees: 1 })
                  for (let j = 0; j < data.employees.length; j++) {
                        if (data.employees[j].eEmail === emps[i].eEmail) {
                              await User.findOneAndUpdate({ email, 'employees.eEmail': emps[i].eEmail }, { '$set': { 'employees.$.totalPaid': data.employees[j].totalPaid + data.employees[j].eSalary } })
                        }
                  }

                  await User.findOneAndUpdate({ email }, { records: data.records.concat({ rType: "Salary Payment", rDate: date, rEmployeeName: emps[i].eName, rEmployeeEmail: emps[i].eEmail, rEmployeeType: emps[i].eType, rNote: "Salary Paid " + emps[i].eSalary }) })

                  let d = await User.findOne({ email: emps[i].eEmail }, { mentions: 1 })

                  if (d) {
                        let update = {
                              mentions: d.mentions.concat({ mfrom: email, mDate: date, mType: "Salary Payment", mNote: "Salary Paid " + emps[i].eSalary })
                        }
                        await User.findOneAndUpdate({ email: emps[i].eEmail }, update)
                  }
            }
            res.status(201).json({ status: 201 })
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 })
      }
})

// R.post('/GetAttendanceHistory', async (req, res) => {
//       try{
//             const data = await User.findOne({email: req.body.email}, {attendance: 1})
//             return res.status(200).json({status:200, data: data.attendance})
//       }
//       catch(err){
//             console.log(err)
//             res.status(500).json({status: 500})
//       }
// })

module.exports = R;  //exporting routes
