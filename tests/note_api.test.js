const { test, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const api = supertest(app);

let token;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword',
  };

  await api.post('/api/users').send(newUser);

  const loginResponse = await api.post('/api/login').send({
    username: 'testuser',
    password: 'testpassword',
  });

  token = loginResponse.body.token;

  for (const blog of helper.initialBlogs) {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog);
  }
});

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert(Array.isArray(response.body)); 
});

test('the first blog is about My Asxcvf', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .expect(200);

  const titles = response.body.map(blog => blog.title);
  assert(titles.includes('My Asxcvf'));
});


test('a blog post can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedInfo = {
    likes: blogToUpdate.likes + 1,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedInfo)
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
});

test('a blog post can be deleted', async () => {
  const newBlog = {
    title: 'Blog to be deleted',
    author: 'Deleter',
    url: 'http://delete-me.com',
    likes: 0
  };

  const createdBlogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  await api
    .delete(`/api/blogs/${createdBlogResponse.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const blogsAfterDelete = await helper.blogsInDb();
  assert.strictEqual(blogsAfterDelete.length, helper.initialBlogs.length);
  assert(!blogsAfterDelete.find(blog => blog.id === createdBlogResponse.body.id));
});


test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});
