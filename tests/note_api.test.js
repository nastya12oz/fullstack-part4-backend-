const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')



const api = supertest(app)

const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  helper.initialBlogs.forEach(async (note) => {
    let noteObject = new Blog(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

test('the first blog is about My Asxcvf', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title);
  assert(titles.includes('My Asxcvf'));
})

test('a valid blog can be added', async () => {
  const newBlog = {
    "title": "Blh Blh",
    "author": "Luca Italian",
    "url": "http://www.example.com",
    "likes": 666
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')


  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  const authors = response.body.map(blog => blog.author);
  assert(authors.includes('Luca Italian'));

})



test('a blog post can be deleted', async () => {
  // Setup: Create a new blog post to delete later
  const newBlog = new Blog({
    title: 'Blog to be deleted',
    author: 'Deleter',
    url: 'http://delete-me.com',
    likes: 0
  });
  const savedBlog = await newBlog.save();

  // Test: Delete the blog post
  await api
    .delete(`/api/blogs/${savedBlog._id}`)
    .expect(204);

  // Verify: Ensure the blog post no longer exists
  const blogsAfterDelete = await Blog.findById(savedBlog._id);
  assert.strictEqual(blogsAfterDelete, null);
});

test('a blog post can be updated', async () => {
  // Setup: Create a new blog post to update later
  const newBlog = new Blog({
    title: 'Blog to be updated',
    author: 'Updater',
    url: 'http://update-me.com',
    likes: 0
  });
  const savedBlog = await newBlog.save();

  // Update info
  const updatedInfo = {
    likes: 1
  };

  // Test: Update the blog post
  const updateResponse = await api
    .put(`/api/blogs/${savedBlog._id}`)
    .send(updatedInfo)
    .expect(200);

  // Verify: Check the response for updated likes
  assert.strictEqual(updateResponse.body.likes, 1);

  // Verify: Ensure the blog post was updated in the database
  const updatedBlog = await Blog.findById(savedBlog._id);
  assert.strictEqual(updatedBlog.likes, 1);
});