import 'dotenv/config';

import express from 'express';
// import exphbs from 'express-handlebars';
import routes from './routes/routes.js'
import db from './models/db.js';
import collection from './models/schemas.js';

const port = process.env.SERVER_PORT;

const app = express();

/*
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set("view engine", 'hbs');   
app.set('views', './views');
*/   

app.use(express.static('public'));

app.set("view cache", false);                           // disable caching

app.use('/', routes);

db.connect();

app.listen(port, () => {
    console.log('Server is running at:');
    console.log('http://localhost:' + port);
})

// Generate Sample Data
/*
collection['courses'].insertMany([
    {
        name: 'CCPROG',
        college: 'CCS'
    },
    {
        name: 'CCPROG2',
        college: 'CCS'
    },
    {
        name: 'CCDSTRU',
        college: 'CCS'
    },
    {
        name: 'CSINTSY',
        college: 'CCS'
    },
    {
        name: 'KEMPSY1',
        college: 'COS'
    }
], (err, res) => {
    if(err) console.log('Insert error occured for Courses, possible duplicates');
    else console.log('Course Data Added');
});

collection['colleges'].insertMany([
    {
        name: 'College of Computer Studies',
        id: 'CCS'
    },
    {
        name: 'College of Science',
        id: 'COS'
    }
], (err, res) => {
    if(err) console.log('Insert error occured for Colleges, possible duplicates');
    else console.log('College Data Added');
});

collection['users'].insertMany([
    {
        firstName: 'Harley',
        lastName: 'Davis',
        degree: 'BSCS',
        college: { name: 'College of Computer Studies', id: 'CCS'},
        batch: 'ID 120',
        username: 'HDavis',
        password: 'user1',
        img: '/img/user1.jpg',
        followedCourses: [{ name: 'CCPROG', college: 'CCS' }, { name: 'CSINTSY', college: 'CCS' }],
        likedPosts: [100001]
    },
    {
        firstName: 'Sarah',
        lastName: 'Parker',
        degree: 'BSCS',
        college: { name: 'College of Computer Studies', id: 'CCS'},
        batch: 'ID 119',
        username: 'Sarah',
        password: 'user2',
        img: '/img/user2.jpg'
    },
    {
        firstName: 'Amy',
        lastName: 'Bougainvillea',
        degree: 'BSCS',
        college: { name: 'College of Computer Studies', id: 'CCS'},
        batch: 'ID 120',
        username: 'Amivillea',
        password: 'user3',
        img: '/img/user3.jpg'
    },
    {
        firstName: 'Lance',
        lastName: 'Mendoza',
        degree: 'BSCS',
        college: { name: 'College of Computer Studies', id: 'CCS'},
        batch: 'ID 12',
        username: 'LanDoza',
        password: 'user4',
        img: '/img/user4.jpg'
    },
    {
        firstName: 'Mad',
        lastName: 'Scientist',
        degree: 'BSBC',
        college: { name: 'College of Science', id: 'COS'},
        batch: 'ID 118',
        username: 'MaddoScientisto',
        password: 'user5',
        img: '/img/empty-profile-pic.jpeg'
    }
], (err, res) => {
    if(err) console.log('Insert error occured for Users, possible duplicates');
    else console.log('User Data Added');
});

collection['posts'].insertMany([
    {
        profFName: 'Porter',
        profLName: 'Newman',
        text: 'Prof is entertaining, also grades high, strongly recommend!',
        course: 'CCPROG',
        term: 2,
        stars: 5,
        owner: { 
            firstName: 'Sarah',
            lastName: 'Parker',
            degree: 'BSCS',
            college: { name: 'College of Computer Studies', id: 'CCS'},
            batch: 'ID 119',
            username: 'Sarah',
            password: 'user2',
            img: '/img/user2.jpg' 
        },
        id: 100001
    },
    {
        profFName: 'Henry',
        profLName: 'Ford',
        text: 'Very good lectures, always late tho but still recommend',
        course: 'CCDSTRU',
        term: 1,
        stars: 4,
        owner: {
            firstName: 'Amy',
            lastName: 'Bougainvillea',
            degree: 'BSCS',
            college: { name: 'College of Computer Studies', id: 'CCS'},
            batch: 'ID 120',
            username: 'Amivillea',
            password: 'user3',
            img: '/img/user3.jpg'
        },
        id: 100002
    },
    {
        profFName: 'Farah',
        profLName: 'Boeing',
        text: 'Their internet is slow lol, but alright overall',
        course: 'CCPROG2',
        term: 2,
        stars: 3,
        owner: {
            firstName: 'Amy',
            lastName: 'Bougainvillea',
            degree: 'BSCS',
            college: { name: 'College of Computer Studies', id: 'CCS'},
            batch: 'ID 120',
            username: 'Amivillea',
            password: 'user3',
            img: '/img/user3.jpg'
        },
        id: 100003
    },
    {
        profFName: 'Jack',
        profLName: 'Frost',
        text: 'Gives a lot of assignments, but good prof, thats my only complaint',
        course: 'CCPROG',
        term: 1,
        stars: 4,
        owner: {
            firstName: 'Lance',
            lastName: 'Mendoza',
            degree: 'BSCS',
            college: { name: 'College of Computer Studies', id: 'CCS'},
            batch: 'ID 12',
            username: 'LanDoza',
            password: 'user4',
            img: '/img/user4.jpg'
        },
        id: 100004
    },
    {
        profFName: 'Albert',
        profLName: 'Einstein',
        text: 'The chem laboratory blew up because of them but they teach great',
        course: 'KEMPSY1',
        term: 1,
        stars: 5,
        owner: {
            firstName: 'Mad',
            lastName: 'Scientist',
            degree: 'BSBC',
            college: { name: 'College of Science', id: 'COS'},
            batch: 'ID 118',
            username: 'MaddoScientisto',
            password: 'user5',
            img: '/img/empty-profile-pic.jpeg'
        },
        id: 100005
    }
], (err, res) => {
    if(err) console.log('Insert error occured for Posts, possible duplicates');
    else console.log('Post Data Added');
});
*/

