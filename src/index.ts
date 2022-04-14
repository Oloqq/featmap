if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { Request, Response } from "express";

// Dependecies
import express from 'express';
import { AddressInfo } from "net";
const app = express();
const session = require('express-session');
const useragent = require('express-useragent');
import { log } from './log';
import fs from 'fs';

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

app.get('/art', (req: Request, res: Response)=> {
  res.sendFile(`${__dirname}/views/art.html`);
});

app.get('/featmap', (req: Request, res: Response)=> {
  let s = req.query['artist'];
  console.log(s);
  // let obj = {
  //   bruh: "yeet",
  //   masno: "gang"
  // }
  // let s = JSON.stringify(obj);

  // fs.writeFile('data/bruh.txt', 'sfa', ()=>{});

  res.send(s);
});

// Start the server
var listener = app.listen(process.env.PORT, () => {
  log.info(`App is listening on port ${(listener.address() as AddressInfo).port}`);
});

// import { token } from "../src/authorizer";
// token()