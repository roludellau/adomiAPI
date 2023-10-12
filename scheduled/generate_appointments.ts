import { CronJob } from 'cron';
import missionController from '../controllers/missionController'
import appointmentController from '../controllers/appointmentController'


async function generate_appointments() {
    const missions = await missionController.not_handler_get_all_missions()
 
    missions.forEach ( async ( mission, index ) => {
        const recurence = mission.recurence!.recurence_type 	
        let dates : string [] = []
        //const missionWeekDay = new Date(mission.startDate).getDay()
        const lastAppointment = await appointmentController.no_handler_get_appointment(mission.id!)
        if (!lastAppointment) {
            const d = new Date(mission.startDate)
            dates.push(d.toISOString())
            if (recurence === "weekly") {
                d.setDate(d.getDate() + 7)
                dates.push(d.toISOString())
            }
        }
        else {
            if (recurence === "weekly") {
                // Create an appointment for 7 days after
                const d = new Date(lastAppointment.date)
                d.setDate(d.getDate() + 7)
                dates.push(d.toISOString())
            }
            if (recurence === "bi-monthly") {
                // Create an appointment for 14 days after
                const d = new Date(lastAppointment.date)
                d.setDate(d.getDate() + 14)        
                dates.push(d.toISOString())
            }
            if (recurence === "monthly") {
                // Create an appointment for 28 days after
                const d = new Date(lastAppointment.date)
                d.setDate(d.getDate() + 28)
                dates.push(d.toISOString())
            }
        }
        
        dates.forEach(async (date) => {
            setTimeout ( async () => { // timeout de 0.7 sec pour ne pas surcharger le serveur
                const newAppt = await appointmentController.no_handler_create_appointment({
                    date: date,
                    idMission: mission.id
                })
                console.log("newAppt n° "+index+'\n', newAppt.dataValues)
            }, 700)
        })
    })
}

export default function startCronJobs(): void {
    //for (let i = 0; i < 4; i++) { generate_appointments() }
    const job = new CronJob (
        '1 0 * * mon', // 00:01 of every monday
        generate_appointments,
        null, // on complete
        true,
        null, // time zone
        true // run on init
    );
}