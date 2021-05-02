const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule_activity', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DURATION: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    START_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    FINISH_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ID_QOU_ACT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quote_activity',
        key: 'ID'
      }
    },
    ID_PRE_ACT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'schedule_activity',
        key: 'ID'
      }
    },
    ID_SCHEDULE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedule',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'schedule_activity',
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
        name: "ID_QOU_ACT",
        using: "BTREE",
        fields: [
          { name: "ID_QOU_ACT" },
        ]
      },
      {
        name: "ID_PRE_ACT",
        using: "BTREE",
        fields: [
          { name: "ID_PRE_ACT" },
        ]
      },
      {
        name: "ID_SCHEDULE",
        using: "BTREE",
        fields: [
          { name: "ID_SCHEDULE" },
        ]
      },
    ]
  });
};
