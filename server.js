import 'dotenv/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import exphbs from 'express-handlebars';

import { connectToMongo } from './db/conn.js';

const __dirname = dirname(fileURLToPath(import.meta.url));