import { newLog } from "./log";
let log = newLog("logs/spotify.log");
import urllib from "urllib";
import fs from "fs";
import { TokenManager } from "../src/TokenManager";

const albumLimit = 10;

class APIError extends Error {
	constructor(...params: any[]) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(...params)

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, APIError)
		}

		this.name = 'APIError'
	}
}

class Spotify {
  private token: TokenManager;

  constructor(client_id: string, secret_key: string) {    
    this.token = new TokenManager(client_id, secret_key);
  }

  async getArtist(id: string): Promise<any> {
    var result = await urllib.request(
      `https://api.spotify.com/v1/artists/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + await this.token.get()
        },
      }
    );
    if (result.res.statusCode != 200) { // didn't succeed
      log.error(`Getting artist failed: `,
                `${result.res.statusCode}: ${result.res.statusMessage} `,
                `${result.data.toString()}`);
      throw new APIError(result.res.statusCode);
    }
    var info = JSON.parse(result.data.toString());
    return info;
  }

  async getAlbumsOfArtist(id: string, include_groups?: string): Promise<any> {
    var result = await urllib.request(
      `https://api.spotify.com/v1/artists/${id}/albums?`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + await this.token.get()
        },
        data: {
          include_groups: include_groups,
          market: 'PL',
          limit: albumLimit, // TODO handle excessively active artists (over 50 albums)
        }
      }
    );
    if (result.res.statusCode != 200) { // didn't succeed
      log.error(`Getting recent albums of an artist failed: `,
                `${result.res.statusCode}: ${result.res.statusMessage} `,
                `${result.data.toString()}`);
      throw new APIError(result.res.statusCode);
    }
    var albums = JSON.parse(result.data.toString()).items;
    // TODO use next to get all of the tracks
    // log.info(albums);
    return albums;
  }

  async getTracksFromAlbum(id: string): Promise<any> {
    var result = await urllib.request(
      `https://api.spotify.com/v1/albums/${id}/tracks?`, {
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
      log.error(`Getting tracks from album failed: ${result.res.statusCode}: ${result.res.statusMessage}. ${result.data.toString()}
      id: ${id}`);
      throw new APIError(result.res.statusCode?.toString());
    }
    var tracks = JSON.parse(result.data.toString()).items;
    // log.info(tracks);
    return tracks;
  }
}

export { Spotify }