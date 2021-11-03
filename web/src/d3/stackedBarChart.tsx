import * as d3 from 'd3'
import { useEffect } from 'react'

export const StackedBarChart = () => {
  useEffect(() => {
    let data = [
      {
        Number: 1,
        Name: "Bulbasaur",
        Type_1: "Grass",
        Type_2: "Poison",
        Total: 318,
        HP: 45,
        Attack: 49,
        Defense: 49,
        Sp_Atk: 65,
        Sp_Def: 65,
        Speed: 45,
        Generation: 1,
        isLegendary: "False",
        Color: "Green",
        hasGender: "True",
        Pr_Male: 0.875,
        Egg_Group_1: "Monster",
        Egg_Group_2: "Grass",
        hasMegaEvolution: "False",
        Height_m: 0.71,
        Weight_kg: 6.9,
        Catch_Rate: 45,
        Body_Style: "quadruped",
      },
    ]

    const sort = 'Ascending'
    const sortBy = 'Name'

    const sortData = (data: any) => {
      if (sort == 'Ascending') {
        return data.sort(function (a: any, b: any) { return a[sortBy] - b[sortBy]; });
      } else {
        return data.sort(function (a: any, b: any) { return b[sortBy] - a[sortBy]; });
      }
    }

    data = sortData(data)

    const margin = ({ top: 30, right: 10, bottom: 0, left: 30 })
    const height = 500
    const width = 500
    const keys = ["HP", "Attack", "Defense", "Sp_Atk", "Sp_Def", "Speed"]

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSpectral[keys.length])
      .unknown("#ccc")

    const xAxis = (g: any) => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 100, "s"))
      // @ts-ignore
      .call(g => g.selectAll(".domain").remove())

    const x = d3.scaleLinear()
      .domain([0, 750])
      .range([margin.left, width - margin.right - 200])

    const y = d3.scaleBand()
      .domain(data.map(d => d.Name))
      .range([margin.top, (height - margin.bottom)])

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
        .scaleExtent([1, 30])
        .translateExtent([[0, 0], [width - margin.right, (height - margin.bottom)]])
        .extent([[0, 0], [width - margin.right, (height - margin.bottom)]])
        .on("zoom", zoomed))
        .on("wheel", (event: any) => event.preventDefault());

      function zoomed(event: any) {
        y.range([margin.top, height - margin.bottom].map(d => event.transform.applyY(d)));
        svg.selectAll(".bars rect").attr("y", (d: any, i: any) => y(d.data.Name)).attr("height", y.bandwidth());
      }
    }

    const keyssel = ["HP", "Attack", "Defense", "Sp_Atk", "Sp_Def", "Speed"]

    const series = () => {
      let t = keyssel.filter(function (value, index, arr) { return value !== sortBy; });
      if (t.length < keyssel.length) {
        t.splice(0, 0, sortBy);
      }

      return d3.stack()
        // @ts-ignore
        .keys(t)(data)
        // @ts-ignore
        .map(d => (d.forEach(v => v.key = d.key), d))
    }

    const svg = d3.select("#stack-bar-chart-area").append("svg")
      .attr("viewBox", "0, 0, width, height")
      .call(zoom)
      .on("mousemove", function (event) {
        let coordinate = d3.pointer(event);
        // @ts-ignore
        let pokemon = data.find(e => e.Name === y.invert(coordinate[1]));
        if (!pokemon) {
          return
        }

        svg.selectAll(".tooltip text.Number").text("ID:" + pokemon.Number);
        svg.selectAll(".tooltip text.Name").text("Name:" + pokemon.Name);
        if (pokemon.Type_2 == null) {
          svg.selectAll(".tooltip text.Type").text("Type:" + pokemon.Type_1 + "");
        } else {
          svg.selectAll(".tooltip text.Type").text("Type:" + pokemon.Type_1 + "&" + pokemon.Type_2);
        }
        svg.selectAll(".tooltip text.Total").text("Total:" + pokemon.Total);
        svg.selectAll(".tooltip text.HP").text("HP:" + pokemon.HP);
        svg.selectAll(".tooltip text.Attack").text("Attack:" + pokemon.Attack);
        svg.selectAll(".tooltip text.Defense").text("Defense:" + pokemon.Defense);
        svg.selectAll(".tooltip text.Sp_Atk").text("Sp_Atk:" + pokemon.Sp_Atk);
        svg.selectAll(".tooltip text.Sp_Def").text("Sp_Def:" + pokemon.Sp_Def);
        svg.selectAll(".tooltip text.Speed").text("Speed:" + pokemon.Speed);
        svg.selectAll(".tooltip text.Color").text("Color:" + pokemon.Color);
        if (pokemon.Egg_Group_2 == null) {
          svg.selectAll(".tooltip text.Egg_Group").text("Egg_Group:" + pokemon.Egg_Group_1 + "");
        } else {
          svg.selectAll(".tooltip text.Egg_Group").text("Egg_Group:" + pokemon.Egg_Group_1 + "&" + pokemon.Egg_Group_2);
        }
        svg.selectAll(".tooltip text.Height").text("Height:" + pokemon.Height_m + "m");
        svg.selectAll(".tooltip text.Weight").text("Weight:" + pokemon.Weight_kg + "kg");
        svg.selectAll(".tooltip text.Catch_Rate").text("Catch Rate:" + pokemon.Catch_Rate);
        svg.selectAll(".tooltip text.Body_Style").text("Body Style:" + pokemon.Body_Style);
      });

    svg.append("g")
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
      .attr("y", (d, i) => y(d.data.Name))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());

    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "white")
      .attr("width", width)
      .attr("height", margin.top);
    svg.append("g")
      .attr("class", "tooltip")
      .attr("transform", "translate(" + (width - margin.right - 200) + ",50)");

    let tooltipg = svg.selectAll(".tooltip");
    tooltipg.append("rect")
      .attr("width", 200)
      .attr("height", 400)
      .attr("fill", "yellowgreen");

    tooltipg.append("text")
      .attr("class", "Number")
      .attr("y", 20);
    tooltipg.append("text")
      .attr("class", "Name")
      .attr("y", 40);
    tooltipg.append("text")
      .attr("class", "Type")
      .attr("y", 60);
    tooltipg.append("text")
      .attr("class", "Total")
      .attr("y", 80);
    tooltipg.append("text")
      .attr("class", "HP")
      .attr("y", 100);
    tooltipg.append("text")
      .attr("class", "Attack")
      .attr("y", 120);
    tooltipg.append("text")
      .attr("class", "Defense")
      .attr("y", 140);
    tooltipg.append("text")
      .attr("class", "Sp_Atk")
      .attr("y", 160);
    tooltipg.append("text")
      .attr("class", "Sp_Def")
      .attr("y", 180);
    tooltipg.append("text")
      .attr("class", "Speed")
      .attr("y", 200);
    tooltipg.append("text")
      .attr("class", "Height")
      .attr("y", 220);
    tooltipg.append("text")
      .attr("class", "Weight")
      .attr("y", 240);
    tooltipg.append("text")
      .attr("class", "Catch_Rate")
      .attr("y", 260);
    tooltipg.append("text")
      .attr("class", "Egg_Group")
      .attr("y", 280);
    tooltipg.append("text")
      .attr("class", "Color")
      .attr("y", 300);
    tooltipg.append("text")
      .attr("class", "Body_Style")
      .attr("y", 320);


    svg.append("g")
      .attr("class", "x-axis")
      .call(xAxis);

    svg.node();

  }, [])

  return <div id="stack-bar-chart-area"></div>
}