const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url is missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes 
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Blog.findByIdAndDelete(id);
  response.status(204).end(); 
});

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = {
    likes: request.body.likes
  };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.json(updatedBlog);
});



module.exports = blogRouter;
