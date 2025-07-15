module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      player1Id: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
      player2Id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      currentPlayer: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      boardState: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [...Array(5)].map(() => Array(5).fill(null)),
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "waiting",
      },
    },
    {
      timestamps: true,
    }
  );

  // Association
  Room.belongsTo(sequelize.models.User, {
    as: "Player1",
    foreignKey: "player1Id",
  });
  Room.belongsTo(sequelize.models.User, {
    as: "Player2",
    foreignKey: "player2Id",
  });

  return Room;
};
