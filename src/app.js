import {} from 'd3';
import {select, selectAll} from 'd3-selection';
import {extent} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {csv} from 'd3-fetch';
import {line} from 'd3';
import {scaleLinear, scaleBand} from 'd3-scale';
import {interpolateRainbow} from 'd3-scale-chromatic';
import vegaEmbed from 'vega-embed';
import Isotype from './isotype';
import Isotype2 from './isotype2'
const groupBy = require('lodash.groupby');
const state = {Name: 'Canada', Year: 2018};

const createmap = map()
const createmap2 = map2()
createbar()
createbar2()
createline()
createline2()
isotype()
isotype2()

const slides = [
  {
    content1: "The U.S. currently trades with more than 200 countries and the U.S. is the world's largest trading nation in goods and services (source: The Office of the USTR). Here, you can explore how much the U.S. has traded with other countries. You can stay on this page to see the details on exports or navigate using the buttons on top of this page to see the details on imports. First, try hovering on the right map to explore how much the U.S. exported to each country in total during the WTO period between 1995 and 2018, where the darker the country is in blue, the more the U.S. had exported.",
    render: () => {selectAll('.slide').style('display', 'none');
      select('#slide-detail1').style('display', 'flex');},
  },
  {
    content1: "On this page, you can see the details on how much the U.S. imported from other countries, both at the country level as well as at the product level during the WTO period between 1995 and 2018. Note that the U.S. imported significantly more from its major trading partners, such as China, Canada and Mexico, than the amount it exported to. Similar to the export page, you can use the dropdowns below to explore more details on what and how much the U.S. imported from other countries around the world.",
    render: () => {selectAll('.slide').style('display', 'none');
      select('#slide-detail2').style('display', 'flex');},
  },
];

function main() {
  let currentSlideIdx = 0;
  const updateState = newIdx => {
    currentSlideIdx = newIdx;
    renderSlide();
  };

  select('#export-button').on('click', () =>
    updateState(0),
  );
  select('#import-button').on('click', () =>
    updateState(1),
  );

  function renderSlide() {
    const currentSlide = slides[currentSlideIdx];
    select(`#slide${currentSlideIdx + 1}-content h5`).text(currentSlide.content1);
    currentSlide.render();
  }
  renderSlide();
}

main();

function isotype() {
  vegaEmbed('#isotypegraph', Isotype('Canada', 2018));
}

function map() {
  //leveraged the following code for the map (https://www.d3-graph-gallery.com/graph/choropleth_hover_effect.html)
  const mapwidth = 400;
  const mapheight = 150;

  const svgContainer = select('#worldmap')
    .append('div')
    .attr('class', 'map')
    .style('position', 'relative')

  const tooltip = svgContainer
    .append('div')
    .attr('id', 'tooltip2')
    .style('display', 'none');

  const svg = svgContainer
    .append('svg')
    .attr('height', mapheight)
    .attr('width', mapwidth);

  var path = d3.geoPath();
  var projection = d3
    .geoMercator()
    .scale(60)
    .center([0, 0])
    .translate([mapwidth / 2, mapheight / 2]);

  var data = d3.map();
  var colorScale = d3
    .scaleThreshold()
    .domain([100000/1000000, 1000000/1000000, 10000000/1000000, 30000000/1000000, 100000000/1000000, 500000000/1000000])
    .range(d3.schemeBlues[7]);

  d3.queue()
    .defer(
      d3.json,
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    )
    .defer(
      d3.csv,
      './us_export.csv',
      function(d) {
        data.set(d.code, +d.Amounts);
      },
    )
    .await(ready);
  
  function ready(error, topo) {
    
    let mouseOver = function(event, d) {
      d3.selectAll('.Country')
        .transition()
        .duration(2)
        .style('opacity', 0.5);
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('stroke', 'transparent');

      tooltip
        .html(() => {
          return `
            <span style='color: grey'>Country: ${d.properties.name}</span><br/>
            <span style='color: grey'>Amount: $${d.Amounts}B</span><br/>
          `;
 
        })
        .style('opacity', 1)
        .style('left', `${d.PageX}px`)
        .style('top', `${d.PageY}px`)
        .style('display', 'block');
    };

    let mouseLeave = function(event, d) {
      d3.selectAll('.Country')
        .transition()
        .duration(2)
        .style('opacity', 1);
      d3.select(this)
        .transition()
        .duration(200)
        .style('stroke', 'transparent')
        tooltip.style('opacity', 0);
    };

    svg
      .append('g')
      .selectAll('path')
      .data(topo.features)
      .enter()
      .append('path')
      .attr('d', d3.geoPath().projection(projection))
      .attr('fill', function(d) {
        d.Amounts = data.get(d.id) || 0;
        return colorScale(d.Amounts);
      })
      .style('stroke', 'transparent')
      .attr('class', function(d) {
        return 'Country';
      })
      .style('opacity', 0.8)
      .on('mouseover', mouseOver)
      .on('mouseleave', mouseLeave)
  }
  return ready;
}

