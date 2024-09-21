const axios = require("axios");

const trelloApiKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const listId = process.env.ACCESSIBILITY_LIST_ID;

const checkChecklists = async (cardId, violations) => {
  try {
    const currTrelloChecklists = await axios.get(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${trelloApiKey}&token=${trelloToken}`
    );

    const currentChecklistNames = currTrelloChecklists.data.map(
      (checklist) => checklist.name
    );

    for (const issue of violations.issues) {
      const issueName = issue.issueTitle;
      const issueDescs = issue.issueDesc;

      await checkChecklistItems(
        issueName,
        issueDescs,
        currentChecklistNames,
        currTrelloChecklists.data,
        cardId
      );
    }
  } catch (error) {
    console.error("ERROR: Couldn't get or update checklists", error);
  }
};

const checkChecklistItems = async (
  issueName,
  issueDescs,
  currentChecklistNames,
  checklists,
  cardId
) => {
  // Check if the checklist already exists
  const checklistIndex = currentChecklistNames.indexOf(issueName);

  if (checklistIndex === -1) {
    // Checklist doesn't exist, create a new checklist
    await addChecklist(issueName, issueDescs, cardId);
  } else {
    // Checklist exists, check if each issueDesc already exists in the checklist
    const existingChecklist = checklists[checklistIndex];
    const existingItems = existingChecklist.checkItems.map((item) => item.name);

    for (const desc of issueDescs) {
      if (!existingItems.includes(desc)) {
        // Add new checklist item if it doesn't already exist
        await addChecklistItem(existingChecklist.id, desc);
      }
    }
  }
};

const addChecklist = async (issueName, issueDescs, cardId) => {
  try {
    // Create a new checklist
    const response = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${trelloApiKey}&token=${trelloToken}`,
      { name: issueName }
    );

    const newChecklistId = response.data.id;

    // Add checklist items
    for (const desc of issueDescs) {
      await addChecklistItem(newChecklistId, desc);
    }
  } catch (error) {
    console.error("ERROR: Couldn't create checklist", error);
  }
};

const addChecklistItem = async (checklistId, desc) => {
  try {
    await axios.post(
      `https://api.trello.com/1/checklists/${checklistId}/checkItems?key=${trelloApiKey}&token=${trelloToken}`,
      { name: desc }
    );
  } catch (error) {
    console.error(`ERROR: Couldn't add item "${desc}" to checklist`, error);
  }
};

const sortUpdateTrello = async (req, res) => {
  const violations = req.body;
  const currTrelloCards = [];

  try {
    const cardsFromList = await axios.get(
      `https://api.trello.com/1/lists/${listId}/cards?key=${trelloApiKey}&token=${trelloToken}`
    );

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
  const existingCard = currTrelloCards.find((card) => card.name === cardTitle);
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
    } catch (error) {
      console.error("ERROR: Couldn't create new card");
      return res
        .status(500)
        .json({ message: "Error creating new Trello card" });
    }
  } else {
    cardId = existingCard.id;
  }

  await checkChecklists(cardId, violations);

  res.status(201).json({ message: "Card and Checklist Items created" });
};

module.exports = {
  sortUpdateTrello,
};
