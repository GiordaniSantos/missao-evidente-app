import React, {Component} from 'react';
import { WebView } from 'react-native-webview';

export default class Web extends Component {

    render(){
        return (
            <WebView
                source={{ uri: 'https://missaoevidente.com.br/admin/home' }}
            />
        )
    }
};