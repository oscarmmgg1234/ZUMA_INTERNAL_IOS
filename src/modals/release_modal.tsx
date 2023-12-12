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
} from 'react-native';
import MODAL_BASE from '../modal_component';
import {
  Camera,
  useCodeScanner,
  useCameraDevice,
} from 'react-native-vision-camera';
import {http_req} from '../http/req';
import ErrorAlert from '../alerts/Error_Alert';

const http = http_req();

export default function RELEASE_MODAL(props: any) {

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
  const [employee, setEmployee] = React.useState('');

  const [employee_list, set_employee_list] = React.useState<
    {EMPLOYEE_ID: string; NAME: string; focus: boolean}[]
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
  }, []);

  const onFocus_Employee = (employee: any) => {
    const newRes = employee_list.map(item => {
      if (item.NAME === employee.NAME) {
        if (item.focus === true) {
          return {...item, focus: false};
        } else {
          setEmployee(employee.NAME);
          return {...item, focus: true};
        }
      } else {
        return {...item, focus: false};
      }
    });
    set_employee_list(newRes);
  };

  const employee_entry = (items: any) => {
    return (
      <TouchableOpacity
        onPress={() => onFocus_Employee(items)}
        style={{
          width: 300,
          height: 50,
          backgroundColor: '#89BE63',
          marginVertical: 5,
          alignSelf: 'center',
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: items.focus ? 'coral' : '#89BE63',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
        <Text style={{color: '#ECF9F2'}}>{items.NAME}</Text>
      </TouchableOpacity>
    );
  };

  const pressAnim = React.useRef(new Animated.Value(1)).current;

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

  const [emp_button_focused, set_emp_button_focused] = React.useState(false);
  const [prod_button_focused, set_prod_button_focused] = React.useState(false);
  const [keyboardOffset, setKeyboardOffset] = React.useState(0);
  const [camera, setCamera] = React.useState(false);

  const [code, setCode] = React.useState('');

  const submitRelease = () => {
    http.productRelease({barcode: code}, (result: any) => {});
  }


  const button_focused = (button: string) => {
    if (button === 'emp') {
      set_emp_button_focused(true);
      set_prod_button_focused(false);
    }
    if (button === 'prod') {
      set_prod_button_focused(true);
      set_emp_button_focused(false);
    }
  };

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

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      setCode(codes[0].value);
      setCamera(false);
    },
  });
  const device = useCameraDevice('back');

  const reset_all = () => {
    const newRes = employee_list.map((item: any) => {
      return {...item, focus: false};
    });
    set_employee_list(newRes);
    setCode('');
    setCamera(false);
  };

  return (
    <MODAL_BASE
      visible={props.visible}
      set_visible={props.set_visible}
      title={props.title}
      keyboardOffset={keyboardOffset}
      reset={reset_all}>
      <View style={styles.main_view_base}>
        <View
          style={{
            width: '50%',
            height: '30%',
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
            <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>
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
        <TouchableOpacity
          style={styles.button_view}
          onPress={() => {
            setCamera(!camera);
            setCode('');
          }}>
          <View style={styles.button_content}>
            <Text style={{color: 'white', fontSize: 20, marginBottom: '5%'}}>
              Product
            </Text>
            {camera ? (
              <Camera
                {...props}
                style={StyleSheet.absoluteFill}
                codeScanner={codeScanner}
                device={device}
                isActive={camera}
              />
            ) : null}
            {code ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'auto',
                  paddingHorizontal: 30,
                  height: 40,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 20,
                }}>
                <Text style={{color: 'white', fontSize: 15}}>{code}</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        <Animated.View
          style={[
            {
              width: '30%',
              height: '10%',
              backgroundColor: '#CFEDEE',
              marginBottom: 80,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(0,0,0,0.2)',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
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
            onPress={() => {submitRelease(); props.set_visible(false);}}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontSize: 17}}>Release</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </MODAL_BASE>
  );
}

const styles = StyleSheet.create({
  main_view_base: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button_view: {
    width: '85%',
    height: '30%',
    backgroundColor: '#89BE63',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button_content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
