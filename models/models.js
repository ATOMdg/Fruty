const sequelize = require('../db')
const{DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},

})

const Type = sequelize.define('type', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Place = sequelize.define('place', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
  img: {type: DataTypes.STRING, allowNull: false},
  typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'types',
          key: 'id'
      }
  }
}, {
  tableName: 'places'
});



const PlaceInfo = sequelize.define('placeInfo', { 
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  description: {type: DataTypes.TEXT, allowNull: false}  
}, {
  tableName: 'place_infos' 
});


User.hasOne(Place)
Place.belongsTo(User)

Type.hasMany(Place)
Place.belongsTo(Type)

Place.hasMany(PlaceInfo, {as: 'info', foreignKey: 'placeId'})
PlaceInfo.belongsTo(Place)

module.exports = {
    User,
    Type,
    Place,
    PlaceInfo,   
}