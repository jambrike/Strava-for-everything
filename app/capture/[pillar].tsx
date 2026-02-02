import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { 
  X, 
  Zap, 
  ZapOff,
  RotateCcw,
  Check,
  ImageIcon,
  Dumbbell,
  Route,
  Brain,
  Sparkles
} from "lucide-react-native";
import { theme, PILLARS, PillarType } from "@/constants/theme";
import { useActivityStore } from "@/store/activityStore";
import { DataOverlay } from "@/components/activity";

/**
 * Camera Capture Screen
 * Full-screen camera with pillar-specific overlay and controls
 */

const PillarIcon = ({ pillar }: { pillar: PillarType }) => {
  const color = PILLARS[pillar]?.color || "#fff";
  const size = 20;
  
  switch (pillar) {
    case "iron":
      return <Dumbbell size={size} color={color} />;
    case "path":
      return <Route size={size} color={color} />;
    case "deep":
      return <Brain size={size} color={color} />;
    case "snap":
      return <Sparkles size={size} color={color} />;
    default:
      return null;
  }
};

export default function CaptureScreen() {
  const { pillar } = useLocalSearchParams<{ pillar: PillarType }>();
  const pillarData = PILLARS[pillar as PillarType];
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  
  const { setPhotoUri, activityData, activePillar, startActivity } = useActivityStore();

  // Ensure activity is started
  useEffect(() => {
    if (!activePillar && pillar) {
      startActivity(pillar as PillarType);
    }
  }, [pillar, activePillar]);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo?.uri) {
          setCapturedPhoto(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      setPhotoUri(capturedPhoto);
      router.push('/compose');
    }
  };
  
  const handleClose = () => {
    router.back();
  };

  const toggleFacing = () => {
    setFacing(current => current === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    setFlash(current => current === 'off' ? 'on' : 'off');
  };

  // Permission handling
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to take proof photos of your activities.
        </Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
        <Pressable onPress={handleClose} style={styles.permissionCancelButton}>
          <Text style={styles.permissionCancelText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Photo preview mode
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedPhoto }} style={styles.preview} />
        
        {/* Data Overlay Preview */}
        <View style={styles.overlayContainer}>
          <DataOverlay 
            pillar={pillar as PillarType} 
            data={activityData} 
          />
        </View>
        
        {/* Top Controls */}
        <SafeAreaView edges={['top']} style={styles.topControls}>
          <Pressable onPress={handleClose} style={styles.controlButton}>
            <X size={24} color="#fff" />
          </Pressable>
          
          <View style={[styles.pillarBadge, { backgroundColor: `${pillarData?.color}30` }]}>
            <PillarIcon pillar={pillar as PillarType} />
            <Text style={[styles.pillarBadgeText, { color: pillarData?.color }]}>
              {pillarData?.name}
            </Text>
          </View>
          
          <View style={{ width: 44 }} />
        </SafeAreaView>
        
        {/* Bottom Controls */}
        <SafeAreaView edges={['bottom']} style={styles.bottomControls}>
          <View style={styles.previewActions}>
            <Pressable onPress={handleRetake} style={styles.retakeButton}>
              <RotateCcw size={20} color={theme.colors.text.primary} />
              <Text style={styles.retakeText}>Retake</Text>
            </Pressable>
            
            <Pressable 
              onPress={handleConfirm} 
              style={[styles.confirmButton, { backgroundColor: pillarData?.color }]}
            >
              <Check size={24} color={theme.colors.text.inverse} />
              <Text style={styles.confirmText}>Use Photo</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Camera mode
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Overlay Grid Guide */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={[styles.gridCell, styles.gridCellBorder]} />
            <View style={styles.gridCell} />
          </View>
          <View style={[styles.gridRow, styles.gridRowBorder]}>
            <View style={styles.gridCell} />
            <View style={[styles.gridCell, styles.gridCellBorder]} />
            <View style={styles.gridCell} />
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={[styles.gridCell, styles.gridCellBorder]} />
            <View style={styles.gridCell} />
          </View>
        </View>
      </CameraView>
      
      {/* Top Controls */}
      <SafeAreaView edges={['top']} style={styles.topControls}>
        <Pressable onPress={handleClose} style={styles.controlButton}>
          <X size={24} color="#fff" />
        </Pressable>
        
        {/* Pillar Badge */}
        <View style={[styles.pillarBadge, { backgroundColor: `${pillarData?.color}30` }]}>
          <PillarIcon pillar={pillar as PillarType} />
          <Text style={[styles.pillarBadgeText, { color: pillarData?.color }]}>
            {pillarData?.name}
          </Text>
        </View>
        
        <Pressable onPress={toggleFlash} style={styles.controlButton}>
          {flash === 'on' ? (
            <Zap size={24} color="#FFB800" fill="#FFB800" />
          ) : (
            <ZapOff size={24} color="#fff" />
          )}
        </Pressable>
      </SafeAreaView>
      
      {/* Bottom Controls */}
      <SafeAreaView edges={['bottom']} style={styles.bottomControls}>
        <View style={styles.captureControls}>
          {/* Gallery */}
          <Pressable onPress={handlePickImage} style={styles.galleryButton}>
            <ImageIcon size={24} color={theme.colors.text.primary} />
          </Pressable>
          
          {/* Capture Button */}
          <Pressable 
            onPress={handleCapture}
            style={[
              styles.captureButton,
              { 
                borderColor: pillarData?.color,
                shadowColor: pillarData?.color,
              }
            ]}
          >
            <View 
              style={[
                styles.captureButtonInner,
                { backgroundColor: pillarData?.color }
              ]} 
            />
          </Pressable>
          
          {/* Flip Camera */}
          <Pressable onPress={toggleFacing} style={styles.flipButton}>
            <RotateCcw size={24} color={theme.colors.text.primary} />
          </Pressable>
        </View>
        
        {/* Hint Text */}
        <Text style={styles.hintText}>
          Take a photo as proof of your {pillarData?.name.toLowerCase()} session
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 140,
    left: 16,
    right: 16,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridRowBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  gridCell: {
    flex: 1,
  },
  gridCellBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  pillarBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderBottomWidth: 0,
    paddingTop: 20,
  },
  captureControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  galleryButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  flipButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  hintText: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  retakeText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  permissionTitle: {
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: theme.colors.pillars.iron.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  permissionButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  permissionCancelButton: {
    paddingVertical: 12,
  },
  permissionCancelText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
});
