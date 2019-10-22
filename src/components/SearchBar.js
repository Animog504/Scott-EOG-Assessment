import React, { useState, useEffect } from 'react';
import { useQuery, createClient, Provider } from "urql";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";



const metricQuery = `query{
  getMetrics
}`

function SearchBar(props) {

  const [result] = useQuery({
    query: metricQuery
  });

  const dispatch = useDispatch();
  const selectedMetrics = useSelector(state => state.metrics)
  const { fetching, data, error } = result;

  return !fetching ? generateDropdown(data) : "loading..."

  function generateDropdown(data) {
    if (!data) return []
    let options = []
    data.getMetrics.forEach((option) => {
      options.push({ name: option, value: option })
    })

    
     
    return (
      <div>
        {/* <Multiselect options={options} onSelectOptions={([value])=>{
          dispatch({ type: actions.MEASUREMENT_TYPE_SELECT, metric: value});
        }}  /> */}
        <select onChange={(e) => {
          dispatch({ type: actions.MEASUREMENT_TYPE_SELECT, metric: e.target.value });
        }}>
          {
            data.getMetrics.map(option => <option value={option}>{option}</option>)
          }
        </select> 
        
        {/* <div>
          Selected Measurements:
          {
            selectedMetrics.map(metric => <div>{metric}</div>)
          }
        </div> */}
      </div>
    )
  }
}

export default SearchBar



