const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activity', {
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
    ID_ACT_GRP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'activity_group',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'activity',
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
        name: "ID_ACT_GRP",
        using: "BTREE",
        fields: [
          { name: "ID_ACT_GRP" },
        ]
      },
    ]
  });
};
