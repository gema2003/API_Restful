const express = require('express');
const router = express.Router();
const PostController = require('../../controllers/api/Post');

router.post('/', PostController.create);
router.get('/id/:_id', PostController.findOneById);
router.get('/all', PostController.findAll);
router.get('/user', PostController.findAllByUser);
router.patch('/like', PostController.addLike);
router.put('/', PostController.updatePost);
router.delete('/', PostController.deleteOneById);

module.exports = router;