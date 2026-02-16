import { Row, Col } from 'react-bootstrap';

OurVisionPage.route = {
  path: '/our-vision',
  menuLabel: 'Our Vision',
  index: -1
};

export default function OurVisionPage() {
  return <>
    <Row>
      <Col>
        <h2 className="text-primary"></h2>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <p></p>
        <p></p>
        <p></p>
      </Col>
      <Col md={6}>
        <p></p>
        <p></p>
      </Col>
    </Row>
  </>;
}