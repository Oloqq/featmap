if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { Request, Response } from "express";

// Dependecies
import express from 'express';
import { AddressInfo } from "net";
import { Logger } from "../types/log";
const app = express();
const session = require('express-session');
const useragent = require('express-useragent');
const log: Logger = require('./log');

log.info('Booting up... ', Date());

// App config
app.use(express.static("public"));
app.use(useragent.express());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
}));

// Routing
app.get('/', (req: Request, res: Response)=> {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/json', (req: Request, res: Response)=> {
  res.sendFile(`${__dirname}/views/json.html`);
});

app.get('/text', (req: Request, res: Response)=> {
  res.sendFile(`${__dirname}/views/text.html`);
});

// Start the server
var listener = app.listen(process.env.PORT, () => {
  log.info(`App is listening on port ${(listener.address() as AddressInfo).port}`);
});