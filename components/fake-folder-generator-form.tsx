import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { generateFakeFolderWithPhotos } from "@/jazz/actions";

export function FakeFolderGeneratorForm() {
  const [photoCount, setPhotoCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFakeFolder = async () => {
    const count = parseInt(photoCount, 10) || 5;
    if (!Number.isFinite(count) || count <= 0 || isGenerating) {
      return;
    }

    setIsGenerating(true);
    try {
      await generateFakeFolderWithPhotos(count);
      setPhotoCount("5");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of photos</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the number of photos"
          keyboardType="number-pad"
          autoCapitalize="none"
          value={photoCount}
          onChangeText={setPhotoCount}
        />
      </View>

      <Pressable
        onPress={handleGenerateFakeFolder}
        disabled={isGenerating}
        style={[styles.button, isGenerating && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {isGenerating ? "Generating..." : "Generate"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 4,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
