import { useCallback, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image   } from 'react-native';
import {   CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";
import { useFocusEffect } from '@react-navigation/native';

const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

console.log("API KEY =>", API_KEY);

export default function CameraScreen() 
{
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Speech.stop();
      Speech.speak("Modo cámara");

      return () => Speech.stop();
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos tu permiso para acceder a la cámara
        </Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function analizarBillete(imagen) {
  try 
  {
    console.log("analizando billete");

    const prompt = `Actúa como asistente visual.
        Si ves dinero, di la cantidad de billetes y su valor, al final menciona el total.
        Si no, comenta que no hay dinero en la escena.
        Si no es apreciable con total seguridad, comenta que es necesario retomar 
        la foto y especifica que detalles hacen falta para ser apreciable.
        Intenta dar una respuesta muy simplificada y directa
        `;

    const result = await model.generateContent({
    contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imagen,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
    });
    console.log("respondiendo");

    const texto = result.response.text();
    console.log("mensaje: ", texto);

    Speech.speak(texto, { language: 'es-MX' });

  } 
  catch (error) 
  {
    console.error("Error en la IA:", error);
    Speech.speak("Lo siento, hubo un error al conectar con el servidor.");
  }
}

  async function takePhoto() {
    console.log("tomando foto");
    if(loading) return;

    setLoading(true);

    const picture = await cameraRef.current.takePictureAsync({
      quality: 0.5,
      base64: true,
    });

    setPhoto(picture.uri);
    console.log("uri: ", picture.uri);

    Speech.speak("Analizando...");
    await analizarBillete(picture.base64);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        pointerEvents="none"
      />

      <View style={styles.overlay} pointerEvents="box-none">
        
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text}>Voltear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
        >
          <View style={styles.innerCircle} />
        </TouchableOpacity>

      </View>

      {photo && (
        <Image source={{ uri: photo }} style={styles.preview} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: 'center',
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    top: 50,
    right: 20,   
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  preview: {
    width: 120,
    height: 160,
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 10,
  },
});