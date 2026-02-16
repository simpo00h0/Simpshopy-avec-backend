'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Tabs,
  TextInput,
  Switch,
  NumberInput,
  Button,
} from '@mantine/core';
import { IconSettings, IconBuildingStore, IconCreditCard, IconTruck } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-utils';
import { useStoreStore } from '@/stores/storeStore';
import { LoadingScreen } from '@/components/LoadingScreen';

interface StoreData {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  settings?: {
    enableMobileMoney?: boolean;
    enableCardPayment?: boolean;
    enableBankTransfer?: boolean;
    enableCashOnDelivery?: boolean;
    enableShipping?: boolean;
    freeShippingThreshold?: number;
  };
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const currentStore = useStoreStore((s) => s.currentStore);
  const setCurrentStore = useStoreStore((s) => s.setCurrentStore);

  const storeForm = useForm({
    initialValues: {
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
    },
  });

  const settingsForm = useForm({
    initialValues: {
      enableMobileMoney: true,
      enableCardPayment: true,
      enableBankTransfer: true,
      enableCashOnDelivery: true,
      enableShipping: true,
      freeShippingThreshold: undefined as number | undefined,
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['store', currentStore?.id],
    queryFn: () => api.get<StoreData>(`/stores/${currentStore!.id}`).then((r) => r.data),
    enabled: !!currentStore?.id,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data) {
      storeForm.setValues({
        name: data.name || '',
        description: data.description || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
      });
      if (data.settings) {
        settingsForm.setValues({
          enableMobileMoney: data.settings.enableMobileMoney ?? true,
          enableCardPayment: data.settings.enableCardPayment ?? true,
          enableBankTransfer: data.settings.enableBankTransfer ?? true,
          enableCashOnDelivery: data.settings.enableCashOnDelivery ?? true,
          enableShipping: data.settings.enableShipping ?? true,
          freeShippingThreshold: data.settings.freeShippingThreshold,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- forms used for side effect only when data loads
  }, [data]);

  useEffect(() => {
    if (isError) {
      notifications.show({ title: 'Erreur de chargement', message: '', color: 'red' });
    }
  }, [isError]);

  const storeMutation = useMutation({
    mutationFn: (values: typeof storeForm.values) => api.patch(`/stores/${currentStore!.id}`, values),
    onSuccess: async () => {
      notifications.show({ title: 'Boutique mise à jour', message: '', color: 'green' });
      const { data: updated } = await api.get(`/stores/${currentStore!.id}`);
      queryClient.setQueryData(['store', currentStore!.id], updated);
      if (updated) setCurrentStore({ ...currentStore!, ...updated });
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const settingsMutation = useMutation({
    mutationFn: (values: typeof settingsForm.values) =>
      api.patch(`/stores/${currentStore!.id}/settings`, values),
    onSuccess: async () => {
      notifications.show({ title: 'Paramètres mis à jour', message: '', color: 'green' });
      const { data: updated } = await api.get(`/stores/${currentStore!.id}`);
      queryClient.setQueryData(['store', currentStore!.id], updated);
      if (updated?.settings) setCurrentStore({ ...currentStore!, settings: updated.settings });
    },
    onError: (err) => {
      notifications.show({ title: 'Erreur', message: getApiErrorMessage(err), color: 'red' });
    },
  });

  const onStoreSubmit = (values: typeof storeForm.values) => {
    if (!currentStore?.id) return;
    storeMutation.mutate(values);
  };

  const onSettingsSubmit = (values: typeof settingsForm.values) => {
    if (!currentStore?.id) return;
    settingsMutation.mutate(values);
  };

  if (!currentStore) {
    return (
      <Container fluid py="xl">
        <Title order={2} mb="xl">Paramètres</Title>
        <Text c="dimmed">Aucune boutique sélectionnée</Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container fluid py="xl">
        <Title order={2} mb="xl">Paramètres</Title>
        <LoadingScreen />
      </Container>
    );
  }

  return (
    <Container fluid py="xl">
      <Title order={2} mb="xl">Paramètres</Title>
      <Tabs defaultValue="store">
        <Tabs.List mb="lg">
          <Tabs.Tab value="store" leftSection={<IconBuildingStore size={18} />}>
            Boutique
          </Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<IconCreditCard size={18} />}>
            Paiements
          </Tabs.Tab>
          <Tabs.Tab value="shipping" leftSection={<IconTruck size={18} />}>
            Livraison
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="store">
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Title order={4} mb="md">Informations de la boutique</Title>
            <form onSubmit={storeForm.onSubmit(onStoreSubmit)}>
              <Stack gap="md">
                <TextInput label="Nom de la boutique" {...storeForm.getInputProps('name')} />
                <TextInput label="Description" {...storeForm.getInputProps('description')} />
                <TextInput label="Email" type="email" {...storeForm.getInputProps('email')} />
                <TextInput label="Téléphone" {...storeForm.getInputProps('phone')} />
                <TextInput label="Adresse" {...storeForm.getInputProps('address')} />
                <TextInput label="Ville" {...storeForm.getInputProps('city')} />
                <TextInput label="Pays (code)" placeholder="SN" {...storeForm.getInputProps('country')} />
                <Button type="submit" color="green" loading={storeMutation.isPending}>
                  Enregistrer
                </Button>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel value="payments">
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Title order={4} mb="md">Moyens de paiement</Title>
            <form onSubmit={settingsForm.onSubmit(onSettingsSubmit)}>
              <Stack gap="md">
                <Switch label="Mobile Money (Orange, MTN, Moov)" {...settingsForm.getInputProps('enableMobileMoney', { type: 'checkbox' })} />
                <Switch label="Carte bancaire" {...settingsForm.getInputProps('enableCardPayment', { type: 'checkbox' })} />
                <Switch label="Virement bancaire" {...settingsForm.getInputProps('enableBankTransfer', { type: 'checkbox' })} />
                <Switch label="Paiement à la livraison" {...settingsForm.getInputProps('enableCashOnDelivery', { type: 'checkbox' })} />
                <Button type="submit" color="green" loading={settingsMutation.isPending}>
                  Enregistrer
                </Button>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel value="shipping">
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Title order={4} mb="md">Livraison</Title>
            <form onSubmit={settingsForm.onSubmit(onSettingsSubmit)}>
              <Stack gap="md">
                <Switch label="Activer la livraison" {...settingsForm.getInputProps('enableShipping', { type: 'checkbox' })} />
                <NumberInput
                  label="Seuil livraison gratuite (XOF)"
                  placeholder="Ex: 25000"
                  min={0}
                  {...settingsForm.getInputProps('freeShippingThreshold')}
                />
                <Text size="xs" c="dimmed">
                  Livraison gratuite au-dessus de ce montant
                </Text>
                <Button type="submit" color="green" loading={settingsMutation.isPending}>
                  Enregistrer
                </Button>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
