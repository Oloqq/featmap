import { Track } from "../src/Track";


async function getTracks(artistId: string): Promise<Track[]> {
  let albums = await getAlbumIds(artistId);
  for (let album of albums) {
    let t = await getTracksFromAlbum(album);
    // tracks = tracks.concat(t);
  }
  
  return [];
}

async function getAlbumIds(artistId: string): Promise<string[]> {
  return [];
}

async function getTracksFromAlbum(albumId: string): Promise<string[]> {
  return [];
}

// async function getTracksFromAlbum(userId, albumId, token=undefined) {
// 	log.info(`Getting tracks of album ${albumId}`);
// 	token = token ? token : await getToken(userId);	
// 	var result = await urllib.request(
// 		`https://api.spotify.com/v1/albums/${albumId}/tracks?` + querystring.stringify({
// 			limit: '50'
// 		}), {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': 'Bearer ' + token
// 		},
// 	});
// 	if (result.res.statusCode != 200) { // didn't succeed
// 		log.error(`Getting tracks from album failed: ${result.res.statusCode}: ${result.res.statusMessage}. ${result.data.toString()}`);
// 		throw new APIError(result.res.statusCode);
// 	}
// 	var tracks = JSON.parse(result.data.toString()).items;
// 	return tracks;
// }

// async function getRecentStuffOfArtist(userId, artistId, threshold, stuffType,
// 																			token=undefined) {
// 	log.info(`Getting recent (${threshold.toISOString()}) stuff (${stuffType}) of ${artistId}`);
// 	token = token ? token : await getToken(userId);	
// 	var result = await urllib.request(
// 		`https://api.spotify.com/v1/artists/${artistId}/albums?` 
// 		+ querystring.stringify({
// 			include_groups: stuffType,
// 			limit: '10',			
// 		}), {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': 'Bearer ' + token
// 		},
// 	});
// 	if (result.res.statusCode != 200) { // didn't succeed
// 		log.error(`Getting recent albums of an artist failed: `,
// 							`${result.res.statusCode}: ${result.res.statusMessage} `,
// 							`${result.data.toString()}`);
// 		throw new APIError(result.res.statusCode);
// 	}
// 	var albums = JSON.parse(result.data.toString()).items;
// 	albums = albums.filter(album => Date.parse(album.release_date) >= threshold);
// 	return albums;
// }

// async function getRecentStuffOfArtist(userId, artistId, threshold, stuffType, token=undefined) {
// 	log.info(`Getting recent (${threshold.toISOString()}) stuff (${stuffType}) of ${artistId}`);
// 	token = token ? token : await getToken(userId);	
// 	var result = await urllib.request(
// 		`https://api.spotify.com/v1/artists/${artistId}/albums?` 
// 		+ querystring.stringify({
// 			include_groups: stuffType,
// 			limit: '10',			
// 		}), {
// 		method: 'GET',
// 		headers: {
// 			'Authorization': 'Bearer ' + token
// 		},
// 	});
// 	if (result.res.statusCode != 200) { // didn't succeed
// 		log.error(`Getting recent albums of an artist failed: `,
// 							`${result.res.statusCode}: ${result.res.statusMessage} `,
// 							`${result.data.toString()}`);
// 		throw new APIError(result.res.statusCode);
// 	}
// 	var albums = JSON.parse(result.data.toString()).items;
// 	albums = albums.filter(album => Date.parse(album.release_date) >= threshold);
// 	return albums;
// }

export { getTracks }