const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('item_list', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NAME: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    MEASSURE_UNIT: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    PERFORMANCE: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    DESCRIPTION: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    COST: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ID_ACT_GRP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'activity_group',
        key: 'ID'
      }
    },
    ID_CONTENT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'content',
        key: 'ID'
      }
    },
    ID_USER: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'item_list',
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
        name: "ID_ACT_GRP",
        using: "BTREE",
        fields: [
          { name: "ID_ACT_GRP" },
        ]
      },
      {
        name: "ID_CONTENT",
        using: "BTREE",
        fields: [
          { name: "ID_CONTENT" },
        ]
      },
      {
        name: "ID_USER",
        using: "BTREE",
        fields: [
          { name: "ID_USER" },
        ]
      },
    ]
  });
};
