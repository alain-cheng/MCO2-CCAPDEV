import path from 'path';
import { fileURLToPath } from 'url';

import db from '../models/db.js';
import { Post } from '../models/schemas.js';
import { User } from '../models/schemas.js';

import home from './pages/home.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controller = {

    /*
        Use this to display the home page by sending an HTTP Get request.
        This should execute home.js
    */
    getHome: (req, res) => {
        // Send out the main layout first to display
        res.sendFile('pages/layouts/main.html', {root: __dirname});
        home.page;
    },

    getCourses: (req, res) => {

    },

    getProfs: (req, res) => {

    },

    /*
        Use this when a new user registers into the application
    */
    addUser: (req, res) => {

    },

    addPost: (req, res) => {

    },

    addCourse: (req, res) => {

    },

    removeCourse: (req, res) => {

    }
}

export default controller;