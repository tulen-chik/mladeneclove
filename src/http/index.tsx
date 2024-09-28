import axios from 'axios'

const $host = axios.create({
    baseURL: 'http://127.0.0.1:3000',
})

const $authHost = axios.create({
    baseURL: 'http://127.0.0.1:3000',
})

export {
    $host,
    $authHost,
}