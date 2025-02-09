import { getLastJournalInfo } from "../../utils/editSeatChartUtil";
import { getCurrentDate } from "../../utils/dateFormat";

// FIXME: Need to test whenever we get the current day's journal entry checkin/out

describe("get borderColorClass, bgColorClass, lastCheck and lastEmotion", () => {

  const todaysDate = getCurrentDate()

  test.each([
    [
      {
        testName: "student with many journal entries",
        student: {
          journalEntries: [
            {
              checkin: {
                emotion: "Anxious",
                ZOR: "Ready to learn",
                goal: "Finish homework during study hall",
                need: "Help with homework",
              },
              checkout: {
                emotion: "Anxious",
                ZOR: "Ready to learn",
                goal: "Finish homework during study hall",
                need: "Help with homework",
              },
              _id: "6520c5a83846b7622f72b69a",
            },
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Wiggly",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              checkout: {
                emotion: "Embarrassed",
                ZOR: "Low energy/Unmotivated",
                goal: "Better manage my energy",
                need: "Check in with my teacher",
              },
              date: todaysDate,
              _id: "6520d33b87d6c853514e8c05",
            },
            {
              checkin: {
                emotion: "Anxious",
                ZOR: "Ready to learn",
                goal: "Do my best in class",
                need: "Check in with my teacher",
              },
              date: todaysDate,
              _id: "65217cf7e9188ac7c9bff2a9",
            },
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Unmotivated",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              checkout: {
                emotion: "Sad",
                ZOR: "Explosive",
                goal: "Finish homework during study hall",
                need: "Help with focusing",
              },
              date: todaysDate,
              _id: "652efa064fe2566491e6cc72",
            },
            {
              checkout: {
                emotion: "Worried",
                ZOR: "Unmotivated",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              date: "10-26-2023",
              _id: "653a98e6bc5984940cca1f85",
            },
            {
              checkout: {
                emotion: "Scared",
                ZOR: "Explosive",
                goal: "Do my best in class",
                need: "Help with focusing",
              },
              date: todaysDate,
              _id: "65416c45b0887547b6a062ad",
            },
          ],
        },
        expectedOutput: {
          borderColorClass: "orange",
          bgColorClass: "orange",
          lastCheck: {
            emotion: "Scared",
            ZOR: "Explosive",
            goal: "Do my best in class",
            need: "Help with focusing",
          },
          lastEmotion: "Scared",
        },
      },
      {
        testName: "student with no journal entries",
        student: { journalEntries: [] },
        expectedOutput: {
          borderColorClass: "sandwich",
          bgColorClass: "",
          lastCheck: null,
          lastEmotion: "",
        },
      },
      {
        testName: "student with one checkin/checkout",
        student: {
          journalEntries: [
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Wiggly",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              checkout: {
                emotion: "Embarrassed",
                ZOR: "Unmotivated",
                goal: "Better manage my energy",
                need: "Check in with my teacher",
              },
              date: todaysDate,
              _id: "6520d33b87d6c853514e8c05",
            },
          ],
        },
        expectedOutput: {
          borderColorClass: "blue",
          bgColorClass: "blue",
          lastCheck: {
            emotion: "Embarrassed",
            ZOR: "Unmotivated",
            goal: "Better manage my energy",
            need: "Check in with my teacher",
          },
          lastEmotion: "Embarrassed",
        },
      },
      {
        testName: "last journal entry is a checkin",
        student: {
          journalEntries: [
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Unmotivated",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              checkout: {
                emotion: "Sad",
                ZOR: "Explosive",
                goal: "Finish homework during study hall",
                need: "Help with focusing",
              },
              date: "10-17-2023",
              _id: "652efa064fe2566491e6cc72",
            },
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Wiggly",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              date: todaysDate,
              _id: "6520d33b87d6c853514e8c05",
            },
          ],
        },
        expectedOutput: {
          borderColorClass: "yellow",
          bgColorClass: "yellow",
          lastCheck: {
            emotion: "Worried",
            ZOR: "Wiggly",
            goal: "Do my best in class",
            need: "Extra practice",
          },
          lastEmotion: "Worried",
        },
      },
      {
        testName: "check to see if ready to learn returns green",
        student: {
          journalEntries: [
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Wiggly",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              checkout: {
                emotion: "Embarrassed",
                ZOR: "Ready to learn",
                goal: "Better manage my energy",
                need: "Check in with my teacher",
              },
              date: todaysDate,
              _id: "6520d33b87d6c853514e8c05",
            },
          ],
        },
        expectedOutput: {
          borderColorClass: "green",
          bgColorClass: "green",
          lastCheck: {
            emotion: "Embarrassed",
            ZOR: "Ready to learn",
            goal: "Better manage my energy",
            need: "Check in with my teacher",
          },
          lastEmotion: "Embarrassed",
        },
      },
      {
        testName: "no current day entry, so should return null/sandwich values",
        student: {
          journalEntries: [
            {
              checkin: {
                emotion: "Worried",
                ZOR: "Wiggly",
                goal: "Do my best in class",
                need: "Extra practice",
              },
              checkout: {
                emotion: "Embarrassed",
                ZOR: "Ready to learn",
                goal: "Better manage my energy",
                need: "Check in with my teacher",
              },
              date: "10-26-2023",
              _id: "6520d33b87d6c853514e8c05",
            },
          ],
        },
        expectedOutput: {
          borderColorClass: "sandwich",
          bgColorClass: "",
          lastCheck: null,
          lastEmotion: "",
        },
      },
    ],
  ])("$testName", ({ student, expectedOutput }) => {
    const result = getLastJournalInfo(student);
    expect(result).toEqual(expectedOutput);
  });
});
