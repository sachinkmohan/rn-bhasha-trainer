import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ScriptType } from '@/types/pronunciation';

interface ScriptToggleProps {
  currentScript: ScriptType;
  onToggle: () => void;
}

export function ScriptToggle({ currentScript, onToggle }: ScriptToggleProps) {
  const handleManglishPress = () => {
    if (currentScript !== 'manglish') {
      onToggle();
    }
  };

  const handleMalayalamPress = () => {
    if (currentScript !== 'malayalam') {
      onToggle();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleManglishPress}
        style={[
          styles.button,
          currentScript === 'manglish' && styles.buttonActive,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            currentScript === 'manglish' ? styles.buttonTextActive : styles.buttonTextInactive,
          ]}
        >
          Manglish
        </Text>
      </Pressable>
      <Pressable
        onPress={handleMalayalamPress}
        style={[
          styles.button,
          currentScript === 'malayalam' && styles.buttonActive,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            currentScript === 'malayalam' ? styles.buttonTextActive : styles.buttonTextInactive,
          ]}
        >
          Malayalam
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    padding: 4,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  buttonActive: {
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#2563eb',
  },
  buttonTextInactive: {
    color: '#6b7280',
  },
});
