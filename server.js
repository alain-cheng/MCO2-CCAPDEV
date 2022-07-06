import 'dotenv/config';

import express from 'express';
// import exphbs from 'express-handlebars';
import routes from './routes/routes.js';
import controller from './controllers/controller.js';

import db from './models/db.js';
import collection from './models/schemas.js';

const port = process.env.PORT || 3000;

const app = express();

/*
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set("view engine", 'hbs');   
app.set('views', './views');
*/   

app.use(express.static('public'));

app.set("view cache", false);                           // disable caching

app.use('/', routes);
//routes.use('/fillDB', controller.fillDB);                  // Generate sample data
//app.use('fillDB', controller.fillDB);

db.connect();
console.log("Connected to database");

app.listen(port, () => {
    console.log('Server is running at port:', port);
});

/*========================================================*/
/* Sample Data*/
/* This will be the sample data to be used for all testing.
/*========================================================*/

await collection["colleges"].deleteMany();
await collection["courses"].deleteMany();
await collection["posts"].deleteMany();
await collection["profs"].deleteMany();
await collection["users"].deleteMany();

// Sample Users - fill up at least 4 more sample users
await collection['users'].create({
    firstName: "Sarah",
    lastName: "Parker",
    degree: "AB Literature",
    degreeCode: "ABLIT",
    college: "College of Liberal Arts",
    batch: "118",
    username: "Sarah Parker",
    password: "12345",
    img: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    followedCourses: ["GEUSELF", "POLGOVT"],
    likedPosts: ['1201', '1202']
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        //console.log("User Sarah Parker saved to database")
    }
});
await collection['users'].create({
    firstName: "Gerald",
    lastName: "Velasco",
    degree: "AB Literature",
    degreeCode: "ABLIT",
    college: "College of Computer Studies",
    batch: "119",
    username: "Gerald Velasco",
    password: "12345",
    img: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    followedCourses: ["CCAPDEV"],
    likedPosts: ['']
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        //console.log("User Gerald Velasco saved to database")
    }
});

/* TODO */
// Sample Posts - fill up at least 3 more posts
await collection['posts'].create({
    id: '1201',
    reviewForFN: "Nicole",
    reviewForLN: "Zefanya",
    reviewCourse: "GEUSELF",
    reviewTerm: "Term 2",
    reviewRating: 5,
    reviewText: "Prof is entertaining",
    posterNameFN: "Elliot",
    posterNameLN: "Alderson",
    posterPfp: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    posterDegCode: "BSCS",
    posterCollege: "College of Computer Studies",
    likesNum: 3,
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        //console.log("Post 1201 saved to database");
    }
});
await collection['posts'].create({
    id: '1202',
    reviewForFN: "Hwang",
    reviewForLN: "Yeji",
    reviewCourse: "POLGOVT",
    reviewTerm: "Term 2",
    reviewRating: 5,
    reviewText: "Heavy workload but her teaching makes it very easy to accomplish",
    posterNameFN: "John",
    posterNameLN: "Dela Rosa",
    posterPfp: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    posterDegCode: "ABPOM",
    posterCollege: "College of Liberal Arts",
    likesNum: 3,
}).then((err) => {
    if (err) {
        //console.log(err);
        return;
    }
    else {
        //console.log("Post 1202 saved to database");
    }
});
await collection['posts'].create({
    id: '1203',
    reviewForFN: "Nicole",
    reviewForLN: "Zefanya",
    reviewCourse: "GEUSELF",
    reviewTerm: "Term 2",
    reviewRating: 4,
    reviewText: "She often gives essays as assignments which are easy to do if you just listen to her lectures.",
    posterNameFN: "Sarah",
    posterNameLN: "Parker",
    posterPfp: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    posterDegCode: "ABLIT",
    posterCollege: "College of Liberal Arts",
    likesNum: 3,
}).then((err) => {
    if (err) {
        //console.log(err);
        return;
    }
    else {
        //console.log("Post 1203 saved to database");
    }
});
await collection['posts'].create({
    id: '1204',
    reviewForFN: "Artemis",
    reviewForLN: "Celestial",
    reviewCourse: "CCAPDEV",
    reviewTerm: "Term 3",
    reviewRating: 5,
    reviewText: "Her teaching style is really well thought out, I can say she is a very considerate professor. Easily approachable if you have any concerns related to the course and will most of the time give you an answer you will be satisfied with or are looking for.",
    posterNameFN: "Gerald",
    posterNameLN: "Velasco",
    posterPfp: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    posterDegCode: "BSCS",
    posterCollege: "College of Computer Studies",
    likesNum: 27,
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        //console.log("Post 1204 saved to database");
    }
});
await collection['posts'].create({
    id: '1205',
    reviewForFN: "Choi",
    reviewForLN: "Jisu",
    reviewCourse: "KEMPRN1",
    reviewTerm: "Term 1",
    reviewRating: 2,
    reviewText: "I think there is still a lot of improvements needed, I think they are fine but not great either, atleast not the worst.",
    posterNameFN: "Jose",
    posterNameLN: "Magalang",
    posterPfp: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    posterDegCode: "BSC",
    posterCollege: "College of Science",
    likesNum: 1,
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        //console.log("Post 1205 saved to database");
    }
});