/*========================================================*/
/* Sample Data*/
/* This will be the sample data to be used for all testing.
/*  Un-comment this when it's your first time running this code.
/*  Afterwards, comment it again to prevent data duplication.
/*========================================================*/

// NOTE: for some reason, the console.logs of all code below don't work for some reason but the data is added to the database when you check MongoDBCompass

/* TODO */
// Sample Users - fill up at least 4 more sample users
collection['users'].create({
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
    likedPosts: [1201, 1202]
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log("User Sarah Parker saved to database")
    }
}

/* TODO */
// Sample Posts - fill up at least 3 more posts
collection['posts'].create({
    id: 1201,
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log("Post 1201 saved to database");
    }
}
collection['posts'].create({
    id: 1202,
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log("Post 1201 saved to database");
    }
}
collection['posts'].create({
    id: 1203,
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log("Post 1201 saved to database");
    }
}

// Sample Profs - there are 8 profs for each of the 8 courses in the database
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Hwang Yeji saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Choi Jisu saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Lee Chaeryeong saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Shin Ryujin saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Shin Yuna saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. George Miller saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Brian Soewarno saved to database");
}
collection['profs'].create({
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
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Prof. Nicole Zefanya saved to database");
}

// Sample Colleges - there are 7 main colleges in DLSU and they are assigned their respective IDs;
//                   GE is considered its own college for this website
collection['colleges'].create({
    collegename: "College of Liberal Arts",
    name: "CLA",
    id: 1
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}
collection['colleges'].create({
    collegename: "College of Computer Studies",
    name: "COS",
    id: 2
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}
collection['colleges'].create({
    collegename: "Gokongwei College of Engineering",
    name: "GCOE",
    id: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}
collection['colleges'].create({
    collegename: "Ramon V. Del Rosario College of Business",
    name: "RVCOB",
    id: 4
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}
collection['colleges'].create({
    collegename: "School of Economics",
    name: "SOE",
    id: 5
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}
collection['colleges'].create({
    collegename: "Brother Andrew Gonzalez College of Education",
    name: "BAGCED",
    id: 6
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}
collection['colleges'].create({
    collegename: "College of Computer Studies",
    name: "CCS",
    id: 7
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("College 1 saved to database");
}

// Sample Courses - there are 8 sample courses; 7 courses (for 7 colleges) + 1 GE course
collection['courses'].create({
    coursename: "Philippine Politics and Government",
    coursecode: "POLGOVT",
    collegeid: 1,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 1 saved to database");
}
collection['courses'].create({
    coursename: "Principles of Chemistry 1",
    coursecode: "KEMPRN1",
    collegeid: 2,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 2 saved to database");
}
collection['courses'].create({
    coursename: "Engineering Graphics 1",
    coursecode: "GRAPONE",
    collegeid: 3,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 3 saved to database");
}
collection['courses'].create({
    coursename: "Fundamentals of Accountancy, Business, and Management",
    coursecode: "FDNACCT",
    collegeid: 4,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 4 saved to database");
}
collection['courses'].create({
    coursename: "Basic Microeconomics",
    coursecode: "ECONONE",
    collegeid: 5,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 5 saved to database");
}
collection['courses'].create({
    coursename: "Basic Communication and Study Skills",
    coursecode: "ENGLCOM",
    collegeid: 6,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 6 saved to database");
}
collection['courses'].create({
    coursename: "Web Application Development",
    coursecode: "CCAPDEV",
    collegeid: 7,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 7 saved to database");
}
collection['courses'].create({
    coursename: "Understanding the Self",
    coursecode: "GEUSELF",
    collegeid: 8,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 8 saved to database");
}
collection['courses'].create({
    coursename: "Readings in Philippine History",
    coursecode: "GERPHIS",
    collegeid: 8,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 9 saved to database");
}
collection['courses'].create({
    coursename: "The Contemporary World",
    coursecode: "GEWORLD",
    collegeid: 8,
    units: 3
}), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Course 10 saved to database");
}

// remove "/*" to uncomment

/*========================================================*/
/* END OF SAMPLE DATA */
/*========================================================*/
