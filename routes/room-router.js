const express = require("express");

const RoomModel = require("../models/room-model");


const router = express.Router();


router.get("/rooms/new", (req, res, next) => {
    // redirect to log in if there is no logged in user
    if (req.user === undefined) {
        res.redirect("/login");
        return;
    }

    res.render("room-views/room-form");
});

router.post("/rooms", (req, res, next) => {
    // redirect to log in if there is no logged in user
    if (req.user === undefined) {
        res.redirect("/login");
        return;
    }

    const theRoom = new RoomModel({
        name:        req.body.roomName,
        photoUrl:    req.body.roomPhoto,
        description: req.body.roomDescription,
        // "req.user" is the logged in user's document (defined by Passport)
        owner:       req.user._id
    });

    theRoom.save()
      .then(() => {
          res.redirect("/my-rooms");
      })
      .catch((err) => {
          next(err);
      });
});


router.get("/my-rooms", (req, res, next) => {
    // redirect to log in if there is no logged in user
    if (req.user === undefined) {
        res.redirect("/login");
        return;
    }

    RoomModel
      // retrieve all rooms owned by the logged in user
      .find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .exec()
      .then((roomResults) => {
          res.locals.listOfRooms = roomResults;
          res.render("room-views/room-list");
      })
      .catch((err) => {
          next(err);
      });
});


module.exports = router;
