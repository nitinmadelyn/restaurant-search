import { Restaurant } from "../models/restaurant";
import { restaurants } from "../config/static";

export const addRestaurants = async () => {
    const restaurantCount = await Restaurant.countDocuments({});
    if (restaurantCount === 0) {
        await Restaurant.insertMany(restaurants);
    }
}