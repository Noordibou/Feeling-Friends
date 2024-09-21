// controller/trelloController.js
const axios = require('axios');


const trelloApiKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const boardId = process.env.FEELING_FRIENDS_BOARD_ID;
const listId = process.env.ACCESSIBILITY_LIST_ID;


const sortUpdateTrello = async (req, res) => {
    const violations = req.body

// MAKE CARD
// TODO: CHECK IF CARD WITH pageUrl ALREADY EXISTS BEFORE CREATION
// TODO: IF CARD ALREADY EXISTS WITH THAT URL, GET THE CARD ID FOR NEXT STEPS
  try {
    const cardTitle = `Accessibility Violation on ${violations.pageUrl}`;
    // const cardDescription = violations.map(v => `${v.description}: ${v.help}`).join('\n');
    const response = await axios.post(`https://api.trello.com/1/cards?idList=${listId}&key=${trelloApiKey}&token=${trelloToken}`, {
      name: cardTitle,
    });

    const cardId = response.id
    console.log("card id: " + JSON.stringify(cardId))
    res.status(201).json({ message: 'Checklist Items created', data: "woot" });
  } catch (error) {
    console.error('Error creating Trello card/item:', error);
    res.status(500).json({ error: 'Failed to card item' });
  }


// TODO: MAKE CHECKLIST ITEMS BY MAPPING THROUGH EACH ONE
// TODO: AT SAME TIME, COMPARE IT AGAINST ALREADY EXISTING CHECKLIST ITEMS
// SAVE NEW ITEMS TO AN ARRAY OF OBJECTS OR SOMETHING
  try {



  } catch(error) {

  }

// TODO: IF THERE ARE NEW CHECKLIST ITEMS, MAKE CHECKLIST
// TODO: ONCE CHECKLIST IS CREATED, ADD NEW ITEMS
try {



} catch(error) {

}


}
module.exports = {
    sortUpdateTrello,
  };
