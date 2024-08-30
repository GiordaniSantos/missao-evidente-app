import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Button, TouchableOpacity, TouchableWithoutFeedback, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Alert from '../../components/SweetAlert';
import api from '../../services/api';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/user';

class Conta extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    this.getUser()
  }

  state = {
    name: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    showModal: false,
    modalContent: ''
  };

  getUser = async ()  => {
    try{
      const res = await api.get(`/user/${this.props.user.id}`)
      this.setState({ name: res.data.name, email: res.data.email })
    }catch(e) {
      Alert(e.response.data.message, 'error');
    }
  }

  updateUser = async () => {
    try{
      await api.put(`/user/${this.props.user.id}`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.senha,
        password_confirmation: this.state.confirmarSenha,
      })

      Alert('Conta atualizada com sucesso!.', 'success');
      this.setState({ senha: '', confirmarSenha: '' })
    } catch(e) {
      Alert(e.response.data.message, 'error');
    }
  }

  deleteUser = async () => {
    try{
        await api.delete(`/user/${this.props.user.id}`)
        Alert('Conta deletada com sucesso!.', 'success');
        this.props.logout()
    } catch(e) {
      Alert(e.response.data.message, 'error');
    }
  }

  handlePressUpdate = () => {
    this.setState({ showModal: true, modalContent: 'update' });
  };

  handleConfirmUpdate = () => {
    this.updateUser()
    this.setState({ showModal: false });
  };

  handleConfirmDelete = () => {
    this.deleteUser()
    this.setState({ showModal: false });
  };

  handleCancel = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Deixe em branco para manter a atual"
            value={this.state.senha}
            onChangeText={(text) => this.setState({ senha: text })}
            secureTextEntry={true}
          />

          <Text style={[styles.label, {width: 128}]}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme sua nova senha"
            value={this.state.confirmarSenha}
            onChangeText={(text) => this.setState({ confirmarSenha: text })}
            secureTextEntry={true}
          />
          <View style={styles.buttonSave}>
            <Button title="Atualizar Conta" color={'#0f5d39'} onPress={this.handlePressUpdate} />
          </View>
          <Modal 
            visible={this.state.showModal} 
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
              this.setState({ showModal: false });
            }}
            >
            <TouchableOpacity style={{flex:1}} activeOpacity={1}  onPress={() => this.setState({ showModal: false })} >
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  {this.state.modalContent == 'update' ? ( 
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Atualização de Conta!</Text>
                      <View>
                        <Text>
                          Importante utilizar um email existente e funcional para caso você precise recuperar a sua senha. {'\n'}{'\n'}
                          Utilize senhas fortes para manter sua conta segura. {'\n'}{'\n'}
                        </Text>
                        <View style={styles.fixToText}>
                          <Pressable style={[styles.button, {backgroundColor: '#015b41'}]} onPress={this.handleConfirmUpdate}>
                            <Text style={styles.textButton}>Atualizar</Text>
                          </Pressable>
                          <Pressable style={[styles.button, {backgroundColor: '#6e7881'}]} onPress={this.handleCancel}>
                            <Text style={styles.textButton}>Cancelar</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Você tem certeza que deseja excluir sua conta?</Text>
                      <View>
                        <Text>
                          Todos os dados vinculados à sua conta serão deletados! {'\n'}{'\n'}
                        </Text>
                        <View style={styles.fixToText}>
                          <Pressable style={[styles.button, {backgroundColor: '#015b41', paddingLeft: 20, paddingRight: 20}]} onPress={this.handleConfirmDelete}>
                            <Text style={styles.textButton}>Sim</Text>
                          </Pressable>
                          <Pressable style={[styles.button, {backgroundColor: '#6e7881', paddingLeft: 20, paddingRight: 20}]} onPress={this.handleCancel}>
                            <Text style={styles.textButton}>Não</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
        <TouchableOpacity style={styles.deleteButton} onPress={() => this.setState({ showModal: true, modalContent: 'delete' })} activeOpacity={0.7}>
          <Icon name='trash' size={20} color={'#fff'} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fc',
  },
  deleteButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgb(221, 51, 51)',
    justifyContent: 'center',
    alignItems: 'center' 
  },
  label: {
    fontSize: 16,
    marginBottom: -10,
    marginLeft: 10,
    backgroundColor: '#f8f9fc',
    width: 50,
    textAlign: 'center',
    zIndex: 1
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  buttonSave: {
    marginTop: 15,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
  },
  textButton: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.25,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: -10,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});


const mapStateToProps = ({ user }) => {
  return {
      user: user
  }
}

const mapDispatchToProps = dispatch => {
  return {
      logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Conta)