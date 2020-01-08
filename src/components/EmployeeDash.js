import React from 'react';
import Calendar from 'react-calendar';
import CalendarDay from './EmployeeDash_CalendarDay';
import Error from './Error';
import axios from 'axios';
import ShiftsTable from './EmployeeDash_ShiftsTable';
import { convertDateString, formatDate } from './Helpers';

//https://www.hobo-web.co.uk/best-screen-size/  
// 360x640
// 1366 x 768
// 1920x1080   

// const EMP_DASH = process.env.REACT_APP_EMP_DASH+"/"+this.state.empInfo.id;
const EMP_DASH = process.env.REACT_APP_EMP_DASH+"/"+sessionStorage.getItem('databaseId');

export default class EmployeeDash extends React.Component {

  constructor() {
    super()
    const today = convertDateString(new Date())
    this.state = {
      empInfo: [],
      empUnavails: [],
      empShifts: [],
      daySpotlight: today,
      shiftsOfDay: [],
      availStatusOfDay: null,
      show: 'calendar'
    }
  }

  getEmpInfo = () => axios.get(EMP_DASH);
  getEmpShifts = () => axios.get(EMP_DASH+"/shifts");
  getEmpUnavails = () => axios.get(EMP_DASH+"/unavails");
  
  componentDidMount() {
    if (this.props.authenticatedRole !== "EMPLOYEE") {
      console.log("\n\nYou are *NOT* an employee!!!!");
      return;
    }

    // initial loading of data from database
    axios.all([this.getEmpInfo(), this.getEmpShifts(), this.getEmpUnavails()])
      .then(axios.spread((...responses) => {
        const empInfo = responses[0].data;
        const empShifts = responses[1].data;
        const empUnavails = responses[2].data;

        // meanwhile find out if there's any shifts to autoload for today's calendar
        const today = convertDateString(new Date());
        const shiftsToday = empShifts.filter( shift => shift.shift_date === today );
        // also find out if need to autoload if today is a day off
        const canWorkBool = this.canTheyWorkThisDay(today, shiftsToday, empUnavails);

        this.setState({
          empInfo: empInfo,
          empShifts: empShifts,
          empUnavails: empUnavails,
          shiftsOfDay: shiftsToday,
          availStatusOfDay: canWorkBool
        });
      }))
      .catch(errors => {
        console.log(errors);
        // const empInfoError = errors[0].message;
        // const empShiftsError = errors[1].message;
        // const empUnavailsError = errors[2].message;
        // console.log(`empInfoError = ${empInfoError}\nempShiftsError = ${empShiftsError}\nempUnavailsError = ${empUnavailsError}`)
      })
  }
  
  ////////////////////// set DISPLAY choice //////////////////////
  setShowCategory = (chosen) => this.setState({show: chosen});

  showChosenCategory = () => {
    const chosen = this.state.show;
    
    if (chosen === "calendar") {
      return this.showCalendar();
    } else if (chosen === "shifts") {
      return this.showAllShifts();
    } else if (chosen === "unavails") {
      return this.showAllUnavails();
    } else if (chosen === "info") {
      return this.showAllInfo();
    }
  }

  ////////////////////// DISPLAY: own info //////////////////////
  showAllInfo = () => {
    const info = this.state.empInfo;
    
    return(
      <section>   
        <form>
          <fieldset>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" placeholder={info.name}/>
              <label>Address</label>
              <input type="text" className="form-control" placeholder={info.address}/>
              <label>Phone</label>
              <input type="text" className="form-control" placeholder={info.phone}/>
              <label>Email</label>
              <input type="text" className="form-control" placeholder={info.email}/>
            </div>
            <button onClick={this.update} className="btn btn-primary">READ ONLY FOR NOW (updates planned for future release)</button>
          </fieldset>
        </form>
      </section>
    );
  }

  update = (e) => {
    e.preventDefault();
    console.log("TODO: UPDATE");
  }

  ////////////////////// DISPLAY: own shifts //////////////////////

  showAllShifts = () => {
    return (<ShiftsTable allShifts={this.state.empShifts}/>);
  }

