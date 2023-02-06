const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken')

const UserSchema = new Mongoose.Schema({

      authorized: {
            type: Boolean,
            default: false
      },

      otp: {
            type: Number,
            default:0
      },

      name: {

            type: String,
            default: "Guest"

      },

      email: {

            type: String,
            required: true,
            unique: true

      },

      password: {

            type: String,
            required: true

      },

      employeeTypes: [{eType: String}],

      mentions: [
            {
                  mfrom: {
                        type:String
                  },
                  mDate: {
                        type:Date
                  },
                  mType: {
                        type:String
                  },
                  mNote: {
                        type:String
                  }
            }
      ],

      employees: [

            {

                  eName: {

                        type: String

                  },
                  eDept: {
                        type: String
                  },
                  eType: {

                        type: String

                  },
                  eDate: {

                        type: Date

                  },
                  eEmail: {

                        type: String

                  },
                  ePhone: {
                        
                        type: String

                  },
                  eSalary: {
                        
                        type: Number

                  },
                  eNote: {

                        type: String

                  }

            }

      ],

      rTypes: [

            {

                  rType: {

                        type: String

                  }

            }

      ],

      records: [

            {

                  rType: {

                        type: String

                  },
                  rDate: {
                        
                        type: Date

                  },
                  rEmployeeName: {

                        type: String

                  },
                  rEmployeeEmail: {

                        type: String

                  },
                  rEmployeeType: {

                        type: String

                  },
                  rNote: {
                        type: String
                  }
                  

            }

      ],
      
      tokens: [

            {
                  
                  token: {

                        type: String,

                  }

            }

      ],

      // Filename: String,
      // desc: String,
      // img:
      // {
      //       data: Buffer,
      //       contentType: String
      // }
       
});

UserSchema.methods.GenerateAuthToken = async function () {

      try {

            let token = Jwt.sign({_id:this._id}, process.env.SECRET_KEY)
            this.tokens = this.tokens.concat({token: token});
            await this.save();
            return token;

      } catch (err) {

            console.log(err);

      }
}

UserSchema.pre('save', async function (next){

      if(this.isModified('password')){

            this.password = await Bcrypt.hash(this.password,12);

      }
      next();
});

const User = Mongoose.model('ems_users',UserSchema);

module.exports = User;