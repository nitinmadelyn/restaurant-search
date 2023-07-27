export abstract class RestaurantError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, RestaurantError.prototype);
    }

    abstract serializeErrors(): {
        status: boolean;
        data?: object;
        message?: string;
    };
}
