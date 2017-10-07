# react-oa

<img src="https://github.com/Jerry-Hong/react-oa/blob/master/assets/logo.png?raw=true" width="300">

An Observable base Animation Library with React
## Usage

```javascript
import { withTransition, cubicIn } from 'react-oa';

class MyComponent extends React.Component {
    // ...
}

export default withTransition(
    600, // duration time(ms)
    { x: 0 }, // custom variable start value
    { x: 300 }, // custom variable end value
    ({x}) => ({
        trnasform: `translate3d(${x}, 0, 0)` 
    }), // a function receive custom variables and return style object
    cubicIn, // optional, easing function
    { 
        position: 'absulate', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        trnasform: 'translate3d(0, 0, 0)'
    } // optional, fixed style
)(MyComponent);
```


