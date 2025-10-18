import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Button, Title, Paragraph, Card, Chip } from 'react-native-paper';
import { equipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../types';
import { colors, spacing } from '../../theme';
import { apiService } from '../../services/api.service';

export function EquipamentoDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipamento();
  }, [id]);

  async function loadEquipamento() {
    try {
      const data = await equipamentoService.getById(id);
      setEquipamento(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar equipamento');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  if (loading || !equipamento) {
    return <View style={styles.container} />;
  }

  const imageUrl = equipamento.imagens[0]
    ? apiService.getImageUrl(equipamento.imagens[0])
    : null;

  return (
    <ScrollView style={styles.container}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Title style={styles.title}>{equipamento.titulo}</Title>

        <View style={styles.infoRow}>
          <Chip icon="tag">{equipamento.categoria}</Chip>
          <Chip icon="map-marker">{`${equipamento.cidade}, ${equipamento.uf}`}</Chip>
        </View>

        <Card style={styles.priceCard}>
          <Card.Content>
            <Title style={styles.price}>
              R$ {equipamento.precoPorDia.toFixed(2)}/dia
            </Title>
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Descrição</Title>
        <Paragraph>{equipamento.descricao}</Paragraph>

        <Title style={styles.sectionTitle}>Proprietário</Title>
        <Paragraph>{equipamento.nomeProprietario}</Paragraph>

        {equipamento.mediaAvaliacoes && (
          <>
            <Title style={styles.sectionTitle}>Avaliação</Title>
            <Paragraph>
              ⭐ {equipamento.mediaAvaliacoes.toFixed(1)} ({equipamento.totalAvaliacoes} avaliações)
            </Paragraph>
          </>
        )}

        <Button
          mode="contained"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade de aluguel em desenvolvimento')}
          style={styles.button}
        >
          Solicitar Aluguel
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
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priceCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '20',
  },
  price: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
});
