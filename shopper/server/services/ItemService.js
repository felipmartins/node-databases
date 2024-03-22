const ItemModel = require("../models/mongoose/Item.js");

class ItemService {
  static async getAll() {
    return ItemModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(itemId) {
    return ItemModel.findById(itemId).exec();
  }

  static async create(itemData) {
    const item = new ItemModel(itemData);
    return item.save();
  }

  static async update(itemId, itemData) {
    return ItemModel.findByIdAndUpdate(itemId, itemData).exec();
  }

  static async remove(itemId) {
    return ItemModel.deleteOne({ _id: itemId }).exec();
  }
}

module.exports = ItemService;
