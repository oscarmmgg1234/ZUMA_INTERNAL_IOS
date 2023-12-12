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
} from 'react-native';
import MODAL_BASE from '../modal_component';
import {http_req} from '../http/req';
import ErrorAlert from '../alerts/Error_Alert';

const http = http_req();

export default function LABEL_MODAL(props: any) {
  const pressAnim = React.useRef(new Animated.Value(1)).current;
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
  const [selected_product, set_selected_product] = React.useState<any>({});
  const [quantity, set_quantity] = React.useState<string>('');

  // class Barcode {
  // constructor(args) {
  //   this.product_id = args.PRODUCT_ID;
  //   this.employee = args.NAME != "" ? args.NAME : "NULL";
  //   this.quantity = args.QUANTITY;
  //   this.multiplier = args.MULTIPLIER;
  //   this.product_name = args.PRODUCT_NAME;
  // }
  const print_label = () => {
    const print_data = {
      PRODUCT_ID: selected_product.PRODUCT_ID,
      NAME: "",
      QUANTITY: parseInt(quantity),
      MULTIPLIER: "1", 
      PRODUCT_NAME: selected_product.NAME,
      EMPLOYEE_ID: "",
    }
    http.genBarcode(print_data, (result: any) => {
    Alert.alert("barcode printed")
    })  
  }


  React.useEffect(() => {
    http.getProducts((data: any) => {
      if (data.error) {
        setError(true);
        setErrorData(data);
        return;
      }
      else{
      const newRes = data.data.map((item: any) => {
        return {...item, focus: false};
      });
      set_products(newRes);
    }
    });
  }, []);

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

  const onFocus_Product = (item: any) => {
    const newRes = products.map(obj => {
      if (obj.PRODUCT_ID == item.PRODUCT_ID) {
        if (item.focus === true) {
          return {...obj, focus: false};
        } else {
          set_selected_product(item);
          return {...obj, focus: true};
        }
      } else {
        return {...obj, focus: false};
      }
    });
    set_products(newRes);
  };

  const product_entry = (item: any) => {
    return (
      <TouchableOpacity onPress={() => onFocus_Product(item)}>
        <View
          style={{
            backgroundColor: '#89BE63',
            borderRadius: 50,
            width: '85%',
            height: 100,
            alignSelf: 'center',
            marginVertical: 3,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderColor: item.focus ? 'coral' : '#89BE63',
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
              backgroundColor: '#05F26C',
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

  //react useeffect to add is focused to each product so that you can toggle between them
  //quantity as text input and send that data back to the parent component

  const reset_all = () => {
    const newRes2 = products.map((item: any) => {
      return {...item, focus: false};
    });
    set_products(newRes2);
    set_quantity('');
  };
  return (
    <MODAL_BASE
      visible={props.visible}
      set_visible={props.set_visible}
      title={props.title}
      keyboardOffset={keyboardOffset}
      reset={reset_all}>
      <View style={styles.main_view_base}>
        <View style={styles.FlatList_View}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              alignSelf: 'center',
              marginTop: '5%',
            }}>
            Products
          </Text>
          <Text
            style={{
              width: '99%',
              alignSelf: 'center',
              marginVertical: '2%',
              height: 3,
              backgroundColor: '#AFCCA9',
            }}></Text>
          <FlatList
            data={products}
            renderItem={({item}) => {
              return product_entry(item);
            }}
            keyExtractor={(item: any) => item.PRODUCT_ID}
          />
        </View>
        <View style={styles.quantity_view}>
          <Text style={{color: '#ECF9F2', fontSize: 20}}>Quantity</Text>
          <TextInput
            placeholder="Enter Quantity"
            showSoftInputOnFocus={true}
            value={quantity}
            onChangeText={text => set_quantity(text)}
            style={{
              color: 'white',
              marginTop: 20,
              backgroundColor: 'rgba(0,0,0,0.3)',
              fontSize: 30,
              width: '25%',
              height: '40%',
              textAlign: 'center',
              borderRadius: 20,
            }}
          />
        </View>
        <Animated.View
          style={[
            {
              width: '35%',
              height: '10%',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 40,
              borderRadius: 20,
              backgroundColor: 'coral',
              borderColor: 'coral',
              borderWidth: 1,
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
            onPress={() => print_label()}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              Print
            </Text>
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
  FlatList_View: {
    width: '80%',
    height: '50%',
    backgroundColor: '#CFEDEE',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quantity_view: {
    width: '80%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#89BE63',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
