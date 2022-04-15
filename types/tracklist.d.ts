interface TrackDict {
  [key: string]: Track
}

type Artist = string;

type NodeEntry = {
  id: string,
  size: number
}

type LinkEntry = {
  source: string,
  target: string,
  size: number
}

export {TrackDict, Artist, LinkEntry, NodeEntry}