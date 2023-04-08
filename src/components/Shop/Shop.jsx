import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import { Link } from 'react-router-dom';

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
            // console.log(addedProducts)
        }
        setCart(savedCart)
    },[products])
    const handleAddtoCart = (product) => {
        let newCart=[];
        // const newCart = [...cart, product];
        const exists=cart.find(pd=>pd.id === product.id);
        if(!exists){
            product.quantity=1;
            newCart=[...cart,product]
        }
        else{
            exists.quantity = exists.quantity+1;
            const remaining =cart.filter(pd=>pd.id !== product.id);
            newCart=[...remaining,exists];
        }
        setCart(newCart);
        addToDb(product.id)
    }
    const handleClearCart=()=>{
        setCart([]);
        deleteShoppingCart();
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
                <Cart cart={cart} handleClearCart={handleClearCart }>
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;