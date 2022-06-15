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

// Create default documents for testing
collection['users'].insertMany([
    {
        firstName: 'Harley',
        lastName: 'Davis',
        degree: 'BSCS',
        college: 'College of Computer Studies',
        batch: 'ID 120',
        username: 'HDavis',
        password: 'user1',
        img: '/img/user1.jpg'
    },
    {
        firstName: 'Sarah',
        lastName: 'Parker',
        degree: 'BSCS',
        college: 'College of Computer Studies',
        batch: 'ID 119',
        username: 'Sarah',
        password: 'user2',
        img: '/img/user2.jpg'
    },
    {
        firstName: 'Amy',
        lastName: 'Bougainvillea',
        degree: 'BSCS',
        college: 'College of Computer Studies',
        batch: 'ID 120',
        username: 'Amivillea',
        password: 'user3',
        img: '/img/user3.jpg'
    },
    {
        firstName: 'Lance',
        lastName: 'Mendoza',
        degree: 'BSCS',
        college: 'College of Computer Studies',
        batch: 'ID 12',
        username: 'LanDoza',
        password: 'user4',
        img: '/img/user4.jpg'
    },
    {
        firstName: 'Mad',
        lastName: 'Scientist',
        degree: 'BSBC',
        college: 'College of Science',
        batch: 'ID 118',
        username: 'MaddoScientisto',
        password: 'user5',
        img: '/img/empty-profile-pic.jpeg'
    }
], (err, res) => {
    if(err) console.log('Insert error occured for Users, possible duplicates');
    else console.log('User Data Added');
});

collection['courses'].insertMany([
    {
        name: 'CCPROG',
        collegeid: 'CCS'
    },
    {
        name: 'CCPROG2',
        collegeid: 'CCS'
    },
    {
        name: 'CCDSTRU',
        collegeid: 'CCS'
    },
    {
        name: 'CSINTSY',
        collegeid: 'CCS'
    },
    {
        name: 'KEMPSY1',
        collegeid: 'COS'
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

collection['posts'].insertMany([
    {
        profFName: 'Porter',
        profLName: 'Newman',
        text: 'Prof is entertaining, also grades high, strongly recommend!',
        course: 'CCPROG',
        term: 2,
        stars: 5,
        owner: 'Sarah',
        id: 100001
    },
    {
        profFName: 'Henry',
        profLName: 'Ford',
        text: 'Very good lectures, always late tho but still recommend',
        course: 'CCDSTRU',
        term: 1,
        stars: 4,
        owner: 'Amivillea',
        id: 100002
    },
    {
        profFName: 'Farah',
        profLName: 'Boeing',
        text: 'Their internet is slow lol, but alright overall',
        course: 'CCPROG2',
        term: 2,
        stars: 3,
        owner: 'Amivillea',
        id: 100003
    },
    {
        profFName: 'Jack',
        profLName: 'Frost',
        text: 'Gives a lot of assignments, but good prof, thats my only complaint',
        course: 'CCPROG',
        term: 1,
        stars: 4,
        owner: 'LanDoza',
        id: 100004
    },
    {
        profFName: 'Albert',
        profLName: 'Einstein',
        text: 'The chem laboratory blew up because of them but they teach great',
        course: 'KEMPSY1',
        term: 1,
        stars: 5,
        owner: 'MaddoScientisto',
        id: 100005
    }
], (err, res) => {
    if(err) console.log('Insert error occured for Posts, possible duplicates');
    else console.log('Post Data Added');
});