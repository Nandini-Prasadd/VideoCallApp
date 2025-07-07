import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import Meeting from "../models/meeting.js";
import User from "../models/user.js";

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request body:", req.body);

  if (!username || !password) {
    console.log("Missing fields");
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: "User not found" });
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    console.log("Login successful, token:", token);

    return res.status(200).json({ token });
  } catch (e) {
    console.error("Login error:", e);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${e.message}` });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);

    res.status(httpStatus.CREATED).json({ message: "New acccount created" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meetings = await Meeting.find({ user_id: user.username }).sort({
      date: -1,
    });

    res.status(200).json(meetings);
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token });
    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
      date: new Date(),
    });
    await newMeeting.save();
    res.status(201).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

export { login, register, getUserHistory, addToHistory };
