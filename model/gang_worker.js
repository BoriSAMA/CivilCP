const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gang_worker', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GANG_CHAR: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    ID_RANK: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rank',
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
    },
    ID_WORKER: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'worker',
        key: 'ID'
      }
    },
    ID_SALARY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salary',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'gang_worker',
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
        name: "ID_WORKER",
        using: "BTREE",
        fields: [
          { name: "ID_WORKER" },
        ]
      },
      {
        name: "ID_GANG",
        using: "BTREE",
        fields: [
          { name: "ID_GANG" },
        ]
      },
      {
        name: "ID_RANK",
        using: "BTREE",
        fields: [
          { name: "ID_RANK" },
        ]
      },
      {
        name: "ID_SALARY",
        using: "BTREE",
        fields: [
          { name: "ID_SALARY" },
        ]
      },
    ]
  });
};
