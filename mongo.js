const mongoose = require('mongoose');

const main = async () => {
  if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
  }

  const password = process.argv[2];

  const url = `mongodb+srv://nastyachasovskikh:${password}@cluster0.qkpvmtp.mongodb.net/part4?retryWrites=true&w=majority`;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(url);
    const blogSchema = new mongoose.Schema({
      title: String,
      author: String,
      url: String,
      likes: Number
    });

    const Blog = mongoose.model('Blog', blogSchema);

    const blogs = await Blog.find({});
    blogs.forEach(blog => {
      console.log(blog);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  } finally {
    mongoose.connection.close();
  }
};

main();
