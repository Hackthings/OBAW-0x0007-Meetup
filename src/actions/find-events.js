/* module imports */
const agent = require('superagent-promise')(require('superagent'), Promise)
const formatter = require('../formatter')

export default function findEvents(res) {
  console.log('FIND EVENTS')

  return new Promise(async (resolve) => {
    const replies = []
    const cardsReplies = []
    const location = res.getMemory('location')
    if (location) {
      replies.push(formatter.formatMsg(`Looking for meetups near ${location.formatted}`))
      const response = await agent('GET', `https://api.meetup.com/find/events?key=${process.env.MEETUP_API_KEY}&lat=${location.lat}&long=${location.lng}`)
      const meetups = response.body
      if (meetups.length) {
        const index = Math.floor((Math.random() * (meetups.length - 10)) + 1)
        const meetupSliced = meetups.slice(index, index + 8)
        const promises = meetupSliced.map(p => agent('GET', `https://api.meetup.com/${p.group.urlname}?key=${process.env.MEETUP_API_KEY}`))
        Promise.all(promises).then((results) => {
          console.log('======================================')
          console.log(results)
          console.log('======================================')
          results.forEach((responsePicture, i) => {
            const picture = responsePicture.body
            const m = meetupSliced[i]
            cardsReplies.push({
              name: m.name,
              city: m.venue.city,
              picture: picture.organizer.photo.photo_link,
            })
          })
          console.log('======================================')
          console.log(cardsReplies)
          console.log('======================================')
          replies.push(formatter.formatCardsReplies(cardsReplies))
          resolve(replies)
        }).catch((e) => {
          console.log('======================================')
          console.log(e)
          console.log('======================================')
        })
      } else {
        replies.push(formatter.formatMsg(`Couldn't fint any meetups near ${location.formatted}`))
        resolve(replies)
      }
    } else {
      replies.push(formatter.formatMsg(res.reply()))
      resolve(replies)
    }
  })
}
