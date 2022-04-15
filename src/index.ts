if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { log } from './log';
import { Request, Response } from "express";
import express from 'express';
import { AddressInfo } from "net";
import { Spotify } from "../src/Spotify";
import { extractId } from '../src/extractId';
import { AlbumTracksFromJSON, Collaborations } from "../src/Collaborations";
import { LinkEntry, NodeEntry } from '../types/tracklist';
import fs from "fs";
import path from 'path';

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
  let data = JSON.stringify(JSON.parse(fs.readFileSync("public/szpaku.json").toString()));
  console.log(data)
  res.render('graph', {data});
});

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
  let input_id = req.query['artist'];
  if (input_id) {
    input_id = input_id.toString();
    let id = extractId.fromAny(input_id);

    spotify.getAlbumsOfArtist(id)
    .then(async (albums) => {
      let name = (await spotify.getArtist(id)).name;
      let collab = new Collaborations(name);
      log.info(albums)
      for (let album of albums) {
        try {
          let tracks = await spotify.getTracksFromAlbum(album.id)
          collab.parseAlbum(new AlbumTracksFromJSON('', tracks));
        } catch (APIError) {
          console.log(`oops ${album.id}`);
        }
        await new Promise(r => setTimeout(r, 100));
      }
      log.info(collab.getTrackNum().toString());
      let closed = new Set<string>([]);
      let current = new Set<string>([name]);
      let next = new Set<string>([]);
      let nodes: NodeEntry[] = [];
      let links: LinkEntry[] = [];
      collab.resolve(current, next, closed, nodes, links);
      Collaborations.fillLastLayer(nodes, next, 2);
      let payload = JSON.stringify({
        nodes: nodes,
        links: links
      })

      res.render('graph', {data: payload});
    })
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