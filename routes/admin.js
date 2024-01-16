var express = require('express');
const { Admin, ApplyForm, PendingDetail, ApprovedDetail } = require('./connection');
var router = express.Router();
const bcrypt =require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Passwords match, include a redirection URL in the response
        res.json({ success: true, redirectUrl: '/admin'  });
        
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

router.get('/appliedDetail',async function(req, res, next) {
  const applicant = await ApplyForm.find({status:"new"})
  res.json(applicant)
});

router.get('/personalDetail/:id', async function (req, res, next) {
  const userId = req.params.id;
  const selectUser = await ApplyForm.findById(userId);
  res.send(selectUser)
});

// Express route to handle editing user data
router.post('/personalEditedDetail/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    // Update the user data in the database (use your database library here)
      const editedData = await ApplyForm.findByIdAndUpdate(
        userId,
        { $set: { name: updates.name,city:updates.city,email:updates.email,company:updates.company,address:updates.address,state:updates.state,phone:updates.phone } },
        { new: true }
      );
      console.log("Edited Data:",editedData);
      if (editedData) {
        res.json({ success: true, redirectUrl: '/admin/newApplicant' });
      } else {
        res.json({ success: false, message: 'Registration failed' });
      }
    const updatedDocument = await ApplyForm.findOne({ _id: userId });
    console.log(updatedDocument);
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/pendingApplicant',async function(req, res, next) {
  const newApplicant = await ApplyForm.find({status:'pending'})
  res.json(newApplicant)
});

router.post('/pendingApplicant/:id', async function (req, res, next) {
  try {
    const userId = req.params.id;

    // Update the user data in the database (use your database library here)
    const editedData = await ApplyForm.findByIdAndUpdate(
      userId,
      { $set: { status: "pending" } },
      { new: true }
    );

    console.log("Edited Data:", editedData);

    if (editedData) {
      res.json({ success: true, redirectUrl: '/admin/pendingApplicant' });
    } else {
      res.json({ success: false, message: 'Update failed' });
    }

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/permenentDetail/:id', async function (req, res, next) {
  const userId = req.params.id;
  const selectUser = await ApplyForm.findById(userId);
  res.send(selectUser)
});

router.delete('/decline/:id', async (req, res, next) => {
  try {
    const deletedDocument = await ApplyForm.findOneAndDelete({ _id: req.params.id });
    if (deletedDocument) {
      res.json({ success: true, redirectUrl: '/admin/pendingApplicant' });
    } else {
      console.log(`Document with ID ${req.params.id} not found`);
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error(`Error deleting document with ID ${req.params.id}: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/approvedApplicant',async function(req, res, next) {
  const newApplicant = await ApplyForm.find({status:'approved'})
  res.json(newApplicant)
});

router.post('/approvedApplicant/:id', async function (req, res, next) {
  try {
    const userId = req.params.id;

    // Update the user data in the database (use your database library here)
    const editedData = await ApplyForm.findByIdAndUpdate(
      userId,
      { $set: { status: "approved" } },
      { new: true }
    );

    console.log("Edited Data:", editedData);

    if (editedData) {
      res.json({ success: true, redirectUrl: '/admin/pendingApplicant' });
    } else {
      res.json({ success: false, message: 'Update failed' });
    }

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/recordList',async function(req, res, next) {
  const newApplicant = await ApplyForm.find()
  res.json(newApplicant)
});

module.exports = router;
