import axios from 'axios'

const $host = axios.create({
    baseURL: "https://" + process.env.VERCEL_URL,
})

const $authHost = axios.create({
    baseURL: "https://" + process.env.VERCEL_URL,
})

export {
    $host,
    $authHost,
}