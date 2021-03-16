const yearrange = [1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]

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
  state[row] = event.target.value;
  vegaEmbed('#isotypegraph', Isotype(state[row]))
})
.selectAll('option')
.data(dim => {
//  console.log(yearrange.map(key => ({ key, dim })))
  return yearrange.map(key => ({ key, dim }))}
  )
.join('option')
.text(d => d.key)
.property('selected', d => {
  console.log(d.dim)
  return state[d.dim] === d.key;})

  .on('change', function (event) {
    state[row] = event.target.value;
    vegaEmbed()
  })


</div>
  
<div class="flex-down">
  <div class="flex">
    <div id="ccountry" class="flex"></div>
    <div id="cyear" class="flex"></div>
  </div>
  <div class="flex">
    <div id="linechart"></div>
    <div id="isotypegraph" class="iso"></div>     
  </div>


  function makeIso(country) {
return 

  .filter(x => x.Name === country)
  }
};
}

//.filter(x => x.Name === country)
//.filter(([country, year]) => {return (state.Name === country) && (state.Year === year)}).map(([_, values]) => values))

export default makeIso;