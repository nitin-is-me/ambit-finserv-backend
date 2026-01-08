const router = require('express').Router();

const addBlogs = require('../controllers/blogs/addBlogs');
const deleteBlogs = require('../controllers/blogs/deleteBlogs');
const getBlogs = require('../controllers/blogs/getBlogs');
const getSingleBlog = require('../controllers/blogs/getSingleBlog');
const updateBlogs = require('../controllers/blogs/updateBlogs');

router.delete('/:id', deleteBlogs);
router.get('/:id', getSingleBlog);
router.patch('/:id', updateBlogs);
router.get('/', getBlogs);
router.post('/', addBlogs);

module.exports = router;
