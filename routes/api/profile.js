import express, { json } from "express";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Profile from "../../models/Profile.js";
import config from "config";
import request from "request";
import { check, validationResult } from "express-validator";

const router = express.Router();

// @route  Get api/profile/me
// @desc   Get current users profile
// @access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  Post api/profile
// @desc   Create or update user profile
// @access Private

router.post(
  "/",
  auth,
  [check("status").not().isEmpty().withMessage("Status is required"), check("skills").not().isEmpty().withMessage("Skills is required")],
  async (req, res) => {
    // Checking with the required // checking errors
    const errors = validationResult(req);
    // Check if errors
    if (!errors.isEmpty()) {
      return res.status("400").json({ errors: errors.array() });
    }

    try {
      // Extract the required variables for the profile
      const { avatar, company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

      // Build pofile object
      const profileFields = {
        avatar: "",
        company: "",
        website: "",
        location: "",
        bio: "",
        status: "",
        githubusername: "",
        skills: "",
        youtube: "",
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      };
      profileFields.user = req.user.id;
      if (avatar) profileFields.avatar = avatar;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;

      // Build Skills Array
      skills && typeof skills === "object" ? (profileFields.skills = skills) : (profileFields.skills = skills.split(",").map((skill) => skill.trim()));

      // Build Social Object
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;

      // check for an existing profile
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true, upsert: true });
        return res.json(profile);
      }

      // for new profile, we create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  Get api/profile
// @desc   Get all profile
// @access Public

router.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  Get api/profile/user/:user_id
// @desc   Get user by user_id
// @access Private
router.get("/user/:user_id", async (req, res) => {
  try {
    // const user_id = req.params.user_id.trim();
    // console.log(typeof req.params.user_id);
    let profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name"]);
    if (!profile) return res.status(400).json({ msg: "Profile Not Found" });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") return res.status(400).json({ msg: "Profile Not Found" });
    res.status(500).send("Server Error");
  }
});

//  @route  DELETE api/profile
//  @desc   Delete profile, user, posts
//  @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // remove user's posts
    await Post.deleteMany({ user: req.user.id });

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route  PUT api/profile/experience
//  @desc   add profile experience
//  @access Private
router.put(
  "/experience",
  auth,
  [
    check("title").not().isEmpty().withMessage("Title is required"),
    check("company").not().isEmpty().withMessage("Company is required"),
    check("from").not().isEmpty().withMessage("From date is required"),
  ],
  async (req, res) => {
    // Checking with req // validating the inputs
    const errors = validationResult(req);
    // checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring data from req
    const { title, company, location, from, to, current, description } = req.body;
    // Making the new Experience object
    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route  DELETE api/profile/experience/:exp_id
//  @desc   delete experience from profile
//  @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);

    // removing the experience
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route  PUT api/profile/education
//  @desc   add profile education
//  @access Private
router.put(
  "/education",
  auth,
  [
    check("school").not().isEmpty().withMessage("School is required"),
    check("degree").not().isEmpty().withMessage("Degree is required"),
    check("fieldofstudy").not().isEmpty().withMessage("Field of study is required"),
    check("from").not().isEmpty().withMessage("From date is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring data from req
    const { school, degree, fieldofstudy, from, to, current, description } = req.body;
    // creating new education object
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      // Finding the profile to add education
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route  DELETE api/profile/education/:edu_id
//  @desc   delete education from profile
//  @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get Remove Index
    const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error !");
  }
});

//  @route  GET api/profile/github/:username
//  @desc   Get user repos from Github
//  @access Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    await request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "No Github Profile Found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error !");
  }
});

export default router;
