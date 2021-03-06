import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import UserContext from '../UserContext'
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: process.env.REACT_APP_API_RETRY });
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});


class JobList extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
    };
  }

  async componentDidMount() {
    this.loadJobs();
    //let job = await listJobs(user.attributes["custom:store"]);
  }

  loadJobs = async () => {

    const user = this.context.user;
    const options = {
      headers: {
        "Authorization": user.signInUserSession.accessToken.jwtToken
      }
    }

    const res =  await axios.get(process.env.REACT_APP_PICKUP_API+"/pickup/"+user.attributes["custom:store"]+"?associate="+user.username, options);

    this.setState({jobs: res.data});

  }
  checkout = () => {
  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  assign = async(e, jobId) => {

    this.jobStatusChange(jobId,  "assign");

  };
  jobStatusChange = async(jobId, status) => {
    const options = {
      headers: {
        "Authorization": this.context.user.signInUserSession.accessToken.jwtToken
      }
    }
    const assignment = {
      associate: this.context.user.username,
    };

    const res =   await axios.post(process.env.REACT_APP_PICKUP_API+`/pickup/${jobId}/${status}`, assignment,options);
    await this.loadJobs();
  }
  complete = async(e, jobId) => {
    this.jobStatusChange(jobId,  "complete")
  };
  closeModal = () => {
     this.props.clearOrder();
  }; 
  render() {  
    return (
      <div>
        {this.state.jobs.length === 0 ? (
          <div className="cart cart-header">Loading ...</div>
        ) : (
          <div className="cart cart-header">
          </div>
        )}
        <div>   
          <div>
            <Fade left cascade>
            <h3 className="cart cart-header">
              Pickup Jobs
            </h3>

              <div >
                {this.state.jobs.map((item) => (
                  <div key={item.jobId}>
                    <div class="card text-left"  >
                        <div class="card-header"><b> Order:</b> {item.orderId} </div>
                        <div class="card-body">
                        {item.products && item.products.map((product) => (
                        <div> <h5 class="card-title">{product.sku}- {product.product_name}</h5> 
                            <p class="card-text"> Quantity: {product.quantity} </p>
                        </div>
                        ))}
                       

                    
                      <div  >
                      {item.jobStatus === 'CREATED' ? (
                        <button
                            class="btn btn-primary"
                            onClick={(e) => this.assign(e, item.jobId)}
                        >
                            Assign
                        </button>
                      ) : (
                        <button
                            class="btn btn-primary"
                            onClick={(e) => this.complete(e, item.jobId)}
                        >
                            Complete
                        </button>
                       )}
                      </div>
                     
                      </div>
                      </div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}

export default JobList;