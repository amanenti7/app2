// components/ListaRegistros.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ListaRegistros({ registros, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>Registros Salvos (Read, Update, Delete)</Text>
      {registros.length > 0 ? registros.map((reg) => (
        <View key={reg.id} style={styles.itemHistorico}>
          <Text style={styles.itemTexto}>
            - Água: {reg.agua} copos, Exercício: {reg.exercicio} min, Calorias: {reg.calorias} kcal
          </Text>
          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => onEdit(reg)}>
              <Text style={styles.botaoTextoAcao}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoDelete} onPress={() => onDelete(reg.id)}>
              <Text style={styles.botaoTextoAcao}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        <Text style={styles.itemTexto}>Nenhum registro encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#87CEFA", borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#34495e" },
  itemHistorico: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" },
  itemTexto: { fontSize: 16, color: "#333" },
  botoesAcao: { flexDirection: "row" },
  botaoEditar: { backgroundColor: "#FF00FF", borderRadius: 15, width: 30, height: 30, justifyContent: "center", alignItems: "center", marginRight: 10 },
  botaoDelete: { backgroundColor: "#FF00FF", borderRadius: 15, width: 30, height: 30, justifyContent: "center", alignItems: "center" },
  botaoTextoAcao: { color: "white", fontWeight: "bold", fontSize: 16 },
});
