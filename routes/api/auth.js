import express from "express";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import config from "config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";

const router = express.Router();

// @ api/auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!!");
  }
});

//route  @api/auth
//desc   Validate User or Login user
//access Public
router.post(
  "/",
  check("email").isEmail().withMessage("Email is not valid"),
  check("password").isLength({ min: 5 }).withMessage("Password must be at least 5 chars long").matches(/\d/).withMessage("Password must contain a number"),

  async (req, res) => {
    // error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Find User or check user name
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check Password
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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
