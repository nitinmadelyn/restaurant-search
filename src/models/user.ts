import mongoose from 'mongoose';
import { Password } from '../helpers/password';
import moment from 'moment';

// An interface that describes the properties
// that are required to create a new User
export interface UserAttributes {
    username: string;
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attribues: UserAttributes): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    refreshToken: string;
    resetPasswordToken: string;
    isBlocked: boolean;
    isActive: boolean;
    updatedAt: string;
    createdAt: string;
}

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: false
        },
        resetPasswordToken: {
            type: String,
            required: false
        },
        isBlocked: {
            type: Boolean,
            required: false,
            default: false
        },
        isActive: {
            type: Boolean,
            required: false,
            default: true
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
                delete ret.password;
                delete ret.isBlocked;
                delete ret.isActive;
                return ret;
            }
        }
    }
);

// Hash password before save to db
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attribues: UserAttributes) => {
    return new User(attribues);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
