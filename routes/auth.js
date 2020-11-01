const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google auth
// GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google auth callback
// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

// Logout
// Auth /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;