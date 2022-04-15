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

type GraphData = {
  nodes: NodeEntry[],
  links: LinkEntry[]
}

export { LinkEntry, NodeEntry, GraphData }