import './main.css';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis'
import { csv } from 'd3-fetch';
import { scaleLinear, scaleBand } from 'd3-scale';
import { interpolateRainbow, interpolateTurbo } from 'd3-scale-chromatic'

fetch('./data/us_export.csv')
    .then(response => response.json())
    .then(data => myVis(data))
    .catch(e => {
        console.log(e);
    });

function myVis(data) {
    const width2 = 500;
    const height2 = 3000;
    const margin2 = { top: 120, bottom: 100, left: 250, right: 50 };
    const plotWidth2 = width2 - margin2.left - margin2.right;
    const plotHeight2 = height2 - margin2.top - margin2.bottom;

    const columns = Object.keys(data[0])
    const xDim2 = 'ExportDollar'
    const yDim2 = 'Name'

    const dropdowns2 = select('#barchart')
        .append('div')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .selectAll('.drop-down')
        .data(['Year'])
        .join('div');

    dropdowns2.append('div').text(d => d);

    dropdowns2
        .append('select')
        .on('change', (event, x) => {
            if (x === 'Year') {
                xcol2 = event.target.value;
            }
            renderChart2();
        })
        .selectAll('option')
        .data(data) //dim => columns.map(key => ({ key, dim })) ?
        .join('option')
        .text(d => d['Year'])
    //.property('selected', d => d.key === (d.dim === 'xCol' ? xCol : yCol)) //what is this doing?

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

    const xAxis2 = svg2
        .append('g')
        .attr('class', 'x-axis2')
        .attr('transform', `translate(0, ${plotHeight2})`)

    const yAxis2 = svg2
        .append('g')
        .attr('class', 'y-axis2')
        .attr('transform', `translate(0, 0)`)
    //    .attr('fill', (_, idx) => interpolateRainbow(idx / 231)); why not working?

    const xLabel2 = svg2
        .append('g')
        .attr('class', 'x-axis-label2')
        .attr('transform', `translate(${plotWidth2 / 2}, ${plotHeight2 + 40})`)
        .append('text')
        .attr('text-anchor', 'middle');

    const yLabel2 = svg2
        .append('g')
        .attr('class', 'y-axis-label2')
        .attr('transform', `translate(-200, ${plotHeight2 / 2})`)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(-90)`);

    const tooltip = svgContainer2
        .append('div')
        .attr('id', 'tooltip')
        .style('display', 'none');

    const all_countrynames = [...new Set(data.map(d => d['Name']))]
    const myMax = (data, key) => Math.max(...data.map(x => x[key]))

    function renderChart2() {
        const xScale = scaleLinear().domain([0, myMax(data, 'ExportDollar')]).range([0, plotWidth2]);
        const yScale = scaleBand().domain(all_countrynames).range([0, plotHeight2]);
        xAxis2.call(axisBottom(xScale).ticks(3).tickSize(0));
        yAxis2.call(axisLeft(yScale));
        xLabel2.text('Trade Value (in thousand U.S. dollars)')
        yLabel2.text('Countries')

        svg2
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => xScale(d['ExportDollar']))
            .attr('y', d => yScale(d['Name']))
            .attr('width', d => xScale(d['ExportDollar']))
            .attr('height', 5)
            .attr('stroke', 'black')
            .attr('fill', (_, idx) => interpolateRainbow(idx / 231)) //how to also change colors for ylabel texts?
            /* nothing shows up in the console.log for below line
              .on('mouseenter', (e, d) => {
                console.log(e, d)
              })
            */
            .on('mouseenter', function (d, x) {
                tooltip
                    .style('display', 'block')
                    .style('left', `${d.offsetX}px`) //what is this offsetX?
                    .style('top', `${d.offsetY}px`)
                    .text(d.Name); //x.Name?
            })
            .on('mouseleave', function (d, x) {
                tooltip.style('display', 'none').text('');
            });
    }
    renderChart2()
}