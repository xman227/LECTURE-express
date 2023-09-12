const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { Post, User } = require('../models');

const router = Router();

router.get(
  '/posts/:shortId/comments',
  asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    const post = await Post.findOne({ shortId });

    // post.comments 의 작성자 populate 하기
    // json 으로 응답 보내기

    await User.populate(post.comments, { path: 'author' }); // post.comments 의 작성자 populate 하기
    res.json(post.comments); // json 으로 응답 보내기
  }),
);

router.post(
  '/posts/:shortId/comments',
  asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    const { content } = req.body;
    const author = await User.findOne({ shortId: req.user.shortId });

    await Post.updateOne({ shortId }, {
    $push: { 
        comments: { content, author } 
    }
}); // $push operator 사용하여 댓글 추가하기
    res.json({ result: 'success' });
  }),
);

module.exports = router;
