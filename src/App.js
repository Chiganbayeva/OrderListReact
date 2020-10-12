import React, { Component } from 'react';
import {Container,Row, Card, Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {

      orders: [
      ],
      search: '',
      dateFrom: '',
      dateTo: ''
    }
  }

  componentDidMount() {
    this.generateList();
  }

  generateList = () => {

    for (let i = 0; i <  5000; i++) {
      var item = '{"id": ' + (i + 1) + ',"name": "Test order ' + (i + 1) + '","location":{"name": "Test location ' + (i + 1) + '","longitude": -1.158651,"latitude": 52.630579,"address": "59 Westcotes Drive, LE3 0SQ, United Kingdom"},"dropWindows": [{"startTime": ' + (1601625600000 + (86400000 * i)) + ',"endTime": ' + (1601647200000 + (86400000 * i)) + '},{"startTime": ' + (1601658000000 + (86400000 * i)) + ',"endTime": ' + (1601672400000 + (86400000 * i)) + '}]}';
      var obj = JSON.parse(item)
      this.state.orders.push(obj);
    }
    console.log(this.state.orders);
    this.setState(this.state.orders);
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) })
  }
  updateDateFrom(event) {
    this.setState({ dateFrom: event.target.value.substr(0, 10) })
  }
  updateDateTo(event) {
    this.setState({ dateTo: event.target.value.substr(0, 10) })
  }


  render() {
   
    
    var dateRangeStart = new Date();
    var dateRangeTo = new Date();
    var isDateRangeValid
    if (this.state.dateFrom.length === 0 || this.state.dateTo.length === 0) {
      isDateRangeValid = false
    } else {
      try {
        dateRangeStart = new Date(this.state.dateFrom)
        dateRangeTo = new Date(this.state.dateTo)
        isDateRangeValid = true
      } catch (error) {
        isDateRangeValid = false
      }
    }
    let filteredOrders = this.state.orders.filter(
      (value) => {
        var dropWindowBeginDt1 = new Date(value.dropWindows[0].startTime)
        var dropWindowBeginDt2 = new Date(value.dropWindows[1].startTime)
        return ((
          (value.name.toLowerCase().indexOf(
            this.state.search.toLowerCase()) !== -1)
          || (
            value.location.name.toLowerCase().indexOf(
              this.state.search.toLowerCase()) !== -1
          ))
          &&
          (!isDateRangeValid || ((dropWindowBeginDt1 >= dateRangeStart && dropWindowBeginDt1 <= dateRangeTo) || (dropWindowBeginDt2 >= dateRangeStart && dropWindowBeginDt2 <= dateRangeTo)))
        )
      }
    );

    return (
      <div className="App">
       <Container fluid>
          <Row>
          <Col xs={4} style={{backgroundColor:"rgb(238,240,246)", paddingTop:"1rem"}}>
            <Form.Control type="text" value={this.state.search} 
              onChange={this.updateSearch.bind(this)} placeholder="Search" />
         </Col>
         </Row>
         <Row>
           <Col xs={2} style={{backgroundColor:"rgb(238,240,246)", paddingTop:"5px"}}>
          <Form.Control type="date" value={this.state.dateFrom}
            onChange={this.updateDateFrom.bind(this)} />
          </Col>
          <Col xs={2} style={{backgroundColor:"rgb(238,240,246)", paddingTop:"5px"}}>
          <Form.Control type="date" value={this.state.dateTo}
            onChange={this.updateDateTo.bind(this)} />
          </Col>
         </Row>       
        <Row>
        <Col xs={4} style={{backgroundColor:"rgb(237,239,245)", paddingTop:"1rem",overflow:"scroll",height:"600px"}}>
          {
            filteredOrders.map((value, key) => {
              return (<Card key={key}
                style={{ fontSize: "12px" }}
                className="mb-1">
                <Card.Body >
                  <Card.Title style={{ color: "rgb(62,153,244)",fontSize: "15px" }}> {value.name}  </Card.Title>
                  <Card.Text style={{color:"darkgray"}}><b>{value.location.name }</b></Card.Text>
                  <Card.Text style={{color:"gray"}}>{value.location.address}</Card.Text>                
                    {
                      value.dropWindows.map((nestedVal, i) => {
                        var myDate = new Date(nestedVal.startTime);
                        var a = myDate.toLocaleString('en-GB', { timeZone: 'UTC' });
                        var b = new Date(nestedVal.endTime);
                        return (
                          <Card.Text key={i}><b>{a + "  " + b.toLocaleString('en-GB', { timeZone: 'UTC' })}</b></Card.Text>
                        )
                      })
                    }               
                </Card.Body>
              </Card>)
            })
          }
         </Col>
        </Row>
        </Container>
    
      </div>
    );
  }
}

export default App;
