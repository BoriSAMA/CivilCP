const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('predecessor_type', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NAME: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PREFIX: {
      type: DataTypes.STRING(5),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'predecessor_type',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
