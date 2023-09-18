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
      'regZone': 'Poppins'
    },

    fontSize: {
      'header1': '4rem',
      'header2': '2.25rem',
      'header3': '1.5rem',
      'body': '1.5rem',
      'regZone': '1.5rem'
    },

    fontWeight: {
      'header1': '700',
      'header2': '700',
      'header3': '400',
      'body': '400'
    },

    colors: {
      // emotions
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
      'white': '#FFFFFF'
    },

    // extend: {


    // },
  },
  plugins: [],
}
