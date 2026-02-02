import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dumbbell, Route, Brain, Sparkles } from 'lucide-react-native';
import { theme, PILLARS, PillarType } from '@/constants/theme';
import { ActivityData, IronData, PathData, DeepData, SnapData } from '@/store/activityStore';

interface DataOverlayProps {
  pillar: PillarType;
  data: Partial<ActivityData>;
  compact?: boolean;
}

const PillarIcon = ({ pillar, size = 16 }: { pillar: PillarType; size?: number }) => {
  const color = PILLARS[pillar].color;
  switch (pillar) {
    case 'iron': return <Dumbbell size={size} color={color} />;
    case 'path': return <Route size={size} color={color} />;
    case 'deep': return <Brain size={size} color={color} />;
    case 'snap': return <Sparkles size={size} color={color} />;
  }
};

export function DataOverlay({ pillar, data, compact = false }: DataOverlayProps) {
  const pillarData = PILLARS[pillar];
  const color = pillarData.color;

  const renderContent = () => {
    switch (pillar) {
      case 'iron': {
        const d = data as Partial<IronData>;
        return (
          <>
            <DataItem label="Exercise" value={d.exercise || '—'} color={color} />
            <DataItem label="Weight" value={d.weight ? `${d.weight} ${d.weightUnit}` : '—'} color={color} />
            <DataItem label="Sets × Reps" value={`${d.sets || 0} × ${d.reps || 0}`} color={color} />
          </>
        );
      }
      case 'path': {
        const d = data as Partial<PathData>;
        return (
          <>
            <DataItem label="Distance" value={d.distance ? `${d.distance} ${d.distanceUnit}` : '—'} color={color} />
            <DataItem label="Duration" value={d.duration || '—'} color={color} />
            <DataItem label="Pace" value={d.pace || '—'} color={color} />
          </>
        );
      }
      case 'deep': {
        const d = data as Partial<DeepData>;
        return (
          <>
            <DataItem label="Duration" value={d.duration || '—'} color={color} />
            <DataItem label="Sessions" value={`${d.sessions || 0}`} color={color} />
            <DataItem label="Focus" value={d.focusScore ? `${d.focusScore}/5` : '—'} color={color} />
          </>
        );
      }
      case 'snap': {
        const d = data as Partial<SnapData>;
        const moodEmojis: Record<string, string> = { 
          great: '🔥', 
          good: '😊', 
          okay: '😐', 
          meh: '😕', 
          rough: '😞' 
        };
        return (
          <>
            <DataItem label="Mood" value={d.mood ? moodEmojis[d.mood] : '—'} color={color} large />
            <DataItem label="Energy" value={d.energy ? `${d.energy}/5` : '—'} color={color} />
          </>
        );
      }
    }
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderColor: `${color}40` }]}>
        <PillarIcon pillar={pillar} size={14} />
        <Text style={[styles.compactName, { color }]}>{pillarData.name}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: `${color}30` }]}>
      {/* Header */}
      <View style={styles.header}>
        <PillarIcon pillar={pillar} />
        <Text style={[styles.pillarName, { color }]}>{pillarData.name}</Text>
      </View>
      
      {/* Data Grid */}
      <View style={styles.grid}>
        {renderContent()}
      </View>
    </View>
  );
}

function DataItem({ 
  label, 
  value, 
  color, 
  large = false 
}: { 
  label: string; 
  value: string; 
  color: string;
  large?: boolean;
}) {
  return (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, { color }, large && styles.dataValueLarge]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillarName: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataItem: {
    width: '50%',
    marginBottom: 8,
  },
  dataLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  dataValueLarge: {
    fontSize: 32,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
  },
  compactName: {
    fontSize: 12,
    fontWeight: '600',
  },
});
