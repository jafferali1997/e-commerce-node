const { Op } = require("sequelize");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description
  })
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
  // Product.findAll({
  //   where: {
  //     id: {
  //       [Op.eq]: prodId,
  //     },
  //   },
  // })
    .then((rows) => {
      if (rows.length > 0) {
        res.render("admin/edit-product", {
          product: rows[0],
          pageTitle: rows[0].title,
          path: "/admin/edit-product",
          editing: editMode,
        });
      } else {
        get404(req, res);
      }
    })
    .catch((err) => console.log(err));
  
  // Product.findById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     editing: editMode,
  //     product: product,
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.update({title: updatedTitle, price: updatedPrice, imageUrl: updatedImageUrl, description: updatedDesc},{
    where:{
      id:{
        [Op.eq]: prodId
      }
    }
  }).then(result=>{
    console.log(result);
    res.redirect("/admin/products");
  }).catch(err=> console.log(err))
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
};

exports.getProducts = (req, res, next) => {
  
  req.user.getProducts()
  //Product.findAll()
  .then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({
    where: {
      id: {
        [Op.eq]: prodId,
      },
    },
  })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
  //Product.deleteById(prodId);
};
