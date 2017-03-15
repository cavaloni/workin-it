import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FiberNew from 'material-ui/svg-icons/av/fiber-new';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

const fakePeople = [
    {
        name: 'Bubba Jones',
        avatar: 'http://lorempixel.com/400/200'
    },
    {
        name: 'Jesus Christ',
        avatar: 'http://lorempixel.com/400/200'
    }, 
    {
        name: 'Milford WaxPaddy',
        avatar: 'http://lorempixel.com/400/200',
    },
    {
        name: 'Who Bo Fo Ducky',
        avatar: 'http://lorempixel.com/400/200',
    }
]

const style = {
    paper: {
        width: '45%',
        maxHeight: 500,
        overflow: 'auto',
        display: 'inline-block',
        marginLeft: 20,
    }
}

class Friends extends Component {
    
    
    render() {
        const friendsList = fakePeople.map(friend => <ListItem primaryText={friend.name} leftAvatar={<Avatar src={friend.avatar} />} />);
        const newFriendsList = fakePeople.map(friend => <ListItem primaryText={friend.name} leftAvatar={<Avatar src={friend.avatar} />} rightIcon={<FiberNew />} />);
        return (
            <div>
            <h3>View Freinds Progress</h3>
            <Paper style={style.paper}>
                <List>
                <Subheader>Friends</Subheader>
                {friendsList}
                </List>
            </Paper>
            <Paper style={style.paper}>
                <List>
                <Subheader>New Friends</Subheader>
                {newFriendsList}
                </List>
            </Paper>
            </div>
        );
    }
}

export default Friends;