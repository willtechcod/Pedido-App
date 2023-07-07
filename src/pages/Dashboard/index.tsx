import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

import { api } from "../../services/api";

import { AuthContext } from "../../contexts/AuthContext";

export default function Dashboard(){
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [number, setNumber] = useState('');
    const [cliente, setCliente] = useState('');

    const { signOut } = useContext(AuthContext);

    async function openOrder(){
        if(number === '' || cliente === ''){
            return;
        }

        const response = await api.post('/order', {
            table: Number(number),
            client: cliente,
        })
        //console.log(response.data)

        navigation.navigate('Order',{number: number, client: cliente, order_id: response.data.id});
        setNumber('');
        setCliente('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>
            <TextInput 
              placeholder="Numero da Mesa"
              placeholderTextColor="#F0F0F0"
              style={styles.input}
              keyboardType='numeric'
              value={number}
              onChangeText={setNumber}
            />
            <TextInput 
              placeholder="Nome do Cliente"
              placeholderTextColor="#F0F0F0"
              style={styles.input}
              value={cliente}
              onChangeText={setCliente}
            />
            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir mesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonExit} onPress={signOut}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     paddingVertical: 15,
     backgroundColor: '#1d1d2e'
    },
    title:{
     fontSize: 30,
     fontWeight: 'bold',
     color: '#FFF',
     marginBottom: 24,
    },
    input:{
     width: '90%',
     height: 60,
     backgroundColor: '#101026',
     margin: 6,
     borderRadius: 8,
     paddingHorizontal: 8,
     textAlign: 'center',
     fontSize: 22,
     color: '#FFF'
    },
    button:{
     width: '90%',
     height: 40,
     backgroundColor: '#3fffa3',
     borderRadius: 8,
     marginVertical: 12,
     justifyContent: 'center',
     alignItems: 'center'
    },
    buttonExit:{
     width: '90%',
     height: 40,
     backgroundColor: '#ffa500',
     borderRadius: 8,
     marginVertical: 12,
     justifyContent: 'center',
     alignItems: 'center'
    },
    buttonText:{
     fontSize: 18,
     color: '#101026',
     fontWeight: 'bold'
    },
    buttonTextexit:{
     fontSize: 18,
     color: '#101026',
     fontWeight: 'bold'
    }
})