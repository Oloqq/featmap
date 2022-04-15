import urllib from "urllib";
const { Base64 } = require("js-base64");

class TokenManager {
  expiration: Date = new Date(0);
  token: string = "default-expired";
  private basicAuth: string|undefined;

  constructor(client_id: string, secret_key: string) {
    this.basicAuth = "Basic " + Base64.encode(client_id + ":" + secret_key);
  }

  async get(): Promise<string> {
    let now = new Date();
    if (now < this.expiration) {
      return this.token;
    } else {
      await this.refresh();
      return this.token;
    }
  }

  private async refresh() {
    let result = await urllib.request("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": this.basicAuth,
      },
      data: {
        grant_type: "client_credentials"
      },
    })
  
    if (result.res.statusCode != 200) {
      throw new Error("Couldn't refresh token");
    }
  
    let data = JSON.parse(result.data.toString())
    console.log(data, data.access_token);
  
    this.expiration = new Date();
    this.expiration.setSeconds(this.expiration.getSeconds() + data.expires_in)
    this.token = data.access_token;
  }
}

export { TokenManager }