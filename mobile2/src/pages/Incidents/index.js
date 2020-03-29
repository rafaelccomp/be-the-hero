import React , { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';
//npm install @react-navigation/native
//npm install @react-native-community/masked-view
//npm install @react-navigation/stack


import logoImg from '../../assets/logo.png';
import { Feather } from '@expo/vector-icons'; 

import styles from './styles';
import api from "../../services/api";

export default function Detail(){
    const navigation = useNavigation();

    const [incidents, setIncidents] = useState([]);
    const [total, setTotal]= useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function navigateToDetail( incident ){
        navigation.navigate('Detail', { incident });
    }
    async function loadIncidents(){
        if(loading){
            //Se o usuário já tiver mandado uma requisição pra não ficar enchendo de requisição
            return;
        }
        //Se total for maior que zero significa que já fez a primeira carga de dados,
        //se tiver carregado todos dados, eu não preciso enviar solicitação novamente
        if (total > 0 && incidents.length == total )
            return;
        setLoading(true);
        const response = await api.get('incidents', 
        { params: { page}});
        setIncidents([...incidents, ...response.data]); //anexar dois vetores dentro de um vetor
        setTotal(response.headers['x-total-count']);
        setPage(page+1);
        setLoading(false);
    }
    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style = {styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos </Text>.
                </Text>
            </View>
            <Text style={styles.title}>Bem-vindo!</Text>
           <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>
           <FlatList 
           onEndReached = {loadIncidents}
           onEndReachedThreshold={0.2} 
           style={styles.incidentList} 
           data={incidents}
           showsVerticalScrollIndicator = {false}
           keyExtractor={ incident => String(incident.id) }
           renderItem={({ item: incident }) => (
                <View style={styles.incident}>
                <Text style={styles.incidentProperty}> ONG: </Text>
                <Text style={styles.incidentValue}> { incident.name } </Text>

                <Text style={styles.incidentProperty}> CASO: </Text>
                <Text style={styles.incidentValue}> { incident.description } </Text>

                <Text style={styles.incidentProperty}> VALOR: </Text>
                <Text style={styles.incidentValue}> { 
                Intl.NumberFormat('pt-BR', 
                { style: 'currency', currency: 'BRL'}).format(incident.value) } </Text>
                <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => navigateToDetail(incident)}>
                    <Text style={styles.detailsButtonText} >Ver mais Detalhes</Text>
                    <Feather name="arrow-right" size={16} color="#E02041"/>
                </TouchableOpacity>
            </View>
           )} 
           />
        </View>
    );
}