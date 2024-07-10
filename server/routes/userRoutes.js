const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {

    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) 
            return res.status(400).json("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        req.body.password = hashedPassword
        const newUser = new User(req.body)
        await newUser.save()

        res.status(201).json('User Created')
        
    } catch (error) {
        res.json(error)
    }

});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json("Wrong credentials!");
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json("Wrong credentials!");
    }
    res.status(200).json("Logged in!");
  } catch (error) {
    res.json(error);
  }
});

router.get("/get-all-users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send({
      success: true,
      message: "All users have been fetched!",
      data: allUsers
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;