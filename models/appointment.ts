export { }
// Import the built-in data types
'use strict';
const {
	Model
} = require('sequelize');

export type AppointmentInterface = {
	date: string
	startHour: string
	endHour: string
	streetName: string
	streetNumber: number
	postCode: string
	city: string
	idMission: string
	[key: string]: (string | number | {[key:string]:string})
}

module.exports = (sequelize: any, DataTypes: { DATEONLY: any; TIME: any; STRING: any; INTEGER: any; }) => {

	class Appointment extends Model implements AppointmentInterface {

		date!: string
		startHour!: string
		endHour!: string
		streetName!: string
		streetNumber!: number
		postCode!: string
		city!: string
		idMission!: string

		static associate(models: any) {
			Appointment.belongsTo(models.User, {
				as: 'carer',
				foreignKey: 'idCarer'
			})
			Appointment.belongsTo(models.Mission, {
				as: 'mission',
				foreignKey: 'idMission'
			})
		}
	}

	Appointment.init({
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				isDate: true,
				notNull: {
					msg: "Veuillez renseigner une date"
				}
			}
		},

		startHour: {
			type: DataTypes.TIME,
			allowNull: true,
			validate: {
				isNumeric: true,
			}
		},

		endHour: {
			type: DataTypes.TIME,
			allowNull: true,
			validate: {
				isNumeric: true,
			}
		},

		streetName: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isAlpha: {
					msg: "Veuillez indiquer un nom de rue valide"
				},
			}
		},

		streetNumber: {
			type: DataTypes.INTEGER,
			allowNull: true,
			validate: {
				isNumeric: {
					msg: "Indiquer un numéro valide",
				},
			}
		},

		postCode: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isNumeric: {
					msg: "Indiquer un code postal valide"
				},
				len: {
					args: [5, 5],
					msg: "Code postal à 5 chiffres !"
				}
			}
		},

		city: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
			}
		},

		idCarer: {
			type: DataTypes.INTEGER,
			validate : {
                isNumeric: {
                    msg:"Veuillez entrer un id numérique pour le carer lié à ce rdv."
                }
			}
		},

		idMission: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: {
					msg: "Veuillez indiquer un id de mission"
				}
			}
		}

	},
		{
			sequelize,
			modelName: 'Appointment',
			tableName: 'appointments',
			timestamps: false
		});

	return Appointment;
};