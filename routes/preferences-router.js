const express = require("express");

const myUploader = require("../config/multer-setup");


const router = express.Router();


router.get("/settings", (req, res, next) => {
    // redirect to log in if there is no logged in user
    if (req.user === undefined) {
        res.redirect("/login");

        // early return to stop the function since there's an error
        // (prevents the rest of the code from running)
        return;
    }

    res.render("preferences/settings-page");
});

router.post("/settings",
                 // "editAvatar" is the input tag's "name" attribute
                 //      |
  myUploader.single("editAvatar"),
  (req, res, next) => {
      console.log("multer has defined 'req.file' to access the upload info");
      console.log(req.file);

      // redirect to log in if there is no logged in user
      if (req.user === undefined) {
          res.redirect("/login");

          // early return to stop the function since there's an error
          // (prevents the rest of the code from running)
          return;
      }

      req.user.set({ fullName: req.body.editFullName });

      // Users will not always upload a file.
      // If they didn't, "req.file" will be empty.
      if (req.file) {
          // only set the avatar if a file was uploaded
          req.user.set({ avatar: `/uploads/${req.file.filename}` });
      }

      req.user.save()
        .then(() => {
            res.redirect("/settings");
        })
        .catch((err) => {
            next(err);
        });
  }
);


module.exports = router;
