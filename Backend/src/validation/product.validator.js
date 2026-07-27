import {body, validationResult} from 'express-validator';

function validateRequest(req, res, next) {
  
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const extractedErrors = errors.array();
    return res.status(400).json({
      message: extractedErrors[0].msg,
      errors: extractedErrors,
    });
  }
  next();
}
export const CreateProductValidator =  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").notEmpty().withMessage("Price is required"),
    body("priceCurrency").notEmpty().withMessage("Currency is required"),
    validateRequest               
]
   