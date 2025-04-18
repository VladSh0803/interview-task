import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import sequelize from "./utils/database.js";
import { validateParam } from "./middlewares/validateParam.js";
import { validateId } from "./middlewares/validateId.js";
import { Message } from "./models/message.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// Initialize environment variables
config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Get all messages
app.get('/messages', async (req, res) => {
  const messages = await Message.findAll();
  res.json(messages);
});

// Get message by ID
app.get('/messages/:id', validateParam('id'), validateId(), async (req, res, next) => {
  const message = await Message.findByPk(req['id']);
  if (!message) {
    next({
      statusCode: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
      data: { field: 'id', value: req['id'] },
    });
  }
  res.json(message);
});

// Create message
app.post('/messages', async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    next({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Text is required',
      data: { field: 'text' },
    });
  }

  const message = await Message.create({ text });
  res.status(StatusCodes.CREATED).json(message);
});

// Update a message
app.patch('/messages/:id', validateParam('id'), validateId(), async (req, res, next) => {
  const message = await Message.findByPk(req['id']);
  if (!message) {
    next({
      statusCode: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
      data: { field: 'id', value: req['id'] },
    });
  }

  const { text } = req.body;
  if (!text) {
    next({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Text is required',
      data: { field: 'text' },
    });
  }

  message.text = text;
  await message.save();
  res.status(StatusCodes.OK).json(message);
});

// Delete message
app.delete('/messages/:id', validateParam('id'), validateId(), async (req, res, next) => {
  const message = await Message.findByPk(req['id']);
  if (!message) {
    next({
      statusCode: StatusCodes.NOT_FOUND,
      message: ReasonPhrases.NOT_FOUND,
      data: { field: 'id', value: req['id'] },
    });
  }

  await message.destroy();
  res.status(StatusCodes.OK).json({ message: 'Message deleted' });
});

// Global Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ success: false, message: message, data: data });
});

// DB Connection
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Connection has been established successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
