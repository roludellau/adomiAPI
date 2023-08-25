'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('users', [
            
      //Tous les champs sont désormais en snake_case

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

      /** */
      {
        first_name: 'Odette',
        last_name: 'Rimand',
        email: 'odettesuper@yahoo.fr',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'odette.rimant',
        phone:'0688461975',
        street_name:'rue Coche',
        street_number: '83',
        post_code: '22',
        city:'senfran-cisequeau',
        id_role: '1',
        id_agency: '1'
      },
      {
        first_name: 'Omer',
        last_name: 'Dhalorr',
        email: 'omsd@outlook.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'omer.dhalorr',
        phone:'0788114661',
        street_name:'Boulevard Mitterand',
        street_number: '278',
        post_code: '44130',
        city:'Losses-en-gelès',
        id_role: '2',
        id_agency: '1'
      },
      {
        first_name: 'Salah',
        last_name: 'Nesser-Harïen',
        email: 's.nesser@outlook.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'Salah.nesserharien',
        phone:'0614176604',
        street_name:'Rue de la Côté Blanche',
        street_number: '4',
        post_code: '27810',
        city:'Marcilly-sur-Eure',
        id_role: '3',
        id_agency: '1'
      },

      /** */

      {
        first_name: 'Alec',
        last_name: 'Once-Aoseutou',
        email: 'alec@gmail.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'alec.once',
        phone:'0785161499',
        street_name:'rue du parc',
        street_number: '12',
        post_code: '78440',
        city:'Issou',
        id_role: '2',
        id_agency: '1'
      },
      {
        first_name: 'Sandra',
        last_name: 'Monlimegrât',
        email: 'sandra.monlimegrat@gmai.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'sandra.monlimegrat',
        phone:'0673435052',
        street_name:'rue creuse',
        street_number: '10',
        post_code: '78610',
        city:'Auffargis',
        id_role: '3',
        id_agency: '1'
      },

      /** */
      
      {
        first_name: 'Raymond',
        last_name: 'Saint-Michel',
        email: 'raymond.50.sm@gmail.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'raymond.saintmichel',
        phone:'0607898410',
        street_name:'Rte du Pré au Moine',
        street_number: '7',
        post_code: '35610',
        city:'Roz-sur-Couesnon',
        id_role: '1',
        id_agency: '3'
      },
      {
        first_name: 'Mikhail',
        last_name: 'Sardovitch',
        email: 'mikhailpoccr@gmail.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'mikhail.sardovitch',
        phone:'0618075454',
        street_name:' Av. du Cers',
        street_number: '44',
        post_code: '11620',
        city:'Villemoustaussou',
        id_role: '2',
        id_agency: '3'
      },
      {
        first_name: 'Genko',
        last_name: 'Ishida',
        email: 'genko@gmail.com',
        //Mdp1234*
        password:'$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$1jZr6vFLXQK3qPg/K35Low',
        user_name:'genko.ishida',
        phone:'0655123490',
        street_name:'route du scarabé',
        street_number: '42',
        post_code: '00113',
        city:'Pan-sur-Lière',
        id_role: '3',
        id_agency: '3'
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
