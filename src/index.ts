if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { log } from './log';
import { Request, Response } from "express";
import express from 'express';
const app = express();
const session = require('express-session');
const useragent = require('express-useragent');

import { AddressInfo } from "net";

import { Spotify } from "../src/Spotify";
if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET) {
  throw new Error('Missing SPOTIFY_ID or SPOTIFY_SECRET environement variable');
}
const spotify = new Spotify(process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET);

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