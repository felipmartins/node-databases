const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    userId: {
      type: DataTypes.STRING(24),
    },
    email: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  });

  const OrderItem = sequelize.define("OrderItem", {
    sku: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
  });

  Order.hasMany(OrderItem);
  OrderItem.belongsTo(Order, {
    onDelete: "CASCADE",
    foreingKey: {
      allowNull: false,
    },
  });
  sequelize.sync();
};
