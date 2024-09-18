import { toggleSelected } from "../../utils/editSeatChartUtil";

describe("checks if item is added to the array", () => {
  test.each([
    [
      {
        testName: "adds new furniture to the selection array successfully",
        itemToTest: {
          name: "Empty Desk",
          x: 0,
          y: 0,
          assigned: true,
          rotation: 0,
        },
        isSelected: false,
        alreadySelectedItems: [],
        expectedResult: [
          {
            name: "Empty Desk",
            x: 0,
            y: 0,
            assigned: true,
            rotation: 0,
          },
        ],
      },
    ],

    [
      {
        testName: "removes unassigned student from selection array",
        itemToTest: {
          student: "fakeStudentId",
          seatInfo: {
            x: null,
            y: null,
            assigned: false,
          },
        },
        isSelected: true,
        alreadySelectedItems: [
          {
            student: "fakeStudentId",
            seatInfo: {
              x: null,
              y: null,
              assigned: false,
            },
          },
          {
            student: "fakeStudentId2",
            seatInfo: {
              x: null,
              y: null,
              assigned: false,
            },
          },
        ],
        expectedResult: [
          {
            student: "fakeStudentId2",
            seatInfo: {
              x: null,
              y: null,
              assigned: false,
            },
          },
        ],
      },
    ],

    [
      {
        testName: "removes item already in array",
        itemToTest: {
          name: "Bookcase",
          x: 55,
          y: 100,
          assigned: true,
          rotation: 0,
        },
        isSelected: true,
        alreadySelectedItems: [
          {
            name: "Bookcase",
            x: 55,
            y: 100,
            assigned: true,
            rotation: 90,
          },
          {
            name: "Smartboard",
            x: 80,
            y: 10,
            assigned: true,
            rotation: 0,
          },
        ],
        expectedResult: [
          {
            name: "Smartboard",
            x: 80,
            y: 10,
            assigned: true,
            rotation: 0,
          },
        ],
      },
    ],
    [
      {
        testName: "adds assigned student from selection array",
        itemToTest: {
          student: "fakeStudentId10",
          seatInfo: {
            x: 90,
            y: 40,
            assigned: true,
          },
        },
        isSelected: false,
        alreadySelectedItems: [
          {
            student: "fakeStudentId11",
            seatInfo: {
              x: 50,
              y: 60,
              assigned: true,
            },
          },
        ],
        expectedResult: [
          {
            student: "fakeStudentId11",
            seatInfo: {
              x: 50,
              y: 60,
              assigned: true,
            },
          },
          {
            student: "fakeStudentId10",
            seatInfo: {
              x: 90,
              y: 40,
              assigned: true,
            },
          },
        ],
      },
    ],
  ])("%i", (testParams) => {
    // When
    const result = toggleSelected(
      testParams.itemToTest,
      testParams.isSelected,
      testParams.alreadySelectedItems
    );
    // Then
    expect(result).toStrictEqual(testParams.expectedResult);
  });
});
