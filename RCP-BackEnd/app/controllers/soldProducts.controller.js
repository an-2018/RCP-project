const soldProductsModel = require("../database/models/soldProducts.model");

const sellerModel = require("../database/models/seller.model");

class SoldProducts {

  static addProduct = async (req, res) => {
    try {
      const sellerProducts = await soldProductsModel.find({
        sellerId: req.seller._id,
      });
      if (sellerProducts) {
        let index = sellerProducts.findIndex(
          (product) =>
            product.productName == req.body.productName &&
            product.yearOfSold == req.body.yearOfSold
        );
        if (index >= 0) {
          throw new Error("the product has been added before");
        }
      }
      const productData = new soldProductsModel({
        ...req.body,
        sellerId: req.seller._id,
        sellerName: req.seller.name,
        location: req.seller.location,
      });
      await productData.save();
      res.status(200).send({
        apiStatus: true,
        data: productData,
        message: "product added by seller",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static mySoldProducts = async (req, res) => {
    try {
      await req.seller.populate("mySoldProducts");
      res.status(200).send({
        apiStatus: true,
        data: req.seller.mySoldProducts,
        message: "seller products fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static totalAgricultureSoldProducts = async (req, res) => {
    try {
      const soldProducts = await soldProductsModel.find();
      let agriculture = {};
      let newProduct = [];
      soldProducts.forEach((soldProduct) => {
        if (soldProduct.category == "agriculture") {
          if (agriculture.hasOwnProperty(soldProduct.yearOfSold)) {
           
            for(let i = 0 ; i<agriculture[soldProduct.yearOfSold].length ; i++){
              if(soldProduct.productName == agriculture[soldProduct.yearOfSold][i].productName){
                agriculture[soldProduct.yearOfSold][i].quantity += soldProduct.quantity
                break;
              }
              else if(i==agriculture[soldProduct.yearOfSold].length-1){
                let temp={
                  productName: soldProduct.productName,
                  quantity: soldProduct.quantity,
                } 
                agriculture[soldProduct.yearOfSold].push(temp) 
                temp = {};
                break;
              }
            }
          }
           else {
            newProduct.push({
              productName: soldProduct.productName,
              quantity: soldProduct.quantity,
            }) 
            agriculture[soldProduct.yearOfSold] = newProduct;
            newProduct = [];
          
          }
        }
      });

      res.status(200).send({
        apiStatus: true,
        data: agriculture,
        message: "sellers agriculture products fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static totalDiarySoldProducts = async (req, res) => {
    try {
      const soldProducts = await soldProductsModel.find();
      let diary={}
      let newProduct = [];
      soldProducts.forEach((soldProduct) => {
        if (soldProduct.category == "diary") {
          if (diary.hasOwnProperty(soldProduct.yearOfSold)) {
            
            for(let i = 0 ; i<diary[soldProduct.yearOfSold].length ; i++){
              if(soldProduct.productName == diary[soldProduct.yearOfSold][i].productName){
                diary[soldProduct.yearOfSold][i].quantity += soldProduct.quantity
                break;
              }
              else if(i==diary[soldProduct.yearOfSold].length-1){
                let temp={
                  productName: soldProduct.productName,
                  quantity: soldProduct.quantity,
                } 
                diary[soldProduct.yearOfSold].push(temp) 
                temp = {};
                break;
              }
            }
          }
           else {
            newProduct.push({
              productName: soldProduct.productName,
              quantity: soldProduct.quantity,
            }) 
            diary[soldProduct.yearOfSold] = newProduct;
            newProduct = [];
          
          }
        }
      });

      res.status(200).send({
        apiStatus: true,
        data: diary,
        message: "sellers diary products fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  
  static totalProteinSoldProducts = async (req, res) => {
    try {
      const soldProducts = await soldProductsModel.find();
      let protein={}
      let newProduct = [];
      soldProducts.forEach((soldProduct) => {
        if (soldProduct.category == "protein") {
          if (protein.hasOwnProperty(soldProduct.yearOfSold)) {
            
            for(let i = 0 ; i<protein[soldProduct.yearOfSold].length ; i++){
              if(soldProduct.productName == protein[soldProduct.yearOfSold][i].productName){
                protein[soldProduct.yearOfSold][i].quantity += soldProduct.quantity
                break;
              }
              else if(i==protein[soldProduct.yearOfSold].length-1){
                let temp={
                  productName: soldProduct.productName,
                  quantity: soldProduct.quantity,
                } 
                protein[soldProduct.yearOfSold].push(temp) 
                temp = {};
                break;
              }
            }
          }
           else {
            newProduct.push({
              productName: soldProduct.productName,
              quantity: soldProduct.quantity,
            }) 
            protein[soldProduct.yearOfSold] = newProduct;
            newProduct = [];
          
          }
        }
      });

      res.status(200).send({
        apiStatus: true,
        data: protein,
        message: "sellers protein products fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

    static deleteSoldProduct = async (req, res) => {
      try {
        await soldProductsModel.findOneAndDelete({
          _id: req.params.id,
          sellerId: req.seller._id,
        });
        await req.seller.populate("mySoldProducts");
        await req.seller.save();
        res.status(200).send({
          apiStatus: true,
          data: req.seller.mySoldProducts,
          message: "sold product deleted",
        });
      } catch (e) {
        res.status(500).send({
          apiStatus: false,
          data: e,
          message: e.message,
        });
      }
    };

    static editSoldProduct = async (req, res) => {
      try {
        const updates = Object.keys(req.body);
        const product = await soldProductsModel.findOne({
          _id: req.params.id,
          sellerId: req.seller._id,
        });
        
        const myProducts = await soldProductsModel.find({ sellerId: req.seller._id,});
        updates.forEach((key) => (product[key] = req.body[key]));
      
        myProducts.forEach(myProduct=>{
         if(myProduct.productName==product.productName && myProduct.yearOfSold == product.yearOfSold){
          throw new Error("this product has entered before in the same year")
         }
        })
      
        await product.save();
        res.status(200).send({
          apiStatus: true,
          data: product,
          message: "sold product edited",
        });
      } catch (e) {
        res.status(500).send({
          apiStatus: false,
          data: e,
          message: e.message,
        });
      }
    };
}

module.exports = SoldProducts;
