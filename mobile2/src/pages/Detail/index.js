import React from 'react';
import { View, Image, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; //useRoute serve para pegarmos os parâmetros da rota
import { Feather } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer'

import styles from './styles';

import logoImg from '../../assets/logo.png';

export default function Detail(){
    const navigation = useNavigation();
    const route = useRoute();

    function formatValue(floatValue){
        return Intl.NumberFormat('pt-BR', 
        { style: 'currency', currency: 'BRL'}).format(floatValue);
    }
    const incident = route.params.incident; 

    const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formatValue(incident.value)}`;
    function navigateBack(){
        navigation.goBack();
    }
    function sendMail(){
        //need to install expo install expo-mail-composer
        MailComposer.composeAsync({
            subject: `Herói do caso: ${incident.title}`,
            recipients: [incident.email],
            body: message,
        })

    }
    function sendWhastapp(){
        Linking.openURL(`whatsapp://send?phone=+55${incident.whatsapp}&text=${message}`)
    }
    return (
        <View style={styles.container} >
            <View style = {styles.header}>
            <Image source={logoImg} />
            <TouchableOpacity onPress={ navigateBack }>
                <Feather name="arrow-left" size={28} color="#e02041" />
            </TouchableOpacity>
            </View>
            <View style={styles.incident}>
            <Text style={[styles.incidentProperty, { marginTop: 0 }]}> ONG: </Text>
                <Text style={styles.incidentValue}> { incident.name } de {incident.city}/{incident.uf} </Text>

                <Text style={styles.incidentProperty}> CASO: </Text>
                <Text style={styles.incidentValue}> { incident.description } </Text>

                <Text style={styles.incidentProperty}> VALOR: </Text>
                <Text style={styles.incidentValue}> { formatValue(incident.value) } </Text>
            </View>
            <View style={styles.contactBox}>
                <Text style={styles.heroTitle}>Salve o Dia!</Text>
                <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>
                <Text style={styles.heroDescription}>Entre em contato:</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.action} onPress={sendWhastapp}>
                        <Text style={styles.actionText}>Whatsapp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.action} onPress={sendMail}>
                        <Text style={styles.actionText}>E-mail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}