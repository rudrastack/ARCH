import { body, validationResult } from 'express-validator';

function validateRequest(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     return res.status(400).json({
         message: "Validation failed",
         errors: errors.array()
     })
    }
    next();
}
export const CreateProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").isNumeric().withMessage("Price is required"),
    body("priceCurrency").notEmpty().withMessage("Currency is required"),
    validateRequest
]
