const { execute } = require('../models/db.postgres');
const PixelLog = require('../models/PIxelLog.model');

const getGridState = async () => {
    const result = await execute('SELECT x_coord, y_coord, color FROM pixel');
    return result.rows;
};

const updatePixel = async (x, y, color, userId, io) => {
    const updateQuery = `
        INSERT INTO pixel (x_coord, y_coord, color, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (x_coord, y_coord)
        DO UPDATE SET color = $3, user_id = $4, updated_at = CURRENT_TIMESTAMP
        RETURNING x_coord, y_coord, color
    `;
    const result = await execute(updateQuery, [x, y, color, userId]);
    const updatedPixel = result.rows[0];

    const logEntry = new PixelLog({
        x_coord: x,
        y_coord: y,
        color: color,
        userId: userId,
    });
    await logEntry.save();

    io.emit('pixel_update', { x: updatedPixel.x_coord, y: updatedPixel.y_coord, color: updatedPixel.color });

    return updatedPixel;
};

const deletePixelByCoords = async (x, y) => {
    const deleteQuery = `
        DELETE FROM pixel WHERE x_coord = $1 AND y_coord = $2
        RETURNING *
    `;
    const result = await execute(deleteQuery, [x, y]);
    
    const logEntry = new PixelLog({
        x_coord: x,
        y_coord: y,
        color: 'DELETED',
        userId: 'ADMIN_ACTION', 
        action: 'DELETED_BY_ADMIN',
    });
    await logEntry.save();

    return result.rowCount > 0;
};

module.exports = {
    getGridState,
    updatePixel,
    deletePixelByCoords,
};