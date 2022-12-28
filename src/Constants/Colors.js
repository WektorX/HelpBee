export default {
    primary: '#ffcb05',
    primaryDark: '#AF9004',
    primaryLite: '#FFEBA8',
    black: '#000',
    white: 'white',
    accent: '#112233',
    green: 'rgba(69,230,121,1)',
    green2: '#039a83',
    light: '#EEEEEE',
    dark: '#333',
    gray: '#CCCCCC',
    red: 'rgba(230,39,34,1)',
    lightRed: '#ff4f7e',
    darkRed: '#d9365e',
    purple: 'rgba(23,33,230,1)',
    skyBlue: 'skyblue',
    yellow: '#f8c907',
    pink: '#ff4c98',
    gold: 'gold',
    line: '#282C35',
    gray: '#CCCCCC',
    darkGray: '#999999',
    brown: '#41210a',

    darkOverlayColor: 'rgba(0, 0, 0, 0.4)',
    darkOverlayColor2: 'rgba(0, 0, 0, 0.8)',
    lightOverlayColor: 'rgba(255, 255, 255, 0.6)',
    primaryAlpha: 'rgba(250,206,1,0.7)',
    redAlpha: 'rgba(230,39,34,0.7)',
    greenAlpha: 'rgba(69,230,121,0.7)',
    purpleAlpha: 'rgba(23,33,230,0.7)',
    pureAlpha : 'rgba(0,0,0,0)',

    // bags background colors
    bag1Bg: '#ea7a72',
    bag2Bg: '#c2c5d1',
    bag3Bg: '#82a7c9',
    bag4Bg: '#d49d8f',
    bag5Bg: '#ccd9c6',
    bag6Bg: '#767676',
    bag7Bg: '#d1c8c3',
    bag8Bg: '#dca47f',
    bag9Bg: '#eb849c',
    bag10Bg: '#979dc1',
    bag11Bg: '#c7d3c0',

  // backgrounds
    primaryBackground: 'rgba(250,206,1,0.1)',
    redBackground: 'rgba(230,39,34,0.1)',
    greenBackground: 'rgba(69,230,121,0.1)',
    purpleBackground: 'rgba(23,33,230,0.1)',

}


const stringToColour = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
 }
 export {stringToColour}