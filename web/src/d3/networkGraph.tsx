import * as d3 from 'd3'
import { useEffect } from 'react'
import hashtagRelation from '../data/hashtagRelation.json'
import { Legend } from './NetworkLegend'

console.log('hashtagRelation', hashtagRelation)

const MARGIN = ({ TOP: 0, RIGHT: 100, BOTTOM: 0, LEFT: 0 })
const HEIGHT = 500
const WIDTH = 600

export const NetworkGraph = () => {
  useEffect(() => {
    drawNetworkGraph(hashtagRelation, '#Eucerin')
    Legend(hashtagRelation)
  }, [])

  return <div>
    <div id="network-graph-legend"></div>
    <div id="network-graph-area"></div>
  </div>
}
const drawNetworkGraph = (hashtagRelation: any, focusHashtag: string) => {
  const dataset = hashtagRelation

  const colorScale = d3.scaleLinear()
    // @ts-ignore
    .domain(d3.extent(dataset.nodes, (d: any) => Number(d.size)))
    // @ts-ignore
    .range(['#daf0ff', '#1167b1'])// 45b6fe

  const radiusScale = d3.scaleLinear()
    // @ts-ignore
    .domain(d3.extent(dataset.nodes, (d: any) => Number(d.size)))
    .range([20, 50])

  const svg = d3.select("#network-graph-area")
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  // const subgraphWidth = WIDTH * 2 / 8;
  // const subgraphHeight = HEIGHT * 1 / 5;

  // const subgraph = svg.append("g")
  //   .attr("id", "subgraph")
  //   .attr("transform", `translate(${WIDTH - subgraphWidth - 20}, 0)`);

  // subgraph.append("text")
  //   .style("font-size", "16px")

  //appending little triangles, path object, as arrowhead
  //The <defs> element is used to store graphical objects that will be used at a later time
  //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
  svg.append('defs').append('marker')
    .attr("id", 'arrowhead')
    .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr('refX', 24) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none');

  // svg.append("text")
  //   .text(focusHashtag)
  //   .attr("text-anchor", "middle")
  //   .attr("x", WIDTH / 2)
  //   .style("font-size", "20px")

  // Initialize the links
  const link = svg.selectAll(".links")
    .data(dataset.links)
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("stroke", "#999")
    .attr("stroke-width", "2px")
    .style("opacity", 0.8)
    .attr("id", (d: any) => "line" + d.source + d.target)
    .attr("class", "links")
    .attr('marker-end', 'url(#arrowhead)') //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.


  //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
  //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
  link.append("title")
    .text((d: any) => d.value);

  const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
    .data(dataset.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('id', function (d, i) { return 'edgepath' + i })
    .style("pointer-events", "none");

  const edgelabels = svg.selectAll(".edgelabel")
    .data(dataset.links)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr('class', 'edgelabel')
    .attr('id', function (d, i) { return 'edgelabel' + i })
    .attr('font-size', 14)
    .attr('fill', '#aaa');

  edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
    .attr('xlink:href', function (d, i) { return '#edgepath' + i })
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text((d: any) => d.value);

  // Initialize the nodes
  const node = svg.selectAll(".nodes")
    .data(dataset.nodes)
    .enter()
    .append("g")
    .attr("class", "nodes")

  // @ts-ignore
  node.call(d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
    .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
    .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
  );

  // @ts-ignore
  node.append("circle")
    .attr("r", (d: any) => radiusScale(d.size))
    .attr("id", (d: any) => "circle" + d.id)
    // .style("stroke", "grey")
    // .style("stroke-opacity", 0.3)
    // .style("stroke-width", (d: any) => d.runtime / 10)
    .style("fill", (d: any) => d.id === focusHashtag ? "#FFC300" : colorScale(Number(d.size)))

  node.append("title")
    .text((d: any) => "Hashtag: " + d.id + "\nTotal posts: " + d.size);

  node.append("text")
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    // .attr('font-size', (d: any) => d.size > 100 ? '16px' : '8px')
    .text((d: any) => d.id);

  //set up dictionary of neighbors
  var neighborTarget = {};
  for (var i = 0; i < dataset.nodes.length; i++) {
    var id = dataset.nodes[i].id;
    // @ts-ignore
    // eslint-disable-next-line no-loop-func
    neighborTarget[id] = dataset.links.filter(d => d.source === id).map(d => d.target)
  }

  var neighborSource = {};
  for (var i = 0; i < dataset.nodes.length; i++) {
    var id = dataset.nodes[i].id;
    // @ts-ignore
    // eslint-disable-next-line no-loop-func
    neighborSource[id] = dataset.links.filter(d => d.target == id).map(d => d.source)
  }

  console.log("neighborSource is ", neighborSource);
  console.log("neighborTarget is ", neighborTarget);

  node.selectAll("circle").on("click", function (event, d: any) {
    console.log("clicked on ", d.id);
    // var active = d.active ? false : true // toggle whether node is active
    //   , newStroke = active ? "yellow" : "grey"
    //   , newStrokeIn = active ? "green" : "grey"
    //   , newStrokeOut = active ? "red" : "grey"
    //   , newOpacity = active ? 0.6 : 0.3
    //   , subgraphOpacity = active ? 0.9 : 0;

    // subgraph.selectAll("text")
    //   .text("Selected: " + d.label)
    //   .attr("dy", 14)
    //   .attr("dx", 14)

    // extract node's id and ids of its neighbors
    // var id = d.id
    //   // @ts-ignore
    //   , neighborS = neighborSource[id]
    //   // @ts-ignore
    //   , neighborT = neighborTarget[id];
    // console.log("neighbors is from ", neighborS, " to ", neighborT);
    // d3.selectAll("#circle" + id).style("stroke-opacity", newOpacity);
    // d3.selectAll("#circle" + id).style("stroke", newStroke);

    // // d3.selectAll("#subgraph").style("opacity", subgraphOpacity)

    // //highlight the current node and its neighbors
    // for (var i = 0; i < neighborS.length; i++) {
    //   d3.selectAll("#line" + neighborS[i] + id).style("stroke", newStrokeIn);
    //   d3.selectAll("#circle" + neighborS[i]).style("stroke-opacity", newOpacity).style("stroke", newStrokeIn);
    // }
    // for (var i = 0; i < neighborT.length; i++) {
    //   d3.selectAll("#line" + id + neighborT[i]).style("stroke", newStrokeOut);
    //   d3.selectAll("#circle" + neighborT[i]).style("stroke-opacity", newOpacity).style("stroke", newStrokeOut);
    // }
    // //update whether or not the node is active
    // d.active = active;
  })

  //create a simulation for an array of nodes, and compose the desired forces.
  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink() // This force provides links between nodes
      // @ts-ignore  
      .id(d => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
      .distance(100) // This sets the link distance to the specified function. If not specified, will use the default distance calculation.
    )
    .force("charge", d3.forceManyBody().strength(-700)) // This adds repulsion (if it's negative) between nodes. 
    .force("center", d3.forceCenter(MARGIN.LEFT, HEIGHT / 2)) // This force attracts nodes to the center of the svg area
    .force("collide", d3.forceCollide().radius((d: any) => radiusScale(d.size) + 20));

  //Listen for tick events to render the nodes as they update in your Canvas or SVG.
  simulation
    // @ts-ignore
    .nodes(dataset.nodes)
    .on("tick", ticked);

  // @ts-ignore
  simulation.force("link")
    // @ts-ignore
    .links(dataset.links);


  // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
  function ticked() {
    // @ts-ignore
    link.attr("x1", d => d.source.x)
      // @ts-ignore
      .attr("y1", d => d.source.y)
      // @ts-ignore
      .attr("x2", d => d.target.x)
      // @ts-ignore
      .attr("y2", d => d.target.y);

    // @ts-ignore
    node.attr("transform", d => `translate(${d.x},${d.y})`);

    // @ts-ignore
    edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
  function dragstarted(event: any, d: any) {
    // @ts-ignore
    if (!event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  function dragged(event: any, d: any) {
    // @ts-ignore
    d.fx = event.x;
    // @ts-ignore
    d.fy = event.y;
  }

  // //drawing the legend
  // const legend_g = svg.selectAll(".legend")
  //   // .data(colorScale.domain())
  //   .enter().append("g")
  //   .attr("transform", (d, i) => `translate(${WIDTH},${i * 20})`);

  // legend_g.append("circle")
  //   .attr("cx", 0)
  //   .attr("cy", 0)
  //   .attr("r", 5)
  // // @ts-ignore
  // // .attr("fill", colorScale);

  // legend_g.append("text")
  //   .attr("x", 10)
  //   .attr("y", 5)
  //   .text((d: any) => d);

  // //drawing the second legend
  // const legend_g2 = svg.append("g")
  //   //.attr("transform", (d, i) => `translate(${width},${i * 20})`); 
  //   .attr("transform", `translate(${WIDTH}, 120)`);

  // legend_g2.append("circle")
  //   .attr("r", 5)
  //   .attr("cx", 0)
  //   .attr("cy", 0)
  //   .style("stroke", "grey")
  //   .style("stroke-opacity", 0.3)
  //   .style("stroke-width", 15)
  //   .style("fill", "black")
  // legend_g2.append("text")
  //   .attr("x", 15)
  //   .attr("y", 0)
  //   .text("long runtime");

  // legend_g2.append("circle")
  //   .attr("r", 5)
  //   .attr("cx", 0)
  //   .attr("cy", 20)
  //   .style("stroke", "grey")
  //   .style("stroke-opacity", 0.3)
  //   .style("stroke-width", 2)
  //   .style("fill", "black")
  // legend_g2.append("text")
  //   .attr("x", 15)
  //   .attr("y", 20)
  //   .text("short runtime");

}
