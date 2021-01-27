const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TOTAL_DURATION: {
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
    tableName: 'schedule',
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
        name: "ID_QUOTE",
        using: "BTREE",
        fields: [
          { name: "ID_QUOTE" },
        ]
      },
    ]
  });
};