function createbar() {
  const yDim2 = 'Amounts';
  csv('./us_export.csv')
    .then(barc);

  function barc(data) {
    const height2 = 150;
    const width2 = 550;
    const margin2 = {top: 5, bottom: 75, left: 60, right: 50};
    const plotWidth2 = width2 - margin2.left - margin2.right;
    const plotHeight2 = height2 - margin2.top - margin2.bottom;

    const byyear = groupBy(data, d => d['Year']);
    const years = Object.keys(byyear);
    const yearrange = [
      1995,
      1996,
      1997,
      1998,
      1999,
      2000,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015,
      2016,
      2017,
      2018,
    ];

    const cyeardropdown = select('#cyear')
      .append('div')
      .attr('class', 'cyeardd')
      .style('display', 'flex')
      .selectAll('.cyeardd')
      .data(['Year'])
      .join('div')
      .text(d => d);

    cyeardropdown
      .append('select')
      .on('change', (event, row) => {
        state.Year = event.target.value;
        renderbarc()
      })
      .selectAll('option')
      .data(dim => {
        return yearrange.map(key => ({key, dim}));
      })
      .join('option')
      .text(d => d.key)
      .property('selected', d => {
        return state[d.dim] === d.key;
      });

    const svgContainer2 = select('#barchart')
      .append('div')
      .attr('class', 'chart-container2')
      .style('position', 'relative');

    const svg2 = svgContainer2
      .append('svg')
      .attr('height', height2)
      .attr('width', width2)
      .append('g')
      .attr('transform', `translate(${margin2.left},${margin2.top})`);

    const yAxis2 = svg2
      .append('g')
      .attr('class', 'x-axis2')
      .attr('transform', `translate(0, 0)`);

    const xAxis2 = svg2
      .append('g')
      .attr('class', 'y-axis2')
      .attr('transform', `translate(0, ${plotHeight2})`);

    const yLabel2 = svg2
      .append('g')
      .attr('class', 'x-axis-label2')
      .attr('transform', `translate(${plotWidth2 / 2}, ${plotHeight2 + 40})`)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    const xLabel2 = svg2
      .append('g')
      .attr('class', 'y-axis-label2')
      .attr('transform', `translate(-30, ${plotHeight2 / 2})`)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    const myMax = (data, key) => Math.max(...data.map(x => x[key]));

    function renderbarc() {      
      let filteredData = data.filter(row => {
        return Number(row.Year) === Number(state.Year);
      });      

      let sorted = filteredData.sort((a, b) => d3.descending(Number(a.ExportDollar), Number(b.ExportDollar)))

      let top10data = sorted.slice(0, 20)

      let countrynames = [...new Set(top10data.map(d => d['Name']))]

      const yScale = scaleLinear()
        .domain([0, myMax(top10data, 'Amounts')])
        .range([plotHeight2, 0]);
      const xScale = scaleBand()
        .domain(countrynames)
        .range([0, plotWidth2]);

      xAxis2
        .call(
          axisBottom(xScale)
            .ticks(3)
            .tickSize(0),
        )
        .selectAll('text')
        .attr('font-size', '10px')
        .style('text-anchor', 'end')
        .attr('transform', function(d) {
          return 'translate(' + this.getBBox().height * -1 + ')rotate(-45)';
        });

      yAxis2.call(
        axisLeft(yScale)
          .ticks(3)
          .tickSize(0),
      ).selectAll('text')
      .attr('font-size', '10px');

      xLabel2.text('Value($B)');
      
      svg2
        .selectAll('rect')
        .data(top10data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(d['Amounts']))
        .attr('x', d => xScale(d['Name']))
        .attr('height', d => yScale(0) - yScale(d['Amounts']))
        .attr('width', 15)
        .attr('stroke', 'black')
        .attr('fill', (_, idx) => interpolateRainbow(idx / 40));
      
      svg2
        .selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return yScale(d['Amounts']); })
        .attr("height", function(d) { return yScale(0) - yScale(d['Amounts']); })
        .delay(function(d,i){ return(i*100)})
    }
    renderbarc();
  }
}

