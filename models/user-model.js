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

      // normal login users
      email: {
          type: String,
          match: [/.+@.+/, "Emails need an @ sign."]
      },
      encryptedPassword: { type: String },

      // facebook users
      facebookID: { type: String },

      // google users
      googleID: { type: String }
  },

  // 2nd argument -> SETTINGS object
  {
      // automatically add "createdAt" and "updatedAt" Date fields
      timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);


module.exports = UserModel;
