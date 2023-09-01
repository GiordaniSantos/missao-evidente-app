import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

const Modal = () => {
  return( 
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.indicator} />

        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae massa odio. Quisque ante sem, tempor eget massa vel, mollis tincidunt metus. Ut sed felis lectus. Nam semper molestie urna, quis ultricies quam semper ut. Maecenas aliquet id urna a convallis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas leo lectus, dictum vitae erat eget, luctus dapibus sapien. Integer at hendrerit quam. Vivamus tempor, arcu non fringilla laoreet, enim nibh porttitor enim, eget pellentesque eros nulla congue neque. Suspendisse et lobortis enim, nec fermentum est. Aliquam accumsan viverra vehicula. Proin tempus sagittis auctor. Vivamus quam ligula, laoreet eget eros et, hendrerit iaculis risus. Nam a nulla in purus fermentum rhoncus eu et erat. Aliquam tempus felis lorem, id hendrerit tortor vestibulum ac.
        </Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: '#fff' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute'
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: '50%',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  text: {
    marginTop: 50,
    textAlign: 'center'
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#9b59b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  }
})

export default Modal