const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('availavibility', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    START_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FINISH_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ID_SCHEDULE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedule',
        key: 'ID'
      }
    },
    ID_WORKER: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'worker',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'availavibility',
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
        name: "ID_SCHEDULE",
        using: "BTREE",
        fields: [
          { name: "ID_SCHEDULE" },
        ]
      },
      {
        name: "ID_WORKER",
        using: "BTREE",
        fields: [
          { name: "ID_WORKER" },
        ]
      },
    ]
  });
};
