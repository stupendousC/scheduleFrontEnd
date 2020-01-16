import React, { useState } from 'react';
import axios from 'axios';

import Accordion from 'react-bootstrap/Accordion';
import Calendar from 'react-calendar';
import CalendarDay from './EmployeeDash_CalendarDay';

import { convertToPST, formatDate, convertDateString, dateInThePast } from './Helpers';

const CalendarTab = ({URL, empUnavails, empShifts, daySpotlight, shiftsToday, shiftsOfDay, availStatusOfDay, unstaffedShifts, updateStateForCalendarDayCB, toggleAvailCallback}) => {
  const today = new Date();

  const isDateInEmpUnavails = (targetDate) => {
    for (const shiftObj of empUnavails) {
      if (shiftObj.day_off === targetDate) { return true }
    }
    return false;
  }

  const isDateInEmpShifts = (targetDate) => {
    for (const shiftObj of empShifts) {
      if (shiftObj.shift_date === targetDate) { return true }
    }
    return false;
  }
  

  const tileContent = ({ date, view }) => {
    let tileCaption = " - ";
    let tileClassName = "";
    
    const targetDate = convertDateString(date);
    // <Calendar> will iterate thru each date in the display month
      // if employee is working that day -> green background
      // if employee is unavailable that day -> red background
      // These 2 conditions below supersedes the 2 above
      // if date is in the past -> gray background
      // if it's on today -> gold background
    
    if (isDateInEmpUnavails(targetDate)) {
      tileCaption = "OFF";
      tileClassName = "tile-unavail";
    } else if (isDateInEmpShifts(targetDate)) {
      tileCaption = "ON";
      tileClassName = "tile-work";
    } else {
      // left room here for future customization
    }
  
    // I want tile-today's css to override any of the prev
    if (dateInThePast(targetDate)) {
      tileCaption = " x ";
      tileClassName = "tile-past";
    } else if (targetDate === convertDateString(today)) {
      tileCaption = "TODAY";
      tileClassName = "tile-today";
    }


    if (view === "month") {
      return (
        <section className={tileClassName}>{tileCaption}</section>
      );
    } 
    // if view !== monthly, we don't need the colored tiles when looking at the year as a whole
    // there's no daily view here
  }



  /////////// render ////////////
  return(
    <section>
      <Calendar tileContent={tileContent} onChange={updateStateForCalendarDayCB} value={convertToPST(daySpotlight)}/>
      <CalendarDay toggleAvailCallback={toggleAvailCallback} shiftsToday={shiftsToday} shiftsOfDaySpotlight={shiftsOfDay} dateStr={daySpotlight} availStatus={availStatusOfDay}/>
    </section>
  );

}

// showCalendar = () => {
  // const tileContent = ({ date, view }) => {
  //   return (
  //     <section>
  //       {date.getDay() === 0 ? <p className="blue-bg">Sun</p> : <p> </p>}
  //       {date.getDay() === 1 ? <p className="gray-bg">Mon</p> : <p> </p>}
  //     </section>);
  // }

//   return (
//     <section>
//       <Calendar tileContent={tileContent} onChange={this.updateStateForCalendarDay} value={convertToPST(this.state.daySpotlight)}/>
//       <CalendarDay toggleAvailCallback={this.toggleAvail} today={this.state.today} shiftsToday={this.state.shiftsToday} shiftsOfDaySpotlight={this.state.shiftsOfDay} dateStr={this.state.daySpotlight} availStatus={this.state.availStatusOfDay}/>
//     </section>
//   );
// }


export default CalendarTab;