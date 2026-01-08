const router = require('express').Router();

const addNews = require('../controllers/news/addNews');
const getNews = require('../controllers/news/getNews');
const updateNews = require('../controllers/news/updateNews');
const deleteNews = require('../controllers/news/deleteNews');

router.put('/update', updateNews);
router.post('/delete', deleteNews);
router.post('/add', addNews);
router.get('/get', getNews);

module.exports = router;
