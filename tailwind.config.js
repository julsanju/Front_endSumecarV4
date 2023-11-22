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
        100:'#CFFAFE',
        200:'#7688B5',
        500:'#009EFA'
      }
    },
    boxShadow:{
      azulbs: '1px 8px 30px 0px rgba(0, 158, 250, 0.70)'
    },
    border:{
      card:'0.602px solid var(--White, #FFF)'
    },
  
    backgroundImage:{
      card:' linear-gradient(137deg, rgba(255, 255, 255, 0.80) 5.59%, rgba(255, 255, 255, 0.37) 115.37%)'
    },
    backdropBlur:{
      card:' blur(4.214146614074707px)'
    }

  },
  plugins: [
    require('flowbite/plugin')
  ],
}