function createline() {
  csv('./us_export.csv').then(linec);

  function linec(data) {
    const width = 610;
    const height = 100;
    const margin = {top: 10, bottom: 30, left: 150, right: 20};
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const myMax = (data, key) => Math.max(...data.map(x => x[key]));
    const xDim = 'Year';
    const yDim = 'Amounts';
    const bycountry = groupBy(data, d => d['Name']);
    const countries = Object.keys(bycountry);

    const ccountrydropdown = select('#ccountry')
      .append('div')
      .attr('class', 'ccountrydd')
      .style('display', 'flex')
      .selectAll('.ccountrydd')
      .data(['Name'])
      .join('div')
      .text('Country');

    ccountrydropdown
      .append('select')
      .on('change', (event, row) => {
        state.Name = event.target.value;
        renderlinec();
      })
      .selectAll('option')
      .data(dim => {
        return countries.map(key => ({key, dim}));
      })
      .join('option')
      .text(d => {
        return d.key;
      })
      .property('selected', d => {
        return state[d.dim] === d.key;
      });

    const svgContainer = select('#linechart')
      .append('div')
      .attr('class', 'chart-container')
      .style('position', 'relative');

    const tooltip = svgContainer
      .append('div')
      .attr('id', 'tooltip')
      .style('display', 'none');

    const svg = svgContainer
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${plotHeight})`);

    const yAxis = svg.append('g').attr('class', 'x-axis');

    const lineFunc = line();

    const xLabel = svg
      .append('g')
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${plotWidth / 2}, ${plotHeight + 40})`)
      .append('text')
      .attr('text-anchor', 'middle');

    const yLabel = svg
      .append('g')
      .attr('class', 'y-axis-label')
      .append('text');

    function renderlinec() {
      const xScale = scaleLinear()
        .domain(extent(data, d => Number(d.Year)))
        .range([0, plotWidth]);
      const yScale = scaleLinear()
        .domain([0, myMax(data, 'Amounts')])
        .range([plotHeight, 0]);
      xAxis
        .call(
          axisBottom(xScale)
            .tickFormat(d3.format('d'))
            .tickSize(0),
        )
        .selectAll('text')
        .attr('transform', function(d) {
          return (
            'translate(' +
            this.getBBox().height * -1 +
            ',' +
            this.getBBox().height +
            ')rotate(-45)'
          );
        });
      yAxis.call(
        axisLeft(yScale)
          .ticks(3)
          .tickSize(0),
      );
      xLabel
        .text('Year')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('transform', `translate(0, 0)`);
      yLabel
        .text('Value($B)')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('transform', `rotate(-90)`)
        .attr('dx', '-60')
        .attr('dy', '-30');

      lineFunc.x(d => xScale(Number(d[xDim]))).y(d => yScale(Number(d[yDim])));

      let path = svg
      .selectAll('.country-line')
      .data(
        Object.entries(bycountry)
          .filter(([country, _]) => {
            return state.Name === country;
          })
          .map(([_, values]) => values),
      )
      .join('path')
      .attr('class', 'country-line')
      .attr('d', lineFunc)
      .attr('fill', 'none')
      .attr('stroke', 'palevioletred')
      .attr('stroke-width', 3);

      let totalLength = path.node().getTotalLength();

      path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

      svg
        .selectAll('circle')
        .data(
          ...Object.entries(bycountry)
            .filter(([country, _]) => {
              return state.Name === country;
            })
            .map(([_, values]) => values),
        )
        .join('circle')
        .attr('class', 'country-circle')
        .attr('r', 4)
        .attr('cx', d => xScale(Number(d[xDim])))
        .attr('cy', d => yScale(Number(d[yDim])))
        .attr('fill', 'palevioletred')
        .on('mouseover', function(event, d) {
          tooltip
            .html(() => {
              return `
                <span style='color: grey'>${d.Name}</span><br/>
                <span style='color: grey'>Year: ${d.Year}</span><br/>
                <span style='color: grey'>Amount: ${d['Current Gross']}</span><br/>
              `;
            })
            .style('opacity', 1)
            .style('left', `${xScale(d.Year)}px`)
            .style('top', `${yScale(d.Amounts) + 30}px`)
            .style('display', 'block');
        })
        .on('mouseout', function(event, d) {
          tooltip.style('opacity', 0);
        })
        .on("click", function(event, d) {
          vegaEmbed('#isotypegraph', Isotype(d.Name, d.Year)),
          d3.select("#selected-country").text(d.Name)
          d3.select("#selected-year").text(d.Year)
        })
    }
    renderlinec();
  }
}


