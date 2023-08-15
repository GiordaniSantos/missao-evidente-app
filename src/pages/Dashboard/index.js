import React, {Component, useContext} from 'react';
import { View, Button, Text } from 'react-native'
import { useAuth } from '../../contexts/auth';
import { AuthContext } from '../../contexts/auth';

export default class Dashboard extends Component {
    static contextType = AuthContext;
    render(){

        handleLogout = () =>{
            this.context.logout();   
        }
    
        return(
        <View style={{flex:1, justifyContent: 'center'}}>
            <Text>{this.context.user.name}</Text>
            <Text>{this.context.user.email}</Text>
            <Text>{this.context.user.id}</Text>
            <Button title='Logout' onPress={handleLogout}/>
        </View>
        )
    }
};