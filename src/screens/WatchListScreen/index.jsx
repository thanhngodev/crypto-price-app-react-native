import React, { useState, useEffect} from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'

import { useWatchlist } from '../../Contexts/WatchlistContext'
import CoinItem from '../../components/CoinItem'
import { getWatchlistedCoin } from '../../services/requests'

const WatchListScreen = () => {
    const {watchlistCoinIds} = useWatchlist()

    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(false)

    const transformCoinIds = () => watchlistCoinIds.join('%2C')

    const fetchWatchlistedCoins = async () => {
        if (loading) {
            return;
        }
        setLoading(true)
        const watchlistCoinsData = await getWatchlistedCoin(1, transformCoinIds())
        setCoins(watchlistCoinsData)
        setLoading(false)
    }

    useEffect(() => {
        fetchWatchlistedCoins()
    }, [])

    return (
        <FlatList 
            data={coins}
            renderItem={({item}) => <CoinItem marketCoin={item} />}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    tintColor="white"
                    onRefresh={fetchWatchlistedCoins}
                />
            }
        />
    )
}

export default WatchListScreen