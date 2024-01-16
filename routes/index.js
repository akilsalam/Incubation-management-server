var express = require('express');
const { Users, ApplyForm, BookingData } = require('./connection');
var router = express.Router();
const bcrypt =require('bcrypt')



/* GET home page. */
router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Passwords match, include a redirection URL in the response
        res.json({ success: true, redirectUrl: '/'  });
        
      } else {
        // Passwords do not match, include an error message in the response
        res.json({ success: false, message: 'Invalid password'  });
      }
    } else {
      // User not found, include an error message in the response
      res.json({ success: false, message: 'User Name Not Found!!🧐' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/signup', async function(req, res, next) {
  const inputData = {
    first_name: req.body.firstData,
    last_name: req.body.lastData,
    email: req.body.emailData,
    password: req.body.passwordData
  };
  const existingUser = await Users.findOne({ email: inputData.email });
  if (existingUser) {
    // User already exists
    res.json({ success: false, message: 'User already exists.Please enter another username' });
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(inputData.password, saltRounds);
    inputData.password = hashedPassword;

    try {
      const userdata = await Users.insertMany([inputData]);
      if (userdata) {
        res.json({ success: true, redirectUrl: '/' });
      } else {
        res.json({ success: false, message: 'Registration failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

router.post('/applyForm', async function(req, res, next) {
  const inputData = {
    name: req.body.name,
    city: req.body.city,
    email: req.body.email,
    company: req.body.company,
    address: req.body.address,
    state: req.body.state,
    phone: req.body.phone, 
    describeTeam: req.body.describeTeam,
    describeCompany: req.body.describeCompany,  
    problemSolve: req.body.problemSolve,
    status: 'new',
  };


    try {
      const applydata = await ApplyForm.create(inputData);
      if (applydata) {
        res.json({ success: true, redirectUrl: '/' });
      } else {
        res.json({ success: false, message: 'Registration failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// ... (previous backend code)

// Fetch all booked seats
router.get('/bookSeat', async function (req, res, next) {
  try {
    const booked = await BookingData.find();
    res.json(booked);
  } catch (error) {
    console.error('Error fetching booked seats:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Import statements...

router.post('/bookSeat/book/:index', async function (req, res, next) {
  const { index } = req.params;
  const { user } = req.body;

  try {
    console.log('Updating seat for index:', index);

    // Convert index to a number if needed
    const seatNumber = parseInt(index) + 1;

    console.log('Seat number to update:', seatNumber);

    const updatedSeat = await BookingData.findOneAndUpdate(
      { seatNumber: seatNumber },
      { $set: { onClick: true, user: user } },
      { new: true }
    );

    if (!updatedSeat) {
      console.log('Seat not found');
      return res.status(404).json({ error: 'Seat not found' });
    }

    console.log('Updated seat:', updatedSeat);
    res.json(updatedSeat);
  } catch (error) {
    console.error('Error updating seat booking status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other backend routes and logic...


// Check if user is filled for a seat
router.get('/bookSeat/checkUserFilled/:index', async function (req, res, next) {
  const { index } = req.params;

  try {
    // Convert index to a number if needed
    const seatNumber = parseInt(index) + 1;

    const slot = await BookingData.findOne({ seatNumber: seatNumber });

    if (!slot) {
      console.log('Seat not found');
      return res.status(404).json({ error: 'Seat not found' });
    }

    console.log('Slot data:', slot);

    res.json({ user: slot.user });
  } catch (error) {
    console.error('Error checking user filled status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// const BookingSchema = new mongoose.Schema({
//   onClick: { type: Boolean, required: true },
//   user: { type: String, required: false }, // Allow the user field to be optional
//   seatNumber: { type: String, required: true },
// });

// ... (remaining backend code)




module.exports = router;
