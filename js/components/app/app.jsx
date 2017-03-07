import React, { Component } from 'react';
import styles from './styles.css';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div />;
  }
}

App.propTypes = {
  children: React.PropTypes.node.isRequired,
};
