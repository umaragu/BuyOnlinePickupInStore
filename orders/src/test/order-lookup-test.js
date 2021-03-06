const axios = require("axios");
const assert = require( "assert" );

describe( "Lookup Order", () => {

    it("shoud get an order by orderid" , () => {

        let orderId = "232323"
        let response = await axios.get(process.env.ORDER_API_URL+"/order?orderId="+orderId)
        console.log(response)
    })

    it("shoud get all orders by customer id" , () => {
        let customerId = "232323"
        let response =await axios.get(process.env.ORDER_API_URL+"/order?customer_id="+customerId)
        console.log(response)
    })

})
