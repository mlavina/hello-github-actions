import axios from 'axios';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

interface Day {
  date: string
  availability: 'none' | 'full' | 'dlr_dp' | 'dlr_ca'
  parks: ['DLR_CA'] | ['DLR_DP'] | [] | ['DLR_CA', 'DLR_DP']
}
const foundDates: string[] = ['2022-03-21', '2022-03-22'];

(async () => {
 
  const data = (await axios.get<Day[]>('https://disneyland.disney.go.com/availability-calendar/api/calendar?segment=ticket&startDate=2022-03-21&endDate=2022-03-23')).data;
  const looking = data.filter((day) => {
    return !foundDates.includes(day.date)
  })
  
  const foundDay = looking.find((day) => {
    return day.availability !== 'none'
  })

  if (foundDay == null) {
    return
  }

  console.log(foundDay)

  const body = `A day has been found ${foundDay.date} for parks ${foundDay.parks}`
  await client.messages.create({
    body,
    from: '+14133074008',
    to: '+19179915809',
  })
})();
