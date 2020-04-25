import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

class PlaceInfo extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }

  render() {
    return (
      <React.Fragment>
        {this.props.name}, {this.props.status}  
      </React.Fragment>
      // <Container>
      //   <Row>
      //     <Col md={7}>
      //       {this.props.name}
      //     </Col>
      //     <Col md={5}>
      //       {this.props.status}
      //     </Col>
      //   </Row>
      // </Container>      
    );
  } 
};

export default PlaceInfo;
