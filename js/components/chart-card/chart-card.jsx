import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import Paper from 'material-ui/Paper';
import moment from 'moment';

const styles = {
    container: {
        display: 'inline-block',
        width: '45%',
        overflow: 'hidden',
        margin: 15,
    },
};

function processChartData(type, pData) {
    const chartData = pData.map((dataSet) => {
        const index = pData.indexOf(dataSet);
        return Object.keys(dataSet).filter(datum => datum === type)
                .map(filteredDatum => [index, dataSet[filteredDatum]]);
    }).reduce((acc, cur) => acc.concat(cur), []);
    const rangeData = chartData.map(datum => datum[1]);
    const range = [Math.min.apply(null, rangeData), Math.max.apply(null, rangeData)];
    return { range, chartData };
}

class ExerciseChart extends React.Component {
    constructor(props) {
        super(props);
        const parsedChartData = props.data.slice(1, 5);
        console.log(parsedChartData);
        let title;
        let chartData;
        let range;
        const week = `${moment()
            .week(props.week)
            .subtract(4, 'week')
            .subtract(1, 'day')
            .format('MMM, Do, YYYY')} through ${moment().week(props.week)
            .subtract(1, 'day')
            .format('MMM, Do, YYYY')}`;
        switch (props.type) {
            case 'weights':
                {
                    title = `Weights in ${props.exercise} ${week}`;
                    ({ chartData, range } = processChartData('weight', props.data));
                    range[1] = range[1] * .25 + range[1];
                    console.log(range);
                    chartData.unshift(['Week', 'Weight']);
                    break;
                }
            case 'reps':
                {
                    title = `Reps in ${props.exercise} ${week}`;
                    ({ chartData, range } = processChartData('reps', props.data));
                    chartData.unshift(['Week', 'Reps']);
                    break;
                }
        }
        this.state = {
            options: {
                title,
                hAxis: { title: 'Week', minValue: 0, maxValue: 4, gridlines: { color: '#ffffff' }, baselineColor: '#b7b7b7' },
                vAxis: { title: 'Weight', minValue: 0, maxValue: range[1], gridlines: { color: '#ffffff' }, baselineColor: '#b7b7b7' },
                legend: 'none',
                fontName: 'Roboto',
                fontSize: 13,
            },
            data: chartData,
        };
    }
    render() {
        return (

            <Paper style={styles.container}>
                <Chart
                  chartType="SteppedAreaChart"
                  data={this.state.data}
                  options={this.state.options}
                  graph_id={this.props.name}
                  width="100%"
                  height="200px"
                  legend_toggle
                  style={{ overflow: 'hidden' }}
                />

            </Paper>
        );
    }
}
export default ExerciseChart;
