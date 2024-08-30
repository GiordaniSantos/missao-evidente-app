import 'react-native-gesture-handler';
import React, {Component} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setMessage } from './store/actions/message';
import Alert from './components/SweetAlert';

import { Routes } from "./routes";

class App extends Component {

    componentDidUpdate = () => {
        if(this.props.text && this.props.text){
            Alert(this.props.text, this.props.type);
            this.props.clearMessage()
        }
    }

    render(){
        return (
            <NavigationContainer>
                <Routes/>
            </NavigationContainer>
        )
    }
}

const mapStateToProps = ({ message }) => {
    return {
        type: message.type,
        text: message.text
    }
}

const mapDispatchToProps = dispatch => {
    return {
        clearMessage: () => dispatch(setMessage({ type: '', text: '' }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)