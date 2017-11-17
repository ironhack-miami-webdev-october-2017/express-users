const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/user-model");


const router = express.Router();


// STEP #1: show the sign up form
router.get("/signup", (req, res, next) => {
    // redirect to home if you are already logged in
    if (req.user) {
        res.redirect("/");

        // early return to stop the function since there's an error
        // (prevents the rest of the code from running)
        return;
    }

    res.render("user-views/signup-page");
});

// STEP #2: process the sign up form
router.post("/process-signup", (req, res, next) => {
    // check if password is invalid
    if (req.body.signupPassword.length < 16 ||
        req.body.signupPassword.match(/[^a-z0-9]/i) === null
    ) {                          //          |
                                 // if no special characters
        // display the form again if it is
        res.locals.errorMessage = "Password is invalid.";
        res.render("user-views/signup-page");

        // early return to stop the function since there's an error
        // (prevents the rest of the code from running)
        return;
    }

    // query the database to see if the email is taken
    UserModel.findOne({ email: req.body.signupEmail })
      .then((userFromDb) => {
          // "userFromDb" will be null if the email IS NOT taken

          // display the form again if the email is taken
          if (userFromDb !== null) {
              res.locals.errorMessage = "Email is taken.";
              res.render("user-views/signup-page");

              // early return to stop the function since there's an error
              // (prevents the rest of the code from running)
              return;
          }

          // generate a new salt for this user's password
          const salt = bcrypt.genSaltSync(10);

                                     // encrypt the password submitted
                                     // by the user from the form
          const scrambledPassword =  //    |
            bcrypt.hashSync(req.body.signupPassword, salt);

          const theUser = new UserModel({
              fullName: req.body.signupFullName,
              email:    req.body.signupEmail,
              encryptedPassword: scrambledPassword
          });

          // return the promise of the next database query
          // to continue the sequence
          return theUser.save();
      })
      .then(() => {
          // redirect to the home page on a successful sign up
          res.redirect("/");
      })
      .catch((err) => {
          next(err);
      });
}); // POST /process-signup


// STEP #1: show the log in form
router.get("/login", (req, res, next) => {
    // redirect to home if you are already logged in
    if (req.user) {
        res.redirect("/");

        // early return to stop the function since there's an error
        // (prevents the rest of the code from running)
        return;
    }

    res.render("user-views/login-page");
});

// STEP #2: process the log in form
router.post("/process-login", (req, res, next) => {
    // find a user document in the database with that email
    UserModel.findOne({ email: req.body.loginEmail })
      .then((userFromDb) => {
          // if we didn't find a user
          if (userFromDb === null) {
              // display the form again because the email is wrong
              res.locals.errorMessage = "Email incorrect.";
              res.render("user-views/login-page");

              // early return to stop the function since there's an error
              // (prevents the rest of the code from running)
              return;
          }

          // if email is correct now we check the password
          const isPasswordGood =
            bcrypt.compareSync(req.body.loginPassword, userFromDb.encryptedPassword);

          if (isPasswordGood === false) {
              res.locals.errorMessage = "Password incorrect.";
              res.render("user-views/login-page");

              // early return to stop the function since there's an error
              // (prevents the rest of the code from running)
              return;
          }

          // CREDENTIALS ARE GOOD! We need log the user in.

          // Passport defines the "req.login()" method
          // for us to specify when to log in a user into the session
          req.login(userFromDb, (err) => {
              // check to see if the log in worked
              if (err) {
                  // if it didn't work show the error page
                  next(err);
              }
              else {
                  // if it worked redirect to the home page
                  res.redirect("/");
              }
          }); // req.login()
      }) // then()
      .catch((err) => {
          next(err);
      });
});


router.get("/logout", (req, res, next) => {
    // Passport defines the "req.logout()" method
    // for us to specify when to log out a user (clear them from the session)
    req.logout();

    res.redirect("/");
});


// Facebook log in routes
// -----------------------------------------------------------------------------

// Link to "/facebook/login" to initiate the login process
router.get("/facebook/login", passport.authenticate("facebook"));
                                        //               |
                                        // This name comes from the strategy

// Facebook will redirect here after login is successful
router.get("/facebook/success",    // no normal callback here
  passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login"
  })
);


// Google log in routes
// -----------------------------------------------------------------------------

// Link to "/google/login" to initiate the login process
router.get("/google/login",     // no normal callback here
  passport.authenticate("google", {
      scope: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"
      ]
  })
);

// Google will redirect here after login is successful
router.get("/google/success",     // no normal callback here
  passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login"
  })
);

module.exports = router;
