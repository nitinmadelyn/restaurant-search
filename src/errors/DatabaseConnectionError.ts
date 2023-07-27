import { RestaurantError } from "./RestaurantError";

export class DatabaseConnectionError extends RestaurantError {
    statusCode = 500;

    constructor() {
        super('super: Database connection error.');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return { status: false, message: 'Error connecting to database.' };
    }
}