function isotype2() {
  vegaEmbed('#isotypegraph2', Isotype2('Canada', 2018));
}

function map2() {
  const mapwidth = 400;
  const mapheight = 150;

  const svgContainer = select('#worldmap2')
    .append('div')
    .attr('class', 'map')
    .style('position', 'relative')

  const tooltip = svgContainer
    .append('div')
    .attr('id', 'tooltip2')
    .style('display', 'none');

  const svg = svgContainer
    .append('svg')
    .attr('height', mapheight)
    .attr('width', mapwidth);

  var path = d3.geoPath();
  var projection = d3
    .geoMercator()
    .scale(60)
    .center([0, 0])
    .translate([mapwidth / 2, mapheight / 2]);

  var data = d3.map();
  var colorScale = d3
    .scaleThreshold()
    .domain([100000/1000000, 1000000/1000000, 10000000/1000000, 30000000/1000000, 100000000/1000000, 500000000/1000000])
    .range(d3.schemeBlues[7]);

  d3.queue()
    .defer(
      d3.json,
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    )
    .defer(
      d3.csv,
      './us_import.csv',
      function(d) {
        data.set(d.code, +d.Amounts);
      },
    )
    .await(ready);
  
  function ready(error, topo) {
    let mouseOver = function(event, d) {
      d3.selectAll('.Country')
        .transition()
        .duration(2)
        .style('opacity', 0.5);
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('stroke', 'transparent');
  
      tooltip
        .html(() => {
          return `
            <span style='color: grey'>Country: ${d.properties.name}</span><br/>
            <span style='color: grey'>Amount: $${d.Amounts}B</span><br/>
          `;
 
        })
        .style('opacity', 1)
        .style('left', `${d.PageX}px`)
        .style('top', `${d.PageY + 30}px`)
        .style('display', 'block');
    };

    let mouseLeave = function(event, d) {
      d3.selectAll('.Country')
        .transition()
        .duration(2)
        .style('opacity', 1);
      d3.select(this)
        .transition()
        .duration(200)
        .style('stroke', 'transparent')
        tooltip.style('opacity', 0);
    };

    svg
      .append('g')
      .selectAll('path')
      .data(topo.features)
      .enter()
      .append('path')
      .attr('d', d3.geoPath().projection(projection))
      .attr('fill', function(d) {
        d.Amounts = data.get(d.id) || 0;
        return colorScale(d.Amounts);
      })
      .style('stroke', 'transparent')
      .attr('class', function(d) {
        return 'Country';
      })
      .style('opacity', 0.8)
      .on('mouseover', mouseOver)
      .on('mouseleave', mouseLeave)
      }
  return ready;
}

