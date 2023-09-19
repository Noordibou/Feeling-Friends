/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'header1': 'Karla',
      'header2': 'Karla',
      'header3': 'Karla',
      'body': 'Poppins',
      'regZone': 'Poppins',
      'input': 'Poppins',
      'button': 'Poppins'
    },

    fontSize: {
      'header1': '2.5rem',
      'header2': '1.75rem',
      'header3': '1.3rem',
      'body': '1.5rem',
      'regZone': '1.5rem',
      'input': '1.5rem',
      'button': '1.6rem',
      'md': '1.2rem',
      "sm": '1.2rem'
    },

    fontWeight: {
      'header1': '700',
      'header2': '700',
      'header3': '400',
      'body': '400',
      'semibold': '600'
    },

    colors: {
      // emotions
      'themeWhite': '#FFFFFF',
      'darkTeal': '#3EB7AC',
      'lightLavender': '#DDC9E3',
      'lightYellow': '#FEE96C',
      'lightOrange': '#FFB449',
      'lightCyan': '#BFEFEF',
      'lightBlue': '#7BBBE5',
      'pink': '#F497A9',
      // regulatory zone
      'blue': '#0886CE',
      'green': '#459A4C',
      'yellow': '#FDDA04',
      'orange': '#F06403',
      'notebookPaper': '#FFF9E4',
      'white': '#FFFFFF',
      'lightGray': '#979797'
    },

    // extend: {


    // },
  },
  plugins: [],
}
