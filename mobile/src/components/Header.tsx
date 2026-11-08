import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import tw from '../lib/tailwind';

export type TabKey = 'movies' | 'addMovie' | 'directors' | 'categories';

interface HeaderProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: 'movies', icon: '🍿', label: 'Cartelera' },
  { key: 'addMovie', icon: '🎬', label: 'Películas' },
  { key: 'directors', icon: '🎥', label: 'Directores' },
  { key: 'categories', icon: '🏷️', label: 'Categorías' },
];

export const NAV_BREAKPOINT = 640;

const renderTab = (
  t: (typeof TABS)[number],
  active: boolean,
  onPress: () => void,
  inline: boolean
) => (
  <TouchableOpacity
    key={t.key}
    onPress={onPress}
    style={tw`flex-1 ${inline ? 'py-1.5 flex-row' : 'py-2'} px-0.5 items-center justify-center rounded-lg ${active ? 'bg-rose-600' : ''}`}
  >
    <Text style={tw`${inline ? 'text-sm mr-1.5' : 'text-lg mb-0.5'}`}>{t.icon}</Text>
    <Text numberOfLines={1} style={tw`font-bold text-[11px] ${active ? 'text-white' : 'text-slate-400'}`}>
      {t.label}
    </Text>
  </TouchableOpacity>
);

// Barra superior: logo y, en pantallas anchas, las pestañas en la misma fila
export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const { width } = useWindowDimensions();
  const wide = width >= NAV_BREAKPOINT;

  return (
    <View style={tw`w-full self-stretch bg-slate-900 border-b border-slate-800 py-2 px-3`}>
      <View style={tw`w-full max-w-4xl self-center flex-row items-center`}>
        <View style={tw`flex-row items-center ${wide ? 'mr-4' : ''}`}>
          <View style={tw`bg-rose-600 w-8 h-8 rounded-lg items-center justify-center mr-2`}>
            <Text style={tw`text-base`}>🎬</Text>
          </View>
          <Text style={tw`text-white font-extrabold text-lg tracking-wider`}>
            CINE<Text style={tw`text-rose-500`}>TOPIA</Text>
          </Text>
        </View>

        {wide && (
          <View style={tw`flex-row bg-slate-800/60 p-1 rounded-xl flex-1`}>
            {TABS.map((t) => renderTab(t, currentTab === t.key, () => onSelectTab(t.key), true))}
          </View>
        )}
      </View>
    </View>
  );
};

// Barra inferior de navegación para celular
export const BottomTabBar: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const { width } = useWindowDimensions();
  if (width >= NAV_BREAKPOINT) return null;

  return (
    <View style={tw`w-full bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex-row`}>
      {TABS.map((t) => renderTab(t, currentTab === t.key, () => onSelectTab(t.key), false))}
    </View>
  );
};
