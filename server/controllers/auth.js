// // server/controllers/auth.js
// import bcrypt from "bcrypt"; // hashing passwords securely
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// /* REGISTER USER */
// // Controller function to register a new user
// export const register = async (req, res) => {
//   try {
//     // Destructure user details from request body
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       picturePath,
//       friends,
//       location,
//       occupation,
//     } = req.body;

//     // Generate salt for hashing password
//     const salt = await bcrypt.genSalt();
//     // Hash the password with the generated salt
//     const passwordHash = await bcrypt.hash(password, salt);

//     // Create a new User instance with hashed password
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: passwordHash,
//       picturePath,
//       friends,
//       location,
//       occupation,
//       // Generate random values for viewedProfile and impressions
//       viewedProfile: Math.floor(Math.random() * 10000),
//       impressions: Math.floor(Math.random() * 10000),
//     });
//     // Save the new user to the database
//     const savedUser = await newUser.save();
//     // Respond with the saved user object
//     res.status(201).json(savedUser);
//   } catch (err) {
//     // If an error occurs, respond with an error message
//     res.status(500).json({ error: err.message });
//   }
// };

// /* LOGGING IN */
// // Controller function to log in a user
// export const login = async (req, res) => {
//   try {
//     // Destructure email and password from request body
//     const { email, password } = req.body;
//     // Find user by email in the database
//     const user = await User.findOne({ email: email });
//     // If user doesn't exist, respond with error message
//     if (!user) return res.status(400).json({ msg: "User does not exist." });

//     // Compare provided password with hashed password in the database
//     const isMatch = await bcrypt.compare(password, user.password);
//     // If passwords don't match, respond with error message
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

//     // Generate JWT token for authentication
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     // Remove password field from user object before sending response
//     delete user.password;
//     // Respond with token and user object
//     res.status(200).json({ token, user });
//   } catch (err) {
//     // If an error occurs, respond with an error message
//     res.status(500).json({ error: err.message });
//   }
// };


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};