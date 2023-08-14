import React from 'react';
import { View, Button, Text } from 'react-native'
import { useAuth } from '../../contexts/auth';

const Dashboard: React.FC = () => {
    const { logout, user } = useAuth();

    function handleLogout(){
        logout();   
    }

    return(
    <View style={{flex:1, justifyContent: 'center'}}>
        <Text>{user?.name}</Text>
        <Text>{user?.email}</Text>
        <Text>{user?.id}</Text>
        <Button title='Logout' onPress={handleLogout}/>
    </View>
    )
};

export default Dashboard;