'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPhoto, IconPlus } from '@tabler/icons-react';
import { MediaPicker } from '@/components/MediaPicker';

export interface ProductOption {
  name: string;
  values: string[];
}

export interface VariantRow {
  attributes: Record<string, string>;
  price?: number;
  inventoryQty: number;
  sku: string;
  imageUrl?: string;
}

function cartesian<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];
  const [first, ...rest] = arrays;
  const restProduct = cartesian(rest);
  return first.flatMap((v) => restProduct.map((r) => [v, ...r]));
}

function variantKey(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function variantDisplayName(attributes: Record<string, string>): string {
  return Object.values(attributes).filter(Boolean).join(' / ') || 'Default';
}

/** Liste des variantes à envoyer à l'API, calculée à partir des options + overrides. Utiliser au submit. */
export function buildVariantsForSubmit(
  options: ProductOption[],
  variantsOverride: VariantRow[],
  basePrice: number
): VariantRow[] {
  if (options.length === 0 || options.every((o) => o.values.length === 0)) return [];
  const valueArrays = options
    .filter((o) => o.name && o.values.length > 0)
    .map((o) => o.values.filter(Boolean));
  if (valueArrays.length === 0) return [];
  const combinations = cartesian(valueArrays) as string[][];
  const newOptNames = options.filter((o) => o.name && o.values.length > 0).map((o) => o.name);
  const existingByKey = new Map(
    variantsOverride.map((v) => [variantKey(v.attributes), v])
  );
  return combinations.map((combo) => {
    const attributes: Record<string, string> = {};
    newOptNames.forEach((name, i) => {
      attributes[name] = combo[i] ?? '';
    });
    const key = variantKey(attributes);
    const existing = existingByKey.get(key);
    return {
      attributes,
      price: existing?.price ?? basePrice,
      inventoryQty: existing?.inventoryQty ?? 0,
      sku: existing?.sku ?? '',
      imageUrl: existing?.imageUrl ?? '',
    };
  });
}

/** Dérive options et lignes éditables à partir des variantes renvoyées par l’API (édition). */
export function variantsFromApi(
  apiVariants: { attributes?: Record<string, string>; price?: number; inventoryQty?: number; sku?: string; imageUrl?: string }[]
): { options: ProductOption[]; variants: VariantRow[] } {
  if (!apiVariants?.length) return { options: [], variants: [] };
  const optionNames = Array.from(
    new Set(apiVariants.flatMap((v) => Object.keys(v.attributes ?? {})))
  ).sort();
  const options: ProductOption[] = optionNames.map((name) => {
    const values = Array.from(
      new Set(
        apiVariants.map((v) => (v.attributes ?? {})[name]).filter(Boolean)
      )
    );
    return { name, values };
  });
  const variants: VariantRow[] = apiVariants.map((v) => ({
    attributes: v.attributes ?? {},
    price: v.price,
    inventoryQty: v.inventoryQty ?? 0,
    sku: v.sku ?? '',
    imageUrl: (v as { imageUrl?: string }).imageUrl ?? '',
  }));
  return { options, variants };
}

type Props = {
  options: ProductOption[];
  variants: VariantRow[];
  basePrice: number;
  onOptionsChange: (options: ProductOption[]) => void;
  onVariantsChange: (variants: VariantRow[]) => void;
};

const MAX_OPTIONS = 3;

export function ProductVariantsField({
  options,
  variants,
  basePrice,
  onOptionsChange,
  onVariantsChange,
}: Props) {
  const variantRows = useMemo(() => {
    if (options.length === 0 || options.every((o) => o.values.length === 0)) {
      return [];
    }
    const optionNames = options.map((o) => o.name).filter(Boolean);
    const valueArrays = options
      .filter((o) => o.name && o.values.length > 0)
      .map((o) => o.values.filter(Boolean));
    if (valueArrays.length === 0) return [];
    const combinations = cartesian(valueArrays) as string[][];
    const newOptNames = options.filter((o) => o.name && o.values.length > 0).map((o) => o.name);
    const existingByKey = new Map(variants.map((v) => [variantKey(v.attributes), v]));
    return combinations.map((combo) => {
      const attributes: Record<string, string> = {};
      newOptNames.forEach((name, i) => {
        attributes[name] = combo[i] ?? '';
      });
      const key = variantKey(attributes);
      const existing = existingByKey.get(key);
      return {
        attributes,
        price: existing?.price ?? basePrice,
        inventoryQty: existing?.inventoryQty ?? 0,
        sku: existing?.sku ?? '',
        imageUrl: existing?.imageUrl ?? '',
      };
    });
  }, [options, basePrice, variants]);

  const optionsSignature = useMemo(
    () => options.map((o) => `${o.name}:${o.values.join(',')}`).join('|'),
    [options]
  );

  useEffect(() => {
    if (variantRows.length === 0) return;
    const currentKeys = new Set(variants.map((v) => variantKey(v.attributes)));
    const rowKeys = new Set(variantRows.map((r) => variantKey(r.attributes)));
    const same =
      currentKeys.size === rowKeys.size &&
      Array.from(rowKeys).every((k) => currentKeys.has(k));
    if (!same) onVariantsChange(variantRows);
  }, [optionsSignature, variantRows.length]);

  const syncVariantsFromRows = () => {
    if (variantRows.length > 0) onVariantsChange(variantRows);
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    onOptionsChange([...options, { name: '', values: [''] }]);
  };

  const updateOption = (index: number, upd: Partial<ProductOption>) => {
    const next = options.map((o, i) => (i === index ? { ...o, ...upd } : o));
    onOptionsChange(next);
  };

  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
    onVariantsChange([]);
  };

  const updateOptionValue = (optIndex: number, valIndex: number, value: string) => {
    const opt = options[optIndex];
    const nextValues = [...opt.values];
    nextValues[valIndex] = value;
    updateOption(optIndex, { values: nextValues });
  };

  const addOptionValue = (optIndex: number) => {
    const opt = options[optIndex];
    updateOption(optIndex, { values: [...opt.values, ''] });
  };

  const removeOptionValue = (optIndex: number, valIndex: number) => {
    const opt = options[optIndex];
    updateOption(optIndex, { values: opt.values.filter((_, i) => i !== valIndex) });
  };

  const [pickerForVariantKey, setPickerForVariantKey] = useState<string | null>(null);

  const setVariantField = (
    attrKey: string,
    field: 'price' | 'inventoryQty' | 'sku' | 'imageUrl',
    value: number | string
  ) => {
    const next = variantRows.map((v) => {
      if (variantKey(v.attributes) !== attrKey) return v;
      return { ...v, [field]: value };
    });
    onVariantsChange(next);
  };

  const hasOptions = options.length > 0 && options.some((o) => o.name && o.values.some(Boolean));

  return (
    <Stack gap="md">
      <div>
        <Group justify="space-between" mb="xs">
          <Title order={5}>Options (ex. Taille, Couleur)</Title>
          {options.length < MAX_OPTIONS && (
            <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={addOption}>
              Ajouter une option
            </Button>
          )}
        </Group>
        <Text size="xs" c="dimmed" mb="sm">
          Jusqu’à 3 options. Chaque combinaison crée une variante (ex. Taille S + Rouge).
        </Text>
        {options.map((opt, optIndex) => (
          <Box key={optIndex} mb="md" p="sm" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 8 }}>
            <Group mb="xs">
              <TextInput
                placeholder="Nom (ex. Taille)"
                size="xs"
                value={opt.name}
                onChange={(e) => updateOption(optIndex, { name: e.target.value })}
                style={{ width: 140 }}
              />
              <Button size="xs" variant="subtle" color="red" onClick={() => removeOption(optIndex)}>
                Supprimer
              </Button>
            </Group>
            <Group gap="xs" wrap="wrap">
              {opt.values.map((val, valIndex) => (
                <TextInput
                  key={valIndex}
                  size="xs"
                  placeholder="Valeur"
                  value={val}
                  onChange={(e) => updateOptionValue(optIndex, valIndex, e.target.value)}
                  style={{ width: 100 }}
                />
              ))}
              <Button size="xs" variant="light" onClick={() => addOptionValue(optIndex)}>
                +
              </Button>
            </Group>
          </Box>
        ))}
      </div>

      {hasOptions && variantRows.length > 0 && (
        <>
          <Text size="sm" fw={500}>
            {variantRows.length} variante(s) — modifiez prix, stock et SKU si besoin
          </Text>
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Variante</Table.Th>
                <Table.Th>Image</Table.Th>
                <Table.Th>Prix (XOF)</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>SKU</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {variantRows.map((row) => {
                const key = variantKey(row.attributes);
                return (
                  <Table.Tr key={key}>
                    <Table.Td>{variantDisplayName(row.attributes)}</Table.Td>
                    <Table.Td>
                      <Group gap="xs" align="center">
                        {row.imageUrl ? (
                          <Box
                            component="img"
                            src={row.imageUrl}
                            alt=""
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <Box
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 4,
                              background: 'var(--mantine-color-gray-2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconPhoto size={20} color="var(--mantine-color-dimmed)" />
                          </Box>
                        )}
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => setPickerForVariantKey(key)}
                        >
                          {row.imageUrl ? 'Changer' : 'Choisir'}
                        </Button>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        size="xs"
                        min={0}
                        value={row.price}
                        onChange={(v) => setVariantField(key, 'price', Number(v) ?? 0)}
                        onBlur={syncVariantsFromRows}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        size="xs"
                        min={0}
                        value={row.inventoryQty}
                        onChange={(v) => setVariantField(key, 'inventoryQty', Number(v) ?? 0)}
                        onBlur={syncVariantsFromRows}
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        size="xs"
                        value={row.sku}
                        onChange={(e) => setVariantField(key, 'sku', e.target.value)}
                        onBlur={syncVariantsFromRows}
                      />
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </>
      )}

      <MediaPicker
        opened={pickerForVariantKey !== null}
        onClose={() => setPickerForVariantKey(null)}
        mode="single"
        onSelect={(url) => {
          if (pickerForVariantKey) {
            setVariantField(pickerForVariantKey, 'imageUrl', url);
            setPickerForVariantKey(null);
          }
        }}
      />
    </Stack>
  );
}
