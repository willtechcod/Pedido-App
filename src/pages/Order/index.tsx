import React, { useState, useEffect } from "react";
import { View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList
} from 'react-native';

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { Feather } from '@expo/vector-icons';

import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams = {
   Order:{
    number: string | number;
   client: string;
   order_id: string; 
   }
}

export type CategoryProps = {
    id: string;
    name: string;
}

export type ProductProps = {
    id: string;
    name: string;
}
export type ItemProps = {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export default function Order(){
const route = useRoute<OrderRouteProps>();
const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

const [category, setCategory] = useState<CategoryProps[] | []>([]);
const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

const [product, setProduct] = useState<ProductProps[] | []>([]);
const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
const [modalProductVisible, setModalProductVisible] = useState(false);

const [amount, setAmount] = useState('1');

const [items, setItems] = useState<ItemProps[]>([]);

useEffect(() => {
    async function loadInfo(){
        const response = await api.get('/category');
        setCategory(response.data);
        setCategorySelected(response.data[0]);
    }

    loadInfo();
}, []);

useEffect(() => {
    async function loadProduct(){
        const response = await api.get('/category/product', {
            params:{
                category_id: categorySelected?.id
            }
        })

        setProduct(response.data);
        setProductSelected(response.data[0]);

    }
    loadProduct();

},[categorySelected])

async function handleClouseOrder(){
    try {
        await api.delete('/order', {
            params:{
                order_id: route.params?.order_id
            }
        })

        navigation.goBack();

    } catch (err) {
        console.log(err);
    }
}

function handleChangeCategory(item: CategoryProps){
    setCategorySelected(item);
}

function handleChangeProduct(item: ProductProps){
    setProductSelected(item);
}

async function handleAdd(){
    const response = await api.post('/order/add', {
        order_id: route.params?.order_id,
        product_id: productSelected?.id,
        amount: Number(amount)
    })

    let data = {
        id: response.data.id,
        product_id: productSelected?.id as string,
        name: productSelected?.name as string,
        amount: amount
    }

    setItems(oldArray => [...oldArray, data]);
}

    async function handleDeleteItem(item_id: string){
        await api.delete('/order/remove', {
            params:{
                item_id: item_id
            }
        })
        let removeItem = items.filter(item => {
            return (item.id !== item_id)
        })

        setItems(removeItem);
    }

    function handleFinishOrder(){
        navigation.navigate("FinishOrder", {
            number: route.params?.number,
            order_id: route.params?.order_id
        });
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.title}>Mesa {route.params.number}</Text>
            {items.length === 0 && (
                <TouchableOpacity onPress={handleClouseOrder}>
                    <Feather name='trash-2' size={35} color='#ff3f3b' />
                </TouchableOpacity>
            )}
            </View>
            <Text style={styles.cliente}>Cliente: {route.params.client}</Text>

            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={()=> setModalCategoryVisible(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {categorySelected?.name}
                    </Text>
                </TouchableOpacity>
            )}

            {product.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={()=> setModalProductVisible(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {productSelected?.name}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                  style={[styles.input,{width:'60%', textAlign: 'center'}]}
                  placeholderTextColor='#f0f0f0'
                  keyboardType='numeric'
                  value={amount}
                  onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={[styles.button, { opacity: items.length ===0 ? 0.3 : 1}]}
                disabled={items.length === 0}
                onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}>Avancar</Text>
                </TouchableOpacity>
            </View>

                <FlatList 
                    showsVerticalScrollIndicator={false}
                    style={{flex:1, marginTop: 24}}
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ListItem data={item} delteItem={handleDeleteItem}/>}
                />

                <Modal
                  transparent={true}
                  visible={modalCategoryVisible}
                  animationType='fade'
                >
                    <ModalPicker
                      handleCloseModal={()=> setModalCategoryVisible(false)}
                      options={category}
                      selectedItem={handleChangeCategory}
                    />
                </Modal>

                <Modal
                    transparent={true}
                    visible={modalProductVisible}
                    animationType='fade'
                >

                    <ModalPicker
                      handleCloseModal={()=> setModalProductVisible(false)}
                      options={product}
                      selectedItem={handleChangeProduct}
                    />

                </Modal>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header:{
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 14
    },
    cliente:{
        flexDirection: 'row',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 14,
        marginBottom: 12,
    },
    input:{
        backgroundColor: '#101026',
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 25,
        borderRadius: 8
    },
    qtdContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText:{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    actions:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonAdd:{
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 8,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'

    },
    buttonText:{
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button:{
        backgroundColor: '#3fffa3',
        borderRadius: 6,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        color: '#101026',
        fontWeight: 'bold',
    }
})