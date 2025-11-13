const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images:[{url: String , public_id: String}],
    sku: { type: String, unique: true },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to generate SKU if not provided
ProductSchema.pre('save', function (next) {
  if (!this.sku) {
    const titlePart = this.title.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-5);
    this.sku = `${titlePart}-${timestamp}`;
  }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
