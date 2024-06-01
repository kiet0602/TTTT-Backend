const nodemailer = require("nodemailer");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const User = require("../models/User");

class OrderController {
  async createOrder(req, res) {
    const { userId, orderFromCart, orderDetails } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { email } = user;
      if (orderFromCart) {
        // Tìm giỏ hàng của người dùng
        const userCart = await Cart.findOne({ user_id: userId });
        if (!userCart) {
          return res.status(404).json({ message: "Cart not found" });
        }
        // Kiểm tra số lượng sản phẩm trong giỏ hàng và số lượng sản phẩm có sẵn trong kho
        for (const item of userCart.items) {
          const { product_id, quantity } = item;
          const product = await Product.findById(product_id);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          if (quantity > product.quantity) {
            return res
              .status(400)
              .json({ message: "Not enough quantity for product" });
          }
        }
        // Tạo đơn hàng mới
        const newOrder = new Order({
          user_id: userId,
          status: "Pending", // Ví dụ: trạng thái ban đầu là "Pending"
        });
        // Lưu đơn hàng mới
        const savedOrder = await newOrder.save();
        let totalPrice = 0;
        // Lưu chi tiết đơn hàng và xóa sản phẩm từ giỏ hàng
        for (const item of userCart.items) {
          const { product_id, quantity } = item;
          // Tìm thông tin sản phẩm
          const product = await Product.findById(product_id);
          // Tính tổng giá trị của sản phẩm
          const productTotalPrice = product.price * quantity;
          totalPrice += productTotalPrice;
          // Tạo chi tiết đơn hàng từ sản phẩm trong giỏ hàng
          const newOrderDetail = new OrderDetail({
            order_id: savedOrder._id,
            product_id,
            quantity,
            unit_price: product.price, // Lưu giá của sản phẩm vào chi tiết đơn hàng
          });
          // Lưu chi tiết đơn hàng
          await newOrderDetail.save();
          // Cập nhật số lượng sản phẩm trong kho
          product.quantity -= quantity;
          await product.save();
          // Xóa sản phẩm đã đặt hàng khỏi giỏ hàng
          await Cart.updateOne(
            { _id: userCart._id },
            { $pull: { items: { product_id } } }
          );
        }
        // Cập nhật tổng giá vào đơn hàng
        savedOrder.total_price = totalPrice;
        await savedOrder.save();
        const orderController = new OrderController();
        await orderController.sendConfirmationEmail(email);
        return res
          .status(200)
          .json({ message: "Order successfully", data: savedOrder });
      } else {
        // Order trực tiếp sản phẩm
        let totalPrice = 0;
        // Lưu đơn hàng mới
        const newOrder = new Order({
          user_id: userId,
          status: "Pending", // Ví dụ: trạng thái ban đầu là "Pending"
        });
        const savedOrder = await newOrder.save();
        // Kiểm tra số lượng sản phẩm trong kho trước khi đặt hàng
        for (const detail of orderDetails) {
          const { product_id, quantity } = detail;
          const product = await Product.findById(product_id);

          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          if (quantity > product.quantity) {
            return res
              .status(400)
              .json({ message: "Not enough quantity for product" });
          }
          // Tính tổng giá trị của sản phẩm
          const productTotalPrice = product.price * quantity;
          totalPrice += productTotalPrice;
        }
        // Lưu chi tiết đơn hàng
        for (const detail of orderDetails) {
          const { product_id, quantity, unit_price } = detail;
          const newOrderDetail = new OrderDetail({
            order_id: savedOrder._id,
            product_id,
            quantity,
            unit_price,
          });
          await newOrderDetail.save();
          // Cập nhật số lượng sản phẩm trong kho
          const product = await Product.findById(product_id);
          product.quantity -= quantity;
          await product.save();
        }
        // Cập nhật tổng giá vào đơn hàng
        savedOrder.total_price = totalPrice;
        await savedOrder.save();
        const orderController = new OrderController();
        await orderController.sendConfirmationEmail(email);
        return res
          .status(200)
          .json({ message: "Order successfully", data: savedOrder });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async sendConfirmationEmail(email) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: '"TTTT-Shop 👻" <foo@example.com>',
        to: email,
        subject: "Xác nhận đặt hàng thành công ✔",
        text: "Cảm ơn bạn đã đặt hàng từ TTTT-Shop!",
        html: "<b>Cảm ơn bạn đã đặt hàng từ TTTT-Shop!</b>",
      });
      console.log("Email confirmation sent successfully.");
    } catch (error) {
      console.log("Error sending email confirmation:", error.message);
    }
  }

  async getAllOrdersByUserId(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const orders = await Order.find({ user_id: userId });
      const ordersWithDetails = [];
      for (const order of orders) {
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price"); // Populate thêm thông tin sản phẩm

        const orderWithDetails = {
          ...order._doc,
          orderDetails: orderDetails.map((detail) => ({
            _id: detail._id,
            product_id: detail.product_id._id,
            product_name: detail.product_id.name,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
          })),
        };
        ordersWithDetails.push(orderWithDetails);
      }

      return res.status(200).json({
        message: "Orders retrieved successfully",
        data: ordersWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      // Tìm tất cả các đơn hàng
      const orders = await Order.find();

      // Tạo một mảng để chứa tất cả các đơn hàng cùng với chi tiết đơn hàng của chúng
      const ordersWithDetails = [];

      for (const order of orders) {
        // Tìm tất cả các chi tiết đơn hàng tương ứng với order_id
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price"); // Populate thêm thông tin sản phẩm

        // Kết hợp đơn hàng và chi tiết đơn hàng
        const orderWithDetails = {
          ...order._doc,
          orderDetails: orderDetails.map((detail) => ({
            _id: detail._id,
            product_id: detail.product_id._id,
            product_name: detail.product_id.name,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
          })),
        };

        ordersWithDetails.push(orderWithDetails);
      }

      return res.status(200).json({
        message: "All orders retrieved successfully",
        data: ordersWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
