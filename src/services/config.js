import axios from 'axios'

export const http = axios.create({
    // baseURL: 'http://localhost:8000/api',
    baseURL: 'https://api-challenge-products.herokuapp.com/api',
})