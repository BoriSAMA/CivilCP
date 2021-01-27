const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gang', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DESCRIPTION: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ID_APU_CONTENT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'apu_content',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'gang',
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
        name: "ID_APU_CONTENT",
        using: "BTREE",
        fields: [
          { name: "ID_APU_CONTENT" },
        ]
      },
    ]
  });
};
