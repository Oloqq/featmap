type NodeEntry = {
  id: string,
  size: number,
  layer: number
}

type LinkEntry = {
  source: string,
  target: string,
  size: number
}

export {LinkEntry, NodeEntry}