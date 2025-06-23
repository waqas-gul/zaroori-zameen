import User from '../models/Usermodel.js';

// @desc    Check questionnaire status
// @route   GET /api/questionnaire/status
// @access  Private
const checkQuestionnaireStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ needsQuestionnaire: !user.hasCompletedQuestionnaire });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Submit questionnaire answers
// @route   POST /api/questionnaire/submit
// @access  Private
const submitQuestionnaire = async (req, res) => {
    try {
        const { answers } = req.body;
        console.log(answers)
        await User.findByIdAndUpdate(req.user.id, {
            hasCompletedQuestionnaire: true,
            questionnaireAnswers: answers
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



const skipQuestionnaire = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            hasCompletedQuestionnaire: true,
            questionnaireSkipped: true,
            questionnaireSkippedAt: new Date()
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};




export { submitQuestionnaire, checkQuestionnaireStatus, skipQuestionnaire };