import urllib from 'urllib';
import { newLog } from './log';
import fs from 'fs';
let log = newLog('logs/spotify.log');


class Spotify {
  constructor() {
    
  }

  setAuthorization(client_id: string, secret_key: string) {
    log.info(`Setting new authorization. client_id: ${client_id}`);
  }
}

export { Spotify }