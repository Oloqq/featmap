let extractId = {
  fromUri: function (uri: string): string {
    let tmp =  uri.split(':');
    if (tmp[0] !== 'spotify' || tmp[1] !== 'artist') {
      throw new Error('Bad uri');
    }
    return tmp[2];
  },

  fromLink: function (link: string): string {
    let re = /^http.+artist\/(.+)\?si=.+$/;
    let matches = link.match(re);
    if (matches) {
      return matches[1];
    }
    else {
      throw new Error('Bad link');
    }
  },

  fromAny: function (input: string): string {
    if (input.startsWith('http')) {
      return this.fromLink(input);
    }
    else {
      return this.fromUri(input);
    }
  }
}

export { extractId };