'use strict';
const csv = require('csvtojson')
const fs = require('fs');
const axios = require('axios')
const env = "dev";
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1' });
var ssm = new AWS.SSM({ region: 'us-east-1' });

let stores = [
    { store: "st121", address: "110, cresewell Avenue Atlanta 30080" },
    { store: "st122", address: "12 S.Mills devine St. Boca Raton, FL 33428" },
    { store: "st123", address: "95 College Road, Smyrna, MI 48124" },
    { store: "st141", address: "34 North Woodside drive, Chattham, NC 27103]" },
    { store: "st1521", address: "55 Colonial St. Lincoln Park, MI 48146]" },
    { store: "st1261", address: "97 Taylor Lane W, Forest Hills, NY 11375" },
]


csv()
    .fromFile("productcatalog.csv")
    .then((products) => {

        /**
         * [
         * 	{a:"1", b:"2", c:"3"},
         * 	{a:"4", b:"5". c:"6"}
         * ]
         */


        var params = {
            Names: [`/boppis/${env}/resources/s3`,`/boppis/${env}/resources/distribution`,`/boppis/${env}/api/product`], /* required */
            WithDecryption: false
        };
        console.log("outside")

        ssm.getParameters(params).promise().then(parameterData => {
            console.log(parameterData)
            let params = {};
            for(let p of parameterData.Parameters) {
                console.log(p)
                params[p.Name] =  p.Value
            }
            const s3Bucket = params[`/boppis/${env}/resources/s3`];
            const CF_URL = params[`/boppis/${env}/resources/distribution`];
            const productUrl = params[`/boppis/${env}/api/product`]+"product";
            let promises = [];
            for (let product of products) {
                let instock = Math.floor(Math.random() * 10000);
                let base64 = product.Image;
                let upc = new Date().getTime();
                let category = product.Category || 'Lifestyle';
                let imagePath;
                let fullPath = base64;
                if(!base64.startsWith('http')){
                    let buf = Buffer.from(base64.split(',')[1], 'base64');
                    imagePath ='images/' + category + "/" + product.Name + ".jpg";
                    fullPath = "https://"+CF_URL + "/"+imagePath;
                    let s3Params = {
                        Bucket: s3Bucket,
                        Key: imagePath,
                        Body: buf
                    }
                    promises.push(s3.putObject(s3Params).promise());
                 }   
                 let price = product.Price;
                 if(price === "") price = "10.99";
                 else price = price.substring(1);
                let product_data = {
                    upc: upc,
                    currency: 'USD',
                    unit_price: price,
                    merchant: product.Company.Name,
                    brand: product.Company.Name,
                    category: category,
                    product_name: product.Name,
                    picture: fullPath,
                    in_stock: instock,
                    on_hold: Math.floor(Math.random() * 25)

                }
                let n = Math.floor(Math.random() * 6);
                let store = stores[n];
                product_data.store = store.store;
                product_data.address = store.address;
                promises.push(axios.put(productUrl, product_data))

            
            }
            Promise.all(promises).then(data => {
                console.log("done");
            })



        }).catch(error => {
            console.log(error)
        })
    })
// console.log(result)


