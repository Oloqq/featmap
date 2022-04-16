'use strict';

var submitButton = document.getElementById("submit");

submitButton.addEventListener("click", requestGraph);

function requestGraph() {
  fetch('/gimmedata', {
    method: 'POST'
  }).then(res => res.json()).then(data => {
    const Graph = ForceGraph()
    (document.getElementById('graph'))
    .graphData(data)
    .nodeId('id')
    .nodeAutoColorBy('layer')
    .linkWidth('size')
    .nodeCanvasObject((node, ctx, globalScale) => {
      const label = node.id;
      const fontSize = 20/globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = node.color;
      ctx.fillText(label, node.x, node.y);

      node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    })
    .nodePointerAreaPaint((node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    });
  });
}
