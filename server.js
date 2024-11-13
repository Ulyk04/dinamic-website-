const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the main project directory
app.use(express.static(path.join(__dirname)));

// Temporary storage for verification codes
const verificationCodes = {};

// Configure nodemailer with your email provider’s SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kayserlokman@gmail.com', // Replace with your email
    pass: 'NY-15(MY)',   // Replace with your email password or app password
  },
});

// Route for sign-up (to receive user input data)
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log('Sign-up data:', { username, email, password });

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a random 6-digit code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  verificationCodes[email] = verificationCode;

  // Send the email with the verification code
  transporter.sendMail({
    from: 'kayserlokman@gmail.com', // Sender address
    to: email,                        // Recipient’s email address
    subject: 'Your Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  }, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send verification code' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Verification code sent to your email' });
    }
  });
});

// Route for verification
app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  console.log('Verification code received:', code);

  // Check if the code matches
  if (verificationCodes[email] && verificationCodes[email] == code) {
    delete verificationCodes[email]; // Clear the code after successful verification
    res.json({ message: 'Verification successful' });
  } else {
    res.status(400).json({ message: 'Invalid verification code' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
