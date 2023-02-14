'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'example@example.com',
        //pwdtest
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$86yZubj6lQo11awuQi+j5g',
        userName:'johndoeusername',
        phone:'0610101010',
        street_name:'rue Jean Jaures',
        street_number:'3',
        post_code:'78000',
        city:'Versailles',
        idRole: '1',
        idAgency: '2'
      },
      {
        firstName: 'Edouard',
        lastName: 'Murlepert',
        email: 'EdMur@caramail.fr',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        userName:'edouard.murlepert',
        phone:'0645117832',
        street_name:'rue des plomberies',
        street_number:'14',
        post_code:'78530',
        city:'Buc',
        idRole: '2',
        idAgency: '2'
      },
      {
        firstName: 'Marie',
        lastName: 'Droupeter',
        email: 'Marie333@gmail.com',
        //bliyvfh35!
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$x6QsANDDhAUvQRhcR8EF4A',
        userName:'marie.Ddoupeter',
        phone:'0746007730',
        street_name:'Avenue de la chasse',
        street_number:'80',
        post_code:'78000',
        city:'versailles',
        idRole: '3',
        idAgency: '2'
      },
  ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('users', null, {});
  }
}
