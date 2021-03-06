import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import UserContext from '../UserContext'
import axiosRetry from 'axios-retry';
import axios from 'axios';

axiosRetry(axios, { retries: process.env.REACT_APP_API_RETRY });
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});



class OrderList extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      customerEmail: ''
    };
  }


  loadOrders = async (e) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    const email = this.state.customerEmail;
    const options = {
      headers: {
        "Authorization": this.context.user.signInUserSession.accessToken.jwtToken
      }
    }
  
    if(expression.test(String(email).toLowerCase())) {
        const res =  await axios.get(process.env.REACT_APP_ORDER_API+"/order/internal?customer_id="+email, options);
        this.setState({orders: this.groupBy(res.data)});
    } else {
      alert("Enter valid email");
    }


  }

 groupBy(orders) {
   let groupedOrders = {};
   for(let order of orders){
     let grouped = groupedOrders[order.orderId];
     if(!grouped) { 
       grouped = [];
       groupedOrders[order.orderId] = grouped;

     }
     grouped.push(order)

   }
   return groupedOrders;
 }

  
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  
  complete = async(e, order) => {
    const options = {
      headers: {
        "Authorization": this.context.user.signInUserSession.accessToken.jwtToken
      }
    }
    const data = {
      eventName: "ORDER_COMPLETED",
      eventSource: "org.boppis.order.action",
      eventData: [{
        orderId: order.orderId,
        customer_name: order.customer_name,
        store_address: order.store_address,
        customer_id: order.customer_id
  
      }]
    }
    const res =   await axios.post(process.env.REACT_APP_ORDER_API+"/order/internal/complete", data, options);
    await this.loadOrders();

  };
   render() {
    console.log(this.props)
    let orderIds = Object.keys(this.state.orders);
    return (
      <div>        <div className="right">
        
      <input type="email" width="100px" placeholder="Email" value= {this.state.customerEmail} name = "customerEmail" onChange={(e) => this.handleInput(e)}/>
      
      <button className="button" onClick={(e) => this.loadOrders(e)}>
          Search
      </button>
      
      </div>
      <div>
        <div>
          <Fade left cascade>
            <div >

              {orderIds.map((orderId) => (
                <div key={orderId} class="card text-left"  >
                  <div class="card-header"><b> Order:</b> {orderId}   
                  {this.state.orders[orderId][0].status === 'READY_FOR_PICKUP' && (
                  <span class="badge badge-pill badge-success"><b>{this.state.orders[orderId][0].status} </b></span>
                  ) }
                  {this.state.orders[orderId][0].status === 'CREATED' && (
                  <span class="badge badge-pill badge-dark"><b>{this.state.orders[orderId][0].status} </b></span>
                  ) }
                  {this.state.orders[orderId][0].status === 'COMPLETED' && (
                  <span class="badge badge-pill badge-info"><b>{this.state.orders[orderId][0].status} </b></span>
                  ) }
                  </div>
                  <div class="card-body"> 
                  {this.state.orders[orderId].map((item) => (
                    <div> 
                        <div class="d-flex justify-content-left"><h5> {item.product_name}  </h5><div class="badge  badge-light"> USD {item.price}</div></div>
                        <div> Quantity: {item.quantity}</div>
                    </div>
                  ))}
                  <div> 
                      {this.state.orders[orderId][0].status === 'READY_FOR_PICKUP' && (
                        <button
                        class="btn btn-primary"
                            onClick={(e) => this.complete(e,this.state.orders[orderId][0])}
                        >
                            Complete
                        </button>
                      ) }

                  </div>
                  </div>
                </div>
              ))}
            </div>
            </Fade>
          </div>
        </div>

        </div>
    )}
  }
                  //     <div  >
                  //     </div>
                  //     <div class="break"></div> 

                  // </div>
                
export default OrderList;