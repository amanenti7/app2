import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'meus_registros';
const listeners = [];

// Salvar dados
export async function salvarDados(dados) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    notifyAtualizacao();
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Carregar dados
export async function carregarDados() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return [];
  }
}

// Subscrição de atualizações
export function subscribeAtualizacao(callback) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

// Notificar listeners
function notifyAtualizacao() {
  listeners.forEach((callback) => callback());
}
