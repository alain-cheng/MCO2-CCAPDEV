import 'dotenv/config';

import express from 'express';
import exphbs from 'express-handlebars';

import { connectToMongo } from './db/conn.js';