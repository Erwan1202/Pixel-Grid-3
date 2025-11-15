const request = require('supertest');
const app = require('../server');
const { execute } = require('../src/models/db.postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const PixelLog = require('../src/models/PIxelLog.model'); 

let userToken = '';
let adminToken = '';
let refreshToken = '';
const userEmail = 'user-test@pixelgrid.com';
const adminEmail = 'admin-test@pixelgrid.com';

const testPixel = { x: 50, y: 50, color: '#00FF00' };
const pixelToDelete = { x: 51, y: 51, color: '#123456' };
const uniquePixel = { x: 55, y: 55, color: '#FF0000' };

beforeAll(async () => {
    await execute('DELETE FROM users WHERE email IN ($1, $2)', [userEmail, adminEmail]);
    await execute('DELETE FROM pixel WHERE x_coord IN (50, 51, 55)');
    await PixelLog.deleteMany({ x_coord: { $in: [50, 51, 55] } });
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    await execute('INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)', ['TestUser', userEmail, hashedPassword, 'user']);
    await execute('INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)', ['TestAdmin', adminEmail, hashedPassword, 'admin']);

    const userRes = await request(app).post('/api/auth/login').send({ email: userEmail, password: 'password123' });
    userToken = userRes.body.accessToken;
    refreshToken = userRes.body.refreshToken;

    const adminRes = await request(app).post('/api/auth/login').send({ email: adminEmail, password: 'password123' });
    adminToken = adminRes.body.accessToken;
});

afterAll(async () => {
    await execute('DELETE FROM users WHERE email IN ($1, $2)', [userEmail, adminEmail]);
    await execute('DELETE FROM pixel WHERE x_coord IN (50, 51, 55)');
    await PixelLog.deleteMany({ x_coord: { $in: [50, 51, 55] } });
});

describe('A. AUTHENTICATION (User Flow)', () => {
    it('POST /api/auth/login - should fail with invalid credentials (401)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userEmail, password: 'wrongpassword' });
        expect(res.statusCode).toBe(401);
    });

    it('POST /api/auth/register - should fail validation (400)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'sh', email: 'bademail' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('POST /api/auth/refresh - should renew tokens', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: refreshToken });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });
});

describe('B. GRID FUNCTIONALITY (Logic, Access)', () => {
    it('GET /api/grid - should retrieve the grid state (public)', async () => {
        const res = await request(app).get('/api/grid');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/grid/pixel - should return 401 if not authenticated', async () => {
        const res = await request(app)
            .post('/api/grid/pixel')
            .send(testPixel);
        expect(res.statusCode).toBe(401);
    });

    it('POST /api/grid/pixel - should successfully place a pixel (User)', async () => {
        const res = await request(app)
            .post('/api/grid/pixel')
            .set('Authorization', `Bearer ${userToken}`)
            .send(testPixel);
        
        expect(res.statusCode).toBe(200);
        const dbResult = await execute('SELECT color FROM pixel WHERE x_coord = $1 AND y_coord = $2', [testPixel.x, testPixel.y]);
        expect(dbResult.rows[0].color).toBe(testPixel.color);
    });
});

describe('C. ADMIN PERMISSIONS (Role Verification)', () => {

    beforeAll(async () => {
        await request(app).post('/api/grid/pixel').set('Authorization', `Bearer ${userToken}`).send(pixelToDelete);
    });

    it('DELETE /api/grid/pixel/:x/:y - should return 403 Forbidden for standard user', async () => {
        const res = await request(app)
            .delete(`/api/grid/pixel/${pixelToDelete.x}/${pixelToDelete.y}`)
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('Forbidden: Insufficient permissions');
    });

    it('DELETE /api/grid/pixel/:x/:y - should successfully delete a pixel (Admin)', async () => {
        const res = await request(app)
            .delete(`/api/grid/pixel/${pixelToDelete.x}/${pixelToDelete.y}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.statusCode).toBe(200);
        const dbResult = await execute('SELECT * FROM pixel WHERE x_coord = $1 AND y_coord = $2', [pixelToDelete.x, pixelToDelete.y]);
        expect(dbResult.rowCount).toBe(0);
    });
});

describe('D. ADVANCED SECURITY AND ERROR HANDLING', () => {
    it('DELETE /api/grid/pixel/1/1 - should return 401 with an EXPIRED token', async () => {
        const expiredToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_ACCESS_SECRET, { expiresIn: '0s' });
        
        const res = await request(app)
            .delete(`/api/grid/pixel/1/1`)
            .set('Authorization', `Bearer ${expiredToken}`);
            
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized: Invalid or expired token');
    });

    it('POST /api/grid/pixel - should return 401 if header format is incorrect (No Bearer)', async () => {
        const res = await request(app)
            .post('/api/grid/pixel')
            .set('Authorization', `InvalidToken ${userToken}`)
            .send(testPixel);
        
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized: No token provided');
    });

    it('POST /api/grid/pixel - should return 400 for invalid coordinates range (Joi)', async () => {
        const res = await request(app)
            .post('/api/grid/pixel')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ x: 1000, y: 1000, color: '#FFFFFF' });
        
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Validation failed');
    });
});

describe('E. BDD INTERACTION (SQL + NoSQL Consistency)', () => {
    it('POST /api/grid/pixel - should ensure pixel is logged in MongoDB AND updated in PostgreSQL', async () => {
        await request(app)
            .post('/api/grid/pixel')
            .set('Authorization', `Bearer ${userToken}`)
            .send(uniquePixel);

        const pgResult = await execute('SELECT color FROM pixel WHERE x_coord = $1 AND y_coord = $2', [uniquePixel.x, uniquePixel.y]);
        expect(pgResult.rows[0].color).toBe(uniquePixel.color);

        const mongoLog = await PixelLog.findOne({ x_coord: uniquePixel.x, y_coord: uniquePixel.y, color: uniquePixel.color });
        expect(mongoLog).not.toBeNull();
        expect(mongoLog.x_coord).toBe(uniquePixel.x);
    });

    it('DELETE /api/grid/pixel/:x/:y - should return 404 when pixel is not found (Admin)', async () => {
        const res = await request(app)
            .delete(`/api/grid/pixel/999/999`)
            .set('Authorization', `Bearer ${adminToken}`);
            
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Pixel not found');
    });
});