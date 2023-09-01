'use strict';
import { HasMany, Model } from 'sequelize';

interface availabilitiesAttributes{
  week_day:number,
  start_hour:Date,
  end_hour:Date
}

module.exports = (sequelize: any, DataTypes: { NUMBER: any; TIME: any; }) => {
    class Availability extends Model<availabilitiesAttributes> implements availabilitiesAttributes{
        week_day!: number;
        start_hour!:Date;
        end_hour!:Date;
    }

    Availability.init(
      {
          week_day: {
              type: DataTypes.NUMBER,
              allowNull: false,
              validate: {
                  notNull: { msg: "Le jour de la semaine doit être indiqué" },
                  isNumeric: { msg: "Veuillez entrer une valeur numérique pour le jour de la semaine (1 à 7)" },
              }
          },
          start_hour: {
              type: DataTypes.TIME,
              allowNull: false,
              validate: {
                  notNull: { msg: "L'heure de début doit être indiquée" },
                  is: {
                      args: /^(?:[01]\d|2[0-3]):(?:[0-5]\d)(:[0-5]\d){0,1}$/,
                      msg: "L'heure de début doit être une date valide (hh:mm:hh ou hh:mm)" 
                  },
              }
          },
          end_hour: {
              type: DataTypes.TIME,
              allowNull: false,
              validate: {
                  notNull: { msg: "L'heure de fin doit être indiquée" },
                  is: {
                      args: /^(?:[01]\d|2[0-3]):(?:[0-5]\d)(:[0-5]\d){0,1}$/,
                      msg: "L'heure de fin doit être une date valide (hh:mm:hh ou hh:mm)" 
                },
            }
          }
      }, 
      {
        sequelize,
        modelName: 'Availability',
        tableName: 'availabilities'
      }
    )

    return Availability;
};