'use strict';
import { Model } from 'sequelize';

interface GeneralRequestsAttr {
    id: number
    request_string: string	
    user_id: number
    done: boolean
    created_at: string        
}

module.exports = (sequelize: any, DataTypes: any) => {
    
    class GeneralRequests extends Model<GeneralRequestsAttr> implements GeneralRequestsAttr {
        id!: number
        request_string!: string	
        user_id!: number
        done!: boolean
        created_at!: string        

        static associate(models: any) {
            GeneralRequests.hasOne(models.User)
        }
    }

    GeneralRequests.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            request_string: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
            done: DataTypes.BOOLEAN,
            created_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'GeneralRequests',
            tableName: 'general_requests',
            timestamps: false
        }
    )
        
  return GeneralRequests;
}