function linec(data) {

    const width = 450;
    const height = 300;
    const margin = { top: 50, bottom: 50, left: 90, right: 20 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const myMax = (data, key) => Math.max(...data.map(x => x[key]))
    const xDim = 'Year'
    const yDim = 'ExportDollar'
    const bycountry = groupBy(data, d => d['Name'])
    const countries = Object.keys(bycountry)
    //console.log(columns)
    
    const dropdowns2 = select('#dropdown2')
      .append('div')
      .attr('class', 'dropdown2')
      .style('display', 'flex')
      .selectAll('.drop-down2')
      .data(['Country'])
      .join('div')
      .text(d => d);
    
    dropdowns2
      .append('select')
      .on('change', (event, row) => {
        state[row] = event.target.value;
        renderChart();
        vegaEmbed('#isotypegraph', Isotype(state[row]))
      })
      .selectAll('option')
      .data(dim => {
        console.log(countries.map(key => ({ key, dim })))
        return countries.map(key => ({ key, dim })) 
      })
      .join('option')
      .text(d => d.key)
      .property('selected', d => {
        //console.log('hi', d)
        //console.log(d.key)
        return state[d.dim] === d.key;
      })

    const svg = select('#linechart')
      .append('div')
      .attr('class', 'line')
  //    .style('position', 'relative');
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${plotHeight})`);

    const yAxis = svg
      .append('g')
      .attr('class', 'x-axis');

    const lineFunc = line()

    const xLabel = svg
      .append('g')
      .attr('class', 'x-axis-label')
      .attr('transform', `translate(${plotWidth / 2}, ${plotHeight + 40})`)
      .append('text')
      .attr('text-anchor', 'middle');

    const yLabel = svg
      .append('g')
      .attr('class', 'y-axis-label')
      .append('text')

    const tooltip = svg
      .append('div')
      .attr('id', 'tooltip')
      .style('display', 'none');


    function renderlinec() {
      const xScale = scaleLinear().domain(extent(data, d => Number(d.Year))).range([0, plotWidth]);
      const yScale = scaleLinear().domain([0, myMax(data, 'ExportDollar')]).range([plotHeight, 0]);
      xAxis.call(axisBottom(xScale))//.tickFormat(timeFormat("%Y"))); //applying timeFormat only repeats the same year
      yAxis.call(axisLeft(yScale));
      xLabel
      .text('Year')
      .attr("font-size", "10px")
      .attr('font-weight', 'bold')
      .attr('transform', `translate(0, 0)`)
      yLabel
      .text('Trade Value (in thousand USD)')
      .attr("font-size", "10px")
      .attr('font-weight', 'bold')
      .attr('transform', `rotate(-90)`)
      .attr("dx", "-185")
      .attr("dy", "-75")
      //.attr('transform', `translate(-100, 80)`)
          
      lineFunc
        .x(d => xScale(Number(d[xDim])))
        .y(d => yScale(Number(d[yDim])))
      svg
        //.append('g')
        .selectAll('.country-line')
        .data(Object.entries(bycountry).filter(([country, _]) => {
          return state.Name === country;
        }).map(([_, values]) => values))
        .join('path')
        .attr('class', 'country-line')
        .attr('d', lineFunc)
        .attr('fill', 'none')
        .attr("stroke-width", 1)
        .attr('stroke', (_, idx) => interpolateRainbow(idx / 231))
      /*
            Object.entries(mydata).filter(([country, _]) => {
          
          return state.Name === country;
        }).forEach(([key, value], idx) => {
          value = value.filter(row => {
            return [Number.isFinite(row[xDim]), Number.isFinite(row[yDim])]
          })
    
          svg
          //.append('g')
            .selectAll('.country-line')
            .data([value])
            .join('path')
            .attr('class', 'country-line')
            .attr('d', lineFunc)
            .attr('fill', 'none')
            .attr("stroke-width", 1)
            .attr('stroke', interpolateRainbow(idx / 231))
          //.on('mouseover', function (e, d) { //work from here
          //.on('mouseout', function (e, d) {
          //tooltip.style("opacity", 0);
          //})
          
        });
        */
    }
    renderlinec()
  }

//export default linec;