import express from 'express';
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Check if user needs to complete questionnaire
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ needsQuestionnaire: !user.hasCompletedQuestionnaire });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Submit questionnaire answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    await User.findByIdAndUpdate(req.user.id, {
      hasCompletedQuestionnaire: true,
      questionnaireAnswers: answers
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;