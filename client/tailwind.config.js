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
      'header4': 'Karla',
      'body': 'Poppins',
      'regZone': 'Poppins',
      'input': 'Poppins',
      'button': 'Poppins',
      'karla': 'Karla',
      'poppins': 'Poppins',
      'inter': 'Inter',
      'arrow': ['Arial', 'Helvetica', 'sans-serif'],
    },

    fontSize: {
      'header1': '2.5rem',
      'header2': '1.75rem',
      'header3': '1.3rem',
      'header4': '1.2rem',
      'body': '1.4rem',
      'regZone': '1.5rem',
      'input': '1.5rem',
      'button': '1.6rem',
      'lg': '1.75rem',
      'md': '1.2rem',
      "sm": '1rem',
      "xs": '0.75rem'
    },

    fontWeight: {
      'header1': '800',
      'header2': '800',
      'header3': '800',
      'header4': '800',
      'body': '400',
      'semibold': '600',
      'normal': '400',
      'bold': '900'
    },

      colors: {
        // Emotions
        'themeWhite': '#FFFFFF',
        'darkTeal': '#3EB7AC',
        'lightLavender': '#DDC9E3',
        'lightYellow': '#FEE96C',
        'lightOrange': '#FFB449',
        'lightCyan': '#BFEFEF',
        'lightBlue': '#7BBBE5',
        'pink': '#F497A9',
        // Regulatory zone
        'blue': '#0886CE',
        'green': '#459A4C',
        'yellow': '#FDDA04',
        'orange': '#F06403',
        'notebookPaper': '#FFF9E4',
        'white': '#FFFFFF',
        'lightGray': '#979797',
        // Other
        'sandwich': '#E4D1AB',
        'graphite': '#8D8772',
        'gray': '#808080',
        'darkSandwich': '#9E9268',
        'black': '#000000',
        // Teacher Navbar
        'sky': '#3DA4DE',
        'grass': '#52B85A',
        'schoolBus': '#F5D73A',
        'apple': '#F46B1E'
      },
      screens: {
        "xs": "400px"
      },
      boxShadow: {
        'inner-md': 'inset 0 8px 13px rgba(110, 110, 110, 0.6), inset 0 -8px 13px rgba(110, 110, 110, 0.6), inset 8px 0 13px rgba(110, 110, 110, 0.6), inset -8px 0 13px rgba(110, 110, 110, 0.6)',
        'inner-lg': 'inset 0 10px 15px rgba(0, 0, 0, 0.6)',
        'inner-xl': 'inset 0 20px 25px rgba(0, 0, 0, 0.6)',
        // Add more custom shadows as needed
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
  plugins: [require("@tailwindcss/forms")]
}
