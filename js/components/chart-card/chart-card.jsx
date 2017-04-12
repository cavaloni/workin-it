import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import ReactDom from 'react-dom';
// import GoogleChart from 'react-googlecharts/build/components/GoogleChart';

const styles = {
    container: {
        display: 'inline-block',
        width: '90%',
        overflow: 'hidden',
        margin: 15,
        padding: 10,
        '@media (min-width: 500px)': {
            width: '45%',
        },
    },
};

function processChartData(type, pData) {
    const chartData = pData.map((dataSet) => {
        const week = moment().week(Number(dataSet.week)).format('MM/DD');
        return Object.keys(dataSet).filter(datum => datum === type)
                .map(filteredDatum => [week, dataSet[filteredDatum]]);
    }).reduce((acc, cur) => acc.concat(cur), []);
    const rangeData = chartData.map(datum => datum[1]);
    const range = [Math.min.apply(null, rangeData), Math.max.apply(null, rangeData)];
    return { range, chartData };
}

class ExerciseChart extends Component {

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
                    range[0] = (range[0] * -0.25) + range[0];
                    range[1] = (range[1] * 0.25) + range[1];
                    chartData.unshift(['Week', 'Weight']);
                    break;
                }
            case 'reps':
                {
                    title = `Reps in ${this.props.exercise} ${week}`;
                    ({ chartData, range } = processChartData('reps', this.props.data));
                    range[0] = (range[0] * -0.25) + range[0];
                    range[1] = (range[1] * 0.25) + range[1];
                    chartData.unshift(['Week', 'Reps']);
                    break;
                }
        }

        const options = {
            title,
            curveType: 'function',
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
        const chart = new google.visualization.SteppedAreaChart(ReactDom.findDOMNode(this));
        chart.draw(data, options);
    }

    render() {
        return (
            <Paper style={styles.container} />
        );
    }
}

ExerciseChart.propTypes = {
    // how many sets the user selects
    week: React.PropTypes.number.isRequired,
    // the name of the exercise
    type: React.PropTypes.string.isRequired,
    // boolean to start the saving process in this component and its
    // potential set-item children
    data: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]).isRequired,
    // name of the exercise
    exercise: React.PropTypes.string.isRequired,
};

export default ExerciseChart;
