/* Routing handler */

import express from 'express';

const navRoutes = express.Router();

navRoutes.get('/', (req, res) => {
    res.redirect('/home');
});

navRoutes.get('/home', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});

navRoutes.get('/courses', (req, res) => {
    res.render('', {
       title: 'Courses' 
    });
});

navRoutes.get('/profs', (req, res) => {
    res.render('', {
       title: 'Courses' 
    });
});

export default navRoutes;