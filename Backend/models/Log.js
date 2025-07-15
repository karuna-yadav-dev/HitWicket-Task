module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    "Log",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      roomId: {
        type: DataTypes.UUID,
        references: {
          model: "Rooms",
          key: "id",
        },
      },
      playerId: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
      character: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      from: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      to: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  // Association
  Log.belongsTo(sequelize.models.Room, { foreignKey: "roomId" });
  Log.belongsTo(sequelize.models.User, { foreignKey: "playerId" });

  return Log;
};
