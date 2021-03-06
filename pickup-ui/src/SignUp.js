import React from 'react'
import { css } from 'glamor'

import { Auth } from 'aws-amplify'
import {STORES} from "./Constants"
class SignUp extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    phone_number: '',
    authCode: '',
    showConfirmation: false,
    store: ""
  }
  onChange = (key, value) => {
    this.setState({
      [key]: value
    })
  }
  setStore = (e) => {
    alert(e.target.value)
    
    this.setState({store: e.target.value});
  }
  signUp = () => {
    const { username, password, phone_number,store } = this.state
    if(store === "") {alert("store can not be empty"); return;}
    Auth.signUp({
        username,
        password,
        attributes: {
            email: username,
            phone_number:phone_number,
            "custom:store": store
        }
    })
    .then(() => this.setState({ showConfirmation: true }))
    .catch(err => {
      console.log('error signing up: ', err)
      this.props.updateErrorMessage(err.message)
    })
  }
  confirmSignUp = () => {
    Auth.confirmSignUp(this.state.username, this.state.authCode)
    .then(() => this.props.switchState('showSignIn'))
    .catch(err => console.log('error confirming signing up: ', err))
  }
  render() {
    const { showConfirmation } = this.state
    const stores = process.env.STORES || STORES;
    return (
      <div {...css(styles.container)}>
        {
          !showConfirmation && (
            <div {...css(styles.formContainer)}>
              <h2 {...css(styles.signUpHeader)}>Sign Up</h2>
              <input
                {...css(styles.input)}
                placeholder='Email'
                onChange={evt => this.onChange('username', evt.target.value)}
              />
              <input
                {...css(styles.input)}
                placeholder='Password'
                type='password'
                onChange={evt => this.onChange('password', evt.target.value)}
              />
              {
              <input
                {...css(styles.input)}
                placeholder='Phone Number'
                onChange={evt => this.onChange('phone_number', evt.target.value)}
              /> }
          <select         {...css(styles.input)}

              value = {this.state.store   }
              defaultInputValue =   {this.state.store   }
              onChange={(e) =>
              this.setStore(e)
            }

          >   
            <option value=""> Select Store</option>
           
          {stores.map((store) => (
            <option value={store.store}>{store.store} - {store.address}</option> 
            ))}
          </select>

              <div {...css(styles.button)} onClick={this.signUp}>
                <p {...css(styles.buttonText)}>Sign Up</p>
              </div>
            </div>
          )
        }
        {
          showConfirmation && (
            <div {...css(styles.formContainer)}>
              <input
                onChange={evt => this.onChange('authCode', evt.target.value)}
                {...css(styles.input)}
                placeholder='Confirmation Code'
              />
              <div {...css(styles.button)} onClick={this.confirmSignUp}>
                <p {...css(styles.buttonText)}>Confirm Sign Up</p>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

const styles = {
  signUpHeader: {
    textAlign: 'left',
    margin: '0px 0px 20px'
  },
  button: {
    padding: '10px 60px',
    backgroundColor: '#ffb102',
    cursor: 'pointer',
    borderRadius: '30px',
    marginTop: 10,
    marginBottom: 10,
    ':hover': {
      backgroundColor: '#ffbb22'
    }
  },
  buttonText: {
    margin: 0,
    color: 'white'
  },
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: '15px',
  },
  formContainer: {
    padding: 20,
    width: 400,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: "0px 0px 2px rgba(0, 0, 0, .2)",
    borderRadius: 20
  },
  input: {
    height: 40,
    marginBottom: '10px',
    border: 'none',
    outline: 'none',
    borderBottom: '2px solid #ffb102',
    fontSize: '16px',
    '::placeholder': {
      color: 'rgba(0, 0, 0, .3)'
    }
  },
}

export default SignUp
