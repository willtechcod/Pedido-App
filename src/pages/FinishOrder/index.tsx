import React from "react";
import { SafeAreaView, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image} from 'react-native';

    import { api } from "../../services/api";

import { Feather } from '@expo/vector-icons';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from "../../routes/app.routes";
 
type RouteDetailParams = {
    FinishOrder:{
        number: string | number;
        order_id: string;
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export function FinishOrder(){
    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function handleFinish(){
        try {

            await api.put('/order/send', {
                order_id: route.params?.order_id
            })
            navigation.popToTop();
        } catch (err) {
            alert('Erro ao finalizar, tente mais tarde!')
        }
    }

    return(
        <SafeAreaView style={styles.container}>

            <Image style={styles.logo} source={require('../../assets/Logo.png')}/>

            <Text style={styles.alert}>Você deseja finalizar  esse {'\n'} pedido?</Text>

            <Text style={styles.title}>
                Mesa {route.params?.number}
            </Text>


            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.textbutton}>Finalizar Pedido</Text>
                <Feather name='coffee' size={20} color='#1d1d2e' />
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alert:{
        color:'#FFF',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        alignSelf: 'center',
        textAlign: 'center',
    },
    title:{
        color:'#FFF',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 12,
        alignSelf: 'center',
    },
    button:{
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6
    },
    textbutton:{
        fontSize: 24,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1d1d2e'
    },
    logo:{
        width: 220,
        height: 220,
        marginBottom: 25
    }
})