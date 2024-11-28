const User = require("../Models/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key";

exports.postSignup = async (req, res) => {
  const { email, password } = req.body;

  console.log(`${email}`)
  console.log(`${password}`)

  try {
    const userExists = await User.findOne({ email });
    console.log(userExists)
    
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword);
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();
console.log(user)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      message: "Signup successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Login Function
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id,  email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


exports.logout = (req, res) => {
  return res.json({ success: true, message: "Logged out successfully" });
};
