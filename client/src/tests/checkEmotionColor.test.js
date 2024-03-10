import { getEmotionColor } from "../utils/classroomColors";


describe('get Emotion Color for student view styling', () => {
    const testData = [
        { emotion: "Hurt" , expectedColor: 'lightBlue'},
        { emotion: "Lonely" , expectedColor: 'lightBlue'},
        { emotion: "Guilty" , expectedColor: 'lightBlue'},
        { emotion: "Sad" , expectedColor: 'lightBlue'},
        { emotion: "Disappointed" , expectedColor: 'lightBlue'},
        { emotion: "Ashamed" , expectedColor: 'lightBlue'},
        { emotion: "Grumpy" , expectedColor: 'pink'},
        { emotion: "Disgusted" , expectedColor: 'pink'},
        { emotion: "Jealous" , expectedColor: 'pink'},
        { emotion: "Frustrated" , expectedColor: 'pink'},
        { emotion: "Annoyed" , expectedColor: 'pink'},
        { emotion: "Angry" , expectedColor: 'pink'},
        { emotion: "Threatened" , expectedColor: 'lightLavender'},
        { emotion: "Insecure" , expectedColor: 'lightLavender'},
        { emotion: "Scared" , expectedColor: 'lightLavender'},
        { emotion: "Rejected" , expectedColor: 'lightLavender'},
        { emotion: "Intimidated" , expectedColor: 'lightLavender'},
        { emotion: "Helpless" , expectedColor: 'lightLavender'},
        { emotion: "Secure" , expectedColor: 'lightYellow'},
        { emotion: "Excited" , expectedColor: 'lightYellow'},
        { emotion: "Confident" , expectedColor: 'lightYellow'},
        { emotion: "Ambitious" , expectedColor: 'lightYellow'},
        { emotion: "Determined" , expectedColor: 'lightYellow'},
        { emotion: "Proud" , expectedColor: 'lightYellow'},
        { emotion: "Hopeful" , expectedColor: 'darkTeal'},
        { emotion: "Grateful" , expectedColor: 'darkTeal'},
        { emotion: "Glad" , expectedColor: 'darkTeal'},
        { emotion: "Thoughtful" , expectedColor: 'darkTeal'},
        { emotion: "Peaceful" , expectedColor: 'darkTeal'},
        { emotion: "Content" , expectedColor: 'darkTeal'},
        { emotion: "Confused" , expectedColor: 'lightOrange'},
        { emotion: "Embarrassed" , expectedColor: 'lightOrange'},
        { emotion: "Pressured" , expectedColor: 'lightOrange'},
        { emotion: "Overwhelmed" , expectedColor: 'lightOrange'},
        { emotion: "Worried" , expectedColor: 'lightOrange'},
        { emotion: "Anxious" , expectedColor: 'lightOrange'},
    ]

    testData.forEach(({ emotion, expectedColor }) => {
        
        test(`returns correct ${expectedColor} for ${emotion}`, () => {
            expect(getEmotionColor(emotion)).toBe(expectedColor);
        })

    })
})