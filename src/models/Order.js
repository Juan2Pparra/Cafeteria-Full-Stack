const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nombre: String,
  precio: Number,
  cantidad: { type: Number, default: 1 },
  azucar: { type: Boolean, default: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  customer: {
    nombre: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    referencia: { type: String }
  },

  items: [orderItemSchema],
  total: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
