import React, { useState, useEffect } from 'react';
import { useQuery, createClient, Provider } from "urql";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";

const metricQuery = `query{
  getMetrics
}`

function SearchBar(props){



    console.log("searchBar Props:",props)



    const client = createClient({
      url: "https://react.eogresources.com/graphql"
    });

    const [result] = useQuery({
      query: metricQuery
    });

    const dispatch = useDispatch();
    const selectedMetrics = useSelector(state => state.metrics)
    // console.log("selectedMetrics:", selectedMetrics)

    const { fetching, data, error } = result;
    
    return !fetching ? generateDropdown(data) : "loading or something idk"

    //hardcoding in the values until we figure how to pass these dynamically
    function generateDropdown(data){
      // console.log("result is:", result[0])
      console.log("data is:",data)
      // debugger
      if(!data) return []
      let options = []
      data.getMetrics.forEach((option)=> {
        options.push({name: option.name, value: option.name})
      })
      
      return (
      <div>
        <select onChange={(e) => {
          dispatch({ type: actions.MEASUREMENT_TYPE_SELECT, metric: e.target.value });
        }}>
          {
            data.getMetrics.map(option => <option value={option}>{option}</option>)
          }
        </select>
        <div>
          Selected Measurements:
          {
            selectedMetrics.map(metric => <div>{metric}</div>)
          }
        </div>
      </div>
      )
    }
  }

export default SearchBar
  


