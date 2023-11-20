/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" // add this line
  ],
  theme: {
    extend: {},
    
    colors:{
      azul:{
        200: '#7688B5',
        500:'#009EFA'
      }
    },
    boxShadow:{
      azulbs: '1px 8px 30px 0px rgba(0, 158, 250, 0.70)'
    },

  },
  plugins: [
    require('flowbite/plugin')
  ],
}
