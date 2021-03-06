const axios = require("axios");
const assert = require( "assert" );

describe( "Create Order", () => {

    it("shoud create an order with one product" , () => {
        let order = {
            store: "st121",
            store_address: "123,3434fgfdgfdg, dela",
            customer_id: "cust12@email.com",
            customer_name: "uma",
            customer_phone: "4013399144",
            order_type: "pickup",
            products:[{
                sku: "",
                price: "",
                quantity: 1
            }]

        }
        await axios.post(process.env.ORDER_API_URL+"/order", order)
    })

    it("shoud create an order with multiple product" , () => {
        let order = {
            store: "st121",
            store_address: "123,3434fgfdgfdg, dela",
            customer_id: "cust12@email.com",
            customer_name: "uma",
            customer_phone: "4013399144",
            order_type: "pickup",
            products:[{
                sku: "",
                price: "",
                quantity: 1
            },
            {
                sku: "",
                price: "",
                quantity: 1
            }]

        }
        await axios.post(process.env.ORDER_API_URL+"/order", order)
        
    })
    it("shoud throw error with 400" , () => {
        let order = {
            store: "st121",
            store_address: "123,3434fgfdgfdg, dela",
            customer_name: "uma",
            customer_phone: "4013399144",
            order_type: "pickup",
            products:[{
                sku: "",
                price: "",
                quantity: 1
            },
            {
                sku: "",
                price: "",
                quantity: 1
            }]

        }
        let response = await axios.post(process.env.ORDER_API_URL+"/order", order)
        console.log(response)
    })
    it("shoud throw error with 400" , () => {
            let order = {
                store: "st121",
                store_address: "123,3434fgfdgfdg, dela",
                customer_name: "uma",
                customer_id: "cust12@email.com",
                customer_phone: "4013399144",
                order_type: "pickup",
    
            }
            let response = await axios.post(process.env.ORDER_API_URL+"/order", order)
            console.log(response)
           
    })
    it("shoud throw error with 400" , () => {
            let order = {
                store: "st121",
                store_address: "123,3434fgfdgfdg, dela",
                customer_name: "uma",
                customer_id: "cust12@email.com",
                customer_phone: "4013399144",
                order_type: "pickup",
                products:[{
                    price: "",
                    quantity: 1
                },
                {
                    sku: "",
                    price: "",
                    quantity: 1
                }]
    
            }
            let response = await axios.post(process.env.ORDER_API_URL+"/order", order)
            console.log(response)
            
    })
    it("shoud throw error with 400" , () => {
            let order = {
                store: "st121",
                store_address: "123,3434fgfdgfdg, dela",
                customer_id: "cust12@email.com",
                customer_name: "uma",
                customer_phone: "4013399144",
                order_type: "pickup",
                products:[{
                    sku: "",
                    price: "",
                    quantity: 1
                },
                {
                    sku: "",
                    quantity: 1
                }]
    
            }
            let response = await axios.post(process.env.ORDER_API_URL+"/order", order)
            console.log(response)
            
    })
    it("shoud throw error with 400" , () => {
        let order = {
            store_address: "123,3434fgfdgfdg, dela",
            customer_id: "cust12@email.com",
            customer_name: "uma",
            customer_phone: "4013399144",
            order_type: "pickup",
            products:[{
                sku: "",
                price: "",
                quantity: 1
            },
            {
                sku: "",
                quantity: 1
            }]

        }
        let response = await axios.post(process.env.ORDER_API_URL+"/order", order)
        console.log(response)
    
    })

})