  ////////////////////// DISPLAY: own unavails //////////////////////
  showAllUnavails = () => {
    const empUnavails = this.state.empUnavails;
    const sortedByDate = empUnavails.sort((a,b) => b.day_off - a.day_off);
    console.log("should be sorted...", sortedByDate);
    
    if (empUnavails.length === 0) {
      return (
        <section>No upcoming unavailable days</section>
      );
    } else {
      return(
      <section>
        It'd be nice to sort these, and to hide all the ones in the past, can click on them if u really want to
        {sortedByDate.map(unavail => {return <li key = {unavail.id}>{formatDate(unavail.day_off)}</li>})}
      </section>
    );
    }
  }
  
  ////////////////////// DISPLAY: calendar  //////////////////////
  showCalendar = () => {
    return (
      <section>
        <Calendar onChange={this.updateStateForCalendarDay} value={new Date()}/>
        <CalendarDay toggleAvailCallback={this.toggleAvail} basicShiftInfo={this.state.shiftsOfDay} dateStr={this.state.daySpotlight} completeShiftsInfo={this.getCompleteShiftsInfo} availStatus={this.state.availStatusOfDay}/>
      </section>
    );
  }

  updateStateForCalendarDay = (e) => {
    console.log("\nYOU CLICKED ON ", e)
    const dateStr = convertDateString(e);

    const shiftsOfDay = this.state.empShifts.filter( shift => shift.shift_date === dateStr);
    const canWorkBool = this.canTheyWorkThisDay(dateStr, shiftsOfDay, this.state.empUnavails);
    this.setState({ 
      daySpotlight: dateStr, 
      shiftsOfDay: shiftsOfDay, 
      availStatusOfDay: canWorkBool })
  }

  getCompleteShiftsInfo = () => {
    // need to get client name & STUFF
  }

  canTheyWorkThisDay = (dateStr, shiftsOfThatDay, unavails_list) => {
    // are you already working today?
    if (shiftsOfThatDay.length > 0) {
      return false;
    }
    // do u have today off?
    for (const unavail of unavails_list) {
      if (unavail.day_off === dateStr) {
        return false;
      }
    }
    return true;
  }

  ////////////////////// toggleAvail //////////////////////
  toggleAvail = (availBoolean) => {
    console.log("empDash to toggleAvail() to backend to set avail to:", availBoolean, "for", this.state.daySpotlight);

    let latestEmpUnavails = [...this.state.empUnavails];

    if (availBoolean) {
      // emp wants to work -> delete row from unavails table in db
      // find id from this.state.empUnavails
      const unavailObj = this.state.empUnavails.find( unavail => unavail.day_off === this.state.daySpotlight );
      axios.delete(EMP_DASH + `/unavails/${unavailObj.id}`)
      .then( response => {
        // quick update on front end to match db
        // latestEmpUnavails = this.state.empUnavails.filter( unavail => { return unavail.day_off !== this.state.daySpotlight });
        console.log("back end sending...", response.data);
        this.setState({ empUnavails: response.data });
      })  
      .catch(error => console.log("ERROR deleting from db: ", error.message));
      
    } else {
      // emp wants day off -> post/add to unavails table in db
      axios.post((EMP_DASH + `/unavails`), { employee_id: this.state.empInfo.id, day_off: this.state.daySpotlight })
      .then( response => {
        // quick update on front end to match db
        latestEmpUnavails.push( response.data );
        console.log("latestEmpUnavails... ", latestEmpUnavails);
        this.setState({ empUnavails: latestEmpUnavails });
      } )   
      .catch(error => console.log("ERROR adding to db: ", error.message));
    }
  }

  ////////////////////// render //////////////////////
  render() {
      return (
        <section>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button className="nav-link active" onClick={()=>this.setShowCategory('calendar')}>CALENDAR</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={()=>this.setShowCategory('shifts')}>SHIFTS</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={()=>this.setShowCategory('unavails')}>UNAVAILABLE DAYS</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={()=>this.setShowCategory('info')}>INFO</button>
            </li>
          </ul>

          {this.props.authenticatedRole === "EMPLOYEE" ? this.showChosenCategory() : <Error message="You need to log in first to see EMPLOYEE dashboard"/>}  

        </section>
      );
    }
}

