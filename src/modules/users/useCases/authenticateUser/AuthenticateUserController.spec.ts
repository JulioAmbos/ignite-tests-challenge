import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createDbConnection from '../../../../database';

let connection: Connection;

describe('Authenticate User Controller', () => {
    beforeAll(async () => {
        connection = await createDbConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('Should be able to authenticate a user', async () => {
        const user = await request(app).post('/api/v1/users').send({
            name: 'User test',
            email: 'user@email.com',
            password: '1234'
        });

        const response = await request(app).post('/api/v1/sessions').send({
            email: 'user@email.com',
            password: '1234'
        });

        expect(response.body).toHaveProperty('token');
    })
})