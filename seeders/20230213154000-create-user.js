'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('users', [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'example@example.com',
        //pwdtest
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$86yZubj6lQo11awuQi+j5g',
        user_name:'johndoeusername',
        phone:'0610101010',
        street_name:'rue Jean Jaures',
        street_number:'3',
        post_code:'78000',
        city:'Versailles',
        id_role: '1',
        id_agency: '2'
      },
      {
        first_name: 'Edouard',
        last_name: 'Murlepert',
        email: 'EdMur@caramail.fr',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'edouard.murlepert',
        phone:'0645117832',
        street_name:'rue des plomberies',
        street_number:'14',
        post_code:'78530',
        city:'Buc',
        id_role: '2',
        id_agency: '2'
      },
      {
        first_name: 'Marie',
        last_name: 'Droupeter',
        email: 'Marie333@gmail.com',
        //bliyvfh35!
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$x6QsANDDhAUvQRhcR8EF4A',
        user_name:'marie.Ddoupeter',
        phone:'0746007730',
        street_name:'Avenue de la chasse',
        street_number:'80',
        post_code:'78000',
        city:'versailles',
        id_role: '3',
        id_agency: '2'
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
