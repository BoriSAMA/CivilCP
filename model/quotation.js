const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quotation', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NAME: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ID_USER: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'ID'
      }
    },
    TOTAL_DIRECT: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PRC_ADMIN: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ADMIN: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PRC_UNEXPECTED: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UNEXPECTED: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PRC_UTILITY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UTILITY: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    PRC_IVA: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IVA: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    TOTAL: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'quotation',
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
        name: "ID_USER",
        using: "BTREE",
        fields: [
          { name: "ID_USER" },
        ]
      },
      {
        name: "ID_USER_2",
        using: "BTREE",
        fields: [
          { name: "ID_USER" },
        ]
      },
    ]
  });
};
