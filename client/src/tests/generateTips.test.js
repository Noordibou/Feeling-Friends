import subEmotionInfo from '../data/subEmotions';
import emotionsExplained from '../data/emotionData.js';

describe('Data Files', () => {
    test('Sub-emotions should be present in emotionData', () => {

      subEmotionInfo.forEach((subEmotion) => {
        subEmotion.subEmotions.forEach((subEmotionName) => {
          const found = emotionsExplained.some(
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