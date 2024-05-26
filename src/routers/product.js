const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/ProductController");

router.post("/", productController.createProduct);
router.get("/", productController.getAllProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
