<template>
  <div id="app">
    <Toasts
        :show-progress="true"
        :rtl="true"
        :max-messages="5"
        :time-out="3000"
        :closeable="true"
      ></Toasts>
    <header>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a href="#" class="navbar-brand d-flex align-items-center">
            <strong>Home</strong>
          </a>
        </div>
      </div>
    </header>
    <div class="container" style="margin-top: 40px">
      <div class="card">
        <div class="card-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>

      <div class="row md" style="margin-top: 10px">
        <div class="col">
          <div v-if="errors_exist" class="alert alert-danger" role="alert">
            Ops! Não foi possível salvar o registro. 
            <ul>
              <div v-for="(error, index) of errors" :key="index"> 
                <li>{{ error[0] }}</li>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div class="input-group" style="margin-top: 40px">
        <input 
          type="file" 
          ref="inputFile"
          class="form-control" 
          @change="selectFile"
        >
        <button 
          class="btn btn-primary" 
          type="button" 
          id="inputGroupFileAddon04"
          @click="saveProduct"
        >
          Enviar
        </button>
      </div>

      <table class="table" style="margin-top: 40px">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Type</th>
            <th scope="col">Rating</th>
            <th scope="col">Price</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product of products" :key="product.id">
            <td>{{product.title}}</td>
            <td>{{product.type}}</td>
            <td>{{product.rating}}</td>
            <td>{{product.price}}</td>
            <td>{{product.created_at}}</td>
            <td>
              <button 
                class="btn btn-secondary" 
                type="button" 
                data-bs-toggle="modal"
                data-bs-target="#modelEdit"
                @click="editProduct(product)"
              >
                Editar
              </button>
              <button  style="margin-left: 10px"
                class="btn btn-danger" 
                type="button" 
                @click="deleteProduct(product)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="modal fade" id="modelEdit" tabindex="-1" aria-labelledby="modelEditLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modelEditLabel">Editar Produto</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="row" style="margin-top: 40px">
              <div class="col">
                <div v-if="errors_edit_exist" class="alert alert-danger" role="alert">
                  Ops! Não foi possível editar o registro. 
                  <ul>
                    <div v-for="(error_edit, i) of errors_edit" :key="i"> 
                      <li>{{ error_edit[0] }}</li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="modal-body">
              <form @submit.prevent="updateProduct">

                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input type="text" class="form-control" id="title" v-model="product.title">
                </div>
                <div class="mb-3">
                  <label for="type" class="form-label">Type</label>
                  <input type="text" class="form-control" id="type" v-model="product.type">
                </div>
                <div class="mb-3">
                  <label for="rating" class="form-label">Rating</label>
                  <input type="text" class="form-control" id="rating" v-model="product.rating">
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input type="text" class="form-control" id="price" v-model="product.price">
                </div>

                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modelEdit">Salvar</button>
                  <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modelEdit">Cancelar</button>
                </div>
                
                </form>
            </div>
            
          </div>
        </div>
      </div>

    </div>

    
  </div>
</template>

<script>

import Home from './services/home'
import Products from './services/products'

export default {
  name: "App",
  components: {},
  data(){
    return {
      products: [],
      currentFile: [],
      errors: [],
      errors_exist: false,
      errors_edit: [],
      errors_edit_exist: false,
      product: {
        id: '',
        title: '',
        type: '',
        rating: '',
        price: '',
      }
    }
  },
  mounted(){
    // this.getHome()
    this.listProducts()
  },

  methods:{
    getHome(){
      Home.getHome().then(resposta => {
        console.log(resposta)
      })
    },

    listProducts(){
      Products.index().then(response => {
        this.products = response.data.results
      })
    },

    selectFile(event) {
      this.currentFile = event.target.files[0];
    },

    saveProduct(){
      let data = new FormData();
      data.append('file', this.currentFile);

      Products.save(data).then(response => {
        this.$toast.success(response.data.message);
        this.listProducts()
        this.$refs.inputFile.value=null;
        this.currentFile = []

      }).catch(e => {
        console.log(e.response.data.errors)
        this.errors_exist = true;
        this.errors = e.response.data.errors
      })
    },

    editProduct(product){
      Products.edit(product)
        .then(response => {
          this.product.id = response.data.results.id
          this.product.title = response.data.results.title
          this.product.type = response.data.results.type
          this.product.rating = response.data.results.rating
          this.product.price = response.data.results.price

        }).catch(e => {
          this.errors_exist = true;
          this.errors = e.response.data.errors
        })
    },

    updateProduct(){
      let dataEdit = new FormData();
      dataEdit.append('id', this.product.id);
      dataEdit.append('title', this.product.title);
      dataEdit.append('type', this.product.type);
      dataEdit.append('rating', this.product.rating);
      dataEdit.append('price', this.product.price);
      dataEdit.append("_method", "put");

      Products.update(this.product.id, dataEdit).then(response => {
        this.$toast.success(response.data.message);
        this.errors_exist = false;
        this.listProducts()

      }).catch(e => {
        this.errors_edit_exist = true;
        this.errors_edit = e.response.data.errors
      })
    },

    deleteProduct(product){
      var resultado = confirm("Deseja excluir o produto?");
      if(resultado){
        Products.delete(product).then(response => {
        this.$toast.success(response.data.message);
        this.errors_exist = false;
        this.listProducts()
      }).catch(e => {
        this.errors_exist = true;
        this.errors = e.response.data.errors
      })
      }

      
    }
  }
};
</script>

<style>

</style>
