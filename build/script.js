var app = new Vue({
  el: '#app',
  data: {
    searchValue: '',
    searchTerms: [],
    loading: false,
    current: {},
    currentIngredients: [],
    currentCart: [],
    recipeTitle: '',
  },
  methods: {
    async search() {
      try {
        this.loading = true;
        this.searchTerms = this.searchValue.split(" ");
        var url = 'https://www.food2fork.com/api/search?key=e4f6ddb7e451265285d76159065c5785&q=';
        var firstTerm = true;
        for (var term in this.searchTerms) {
          if(!firstTerm) {
            url += "%20";
          }
          else {
            firstTerm = false;
          }
          url += this.searchTerms[term];
        }
        console.log(url);
        const response = await axios.get(url)
        console.log(response)
        this.current = response.data.recipes[0]
        var url2 = 'https://www.food2fork.com/api/get?key=e4f6ddb7e451265285d76159065c5785&rId='
        url2 += this.current.recipe_id
        console.log(url2);
        const response2 = await axios.get(url2)
        var ingredients = response2.data.recipe.ingredients
        for(item in ingredients) {
          if(ingredients[item].includes(",")) {
            ingredients[item] = ingredients[item].split(",")[0]
          }
          this.currentIngredients.push({text:ingredients[item], checked:false})
        }
        console.log(this.currentIngredients)
        this.loading = false
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    deleteItems() {
      var i;
      for (i = 0; i < this.currentIngredients.length; i++) {
        if(this.currentIngredients[i].checked) {
          this.currentIngredients.splice(i, 1);
          i--;
        }
      }
    },
    addToCart() {
      var i;
      var itemsToAdd = [];
      for (i = 0; i < this.currentIngredients.length; i++) {
        if(this.currentIngredients[i].checked) {
          var item = this.currentIngredients.splice(i, 1);
          i--;
          item[0].checked = false
          itemsToAdd.push(item[0])
          console.log(this.currentIngredients)
          console.log(itemsToAdd)
        }
      }
      this.currentCart = this.currentCart.concat(itemsToAdd)
      console.log(this.currentCart)
    },
    removeFromCart(text) {
      var i;
      for (i=0; i < this.currentCart.length; i++) {
        if(text === this.currentCart[i].text) {
          this.currentCart.splice(i, 1);
          console.log(this.currentCart)
        }
      }
    }
  },
});
