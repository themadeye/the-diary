const express = require('express');
const moment = require('moment');
const router = express.Router();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSORG_API_KEY);
const { ensureAuth } = require('../middleware/auth');

// Show All news
// GET /news/
router.get('/', ensureAuth, async (req, res) => {
  try {
    let from = moment(new Date().setDate(new Date().getDate() - 3)).format('YYYY-MM-DD');
    let to = moment(new Date()).format('YYYY-MM-DD');
    newsapi.v2.everything({
      q: 'covid',
      sources: 'bbc-news,the-verge',
      domains: 'bbc.co.uk,techcrunch.com',
      from: from,
      to: to,
      language: 'en',
    }).then(response => {
      let news = response.articles;
      res.render('news/index', { news });
    });
  } catch (err) {
    console.error(err.message);
    res.render('error/500');
  }
});

module.exports = router;