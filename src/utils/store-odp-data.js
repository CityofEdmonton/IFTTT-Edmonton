const redis = require('redis')
const request = require('request-promise-native')
const { promisify } = require('util')

async function redisClientConnect() {
    return redis.createClient({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD
    })
}

async function getDatasets() {
    let rawJsonData = await request(process.env.OPEN_DATA_URL)
    const rawData = JSON.parse(rawJsonData)
    return rawData.dataset.map(function(entry) {
        return { label: entry.title, identifier: entry.identifier }
    })
}

function sortOrder(a, b) {
    return a.label < b.label ? -1 : (a.label > b.label ? 1 : 0)
}

async function getDatasetColumns(identifier) {
    let rawJsonDataColumns = await request(identifier)
    const rawDataColumns = JSON.parse(rawJsonDataColumns)
    const columns = rawDataColumns.columns.map(function(entry) {
        return { label: entry.name, value: entry.id }
    }).sort(sortOrder)
    return columns
}

function insert(client, key, dataset_label, values) {
    const data = {
        label: dataset_label,
        values: values
    }
    client.set(key, JSON.stringify(data))
}

function insertCache(cache, key, dataset_label, columns) {
    cache.insertDataset(key, dataset_label, columns)
}

async function storeData(client, dataset, isCache = false) {
    const { label, identifier } = dataset
    const key = (isCache) ? identifier.slice(35) : "opendata:" + identifier.slice(35) /** unique identifier */
    await getDatasetColumns(identifier)
    .then((columns) => {
        (isCache) ? insertCache(client, key, label, columns) : insert(client, key, label, columns)
    })
    .catch((err) => {
        console.log(err)
    })
}

async function storeAll(cache) {
    const STORE_TIMER = "store-timer"
    let client
    let storeTimer
    if (!cache) {
        client = await redisClientConnect().catch((e) => console.log("Error " + e))
        client.on('error', (err) => {
            console.log("Error " + err)
        })
        const onAsync = promisify(client.on).bind(client)
        const getAsync = promisify(client.get).bind(client)
        await onAsync('ready').then(() => console.log("Client is ready.")).catch((e) => console.log("Error " + e))
        await getAsync(STORE_TIMER).then((value) => {
            storeTimer = value
        })
    } else {
        storeTimer = await cache.getKV(STORE_TIMER).catch((e) => console.log("Error " + e))
    }
    if ((Date.now() - storeTimer) < 15 * 60 * 1000) {
        console.log("Please wait 15 minutes between each call...")
        if (!cache) {
            client.quit(() => {
                console.log("Client connection stopped.")
            })
        }
        return
    }
    if (cache) {
        await cache.addKV(STORE_TIMER, Date.now()).catch((e) => console.log("Error " + e))
    } else {
        await client.set(STORE_TIMER, Date.now())
    }
    console.log("Retrieving datasets...")
    let timer = Date.now()
    try {
        let datasets = await getDatasets()
        console.log(`Time taken to retrieve datasets: ${Date.now() - timer} ms`)
        console.log("Storing dataset data...")
        timer = Date.now()
        let counter = 1
        for (let dataset of datasets) {
            (cache) ? await storeData(cache, dataset, true).catch((e) => console.log("Error " + e)) : await storeData(client, dataset).catch((e) => console.log("Error " + e))
            // console.log("Stored: ", counter)
            counter++
        }
        console.log(`Time taken to store data: ${Date.now() - timer} ms`)
    } catch (e) {
        console.log("Error " + e)
    }
    (cache) ? null : client.quit(() => {
        console.log("Client connection stopped.")
    })
}

function init() {
    if (!process.env.REDIS_PORT) {
        process.env.REDIS_PORT = '6379'
    }
    if (!process.env.REDIS_HOST) {
        process.env.REDIS_HOST = '127.0.0.1'
    }
    if (!process.env.REDIS_PASSWORD) {
        process.env.REDIS_PASSWORD = 'myPassword'
    }
    if (!process.env.OPEN_DATA_URL) {
        process.env.OPEN_DATA_URL = 'https://data.edmonton.ca/data.json'
    }
}

if (require.main === module) {
    init()
    storeAll()
}

module.exports = storeAll