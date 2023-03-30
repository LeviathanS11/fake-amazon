import React, { useEffect, useState } from 'react';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])
    useEffect(()=>{
        const storedCart=getShoppingCart();
        const savedCart=[];
        //step 1:get the id of the addedProduct
        for(const id in storedCart){
            //step 2:get product from products state by using id
            const addedProducts=products.find(product=>product.id===id)
            if(addedProducts){
                //step 3:add quantity
                const quantity=storedCart[id]
                addedProducts.quantity=quantity;
                //step 4:add the addedProduct to the saved cart
                savedCart.push(addedProducts)
            }
            console.log(addedProducts)
        }
        setCart(savedCart)
    },[products])
    const handleAddtoCart = (product) => {
        const newCart = [...cart, product];
        setCart(newCart);
        addToDb(product.id)
    }
    return (
        <div className='shop-container'>
            <div className="product-container">
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        handleAddtoCart={handleAddtoCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;