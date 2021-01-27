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
      type: DataTypes.STRING(120),
      allowNull: false
    },
    PREFIX: {
      type: DataTypes.STRING(10),
      allowNull: false
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
        name: "ID_CHP_GRP",
        using: "BTREE",
        fields: [
          { name: "ID_CHP_GRP" },
        ]
      },
    ]
  });
};
