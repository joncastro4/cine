import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { notify, confirmAction } from '../lib/dialog';

export interface CatalogItem {
  id: number;
  name: string;
  total?: number;
}

interface CatalogScreenProps {
  singular: string; // "director" | "categoría"
  plural: string; // "Directores" | "Categorías"
  icon: string;
  items: CatalogItem[];
  onCreate: (name: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onRefreshAll: () => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  singular,
  plural,
  icon,
  items,
  onCreate,
  onDelete,
  onRefreshAll,
}) => {
  const [name, setName] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      notify('Campo incompleto', `Ingresa el nombre del ${singular}.`);
      return;
    }
    setSaving(true);
    const ok = await onCreate(name.trim());
    setSaving(false);
    if (ok) {
      setName('');
      onRefreshAll();
    } else {
      notify('Aviso', `No se pudo guardar el ${singular}. Revisa que el backend esté corriendo.`);
    }
  };

  const handleDelete = (item: CatalogItem) => {
    confirmAction('Confirmar Eliminación', `¿Eliminar "${item.name}" (ID #${item.id})?`, async () => {
      const ok = await onDelete(item.id);
      if (ok) {
        onRefreshAll();
      } else {
        notify('Error', `No se pudo eliminar. Puede que aún tenga películas asociadas.`);
      }
    });
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-950`} contentContainerStyle={tw`p-4 pb-20`}>
      <View style={tw`bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6`}>
        <Text style={tw`text-white font-extrabold text-lg mb-3`}>
          {icon} Agregar {singular}
        </Text>
        <View style={tw`flex-row gap-2`}>
          <TextInput
            placeholder={`Nombre del ${singular}`}
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleCreate}
            style={tw`flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm`}
          />
          <TouchableOpacity
            disabled={saving}
            onPress={handleCreate}
            style={tw`bg-rose-600 px-5 rounded-xl justify-center`}
          >
            <Text style={tw`text-white font-bold text-sm`}>{saving ? '...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`bg-slate-900 border border-slate-800 rounded-3xl p-5`}>
        <Text style={tw`text-white font-extrabold text-lg mb-3`}>
          {plural} ({items.length})
        </Text>
        {items.map((item) => (
          <View
            key={item.id}
            style={tw`flex-row items-center justify-between py-3 border-b border-slate-800/80`}
          >
            <View style={tw`flex-1 pr-2`}>
              <Text style={tw`text-white font-bold text-sm`} numberOfLines={1}>
                #{item.id} - {item.name}
              </Text>
              {item.total !== undefined && (
                <Text style={tw`text-slate-400 text-xs`}>
                  {item.total} {item.total === 1 ? 'película' : 'películas'}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item)}
              style={tw`bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30`}
            >
              <Text style={tw`text-red-400 font-bold text-xs`}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
