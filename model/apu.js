const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('apu', {
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
    ID_QUO_ACT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quote_activity',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'apu',
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
        name: "ID_QUO_ACT",
        using: "BTREE",
        fields: [
          { name: "ID_QUO_ACT" },
        ]
      },
    ]
  });
};
