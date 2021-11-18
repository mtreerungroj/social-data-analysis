import * as d3 from 'd3'
import { useEffect } from 'react'
import { IHashtagEngagementRawData } from '../type/dataTypes'
import { Legend } from './EngagementChartLegend'
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
    Legend(hashtagEngagementData)
  }, [hashtagEngagementRawData])

  return <div>
    <div id="engagement-chart-legend"></div>
    <div id="engagement-chart-area"></div>
  </div>
}

const MARGIN = ({ TOP: 0, RIGHT: 0, BOTTOM: 0, LEFT: 30 })
const HEIGHT = 600
const WIDTH = 900

const time_dummy = ["00.00-00.59", "01.00-01.59", "02.00-02.59", "03.00-03.59", "04.00-04.59", "05.00-05.59", "06.00-06.59", "07.00-07.59", "08.00-08.59", "09.00-09.59", "10.00-10.59", "11.00-11.59", "12.00-12.59", "13.00-13.59", "14.00-14.59", "15.00-15.59", "16.00-16.59", "17.00-17.59", "18.00-18.59", "19.00-19.59", "20.00-20.59", "21.00-21.59", "22.00-22.59", "23.00-23.59"]
const date_dummy = ["1/1/2020", "1/2/2020", "1/3/2020", "1/4/2020", "1/5/2020", "1/6/2020", "1/7/2020", "1/8/2020", "1/9/2020", "1/10/2020", "1/11/2020", "1/12/2020"]

