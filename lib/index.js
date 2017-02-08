/* ================================================================
 * autoresponsive-react-native by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Jun 02 2014 20:15:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2014 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

let React = require('react');
let Common = require('autoresponsive-common');

let {
  Util,
  GridSort
} = Common;

let {
  View,
  Dimensions
} = require('react-native');

const screenWidth = Dimensions.get('window').width;
const noop = function() {};

class AutoResponsive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.sortManager = new GridSort({
      containerWidth: this.props.containerWidth,
      gridWidth: this.props.gridWidth
    });
  }

  componentWillUpdate() {
    this.sortManager.init();
  }

  mixItemInlineStyle(s) {
    let style = {
      position: 'absolute',
    };
    Util.merge(s, style);
  }

  renderChildren() {
    return React.Children.map(this.props.children, function(child, childIndex) {
      let childStyle = {};
      
      if(child.props.style instanceof Array) {
        child.props.style.forEach((style) => {
          Util.merge(childStyle, style);
        });
      } else {
        childStyle = child.props.style;
      }

      let childWidth = parseInt(childStyle.width) + this.props.itemMargin;
      let childHeight = parseInt(childStyle.height) + this.props.itemMargin;
      let calculatedPosition = this.sortManager.getPosition(childWidth, childHeight, this.containerStyle.height);

      if (!this.fixedContainerHeight) {

        if (calculatedPosition[1] + childHeight > this.containerStyle.height) {
          this.containerStyle.height = calculatedPosition[1] + childHeight;
        }
      }

      let calculatedStyle = {
        left: calculatedPosition[0],
        top: calculatedPosition[1]
      };

      this.mixItemInlineStyle(calculatedStyle);

      this.props.onItemDidLayout.call(this, child);

      if (childIndex + 1 === this.props.children.length) {
        this.props.onContainerDidLayout.call(this);
      }

      return React.cloneElement(child, {
        style: Util.extend({}, childStyle, calculatedStyle)
      });
    }, this);
  }

  setPrivateProps() {
    this.containerStyle = {
      position: 'relative',
      height: this.containerHeight || 0
    };
  }

  getContainerStyle() {
    return this.containerStyle
  }

  render() {
    this.setPrivateProps();

    return (
      <View style={this.getContainerStyle()}>
      {this.renderChildren()}
      </View>
    );
  }
}

AutoResponsive.defaultProps = {
  containerWidth: screenWidth,
  containerHeight: null,
  gridWidth: 1,
  itemMargin: 0,
  horizontalDirection: 'left',
  verticalDirection: 'top',
  onItemDidLayout: noop,
  onContainerDidLayout: noop
};

module.exports = AutoResponsive;
