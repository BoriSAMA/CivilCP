const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quote_chapter', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CUSTOM_NAME: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    QUOTE_NUMBER: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ID_QUO_CHP_GRP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quote_chp_grp',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'quote_chapter',
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
        name: "ID_QUO_CHP_GRP",
        using: "BTREE",
        fields: [
          { name: "ID_QUO_CHP_GRP" },
        ]
      },
    ]
  });
};
