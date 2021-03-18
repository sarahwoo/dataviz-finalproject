import myData from './isodata.json';
function makeIso(country, year) {
  return {
    config: {
      title: {font: 'Verdana'},
      subtitle: {font: 'Verdana'},
      axis: {labelFont: 'Verdana', titleFont: 'Verdana'},
      header: {labelFont: 'Verdana', titleFont: 'Verdana'},
      legend: {labelFont: 'Verdana', titleFont: 'Verdana'},
      view: {strokeWidth: 0},
    },
    data: {name: 'data-aa6ffc56f786323b1a75e18d7a30e801'},
    mark: {type: 'text', baseline: 'middle', size: 15},
    encoding: {
      text: {type: 'nominal', field: 'Emoji'},
      x: {type: 'ordinal', axis: {title: null}, field: 'x'},
      y: {type: 'nominal', axis: {title: null}, field: 'Product'},
    },
    height: 250,
    transform: [
      {window: [{op: 'rank', field: '', as: 'x'}], groupby: ['Product']},
    ],
    width: 350,
    $schema: 'https://vega.github.io/schema/vega-lite/v4.8.1.json',
    datasets: {
      'data-aa6ffc56f786323b1a75e18d7a30e801': myData.filter(
        x => x.Name === country && Number(x.Year) === Number(year),
      ),
    },
  };
}

export default makeIso;
