import { http } from './config'

export default {
    
    index: () => {
        return http.get('/products')
    },

    save: (data) => {
        return http.post('/products', data)
    },

    edit: (produto) => {
        return http.get(`/products/${produto.id}/edit`)
    },

    update: (id, data) => {
        return http.post(`/products/${id}`, data)
    },

    delete: (produto) => {
        return http.delete(`/products/${produto.id}`)
    }
}