const express = require('express');
const router = express.Router();
const GridController = require('../controllers/grid.controller');
const { checkJwt } = require('../middlewares/checkJwt.middleware');
const { checkRole } = require('../middlewares/checkRole.middleware');
const { pixelRateLimiter } = require('../middlewares/rateLimiter.middleware');
const validate = require('../middlewares/validate.middleware');
const { updatePixelSchema } = require('../schemas/grid.schema');

router.get('/', GridController.getGrid);

router.post('/pixel', 
    checkJwt, 
    pixelRateLimiter, 
    validate(updatePixelSchema), 
    GridController.placePixel
);

router.delete('/pixel/:x/:y', 
    checkJwt, 
    checkRole(['admin']), 
    GridController.deletePixel
);

module.exports = router;