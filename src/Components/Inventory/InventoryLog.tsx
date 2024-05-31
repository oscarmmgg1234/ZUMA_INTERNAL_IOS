import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList, TextInput} from 'react-native';
import MODAL_BASE from '../../modal_component';
import {http_req} from '../../http/req';
import CustomLoader from '../../Components/LoadingIndicators/loading';

const http = http_req();

export default function InventoryModal(props) {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading Inventory...');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (props.visible) {
      fetchInventoryData();
    }
  }, [props.visible]); // Watching for changes to `props.visible`

  const fetchInventoryData = () => {
    setLoading(true);
    http.getProductInventory(result => {
      setInventory(result.data);
      setFilteredInventory(result.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const formattedQuery = text.toLowerCase();
    const filteredData = inventory.filter(item => {
      return item.PRODUCT_NAME.toLowerCase().includes(formattedQuery);
    });
    setFilteredInventory(filteredData);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.header, styles.productNameHeader]}>
        Product Name
      </Text>
      <Text style={[styles.header, styles.stockHeader]}>Stock</Text>
      <Text style={[styles.header, styles.stockHeader]}>Stored</Text>
      <Text style={[styles.header, styles.stockHeader]}>Active</Text>
    </View>
  );

  const renderItem = ({item, index}) => {
    const backgroundColor = index % 2 === 0 ? styles.evenRow : styles.oddRow;
    return (
      <View style={[styles.row, backgroundColor]}>
        <Text style={[styles.cell, styles.productName, {backgroundColor: "#F5F5DC", paddingHorizontal: 10, height: "85%"}]}>
          {item.PRODUCT_NAME}
        </Text>
        <Text style={[styles.cell, styles.stock]}>{item.STOCK}</Text>
        <Text style={[styles.cell, styles.stock]}>{item.STORED_STOCK}</Text>
        <Text style={[styles.cell, styles.stock]}>{item.ACTIVE_STOCK}</Text>
      </View>
    );
  };

  return (
    <MODAL_BASE
      visible={props.visible}
      set_visible={props.set_visible}
      title={props.title}
      keyboardOffset={0}
      reset={() => {}}>
      {loading ? (
        <CustomLoader isLoading={loading} message={loadingText} />
      ) : (
        <>
          <TextInput
            placeholder="Search Products..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <FlatList
            data={filteredInventory}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
          />
        </>
      )}
    </MODAL_BASE>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: '#E8E8E8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  evenRow: {
    backgroundColor: '#FFF',
  },
  oddRow: {
    backgroundColor: '#F7F7F7',
  },
  cell: {
    paddingVertical: 15,
    flex: 1,
  },
  header: {
    fontWeight: 'bold',
    flex: 1,
    paddingVertical: 15,
  },
  productName: {
    flex: 2, // Give more space to product name if needed
  },
  productNameHeader: {
    flex: 2, // Match the flex value with productName
  },
  stock: {
    textAlign: 'center',
  },
  stockHeader: {
    textAlign: 'center',
  },
});
