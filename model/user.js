const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CODE: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "CODE"
    },
    NAME: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    SUPERUSER: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    PASWORD: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    MAIL: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "MAIL"
    }
  }, {
    sequelize,
    tableName: 'user',
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
        name: "CODE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CODE" },
        ]
      },
      {
        name: "MAIL",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MAIL" },
        ]
      },
    ]
  });
};
