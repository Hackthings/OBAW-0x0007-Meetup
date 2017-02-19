/* module imports */

exports.formatMsg = msg => ({
  type: 'text',
  content: msg,
})

exports.formatQuickReplies = (quickRp, res) => {
  const elements = []
  quickRp.forEach((elem) => {
    elements.push({
      title: elem.name,
      value: elem.value,
    })
  })
  return {
    type: 'quickReplies',
    content: {
      title: `More information regarding ${res.value}`,
      buttons: elements,
    },
  }
}

exports.formatCardsReplies = (cards) => {
  const elements = []
  cards.forEach((c) => {
    elements.push({
      title: c.name,
      subtitle: c.city,
      imageUrl: c.picture,
      buttons: [
        {
          type: 'web_url',
          title: 'More Information',
          value: c.link,
        },
      ],
    })
  })
  return {
    type: 'carouselle',
    content: elements,
  }
}
