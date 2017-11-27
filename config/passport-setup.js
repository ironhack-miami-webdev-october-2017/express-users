const passport = require("passport");
const FbStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const UserModel = require("../models/user-model");


// serialize (what user information do we save to the session?)
// ------------------------------------------------------------
// gets called when a user logs in (on our POST /process-login)
passport.serializeUser((userFromDb, cb) => {
    // null is for saying "no errors occurred" during the serialize process
    //  |
    cb(null, userFromDb._id);
      //                 |
      // save only the "_id" of the user
});


// deserialize (how do we retrieve the user details from the session?)
// -------------------------------------------------------------------
// gets called EVERY TIME you visit a page on the site while you are logged in
// (that's so we can potentially personalize all pages)
passport.deserializeUser((idFromSession, cb) => {
    // find the user's document by the ID we saved in the session
    UserModel.findById(idFromSession)
      .then((userFromDb) => {
          // null is saying "no errors occurred" during the deserialize process
          //  |
          cb(null, userFromDb);
            //          |
            // send Passport the logged in user's info
      })
      .catch((err) => {
          cb(err);
      });
});


// STRATEGIES (npm packages that enable additional methods of logging in)
// -----------------------------------------------------------------------------

// Login With Facebook

// passport.use(new FbStrategy());
passport.use(
  new FbStrategy(
    // 1st arg of FbStrategy -> settings object
    {
        // Facebook credentials
        // App ID
        clientID:     process.env.FACEBOOK_ID,
        // App Secret
        clientSecret: process.env.FACEBOOK_SECRET,

        // Where to go after log in is successful (one of our routes)
        callbackURL: "/facebook/success",

        // fixes Facebook log in for production
        proxy: true
    },

    // 2nd arg of FbStrategy -> callback
    (accessToken, refreshToken, profile, callback) => {
        // profile contains the user info we get from Facebook
        console.log('FACEBOOK profile -----------------------');
        console.log(profile);

        // Check if there's already a document in the database for this user
        UserModel.findOne({ facebookID: profile.id })
          .then((userFromDb) => {
              // if there's already a user account
              if (userFromDb) {
                  // tell Passport to use that user account
                  callback(null, userFromDb);
                  return;
              }

              // create a user account if there is none
              const theUser = new UserModel({
                  facebookID: profile.id,
                  fullName: profile.displayName
              });

              return theUser.save();
          })
          .then((newUser) => {
              // tell Passport to use the new user account
              callback(null, newUser);
          })
          .catch((err) => {
              // tell Passport there was an error in the login process
              callback(err);
          });
    }
  ) // new FbStrategy()
); // passport.use()



// Login With Google

// passport.use(new GoogleStrategy());
passport.use(
  new GoogleStrategy(
    // 1st arg of GoogleStrategy -> settings object
    {
        // Google credentials
        clientID:     process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,

        // Where to go after log in is successful (one of our routes)
        callbackURL: "/google/success",

        // fixes Google log in for production
        proxy: true
    },

    // 2nd arg of GoogleStrategy -> callback
    (accessToken, refreshToken, profile, callback) => {
        // profile contains the user info we get from Google
        console.log('GOOGLE profile -----------------------');
        console.log(profile);

        // Check if there's already a document in the database for this user
        UserModel.findOne({ googleID: profile.id })
          .then((userFromDb) => {
              // if there's already a user account
              if (userFromDb) {
                  // tell Passport to use that user account
                  callback(null, userFromDb);
                  return;
              }

              // create a user account if there is none
              const theUser = new UserModel({
                  googleID: profile.id,
                  // use the email as their name 'cause Google doesn't give name
                  fullName: profile.emails[0].value
              });

              return theUser.save();
          })
          .then((newUser) => {
              // tell Passport to use the new user account
              callback(null, newUser);
          })
          .catch((err) => {
              // tell Passport there was an error in the login process
              callback(err);
          });
    }
  ) // new GoogleStrategy()
); // passport.use()
