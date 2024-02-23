const config = require('./utils/config');
const express = require('express');
require('express-async-errors'); // Automatically handles async errors
const app = express();
const cors = require('cors');
const blogRouter = require('./controllers/blog');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


mongoose.set('strictQuery', false);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('connected to MongoDB');
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message);
  }
};

connectToMongoDB();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor); 

app.use('/api/blogs', middleware.userExtractor, blogRouter);


app.use('/api/blogs', blogRouter);
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)



app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
