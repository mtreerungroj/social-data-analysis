import * as d3 from 'd3'
import { useEffect } from 'react'
import { IHashtagEngagementRawData } from '../type/dataTypes'
import { prepareHashtagEngagementData } from './util'

interface IEngagementChartProps {
  hashtagEngagementRawData: IHashtagEngagementRawData[],
}

export const EngagementChart = (props: IEngagementChartProps) => {
  const { hashtagEngagementRawData } = props

  useEffect(() => {
    if (!hashtagEngagementRawData) return
    console.log('hashtagEngagementData', hashtagEngagementRawData)

    const hashtagEngagementData = prepareHashtagEngagementData(hashtagEngagementRawData)
    console.log('hashtagEngagementData', hashtagEngagementData)

    if (!hashtagEngagementData) return
    drawEngagementChart(hashtagEngagementData)
  }, [hashtagEngagementRawData])

  return <div>
    <div id="stack-bar-chart-legend"></div>
    <div id="stack-bar-chart-area"></div>
  </div>
}

const time_dummy = ["00.00-00.59", "01.00-01.59", "02.00-02.59", "03.00-03.59", "04.00-04.59", "05.00-05.59", "06.00-06.59", "07.00-07.59", "08.00-08.59", "09.00-09.59", "10.00-10.59", "11.00-11.59", "12.00-12.59", "13.00-13.59", "14.00-14.59", "15.00-15.59", "16.00-16.59", "17.00-17.59", "18.00-18.59", "19.00-19.59", "20.00-20.59", "21.00-21.59", "22.00-22.59", "23.00-23.59"]
const date_dummy = ["1/1/2020", "1/2/2020", "1/3/2020", "1/4/2020", "1/5/2020", "1/6/2020", "1/7/2020", "1/8/2020", "1/9/2020", "1/10/2020", "1/11/2020", "1/12/2020"]



const drawEngagementChart = (hashtagEngagementData: any) => {
  const data_x = hashtagEngagementData
  console.log('data_x', data_x)

  // insert dummy time
  const data_y = () => {
    let a = [...data_x];
    for (let index = 1; index < 25; ++index) {
      let check = a.filter(d => d['Order'] === index)
      if (check.length === 0) {
        a.push({ Time: time_dummy[+index - 1], avg: 0, Order: index, data: [{ Month: 1, Date: "1/1/2020", engagement: 0 }] });
      }
    }
    return a.sort((a, b) => d3.ascending(a.Order, b.Order));
  }

  console.log('data_y', data_y())

  // insert dummy date
  const data = () => {
    let c = [...data_y()];
    for (let i = 0; i < 24; ++i) {
      let date_data = c[i]['data'].map((e: any) => e['Date']);
      for (let j = 0; j < 12; ++j) {
        if (date_data.indexOf(date_dummy[j]) === -1) {
          c[i]['data'].push({ Month: +j + 1, Date: date_dummy[j], engagement: 0 });
        }
      }
      c[i]['data'].sort((a: any, b: any) => d3.ascending(a.Month, b.Month));
    }
    return c;
  }

  console.log('data data data', data())//.map((d: any) => d.data).flat())
  // const y = () => d3.scaleLinear()
  // .domain(d3.extent(data().map((d: any) => d.data).flat(), (d: any) => d.engagement))
  // .range([chart_param.ridge_height, 0])

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
}
