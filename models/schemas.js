import mongoose from 'mongoose';

// schemas
const PostSchema = new mongoose.Schema({
    profFName: { type: String, required: true },
    profLName: { type: String, required: true },
    text: { type: String, required: true },         // Post content
    course: { type: String, required: true },
    term: { type: Number, required: true },
    stars: { type: Number, required: true },        // Number of stars
    owner: { type: String, required: true },        // Username
    id: { type: Number, required: true, index: true, unique: true } // 6 digit id, counting starts at 100001
});

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    degree: { type: String, required: true },
    college: { type: String, required: true },
    batch: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    img: { type: String, required: true },          // image links
    followedCourses: { type: Number },              // Store course ids
    likedPosts: { type: Number }                    // Store post ids
});

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    collegeid: { type: String, required: true }
});

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true }
});

// exports
export const Post = mongoose.model('posts', PostSchema);
export const User = mongoose.model('users', UserSchema);
export const Course = mongoose.model('courses', CourseSchema);
export const College = mongoose.model('colleges', CollegeSchema);

const collection = {'posts': Post, 'users': User, 'courses': Course, 'colleges': College };

export default collection;


