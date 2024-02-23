const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "My Asxcvf",
    "author": "John Doe",
    "url": "http://www.example.com",
    "likes": 10
  },
  {
    "title": "My Asxcvf",
    "author": "John Doe",
    "url": "http://www.example.com",
    "likes": 1
  },
]


const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temporary title',
    author: 'Temporary author',
    url: 'http://www.temporary-url.com',
    likes: 0
  });
  await blog.save();
  await blog.deleteOne(); 
  return blog._id.toString();
};


const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}