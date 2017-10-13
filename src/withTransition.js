import React from 'react';
import ReactDOM from 'react-dom';
import equal from 'is-equal-shallow';
import { ReplaySubject, Scheduler } from './utils/rx';
import {
  duration,
  objectPropertyMinus,
  objectPropertyAdd,
  objectPropertyTransform,
} from './utils/animatedHelper';

const pipe = (...rest) => value => {
  return rest.reduce((state, fn) => fn(state), value);
};

const withAnimate = (
  ms = 600,
  startVariable,
  endVariable,
  getStyle,
  easing = i => i,
  styles = {}
) => {
  const animatedObservable = duration(ms).map(easing);
  const getStyleObservable = (startStyle, endStyle) => {
    return animatedObservable.map(
      pipe(
        objectPropertyTransform(objectPropertyMinus(startStyle, endStyle)),
        objectPropertyAdd(startStyle)
      )
    );
  };
  let currentVariable;

  return Component =>
    class extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          isShow: !!props.show,
        };
      }

      startAnimate(style$, DOM) {
        return style$.subscribe(styleObj => {
          currentVariable = styleObj;
          Object.assign(DOM.style, getStyle(styleObj));
        });
      }

      componentWillReceiveProps(nextProps) {
        const DOM = ReactDOM.findDOMNode(this);
        if (nextProps.show) {
          // prepare styleObservable for enter transition
          const startStyle = currentVariable || startVariable;
          const endStyle = endVariable;
          this.setState({
            animatedSubject: new ReplaySubject(1),
            isShow: true,
          });
          const style$ = getStyleObservable(startStyle, endStyle)
            .do(null, null, () => {
              this.state.animatedSubject.next();
              this.state.animatedSubject.complete();
            })
            .takeWhile(() => this.props.show);

          this.startAnimate(style$, DOM);
        } else {
          // prepare styleObservable for leave tansition

          const startStyle = currentVariable || endVariable;
          const endStyle = startVariable;
          const style$ = getStyleObservable(startStyle, endStyle)
            .do(null, null, () =>
              this.setState({
                isShow: false,
              })
            )
            .takeWhile(() => !this.props.show);

          this.startAnimate(style$, DOM);
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isShow && !nextProps.show) return false;
        if (nextProps.show && !nextState.isShow) return false;
        return true;
      }

      render() {
        const { show, cacheDOM } = this.props;
        const { animatedSubject, isShow } = this.state;

        const realShow = cacheDOM || isShow;
        const style = Object.assign(
          getStyle(currentVariable || startVariable),
          styles,
          {
            visibility: realShow ? 'visible' : 'hidden',
          }
        );
        const props = Object.assign({}, this.props, {
          animatedEnd$: animatedSubject,
        });

        return React.createElement(
          'div',
          { style },
          realShow && React.createElement(Component, props)
        );
      }
    };
};
export default withAnimate;