const chart_param_init = ({
  width: WIDTH,
  ridge_height: 30,
  margin: {
    top: 10,
    right: 25,
    bottom: 20,
    left: 100,
    ridge: 20
  }
})

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

  // after manually setting parameters in chart_param_init, height will be defined based on those params
  const chart_param = Object.assign(
    chart_param_init,
    {
      height: chart_param_init.margin.top + chart_param_init.margin.bottom +
        // data.length * chart_param_init.margin.ridge
        24 * chart_param_init.margin.ridge
        + chart_param_init.ridge_height
    })

  const y = d3.scaleLinear()
    // @ts-ignore
    .domain(d3.extent(data().map((d: any) => d.data).flat(), (d: any) => d.engagement))
    .range([chart_param.ridge_height, 0])

  const x = d3.scaleLinear()
    // @ts-ignore
    .domain(d3.extent(data().map(d => d.data).flat(), d => d.Month))
    .range([0, chart_param.width - chart_param.margin.left - chart_param.margin.right])

  const color = d3.scaleLinear()
    // @ts-ignore
    .domain(d3.extent(data_x, d => d.avg))
    // .range(["#d65e9b", "#8bb56e"])
    // @ts-ignore
    .range(["white", d3.hcl("hsl(207, 44%, 49%)").darker()])

  // a simple line to plot to fill under the ridge (showing true data)
  const line1 = d3.line()
    .x((d: any) => x(d.Month))
    .y((d: any) => y(d.engagement));

  // similar to line1, just with curve to enclose data with a smooth ridge
  const line2 = d3.line()
    //.curve(d3.curveCardinal)
    .x((d: any) => x(d.Month))
    .y((d: any) => y(d.engagement));


  /*** init svg plot ***/
  const svg = d3.select("#engagement-chart-area").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .attr("viewBox", `-80 -20 ${WIDTH + 100} ${HEIGHT + 50}`)

  const cp = chart_param;

  /*** draw axis lines + labels ***/
  // 1. first creating array of information about where to place axis lines
  const d0 = new Date("01/01/2020");
  let date_points = [];
  for (let i = 1; i <= 12; i++) {
    const d1 = new Date(i + "/01/2020"),
      month_str = d1.toLocaleDateString("en-US", { month: "long" });
    date_points.push({
      month_str: month_str.substring(0, 3) + (month_str.length > 3 ? "." : ""),
      // @ts-ignore
      days_into_year: (d1 - d0) / (1000 * 60 * 60 * 24)
    });
  }

  // but if chart is quite narrow, just use 3 set axis lines
  if (chart_param.width <= 750) {
    date_points = [
      { month_str: "Jan. 1", days_into_year: 0 },
      { month_str: "Jun. 31", days_into_year: 182 },
      { month_str: "Dec. 30", days_into_year: 364 }
    ]
  }

  // 2. draw axis groups
  const x_date = d3.scaleLinear()
    .domain([0, 364])
    .range(x.range());
  const ag = svg.selectAll("g.axis_group")
    .data(date_points).enter()
    .append("g")
    .classed("axis_group", true)
    .attr("transform", d => `translate(${cp.margin.left + x_date(d.days_into_year)}, ${cp.margin.top})`);

  // 3. draw axis lines
  ag.append("line")
    .classed("axis_line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", cp.height - cp.margin.top - cp.margin.bottom)
    .style("stroke", "#c9c9c9");

  // 4. draw axis labels
  ag.append("text")
    .classed("axis_text", true)
    .attr("x", 0)
    .attr("y", cp.height - cp.margin.top - cp.margin.bottom + 5)
    .style("font-size", "14px")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "hanging")
    .text(d => d.month_str);

  // 5. create object to cover axis lines above top ridge
  // @ts-ignore
  let cover_path = [...data()[0].data];
  cover_path.push({ Month: 12, engagement: 100 });
  cover_path.push({ Month: 1, engagement: 100 });
  svg.append("path")
    .attr("id", "axis_line_cover")
    .attr("d", line2(cover_path))
    .attr("transform", `translate(${cp.margin.left}, ${cp.margin.top})`)
    .style("fill", "white");

  /*** create ridges ***/
  // 1. create ridge groups in correct location with hover events
  const rg = svg.selectAll("g.ridge_group")
    .data(data).enter()
    .append("g")
    .classed("ridge_group", true)
    .attr("transform", d => `translate(${cp.margin.left},
      ${cp.margin.top + (d.Order - 1) * cp.margin.ridge})`);

  // 2. add ridge labels
  rg.append("text")
    .classed("ridge_label", true)
    .attr("x", -5)
    .attr("y", cp.ridge_height)
    .style("font-size", "14px")
    .style("text-anchor", "end")
    .style("alignment-baseline", "middle")
    .text(d => d.Time);

  // 3. add path for ridge fill
  rg.append("path")
    .classed("ridge_fill", true)
    .attr("d", d => {
      // take original data and add points for bottom corners to create fill
      let path = [...d.data];
      path.push({ Month: 12, engagement: 0 });
      path.push({ Month: 1, engagement: 0 });
      return line2(path);
    })
    // @ts-ignore
    .style("fill", d => color(d.avg).replace(")", ", 0.40)"))
    .style("stroke", "#c9c9c9");

  // 4. add path for ridge
  rg.append("path")
    .classed("ridge_path", true)
    .attr("d", d => line2(d.data))
    .style("fill", "none")
    .style("stroke", d => color(d.avg));

  // 5. add hover box (where user can hover)
  rg.append("rect")
    .attr("x", -cp.margin.left)
    .attr("y", cp.ridge_height * 0.65)
    .attr("width", WIDTH)
    .attr("height", cp.margin.ridge)
    .style("fill", "rgba(0, 0, 0, 0)")
    .on("mouseover", function (e, d) {
      svg.selectAll("g.ridge_group").style("opacity", (d0: any) => d0.Time === d.Time ? 1 : 0.3);
    })
    .on("mouseleave", function (e, d) {
      svg.selectAll("g.ridge_group")
        .style("opacity", 1);
    });

  // Creating a Tooltip Using the Title Tag
  rg.append("title")
    .text(function (d) { return `Time: ${d.Time}\nTotal engagement: ${d3.format(",")(d.avg)}`; });

  return svg.node();
}
