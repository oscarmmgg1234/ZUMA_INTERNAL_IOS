import React from 'react';
import type {PropsWithChildren} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Modal} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

export default function MODAL_BASE(props: any) {
  
  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => props.set_visible(!props.visible)}
      transparent={true}>
      <View style={styles.base_view}>
        <LinearGradient
          colors={['#AFCCA9', '#AFCCA9']}
          style={{
            width: '85%',
            height: '81%',
            alignContent: 'center',
            justifyContent: 'center',
            paddingHorizontal: 1,
            paddingTop: 21,
            paddingBottom: 1,
            borderRadius: 20,
            marginTop: '10%',
            transform: [{translateY: -props.keyboardOffset}],
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.main_view}>
            <View style={styles.header}>
              {/* <View style={styles.header_content}></View> */}
              <Text style={styles.header_content}>Utility</Text>
              <Text style={styles.header_content}>{props.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  props.set_visible(!props.visible);
                  props.reset();
                }}>
                <Ionicons name="close-outline" size={30} color={'black'} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                backgroundColor: '#89BE63',
                width: '100%',
                height: '0.5%',
              }}></Text>
            {props.children}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '6%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  main_view: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ECF9F2',
    alignSelf: 'center',
    borderRadius: 20,
    opacity: 0.78,
  },
  base_view: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_content: {fontSize: 20, fontWeight: 'bold', color: 'black'},
  content_view_border: {
    width: '85%',
    height: '81%',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    paddingTop: 21,
    paddingBottom: 1,
    borderRadius: 20,
    marginTop: '10%',
  },
});
