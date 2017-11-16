const express = require("express");


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


module.exports = router;
