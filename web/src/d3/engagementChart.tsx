import * as d3 from 'd3'
import { useEffect } from 'react'

interface IEngagementChartProps {
  hashtagEngagementData: any,
}

export const EngagementChart = (props: IEngagementChartProps) => {
  const { hashtagEngagementData } = props

  useEffect(() => {
    console.log('hashtagEngagementData', hashtagEngagementData)

    // drawEngagementChart(data)
  }, [])

  return <div>
    <div id="stack-bar-chart-legend"></div>
    <div id="stack-bar-chart-area"></div>
  </div>
}

// const drawEngagementChart = (data: any) => {
  // const svg = d3.select("#stack-bar-chart-area").append("svg")
  //   .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  //   .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  //   .attr("viewBox", `-80 -20 ${WIDTH + 100} ${HEIGHT + 50}`)

  // const x = d3.scaleBand()
  //   .domain(regions)
  //   .range([0, WIDTH])
  //   .padding(0.2);

  // svg.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + HEIGHT + ")")
  //   .call(d3.axisBottom(x).tickSizeOuter(0));

  // // stacked bars
  // const gStacked = svg.append("g")
  //   .selectAll("g")
  //   .data(series)
  //   .enter()
  //   .append("g")
  //   // @ts-ignore
  //   .attr("fill", (d) => color(d.key))
  //   .selectAll("rect")
  //   .data((d) => d)
  //   .enter()
  //   .append("rect")
  //   // @ts-ignore
  //   .attr("x", (d) => x(d.data.name))
  //   .attr("y", (d) => y(d[1]))
  //   .attr("height", (d) => y(d[0]) - y(d[1]))
  //   .attr("width", x.bandwidth())
  //   .attr("stroke", "#D0D3D4")
  //   .attr("class", (d) => {
  //     // @ts-ignore
  //     const compositionName = d.key.split(" ").join("-");
  //     return `stacked-default ${compositionName} region-${d.data.region_id}`
  //   })
  //   .on("mouseover", mouseover)
  //   .on("mouseleave", mouseleave)

  // const gStackedValueText = svg.append("g")
  //   .selectAll("g")
  //   .data(series)
  //   .enter()
  //   .append("g")
  //   .selectAll("text")
  //   .data((d) => d)
  //   .enter()
  //   .append("text")
  //   // @ts-ignore
  //   .attr("x", (d) => x(d.data.name) + x.bandwidth() / 2)
  //   .attr("y", (d) => ((y(d[0]) + y(d[1])) / 2) - 20)
  //   .attr('transform', 'translate(0, 18)')
  //   .attr("text-anchor", "middle")
  //   .attr("class", (d) => {
  //     // @ts-ignore
  //     const compositionName = d.key.split(" ").join("-");
  //     return `stacked-text-default ${compositionName} region-${d.data.region_id}`
  //   })
  //   .attr("pointer-events", "none")
  //   .style("font-size", 16)
  //   .style("font-family", "sans-serif")
  //   .style("opacity", 0)
  //   .style("cursor", "default")

  // gStackedValueText.append("tspan")
  //   // @ts-ignore
  //   .text((d) => d3.format('.3s')(d.data[d.key]))

  // gStackedValueText.append("tspan")
  //   // @ts-ignore
  //   .attr('x', (d) => x(d.data.name) + x.bandwidth() / 2)
  //   .attr("dy", 16)
  //   // @ts-ignore
  //   .text(d => (d.data[d.key] / d.data["all"] * 100).toFixed(2) + "%")

  // gStackedValueText.clone(true)
  //   .lower()
  //   .attr("class", (d) => {
  //     // @ts-ignore
  //     const compositionName = d.key.split(" ").join("-");
  //     return `stacked-text-default ${compositionName} region-${d.data.region_id}`
  //   })
  //   .attr("aria-hidden", "true")
  //   .attr("fill", "none")
  //   .attr("stroke", "white")
  //   .attr("stroke-width", 3)
  //   .attr("stroke-linecap", "round")
  //   .attr("stroke-linejoin", "round")
  //   .on("mouseover", mouseover)
  //   .on("mouseleave", mouseleave)


  // const yTitle = (g: any) => g
  //   .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("x", 0 - HEIGHT / 2)
  //   .attr("y", 0 - MARGIN.LEFT - 20)
  //   .attr("class", "axis-label")
  //   .style("text-anchor", "middle")
  //   .style("font-size", 18)
  //   .style("font-family", "sans-serif")
  //   .text("Number of posts")

  // const yAxis = (g: any) => g
  //   .attr("class", "y axis")
  //   .attr("transform", `translate(0, 0)`)
  //   .call(d3.axisLeft(y)
  //     .ticks(null, "s"))

  // svg.append("g").call(yTitle);
  // svg.append("g").call(yAxis);


  // // composition legends
  // const gLegendX = WIDTH - 100;
  // const gLegendY = 100;
  // const gLegendRect = svg.append("g")
  //   .selectAll("regionLegendRect")
  //   .data(compositionNames)
  //   .enter()
  //   .append("rect")
  //   .attr("x", gLegendX)
  //   .attr("y", (d, i) => gLegendY - i * (25))
  //   .attr("width", 15)
  //   .attr("height", 15)
  //   .attr("class", (d, i) => "stacked-default " + compositionNames[i].split(" ").join("-"))
  //   .style("fill", (d, i) => colorCodes[i])

  // const gLegendLabel = svg.append("g")
  //   .selectAll("regionLegendLabel")
  //   .data(compositionNames)
  //   .enter()
  //   .append("text")
  //   .attr("x", gLegendX + 20)
  //   .attr("y", (d, i) => gLegendY + 8 - i * (25))
  //   .attr("text-anchor", "left")
  //   .attr("class", (d, i) => "stacked-default " + compositionNames[i].split(" ").join("-"))
  //   .style("cursor", "default")
  //   .style("fill", (d, i) => colorCodes[i])
  //   .style("alignment-baseline", "middle")
  //   .style("font-size", 16)
  //   .style("font-family", "sans-serif")
  //   .text((d, i) => compositionNames[i])

  // function mouseover(e: any, d: any) {
  //   const compositionName = d.key.split(" ").join("-");
  //   d3.selectAll(".stacked-default").style("opacity", 0.2);
  //   d3.selectAll(".stacked-text-default").style("opacity", 0);
  //   d3.selectAll("." + compositionName).style("opacity", 1);

  //   // @ts-ignore
  //   const ys = series.find((s) => s.key === d.key).slice(0, 10);
  //   // regionIds.forEach((region, ind) => {
  //   //   d3.selectAll(".region-" + region).attr("transform","none");
  //   // });
  //   regionIds.forEach((region, ind) => {
  //     d3.selectAll(".region-" + region).attr("transform", `translate(0, ${y(d[0]) - y(ys[ind][0])})`);
  //   });
  // }

  // function mouseleave(e: any, d: any) {
  //   d3.selectAll(".stacked-default").style("opacity", 1);
  //   d3.selectAll(".stacked-text-default").style("opacity", 0);
  //   regionIds.forEach((region, ind) => {
  //     d3.selectAll(".region-" + region).attr("transform", "none");
  //   });
  // }

  // return svg.node();
// }
