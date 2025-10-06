// App.js
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";

import * as Database from "./services/Database";
import Formulario from "./components/Formulario";
import ListaRegistros from "./components/ListaRegistros";
import Grafico from "./components/Grafico";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null);
  const [ordenacao, setOrdenacao] = useState("recentes");

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  // 🔽 Função salvar (Create/Update)
  const handleSave = (agua, exercicio, calorias) => {
    const aguaNum = parseFloat(String(agua).replace(",", ".")) || 0;
    const exercicioNum = parseFloat(String(exercicio).replace(",", ".")) || 0;
    const caloriasNum = parseFloat(String(calorias).replace(",", ".")) || 0;

    if (registroEmEdicao) {
      const registrosAtualizados = registros.map((reg) =>
        reg.id === registroEmEdicao.id
          ? { ...reg, agua: aguaNum, exercicio: exercicioNum, calorias: caloriasNum }
          : reg
      );
      setRegistros(registrosAtualizados);
      Alert.alert("Sucesso!", "Registro atualizado!");
    } else {
      const novoRegistro = {
        id: new Date().getTime(),
        data: new Date().toLocaleDateString("pt-BR"),
        agua: aguaNum,
        exercicio: exercicioNum,
        calorias: caloriasNum,
      };
      setRegistros([...registros, novoRegistro]);
      Alert.alert("Sucesso!", "Registro salvo!");
    }
    setRegistroEmEdicao(null);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter((reg) => reg.id !== id));
  };

  const handleEdit = (registro) => {
    setRegistroEmEdicao(registro);
  };

  const handleCancel = () => {
    setRegistroEmEdicao(null);
  };

  // 🔽 Exportar JSON
  const exportarDados = async () => {
    const fileUri = Database.fileUri;
    if (Platform.OS === "web") {
      const jsonString = JSON.stringify(registros, null, 2);
      if (registros.length === 0) {
        return Alert.alert("Aviso", "Nenhum dado para exportar.");
      }
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dados.json";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        return Alert.alert("Aviso", "Nenhum dado para exportar.");
      }
      if (!(await Sharing.isAvailableAsync())) {
        return Alert.alert("Erro", "Compartilhamento não disponível.");
      }
      await Sharing.shareAsync(fileUri);
    }
  };

  // 🔽 ORDENANDO OS REGISTROS 🔽
  let registrosExibidos = [...registros];
  if (ordenacao === "maior_agua") {
    registrosExibidos.sort((a, b) => b.agua - a.agua);
  } else {
    registrosExibidos.sort((a, b) => b.id - a.id); // Mais recentes
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>📊 Minha Vida em Números</Text>
        <Text style={styles.subtituloApp}>Controle seus hábitos diários</Text>

        {/* Gráfico 📈 */}
        <Grafico registros={registrosExibidos} />

        {/* Botões de Ordenação 🔁 */}
        <View style={styles.filtros}>
          <Button title="Mais Recentes" onPress={() => setOrdenacao("recentes")} />
          <Button title="Maior Valor (Água)" onPress={() => setOrdenacao("maior_agua")} />
        </View>

        {/* Formulário */}
        <Formulario
          onSave={handleSave}
          onCancel={handleCancel}
          registroEmEdicao={registroEmEdicao}
        />

        {/* Lista */}
        <ListaRegistros
          registros={registrosExibidos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Exportar */}
        <View style={styles.card}>
          <Text style={styles.subtitulo}>💾 Exportar Registros</Text>
          <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
            <Text style={styles.botaoTexto}>Exportar para dados.json</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0, backgroundColor: "#f6f9fc" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#000" },
  titulo: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#2c3e50" },
  subtituloApp: { textAlign: "center", fontSize: 16, color: "#000", marginTop: -10, marginBottom: 20, fontStyle: "italic" },
  filtros: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 15 },
  card: { backgroundColor: "#BDFCC9", borderRadius: 12, padding: 20, marginHorizontal: 15, marginBottom: 25, elevation: 4 },
  subtitulo: { fontSize: 20, fontWeight: "600", marginBottom: 15, color: "#34495e" },
  botaoExportar: { backgroundColor: "#0000FF", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  botaoTexto: { color: "white", fontSize: 16, fontWeight: "bold" },
});

