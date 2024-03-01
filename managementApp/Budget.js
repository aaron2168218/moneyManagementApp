import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Budget() {
  return (
    <View style={styles.container}>
      <Text>Budget</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
