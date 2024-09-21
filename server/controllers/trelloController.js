// controller/trelloController.js
const axios = require("axios");

const trelloApiKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const boardId = process.env.FEELING_FRIENDS_BOARD_ID;
const listId = process.env.ACCESSIBILITY_LIST_ID;



const checkChecklists = async (cardId, violations) => {

    // GET CURRENT TRELLO CHECKLISTS FOR CARD
    try {
      const currTrelloChecklists = await axios.get(
        `https://api.trello.com/1/cards/${cardId}/checklists?key=${trelloApiKey}&token=${trelloToken}`
      );
  
      
      const currentChecklistNames = currTrelloChecklists.data.map(checklist => checklist.name);
  
      for (const issue of violations.issues) {
        const issueName = issue.issueTitle; // Name for the checklist
        const issueDescs = issue.issueDesc; // Descriptions for checklist items
  
        // Check if the checklist already exists
        const checklistIndex = currentChecklistNames.indexOf(issueName);
  
        if (checklistIndex === -1) {
          // If it doesn't exist, create a new checklist
          const response = await axios.post(
            `https://api.trello.com/1/cards/${cardId}/checklists?key=${trelloApiKey}&token=${trelloToken}`,
            {
              name: issueName,
            }
          );
  
          const newChecklistId = response.data.id;
  
          // Add items to the newly created checklist
          for (const desc of issueDescs) {
            await axios.post(
              `https://api.trello.com/1/checklists/${newChecklistId}/checkItems?key=${trelloApiKey}&token=${trelloToken}`,
              {
                name: desc,
              }
            );
            console.log(`Added item "${desc}" to checklist "${issueName}"`);
          }
        } else {
          console.log(`Checklist "${issueName}" already exists.`);
          
          const existingChecklist = currTrelloChecklists.data[checklistIndex];
          const existingItems = existingChecklist.checkItems.map(item => item.name);
  
          // Check if each issueDesc already exists in the checklist
          for (const desc of issueDescs) {
            if (!existingItems.includes(desc)) {

              await axios.post(
                `https://api.trello.com/1/checklists/${existingChecklist.id}/checkItems?key=${trelloApiKey}&token=${trelloToken}`,
                {
                  name: desc,
                }
              );
              console.log(`Added item "${desc}" to existing checklist "${issueName}"`);
            } else {
              console.log(`Item "${desc}" already exists in checklist "${issueName}".`);
            }
          }
        }
      }
    } catch (error) {
      console.error("ERROR: Couldn't get or update checklists", error);
    }
  };

const addChecklist = () => {
  // TODO: IF THERE ARE NEW CHECKLIST ITEMS, MAKE CHECKLIST
  // TODO: ONCE CHECKLIST IS CREATED, ADD NEW ITEMS
  try {
} catch (error) {}

}

const checkChecklistItems = () => {


}

const addChecklistItem = () => {
  // TODO: MAKE CHECKLIST ITEMS BY MAPPING THROUGH EACH ONE
  // TODO: AT SAME TIME, COMPARE IT AGAINST ALREADY EXISTING CHECKLIST ITEMS
  // SAVE NEW ITEMS TO AN ARRAY OF OBJECTS OR SOMETHING
  try {
} catch (error) {}

}

const sortUpdateTrello = async (req, res) => {
  const violations = req.body;
  const currTrelloCards = [];
  const currChecklists = []


  try {
    const cardsFromList = await axios.get(
      `https://api.trello.com/1/lists/${listId}/cards?key=${trelloApiKey}&token=${trelloToken}`
    );
    console.log("cards frmo list : " + JSON.stringify(cardsFromList.data));

    for (let i = 0; i < cardsFromList.data.length; i++) {
        currTrelloCards.push({
          name: cardsFromList.data[i]["name"],
          id: cardsFromList.data[i]["id"],
        });
      }
    } catch (error) {
      console.error("ERROR: Couldn't get cards from list");
      return res.status(500).json({ message: "Error fetching Trello cards" });
    }
  
    const cardTitle = `Accessibility Issue on ${violations.pageUrl}`;
  
    // Check if card exists
    const existingCard = currTrelloCards.find(card => card.name === cardTitle);
    let cardId = null;
  
    if (!existingCard) {
      try {
        // If card doesn't exist, create a new card
        const response = await axios.post(
          `https://api.trello.com/1/cards?idList=${listId}&key=${trelloApiKey}&token=${trelloToken}`,
          {
            name: cardTitle,
          }
        );
  
        cardId = response.data.id;
        console.log("New card created with ID: " + cardId);
      } catch (error) {
        console.error("ERROR: Couldn't create new card");
        return res.status(500).json({ message: "Error creating new Trello card" });
      }
    } else {
      cardId = existingCard.id; // Save the existing card's ID
      console.log("Existing card ID: " + cardId);
    }

    // check checklists
    await checkChecklists(cardId, violations)

    // add checklist if no checklists of that name

    // check checklist items

    // add checklist item if no checklist item of that name


  res.status(201).json({ message: "Checklist Items created", data: "woot" });
};



module.exports = {
  sortUpdateTrello,
};
