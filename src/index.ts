if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { log } from './log';
import { Request, Response } from "express";
import express from 'express';
import { AddressInfo } from "net";
import { Spotify } from "../src/Spotify";
import { extractId } from '../src/extractId';
import { Collaborations } from "../src/Collaborations";
import { LinkEntry, NodeEntry } from '../types/graph';
import fs from "fs";
import path from 'path';
import { Grapher } from "./Grapher";

const app = express();
const session = require('express-session');
const useragent = require('express-useragent');

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.get('/tmp', (req: Request, res: Response) => {
  // res.render('graph', {data: JSON.stringify({a: 2})});
  // let data = JSON.stringify(JSON.parse(fs.readFileSync("public/szpaku.json").toString()));
  // res.render('graph', {data});
  res.sendFile(`${__dirname}/views/json.html`);
});

app.post('/gimmedata', (req: Request, res: Response)=> {
  let kacp = fs.readFileSync(`${__dirname}/../data/Kacperczyk.json`);
  res.send(kacp);
})

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

app.get('/featmap', (req: Request, res: Response)=> {
  let input_id = req.query['artist'];
  if (input_id) {
    input_id = input_id.toString();
    let id = extractId.fromAny(input_id);
    let g = new Grapher(spotify);
    g.graph(id).then((data) => {
      res.render('graph', {data: JSON.stringify(data)});
    });
  }
});

// Start the server
var listener = app.listen(process.env.PORT, () => {
  log.info(`App is listening on port ${(listener.address() as AddressInfo).port}`);
});

// (async () => {
//   log.info('bruh');
//   log.info(await spotify.getTracksFromAlbum('7nySql4UFcZP60opHqnAMv'));
// })();