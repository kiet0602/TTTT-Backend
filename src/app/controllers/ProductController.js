const multer = require("multer");
const Product = require("../models/Product");
const storage = require("../../services/uploadImage");
const Category = require("../models/Category");


class ProductController {
  async createProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          console.log(req.body);
          const name = req.body.name;
          const description = req.body.description;
          const price = parseInt(req.body.price, 10);
          const quantity = parseInt(req.body.quantity, 10);
          const category_id = req.body.category_id;
          const image = req.file.originalname;
          const specifications = req.body.specifications || null;
          const cpu_type = req.body.cpu_type || null;
          const ram = req.body.ram || null;
          const storage_capacity = req.body.storage_capacity || null;
          const screen_size = req.body.screen_size || null;
          const graphics = req.body.graphics || null;
          const connectivity = req.body.connectivity || null;
          const mouse_keyboard = req.body.mouse_keyboard || null;
          const size = req.body.size || null;
          const weight = req.body.weight || null;
          const color = req.body.color || null;
          const warranty = req.body.warranty || null;
          const other_features = req.body.other_features || null;
          const manufacturer = req.body.manufacturer || null;
          const model = req.body.model || null;
          const screenType = req.body.screenType || null;
          const brightness = req.body.brightness || null;
          const contrastRatio = req.body.contrastRatio || null;
          const screenSize = req.body.screenSize ||null;
          const panelType = req.body.panelType || null;
          const viewingAngle = req.body.viewingAngle || null;
          const responseTime = req.body.responseTime || null;
          const aspectRatio = req.body.aspectRatio || null;
          const refreshRate = req.body.refreshRate || null;
          const recommendedResolution = req.body.recommendedResolution || null;
          const review = req.body.review || null;
          const mainboard = req.body.mainboard || null;
          const radiators = req.body.radiators || null;
          const hardDrive = req.body.hardDrive || null;
          const card = req.body.card || null;
          const caseTower = req.body.caseTower ||  null;
          const psu = req.body.psu || null;
          const material = req.body.material || null;
          const high = req.body.high || null;
          const mouseType = req.body.mouseType || null;
          const untilities = req.body.untilies || null;
          const ergonomics = req.body.ergonomics || null;
          const requestSystem = req.body.requestSystem || null;
          const guarantee = req.body.guarantee || null;
          const keyboardType = req.body.keyboardType || null;
          const hearType = req.body.hearType || null;

