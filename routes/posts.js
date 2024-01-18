const { Router } = require('express');
const { Post, User } = require('../models');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  if (req.query.write) {
    res.render('post/edit');
    return;
  }
  
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 10);
  
  const [posts, totalPage] = await Post.getPaginatedPosts({}, page, perPage);
  console.log(posts[0].shortId);
  console.log(posts[0].author);
  
  res.render('post/list', { posts, page, perPage, totalPage, path: req.baseUrl });
}));

router.get('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const post = await Post.findOne({ shortId }).populate('author');
  
  if (req.query.edit) {
    res.render('post/edit', { post });
    return;
  }
  
  res.render('post/view', { post });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    throw new Error('제목과 내용을 입력 해 주세요');
  }
  
  const author = await User.findOne({ shortId: req.user.shortId });

  const post = await Post.create({ title, content, author });
  res.redirect(`/posts/${post.shortId}`);
}));

router.post('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { title, content } = req.body;
  
  if (!title || !content) {
    throw new Error('제목과 내용을 입력 해 주세요');
  }
  
  const post = await Post.findOne({ shortId }).populate('author');
  if (post.author.shortId !== req.user.shortId) {
    throw new Error('권한이 없습니다.');
  }
    
  await Post.updateOne({ shortId }, { title, content });
  res.redirect(`/posts/${shortId}`);
}));

router.delete('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  
  const post = await Post.findOne({ shortId }).populate('author');
  if (post.author.shortId !== req.user.shortId) {
    throw new Error('권한이 없습니다.');
  }
  
  await Post.deleteOne({ shortId });
  res.send('OK');
}));




module.exports = router;