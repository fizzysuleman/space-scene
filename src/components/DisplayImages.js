import React, { Component } from 'react';
import {
    MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBModalDialog, MDBModal, MDBSwitch, MDBSpinner,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

const api_key = "Ah03bfoZJe88sxpLfm6qTSwUbdij0MC9Laexxkua"

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
const defaultFrom = {
    year: 2022,
    month: 1,
    day: 1,
};
const defaultTo = {
    year: yyyy,
    month: mm,
    day: dd,
};
const defaultValue = {
    from: defaultFrom,
    to: defaultTo,
};

const maxDate = {
    year: 2022,
    month: 1,
    day: 7,
};

export default class DisplayImages extends Component {

    constructor() {
        super();
        this.state = {
            startDate: '',
            endDate: '',
            imagesData: [],
            showModal: false,
            showExplanation: false,
            dateRange: defaultValue,
            loading: true
        };
    }

    componentDidMount() {
        this.getNasaImages('', '')
    }

    async componentWillReceiveProps() {
        this.getNasaImages()
    }
    toggleShow = () => {

        this.setState({
            showModal: !this.state.showModal
        })
    }

    getNasaImages = async (startDate, endDate) => {
        this.setState({ loading: true })
        let result = await fetch(
            `https://api.nasa.gov/planetary/apod?start_date=${(startDate === '' ? '2021-12-30' : startDate)}&end_date=${(endDate === '' ? today : endDate)}&api_key=${api_key}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
        let response = await result.json();
        this.setState({
            imagesData: response
        })
        //adding like key..value pairs to the object
        response.map((item, index) => {
            item.liked = false
        })
        this.setState({ loading: false })

    }


    likePhoto = (index) => {
        let { imagesData } = this.state

        let tempImagesData = imagesData

        tempImagesData[index].liked = !tempImagesData[index].liked

        this.setState({
            imagesData: tempImagesData
        })
    }

    setSelectedDayRange = (date) => {
        this.setState({ dateRange: date })
    }

    saveChanges = async () => {
        let { dateRange } = this.state

        if (dateRange.to == null) {
            var tempStartDate = dateRange.from.year + '-' + dateRange.from.month + '-' + dateRange.from.day
            this.getNasaImages(tempStartDate, tempStartDate)
            this.toggleShow()

        }
        else {
            var tempStartDate = dateRange.from.year + '-' + dateRange.from.month + '-' + dateRange.from.day
            var tempEndDate = dateRange.to.year + '-' + dateRange.to.month + '-' + dateRange.to.day

            await this.getNasaImages(tempStartDate, tempEndDate)
            this.toggleShow()

        }


    }
    render() {
        console.log('ppp')
        let { imagesData, showModal, showExplanation, loading } = this.state
        return (
            <div>
                {loading ? <div>
                    <MDBSpinner color='light'>
                        <span className='visually-hidden'>Loading...</span>
                    </MDBSpinner>
                </div> :
                    <div>
                        <span style={{ color: 'white' }}>SpaceScene</span>
                        <br />
                        <span style={{ color: 'white', fontSize: '15px' }}>Brought to you by NASA's Astronomy Photo of the Day API</span>
                        <br />
                        <MDBBtn outline className='mx-2' color='light' size='lg' style={{ marginTop: '20px' }} onClick={() => { this.toggleShow() }}>
                            Toggle Settings
                        </MDBBtn>
                        <div style={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: '20px', marginBottom: '20px' }}>

                            {imagesData.map((item, index) => {
                                return (
                                    <MDBCard style={{ maxWidth: '22rem', marginTop: '10px', marginBottom: '10px' }}>
                                        <MDBCardImage src={item.url} position='top' alt='Fissure in Sandstone' />
                                        <MDBCardBody>
                                            <MDBCardTitle style={{ color: 'black' }}>{item.title}</MDBCardTitle>
                                            <MDBCardText style={{ fontSize: '10px', color: 'black' }}>{item.date}</MDBCardText>
                                            {showExplanation && <MDBCardText style={{ fontSize: '10px', color: 'black' }}>
                                                {item.explanation}
                                            </MDBCardText>}
                                            {!item.liked ? <MDBBtn className='mx-2' color='danger' onClick={() => this.likePhoto(index)} >
                                                Like
                                            </MDBBtn> :
                                                <MDBBtn className='mx-2' color='dark' onClick={() => this.likePhoto(index)} >
                                                    Unlike
                                                </MDBBtn>}
                                        </MDBCardBody>
                                    </MDBCard>)
                            })
                            }
                        </div>
                        <MDBModal show={showModal} tabIndex='-1'>
                            <MDBModalDialog>
                                <MDBModalContent>
                                    <MDBModalHeader>
                                        <MDBModalTitle>Controls</MDBModalTitle>
                                        <MDBBtn className='btn-close' color='none' onClick={() => { this.toggleShow() }}></MDBBtn>
                                    </MDBModalHeader>
                                    <MDBModalBody>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <MDBSwitch id='flexSwitchCheckDefault' checked={showExplanation} onClick={() => this.setState({ showExplanation: !showExplanation })} />
                                            <span style={{ fontSize: "18px" }}>Show image explanation</span>
                                        </div>
                                        <span style={{ fontSize: "18px" }}>Select date to browse photos from specific date(s)</span>
                                        <Calendar
                                            value={this.state.dateRange}
                                            onChange={(date) => this.setSelectedDayRange(date)}
                                            colorPrimary="#0fbcf9" // added this
                                            colorPrimaryLight="rgba(75, 207, 250, 0.4)" // and this
                                            shouldHighlightWeekends
                                            maximumDate={maxDate}
                                        />
                                    </MDBModalBody>

                                    <MDBModalFooter>
                                        <MDBBtn color='secondary' onClick={() => { this.toggleShow() }}>
                                            Close
                                        </MDBBtn>
                                        <MDBBtn onClick={() => { this.saveChanges() }}>Save changes</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModalContent>
                            </MDBModalDialog>
                        </MDBModal>

                    </div>}
            </div>
        )
    }

}