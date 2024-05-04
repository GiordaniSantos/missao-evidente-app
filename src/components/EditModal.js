import React, { Component } from 'react'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import CommonStyles from '../CommonStyles'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AuthContext } from '../contexts/auth'
import moment from 'moment'
import 'moment/locale/pt-br'

const initialState = { showDatePicker: false, showTimePicker: false  }

export default class EditModal extends Component {

    static contextType = AuthContext;
    
    state = {
        ...initialState
    }

    static getDerivedStateFromProps(props, state) {
        if(props.itemBuscado.id != state.id && props.itemBuscado.created_at !== state.date){
            return {
                date: props.itemBuscado.created_at,
                nome: props.itemBuscado.nome,
                id: props.itemBuscado.id
            };
        }
        if (!state.date && props.itemBuscado.created_at !== state.date) {
          return {
            date: props.itemBuscado.created_at,
            nome: props.itemBuscado.nome,
            id: props.itemBuscado.id
          };
        }if(state.date && props.itemBuscado.id === state.id){
            return {
                date: state.date,
                nome: state.nome,
            };
        }
        return null;
    }
    
    update = () => {
        const editItem = {
            id: this.state.id,
            date: this.state.date,
            nome: this.state.nome,
            id_usuario: this.context.user.id
        }
        
        if(this.props.onUpdate){
            this.props.onUpdate(editItem)
        }
        this.setState({...initialState, date: this.state.date, nome: this.state.nome})
    }

    getDatePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date} onChange={
            (event, date) => {
                //se cancelar o seletor de data, dele define o valor para indefinido
                if (event?.type === 'dismissed') {
                    //verificando se foi fechado o seletor e se sim, setando o valor anterior como o valor selecionado
                    this.setState({date: this.state.date, showDatePicker: false})
                    return;
                }
                this.setState({date: date, showDatePicker: false})
            }
        } mode='date' timeZoneName={'America/Sao_Paulo'}/>

        const dateString = moment(this.state.date).format('dddd, D [de] MMMM [de] YYYY')
        if(Platform.OS === 'android'){
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({showDatePicker : true})}>
                        <Text style={[styles.date, styles.input]}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }
        return datePicker
    }

    getTimePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date} onChange={
            (event, date) => {
                //se cancelar o seletor de data, dele define o valor para indefinido
                if (event?.type === 'dismissed') {
                    //verificando se foi fechado o seletor e se sim, setando o valor anterior como o valor selecionado
                    this.setState({date: this.state.date, showTimePicker: false})
                    return;
                }
                this.setState({date: date, showTimePicker: false})
            }
        } mode='time' timeZoneName={'America/Sao_Paulo'}/>

        const dateString = moment(this.state.date).format('HH:mm')
        if(Platform.OS === 'android'){
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({showTimePicker : true})}>
                        <Text style={[styles.date, styles.input]}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showTimePicker && datePicker}
                </View>
            )
        }
        return datePicker
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
                            <ActivityIndicator size="large" color="#0f5d39" style={[styles.activityIndicator, this.state.withNome ? {marginTop: 90,marginBottom: 90} : {marginTop: 70,marginBottom: 70}]} />
                        </View>
                    : 
                        <View>
                            {this.getDatePicker()}
                            {this.getTimePicker()}
                            {this.props.withNome && 
                                <TextInput 
                                    placeholder={this.props.placeHolderCampoNome ? this.props.placeHolderCampoNome : 'Nome do Visitado'} 
                                    value={this.state.nome} 
                                    style={[styles.date, styles.input]} 
                                    onChangeText={textNome => this.setState({ nome: textNome })} 
                                    /> 
                            }
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