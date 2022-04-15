// import { Collaborations } from "./Collaborations";
// import { token } from "../src/authorizer";
// import urllib from 'urllib';
// import { log } from './log';

// async function getTracks(artistId: string): Promise<Collaborations> {
//   let albums = await getAlbumIds(artistId);
//   for (let album of albums) {
//     let t = await getTracksFromAlbum(album);
//     // tracks = tracks.concat(t);
//   }
  
//   return new Collaborations('');
// }

// async function getAlbumIds(artistId: string): Promise<string[]> {
//   return [];
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

// export { getTracks, getTracksFromAlbum }