'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('general_requests', [
        {
            request_string: "Bonjour, je souhaiterais annuler mon rdv du mercredi 30 août en raison d'un empêchement. Cordialement.",
            user_id: 1,
            referrer_id: null,
            done: false,
        },
        {
            request_string: "Bonjour, je pourrais connaitre vos prix svp ?",
            user_id: null,
            referrer_id: null,
            done: false,
        },
        {
            request_string: "Salut dis la mamie là elle me dit qu'elle veut décaler le rdv de samedi. Je fais quoi y'a une procédure ? faut que je remplisse un truc ou quoi",
            user_id: 6,
            referrer_id: null,
            done: false,
        },
        {
            request_string: "Quelqu'un pourrait changer le filtre de la machine à café ? Je peux pas perso je suis charrette, overbooké de ouf.",
            user_id: 5,
            referrer_id: null,
            done: false,
        },
        {
            request_string: "Bonjour, je vous contacte car j'aimerais qu'un de vos auxiliaires puisse venir mardi prochain, dans l'après-midi, pour s'occuper de mon jardin.",
            user_id: 9,
            referrer_id: null,
            done: false,
        },
    ])
  },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('missions', null, {});
    }

}
