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

async function storeData(redis_client, dataset) {
    const { label, identifier } = dataset
    const key = "opendata:" + identifier.slice(35) /** unique identifier */
    await getDatasetColumns(identifier)
    .then((columns) => {
        insert(redis_client, key, label, columns)
    })
    .catch((err) => {
        console.log(err)
    })
}

async function storeAll() {
    let client = await redisClientConnect()
    client.on('error', (err) => {
        console.log("Error " + err)
    })
    const onAsync = promisify(client.on).bind(client)
    await onAsync('ready').then(() => console.log("Client is ready."))
    console.log("Retrieving datasets...")
    let timer = Date.now()
    try {
        let datasets = await getDatasets()
        console.log(`Time taken to retrieve datasets: ${Date.now() - timer} ms`)
        console.log("Storing dataset data...")
        timer = Date.now()
        let counter = 1
        for (let dataset of datasets) {
            try {
                await storeData(client, dataset)
                console.log("Stored: ", counter)
                counter++
            } catch (e) {
                console.log("Error " + e)
            }
        }
        console.log(`Time taken to store data: ${Date.now() - timer} ms`)
    } catch (e) {
        console.log("Error " + e)
    }
    client.quit()
    return true
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