import React, { Component } from "react";
import formatCurrency from "../Utils";
import Fade from "react-reveal/Fade";
import Modal from "react-modal";
import Zoom from "react-reveal/Zoom";
import { connect } from "react-redux";
import { listProducts } from "../actions/Products";
import { addToCart } from "../actions/cart";
import UserContext from '../UserContext'

class Products extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };
  }
  componentDidMount() {
    this.props.listProducts(this.context.user);
  }
  openModal = (product) => {
    this.setState({ product });
  };
  closeModal = () => {
    this.setState({ product: null });
  };
  render() {
    const { product } = this.state;
    return (
      <div>
        <Fade bottom cascade>
          {!this.props.products ? (
            <div>Loading...</div>
          ) : (
            <ul className="products">
              {this.props.products.Items.map((product) => (
                <li key={product.sku}>
                  <div className="product">
                    <a
                      href={"#" + product.sku}
                      onClick={() => this.openModal(product)}
                    >
                      <img src={product.picture} alt={product.product_name}></img>
                    </a>
                    <div className="product-price">

                    <div >{product.currency} {product.unit_price}</div>
                    <p>{product.product_name}</p>
                    <p> sold by {product.brand} </p>
                     <button
                        onClick={() => this.props.addToCart(product)}
                        className="button primary"
                      >
                        Add To Cart
                      </button> 
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Fade>
        {product && (
          <Modal isOpen={true} onRequestClose={this.closeModal}>
            <Zoom>
              <button className="close-modal" onClick={this.closeModal}>
                x
              </button>
              <div className="product-details">
                <img src={product.picture} alt={product.product_name}></img>
                <div className="product-details-description">
                  <p>
                    <strong>{product.product_name}</strong>
                  </p>
                  <p>{product.merchant}</p>
                  <div className="product-price">
                    <div>{product.currency} {product.unit_price}</div>
                    <button
                      className="button primary"
                      onClick={() => {
                        this.props.addToCart(product);
                        this.closeModal();
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </Zoom>
          </Modal>
        )}
      </div>
    );
  }
}
export default connect(
  (state) => ({ products: state.products.filteredItems }),
  {
    listProducts,
     addToCart,
  }
)(Products);