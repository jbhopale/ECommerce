module.exports = function Cart(initialItems){
    this.items = initialItems.items || {} ;
    this.totalQuantity = initialItems.totalQuantity || 0; 
    this.totalPrice = initialItems.totalPrice || 0;

    this.add = function(item, id){
        var existingItems = this.items[id];
        if(!existingItems){
            existingItems = this.items[id] = {
                item: item,
                quantity: 0,
                price: 0
            };
        }
        existingItems.quantity++;
        existingItems.price = existingItems.item.productPrice * existingItems.quantity;
        this.totalQuantity++;
        this.totalPrice += existingItems.item.productPrice;
    }

    this.createProductArray = function(){
        var productArray = [];
        for(var id in this.items){
            productArray.push(this.items[id]);
        }
        return productArray;
    };
};