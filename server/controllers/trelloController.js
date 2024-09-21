// controller/trelloController.js
const axios = require('axios');
const trelloApiKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const boardId = process.env.FEELING_FRIENDS_BOARD_ID;
const listId = process.env.TRELLO_LIST_ID;
const sortUpdateTrello = async (req, res) => {
    console.log('req. body: ' + JSON.stringify(req.body))
    console.log("just testing to see if this works first, but then connecting with trello :)")
//   try {
//     const cardTitle = `Accessibility Violation on ${url}`;
//     const cardDescription = violations.map(v => `${v.description}: ${v.help}`).join('\n');
//     const response = await axios.post(`https://api.trello.com/1/cards`, {
//       name: cardTitle,
//       desc: cardDescription,
//       idList: listId,
//       key: trelloApiKey,
//       token: trelloToken,
//     });
    res.status(201).json({ message: 'Checklist Items created', data: "nice it works :)" });
//   } catch (error) {
//     console.error('Error creating Trello card/checklist item:', error);
//     res.status(500).json({ error: 'Failed to card/checklist item' });
//   }
}
module.exports = {
    sortUpdateTrello,
  };
