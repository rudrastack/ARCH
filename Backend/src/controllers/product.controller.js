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