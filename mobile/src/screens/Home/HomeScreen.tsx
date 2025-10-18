import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Card, Title, Paragraph, Chip } from 'react-native-paper';
import { equipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../types';
import { colors, spacing } from '../../theme';
import { apiService } from '../../services/api.service';

export function HomeScreen({ navigation }: any) {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEquipamentos();
  }, []);

  async function loadEquipamentos() {
    setLoading(true);
    try {
      const response = await equipamentoService.list({
        busca: searchQuery || undefined,
        page: 1,
        pageSize: 20,
      });
      setEquipamentos(response.data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar equipamentos');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadEquipamentos();
    setRefreshing(false);
  }

  function handleSearch() {
    loadEquipamentos();
  }

  function renderEquipamento({ item }: { item: Equipamento }) {
    const imageUrl = item.imagens[0] 
      ? apiService.getImageUrl(item.imagens[0])
      : null;

    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('EquipamentoDetail', { id: item.id })}
      >
        {imageUrl && (
          <Card.Cover source={{ uri: imageUrl }} style={styles.cardImage} />
        )}
        <Card.Content>
          <Title>{item.titulo}</Title>
          <Paragraph numberOfLines={2}>{item.descricao}</Paragraph>
          <View style={styles.cardFooter}>
            <Chip icon="map-marker">{`${item.cidade}, ${item.uf}`}</Chip>
            <Title style={styles.price}>R$ {item.precoPorDia.toFixed(2)}/dia</Title>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar equipamentos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
      />

      <FlatList
        data={equipamentos}
        renderItem={renderEquipamento}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchbar: {
    margin: spacing.md,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardImage: {
    height: 200,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  price: {
    color: colors.primary,
  },
});
