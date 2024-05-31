import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  FlatList,
  Keyboard,
  KeyboardEvent,
  Animated,
  Alert,
  NativeModules,
} from 'react-native';
import Slider from '@react-native-community/slider';
import MODAL_BASE from '../modal_component';
import {http_req} from '../http/req';
import ErrorAlert from '../alerts/Error_Alert';
import CustomLoader from '../Components/LoadingIndicators/loading';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {BarcodePrinterModule} = NativeModules;

// BarcodePrinterModule.printBarcodes(barcodeBuffers, response => {
//   console.log(response); // "Printing started successfully." or any error message
// });

const http = http_req();

export default function ACTIVATION_MODAL(props: any) {
  const [error, setError] = React.useState(false);
  const errorData = React.useRef<any>({});
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');

  React.useEffect(() => {
    if (props.refresh == true) {
      init();
    }
  }, [props.refresh]);

  function setErrorData(data: any) {
    errorData.current = data;
  }

  React.useEffect(() => {
    if (error) {
      ErrorAlert(errorData.current.process_des);
      setError(false);
    }
  }, [error]);

  const pressAnim = React.useRef(new Animated.Value(1)).current;
  const pressAnim2 = React.useRef(new Animated.Value(1)).current;
  const pressAnim3 = React.useRef(new Animated.Value(1)).current;
  const onPressIn2 = () => {
    Animated.timing(pressAnim2, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut2 = () => {
    Animated.timing(pressAnim2, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const onPressIn3 = () => {
    Animated.timing(pressAnim3, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut3 = () => {
    Animated.timing(pressAnim3, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const onPressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
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

  const [type, set_type] = React.useState(true);
  const [amount, set_amount] = React.useState(70); // Updated to default to 1
  const [multiplier, set_multiplier] = React.useState(1); // Updated to default to 1

  const [step, set_step] = React.useState(true);
  const [employee, setEmployee] = React.useState('');

  const [employee_list, set_employee_list] = React.useState<
    {EMPLOYEE_ID: string; NAME: string; focus: boolean}[]
  >([]);
  const [product_list, set_product_list] = React.useState<
    {
      PRODUCT_ID: string;
      focus: boolean;
      NAME: string;
      ACTIVATION_TOKEN: string;
    }[]
  >([]);

  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    setFilteredData(product_list);
  }, [product_list]);

  React.useEffect(() => {
    if (searchQuery === '') return setFilteredData(product_list);
    else {
      const newData = product_list.filter(item =>
        item.NAME.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(newData);
    }
  }, [searchQuery]);

  const init = () => {
    http.getEmployees((result: any) => {
      if (result.error) {
        setError(true);
        setErrorData(result);
        return;
      } else {
        const newRes = result.data.employees.map((item: any) => {
          return {...item, focus: false};
        });
        set_employee_list(newRes);
      }
    });
    http.getProduct(type, (result: any) => {
      if (result.error) {
        setError(true);
        setErrorData(result);
        return;
      } else {
        const newRes = result.data.activation_products.map((item: any) => {
          return {...item, focus: false};
        });
        set_product_list(newRes);
      }
    });
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    http.getProduct(type, (result: any) => {
      if (result.error) {
        setError(true);
        setErrorData(result);
        return;
      } else {
        const newRes = result.data.activation_products.map((item: any) => {
          return {...item, focus: false};
        });
        set_product_list(newRes);
      }
    });
  }, [type]);

  const onFocus_Product = (product: any) => {
    const newRes: {
      PRODUCT_ID: string;
      focus: boolean;
      NAME: string;
      ACTIVATION_TOKEN: string;
    }[] = filteredData.map(
      (item: {
        PRODUCT_ID: string;
        focus: boolean;
        NAME: string;
        ACTIVATION_TOKEN: string;
      }) => {
        if (item.PRODUCT_ID === product) {
          if (item.focus === true) {
            set_step(true);
            return {...item, focus: false};
          } else {
            set_step(true);
            return {...item, focus: true};
          }
        } else {
          return {...item, focus: false};
        }
      },
    );
    setFilteredData(newRes);
  };
  const onFocus_Employee = (employee: any) => {
    const newRes = employee_list.map(item => {
      if (item.NAME === employee.NAME) {
        if (item.focus === true) {
          set_step(true);
          return {...item, focus: false};
        } else {
          setEmployee(employee.NAME);
          set_step(true);
          return {...item, focus: true};
        }
      } else {
        return {...item, focus: false};
      }
    });
    set_employee_list(newRes);
  };

  const activate = () => {
    const employee = employee_list.find((item: any) => item.focus);
    const employee_id = employee?.EMPLOYEE_ID;
    const product = filteredData.find((item: any) => item.focus);

    // Check for undefined or null values and validate amount and multiplier
    if (
      !employee_id ||
      !product ||
      amount <= 0 ||
      isNaN(Number(multiplier)) ||
      Number(multiplier) <= 0
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Construct the request object using the found employee and product details
    const request = {
      EMPLOYEE_ID: employee_id,
      PRODUCT_ID: product.PRODUCT_ID,
      QUANTITY: amount,
      MULTIPLIER: multiplier,
      EMPLOYEE_NAME: employee.NAME,
      PRODUCT_NAME: product.NAME,
      SRC: 'Activation',
      PROCESS_TOKEN: product.ACTIVATION_TOKEN,
      PROCESS: 'activation',
    };
    setLoading(true);
    setLoadingText('Activating product and awaiting printing barcode...');
    // Send the activation request
    http.sendActivation(request, (result: any) => {
      setLoading(false);

      BarcodePrinterModule.printBarcodes(
        result.data.barcodeBuffer,
        response => {
          if (response == 0) {
            Alert.alert('Success', 'Activation Sent and Printing Barcode...');

            // Reset the form fields and any other necessary states
            setEmployee('');
            setSearchQuery('');
            set_amount(70); // Reset to default value
            set_multiplier(1); // Reset to default value
            props.modal_completion(false);

            // Re-initialize or refresh any necessary data
            init();
          } else if (response == 1) {
            Alert.alert('Error', 'Barcode Printing cancelled');
          } else if (response == 2) {
            Alert.alert('Error', 'Barcode Printing failed');
          }
        },
      );
      // Callback logic after sending the activation request
    });

    // Show success alert
  };

  const activate_release = () => {
    const employee = employee_list.find((item: any) => item.focus);
    const employee_id = employee?.EMPLOYEE_ID;
    const product = filteredData.find((item: any) => item.focus);

    // Check for undefined or null values and validate amount and multiplier
    if (
      !employee_id ||
      !product ||
      isNaN(Number(multiplier)) ||
      Number(multiplier) != 1
    ) {
      Alert.alert(
        'Error',
        'Please fill all fields or for act release multiplier must be 1',
      );
      return;
    }

    // Construct the request object using the found employee and product details
    const request = {
      EMPLOYEE_ID: employee_id,
      PRODUCT_ID: product.PRODUCT_ID,
      QUANTITY: amount,
      MULTIPLIER: multiplier,
      EMPLOYEE_NAME: employee.NAME,
      PRODUCT_NAME: product.NAME,
      SRC: 'Activation',
      PROCESS_TOKEN: product.ACTIVATION_TOKEN,
      PROCESS: 'activation',
    };
    setLoading(true);
    setLoadingText('Activating product and awaiting printing barcode...');
    // Send the activation request
    http.submitActRelease(request, (result: any) => {
      setLoading(false);

      BarcodePrinterModule.printBarcodes(
        result.data.barcodeBuffer,
        response => {
          if (response == 0) {
            Alert.alert(
              'Success',
              'Activation/Release Sent and Printing Barcode...',
            );

            // Reset the form fields and any other necessary states
            setEmployee('');
            setSearchQuery('');
            set_amount(70); // Reset to default value
            set_multiplier(1); // Reset to default value
            props.modal_completion(false);

            // Re-initialize or refresh any necessary data
            init();
          } else if (response == 1) {
            Alert.alert('Error', 'Barcode Printing cancelled');
          } else if (response == 2) {
            Alert.alert('Error', 'Barcode Printing failed');
          }
        },
      );
      // Callback logic after sending the activation request
    });

    // Show success alert
  };

  type ItemProps = {
    NAME: string;
    PRODUCT_ID: string;
    focus: boolean;
    PROCESS_TOKEN: string;
  };

  const Entry = (item: ItemProps, index: any) => (
    <TouchableOpacity
      onPress={() => {
        onFocus_Product(item.PRODUCT_ID);
      }}>
      <View
        style={{
          backgroundColor: index % 2 == 0 ? '#AFCCA9' : '#9CBFA9',
          height: item.focus ? 150 : 100,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: 50,
          marginVertical: '1%',
          marginHorizontal: '1%',
          borderColor: item.focus ? 'coral' : 'black',
          borderWidth: item.focus ? 5 : 0,
          borderStyle: 'solid',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
        <Text style={{fontSize: 20}}>{item.NAME}</Text>
        <View
          style={{
            width: 100,
            height: '40%',
            backgroundColor: 'orange',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text style={{fontSize: 12}}>{item.PRODUCT_ID}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const employee_entry = (item: any, index: any) => (
    <TouchableOpacity
      onPress={() => {
        onFocus_Employee(item);
      }}>
      <View
        style={{
          backgroundColor: index % 2 == 0 ? '#CFEDEE' : '#66A3A4',
          height: 60,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: 50,
          marginVertical: '2%',
          marginHorizontal: '1%',
          borderColor: item.focus ? 'coral' : 'black',
          borderWidth: item.focus ? 5 : 0,
          borderStyle: 'solid',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
        <Text style={{fontSize: 15}}>{item.NAME}</Text>
      </View>
    </TouchableOpacity>
  );

  const reset_all = () => {
    const newRes = employee_list.map((item: any) => {
      return {...item, focus: false};
    });
    set_employee_list(newRes);
    const newRes2 = product_list.map((item: any) => {
      return {...item, focus: false};
    });
    set_product_list(newRes2);
    set_type(true);
    setEmployee('');
  };

  return (
    <>
      <MODAL_BASE
        keyboardOffset={keyboardOffset}
        visible={props.visible}
        set_visible={props.set_visible}
        title={props.title}
        reset={reset_all}>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              width: '100%',
              height: '60%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: '100%',
                width: '30%',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              {/* new flat */}
              <View
                style={{
                  width: '110%',
                  height: '50%',
                  borderRadius: 50,
                  backgroundColor: '#AFCCA9',
                  borderColor: '#89BE63',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '10%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>
                    Employees{' '}
                  </Text>
                </View>
                <Text
                  style={{
                    width: '99%',
                    alignSelf: 'center',
                    marginTop: '5%',
                    height: 3,
                    backgroundColor: '#89BE63',
                  }}></Text>

                <View
                  style={{
                    width: '100%',
                    height: '90%',
                    borderRadius: 50,
                    paddingBottom: 35,
                    paddingTop: 10,
                    paddingHorizontal: 10,
                  }}>
                  <FlatList
                    data={employee_list}
                    renderItem={({item, index}) => employee_entry(item, index)}
                    keyExtractor={item => item.NAME}
                  />
                </View>
              </View>
              <Animated.View
                style={[
                  styles.activation_modal_type,
                  {
                    transform: [{scale: pressAnim}],
                    elevation: pressAnim.interpolate({
                      inputRange: [0.9, 1],
                      outputRange: [2, 5],
                    }),
                  },
                ]}>
                <TouchableOpacity
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  style={styles.touchableArea}
                  onPress={() => {
                    set_type(!type);
                  }}>
                  <Text
                    style={{
                      color: '#89BE63',
                      fontSize: 28,
                      fontWeight: 'bold',
                      opacity: 1,
                    }}>
                    {type ? 'Liquid' : 'Pills'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View
              style={{
                width: '60%',
                height: '90%',
                borderRadius: 50,
                backgroundColor: '#CFEDEE',
                borderColor: '#AFCCA9',
                borderWidth: 4,
                borderStyle: 'solid',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.6,
                shadowRadius: 5,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '10%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Text style={styles.Activation_Modal_ProductList_headers}>
                  Product{' '}
                </Text>
              </View>
              <Text
                style={{
                  width: '98%',
                  alignSelf: 'center',

                  height: 3,
                  backgroundColor: '#89BE63',
                }}></Text>

              <View
                style={{
                  width: '100%',
                  height: '90%',
                  borderRadius: 50,
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    borderRadius: 20,
                    marginHorizontal: 10,
                    paddingHorizontal: 10,
                    height: 40,
                    marginBottom: 7,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 6,
                  }}>
                  <Ionicons name={'search-outline'} size={15} color={'white'} />
                  <TextInput
                    placeholderTextColor={'white'}
                    value={searchQuery}
                    placeholder="Search..."
                    onChangeText={text => setSearchQuery(text)}
                    style={{
                      width: '91%',
                      paddingHorizontal: 10,
                      height: '85%',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      marginLeft: 5,
                      fontSize: 20,
                      color: 'white',
                      borderRadius: 10,
                    }}
                  />
                </View>
                <FlatList
                  data={filteredData}
                  renderItem={({item, index}) => Entry(item, index)}
                  keyExtractor={item => item.PRODUCT_ID}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: '10%',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text style={styles.sliderLabel}>Amount: {amount}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={110}
                tapToSeek={true}
                step={1}
                value={amount}
                onValueChange={value => set_amount(value)}
                minimumTrackTintColor="#89BE63"
                maximumTrackTintColor="silver"
                thumbTintColor="#89BE63"
              />
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: '10%',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text style={styles.sliderLabel}>Cases: {multiplier}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                tapToSeek={true}
                step={1}
                value={multiplier}
                onValueChange={value => set_multiplier(value)}
                minimumTrackTintColor="#89BE63"
                maximumTrackTintColor="silver"
                thumbTintColor="#89BE63"
              />
            </View>
          </View>

          <Text
            style={{
              backgroundColor: '#89BE63',
              width: '100%',
              height: '0.5%',
            }}
          />
          {!step ? null : (
            <>
              <View
                style={{
                  width: '100%',
                  height: '10%',
                  alignItems: 'center',
                  alignContent: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <Animated.View
                  style={[
                    styles.activation_modal_submit,
                    {
                      transform: [{scale: pressAnim2}],
                      elevation: pressAnim2.interpolate({
                        inputRange: [0.9, 1],
                        outputRange: [2, 5],
                      }),
                    },
                  ]}>
                  <TouchableOpacity
                    onPressIn={onPressIn2}
                    onPressOut={onPressOut2}
                    style={styles.touchableArea}
                    onPress={() => {
                      activate();
                    }}>
                    <Text style={styles.activation_button_text}>Activate</Text>
                  </TouchableOpacity>
                </Animated.View>
                {multiplier == 1 ? (
                  <Animated.View
                    style={[
                      styles.activation_modal_submit,
                      {
                        transform: [{scale: pressAnim3}],
                        elevation: pressAnim3.interpolate({
                          inputRange: [0.9, 1],
                          outputRange: [2, 5],
                        }),
                      },
                    ]}>
                    <TouchableOpacity
                      onPressIn={onPressIn3}
                      onPressOut={onPressOut3}
                      style={styles.touchableArea}
                      onPress={() => {
                        activate_release();
                      }}>
                      <Text style={styles.activation_button_text}>
                        Activate/Release
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ) : null}
              </View>
            </>
          )}
        </View>
        <CustomLoader isLoading={loading} message={loadingText} />
      </MODAL_BASE>
    </>
  );
}

const styles = StyleSheet.create({
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
  },
  content_button_text: {
    color: '#ECF9F2',
    fontSize: 30,
    fontWeight: 'bold',
  },
  activation_modal_type: {
    backgroundColor: '#CFEDEE',
    width: '70%',
    height: '20%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activation_modal_amount: {
    backgroundColor: '#89BE63',
    width: '40%',
    height: '85%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activation_modal_submit: {
    backgroundColor: 'coral',
    width: '40%',
    height: '90%',
    marginTop: '2%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  activation_button_text: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 30,
    fontWeight: 'bold',
  },
  Activation_Modal_ProductList_headers: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  sliderLabel: {
    color: 'black',
    fontSize: 30,
  },
  slider: {
    width: '70%',
    height: 40,
  },
});
