const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('total likes of three blogs', () => {
  const listWithOneBlog = [
    {
      _id: '3a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '2a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 15,
      __v: 1
    },
    {
      _id: '1a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 50,
      __v: 2
    }
  ]

  test('when list has three blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 70)
  })
})


describe('favoriteBlog', () => {
  const blogs = [
    { title: 'Blog A', author: 'Author A', likes: 1 },
    { title: 'Blog B', author: 'Author B', likes: 12 },
    { title: 'Blog C', author: 'Author C', likes: 5 }
  ];

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    const expected = { title: 'Blog B', author: 'Author B', likes: 12 };
    assert.deepStrictEqual(result, expected);
  });

  test('returns null for an empty array', () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });
});

// Tests for mostBlogs
describe('mostBlogs', () => {
  const blogs = [
    { author: 'Author A' },
    { author: 'Author B' },
    { author: 'Author A' }
  ];

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    const expected = { author: 'Author A', blogs: 2 };
    assert.deepStrictEqual(result, expected);
  });

  test('returns null for an empty array', () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});

// Tests for mostLikes
describe('mostLikes', () => {
  const blogs = [
    { author: 'Author A', likes: 1 },
    { author: 'Author B', likes: 4 },
    { author: 'Author A', likes: 3 },
    { author: 'Author C', likes: 10 }
  ];

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs);
    const expected = { author: 'Author C', likes: 10 };
    assert.deepStrictEqual(result, expected);
  });

  test('returns null for an empty array', () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });
});