function createbar2() {
  const yDim2 = 'Amounts';
  csv('./us_import.csv')
    .then(barc);

  function barc(data) {
    const height2 = 150;
    const width2 = 550;
    const margin2 = {top: 5, bottom: 75, left: 60, right: 50};
    const plotWidth2 = width2 - margin2.left - margin2.right;
    const plotHeight2 = height2 - margin2.top - margin2.bottom;

    const byyear = groupBy(data, d => d['Year']);
    const years = Object.keys(byyear);
    const yearrange = [
      1995,
      1996,
      1997,
      1998,
      1999,
      2000,
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015,
      2016,
      2017,
      2018,
    ];

    const cyeardropdown = select('#cyear2')
      .append('div')
      .attr('class', 'cyeardd')
      .style('display', 'flex')
      .selectAll('.cyeardd')
      .data(['Year'])
      .join('div')
      .text(d => d);

    cyeardropdown
      .append('select')
      .on('change', (event, row) => {
        state.Year = event.target.value;
        renderbarc()
      })
      .selectAll('option')
      .data(dim => {
        return yearrange.map(key => ({key, dim}));
      })
      .join('option')
      .text(d => d.key)
      .property('selected', d => {
        return state[d.dim] === d.key;
      });

    const svgContainer2 = select('#barchart2')
      .append('div')
      .attr('class', 'chart-container2')
      .style('position', 'relative');

    const svg2 = svgContainer2
      .append('svg')
      .attr('height', height2)
      .attr('width', width2)
      .append('g')
      .attr('transform', `translate(${margin2.left},${margin2.top})`);

    const yAxis2 = svg2
      .append('g')
      .attr('class', 'x-axis2')
      .attr('transform', `translate(0, 0)`);

    const xAxis2 = svg2
      .append('g')
      .attr('class', 'y-axis2')
      .attr('transform', `translate(0, ${plotHeight2})`);

    const yLabel2 = svg2
      .append('g')
      .attr('class', 'x-axis-label2')
      .attr('transform', `translate(${plotWidth2 / 2}, ${plotHeight2 + 40})`)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    const xLabel2 = svg2
      .append('g')
      .attr('class', 'y-axis-label2')
      .attr('transform', `translate(-30, ${plotHeight2 / 2})`)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    const myMax = (data, key) => Math.max(...data.map(x => x[key]));

    function renderbarc() {      
      let filteredData = data.filter(row => {
        return Number(row.Year) === Number(state.Year);
      });      

      let sorted = filteredData.sort((a, b) => d3.descending(Number(a.Amounts), Number(b.Amounts)))

      let top10data = sorted.slice(0, 20)

      let countrynames = [...new Set(top10data.map(d => d['Name']))]

      const yScale = scaleLinear()
        .domain([0, myMax(top10data, 'Amounts')])
        .range([plotHeight2, 0]);
      const xScale = scaleBand()
        .domain(countrynames)
        .range([0, plotWidth2]);

      xAxis2
        .call(
          axisBottom(xScale)
            .ticks(3)
            .tickSize(0),
        )
        .selectAll('text')
        .attr('font-size', '10px')
        .style('text-anchor', 'end')
        .attr('transform', function(d) {
          return 'translate(' + this.getBBox().height * -1 + ')rotate(-45)';
        });

      yAxis2.call(
        axisLeft(yScale)
          .ticks(3)
          .tickSize(0),
      ).selectAll('text')
      .attr('font-size', '10px');

      xLabel2.text('Value($B)');
      
      svg2
        .selectAll('rect')
        .data(top10data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(d['Amounts']))
        .attr('x', d => xScale(d['Name']))
        .attr('height', d => yScale(0) - yScale(d['Amounts']))
        .attr('width', 15)
        .attr('stroke', 'black')
        .attr('fill', (_, idx) => interpolateRainbow(idx / 40));
      
      svg2
        .selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return yScale(d['Amounts']); })
        .attr("height", function(d) { return yScale(0) - yScale(d['Amounts']); })
        .delay(function(d,i){ return(i*100)})
    }
    renderbarc();
  }
}

