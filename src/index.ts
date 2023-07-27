import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from './errors/DatabaseConnectionError';
import { addRestaurants } from './helpers/addRestaurants';

const connectDB = async () => {
    console.log("Starting server...");
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to db');

    } catch (err) {
        throw new DatabaseConnectionError();
    }

    // insert dummy restaurants data to mongoDB
    await addRestaurants();
};

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

connectDB();
