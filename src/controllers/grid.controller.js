const gridService = require('../services/grid.service');

const getGrid = async (req, res, next) => {
    try {
        const grid = await gridService.getGridState();
        res.status(200).json(grid);
    } catch (error) {
        next(error);
    }
};

const placePixel = async (req, res, next) => {
    try {
        const { x, y, color } = req.body;
        const userId = req.user.id;
        
        const io = req.io;

        const updatedPixel = await gridService.updatePixel(x, y, color, userId, io);
        res.status(200).json({ message: 'Pixel placed successfully', pixel: updatedPixel });
    } catch (error) {
        next(error);
    }
};

const deletePixel = async (req, res, next) => {
    try {
        const x = parseInt(req.params.x);
        const y = parseInt(req.params.y);
        const io = req.io;

        const deleted = await gridService.deletePixelByCoords(x, y);

        if (deleted) {
            io.emit('pixel_update', { x: x, y: y, color: '#FFFFFF' });
            return res.status(200).json({ message: 'Pixel deleted successfully by Admin' });
        } else {
            return res.status(404).json({ message: 'Pixel not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGrid,
    placePixel,
    deletePixel,
};