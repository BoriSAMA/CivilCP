const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('apu_item', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TOTAL: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    CUSTOM_PERFORMANCE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CUSTOM_DESCRIPTION: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    QUANTITY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ID_ITEM: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item_list',
        key: 'ID'
      }
    },
    ID_APU_CONTENT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'apu_content',
        key: 'ID'
      }
    },
    ID_SALARY: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'salary',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'apu_item',
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
      {
        name: "ID_SALARY",
        using: "BTREE",
        fields: [
          { name: "ID_SALARY" },
        ]
      },
      {
        name: "ID_APU_CONTENT",
        using: "BTREE",
        fields: [
          { name: "ID_APU_CONTENT" },
        ]
      },
      {
        name: "ID_ITEM",
        using: "BTREE",
        fields: [
          { name: "ID_ITEM" },
        ]
      },
    ]
  });
};
