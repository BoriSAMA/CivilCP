const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('worker', {
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
    CC: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    PHONE: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    SKILL: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ID_RANK: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rank',
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
    tableName: 'worker',
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
        name: "ID_RANK",
        using: "BTREE",
        fields: [
          { name: "ID_RANK" },
        ]
      },
    ]
  });
};
