import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import ReactDom from 'react-dom';
// import GoogleChart from 'react-googlecharts/build/components/GoogleChart';

const styles = {
    container: {
        display: 'inline-block',
        width: '45%',
        overflow: 'hidden',
        margin: 15,
        padding: 10,
    },
};

function processChartData(type, pData) {
    console.log(pData);
    const chartData = pData.map((dataSet) => {
        const index = pData.indexOf(dataSet);
        return Object.keys(dataSet).filter(datum => datum === type)
                .map(filteredDatum => [index, dataSet[filteredDatum]]);
    }).reduce((acc, cur) => acc.concat(cur), []);
    const rangeData = chartData.map(datum => datum[1]);
    const range = [Math.min.apply(null, rangeData), Math.max.apply(null, rangeData)];
    return { range, chartData };
}

class ExerciseChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawCharts();
    }

    componentDidUpdate() {
        this.drawCharts();
    }

    drawCharts() {
        let title;
        let chartData;
        let range;
        const week = `${moment()
            .week(this.props.week)
            .subtract(4, 'week')
            .subtract(1, 'day')
            .format('MMM, Do, YYYY')} through ${moment().week(this.props.week)
            .subtract(1, 'day')
            .format('MMM, Do, YYYY')}`;
        switch (this.props.type) {
            case 'weights':
                {
                    title = `Weights in ${this.props.exercise} ${week}`;
                    ({ chartData, range } = processChartData('weight', this.props.data));
                    range[0] = range[0] * -0.25 + range[0];
                    range[1] = range[1] * 0.25 + range[1];
                    chartData.unshift(['Week', 'Weight']);
                    console.log(range);
                    break;
                }
            case 'reps':
                {
                    title = `Reps in ${this.props.exercise} ${week}`;
                    ({ chartData, range } = processChartData('reps', this.props.data));
                    range[0] = range[0] * -0.25 + range[0];
                    range[1] = range[1] * 0.25 + range[1];
                    chartData.unshift(['Week', 'Reps']);
                    break;
                }
        }

        console.log(chartData);
        const options = {
            title,
            curveType: 'function',
            animation: {
                startup: true,
                duration: 750,
                easing: 'out',
            },
            legend: { position: 'none' },
            fontName: 'Roboto',
            fontSize: 14,
            hAxis: {
                gridlines: { color: '#ffffff' },
                ticks: [1, 2, 3, 4],
                title: 'Week',
                minValue: 0,
            },
            vAxis: {
                gridlines: { color: '#ffffff' },
                minValue: range[0],
                maxValue: range[1],
                title: this.props.exercise,
                viewWindowMode: 'pretty',
                viewWindow: { min: range[0], max: range[1] },
            },
        };
        const data = new google.visualization.arrayToDataTable(chartData);
        const chart = new google.visualization.LineChart(ReactDom.findDOMNode(this));
        chart.draw(data, options);
    }

    render() {
        return (
            <Paper style={styles.container} />
        );
    }
}
export default ExerciseChart;
