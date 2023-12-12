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
} from 'react-native';
import MODAL_BASE from '../modal_component';
import {http_req} from '../http/req';
import ErrorAlert from '../alerts/Error_Alert';

const http = http_req();

export default function ACTIVATION_MODAL(props: any) {
  const [error, setError] = React.useState(false);
  const errorData = React.useRef<any>({});

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
      setKeyboardOffset(event.endCoordinates.height);
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
  const [amount, set_amount] = React.useState({fixed: true, amount: 0});
  const [multiplier, set_multiplier] = React.useState('1');

  const [step, set_step] = React.useState(false);
  const [employee, setEmployee] = React.useState('');

  const [employee_list, set_employee_list] = React.useState<
    {EMPLOYEE_ID: string; NAME: string; focus: boolean}[]
  >([]);
  const [product_list, set_product_list] = React.useState<
    {PRODUCT_ID: string; focus: boolean; NAME: string}[]
  >([]);

  React.useEffect(() => {
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
    const newRes: {PRODUCT_ID: string; focus: boolean; NAME: string}[] =
      product_list.map(
        (item: {PRODUCT_ID: string; focus: boolean; NAME: string}) => {
          if (item.PRODUCT_ID === product) {
            if (item.focus === true) {
              set_step(false);
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
    set_product_list(newRes);
  };
  const onFocus_Employee = (employee: any) => {
    const newRes = employee_list.map(item => {
      if (item.NAME === employee.NAME) {
        if (item.focus === true) {
          set_step(false);
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
    
    const request = {
      EMPLOYEE_ID: employee_list.filter(
        (item: any) => item.NAME === employee,
      )[0].EMPLOYEE_ID,
      PRODUCT_ID: product_list.filter((item: any) => item.focus === true)[0]
        .PRODUCT_ID,
      fixed: amount.fixed,
      QUANTITY: amount.amount,
      MULTIPLIER: multiplier,
      EMPLOYEE_NAME: employee_list.filter((item: any)=>item.NAME === employee)[0].NAME,
      PRODUCT_NAME: product_list.filter((item: any)=>item.focus === true)[0].NAME,

    };
    http.sendActivation(request, (result: any) => {
    });
  };

  type ItemProps = {NAME: string; PRODUCT_ID: string; focus: boolean};

  const Entry = (item: ItemProps) => (
    <TouchableOpacity
      onPress={() => {
        onFocus_Product(item.PRODUCT_ID);
      }}>
      <View
        style={{
          backgroundColor: '#CFEDEE',
          height: 100,
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
            backgroundColor: '#05F26C',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text style={{fontSize: 12}}>{item.PRODUCT_ID}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const employee_entry = (item: any) => (
    <TouchableOpacity
      onPress={() => {
        onFocus_Employee(item);
      }}>
      <View
        style={{
          backgroundColor: '#CFEDEE',
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
                    renderItem={({item}) => employee_entry(item)}
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
                backgroundColor: '#AFCCA9',
                borderColor: '#60BF89',
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
                <FlatList
                  data={product_list}
                  renderItem={({item}) => Entry(item)}
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
              <TouchableOpacity
                style={styles.activation_modal_amount}
                onPress={() => set_amount({...amount, fixed: !amount.fixed})}>
                <Text style={styles.content_button_text}>
                  {amount.fixed ? 'Amount: Fixed' : 'Amount: Custom'}
                </Text>
              </TouchableOpacity>
              {amount.fixed ? null : (
                <TextInput
                  placeholder="Enter Amount"
                  inputMode="numeric"
                  value={amount.amount.toString()}
                  onChangeText={text => {
                    if (text === '') return set_amount({...amount, amount: 0});
                    else {
                      set_amount({...amount, amount: parseInt(text)});
                    }
                  }}
                  keyboardType="numeric"
                  style={{
                    width: '30%',
                    height: '60%',
                    color: 'black',
                    fontSize: 20,
                    backgroundColor: '#AFCCA9',
                    borderRadius: 50,
                    paddingHorizontal: 10,
                  }}
                />
              )}
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
              <View
                style={[
                  styles.activation_modal_amount,
                  {backgroundColor: '#89BE63'},
                ]}>
                <Text style={styles.content_button_text}>Quantity:</Text>
              </View>

              <TextInput
                placeholder="Enter Multiplier"
                inputMode="numeric"
                editable={amount.fixed}
                onBlur={() => {
                  set_multiplier('1');
                }}
                value={multiplier.toString()}
                onChangeText={text => {
                  set_multiplier(text);
                }}
                keyboardType="numeric"
                style={{
                  width: '30%',
                  height: '60%',
                  color: 'black',
                  fontSize: 20,
                  backgroundColor: '#AFCCA9',
                  borderRadius: 50,
                  paddingHorizontal: 10,
                }}
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
                  justifyContent: 'center',
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
                      props.modal_completion(false);
                    }}>
                    <Text style={styles.activation_button_text}>Activate</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </>
          )}
        </View>
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
});
