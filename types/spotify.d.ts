type Artist = {
  id: string
  name: string
}

type Track = {
  name: string
  artists: Artist[]
}

export { Artist, Track}