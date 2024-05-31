import React from 'react';
import {
  TouchableOpacity,
  Keyboard,
  KeyboardEvent,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
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
const http = http_req();
const {BarcodePrinterModule} = NativeModules;

export default function LABEL_MODAL(props: any) {
  const pressAnim = React.useRef(new Animated.Value(1)).current;
  const [error, setError] = React.useState(false);
  const errorData = React.useRef<any>({});
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');

  React.useEffect(() => {
    if (props.refresh == true) init();
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
  const [products, set_products] = React.useState<any[]>([]);
  const [selected_product, set_selected_product] = React.useState<any>(null);
  const [quantity, set_quantity] = React.useState(70); // default value set to 70
  const [multiplier, setMultiplier] = React.useState(1); // default value set to 1

  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const [employeeList, setEmployeeList] = React.useState<any[]>(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any>(null);

  React.useEffect(() => {
    setFilteredData(products);
  }, [products]);

  React.useEffect(() => {
    if (searchQuery === '') return setFilteredData(products);
    else {
      const newData = products.filter(item =>
        item.NAME.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(newData);
    }
  }, [searchQuery]);

  const print_label = () => {
    if (!selected_product || !selectedEmployee) {
      Alert.alert('Please select and fill all fields');
      return;
    }
    setLoading(true);
    setLoadingText('Awaiting Printing Barcode');
    const print_data = {
      PRODUCT_ID: selected_product.PRODUCT_ID,
      NAME: selectedEmployee.NAME,
      QUANTITY: quantity,
      MULTIPLIER: multiplier,
      PRODUCT_NAME: selected_product.NAME,
      EMPLOYEE_ID: selectedEmployee.EMPLOYEE_ID,
      SRC: 'Manually Printed',
    };
    http.genBarcode(print_data, (result: any) => {
      setLoading(false);

      BarcodePrinterModule.printBarcodes(result.data, result => {
        if (result == 0) {
          Alert.alert('Barcode Printed');

          props.set_visible(false);
        } else if (result == 1) {
          Alert.alert('Printing Cancenlled by user');
        } else {
          Alert.alert('Error Printing Barcode');
        }
      });
    });
  };

  const init = async () => {
    http.getEmployees((data: any) => {
      const newRes = data.data.employees.map((item: any) => {
        return {...item, focus: false};
      });
      setEmployeeList(newRes);
    });
    http.getProducts((data: any) => {
      if (data.error) {
        setError(true);
        setErrorData(data);
        return;
      } else {
        const newRes = data.data.map((item: any) => {
          return {...item, focus: false};
        });
        set_products(newRes);
      }
    });
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    const keyboardWillShow = (event: KeyboardEvent) => {
      setKeyboardOffset(event.endCoordinates.height - 120);
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

  const onFocus_Employee = (employee: any) => {
    const newRes = employeeList.map(item => {
      if (item.NAME === employee.NAME) {
        if (item.focus === true) {
          setSelectedEmployee(null);
          return {...item, focus: false};
        } else {
          setSelectedEmployee(employee);
          return {...item, focus: true};
        }
      } else {
        return {...item, focus: false};
      }
    });
    setEmployeeList(newRes);
  };

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
        <Text style={{fontSize: 15, color: index % 2 == 0 ? 'black' : 'white'}}>
          {item.NAME}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const onFocus_Product = (item: any) => {
    const newRes = filteredData.map(obj => {
      if (obj.PRODUCT_ID == item.PRODUCT_ID) {
        if (item.focus === true) {
          set_selected_product(null);
          return {...obj, focus: false};
        } else {
          set_selected_product(item);
          return {...obj, focus: true};
        }
      } else {
        return {...obj, focus: false};
      }
    });
    setFilteredData(newRes);
  };

  const product_entry = (item: any, index: any) => {
    return (
      <TouchableOpacity onPress={() => onFocus_Product(item)}>
        <View
          style={{
            backgroundColor: index % 2 == 0 ? '#89BE63' : '#9CBFA9',
            borderRadius: 50,
            width: '85%',
            height: item.focus ? 150 : 100,
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
          <Text style={{color: '#ECF9F2', fontSize: 20, fontWeight: 'bold'}}>
            {item.NAME}
          </Text>
          <View
            style={{
              width: 100,
              height: '40%',
              backgroundColor: 'orange',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Text>{item.PRODUCT_ID}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const reset_all = () => {
    const newRes2 = products.map((item: any) => {
      return {...item, focus: false};
    });
    set_products(newRes2);
    set_quantity(70); // Reset to default value
    setMultiplier(1); // Reset to default value
  };

  return (
    <MODAL_BASE
      visible={props.visible}
      set_visible={props.set_visible}
      title={props.title}
      keyboardOffset={keyboardOffset}
      reset={reset_all}>
      <View style={styles.main_view_base}>
        {/* Product List */}
        <View style={styles.FlatList_View}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              alignSelf: 'center',
              marginTop: '5%',
              fontWeight: '600',
            }}>
            Products
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 20,
              margin: 10,
              padding: 4,
              backgroundColor: 'white',
            }}>
            <Ionicons
              name={'search-outline'}
              size={15}
              color={'black'}
              style={{marginLeft: 2}}
            />
            <TextInput
              style={{
                paddingHorizontal: 10,
                marginLeft: 8,
                color: 'black',
                width: '93%',
                height: '100%',
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
              placeholder="Search Products"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <FlatList
            data={filteredData}
            renderItem={({item, index}) => product_entry(item, index)}
            keyExtractor={(item: any) => item.PRODUCT_ID}
          />
        </View>

        {/* Employee List & Quantity/Multiplier Inputs */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 20,
            height: '50%',
          }}>
          {/* Employee List */}

          <View style={styles.employeeList_View}>
            <Text style={{fontSize: 20, fontWeight: '400', marginBottom: 6}}>
              Select Employee:{' '}
            </Text>
            <FlatList
              data={employeeList}
              renderItem={({item, index}) => employee_entry(item, index)}
              keyExtractor={item => item.NAME}
            />
          </View>

          <View style={styles.quantityMultiplier_View}>
            {/* Quantity Slider Section */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Quantity: {quantity}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={120}
                step={1}
                value={quantity}
                onValueChange={value => set_quantity(value)}
                minimumTrackTintColor="#89BE63"
                maximumTrackTintColor="silver"
                thumbTintColor="#89BE63"
              />
            </View>

            {/* Multiplier Slider Section */}
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Multiplier: {multiplier}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={multiplier}
                onValueChange={value => setMultiplier(value)}
                minimumTrackTintColor="#89BE63"
                maximumTrackTintColor="silver"
                thumbTintColor="#89BE63"
              />
            </View>

            <Animated.View
              style={[
                styles.submitButton_View,
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
                onPress={() => print_label()}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                  Print
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Submit Button */}
      </View>
      <CustomLoader isLoading={loading} message={loadingText} />
    </MODAL_BASE>
  );
}

const styles = StyleSheet.create({
  main_view_base: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    width: '100%',
  },
  submitButton_View: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'coral',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  FlatList_View: {
    width: '100%',
    flex: 1,
    backgroundColor: '#CFEDEE',
    borderRadius: 20,
    borderColor: '#89BE63',
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    minHeight: 400,
  },
  employeeList_View: {
    backgroundColor: '#FBC740',
    width: '50%',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxHeight: 300,
    borderColor: '#F2D5A0',
    borderWidth: 4,
  },
  quantityMultiplier_View: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  sliderSection: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
