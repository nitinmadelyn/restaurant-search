import mongoose from 'mongoose';
import moment from 'moment';

// An interface that describes the properties
// that are required to create a new Restaurant
export interface RestaurantAttributes {
    name: string;
    address: string;
    cuisine: string;
    location: object;
}

// An interface that describes the properties
// that a Restaurant Model has
interface RestaurantModel extends mongoose.Model<RestaurantDoc> {
    build(attribues: RestaurantAttributes): RestaurantDoc;
}

// An interface that describes the properties
// that a Restaurant Document has
interface RestaurantDoc extends mongoose.Document {
    name: string;
    address: string;
    cuisine: string;
    location: object;
    updatedAt: string;
    createdAt: string;
}

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        cuisine: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        updatedAt: {
            type: Number,
            required: false,
            default: () => moment.utc().unix()
        },
        createdAt: {
            type: Number,
            required: false,
            default: () => moment.utc().unix()
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

restaurantSchema.index({ location: '2dsphere' });

restaurantSchema.statics.build = (attribues: RestaurantAttributes) => {
    return new Restaurant(attribues);
};

const Restaurant = mongoose.model<RestaurantDoc, RestaurantModel>('Restaurant', restaurantSchema);

const findRestaurants = async (long: number, lat: number, radiusInKm: number) => {
    const radiusInRadian = radiusInKm / 6371; // Earth's radius in km
    const restaurants = await Restaurant.find({
        location: {
            $geoWithin: {
                $centerSphere: [[long, lat], radiusInRadian]
            }
        }
    });
    return restaurants;
};

export { Restaurant, findRestaurants };
