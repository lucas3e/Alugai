import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Title } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing } from '../../theme';

export function PerfilScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user?.nome.substring(0, 2).toUpperCase() || 'U'} />
        <Title style={styles.name}>{user?.nome}</Title>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.location}>
          {user?.cidade}, {user?.uf}
        </Text>
      </View>

      <View style={styles.content}>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.button}
        >
          Editar Perfil
        </Button>

        <Button
          mode="contained"
          onPress={signOut}
          style={styles.button}
        >
          Sair
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  name: {
    marginTop: spacing.md,
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    color: colors.textSecondary,
  },
  location: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  button: {
    marginBottom: spacing.md,
  },
});