// Sample Profs - there are 8 profs for each of the 8 courses in the database
await collection['profs'].create({
    firstName: "Hwang",
    lastName: "Yeji",
    img: "https://kpopping.com/documents/91/4/1500/220411-ITZY-Yeji1st-Fanmeeting-Photoshoot-by-Dispatch-documents-1.jpeg?v=52dbc",
    position: "Assisant Prof. Lecturer",
    department: "Political Science",
    degree: "AB Political Science",
    college: "De La Salle University",
    course: "POLGOVT",
    avgRating: 4.5,
    gradYear: 2015,
    expYears: 2
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Hwang Yeji saved to database");
});
await collection['profs'].create({
    firstName: "Choi",
    lastName: "Jisu",
    img: "https://i.pinimg.com/736x/45/48/db/4548db5f7f80e5abcf0ad638b6d80f18.jpg",
    position: "Associate Professor",
    department: "Chemistry",
    degree: "BS Chemistry",
    college: "De La Salle University",
    course: "KEMPRN1",
    avgRating: 4.2,
    gradYear: 2016,
    expYears: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Choi Jisu saved to database");
});
await collection['profs'].create({
    firstName: "Lee",
    lastName: "Chaeryeong",
    img: "https://i.mydramalist.com/wRvyN_5f.jpg",
    position: "Lecturer",
    department: "Engineering",
    degree: "MS Mechanical Engineering",
    college: "De La Salle University",
    course: "GRAPONE",
    avgRating: 4.3,
    gradYear: 2017,
    expYears: 2 
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Lee Chaeryeong saved to database");
})
await collection['profs'].create({
    firstName: "Shin",
    lastName: "Ryujin",
    img: "https://i.pinimg.com/736x/a0/12/53/a0125307be33e84f2446e16df7781c59.jpg",
    position: "Lecturer",
    department: "Accountancy",
    degree: "BS Accountancy",
    college: "De La salle University",
    course: "FDNACCT",
    avgRating: 4.6,
    gradYear: 2017,
    expYears: 1
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Shin Ryujin saved to database");
});
await collection['profs'].create({
    firstName: "Shin",
    lastName: "Yuna",
    img: "https://i.mydramalist.com/2V2Zk_5f.jpg",
    position: "Associate Professor",
    department: "Economics",
    degree: "BS Applied Economics",
    college: "De La Salle University",
    course: "ECONONE",
    avgRating: 4.3,
    gradYear: 2018,
    expYears: 1
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Shin Yuna saved to database");
});
await collection['profs'].create({
    firstName: "George",
    lastName: "Miller",
    img: "https://miro.medium.com/max/500/1*WayO-bj4vW59rCNrkSbjTg.jpeg",
    position: "Lecturer",
    department: "English",
    degree: "BS Secondary Education",
    college: "De La Salle University",
    course: "ENGLCOM",
    avgRating: 4.1,
    gradYear: 2013,
    expYears: 5
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. George Miller saved to database");
});
await collection['profs'].create({
    firstName: "Brian",
    lastName: "Soewarno",
    img: "https://upload.wikimedia.org/wikipedia/en/c/c6/Amen_RichBrian.jpg",
    position: "Lecturer",
    department: "Software Technology",
    degree: "BS Computer Science",
    college: "De La Salle University",
    course: "CCAPDEV",
    avgRating: 4.0,
    gradYear: 2017,
    expYears: 1
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Brian Soewarno saved to database");
});
await collection['profs'].create({
    firstName: "Nicole",
    lastName: "Zefanya",
    img: "https://pbs.twimg.com/profile_images/1515733643368415232/uFPui6Do_400x400.jpg",
    position: "Lecturer",
    department: "General Education",
    degree: "BS Psychology",
    college: "De La Salle University",
    course: "GEUSELF",
    avgRating: 4.5,
    gradYear: 2016,
    expYears: 2
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Nicole Zefanya saved to database");
})
await collection['profs'].create({
    firstName: "Artemis",
    lastName: "Celestial",
    img: "https://pbs.twimg.com/profile_images/1515733643368415232/uFPui6Do_400x400.jpg",
    position: "Lecturer",
    department: "Software Technology",
    degree: "BS Computer Science",
    college: "De La Salle University",
    course: "CCAPDEV",
    avgRating: 4.9,
    gradYear: 2017,
    expYears: 1
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Prof. Artemis Celestial saved to database");
});

