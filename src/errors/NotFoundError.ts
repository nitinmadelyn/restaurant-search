import { RestaurantError } from "./RestaurantError";

export class NotFoundError extends RestaurantError {
    statusCode = 404;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return { status: false, message: this.message };
    }
}
