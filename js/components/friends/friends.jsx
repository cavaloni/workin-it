import React, { Component } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FiberNew from 'material-ui/svg-icons/av/fiber-new';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Progress from '../progress/progress';
import mockData from '../mock-data';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import Snackbar from 'material-ui/Snackbar';
import { Observable } from 'rxjs/Rx';
import RaisedButton from 'material-ui/RaisedButton';
import ReactDOM from 'react-dom';


const SelectableList = makeSelectable(List);

const fakePeople = [
    {
        name: 'Bubba Jones',
        avatar: 'http://lorempixel.com/400/200',
        data: mockData,
    },
    {
        name: 'Jesus Christ',
        avatar: 'http://lorempixel.com/400/200',
        data: mockData,
    },
    {
        name: 'Milford WaxPaddy',
        avatar: 'http://lorempixel.com/400/200',
        data: mockData,
    },
    {
        name: 'Who Bo Fo Ducky',
        avatar: 'http://lorempixel.com/400/200',
        data: mockData,
    },
];

const newNames = ['Bart', 'Crapply', 'nomad', 'biddle woop woop', 'shizface'];

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
            deleteVerifyOpen: false,
            friendToDeleteIndex: undefined,
            snackBarOpen: false,
        };
        this.handleFriendSelect = this.handleFriendSelect.bind(this);
        this.deleteFriendModal = this.deleteFriendModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);
    }

    handleFriendSelect(event) {
        this.setState({ selectedFriend: event.target.innerHTML });
    }

    handleModalClose() {
        this.setState({ deleteVerifyOpen: false });
    }

    deleteFriendModal(e, i) {
        console.log(i);
        this.setState({ deleteVerifyOpen: true, friendToDeleteIndex: i.props.id });
    }

    deleteFriend() {
        console.log('it will delete: ', this.state.friendToDeleteIndex);
        this.setState({ deleteVerifyOpen: false, snackBarOpen: true });
        Observable.interval(3000)
            .subscribe(() => this.setState({ snackBarOpen: false }));
        // this.props.dispatch(actions.deletefriend())
    }

    render() {
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

        const actions = [
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
                  selectedFriend={this.state.selectedFriend}
                  data={mockData}
                />);
        } else { progress = <div />; }

        const friendsList = fakePeople.map((friend) => {
            const num = fakePeople.indexOf(friend);
            return (<ListItem
              value={friend.name}
              primaryText={friend.name}
              leftAvatar={<Avatar src={friend.avatar} />}
              onClick={this.handleFriendSelect}
              rightIconButton={
                  <IconMenu onItemTouchTap={this.deleteFriendModal} iconButtonElement={iconButtonElement} onClick={e => e.stopPropagation()} >
                      <MenuItem id={num} >Delete Friend</MenuItem>
                  </IconMenu>}
            />);
        });
        const newFriendsList = fakePeople.map(friend =>
            <ListItem
              value={friend.name}
              primaryText={friend.name}
              leftAvatar={<Avatar src={friend.avatar} />}
              rightIcon={<FiberNew />}
              onClick={this.handleFriendSelect}
            />);
        const pendingFriendInvites = fakePeople.map((friend) => {
            const num = fakePeople.indexOf(friend);
            return (<ListItem
              value={friend.name}
              primaryText={friend.name}
              leftAvatar={<Avatar src={friend.avatar} />}
              rightIconButton={
                  <IconMenu onItemTouchTap={this.deleteFriendModal} iconButtonElement={iconButtonElement} onClick={e => e.stopPropagation()} >
                      <MenuItem id={num} onTouchTap={this.deleteFriendModal}>Cancel Friend Request</MenuItem>
                  </IconMenu>
              }
            />);
        });
        return (
            <div>
                <Dialog
                  title="Dialog With Actions"
                  actions={actions}
                  modal
                  open={this.state.deleteVerifyOpen}
                >
          Only actions can close this dialog.
                    </Dialog>
                <h3>View Freinds Progress</h3>
                <Paper style={{ marginBottom: 30 }}>
                    <AutoComplete
                      floatingLabelText="Send New Friend Request"
                      filter={AutoComplete.fuzzyFilter}
                      dataSource={newNames}
                      fullWidth
                      maxSearchResults={5}
                    />
                </Paper>
                <Paper style={style.paper}>
                    <SelectableList
                      value={this.state.selectedFriend}
                      onChange={this.handleFriendSelect}
                    >
                        <Subheader>Friends</Subheader>
                        {friendsList}
                    </SelectableList>
                </Paper>
                <Paper style={style.paper}>
                    <SelectableList>
                        <Subheader>New Friends</Subheader>
                        {newFriendsList}
                    </SelectableList>
                    <Divider />
                    <SelectableList>
                        <Subheader>Pending Friend Invites</Subheader>
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

export default Friends;
