import * as d3 from 'd3'
import { useEffect } from 'react'
import top10HashtagList from '../data/top10HashtagList.json'

console.log('top10HashtagList', top10HashtagList)

export const StackedBarChart = () => {
  useEffect(() => {
    drawStackedBarChart(top10HashtagList)
  }, [])

  return <div id="stack-bar-chart-area"></div>
}

const sortData = (data: any, sortBy: string, ascending: boolean = true) => {
  if (ascending) {
    return data.sort(function (a: any, b: any) { return a[sortBy] - b[sortBy]; });
  } else {
    return data.sort(function (a: any, b: any) { return b[sortBy] - a[sortBy]; });
  }
}

const drawStackedBarChart = (top10HashtagList: any) => {
  const sortBy = 'hashtag'

  const data = sortData(top10HashtagList, sortBy, true)

  const MARGIN = ({ TOP: 0, RIGHT: 0, BOTTOM: 0, LEFT: 0 })
  const HEIGHT = 300
  const WIDTH = 800
  const keys = ["facebook", "twitter", "instagram", "youtube"]

  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSpectral[keys.length])
    .unknown("#ccc")

  const xAxis = (g: any) => g
    .attr("transform", `translate(0,${MARGIN.TOP})`)
    .call(d3.axisTop(x).ticks(WIDTH / 100, "s"))
    // @ts-ignore
    .call(g => g.selectAll(".domain").remove())

  const x = d3.scaleLinear()
    .domain([0, 22303])
    .range([MARGIN.LEFT, WIDTH - MARGIN.RIGHT - 200])

  const y = d3.scaleBand()
    .domain(data.map((d: any) => d.hashtag))
    .range([MARGIN.TOP, (HEIGHT - MARGIN.BOTTOM)])

  // @ts-ignore
  y.invert = function (a) {
    var domain = this.domain();
    var range = this.range()
    // @ts-ignore
    var scale = d3.scaleQuantize().domain(range).range(domain)
    return scale(a)
  };


  function zoom(svg: any) {
    svg.call(d3.zoom()
      .scaleExtent([1, 3])
      .translateExtent([[0, 0], [WIDTH - MARGIN.RIGHT, (HEIGHT - MARGIN.BOTTOM)]])
      .extent([[0, 0], [WIDTH - MARGIN.RIGHT, (HEIGHT - MARGIN.BOTTOM)]])
      .on("zoom", zoomed))
      .on("wheel", (event: any) => event.preventDefault());

    function zoomed(event: any) {
      console.log('zoomed', event)
      y.range([MARGIN.TOP, HEIGHT - MARGIN.BOTTOM].map((d, i) => event.transform.applyY(d)));
      svg.selectAll(".bars rect")
        // @ts-ignore
        .attr("y", (d: any, i: any) => y(d.data.hashtag))
        .attr("height", y.bandwidth() - 5 / event.transform.k);
    }
  }

  const keyssel = ["facebook", "twitter", "instagram", "youtube"]

  const series = () => {
    let t = keyssel.filter(function (value, index, arr) { return value !== sortBy; });
    if (t.length < keyssel.length) {
      t.splice(0, 0, sortBy);
    }

    return d3.stack()
      // @ts-ignore
      .keys(t)(data)
      // @ts-ignore
      // eslint-disable-next-line no-sequences
      .map(d => (d.forEach(v => v.key = d.key), d))
  }


  console.log('series', series())

  const svg = d3.select("#stack-bar-chart-area").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .call(zoom)
    // .on("mousemove", function (event) {
    //   let coordinate = d3.pointer(event);
    //   // @ts-ignore
    //   let focusHashtag = data.find(e => e.hashtag === y.invert(coordinate[1]));
    //   if (!focusHashtag) {
    //     return
    //   }

    //   svg.selectAll(".tooltip text.hashtag").text("ID:" + focusHashtag.hashtag);
    //   svg.selectAll(".tooltip text.facebook").text("Name:" + focusHashtag.facebook);
    //   svg.selectAll(".tooltip text.twitter").text("Total:" + focusHashtag.twitter);
    //   svg.selectAll(".tooltip text.instagram").text("HP:" + focusHashtag.instagram);
    //   svg.selectAll(".tooltip text.youtube").text("Attack:" + focusHashtag.youtube);
    // });


    .selectAll("g")
    .data(series)
    .join("g")
    // @ts-ignore
    .attr("fill", d => color(d.key))
    .attr("class", "bars")
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d[0]))
    // @ts-ignore
    .attr("y", (d, i) => y(d.data.hashtag))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y.bandwidth() - 5);

  // svg.append("rect")
  //   .attr("x", 0)
  //   .attr("y", 0)
  //   .attr("fill", "white")
  //   .attr("width", WIDTH)
  //   .attr("height", MARGIN.TOP);

  // svg.append("g")
  //   .attr("class", "tooltip")
  //   .attr("transform", "translate(" + (WIDTH - MARGIN.RIGHT - 200) + ",50)");

  // let tooltipg = svg.selectAll(".tooltip");
  // tooltipg.append("rect")
  //   .attr("width", 200)
  //   .attr("height", 400)
  //   .attr("fill", "yellowgreen");

  // tooltipg.append("text")
  //   .attr("class", "hashtag")
  //   .attr("y", 20);
  // tooltipg.append("facebook")
  //   .attr("class", "Name")
  //   .attr("y", 40);
  // tooltipg.append("twitter")
  //   .attr("class", "Type")
  //   .attr("y", 60);
  // tooltipg.append("instagram")
  //   .attr("class", "Total")
  //   .attr("y", 80);
  // tooltipg.append("youtube")
  //   .attr("class", "HP")
  //   .attr("y", 100);

  // svg.append("g")
  //   .attr("class", "x-axis")
  //   .call(xAxis);

  // svg.node();
}