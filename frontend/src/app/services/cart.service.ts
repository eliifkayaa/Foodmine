import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/Cartitem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor() { }

  //Yiyeceğin zaten sepete eklenip eklenmediğini kontrol eder. Eğer yiyecek zaten sepete eklenmişse, fonksiyonu sonlandırır. Aksi takdirde, Cart nesnesine yeni bir CartItem öğesi ekler
  addToCart(food:Food):void {
    let cartItem = this.cart.items.find(item => item.food.id === food.id)
    if(cartItem)
    return;

    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  //Alışveriş sepetinden kaldırmak için kullanılır. filter() yöntemi kullanarak, belirtilen yiyeceğin id özelliğiyle eşleşen öğeyi cart.items dizisinden kaldırır.
  removeFromcart(foodId:string): void {
    this.cart.items = this.cart.items.filter(item => item.food.id != foodId)
    this.setCartToLocalStorage();
  }

//Yiyeceğin zaten sepete eklenip eklenmediğini kontrol eder. Eğer yiyecek sepete eklenmemişse, fonksiyonu sonlandırır.
  changeQuantity(foodId:string, quantity:number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if(!cartItem) return

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  //Angular bileşenlerinin, Cart nesnesinin değiştiği zaman doğru bir şekilde güncellenmelerini sağlar.
  getCartObservable():Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart{
    return this.cartSubject.value;
  }

private setCartToLocalStorage():void {
  this.cart.totalPrice = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.price, 0)

  this.cart.totalCount = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0)

  const cartJson = JSON.stringify(this.cart);
  localStorage.setItem('Cart', cartJson);
  this.cartSubject.next(this.cart);
}

private getCartFromLocalStorage():Cart {
  const cartJson = localStorage.getItem('Cart');
  return cartJson? JSON.parse(cartJson): new Cart();
}

}
