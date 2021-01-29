const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quote_chp_grp', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    QUOTE_NUMBER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CUSTOM_NAME: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    ID_CHP_GRP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chapter_group',
        key: 'ID'
      }
    },
    ID_QUOTE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quotation',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'quote_chp_grp',
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
        name: "ID_CHP_GRP",
        using: "BTREE",
        fields: [
          { name: "ID_CHP_GRP" },
        ]
      },
      {
        name: "ID_QUOTE",
        using: "BTREE",
        fields: [
          { name: "ID_QUOTE" },
        ]
      },
    ]
  });
};
