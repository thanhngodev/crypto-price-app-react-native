import React, { useState, useEffect } from "react"
import { View, Text, Dimensions, TextInput, ActivityIndicator } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import {
    ChartDot, 
    ChartPath, 
    ChartPathProvider,
    ChartYLabel,
} from '@rainbow-me/animated-charts'
import { useRoute } from "@react-navigation/native"

import Coin from '../../../assets/data/crypto.json'
import CoinDetailedHeader from "./components/CoinDetailedHeader"
import { getDetailedCoinData, getCoinMarketChartData } from '../../services/requests'
import styles from './styles'

const CoinDetailSceen = () => {
    const [coin, setCoin] = useState(null)
    const [coinMarketData, setCoinMarketData] = useState(null)
    
    const route = useRoute()
    const { params: { coinId } } = route
    
    const [loading, setLoading] = useState(false)
    const [coinValue, setCoinValue] = useState("1")
    const [usdValue, setUsdValue] = useState("")

    const fetchCoinData = async () => {
        setLoading(true)
        const fetchedCoinData = await getDetailedCoinData(coinId)
        const fetchedCoinMarketData = await getCoinMarketChartData(coinId)
        setCoin(fetchedCoinData)
        setCoinMarketData(fetchedCoinMarketData)
        setUsdValue(fetchedCoinData.market_data.current_price.usd.toString())
        setLoading(false)
    }

    useEffect(() => {
        fetchCoinData()
    }, [])
    
    if ( loading || !coin || !coinMarketData){
        return <ActivityIndicator size="large" />
    }

    const {
        id, 
        image: {small},
        name,
        symbol,
        market_data: { 
            market_cap_rank, 
            current_price,
            price_change_percentage_24h,
        },
    } = coin

    const  { prices } = coinMarketData
    const percentageColor = (coin.market_data.price_change_percentage_24h) < 0 ? '#ea3943' : '#16c784'
    const chartColor = (coin.market_data.current_price.usd) > prices[0][1] ? "#16c784" : "#ea3943"
    const screenWidth = Dimensions.get('window').width
    
    const formatCurrency = (value) => {
        "worklet";
        if (value === "") {
            return `$${coin.market_data.current_price.usd.toFixed(2)}`
        }
        return `$${parseFloat(value).toFixed(2)}`
    }

    const changeCoinValue = (value) => {
        setCoinValue(value)
        const floatValue = parseFloat(value.replace(',', '.')) || 0
        setUsdValue( (floatValue * current_price.usd).toString() )
    }

    const changeUsdValue = (value) => {
        setUsdValue(value);
        const floatValue = parseFloat(value.replace(',', '.')) || 0
        setCoinValue( (floatValue / current_price.usd).toString() )
    }

    return (
        <View style={{paddingHorizontal: 10,}}>
            <ChartPathProvider 
                data={{ 
                    points: prices.map( ([x, y]) => ( {x, y} ) ), 
                    smoothingStrategy: 'bezier' 
                }}
            >
                <CoinDetailedHeader 
                    coinId={coin.id}
                    image={coin.image.small}
                    symbol={coin.symbol}
                    market_cap_rank={coin.market_cap_rank}
                />

                <View style={styles.priceContainer} >
                    <View>
                        <Text style={styles.name}>{coin.name}</Text>
                        <ChartYLabel 
                            format={formatCurrency}
                            style={styles.currentPrice}
                        />
                    </View>
                    <View 
                        style={{ 
                            backgroundColor: percentageColor, 
                            paddingHorizontal: 3,
                            paddingVertical: 7, 
                            borderRadius: 10, 
                            flexDirection: 'row' 
                        }}
                    >
                        <AntDesign 
                            name={(coin.market_data.price_change_percentage_24h) < 0 ? 'caretdown' : 'caretup'}
                            size={12} 
                            color={'white'}
                            style={{ alignSelf: "center", marginRight: 5 }}
                        />
                        <Text style={styles.priceChange}>
                            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                        </Text>
                    </View>
                </View>

                <View>
                    <ChartPath 
                        strokeWidth={3}
                        height={screenWidth/2} 
                        stroke={chartColor} 
                        width={screenWidth} 
                    />
                    <ChartDot style={{ backgroundColor: chartColor }} />
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', flex: 1}}>
                        <Text style={{ color: 'white', alignSelf: 'center' }}>
                            {symbol.toUpperCase()}
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            value={coinValue} 
                            keyboardType="numeric"
                            onChangeText={changeCoinValue}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text style={{ color: 'white', alignSelf: 'center' }} >USD</Text>
                        <TextInput 
                            style={styles.input} 
                            value={usdValue}
                            keyboardType="numeric"
                            onChangeText={changeUsdValue}
                        />
                    </View>
                </View>
            </ChartPathProvider>
            <View style={{alignItems: 'center', justifyContent: 'center'}} >
                <Text style={{ color: 'white' }}> Ngô Tấn Thành </Text>
            </View>
        </View>
    )
}

export default CoinDetailSceen;