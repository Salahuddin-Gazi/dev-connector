import express from "express";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
// import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

const router = express.Router();

//route  @api/users
//desc   Register User
//access Public

router.post(
  "/",
  check("name").not().isEmpty().withMessage("Please insert a valid name"),
  check("email").isEmail().withMessage("Email is not valid"),
  check("password").isLength({ min: 5 }).withMessage("Password must be at least 5 chars long").matches(/\d/).withMessage("Password must contain a number"),

  async (req, res) => {
    // error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // Find User
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exist" }] });
      }

      // create user
      user = new User({ name, email, password });

      // encrypt password
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);

      // save to DB
      await user.save();

      // Json Web token
      const payload = {
        user: {
          id: user.id,
        },
      };
      const secretKey = config.get("jwtSecrectKey");

      jwt.sign(payload, secretKey, { expiresIn: 60 * 60 * 10 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

      // res.send("User Registered");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
