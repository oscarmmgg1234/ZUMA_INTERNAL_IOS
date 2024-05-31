import React from 'react';
import {
  TouchableOpacity,
  Keyboard,
  KeyboardEvent,
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  FlatList,
  Alert,
} from 'react-native';
import MODAL_BASE from '../../modal_component';
import {
  Camera,
  useCodeScanner,
  useCameraDevice,
} from 'react-native-vision-camera';
import {http_req} from '../../http/req';
import ErrorAlert from '../../alerts/Error_Alert';

const http = http_req();

export default function TransactionLog(props) {
  const [transactionLog, setTransactionLog] = React.useState<any>([]);
  const [transaction, setTransaction] = React.useState<any>(null);
  const refreshTransactions = () => {
    init(); // Assuming 'init' is your function to load transactions
  };
  const submitRevert = () => {
    if (transaction) {
      http.revertTransaction({transactionID: transaction.TRANSACTIONID});
      Alert.alert('Transaction Reverted');
      setTransaction(null);
      setTimeout(() => {
        init();
      }, 1100);
    } else {
      Alert.alert('No Transaction Selected');
      return;
    }
  };

  const init = () => {
    http.getTransactions(result => {
      const formatted1 = result.data.filter((item: any) => item.REVERSED === 0);
      const formatted = formatted1.map((item: any) => {
        return {...item, focus: false};
      });
      setTransactionLog(formatted);
    });
  };

  React.useEffect(() => {
    init();
  }, [props.visible]);
  const [keyboardOffset, setKeyboardOffset] = React.useState(0);

  React.useEffect(() => {
    const keyboardWillShow = (event: KeyboardEvent) => {
      setKeyboardOffset(event.endCoordinates.height - 175);
    };

    const keyboardWillHide = () => {
      setKeyboardOffset(0);
    };

    const show = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const hide = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const reset_all = () => {};

  const onFocus_Transaction = (employee: any) => {
    const newRes = transactionLog.map(item => {
      if (item.TRANSACTIONID === employee.TRANSACTIONID) {
        if (item.focus === true) {
          setTransaction(null);
          return {...item, focus: false};
        } else {
          setTransaction(employee);
          return {...item, focus: true};
        }
      } else {
        return {...item, focus: false};
      }
    });
    setTransactionLog(newRes);
  };

  const transaction_entry = (item: any, index: any) => {
    return (
      <TouchableOpacity onPress={() => onFocus_Transaction(item)}>
        <View
          style={{
            backgroundColor: index % 2 == 0 ? '#89BE63' : '#9CBFA9',
            borderRadius: 50,
            width: '97%',
            height: item.focus ? 100 : 60,
            alignSelf: 'center',
            marginVertical: 3,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderColor: item.focus ? 'coral' : '#8ecae6',
            borderWidth: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <Text style={{color: '#ECF9F2', fontSize: 14, fontWeight: 'bold'}}>
            {item.PRODUCT_NAME}
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              height: '60%',
              width: 2,
            }}
          />
          <Text style={{color: '#ECF9F2', fontSize: 14, fontWeight: 'bold'}}>
            {item.QUANTITY}
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              height: '60%',
              width: 2,
            }}
          />

          <View
            style={{
              width: 100,
              height: '40%',
              backgroundColor:
                item.ACTION == 'activation'
                  ? 'orange'
                  : item.ACTION == 'consumption'
                  ? '#CEF09D'
                  : '#FF5733',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Text>{item.ACTION}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              height: '60%',
              width: 2,
            }}
          />
          <Text style={{color: '#ECF9F2', fontSize: 12, fontWeight: 'bold'}}>
            {new Date(item.DATE).toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              height: '60%',
              width: 2,
            }}
          />
          <Text
            style={{
              color: '#ECF9F2',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            {item.EMPLOYEE_NAME}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MODAL_BASE
      visible={props.visible}
      set_visible={props.set_visible}
      title={props.title}
      keyboardOffset={keyboardOffset}
      reset={reset_all}>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={refreshTransactions}>
        <Text style={styles.refreshButtonText}>Refresh Transactions</Text>
      </TouchableOpacity>
      <View style={styles.mainView}>
        <FlatList
          data={transactionLog}
          renderItem={({item, index}) => transaction_entry(item, index)}
          keyExtractor={item => item.TRANSACTIONID}
          contentContainerStyle={styles.listContent}
        />
        {transaction && (
          <TouchableOpacity
            style={styles.revertButton}
            onPress={() => submitRevert()}>
            <Text style={styles.revertButtonText}>Revert Transaction</Text>
          </TouchableOpacity>
        )}
      </View>
    </MODAL_BASE>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    width: '100%',
  },
  transaction_view: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    width: '97%',
    padding: 10,
    borderRadius: 20,
    borderColor: '#F2D5A0',
    borderWidth: 2,
    marginBottom: 20, // Add space for the revert button
  },
  listContent: {
    flexGrow: 1,
  },
  revertButton: {
    backgroundColor: '#FF6B6B', // A red pastel color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  revertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#164C45', // Aligns with your revert button's styling
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10, // Ensure some space around the button
    alignSelf: 'center', // Center button horizontally
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    height: 40, // Adjust the height as needed
    backgroundColor: '#e0e0e0', // A neutral color for the header background
  },
  headerText: {
    fontWeight: 'bold',
    color: '#000', // Dark text for contrast against the header background
    flex: 1,
    textAlign: 'center',
  },
  // Add or adjust any other styles as needed
});