function createline2() {
  csv('./us_import.csv').then(linec);

  function linec(data) {
    const width = 610;
    const height = 100;
    const margin = {top: 10, bottom: 30, left: 150, right: 20};
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const myMax = (data, key) => Math.max(...data.map(x => x[key]));
    const xDim = 'Year';
    const yDim = 'Amounts';
    const bycountry = groupBy(data, d => d['Name']);
    const countries = Object.keys(bycountry);

    const ccountrydropdown = select('#ccountry2')
      .append('div')
      .attr('class', 'ccountrydd')
      .style('display', 'flex')
      .selectAll('.ccountrydd')
      .data(['Name'])
      .join('div')
      .text('Country');

    ccountrydropdown
      .append('select')
      .on('change', (event, row) => {
        state.Name = event.target.value;
        renderlinec();
      })
      .selectAll('option')
      .data(dim => {
        return countries.map(key => ({key, dim}));
      })
      .join('option')
      .text(d => {
        return d.key;
      })
      .property('selected', d => {
        return state[d.dim] === d.key;
      });

    const svgContainer = select('#linechart2')
      .append('div')
      .attr('class', 'chart-container')
      .style('position', 'relative');

    const tooltip = svgContainer
      .append('div')
      .attr('id', 'tooltip')
      .style('display', 'none');

    const svg = svgContainer
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${plotHeight})`);

    const yAxis = svg.append('g').attr('class', 'x-axis');

    const lineFunc = line();

    const xLabel = svg
      .append('g')
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${plotWidth / 2}, ${plotHeight + 40})`)
      .append('text')
      .attr('text-anchor', 'middle');

    const yLabel = svg
      .append('g')
      .attr('class', 'y-axis-label')
      .append('text');

    function renderlinec() {
      const xScale = scaleLinear()
        .domain(extent(data, d => Number(d.Year)))
        .range([0, plotWidth]);
      const yScale = scaleLinear()
        .domain([0, myMax(data, 'Amounts')])
        .range([plotHeight, 0]);
      xAxis
        .call(
          axisBottom(xScale)
            .tickFormat(d3.format('d'))
            .tickSize(0),
        )
        .selectAll('text')
        .attr('transform', function(d) {
          return (
            'translate(' +
            this.getBBox().height * -1 +
            ',' +
            this.getBBox().height +
            ')rotate(-45)'
          );
        });
      yAxis.call(
        axisLeft(yScale)
          .ticks(3)
          .tickSize(0),
      );
      xLabel
        .text('Year')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('transform', `translate(0, 0)`);
      yLabel
        .text('Value($B)')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('transform', `rotate(-90)`)
        .attr('dx', '-60')
        .attr('dy', '-30');

      lineFunc.x(d => xScale(Number(d[xDim]))).y(d => yScale(Number(d[yDim])));

      let path = svg
      .selectAll('.country-line')
      .data(
        Object.entries(bycountry)
          .filter(([country, _]) => {
            return state.Name === country;
          })
          .map(([_, values]) => values),
      )
      .join('path')
      .attr('class', 'country-line')
      .attr('d', lineFunc)
      .attr('fill', 'none')
      .attr('stroke', 'palevioletred')
      .attr('stroke-width', 3);

      let totalLength = path.node().getTotalLength();

      path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

      svg
        .selectAll('circle')
        .data(
          ...Object.entries(bycountry)
            .filter(([country, _]) => {
              return state.Name === country;
            })
            .map(([_, values]) => values),
        )
        .join('circle')
        .attr('class', 'country-circle')
        .attr('r', 4)
        .attr('cx', d => xScale(Number(d[xDim])))
        .attr('cy', d => yScale(Number(d[yDim])))
        .attr('fill', 'palevioletred')
        .on('mouseover', function(event, d) {
          tooltip
            .html(() => {
              return `
                <span style='color: grey'>${d.Name}</span><br/>
                <span style='color: grey'>Year: ${d.Year}</span><br/>
                <span style='color: grey'>Amount: ${d['Current Gross']}</span><br/>
              `;
            })
            .style('opacity', 1)
            .style('left', `${xScale(d.Year)}px`)
            .style('top', `${yScale(d.Amounts) + 30}px`)
            .style('display', 'block');
        })
        .on('mouseout', function(event, d) {
          tooltip.style('opacity', 0);
        })
        .on("click", function(event, d) {
          vegaEmbed('#isotypegraph2', Isotype2(d.Name, d.Year)),
          d3.select("#selected-country2").text(d.Name)
          d3.select("#selected-year2").text(d.Year)
        })
    }
    renderlinec();
  }
}


