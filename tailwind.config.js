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
    }

  },
  plugins: [
    require('flowbite/plugin')
  ],
}
