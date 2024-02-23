const dummy = (blogs) => {
  return 1;
}


const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);
  return { title: favorite.title, author: favorite.author, likes: favorite.likes };
};

const mostBlogs = (blogs) => {
  const authorsCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});
  
  let maxBlogs = 0;
  let maxAuthor = '';
  for (const [author, count] of Object.entries(authorsCount)) {
    if (count > maxBlogs) {
      maxBlogs = count;
      maxAuthor = author;
    }
  }

  return maxBlogs ? { author: maxAuthor, blogs: maxBlogs } : null;
};

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});
  
  let maxLikes = 0;
  let maxAuthor = '';
  for (const [author, likes] of Object.entries(authorLikes)) {
    if (likes > maxLikes) {
      maxLikes = likes;
      maxAuthor = author;
    }
  }

  return maxLikes ? { author: maxAuthor, likes: maxLikes } : null;
};




module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}