import React from 'react';
import Dashboard from "../pages/Dashboard";

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AppStack = createNativeStackNavigator();

const AppRoutes: React.FC = () => (
    <AppStack.Navigator>
        <AppStack.Screen name='Dashboard' component={Dashboard} />
    </AppStack.Navigator>
);

export default AppRoutes;