import path from 'path';
import { fileURLToPath } from 'url';

import db from '../models/db.js';
import collection from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {

    /*
        Use this to display the home page by sending an HTTP Get request.
    */
    getHome: (req, res) => {
        res.sendFile('pages/home.html', {root: __dirname});
    },

    /*
        Use this to display the courses page by sending an HTTP Get request.
    */
    getCourses: (req, res) => {
        res.sendFile('pages/courses.html', {root: __dirname});
    },

    /*
        Use this to display the profs page by sending an HTTP Get request.
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

    followCourse: (req, res) => {

    },

    unfollowCourse: (req, res) => {

    },

    likePost: (req, res) => {

    },

    unlikePost: (req, res) => {

    },

    findCourse: (req, res) => {
        db.findOne(collection[req.query['model']], {
            id: req.query['id']
        }, null, (result) => {
            console.log("findCourse success", result);
            return result;
        });
    }
}

export default controller;