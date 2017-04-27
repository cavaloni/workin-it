import React, { Component } from 'react';
import { compose } from 'redux';
import Scroll from 'react-scroll';
import injectSheet from 'react-jss';
import moment from 'moment';
import qs from 'qs';
// import _ from 'lodash';
import findIndex from 'lodash/findIndex';
import some from 'lodash/some';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import makeSelectable from 'material-ui/List/makeSelectable';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PersonOutline from 'material-ui/svg-icons/social/person-outline';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import { Observable as O } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/interval';
import { connect } from 'react-redux';
import Progress from '../progress/progress';
import * as actions from '../../actions/index';

const { Element } = Scroll;
const { Events } = Scroll;
const { scroller } = Scroll;

const SelectableList = makeSelectable(List);

const style = {
    friendSearch: {
        width: '90%',
        maxHeight: 500,
        overflow: 'auto',
        display: 'inline-block',
        verticalAlign: 'top',
        marginBottom: '30px',
    },
    friendsBoxes: {
        width: '90%',
        maxHeight: 500,
        overflow: 'auto',
        display: 'inline-block',
        verticalAlign: 'top',
        marginBottom: '30px',
    },
    '@media (min-width: 700px)': {
        friendSearch: {
            width: '41%',
            marginLeft: '5%',
        },
        friendsContainer: {
            display: 'inline-block',
            width: '41%',
            marginLeft: '5%',
        },
    },
    friendReq: {
        padding: '20px',
    },
    heading: {
        marginTop: 0,
        textAlign: 'center',
        background: 'rgba(255, 255, 255, .5)',
        fontFamily: 'Poiret One',
        lineHeight: '60px',
        height: '60px',
        boxShadow: '1px 1px 10px grey',
    },
};

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFriend: undefined,
            friendData: {},
            deleteVerifyOpen: false,
            friendToDeleteIndex: undefined,
            snackBarOpen: false,
            allUsers: [],
            newFriendSelected: '',
            newFriendSelectedIndex: undefined,
            autoComErrTxt: '',
            fetchSent: false,
            snackBarMessage: '',
        };
        this.handleFriendSelect = this.handleFriendSelect.bind(this);
        this.deleteFriendModal = this.deleteFriendModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
        this.handleAutoComChange = this.handleAutoComChange.bind(this);
        this.handleAutoComSelect = this.handleAutoComSelect.bind(this);
        this.sendNewFriendRequest = this.sendNewFriendRequest.bind(this);
        this.acceptFriend = this.acceptFriend.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    componentWillMount() {
        if (this.props.token === '') {
            this.props.dispatch(actions.setUserProfile());
        } else { this.getAllUsers(); }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.fetchSent && nextProps.fetchFailed) {
            this.setState({ snackBarOpen: true, snackBarMessage: 'Something went wrong' });
        } else if (this.state.fetchSent && nextProps.fetchFailed === false) {
            this.setState({ snackBarOpen: true, snackBarMessage: 'Deleted' });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.snackbarOpen) {
            O.interval(4000)
                .take(1)
                .subscribe(() => {
                    this.setState({ snackbarOpen: false });
                    this.props.dispatch(actions.resetFetchFailure());
                });
        }
        if (this.state.allUsers !== prevState.allUsers) {
            this.getExerciseData();
        }
    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }

    getAllUsers() {
        O.ajax({
            url: '/user',
            headers: { token: this.props.token },
        })
        .flatMap(response =>
            O.of(response.response.allUsers)
            .filter(user => user !== this.props.profileData)
            .map(user => user))
        .subscribe((allUsers) => {
            const userIndexInAllUsers = findIndex(
                allUsers,
                user => user.fbId === this.props.profileData.fbId);
            const indecesOfAllUsersToFilter = this.props.friends.map(friend =>
                findIndex(allUsers, user => user.fbId === friend.fbId));
            this.setState({ allUsers, userIndexInAllUsers, indecesOfAllUsersToFilter });
        },
        );
    }

    handleFriendSelect(e, fbId, name) {
        const friendFbId = fbId;
        const user = this.props.profileData.fbId;
        const oneWeek = false;
        const week = moment().week().toString();
        const year = moment().year().toString();
        const token = this.props.token;
        O.ajax({
            url: '/exercise_data/get_friend_data',
            method: 'POST',
            headers: { token },
            body: qs.stringify({ user, year, week, oneWeek, friendFbId }),
        }).subscribe((response) => {
            this.setState({
                selectedFriend: {
                    fbId,
                    name,
                },
                friendData: response.response.data,
            });
        },
        () => this.setState({ snackBarOpen: true, snackBarMessage: 'Something went wrong' }));
        scroller.scrollTo('scrollHere', {
            duration: 1500,
            delay: 75,
            smooth: true,
            containerId: 'ContainerElementID',
        });
    }

    handleModalClose() {
        this.setState({ deleteVerifyOpen: false });
    }

    deleteFriendModal(e, i) {
        this.setState({ deleteVerifyOpen: true, friendToDeleteIndex: i.props.id });
    }

    deleteFriend() {
        this.setState({ deleteVerifyOpen: false, fetchSent: true });
        this.props.dispatch(
            actions.deleteFriend(
                this.state.friendToDeleteIndex,
                this.props.friends[this.state.friendToDeleteIndex],
                this.props.profileData.fbId,
                this.props.token,
            ),
        );
    }

    acceptFriend(e, i) {
        e.preventDefault();
        const friendData = this.props.friends[i.props.id].fbId;
        const userData = this.props.profileData.fbId;
        const token = this.props.token;
        const objToDispatch = actions.acceptFriend(
            friendData,
            userData,
            token,
        );
        this.props.dispatch(objToDispatch);
    }

    handleAutoComSelect(newFriendSelected, newFriendSelectedIndex) {
        this.setState({ newFriendSelected, newFriendSelectedIndex });
    }

    sendNewFriendRequest() {
        if (this.state.newFriendSelected === '') {
            this.setState({ autoComErrTxt: 'Please select a user' });
        } else {
            const friend = {
                fbId: this.state.allUsers[this.state.newFriendSelectedIndex].fbId,
                name: this.state.allUsers[this.state.newFriendSelectedIndex].user,
            };

            if (some(this.props.friends, ['fbId', friend.fbId])) {
                this.setState({ autoComErrTxt: 'Check your friends lists' });
                return;
            }

            const user = {
                fbId: this.props.profileData.fbId,
                name: this.props.profileData.user,
            };
            this.props.dispatch(actions.addFriend(user, friend, this.props.token));
        }
    }

    handleAutoComChange() {
        this.setState({ newFriendSelected: '', autoComErrTxt: '' });
    }

    render() {
        const { classes } = this.props;
// sweet
        const autocompleteUserNames = this.state.allUsers.map((user) => {
            if (this.state.indecesOfAllUsersToFilter.includes(this.state.allUsers.indexOf(user))) {
                return undefined;
            }
            return user.user;
        });

        autocompleteUserNames[this.state.userIndexInAllUsers] = undefined;

        const highlightButton = this.state.newFriendSelected !== '';

        const iconButtonElement = (
            <IconButton
              touch
              tooltip="more"
              tooltipPosition="bottom-left"
              onClick={e => e.stopPropagation()}
            >
                <MoreVertIcon color={grey400} />
            </IconButton>
        );

        const modalActions = [
            <FlatButton
              label="Cancel"
              primary
              onTouchTap={this.handleModalClose}
            />,
            <FlatButton
              label="Delete"
              primary
              onTouchTap={this.deleteFriend}
            />,
        ];

        let progress;
        if (this.state.selectedFriend) {
            progress = (
                <Progress
                  friends
                  selectedFriend={this.state.selectedFriend.name}
                  data={this.state.friendData}
                />);
        } else { progress = <div />; }

        let friendsList = this.props.friends
            .filter(friend => friend.status === 'active')
            .map((friend) => {
                const num = this.props.friends.indexOf(friend);
                return (<ListItem
                  onTouchTap={this.example}
                  id={friend.fbId}
                  value={friend.name}
                  primaryText={friend.name}
                  leftAvatar={<Avatar src={friend.avatar} />}
                  onClick={() => this.handleFriendSelect(null, friend.fbId, friend.name)}
                  rightIconButton={
                      <IconMenu
                        onItemTouchTap={this.deleteFriendModal}
                        iconButtonElement={iconButtonElement}
                        onClick={e => e.stopPropagation()}
                      >
                          <MenuItem id={num} >Delete Friend</MenuItem>
                      </IconMenu>}
                />);
            });

        if (friendsList.length === 0) {
            friendsList = (<div>
                <PersonOutline style={{ padding: 10 }} />
                <div>You have no friends. Search for them above.</div>
            </div>);
        }

        let newFriendsList = this.props.friends
            .filter(friend => friend.status === 'pending' && friend.sentByUser === false)
            .map((friend) => {
                const num = this.props.friends.indexOf(friend);
                return (<ListItem
                  value={friend.name}
                  primaryText={friend.name}
                  leftAvatar={<Avatar src={friend.avatar} />}
                  onClick={this.handleFriendSelect}
                  rightIconButton={
                      <IconMenu
                        onItemTouchTap={this.acceptFriend}
                        iconButtonElement={iconButtonElement}
                        onClick={e => e.stopPropagation()}
                      >
                          <MenuItem
                            id={num}
                          >
                            Delete
                          </MenuItem>
                          <MenuItem
                            id={num}
                          >
                            Accept
                        </MenuItem>
                      </IconMenu>
              }
                />);
            });

        if (newFriendsList.length === 0) {
            newFriendsList = (<div>
                <PersonOutline style={{ padding: 10 }} />
                <div>Friends needing approval would appear here</div>
            </div>);
        }

        let pendingFriendInvites = this.props.friends
            .filter(friend => friend.status === 'pending' && friend.sentByUser === true)
            .map((friend) => {
                const num = this.props.friends.indexOf(friend);
                return (<ListItem
                  value={friend.name}
                  primaryText={friend.name}
                  leftAvatar={<Avatar src={friend.avatar} />}
                  rightIconButton={
                      <IconMenu
                        onItemTouchTap={this.deleteFriendModal}
                        iconButtonElement={iconButtonElement}
                        onClick={e => e.stopPropagation()}
                      >
                          <MenuItem
                            id={num}
                          >
                            Cancel Friend Request
                        </MenuItem>
                      </IconMenu>
              }
                />);
            });

        if (pendingFriendInvites.length === 0) {
            pendingFriendInvites = (<div>
                <PersonOutline style={{ padding: 10 }} />
                <div>Unanswered friend requests would appear here</div>
            </div>);
        }


        return (
            <div style={{ textAlign: 'center' }}>
                <Dialog
                  title="Delete Friend"
                  actions={modalActions}
                  modal
                  open={this.state.deleteVerifyOpen}
                >
                Are you sure you want to delete this friend?
                </Dialog>
                <h3 style={style.heading}>View Freinds Progress</h3>
                <Paper style={style.friendReq} className={classes.friendSearch} >
                    <Subheader>Find your friends</Subheader>
                    <Divider />
                    <AutoComplete
                      errorText={this.state.autoComErrTxt}
                      floatingLabelText="Search Friends Name"
                      floatingLabelStyle={{ color: '#457898' }}
                      filter={AutoComplete.fuzzyFilter}
                      dataSource={autocompleteUserNames}
                      maxSearchResults={5}
                      onUpdateInput={this.handleAutoComChange}
                      onNewRequest={this.handleAutoComSelect}
                      fullWidth
                    />
                    <RaisedButton
                      primary={highlightButton}
                      label="Send Request"
                      style={{ margin: 'auto', display: 'block', width: '50%', maxWidth: '200px' }}
                      onTouchTap={this.sendNewFriendRequest}
                    />
                </Paper>
                <div className={classes.friendsContainer}>
                    <Paper className={classes.friendsBoxes}>
                        <SelectableList
                          value={this.state.selectedFriend}
                        >
                            <Subheader>Friends</Subheader>
                            <Divider />
                            {friendsList}
                        </SelectableList>
                    </Paper>
                    <Paper className={classes.friendsBoxes}>
                        <SelectableList>
                            <Subheader>Awaiting Your Approval</Subheader>
                            <Divider />
                            {newFriendsList}
                        </SelectableList>
                    </Paper>
                    <Paper className={classes.friendsBoxes}>
                        <SelectableList>
                            <Subheader>Sent Friend Requests</Subheader>
                            <Divider />
                            {pendingFriendInvites}
                        </SelectableList>
                    </Paper>
                </div>
                <Element name="scrollHere" />
                {progress}
                <Snackbar
                  open={this.state.snackBarOpen}
                  message={this.state.snackBarMessage}
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

Friends.propTypes = {
    // class object for JSS injection
    classes: React.PropTypes.objectOf({}).isRequired,
    // list of friends
    friends: React.PropTypes.arrayOf([]).isRequired,
    // user profile info from redux store
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
        exercisesList: React.PropTypes.array,
    }).isRequired,
    // error handling prop on bad server fetches
    fetchFailed: React.PropTypes.bool.isRequired, // eslint-disable-line
    // the users JWT
    token: React.PropTypes.string.isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

Friends.defaultProps = {
    friends: [],
};

const mapStateToProps = (state, props) => ({ // eslint-disable-line
    fetchFailed: state.fetchFailed,
    profileData: state.userData,
    token: state.userToken,
    friends: state.userData.friends,
});

const enhance = compose(
  connect(mapStateToProps),
  injectSheet(style),
);

export default enhance(Friends);
