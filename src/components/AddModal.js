import React, { Component } from 'react'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput } from 'react-native'
import CommonStyles from '../CommonStyles';
import SelectDropdown from 'react-native-select-dropdown'
import { AuthContext } from '../contexts/auth';

const initialState = { nome: '', quantidade: '', id_usuario: null }

export default class AddModal extends Component {

    static contextType = AuthContext;

    state = {
        ...initialState
    }
    
    save = () => {
        const novaMembresia = {
            nome: this.state.nome,
            quantidade: this.state.quantidade,
            id_usuario: this.context.user.id
        }
        
        if(this.props.onSave){
            this.props.onSave(novaMembresia)
        }
        this.setState({...initialState})
    }

    render(){
        return (
            <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel} animationType='slide'>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>{this.props.tituloHeader}</Text>
                    <SelectDropdown
                        data={this.props.dataSelect}
                        buttonStyle={styles.input}
                        rowStyle={{with:'100%'}}
                        defaultButtonText='Selecione uma Opção'
                        onSelect={(selectedItem, index) => {
                            this.setState({ nome: selectedItem })
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />
                    <TextInput style={styles.input} keyboardType="numeric" placeholder='Informe a quantidade...' onChangeText={newQuantidade => this.setState({quantidade: newQuantidade})} value={this.state.quantidade.toString()}/>
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
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
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: CommonStyles.colors.today
    },
    input: {
        fontFamily: CommonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        width: 'auto'
    },
    date: {
        fontFamily: CommonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
})