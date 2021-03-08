import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import { connect } from "react-redux";
import Modal from "react-modal";
import Zoom from "react-reveal/Zoom";
import { removeFromCart } from "../actions/cart";
import { Link } from "react-router-dom";
import UserContext from '../UserContext'

import { createOrder, clearOrder } from "../actions/order";

class Cart extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      address: "",
      showCheckout: false,
      checkout: props.checkout
    };

  }

  checkout = () => {
  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  formatStore = (store) => {
    return store.store + ", " + store.address;
  };
  createOrder = (e) => {
    e.preventDefault();
    const user = this.context.user;
    const order = {
      customer_id: user.attributes.email,
      customer_name: user.attributes.given_name +" " + user.attributes.family_name,
      order_type: "STORE_PICKUP",
      store_address: this.props.store.address,
      store: this.props.store.store,
      customer_phone: user.attributes.phone_number,
      products: this.props.cartItems,
    };
     this.props.createOrder(order, this.context.user);
  };
  closeModal = () => {
     this.props.clearOrder();
  };
  render() {
    const { cartItems, order, store } = this.props;
    return (
      <div>
        {cartItems.length === 0 ? (
          <div className="cart cart-header">Cart is empty</div>
        ) : (
          <div className="cart cart-header">
            You have {cartItems.length} in the cart{" "}
          </div>
        )}

        {order && (
          <Modal isOpen={true} onRequestClose={this.closeModal}>
            <Zoom>
              <button className="close-modal" onClick={this.closeModal}>
                x
              </button>
              { Array.isArray(order) ? (
                    <div className="order-details">
                    <h3 className="success-message">Your order has been placed.</h3>
                    <h2>Order: {order[0].orderId}</h2>
                    <ul>
                      <li>
                        <div>You will receive updates on your order on your email,</div>
                        <b>{order[0].customer_id}</b>
                      </li>
                      <li>
                        <div>The pickup Address is</div>
                        <b>{order[0].store}{order[0].store_address}</b>
                      </li>
                    </ul>
                    </div>
                ) : (
                  <div className="success-message">
                     {order}
                  </div>
                )}

            </Zoom>
          </Modal>
        )}
        <div>
          <div className="cart">
            <Fade left cascade>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={item.sku}>
                    <div>
                      <img src={item.picture} alt={item.product_name}></img>
                    </div>
                    <div>
                      <div>{item.product_name}</div>
                      <div className="right">
                        {item.unit_price} x {item.quantity}{" "}
                        <button
                          className="button"
                          onClick={() => this.props.removeFromCart(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Fade>
          </div>
          {cartItems.length !== 0 && (
            <div>
              <div className="cart">
                <div className="total">
                  <div>
                    Total:{" "}
                    {
                      cartItems.reduce((a, c) => a + c.unit_price * c.quantity, 0)
                    }
                  </div>
                        {this.state.checkout != 'main'  && (
                            
                      <Link to="/checkout">Proceed</Link>)}
                        {this.state.checkout === 'main'  && (
                  <button
                        onClick={() => {
                          const isAuthenticated = this.context.user && this.context.user.username ? true : false
                          const isLoaded = this.context.isLoaded;
                          if(isLoaded && isAuthenticated)
                            this.setState({ showCheckout: true });
                          else
                            this.context.router.history.push('/auth')
                        }}
                        className="button primary"
                        >
                        Checkout
                </button>
                        
                        )}
                    </div>
              </div>
              {this.state.showCheckout && (
                <Fade right cascade>
                  <div className="cart">
                    <form onSubmit={this.createOrder}>
                      <ul className="form-container">
                        <li>
                          <label>Email : <strong> {this.context.user.attributes.email} </strong></label>
                         </li>
                        <li>
                          <label>Pickup Address : <b>{this.formatStore(this.props.store)}</b></label>
                         </li>
                        <li>
                          <button className="button primary" type="submit">
                            Confirm Pickup
                          </button>
                        </li>
                      </ul>
                    </form>
                  </div>
                </Fade>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    order: state.order.order,
    cartItems: state.cart.cartItems,
    store: state.products.store
  }),
  { removeFromCart, createOrder, clearOrder }
)(Cart);
