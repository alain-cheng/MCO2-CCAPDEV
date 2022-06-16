import path from 'path';
import { fileURLToPath } from 'url';

import db from '../models/db.js';
import collection from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {

    /*
        Use this to display the home.html page by sending an HTTP GET.
    */
    getHome: (req, res) => {
        res.sendFile('pages/home.html', {root: __dirname});
    },

    /*
        Use this to display the courses.html page by sending an HTTP GET.
        Not to be confused with findCourses function.
    */
    getCourses: (req, res) => {
        res.sendFile('pages/courses.html', {root: __dirname});
    },

    /*
        Use this to display the profs.html page by sending an HTTP GET.
    */
    getProfs: (req, res) => {
        res.sendFile('pages/profs.html', {root: __dirname});
    },

    /*
        Use this when a new user registers into the application.
        Use HTTP POST method.
    */
    addUser: (req, res) => {

    },

    /*
        Use when submitting a post review.
        Use HTTP POST method 
    */
    addPost: (req, res) => {

    },

    /*
        Use when user presses the follow button on a course.
        Use HTTP GET method.
        Same goes for unfollowCourse function.
    */
    followCourse: (req, res) => {

    },

    unfollowCourse: (req, res) => {

    },

    /*
        Use when user presses the like button on a post
        Use HTTP GET method
        Same goes for unlikePost function.
    */
    likePost: (req, res) => {

    },

    unlikePost: (req, res) => {

    },

    /*=====================================================*/
    /*   Functions below to retrieve documents from the db.
    /*   Responds with document objects.
    /*   Use HTTP GET requests for funcs below.
    /*=====================================================*/

    /* Use to find a course; Uses college to find*/
    findCourse: (req, res) => {
        db.findOne(collection['courses'], {
            college: req.query['college']
        }, req.query['projection'], (result) => {
            //console.log("findCourse result", result);
            res.send(result);                           // Sends the course document found as a response                    
        });
    },

    /* Plural version of findCourse; Uses college to find */
    findCourses: (req, res) => {
        db.findMany(collection['courses'], {
            college: req.query['college']
        }, req.query['projection'], (result) => {
            //console.log("findCourses result", result);
            res.send(result);
        });
    },

    /* Find a college; Uses id to find */
    findCollege: (req, res) => {
        db.findOne(collection['colleges'], {
            id: req.query['id']
        }, req.query['projection'], (result) => {
            //console.log("findCollege result", result);
            res.send(result);
        });
    },

    /* Find colleges; Uses id to find */
    findColleges: (req, res) => {
        db.findMany(collection['colleges'], {
            id: req.query['id']
        }, req.query['projection'], (result) => {
            //console.log("findColleges result", result);
            res.send(result);
        });
    },

    /* 
        Find a user; Uses username and password to find
        Use this for logging in.
    */
    findUser: (req, res) => {
        db.findOne(collection['users'], {
            username: req.query['username'],
            password: req.query['password']
        }, req.query['projection'], (result) => {
            //console.log("findUser result", result);
            res.send(result);
        });
    },

    /* Find users; Uses username to find */
    findUsers: (req, res) => {
        db.findMany(collection['users'], {
            username: req.query['username']
        }, req.query['projection'], (result) => {
            //console.log("findUsers result", result);
            res.send(result);
        });
    },
    
    /* Find a post; Uses id to find */
    findPost: (req, res) => {
        db.findOne(collection['posts'], {
            id: req.query['id']
        }, req.query['projection'], (result) => {
            //console.log("findPost result", result);
            res.send(result);
        });
    },

    findPosts: (req, res) => {
        db.findOne(collection['posts'], {
            id: req.query['id']
        }, req.query['projection'], (result) => {
            //console.log("findPosts result", result);
            res.send(result);
        });
    }
}

export default controller;