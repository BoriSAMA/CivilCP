const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('apu_content', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TOTAL: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ID_APU: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'apu',
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
    }
  }, {
    sequelize,
    tableName: 'apu_content',
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
        name: "ID_APU",
        using: "BTREE",
        fields: [
          { name: "ID_APU" },
        ]
      },
      {
        name: "ID_CONTENT",
        using: "BTREE",
        fields: [
          { name: "ID_CONTENT" },
        ]
      },
    ]
  });
};
