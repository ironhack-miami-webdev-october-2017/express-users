const mongoose = require("mongoose");


const Schema = mongoose.Schema;


// new Schema({ schema },  { settings })
const userSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {
      fullName: {
          type: String,
          required: [true, "Tell us your name."]
      },
      email: {
          type: String,
          required: [true, "What's your email?"],
          match: [/.+@.+/, "Emails need an @ sign."]
      },
      encryptedPassword: {
          type: String,
          required: [true, "We need a password."]
      }
  },

  // 2nd argument -> SETTINGS object
  {
      // automatically add "createdAt" and "updatedAt" Date fields
      timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);


module.exports = UserModel;
