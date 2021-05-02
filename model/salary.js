const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salary', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    VALUE: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    MULTIPLIER: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: "MULTIPLIER"
    },
    TRANSPORT_SUBSIDY: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ENDOWMENT: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SAFETY_EQUIPMENT: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ANNUAL_CALENDAR_HOURS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ANNUAL_WORKING_HOURS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TOTAL_ANNUAL_EFFECTIVE_HOURS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DAILY_VALUE: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    HOURLY_VALUE: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'salary',
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
        name: "MULTIPLIER",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MULTIPLIER" },
        ]
      },
    ]
  });
};
