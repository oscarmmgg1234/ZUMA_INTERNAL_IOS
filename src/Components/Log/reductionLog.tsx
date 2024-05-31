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

const ReductionLog = React.memo((props: any) => {
  // Define how each item in the list should be rendered
  const renderItem = ({item, index}) => (
    <View style={index % 2 == 0 ? styles.row : styles.rowAlt}>
      <View style={{flex: 1, borderRadius: 40, backgroundColor: '#CEF09D'}}>
        <Text style={{textAlign: 'center'}}>{item.PRODUCT_NAME}</Text>
      </View>
      <Text style={styles.cell}>{item.EMPLOYEE_NAME}</Text>
      <Text style={styles.cell}>{item.QUANTITY}</Text>
      <Text style={styles.cell}>
        {new Date(item.DATETIME).toLocaleString()}
      </Text>
    </View>
  );

  // Render the FlatList with column titles and data rows
  return (
    <FlatList
      data={props.log.data}
      renderItem={renderItem}
      keyExtractor={item => Math.random().toString()}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.headerCell}>Product Name</Text>
          <Text style={styles.headerCell}>Employee</Text>
          <Text style={styles.headerCell}>Quantity</Text>
          <Text style={styles.headerCell}>Shipment Date</Text>
        </View>
      )}
    />
  );
});

// Define the styles for the FlatList and its items
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#CFEDEE',
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#ddd',
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowAlt: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default ReductionLog;
