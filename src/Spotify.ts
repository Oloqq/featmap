import { newLog } from "./log";
let log = newLog("logs/spotify.log");
import urllib from "urllib";
import fs from "fs";
import { TokenManager } from "../src/TokenManager";


class Spotify {
  private token: TokenManager;

  constructor(client_id: string, secret_key: string) {    
    this.token = new TokenManager(client_id, secret_key);
  }

  async getTracksFromAlbum(albumId: string): Promise<string[]> {
    var result = await urllib.request(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + await this.token.get()
      },
      data: {
        limit: 50, // TODO handle ridicolously large albums
        market: "PL"
      }
    });
    if (result.res.statusCode != 200) { // didn't succeed
      log.error(`Getting tracks from album failed: ${result.res.statusCode}: ${result.res.statusMessage}. ${result.data.toString()}`);
      throw new Error(result.res.statusCode?.toString());
    }
    var tracks = JSON.parse(result.data.toString()).items;
    log.info(tracks);
    return tracks;
  }
}

export { Spotify }