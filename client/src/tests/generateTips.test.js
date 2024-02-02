const subEmotionInfo = require('../data/subEmotions')
const emotionsExplained = require('../data/emotionData.js')

describe('Data Files', () => {
    test('Sub-emotions should be present in emotionData', () => {

      subEmotionInfo.default.forEach((subEmotion) => {
        subEmotion.subEmotions.forEach((subEmotionName) => {
          const found = emotionsExplained.default.some(
            (emotionObject) => emotionObject.emotion === subEmotionName
          );

          if (!found) {
            console.warn(`Emotion not found: ${subEmotionName}`);
          }

          expect(found).toBeTruthy();
        });
      });
    });
  });