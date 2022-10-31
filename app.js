const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next)=>{
    User.findByPk(1).then(user=>{
        req.user= user;
        next();
    }).catch(err=> console.log(err))
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem })

Order.belongsToMany(Product, { through: OrderItem })

User.hasMany(Order);
Order.belongsTo(User)

sequelize
  //.sync({force: true})
  .sync()
  .then(() => {
    return User.findByPk(1)
    //app.listen(3001);
  })
  .then(user=>{
    if(!user){
        User.create({
            name: "Jaffer",
            email: "name@example.com"
        })
    }
    return user;
  })
  .then(user=> {
    return user.createCart();
    
  })
  .then(()=>app.listen(3001))
  .catch((err) => console.log(err));
