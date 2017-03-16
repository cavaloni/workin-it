import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FiberNew from 'material-ui/svg-icons/av/fiber-new';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import HourglassFull from 'material-ui/svg-icons/action/hourglass-full';
import Progress from '../progress/progress';
import mockData from '../mock-data.js';
import {List, ListItem, makeSelectable} from 'material-ui/List';


let SelectableList = makeSelectable(List);


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
        };
        this.handleFriendSelect = this.handleFriendSelect.bind(this);
    }

    handleFriendSelect(event) {
        this.setState({ selectedFriend: event.target.innerHTML})
    }

    render() {
        let progress;
        if (this.state.selectedFriend) {
            progress = <Progress friends={true} selectedFriend={this.state.selectedFriend} data={mockData} />;
        } else { progress = <div />; }

        const friendsList = fakePeople.map(friend => <ListItem value={friend.name} primaryText={friend.name} leftAvatar={<Avatar src={friend.avatar} />} onClick={this.handleFriendSelect} />);
        const newFriendsList = fakePeople.map(friend => <ListItem value={friend.name} primaryText={friend.name} leftAvatar={<Avatar src={friend.avatar} />} rightIcon={<FiberNew />} />);
        const pendingFriendInvites = fakePeople.map(friend => <ListItem value={friend.name} primaryText={friend.name} leftAvatar={<Avatar src={friend.avatar} />} rightIcon={<HourglassFull />} />);
        return (
            <div>
                <h3>View Freinds Progress</h3>
                <Paper style={style.paper}>
                <SelectableList value={this.state.selectedFriend} onChange={this.handleFriendSelect}>
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
            </div>
        );
    }
}

export default Friends;
