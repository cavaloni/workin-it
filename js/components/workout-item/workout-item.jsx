import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Observable } from 'rxjs';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import _ from 'lodash';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SetListItem from '../set-list-item/set-list-item';


const O = Observable;

class WorkoutItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.styles = {
            container: {
                paddingTop: '0px',
            },
            name: {
                margin: '13px',
                width: '140px',
                display: 'inline-block',
                height: '100%',
            },
            numberFields: {
                width: '50px',
                display: 'inline-block',
                marginRight: 10,
                verticalAlign: 'bottom',
            },
            checkbox: {
                marginBottom: 16,
                width: '100%',
            },
            divide: {
                marginBottom: 5,
            },
            select: {
                display: 'inline-block',
                marginRight: 10,
                verticalAlign: 'bottom',
            },
            delete: {
                verticalAlign: 'bottom',
            },
        };

        this.state = {
            reps: 0,
            weight: 0,
            sets: 0,
            setsVal: 1,
            showSets: false,
            triggerSave: props.triggerSave,
            setsData: [],
            modalDeleteOpen: false,
            buttonColor: 'white',
            errTxtReps: '',
            errTxtWeight: '',
        };

        this.onNumberChange = this.onNumberChange.bind(this);
        this.setsButton = this.setsButton.bind(this);
        this.getSetsData = this.getSetsData.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.setSelectField = this.setSelectField.bind(this);
        this.populateWeek = this.populateWeek.bind(this);
        this.modalDelete = this.modalDelete.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sets === true) {
            this.setState({ showSets: false });
        }
        if (nextProps.triggerSave) {
            this.saveAll();
        }
        if (nextProps.populateWeek) {
            this.populateWeek();
        }
        if (!nextProps.sets && (nextProps.sets !== this.props.sets) &&
            this.state.buttonColor === 'white') {
            this.setState({ buttonColor: '#80DEEA' });
        }
    }

    componentDidUpdate() {
        if (this.state.buttonColor === '#80DEEA') {
            O.interval(760)
                .take(1)
                .subscribe(() => this.setState({ buttonColor: 'white' }));
        }
        if ((this.state.errTxtReps !== '') || (this.state.errTxtWeight !== '')) {
            O.interval(2000)
                .take(1)
                .subscribe(() => this.setState({ errTxtReps: '', errTxtWeight: '' }));
        }
    }

    onNumberChange(e) {
        const type = e.target.id === 'reps' ? 'errTxtReps' : 'errTxtWeight';
        let shower = this.state.showSets;
        if (e.target.value === 0) {
            shower = false;
        }
        if (isNaN(Number(e.target.value))) {
            this.setState({
                [type]: 'Invalid Input',
            });
        } else {
            this.props.changed();
            this.setState({
                [type]: '',
                [e.target.id]: e.target.value,
                showSets: shower,
            });
        }
    }

    setSelectField(e, idx, value) {
        this.props.changed();
        this.setState({ sets: value, setsVal: value });
    }

    setsButton(e) {
        e.preventDefault();
        if (this.state.sets !== 0) {
            this.setState({ showSets: !this.state.showSets });
        }
    }

    getSetsData(setData) {
        const setsDataCopy = Array.from(this.state.setsData);
        const setTypeKey = Object.keys(setData)[0];
        setsDataCopy[setData.setNum] = Object.assign(
            {},
            setsDataCopy[setData.setNum],
            { [setTypeKey]: setData[setTypeKey] },
            );
        this.setState({ setsData: setsDataCopy });
    }

    saveAll() {
        const firstSet = {
            reps: this.state.reps,
            weight: this.state.weight,
        };
        const setsDataCopy = Array.from(this.state.setsData);
        setsDataCopy.unshift(firstSet);
        this.props.saved(setsDataCopy, this.props.item, this.state.sets);
    }

    populateWeek() {
        const weekData = this.props.weekData;
        const dbWrktName = _.camelCase(this.props.item);
        const grpName = this.props.exerciseGroup.toLowerCase();
        if (!weekData[grpName]) {
            this.setState({ sets: 0, weight: 0, reps: 0, setsData: [] });
        }
        const { sets } = weekData[grpName][dbWrktName];
        const { weight, reps } = weekData[grpName][dbWrktName].data[0];
        const setsData = weekData[grpName][dbWrktName].data.slice(1);
        const setsVal = Number(sets);
        this.setState({ sets, weight, reps, setsData, setsVal });
        this.props.populatedCallback(true);
    }

    modalDelete(e) {
        if (!e.currentTarget.parentElement.getElementsByTagName('button')[0].children[0]) {
            this.eNameToDelete = e.currentTarget.parentElement.getElementsByTagName('button')[0].childNodes[0].data;
        } else { this.eNameToDelete = e.currentTarget.parentElement.getElementsByTagName('button')[0].children[0].innerText; }
        this.setState({ modalDeleteOpen: true });
    }

    handleModalClose() {
        this.setState({ modalDeleteOpen: false });
    }

    confirmDelete() {
        this.props.changed();
        this.setState({ modalDeleteOpen: false });
        this.props.delete(this.eNameToDelete);
        this.eNameToDelete = '';
    }

    render() {
        const modalActions = [
            <FlatButton
              label="Cancel"
              primary
              onTouchTap={this.handleModalClose}
            />,
            <FlatButton
              label="Confirm"
              primary
              onTouchTap={this.confirmDelete}
            />,
        ];

        if (this.props.populateWeek) { this.populateWeek(); }

        const items = [];
        for (let i = 1; i < 16; i += 1) {
            items.push(<MenuItem value={i} key={i} primaryText={`${i} Sets`} />);
        }

        const setList = [];
        if (this.state.showSets) {
            for (let i = 1; i < Number(this.state.sets); i += 1) {
                setList.push(<SetListItem
                  populateValue={this.state.setsData[i - 1]}
                  set={i}
                  getData={this.getSetsData}
                />);
            }
        }

        return (
            <div style={this.styles.container}>
                <Dialog
                  key={1}
                  title="Confirm Delete"
                  actions={modalActions}
                  open={this.state.modalDeleteOpen}
                />
                <div>
                    <RaisedButton
                      disabledBackgroundColor={'white'}
                      backgroundColor={this.state.buttonColor}
                      style={this.styles.name}
                      disabled={this.props.sets}
                      onClick={this.setsButton}
                    >
                        {this.props.item}
                    </RaisedButton>
                    <TextField
                      id="reps"
                      strategy="ignore"
                      value={this.state.reps}
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Reps"
                      min={0}
                      max={100}
                      errorText={this.state.errTxtReps}
                    />
                    <TextField
                      id="weight"
                      value={this.state.weight}
                      strategy="ignore"
                      onChange={this.onNumberChange}
                      style={this.styles.numberFields}
                      floatingLabelText="Weight"
                      min={0}
                      max={900}
                      errorText={this.state.errTxtWeight}
                    />
                    <SelectField
                      value={this.state.setsVal}
                      onChange={this.setSelectField}
                      maxHeight={200}
                      style={this.styles.select}
                      hintText="Sets"
                    >
                        {items}
                    </SelectField>
                    <IconButton
                      style={this.styles.delete}
                      onTouchTap={this.modalDelete}
                      tooltip="Delete"
                    >
                        <ActionDelete />
                    </IconButton>
                </div>
                {setList}
                <Divider style={this.styles.divide} />
            </div>
        );
    }
}

WorkoutItem.propTypes = {
    // indicates if the sets are the same throughout the workout
    sets: React.PropTypes.bool.isRequired,
    // the name of the exercise
    item: React.PropTypes.string.isRequired,
    // boolean to start the saving process in this component and its
    // potential set-item children
    triggerSave: React.PropTypes.bool.isRequired,
    // function that lets this component know when population of data to children
    // has completed
    populatedCallback: React.PropTypes.func.isRequired,
    // boolean to trigger this component to populate the data from props.weekData
    populateWeek: React.PropTypes.bool.isRequired,
    // callback to parent component, workout-card, to send the name of item to delete
    delete: React.PropTypes.func.isRequired,
    // callback letting parent component know that the user has modified a field
    changed: React.PropTypes.func.isRequired,
    // the group of exercise (arms, legs, etc)
    exerciseGroup: React.PropTypes.string.isRequired,
    // the redux connected oneWeekData
    weekData: React.PropTypes.shape({}),
    // callback to send save data from this component and its children to parent
    saved: React.PropTypes.func.isRequired,
};

WorkoutItem.defaultProps = {
    weekData: {},
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    weekData: state.oneWeekData,
});


export default connect(mapStateToProps)(WorkoutItem);
