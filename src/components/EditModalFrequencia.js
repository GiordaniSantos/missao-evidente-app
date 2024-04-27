import React, { Component } from 'react'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import CommonStyles from '../CommonStyles'
import { AuthContext } from '../contexts/auth'

const initialState = {  }

export default class EditModalFrequencia extends Component {

    static contextType = AuthContext;
    
    state = {
        ...initialState
    }

    static getDerivedStateFromProps(props, state) {
        if (props.itemBuscado.id != state.id) {
            return {
                quantidade: props.itemBuscado.quantidade.toString(),
                id: props.itemBuscado.id
            };
        }
        return null;
    }
    
    update = () => {
        const editItem = {
            id: this.state.id,
            quantidade: this.state.quantidade,
            id_usuario: this.context.user.id
        }
        
        if(this.props.onUpdate){
            this.props.onUpdate(editItem)
        }
        this.setState({...initialState, quantidade: this.state.quantidade})
    }

    render(){
        return (
            <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel} animationType='fade'>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>{this.props.tituloHeader}</Text>
                    {this.props.loading ? 
                        <View>
                            <ActivityIndicator size="large" color="#0f5d39" style={styles.activityIndicator} />
                        </View>
                    : 
                        <View>
                            <TextInput 
                                placeholder='Digite a Quantidade' 
                                keyboardType="numeric"
                                value={this.state.quantidade && this.state.quantidade.toString()} 
                                style={[styles.date, styles.input]} 
                                onChangeText={numberQuantidade => this.setState({quantidade:numberQuantidade})} 
                                />
                        </View>
                    }
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.update}>
                            <Text style={styles.button}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    activityIndicator: {
        marginTop: 40,
        marginBottom: 40,
        transform: [{ scaleX: 2 }, { scaleY: 2 }]
    },
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    container: {
        backgroundColor: '#FFF'
    }, 
    header: {
        fontFamily: CommonStyles.fontFamily,
        backgroundColor: CommonStyles.colors.today,
        color: CommonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: CommonStyles.colors.today
    },
    input: {
        fontFamily: CommonStyles.fontFamily,
        //height: 40,
        //margin: 15,
        padding: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        width: 'auto'
    },
    date: {
        fontFamily: CommonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20,
        textAlign: 'center',
        marginTop: 15
    }
})