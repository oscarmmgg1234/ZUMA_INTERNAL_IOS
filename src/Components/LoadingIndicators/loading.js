import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

const CustomLoader = ({isLoading, message}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure the loader is on top of other content
  },
  message: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default CustomLoader;
