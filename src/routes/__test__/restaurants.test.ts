import request from 'supertest';
import { app } from '../../app';
import { addRestaurants } from '../../helpers/addRestaurants';

describe('Search Nearby Restaurant Tests', () => {
    it('returns 400, missing location', async () => {
        const response = await request(app)
            .get('/api/restaurants/get-nearby-restaurants');

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`location` is required.");
    });

    it('returns 400, invalid location', async () => {
        const response = await request(app)
            .get('/api/restaurants/get-nearby-restaurants?location=dummyLatLong');

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Invalid location. e.g. -74.0033,40.7336");
    });

    it('returns 400, invalid radius', async () => {
        const response = await request(app)
            .get('/api/restaurants/get-nearby-restaurants?location=-74.0033,40.7336&radius=dummy');

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("`radius` should be of type number.");
    });

    it('returns 200, list of restaurants within 1km radius', async () => {
        await addRestaurants();
        const response = await request(app)
            .get('/api/restaurants/get-nearby-restaurants?location=-74.0033,40.7336&radius=1');

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('count');
        expect(body.count).toBe(6);
    });

    it('returns 200, list of restaurants within 2km radius', async () => {
        await addRestaurants();
        const response = await request(app)
            .get('/api/restaurants/get-nearby-restaurants?location=-74.0033,40.7336&radius=2');

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('count');
        expect(body.count).toBe(13);
    });

    it('returns 200, list of restaurants within 5km radius', async () => {
        await addRestaurants();
        const response = await request(app)
            .get('/api/restaurants/get-nearby-restaurants?location=-74.0033,40.7336');

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('count');
        expect(body.count).toBe(20);
    });
});

describe('Get All Restaurant Tests', () => {
    it('returns 200, with all restaurant list', async () => {
        await addRestaurants();

        const response = await request(app)
            .get('/api/restaurants/get-all-restaurants')


        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('data');
        expect(body.data.length).toBe(20);
    });
});

describe('Delete Restaurant Tests', () => {
    it('returns 400, invalid id', async () => {
        const response = await request(app)
            .delete('/api/restaurants/delete-restaurant/testid');

        expect(response.statusCode).toBe(400);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Invalid id.");
    });

    it('returns 404, id not found', async () => {
        const response = await request(app)
            .delete('/api/restaurants/delete-restaurant/64c20ee88ec05d24b6e4c23e');

        expect(response.statusCode).toBe(404);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Restaurant not found.");
    });

    it('returns 200, restaurant deleted successfully', async () => {
        await addRestaurants();
        const restaurants: any = await request(app)
            .get('/api/restaurants/get-all-restaurants')
        const id = restaurants.body.data[0].id;

        const response = await request(app)
            .delete(`/api/restaurants/delete-restaurant/${id}`);

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body.message).toBe("Restaurant deleted successfully.");
    });
});