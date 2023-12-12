/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ACTIVATION_MODAL from './src/modals/activation_modal';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RELEASE_MODAL from './src/modals/release_modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LABEL_MODAL from './src/modals/label_modal';
import Main_Shipment from './src/modals/main_shipment_modal';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

function App(): JSX.Element {
  const pressAnim = React.useRef(new Animated.Value(1)).current;
  const pressAnim2 = React.useRef(new Animated.Value(1)).current;
  const pressAnim3 = React.useRef(new Animated.Value(1)).current;
  const pressAnim4 = React.useRef(new Animated.Value(1)).current;
  


  const onPressIn = (button: number) => {
    const anim =
      button === 1
        ? pressAnim
        : button === 2
        ? pressAnim2
        : button === 3
        ? pressAnim3
        : pressAnim4;
    Animated.timing(anim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = (button: number) => {
    const anim =
      button === 1
        ? pressAnim
        : button === 2
        ? pressAnim2
        : button === 3
        ? pressAnim3
        : pressAnim4;
    Animated.timing(anim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const isDarkMode = useColorScheme() === 'dark';
  //states
  const [activation_modal_visible, set_activation_modal_visible] =
    React.useState(false);
  const [release_modal_visible, set_release_modal_visible] =
    React.useState(false);
  const [shipment_modal_visible, set_shipment_modal_visible] =
    React.useState(false);
  const [label_modal_visible, set_label_modal_visible] = React.useState(false);

  //define http functions

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
      </SafeAreaView>
      <View style={styles.main_view}>
        <Text style={{color: '#a5beba', fontSize: 60, fontWeight: '500'}}>
          ZUMA INVENTORY
        </Text>
        {/* <Text
          style={{
            backgroundColor: '#60BF89',
            borderWidth: 1,
            width: '100%',
            height: '0.5%',
          }}></Text> */}
        <LinearGradient
          colors={['#AFCCA9', '#AFCCA9']}
          style={styles.content_view_border}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.content_view}>
            <Animated.View
              style={[
                styles.content_button,
                {
                  transform: [{scale: pressAnim}],
                  elevation: pressAnim.interpolate({
                    inputRange: [0.9, 1],
                    outputRange: [2, 5],
                  }),
                },
              ]}>
              <TouchableOpacity
                onPressIn={() => onPressIn(1)}
                onPressOut={() => onPressOut(1)}
                onPress={() => set_activation_modal_visible(true)}
                style={styles.touchableArea}>
                <Text style={styles.content_button_text}>
                  PRODUCT ACTIVATION
                </Text>
                <Ionicons name="swap-horizontal" size={45} color={'#CFEDEE'} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[
                styles.content_button,
                {
                  transform: [{scale: pressAnim2}],
                  elevation: pressAnim2.interpolate({
                    inputRange: [0.9, 1],
                    outputRange: [2, 5],
                  }),
                },
              ]}>
              <TouchableOpacity
                onPressIn={() => onPressIn(2)}
                onPressOut={() => onPressOut(2)}
                onPress={() => set_release_modal_visible(true)}
                style={styles.touchableArea}>
                <Text style={styles.content_button_text}>PRODUCT RELEASE</Text>
                <Ionicons name="remove-circle" size={45} color={'#CFEDEE'} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[
                styles.content_button,
                {
                  transform: [{scale: pressAnim3}],
                  elevation: pressAnim3.interpolate({
                    inputRange: [0.9, 1],
                    outputRange: [2, 5],
                  }),
                },
              ]}>
              <TouchableOpacity
                onPressIn={() => onPressIn(3)}
                onPressOut={() => onPressOut(3)}
                onPress={() => set_shipment_modal_visible(true)}
                style={styles.touchableArea}>
                <Text style={styles.content_button_text}>SHIPMENT</Text>
                <Ionicons name="archive-outline" size={45} color={'#CFEDEE'} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[
                styles.content_button,
                {
                  transform: [{scale: pressAnim4}],
                  elevation: pressAnim4.interpolate({
                    inputRange: [0.9, 1],
                    outputRange: [2, 5],
                  }),
                },
              ]}>
              <TouchableOpacity
                onPressIn={() => onPressIn(4)}
                onPressOut={() => onPressOut(4)}
                onPress={() => set_label_modal_visible(true)}
                style={styles.touchableArea}>
                <Text style={styles.content_button_text}>PRINT LABEL</Text>
                <Ionicons name="print" size={45} color={'#CFEDEE'} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
      {/* //------------------------------- */}
      <ACTIVATION_MODAL
        visible={activation_modal_visible}
        set_visible={set_activation_modal_visible}
        title="Product Activation"
        modal_completion={set_activation_modal_visible}
      />
      {/* //------------------------------- */}
      <RELEASE_MODAL
        visible={release_modal_visible}
        set_visible={set_release_modal_visible}
        title="Product Release"
      />

      <LABEL_MODAL
        visible={label_modal_visible}
        set_visible={set_label_modal_visible}
        title="Print Label"
        modal_completion={set_label_modal_visible}
      />
      <Main_Shipment
        visible={shipment_modal_visible}
        set_visible={set_shipment_modal_visible}
        title="Shipment"
        modal_completion={set_shipment_modal_visible}
      />
    </>
  );
}
// other colors title: #60BF89 , buttons: #05F26C
const styles = StyleSheet.create({
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
  },
  main_view: {
    backgroundColor: '#ECF9F2',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  content_view_border: {
    width: '80%',
    height: '75%',

    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 30,
  },
  content_view: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  content_button: {
    backgroundColor: '#89BE63',
    width: '75%',
    height: '20%',
    borderRadius: 50,
    borderWidth: 10,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content_button_text: {
    color: '#CFEDEE',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;
