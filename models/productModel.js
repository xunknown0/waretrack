const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref:"Category" },

    image: {
      data: Buffer,
      contentType: String,
    },
    imageHash: { type: String }, // Store MD5 hash of the image
    sku: { type: String, unique: true }, // Auto-generated SKU
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// === Compound unique index for strong duplication prevention ===
productSchema.index(
  { title: 1, price: 1, description: 1, imageHash: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } } // case-insensitive
);

// === Pre-save hook to generate SKU ===
productSchema.pre("save", function (next) {
  if (!this.sku) {
    const titlePart = this.title.replace(/\s+/g, "").substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-5);
    this.sku = `${titlePart}-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
