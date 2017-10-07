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

const withAnimate = (
  ms = 600,
  getStartStyle,
  getEndStyle,
  getStyle,
  easing = i => i,
  styles = {}
) => {
  const distanceObservable = duration(ms).map(easing);

  return Component =>
    class extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          isShow: !!props.show,
          realStyle: {},
        };
        this.getEnterStyleObservable = this.getEnterStyleObservable.bind(this);
        this.getLeaveStyleObservable = this.getLeaveStyleObservable.bind(this);
        this.getStyleObservable = this.getStyleObservable.bind(this);
        this.startEnter = this.startEnter.bind(this);
        this.startLeave = this.startLeave.bind(this);
      }

      getStyleObservable(startStyle, endStyle) {
        const diffStyles = objectPropertyMinus(startStyle, endStyle);

        return distanceObservable
          .map(objectPropertyTransform(diffStyles))
          .map(objectPropertyAdd(startStyle))
          .map(styleObj => ({ styleObj, isFinal: equal(styleObj, endStyle) }));
      }

      getEnterStyleObservable(DOM) {
        const startStyle =
          this.currentStyle || typeof getStartStyle === 'function'
            ? getStartStyle(DOM)
            : getStartStyle;

        const endStyle =
          typeof getEndStyle === 'function' ? getEndStyle(DOM) : getEndStyle;

        return this.getStyleObservable(startStyle, endStyle).takeWhile(
          () => this.props.show
        );
      }

      getLeaveStyleObservable(DOM) {
        const startStyle =
          this.currentStyle ||
          (typeof getEndStyle === 'function' ? getEndStyle(DOM) : getEndStyle);

        const endStyle =
          typeof getStartStyle === 'function'
            ? getStartStyle(DOM)
            : getStartStyle;

        return this.getStyleObservable(startStyle, endStyle).takeWhile(
          () => !this.props.show
        );
      }

      startEnter(styleObservable, DOM, cb) {
        const share = styleObservable.share();
        const sub = share.take(1).subscribe(cb);

        const enterSub = share.subscribe(({ styleObj, isFinal }) => {
          this.currentStyle = styleObj;
          const style = getStyle(styleObj);
          Object.keys(style).forEach(key => (DOM.style[key] = style[key]));
          if (isFinal) {
            this.state.animatedSubject.next();
            this.state.animatedSubject.complete();
          }
        });

        return enterSub.add(sub);
      }

      startLeave(styleObservable, DOM, cb) {
        return styleObservable.subscribe(({ styleObj, isFinal }) => {
          this.currentStyle = styleObj;
          const style = getStyle(styleObj);
          Object.keys(style).forEach(key => (DOM.style[key] = style[key]));
          if (isFinal) {
            cb();
          }
        });
      }

      componentWillReceiveProps(nextProps) {
        const DOM = ReactDOM.findDOMNode(this);
        if (nextProps.show) {
          // prepare styleObservable for enter transition
          const enterStyleObservable = this.getEnterStyleObservable(DOM);

          this.setState({
            animatedSubject: new ReplaySubject(1),
          });
          this.startSub = this.startEnter(enterStyleObservable, DOM, () => {
            this.setState({
              isShow: true,
            });
          });
        } else {
          // prepare styleObservable for leave tansition
          const leaveStyleObservable = this.getLeaveStyleObservable(DOM);

          this.leaveSub = this.startLeave(leaveStyleObservable, DOM, () =>
            this.setState({
              isShow: false,
            })
          );
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isShow && !nextProps.show) return false;
        return true;
      }

      render() {
        const { show } = this.props;
        const { animatedSubject } = this.state;
        const style = Object.assign({}, styles, {
          visibility: show ? 'visible' : 'hidden',
        });
        const props = Object.assign({}, this.props, {
          animatedEnd$: animatedSubject,
        });

        return React.createElement(
          'div',
          { style },
          this.state.isShow && React.createElement(Component, props)
        );
      }
    };
};
export default withAnimate;
