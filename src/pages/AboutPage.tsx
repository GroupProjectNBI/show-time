import { Row, Col } from 'react-bootstrap';


AboutPage.route = {
  path: '/about-us',
  menuLabel: 'About us',
  index: 2
};

export default function AboutPage() {
  return <>
    <Row>
      <Col>
        <h2 className="text-primary">About us</h2>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <p>Founded </p>
        <p>Our</p>
      </Col>
      <Col md={6}>
        <p></p>
        <p></p>
        <p></p>
      </Col>
    </Row>
  </>;
}