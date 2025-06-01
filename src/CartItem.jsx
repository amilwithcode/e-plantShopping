// CartItem.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // 🧮 Cart-dakı bütün məhsulların yekun məbləğini hesaplayır
  const calculateTotalAmount = () => {
    const total = cart.reduce((sum, item) => {
      // 1) Cost-da "$" və digər simvolları təmizlə, rəqəmə çevir:
      const numericCost = parseFloat(item.cost.replace(/[^0-9.]/g, '')) || 0;
      // 2) Quantity-ni təsdiq et, default 1 götür:
      const qty = Number.isFinite(item.quantity) ? item.quantity : 1;
      return sum + numericCost * qty;
    }, 0);

    return total.toFixed(2);
  };

  // 🛍 “Continue Shopping” — parent komponentə siqnal göndərərək showCart=false edəcək
  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping(); // parent komponentdə showCart=false olacaq
    }
  };

  // 💳 “Checkout” — cart boşdursa xəbərdarlıq, doludursa yekun məbləği alert edir,
  // sonra cart-ı təmizləyib parent’a geri dön siqnalı atır
  const handleCheckout = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('🛒 Səbətiniz hal-hazırda boşdur. Lütfən əvvəlcə məhsul əlavə edin.');
      return;
    }

    // 1) Faktiki checkout API çağırışı burada olmalıdır (məsələn: dispatch(performCheckout(cart)))
    // 2) Demo üçün yalnız alert edirik:
    const finalAmount = calculateTotalAmount();
    alert(`✅ Checkout uğurla tamamlandı! Ümumi məbləğ: $${finalAmount}`);

    // 3) Cart-ı sıfırlayırıq
    dispatch(clearCart());

    // 4) Parent-a geri dön siqnalı (məs. məhsul siyahısına qayıtmaq üçün):
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  // ➕ Məhsulun sayını artırır
  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  // ➖ Məhsulun sayını azaldır (1-dən aşağısı varsa “sil” action-unı çağırır)
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeItem(item.name));
    }
  };

  // ❌ Məhsulu səbətdən silmək üçün
  const handleRemove = (item) => {
    dispatch(removeItem(item.name));
  };

  // 🧾 Hər bir item üçün “cost * quantity” hesablayır
  const calculateTotalCost = (item) => {
    const numericCost = parseFloat(item.cost.replace(/[^0-9.]/g, '')) || 0;
    const qty = Number.isFinite(item.quantity) ? item.quantity : 1;
    return (numericCost * qty).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>
        Total Cart Amount: ${calculateTotalAmount()}
      </h2>

      <div>
        {cart.map(item => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">
                ${parseFloat(item.cost.replace(/[^0-9.]/g, '')).toFixed(2)}
              </div>
              <div className="cart-item-quantity">
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >-</button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >+</button>
              </div>
              <div className="cart-item-total">
                Total: ${calculateTotalCost(item)}
              </div>
              <button
                className="cart-item-delete"
                onClick={() => handleRemove(item)}
              >Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', color: 'black' }}></div>

      <div className="continue_shopping_btn">
        <button
          className="get-started-button"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </button>
        <br />
        <button
          className="get-started-button1"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartItem;
