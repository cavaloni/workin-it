import React, { Component } from 'react';
import moment from 'moment';
import qs from 'qs';
import _ from 'lodash';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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
import { Observable } from 'rxjs/Rx';
import { connect } from 'react-redux';
import Progress from '../progress/progress';

import * as actions from '../../actions/index';

const O = Observable;

const SelectableList = makeSelectable(List);

const style = {
    paper: {
        width: '45%',
        maxHeight: 500,
        overflow: 'auto',
        display: 'inline-block',
        marginLeft: 20,
        verticalAlign: 'top',
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
        };
        this.handleFriendSelect = this.handleFriendSelect.bind(this);
        this.deleteFriendModal = this.deleteFriendModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
        this.handleAutoComChange = this.handleAutoComChange.bind(this);
        this.handleAutoComSelect = this.handleAutoComSelect.bind(this);
        this.sendNewFriendRequest = this.sendNewFriendRequest.bind(this);
        this.acceptFriend = this.acceptFriend.bind(this);
    }

    componentWillMount() {
        O.ajax({
            url: '/user',
            headers: { token: this.props.token },
        })
        .flatMap(response => O.of(response.response.allUsers)
                        .filter(user => user !== this.props.profileData)
                        .map(user => user))
        .subscribe(allUsers => this.setState({ allUsers }));
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
        });
    }

    handleModalClose() {
        this.setState({ deleteVerifyOpen: false });
    }

    deleteFriendModal(e, i) {
        this.setState({ deleteVerifyOpen: true, friendToDeleteIndex: i.props.id });
    }

    deleteFriend() {
        this.setState({ deleteVerifyOpen: false, snackBarOpen: true });
        O.interval(3000)
            .take(1)
            .subscribe(() => this.setState({ snackBarOpen: false }));
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
        const friendData = this.state.allUsers[i.props.id].fbId;
        const userData = this.props.profileData.fbId;
        const token = this.props.token;
        const objToDispatch = actions.acceptFriend(
            friendData,
            userData,
            token,
        );

        console.log(objToDispatch);
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

            if (_.some(this.props.friends, ['fbId', friend.fbId])) {
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
        const autocompleteUserNames = this.state.allUsers.map(user => user.user);

        autocompleteUserNames.push('Milford WaxPaddy');

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

        const friendsList = this.props.friends
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

        const newFriendsList = this.props.friends
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

        const pendingFriendInvites = this.props.friends
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
                            // onTouchTap={this.deleteFriendModal}
                          >
                            Cancel Friend Request
                        </MenuItem>
                      </IconMenu>
              }
                />);
            });
        return (
            <div>
                <Dialog
                  title="Delete Friend"
                  actions={modalActions}
                  modal
                  open={this.state.deleteVerifyOpen}
                >
                Are you sure you want to delete this friend?
                </Dialog>
                <h3>View Freinds Progress</h3>
                <Paper style={{ marginBottom: 30 }}>
                    <AutoComplete
                      errorText={this.state.autoComErrTxt}
                      floatingLabelText="Send New Friend Request"
                      filter={AutoComplete.fuzzyFilter}
                      dataSource={autocompleteUserNames}
                      maxSearchResults={5}
                      onUpdateInput={this.handleAutoComChange}
                      onNewRequest={this.handleAutoComSelect}
                      fullWidth
                    />
                    <RaisedButton
                      label="Send Freind Request"
                      style={{ margin: 'auto', display: 'block', width: '50%' }}
                      onTouchTap={this.sendNewFriendRequest}
                    />
                </Paper>
                <Paper style={style.paper}>
                    <SelectableList
                      value={this.state.selectedFriend}
                    //   onChange={this.handleFriendSelect}
                    >
                        <Subheader>Friends</Subheader>
                        {friendsList}
                    </SelectableList>
                </Paper>
                <Paper style={style.paper}>
                    <SelectableList>
                        <Subheader>Awaiting Your Approval</Subheader>
                        {newFriendsList}
                    </SelectableList>
                    <Divider />
                    <SelectableList>
                        <Subheader>Sent Friend Requests</Subheader>
                        {pendingFriendInvites}
                    </SelectableList>
                </Paper>
                {progress}
                <Snackbar
                  open={this.state.snackBarOpen}
                  message="Deleted"
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

Friends.propTypes = {
    // list of friends
    friends: React.PropTypes.array.isRequired,
    // user profile info from redux store
    profileData: React.PropTypes.shape({
        fbId: React.PropTypes.string.isRequired,
        user: React.PropTypes.string.isRequired,
        profileImage: React.PropTypes.string,
        friends: React.PropTypes.array,
    }).isRequired,
    // the users JWT
    token: React.PropTypes.string.isRequired,
    // redux dispatch
    dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    profileData: state.userData,
    token: state.userToken,
    friends: state.userData.friends,
});

export default connect(mapStateToProps)(Friends);
