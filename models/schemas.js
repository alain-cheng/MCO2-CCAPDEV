import mongoose from 'mongoose';

// schemas
const PostSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    degree: { type: String, required: true },
    college: { type: String, required: true },
    batch: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    img: { type: String, required: true },          // image links
    followedCourses: { type: Number },              // Store course ids
    likedPosts: { type: Number }                    // Store post ids
});

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    collegeid: { type: Number, required: true }
});

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: Number, required: true }
});

// exports
export const Post = mongoose.model('posts', PostSchema);
export const User = mongoose.model('users', UserSchema);
export const Course = mongoose.model('courses', UserSchema);
export const College = mongoose.model('colleges', UserSchema);

const collection = {'posts': Post, 'users': User, 'courses': Course, 'colleges': College };

export default collection;


