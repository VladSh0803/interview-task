import express from 'express'
import Message from '../models/message.js';
import { body, matchedData, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const messages = express.Router()

const createBodyTextChain = () => body('text').trim().notEmpty().escape();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         text:
 *           type: string
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get all messages
 *     responses:
 *       '200':
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       '500':
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Message
 *     summary: Create new message
 *     requestBody:
 *       description: New message
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       '201':
 *         description: Created message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '500':
 *         description: Internal server error
 */
messages.route('/')
    .get(async (req, res) => {
        const messages = await Message.findAll();

        res.json(messages);
    })
    .post(createBodyTextChain(), async (req, res) => {
        validationResult(req).throw();
        const data = matchedData(req);
        const message = await Message.create({ text: data['text'] });

        res.status(StatusCodes.CREATED).json(message);
    })

/**
 * @swagger
 * /messages/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       type: integer
 *       minimum: 1
 *       required: true
 *       description: ID of the message
 *   get:
 *     tags:
 *       - Message
 *     summary: Get message by ID
 *     responses:
 *       '200':
 *         description: Requested message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '404':
 *         description: Requested message not found
 *       '500':
 *         description: Internal server error
 *   patch:
 *     tags:
 *       - Message
 *     summary: Edit message
 *     requestBody:
 *       description: New message
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       '200':
 *         description: Edited message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: Request body is not valid
 *       '404':
 *         description: Message to edit not found
 *       '500':
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Message
 *     summary: Delete message
 *     responses:
 *       '200':
 *         description: Message deleted
 *       '404':
 *         description: Message to delete not found
 *       '500':
 *         description: Internal server error
 */
messages.route('/:id').all(param('id').isInt({ gt: 0 }))
    .get(async (req, res) => {
        validationResult(req).throw();
        const id = matchedData(req)['id'];
        const message = await Message.findByPk(id);
        if (!message) {
            res.status(StatusCodes.NOT_FOUND).send();
            return;
        }

        res.json(message);
    })
    .patch(createBodyTextChain(), async (req, res) => {
        validationResult(req).throw();
        const params = matchedData(req, { locations: 'params' });
        const message = await Message.findByPk(params['id']);
        if (!message) {
            res.status(StatusCodes.NOT_FOUND).send();
            return;
        }

        const data = matchedData(req, { locations: 'body' });
        message.text = data['text'];
        await message.save();

        res.json(message);
    })
    .delete(async (req, res) => {
        validationResult(req).throw();
        const id = matchedData(req)['id'];
        const message = await Message.findByPk(id);
        if (!message) {
            res.status(StatusCodes.NOT_FOUND).send();
            return;
        }

        await message.destroy();

        res.send();
    })

export default messages;