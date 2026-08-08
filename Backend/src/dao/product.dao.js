import ProductModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
    const product = await ProductModel.findOne({
        _id: productId,
        "variants._id": variantId
    });
    const stock = product.variants.find((v) => v._id.toString() === variantId).stock;
    return stock;
};