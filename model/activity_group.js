const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activity_group', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NAME: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    PREFIX: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "PREFIX"
    },
    ID_CHP_GRP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chapter_group',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'activity_group',
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
        name: "PREFIX",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PREFIX" },
        ]
      },
      {
        name: "ID_CHP_GRP",
        using: "BTREE",
        fields: [
          { name: "ID_CHP_GRP" },
        ]
      },
    ]
  });
};
