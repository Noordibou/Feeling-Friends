const { toggleSelected } = require("../utils/utils");

describe("checks if item is added to the array", () => {
  // test("checks if item is added to the array", () => {
  //   // Given
  //   const item1 = {
  //     name: "Empty Desk",
  //     x: 0,
  //     y: 0,
  //     assigned: true,
  //     rotation: 0,
  //   };

  //   const alreadySelected = false;

  //   const isSelected = [];

  //   // When
  //   const result = toggleSelected(item1, alreadySelected, isSelected);

  //   // Then
  //   expect(result).toStrictEqual([item1]);
  // });

  // parameterized tests
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
        testName: "removes student from selection array",
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
  ])("%i", (testParams) => {
    // When
    const result = toggleSelected(
      testParams.itemToTest,
      testParams.isSelected,
      testParams.alreadySelectedItems
    );
    console.log("result: " + JSON.stringify(result));
    console.log("test params length: " + testParams.length);
    // Then
    expect(result).toStrictEqual(testParams.expectedResult);
  });
});
