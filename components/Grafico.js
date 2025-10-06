// components/Grafico.js
import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function Grafico({ registros }) {
  if (!registros || registros.length === 0) {
    return (
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text style={{ color: "#555", fontSize: 16 }}>Nenhum dado para exibir no gráfico.</Text>
      </View>
    );
  }

  // Pegar as datas e valores de água
  const labels = registros.map((reg) => reg.data.split("/").slice(0, 2).join("/")); // mostra só dia/mês
  const valoresAgua = registros.map((reg) => reg.agua);

  return (
    <View>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: valoresAgua,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#1E90FF",
          backgroundGradientFrom: "#87CEFA",
          backgroundGradientTo: "#4682B4",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#1E90FF",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

