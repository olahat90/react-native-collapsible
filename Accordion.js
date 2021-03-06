import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import Collapsible from './Collapsible';
import { ViewPropTypes } from './config';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(ViewPropTypes);

export default class Accordion extends Component {
  static propTypes = {
    loopIndex: PropTypes.number,
    sections: PropTypes.array.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    renderFooter: PropTypes.func,
    renderSectionTitle: PropTypes.func,
    activeSections: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    duration: PropTypes.number,
    easing: PropTypes.string,
    underlayColor: PropTypes.string,
    touchableComponent: PropTypes.func,
    touchableProps: PropTypes.object,
    disabled: PropTypes.bool,
    expandFromBottom: PropTypes.bool,
    expandMultiple: PropTypes.bool,
    onAnimationEnd: PropTypes.func,
    sectionContainerStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    underlayColor: 'black',
    disabled: false,
    expandFromBottom: false,
    expandMultiple: false,
    touchableComponent: TouchableHighlight,
    renderSectionTitle: () => null,
    onAnimationEnd: () => null,
    sectionContainerStyle: {},
  };

  _toggleSection(section) {
    if (!this.props.disabled) {
      const { activeSections, expandMultiple, onChange } = this.props;

      let updatedSections = [];

      if (activeSections.includes(section)) {
        updatedSections = activeSections.filter(a => a !== section);
      } else if (expandMultiple) {
        updatedSections = [...activeSections, section];
      } else {
        updatedSections = [section];
      }

      onChange && onChange(updatedSections);
    }
  }

  render() {
    let viewProps = {};
    let collapsibleProps = {};

    Object.keys(this.props).forEach(key => {
      if (COLLAPSIBLE_PROPS.includes(key)) {
        collapsibleProps[key] = this.props[key];
      } else if (VIEW_PROPS.includes(key)) {
        viewProps[key] = this.props[key];
      }
    });

    const {
      loopIndex,
      activeSections,
      containerStyle,
      sectionContainerStyle,
      expandFromBottom,
      sections,
      underlayColor,
      touchableProps,
      touchableComponent: Touchable,
      onAnimationEnd,
      renderContent,
      renderHeader,
      renderFooter,
      renderSectionTitle,
    } = this.props;

    const renderCollapsible = (section, key) => (
      <Collapsible
        collapsed={!activeSections.includes(key)}
        {...collapsibleProps}
        onAnimationEnd={() => onAnimationEnd(section, key)}
      >
        {renderContent(section, key, activeSections.includes(key), sections)}
      </Collapsible>
    );

    return (
      <View style={containerStyle} {...viewProps}>
        {sections.map((section, key) => {
          const concatKey = loopIndex ? loopIndex + '_' + key : key;

          return (
            <View key={concatKey} style={sectionContainerStyle}>
              {renderSectionTitle(
                section,
                concatKey,
                activeSections.includes(concatKey)
              )}

              {expandFromBottom && renderCollapsible(section, concatKey)}

              <Touchable
                onPress={() => this._toggleSection(concatKey)}
                underlayColor={underlayColor}
                {...touchableProps}
              >
                {renderHeader(
                  section,
                  concatKey,
                  activeSections.includes(concatKey),
                  sections
                )}
              </Touchable>

              {!expandFromBottom && renderCollapsible(section, concatKey)}

              {renderFooter &&
                renderFooter(
                  section,
                  concatKey,
                  activeSections.includes(concatKey),
                  sections
                )}
            </View>
          );
        })}
    </View>
    );
  }
}
