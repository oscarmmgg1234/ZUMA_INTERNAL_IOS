import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import MODAL_BASE from '../modal_component';
import ShipmentLog from '../Components/Log/shipmentLogMain';
import ActivationDisplay from '../Components/Log/activationLogMain';
import ReductionDisplay from '../Components/Log/reductionLogMain';

export default function Log(props) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [activeLog, setActiveLog] = useState('activation');

  const getButtonStyle = logType => ({
    ...styles.navButton,
    ...(activeLog === logType ? styles.activeNavButton : {}),
  });

  const reset_all = () => {};

  return (
    <MODAL_BASE
      visible={props.visible}
      set_visible={props.set_visible}
      title={props.title}
      keyboardOffset={keyboardOffset}
      reset={reset_all}>
      <View style={styles.mainView}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => setActiveLog('shipment')}
            style={getButtonStyle('shipment')}>
            <Text
              style={
                activeLog === 'shipment'
                  ? styles.activeText
                  : styles.inactiveText
              }>
              Shipment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveLog('activation')}
            style={getButtonStyle('activation')}>
            <Text
              style={
                activeLog === 'activation'
                  ? styles.activeText
                  : styles.inactiveText
              }>
              Activation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveLog('reduction')}
            style={getButtonStyle('reduction')}>
            <Text
              style={
                activeLog === 'reduction'
                  ? styles.activeText
                  : styles.inactiveText
              }>
              Reduction
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={
            activeLog === 'shipment' ? styles.activeLog : styles.inactiveLog
          }>
          <ShipmentLog refresh={props.refresh} />
        </View>
        <View
          style={
            activeLog === 'activation' ? styles.activeLog : styles.inactiveLog
          }>
          
          <ActivationDisplay refresh={props.refresh} />
        </View>
        <View
          style={
            activeLog === 'reduction' ? styles.activeLog : styles.inactiveLog
          }>
          <ReductionDisplay refresh={props.refresh} />
        </View>
      </View>
    </MODAL_BASE>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20, // Add padding at the bottom for better scrollview experience
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  spacer: {
    height: 20, // Adjust this value as needed for visual separation
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // semi-transparent white
    borderRadius: 25,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 50,
  },
  navButton: {
    flex: 1, // Make buttons take equal space
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded corners for buttons
    margin: 5,
    backgroundColor: 'white', // Solid white background for buttons
  },
  activeNavButton: {
    backgroundColor: '#164C45',
    borderRadius: 25, // Keep rounded corners when button is active
  },
  activeText: {
    fontSize: 20,
    color: 'white',
  },
  inactiveText: {
    color: 'black',
  },
  activeLog: {
    display: 'flex',
  },
  inactiveLog: {
    display: 'none',
  },
});
