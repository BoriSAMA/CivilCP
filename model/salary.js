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
      type: DataTypes.BIGINT,
      allowNull: false
    },
    MULTIPLIER: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    TRANSPORT_SUBSIDY: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ENDOWMENT: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    SAFETY_EQUIPMENT: {
      type: DataTypes.BIGINT,
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
      type: DataTypes.BIGINT,
      allowNull: true
    },
    HOURLY_VALUE: {
      type: DataTypes.BIGINT,
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
    ]
  });
};
