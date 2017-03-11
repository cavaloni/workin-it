import React, { Component } from 'react';
import { Chart } from 'react-google-charts';

const styles = {
    container: {
        display: 'inline-block',
        width: '49%',
        overflow: 'hidden',
    },
};

class ExampleChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                title: 'Weight Progress',
                hAxis: { title: '', minValue: 0, maxValue: 4 },
                vAxis: { title: 'Weight', minValue: 0, maxValue: 300 },
                legend: 'none',
            },
            data: [
        ['Week', 'Weight'],
        [1, 180],
        [2, 190],
        [3, 195],
        [4, 200],
            ],
        };
    }
    render() {
        return (
            <div style={styles.container}>
            <Chart
              chartType="SteppedAreaChart"
              data={this.state.data}
              options={this.state.options}
              graph_id={this.props.name}
              width="100%"
              height="200px"
              legend_toggle
              style={{overflow: 'hidden'}}
            />
            </div>
        );
    }
}
export default ExampleChart;
