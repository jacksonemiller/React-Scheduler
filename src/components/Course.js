import React, { useRef } from 'react';
import { hasConflict, getCourseTerm } from '../utilities/times.js';
import useDoubleClick from 'use-double-click';
import { timeParts } from '../utilities/times.js';
import { setData, useUserState } from '../utilities/firebase.js';

const getCourseNumber = course => (
    course.id.slice(1, 4)
  );

const toggle = (x, lst) => (
    lst.some(y => y.id === x.id) ? lst.filter(y => y.id !== x.id) : [x, ...lst]
  );

const getCourseMeetingData = course => {
    const meets = prompt('Enter meeting data: MTuWThF hh:mm-hh:mm', course.meets);
    const valid = !meets || timeParts(meets).days;
    if (valid) return meets;
    alert('Invalid meeting data');
    return null;
  };

const reschedule = async (course, meets) => {
    if (meets && window.confirm(`Change ${course.id} to ${meets}?`)) {
      try {
        await setData(`/courses/${course.id}/meets`, meets);
      } catch (error) {
        alert(error);
      }
    }
  };

const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.some(other => other.id === course.id);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const [user] = useUserState();
    const style = {
      backgroundColor: isDisabled? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };

    const clickRef = useRef();
    useDoubleClick({
        onSingleClick: isDisabled ? null : () => setSelected(toggle(course, selected)),
        onDoubleClick: !user ? null : () => {reschedule(course, getCourseMeetingData(course))},
        ref: clickRef,
        latency: 250
    });

    return (
      <div className="card m-1 p-2" 
        style={style}
        ref={clickRef}>
        <div className="card-body">
          <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
          <div className="card-text">{ course.title }</div>
          <div className="card-text">{ course.meets }</div>
        </div>
      </div>
    );
  };

  export default Course;