// Sample Colleges - there are 7 main colleges in DLSU and they are assigned their respective IDs;
//                   GE is considered its own college for this website
await collection['colleges'].create({
    collegename: "College of Liberal Arts",
    name: "CLA",
    id: 1
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
});
await collection['colleges'].create({
    collegename: "College of Computer Studies",
    name: "COS",
    id: 2
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
});
await collection['colleges'].create({
    collegename: "Gokongwei College of Engineering",
    name: "GCOE",
    id: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
})
await collection['colleges'].create({
    collegename: "Ramon V. Del Rosario College of Business",
    name: "RVCOB",
    id: 4
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
})
await collection['colleges'].create({
    collegename: "School of Economics",
    name: "SOE",
    id: 5
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
});
await collection['colleges'].create({
    collegename: "Brother Andrew Gonzalez College of Education",
    name: "BAGCED",
    id: 6
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
})
await collection['colleges'].create({
    collegename: "College of Computer Studies",
    name: "CCS",
    id: 7
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("College 1 saved to database");
});

// Sample Courses - there are 8 sample courses; 7 courses (for 7 colleges) + 1 GE course
await collection['courses'].create({
    coursename: "Philippine Politics and Government",
    coursecode: "POLGOVT",
    collegeid: 1,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 1 saved to database");
});
await collection['courses'].create({
    coursename: "Principles of Chemistry 1",
    coursecode: "KEMPRN1",
    collegeid: 2,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 2 saved to database");
});
await collection['courses'].create({
    coursename: "Engineering Graphics 1",
    coursecode: "GRAPONE",
    collegeid: 3,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 3 saved to database");
});
await collection['courses'].create({
    coursename: "Fundamentals of Accountancy, Business, and Management",
    coursecode: "FDNACCT",
    collegeid: 4,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 4 saved to database");
});
await collection['courses'].create({
    coursename: "Basic Microeconomics",
    coursecode: "ECONONE",
    collegeid: 5,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 5 saved to database");
});
await collection['courses'].create({
    coursename: "Basic Communication and Study Skills",
    coursecode: "ENGLCOM",
    collegeid: 6,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 6 saved to database");
});
await collection['courses'].create({
    coursename: "Web Application Development",
    coursecode: "CCAPDEV",
    collegeid: 7,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 7 saved to database");
});
await collection['courses'].create({
    coursename: "Understanding the Self",
    coursecode: "GEUSELF",
    collegeid: 8,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 8 saved to database");
});
await collection['courses'].create({
    coursename: "Readings in Philippine History",
    coursecode: "GERPHIS",
    collegeid: 8,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 9 saved to database");
});
await collection['courses'].create({
    coursename: "The Contemporary World",
    coursecode: "GEWORLD",
    collegeid: 8,
    units: 3
}).then((err) => {
    if (err) {
        console.log(err);
        return;
    }
    //console.log("Course 10 saved to database");
});

/*========================================================*/
/* END OF SAMPLE DATA */
/*========================================================*/