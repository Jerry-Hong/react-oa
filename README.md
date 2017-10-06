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
    600, 
    { 
        position: 'absulate', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        trnasform: 'translate3d(0, 0, 0)'
    }, {
        x: 0
    }, {
        x: 300
    }, ({x}) => ({
        trnasform: `translate3d(${x}, 0, 0)`
    }),
    cubicIn
)(MyComponent);
```