          const existingProduct = await Product.findOne({ name });
          if (category_id) {
            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
              return res.status(400).json({ message: "Invalid category_id" });
            }
          }
          if (existingProduct) {
            existingProduct.quantity += quantity;
            await existingProduct.save();
            return res.json({
              message: "Product updated successfully",
              data: existingProduct,
            });
          } else {
            const newProduct = new Product({
              name,
              description,
              price,
              quantity,
              category_id,
              image,
              specifications,
              // trường chitiet laptop 
              cpu_type, // loai cpu
              ram,  // RAM
              storage_capacity, //lưu trữ
              screen_size, //kích thước màn hình
              graphics, //đồ họa
              
              // cả 2
              connectivity, //kết nối

              mouse_keyboard, 
              size,//kích thước
              weight,//trọng lượng
              color,//màu sắc
              warranty, //bảo hành
              other_features,//các tính năng khác

              // chi tiết của màng hình
              
              manufacturer, //hãng sản xuất
              model, // mã sản phẩm
              screenType, //loại màn hình
              brightness,//độ sáng
              contrastRatio,//độ tương phản
              screenSize,//kích thước màn hình
              panelType,//tấm nén
              viewingAngle,//
              responseTime,//thời gian phản hồi
              aspectRatio,//tỷ lệ màn hình
              refreshRate,//tần số quét
              recommendedResolution,// độ phân giải
             

              review,//bài viết đánh giá

              //PC
              mainboard,
              radiators,
              hardDrive,
              card,
              caseTower,
              psu,

              //Ghế
              material,
              high,

              //Chuột
              mouseType,
              untilities, // tiên ích
              ergonomics, // công thái học
              requestSystem,

              //bàm phím
              keyboardType,
              guarantee,

              //tai nghe
              hearType,
            });
            await newProduct.save();
            return res.status(200).json({
              message: `Category created successfully: ${name}.`,
              data: newProduct,
            });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async getAllProduct(req, res) {
    const searchQuery = req.query.name;
    if (searchQuery) {
      try {
        const products = await Product.find({
          name: { $regex: searchQuery, $options: "i" },
        }).populate("category_id"); // Populate thông tin của nhà xuất bản
        if (products.length > 0) {
          res.json(products);
        } else {
          res.json({ message: "Not found product" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      try {
        const products = await Product.find().populate("category_id"); // Populate thông tin của nhà xuất bản
        res.json({ data: products });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async updateProduct(req, res, next) {
    const upload = multer({ storage: storage }).single("image");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        try {
          const productId = req.params.id;
          const name = req.body.name;
          const description = req.body.description;
          const price = parseInt(req.body.price, 10);
          const quantity = parseInt(req.body.quantity, 10);
          const category_id = req.body.category_id;
          const image = req.file ? req.file.originalname : undefined;
          const specifications = req.body.specifications || null;
          const cpu_type = req.body.cpu_type || null;
          const ram = req.body.ram || null;
          const storage_capacity = req.body.storage_capacity || null;
          const screen_size = req.body.screen_size || null;
          const graphics = req.body.graphics || null;
          const connectivity = req.body.connectivity || null;
          const mouse_keyboard = req.body.mouse_keyboard || null;
          const size = req.body.size || null;
          const weight = req.body.weight || null;
          const color = req.body.color || null;
          const warranty = req.body.warranty || null;
          const other_features = req.body.other_features || null;
          const manufacturer = req.body.manufacturer || null;
          const model = req.body.model || null;
          const screenType = req.body.screenType || null;
          const brightness = req.body.brightness || null;
          const contrastRatio = req.body.contrastRatio || null;
          const screenSize = req.body.screenSize ||null;
          const panelType = req.body.panelType || null;
          const viewingAngle = req.body.viewingAngle || null;
          const responseTime = req.body.responseTime || null;
          const aspectRatio = req.body.aspectRatio || null;
          const refreshRate = req.body.refreshRate || null;
          const recommendedResolution = req.body.recommendedResolution || null;
          const review = req.body.review || null;
          const mainboard = req.body.mainboard || null;
          const radiators = req.body.radiators || null;
          const hardDrive = req.body.hardDrive || null;
          const card = req.body.card || null;
          const caseTower = req.body.caseTower ||  null;
          const psu = req.body.psu || null;
          const material = req.body.material || null;
          const high = req.body.high || null;
          const mouseType = req.body.mouseType || null;
          const untilities = req.body.untilities;
          const ergonomics = req.body.ergonomics || null;
          const requestSystem = req.body.requestSystem || null;
          const guarantee = req.body.guarantee || null;
          const keyboardType = req.body.keyboardType || null;
          const hearType = req.body.hearType || null;

          if (category_id) {
            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) {
              return res.status(400).json({ message: "Invalid category_id" });
            }
          }
          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          if (name) product.name = name;
          if (description) product.description = description;
          if (price) product.price = price;
          if (quantity) product.quantity = quantity;
          if (category_id) product.category_id = category_id;
          if (image) product.image = image;
          if (specifications) product.specifications = specifications;

          if (cpu_type) product.cpu_type = cpu_type;
          if (ram) product.ram = ram;
          if (storage_capacity) product.storage_capacity = storage_capacity;
          if (screen_size) product.screen_size = screen_size;
          if (graphics) product.graphics = graphics;
          if (connectivity) product.connectivity = connectivity;
          if (mouse_keyboard) product.mouse_keyboard = mouse_keyboard;
          if (size) product.size = size;
          if (weight) product.weight = weight;
          if (color) product.color = color;
          if (warranty) product.warranty = warranty;
          if (other_features) product.other_features = other_features;

          if (manufacturer) product.manufacturer = manufacturer;
          if (model) product.models = model;
          if (screenType) product.screenType = screenType;
          if (brightness) product.brightness = brightness;
          if (contrastRatio) product.contrastRatio = constrastRadio;
          if (screenSize) product.screenSize = screenSize;
          if (panelType) product.panelType = panelType;
          if (viewingAngle) product.viewingAngle = viewingAngle;
          if (responseTime) product.responseTime = responseTime;
          if (aspectRatio) product.aspectRatio = aspectRatio;
          if (refreshRate) product.refreshRate = refreshRate;
          if (recommendedResolution) product.recommendedResolution = recommendedResolution;
          

          if (review) product.review = review;

          if (mainboard) product.mainbroad = mainboard;
          if (radiators) product.radiators = radiators;
          if (hardDrive) product.hardDrive = hardDrive;
          if (card) product.card = card;
          if (caseTower) product.caseTower = caseTower;
          if (psu) product.psu = psu;

          if (material) product.material = material;
          if (high) product.high = material;

          if (mouseType) product.mouseType = mouseType;
          if (untilities) product.untilities = untilities;
          if (ergonomics) product.ergonomics = ergonomics;
          if (requestSystem) product.requestSystem = requestSystem;

          if (guarantee) product.guarantee = guarantee;
          if (keyboard) product.keyboardType = keyboardType;

          if (hearType) product.hearType = hearType;
          await product.save();
          return res.status(200).json({
            message: `Product updated successfully: ${product.name}.`,
            data: product,
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({
        message: `Product deleted successfully: ${deletedProduct.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
