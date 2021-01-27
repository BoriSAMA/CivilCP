const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sch_act_gang', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_SCH_ACT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedule_activity',
        key: 'ID'
      }
    },
    ID_GANG: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'gang',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'sch_act_gang',
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
        name: "ID_SCH_ACT",
        using: "BTREE",
        fields: [
          { name: "ID_SCH_ACT" },
        ]
      },
      {
        name: "ID_GANG",
        using: "BTREE",
        fields: [
          { name: "ID_GANG" },
        ]
      },
    ]
  });
};
