const express = require('express');
const router = express.Router();
const GridController = require('../controllers/grid.controller');
const { checkJwt } = require('../middlewares/checkJwt.middleware');
const { checkRole } = require('../middlewares/checkRole.middleware');
const { pixelRateLimiter } = require('../middlewares/rateLimiter.middleware');
const validate = require('../middlewares/validate.middleware');
const { updatePixelSchema } = require('../schemas/grid.schema');

/**
 * @swagger
 * /api/grid:
 *   get:
 *     summary: Get the entire grid
 *     tags:
 *       - Grid
 *     responses:
 *       200:
 *         description: Returns the current grid state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/', GridController.getGrid);

/**
 * @swagger
 * /api/grid/pixel:
 *   post:
 *     summary: Place a pixel on the grid
 *     tags:
 *       - Grid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - x
 *               - y
 *               - color
 *             properties:
 *               x:
 *                 type: number
 *               y:
 *                 type: number
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pixel placed successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many requests
 */
router.post('/pixel', 
    checkJwt, 
    pixelRateLimiter, 
    validate(updatePixelSchema), 
    GridController.placePixel
);

/**
 * @swagger
 * /api/grid/pixel/{x}/{y}:
 *   delete:
 *     summary: Delete a pixel from the grid (admin only)
 *     tags:
 *       - Grid
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: x
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: y
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Pixel deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
router.delete('/pixel/:x/:y', 
    checkJwt, 
    checkRole(['admin']), 
    GridController.deletePixel
);

module.exports = router;