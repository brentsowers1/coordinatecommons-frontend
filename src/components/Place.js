/* Single Place to show in a list of places for a given category
 */

import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

class Place extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    name: PropTypes.string.isRequired
  }

  render() {
    return (
       <ListGroupItem
         active={this.props.selected}
         onClick={this.props.onClick}>
         {this.props.name}
       </ListGroupItem>
    );
  }
}

export default Place;
