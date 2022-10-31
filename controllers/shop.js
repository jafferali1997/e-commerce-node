const Product = require("../models/product");
const Cart = require("../models/cart");
const { Op } = require("sequelize");
const { responseFor404 } = require("./404");
const {
  get404,
} = require("c:/users/j11/downloads/00-starting-setup (1)/00-starting-setup/controllers/error");

exports.getProducts = async(req, res, next) => {
  const products = await Product.findAll()
  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products",
  });
  // Product.fetchAll()
  //   .then(({ rows }) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       pageTitle: "All Products",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({
    where: {
      id: {
        [Op.eq]: prodId,
      },
    },
  })
    .then((rows) => {
      if (rows.length > 0) {
        res.render("shop/product-detail", {
          product: rows[0],
          pageTitle: rows[0].title,
          path: "/products",
        });
      } else {
        get404(req, res);
      }
    })
    .catch((err) => console.log(err));
  // Product.findById(prodId)
  //   .then(({ rows }) => {
  //     res.render("shop/product-detail", {
  //       product: rows[0],
  //       pageTitle: rows.title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll().then(({rows})=> {
  //   res.render('shop/index', {
  //     prods: rows,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // }).catch(err=> console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) =>
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  let product = await cart.getProducts({ where: { id: prodId } });
  let newQuantity = 1;
  if (product[0]) {
    await cart.addProduct(product[0], { through: { quantity: product[0].cartItem.quantity + 1 } });
    res.redirect("/cart");
  } else {
    product = await Product.findByPk(prodId);
    if (product) {
      await cart.addProduct(product, { through: { quantity: newQuantity } });
      res.redirect("/cart");
    }
  }
  Product.findByPk(prodId)
    .then((product) => {
      //Cart.addProduct(prodId, product.dataValues.price);
      
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = async(req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  const product = await cart.getProducts({where: {id: prodId}})
  await product[0].cartItem.destroy()
  res.redirect("/cart");
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({include: ['products']})
  //console.log(orders)
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders
  });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };

exports.postCreateOrder = async(req, res, next)=>{
  const cart = await req.user.getCart()
  const products = await cart.getProducts()
  const order = await req.user.createOrder()
  await order.addProducts(products.map(product => {
     product.orderItem = { quantity: product.cartItem.quantity }
     return product
   }))
  await cart.setProducts(null)
  res.redirect('/orders')
}