// Font imports for MontserratAlt1
import MontserratAlt1Regular from './assets/fonts/MontserratAlt1-Regular.otf';

// Create a style element to inject the font face
const fontStyle = document.createElement('style');
fontStyle.textContent = `
  @font-face {
    font-family: 'MontserratAlt1';
    src: url('${MontserratAlt1Regular}') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
`;
document.head.appendChild(fontStyle);

// Test if font is loaded
const testFont = () => {
  if (document.fonts && document.fonts.check) {
    console.log('MontserratAlt1 font loaded:', document.fonts.check('400 16px MontserratAlt1'));
  }
};

// Test font loading after a delay
setTimeout(testFont, 1000);
setTimeout(testFont, 3000);
