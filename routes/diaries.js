const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Diary = require('../schema/Diaries');

// Show add page
// GET /diaries/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('diaries/add');
});

// Show edit page
// GET /diaries/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const diary = await Diary.findOne({ _id: req.params.id}).lean();
    if(!diary){
      return res.render('error/404');
    }
    if(diary.user != req.user.id){
      res.redirect('/diaries');
    }else{
      res.render('diaries/edit', { diary });
    }
  } catch (error) {
    console.error(err.message);
    res.render('error/500');
  }
});

// Add Diary
// POST /diaries/add
router.post('/', ensureAuth, async (req, res) => {
  try{
    req.body.user = req.user.id;
    await Diary.create(req.body);
    res.redirect('/dashboard');
  }catch(err){
    console.error(err.message);
    res.render('error/500');
  }
});

// Show All diaries
// GET /diaries/
router.get('/', ensureAuth, async (req, res) => {
  try{
    const diaries = await Diary.find({ user:  req.user.id }).populate('user').sort({ createTime: 'desc' }).lean();
    res.render('diaries/index', { diaries });
  }catch(err){
    console.error(err.message);
    res.render('error/500');
  }
});

// Show a diary
// GET /diaries/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let diary = await Diary.findById(req.params.id).populate('user').lean();
    if(!diary){
      return res.render('error/404');
    }
    res.render('diaries/show', {diary});
  } catch (err) {
    console.error(err.message);
    res.render('error/500');
  }
});

// Edit diaries
// PUT /diaries/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try{
    let diary = await Diary.findById(req.params.id).lean();
    if(!diary){
      res.render('error/404');
    }
    if(diary.user != req.user.id){
      res.redirect('/diaries');
    }else{
      diary = await Diary.findOneAndUpdate({ _id: req.params.id }, req.body, {new : true, runValidators:true});
      res.redirect('/dashboard');
    }
  }catch(err){
    console.error(err.message);
    res.render('error/500');
  }
});

// Delete diaries
// DELETE /diaries/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try{
     await Diary.remove({_id: req.params.id});
     res.redirect('/dashboard');
  }catch(err){
    console.error(err.message);
    res.render('error/500');
  }
});

// User diaries
// GET /diaries/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    let diaries = await Diary.find({user: req.params.userId}).populate('user').lean();
    res.render('diaries/index', {diaries});
  } catch (err) {
    console.error(err.message);
    res.render('error/500');
  }
});

module.exports = router;