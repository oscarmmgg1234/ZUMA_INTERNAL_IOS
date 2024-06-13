/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ACTIVATION_MODAL from './src/modals/activation_modal';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RELEASE_MODAL from './src/modals/release_modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LABEL_MODAL from './src/modals/label_modal';
import Main_Shipment from './src/modals/main_shipment_modal';
import Log from './src/modals/history_log';
import OnlineStatusIndicator from './src/Components/status_indicator';
import InventoryModal_Main from './src/modals/inventory_modal';
import {
  Camera,
  useCodeScanner,
  useCameraDevice,
} from 'react-native-vision-camera';

import {http_req} from './src/http/req';
import TransactionLog from './src/modals/transaction_log';

const http = http_req();

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

  // // Example usage
  // connectWebSocket().catch(() => {
  //   // If initial connection fails, attempt to reconnect
  //   attemptReconnect();
  // });
  const device = useCameraDevice('back');

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
  const [transactionModalLog, setTransactionModalLog] =
    React.useState<boolean>(false);
  const [activation_modal_visible, set_activation_modal_visible] =
    React.useState(false);
  const [release_modal_visible, set_release_modal_visible] =
    React.useState(false);
  const [shipment_modal_visible, set_shipment_modal_visible] =
    React.useState(false);
  const [label_modal_visible, set_label_modal_visible] = React.useState(false);
  const [historyLog, setHistoryLog] = React.useState<boolean>(false);

  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [refreshHistory, setRefreshHistory] = React.useState<boolean>(false);
  const [refreshTransaction, setRefreshTransaction] =
    React.useState<boolean>(false);
  const [barcodeCheck, setBarcodeCheck] = React.useState<boolean>(false);
  const [barcodeData, setBarcodeData] = React.useState<string>('');
  const [barcodeDisplay, setBarcodeDisplay] = React.useState<any>({});
  const [inventoryModal, setInventoryModal] = React.useState<any>(false);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      setBarcodeData(codes[0].value);
    },
  });

  const barcodeDataRetrieve = () => {
    http.getBarcodeData(
      {barcode: barcodeData, employee: '000002'},
      (result: any) => {
        setBarcodeDisplay(result.data[0]);
      },
    );
  };

  React.useEffect(() => {
    if (barcodeData) {
      barcodeDataRetrieve();
    }
  }, [barcodeData]);
  React.useEffect(() => {
    setRefreshHistory(true);
    setTimeout(() => {
      setRefreshHistory(false);
    }, 100);
  }, [historyLog]);

  const hardRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 100);
  };
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
        {barcodeCheck == false ? (
          <>
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
              }}>
              <Text style={{color: '#a5beba', fontSize: 60, fontWeight: '500'}}>
                ZUMA INVENTORY
              </Text>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 10,
                  }}>
                  Created By Oscar Maldonado
                </Text>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 10,
                  }}>
                  App Version 2.2.2
                </Text>
              </View>
            </View>

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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 20,
                  }}>
                  <OnlineStatusIndicator />

                  <TouchableOpacity
                    style={{alignSelf: 'flex-end', paddingRight: 40}}
                    onPress={() => hardRefresh()}>
                    <Text style={{color: 'gray', fontSize: 10}}>Refresh</Text>
                    <Ionicons
                      name="refresh-circle-outline"
                      size={35}
                      color={'gray'}
                    />
                  </TouchableOpacity>
                </View>

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
                    <Ionicons
                      name="swap-horizontal"
                      size={45}
                      color={'#CFEDEE'}
                    />
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
                    <Text style={styles.content_button_text}>
                      PRODUCT RELEASE
                    </Text>
                    <Ionicons
                      name="remove-circle"
                      size={45}
                      color={'#CFEDEE'}
                    />
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
                    <Ionicons
                      name="archive-outline"
                      size={45}
                      color={'#CFEDEE'}
                    />
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
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    onPress={() => setTransactionModalLog(true)}
                    style={{
                      alignSelf: 'flex-end',
                      paddingRight: 50,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'rgba(0,0,0,0.5)', paddingRight: 10}}>
                      Transactions
                    </Text>
                    <Ionicons
                      name="file-tray-stacked-outline"
                      size={30}
                      color={'rgba(0,0,0,0.5)'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHistoryLog(true)}
                    style={{
                      alignSelf: 'flex-end',
                      paddingRight: 50,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'rgba(0,0,0,0.5)', paddingRight: 10}}>
                      Recent
                    </Text>
                    <Ionicons
                      name="file-tray-full-outline"
                      size={30}
                      color={'rgba(0,0,0,0.5)'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setInventoryModal(true)}
                    style={{
                      alignSelf: 'flex-end',
                      paddingRight: 50,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'rgba(0,0,0,0.5)', paddingRight: 10}}>
                      Inventory
                    </Text>
                    <Ionicons name="server-outline" size={35} color={'gray'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setBarcodeCheck(true);
                    }}>
                    <Ionicons
                      name="barcode"
                      size={30}
                      color={'rgba(0,0,0,0.5)'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </>
        ) : (
          <>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={barcodeCheck}
              codeScanner={codeScanner}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                top: '-64%',
                paddingHorizontal: 10,
                paddingVertical: 2,
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Ionicons
                  name="close-circle-outline"
                  size={50}
                  color={'lightgray'}
                  onPress={() => {
                    setBarcodeCheck(false);
                    setBarcodeData('');
                    setBarcodeDisplay({});
                  }}
                />
              </TouchableOpacity>
              {barcodeData && (
                <View
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderWidth: 2,
                  }}>
                  <Text>{`Barcode ID: ${barcodeDisplay.BarcodeID}`}</Text>
                  <Text>{`Product: ${barcodeDisplay.Product}`}</Text>
                  <Text>{`Product Status: ${barcodeDisplay.Status}`}</Text>
                  <Text>{`Employee Responsible: ${barcodeDisplay.Employee}`}</Text>
                  <Text>{`Quantity: ${barcodeDisplay.Quantity}`}</Text>
                  <Text>{`Date: ${barcodeDisplay.Date}`}</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {/* //------------------------------- */}
      <ACTIVATION_MODAL
        refresh={refresh}
        visible={activation_modal_visible}
        set_visible={set_activation_modal_visible}
        title="Product Activation"
        modal_completion={set_activation_modal_visible}
      />
      {/* //------------------------------- */}
      <RELEASE_MODAL
        refresh={refresh}
        visible={release_modal_visible}
        set_visible={set_release_modal_visible}
        title="Product Release"
      />

      <LABEL_MODAL
        refresh={refresh}
        visible={label_modal_visible}
        set_visible={set_label_modal_visible}
        title="Print Label"
        modal_completion={set_label_modal_visible}
      />
      <Main_Shipment
        refresh={refresh}
        visible={shipment_modal_visible}
        set_visible={set_shipment_modal_visible}
        title="Shipment"
        modal_completion={set_shipment_modal_visible}
      />
      <Log
        refresh={refreshHistory}
        visible={historyLog}
        set_visible={setHistoryLog}
        title="History Log"
        modal_completion={setHistoryLog}
      />
      <TransactionLog
        refresh={refreshTransaction}
        visible={transactionModalLog}
        set_visible={setTransactionModalLog}
        title="Transaction Log"
        modal_completion={setTransactionModalLog}
      />
      <InventoryModal_Main
        visible={inventoryModal}
        set_visible={setInventoryModal}
        title="Product Inventory"
        modal_completion={setInventoryModal}
        refresh={refresh}
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
