import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function CreateProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user

    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            filename: file.originalname
        })
    }));

    const product = await ProductModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        images,
        seller: seller._id
    });

    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    });
}

export async function GetProducts(req, res) {
    const seller = req.user
    const products = await ProductModel.find({ seller: seller._id });
    console.log(products);
    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    });
}

export async function GetAllProducts(req, res) {
    const products = await ProductModel.find();
    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    });
}

export async function GetProductDetails(req, res) {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        product
    });
}

export async function createProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await ProductModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;
    const images = [];
    if (files && files.length !== 0) {
        const uploadedImages = await Promise.all(files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                filename: file.originalname
            });
        }));
        images.push(...uploadedImages);
    }

    const price = req.body.priceAmount;
    const stock = req.body.stock;
    const attributes = JSON.parse(req.body.attributes || "{}")

    product.variants.push({
        images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })

}

export async function DeleteProduct(req, res) {
    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);
    res.status(200).json({
        message: "Product deleted successfully",
        success: true,
        product
    });
}

