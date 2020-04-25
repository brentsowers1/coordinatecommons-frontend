import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

class PlaceInfo extends Component {
  static propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }

  render() {
    return (
      <React.Fragment>
        {this.props.lat}, {this.props.lng}
      </React.Fragment>
      // <Container>
      //   <Row>
      //     <Col md={12}>
      //     </Col>
      //   </Row>
      // </Container>
    );
  } 
};

export default PlaceInfo;
