import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { colors, spacing } from '../../theme';

export function MeusEquipamentosScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Meus Equipamentos</Text>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEquipamento')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
