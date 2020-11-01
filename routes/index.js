const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Diary = require('../schema/Diaries');

// Login landing page
// GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login'
  });
});

// Dashboard  page
// GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try{
    const diaries = await Diary.find({ user: req.user.id }).populate('user').lean();
    
    res.render('dashboard', {
      name: req.user.firstName,
      diaries
    });
  }catch(err){
    console.error(err.message);
    res.render('error/500');
  }
  
});

module.exports = router;