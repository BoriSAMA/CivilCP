const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quote_activity', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CUSTOM_NAME: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    QUOTE_NUMBER: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    MEASSURE_UNIT: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    QUANTITY: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    TOTAL: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ID_QUO_CHP: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quote_chapter',
        key: 'ID'
      }
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
    tableName: 'quote_activity',
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
        name: "IC_QUO_CHP",
        using: "BTREE",
        fields: [
          { name: "ID_QUO_CHP" },
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
