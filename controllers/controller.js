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

    /* Use to find a course */
    findCourse: (req, res) => {
        db.findOne(collection['courses'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findCourse result", result);
            res.send(result);                           // Sends the course document found as a response                    
        });
    },

    /* Plural version of findCourse */
    findCourses: (req, res) => {
        db.findMany(collection['courses'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findCourses result", result);
            res.send(result);
        });
    },

    /* Find a college */
    findCollege: (req, res) => {
        db.findOne(collection['colleges'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findCollege result", result);
            res.send(result);
        });
    },

    /* Find colleges */
    findColleges: (req, res) => {
        db.findMany(collection['colleges'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findColleges result", result);
            res.send(result);
        });
    },

    /* 
        Find a user; Use this for logging in.
    */
    findUser: (req, res) => {
        db.findOne(collection['users'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findUser result", result);
            res.send(result);
        });
    },

    /* Find multiple users*/
    findUsers: (req, res) => {
        db.findMany(collection['users'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findUsers result", result);
            res.send(result);
        });
    },
    
    /* Find a post */
    findPost: (req, res) => {
        db.findOne(collection['posts'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findPost result", result);
            res.send(result);
        });
    },

    findPosts: (req, res) => {
        db.findMany(collection['posts'], req.query['filter'], req.query['projection'], (result) => {
            //console.log("findPosts result", result);
            res.send(result);
        });
    }
}

export default controller;