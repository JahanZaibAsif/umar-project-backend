const Product = require('../model/product');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret, 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce', 
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage: storage });

const upload_profile = upload.single('product_picture'); 

const create_prodcut_api = async (req, res) => {
  try {
    upload_profile(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: 'Multer error', error: err });
      } else if (err) {
        return res.status(500).json({ success: false, message: 'Unknown error', error: err });
      }

      const { product_name, product_price, product_detail ,product_quantity} = req.body;
      const product_picture = req.file.path; 

      const newProduct = await Product.create({
        product_name,
        product_price,
        product_detail,
        product_quantity,
        product_picture,
      });

      res.json({ success: true, data: newProduct });
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};


const fetch_product = async (req,res)=>{
    const product = await Product.find();
    res.json(product);
}
const delete_product = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.product_picture) {
      const url = new URL(product.product_picture);
      const pathSegments = url.pathname.split('/');
      const public_id = pathSegments.slice(-2).join('/').split('.')[0];



      await cloudinary.uploader.destroy(public_id, function (error, result) {
        if (error) {
          console.error('Error deleting image from Cloudinary:', error);
        } else {
          console.log('Cloudinary deletion result:', result);
        }
      });
    }

    await Product.findByIdAndDelete(id);

    res.json({ success: true, message: 'Product and associated image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const updatedProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, product_price, product_detail } = req.body;
  const product_picture = req.file;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.product_name = product_name;
    product.product_price = product_price;
    product.product_detail = product_detail;

    // If a new picture is provided, handle image replacement
    if (product_picture) {
      // Delete the existing image from Cloudinary
      if (product.product_picture) {
        const public_id = product.product_picture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(public_id)      }

      // Save new image details
      product.product_picture = product_picture.path;
    }

    console.log('Saving updated product:', product);

    // Save updated product to the database
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {
  create_prodcut_api,
  fetch_product,
  delete_product,
  updatedProduct,
  upload_profile
};
