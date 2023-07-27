import { RestaurantError } from "./RestaurantError";

export class BadRequestError extends RestaurantError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return { status: false, message: this.message };
    }
}
