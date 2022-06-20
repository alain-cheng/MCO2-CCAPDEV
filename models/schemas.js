import mongoose from 'mongoose';

// schemas
const CollegeSchema = new mongoose.Schema({
    name: { type: String },
    id: { type: String, unique: true }
});

const CourseSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    college: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    degree: { type: String, required: true },
    college: { type: CollegeSchema, required: true },
    batch: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    img: { type: String, required: true },          // image links
    followedCourses: [{ type: CourseSchema }],
    likedPosts: [{ type: Number }]                  // store post ids
});

const ProfsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    img: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    degree: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true }, //course they're currently teaching
    avgRating: { type: Number, required: true }, // average rating
    gradYear: { type: Number, required: true }, // year graduated from college
    expYears: { type: Number, required: true } // years of teaching
});

const PostSchema = new mongoose.Schema({
    profFName: { type: String, required: true },
    profLName: { type: String, required: true },
    text: { type: String, required: true },         // Post content
    course: { type: String, required: true },
    term: { type: Number, required: true },
    stars: { type: Number, required: true },        // Number of stars
    owner: { type: UserSchema, required: true },        
    id: { type: Number, required: true, index: true, unique: true } // 6 digit id, counting starts at 100001
});

// exports
export const Post = mongoose.model('posts', PostSchema);
export const User = mongoose.model('users', UserSchema);
export const Profs = mongoose.model('profs', ProfsSchema);
export const Course = mongoose.model('courses', CourseSchema);
export const College = mongoose.model('colleges', CollegeSchema);

const collection = {'posts': Post, 'users': User, 'profs': Profs, 'courses': Course, 'colleges': College };

export default collection;


