const { Base64 } = require('js-base64');
import { log } from './log';
import urllib from 'urllib';
const clientId     = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;

let token: string = '';
let expiration: Date = new Date();
expiration.setMinutes(expiration.getMinutes() - 1);

async function getToken(): Promise<string> {
  console.log('getting');
  let now = new Date();
  if (now < expiration) {
    return token;
  }
  return requestToken();
}

function authorize() {
	return 'Basic ' + Base64.encode(clientId + ':' + clientSecret);
}

async function requestToken(): Promise<string> {
  console.log('reqiing');
  let result = await urllib.request('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': authorize(),
    },
    data: {
      grant_type: 'client_credentials'
    },
  })

  if (result.res.statusCode != 200) {
    throw 'bruh 1';
  }

  let data = JSON.parse(result.data.toString())
  console.log(data, data.access_token);

  expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + data.expires_in)
  token = data.access_token;
  return token;
}

export { getToken as token };