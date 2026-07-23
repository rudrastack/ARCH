import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


async function sendTokenResponse(user, res) {
  const token = jwt.sign({
    id: user._id,
  }, config.JWT_SECRET)

  res.cookie('token', token)

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
    }
  })
}

export const registerUser = async (req, res) => {
  const { email, password, fullname, contact, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [
        { email },
        { contact }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with the same email or contact' });
    }

    const user = await userModel.create({
      email,
      password,
      fullname,
      contact,
      role: isSeller ? "seller" : "buyer"

    });

    await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }

};
