import React from 'react';
import { useQuery } from "urql";
import { useDispatch } from "react-redux";
import * as actions from "../store/actions";



const metricQuery = `query{
  getMetrics
}`

function SearchBar(props) {

  const [result] = useQuery({
    query: metricQuery
  });

  const dispatch = useDispatch();
  const { fetching, data } = result;

  return !fetching ? generateDropdown(data) : "loading..."

  function generateDropdown(data) {
    if (!data) return []
    let options = []
    data.getMetrics.forEach((option) => {
      options.push({ name: option, value: option })
    })

    return (
      <div>
        <select onChange={(e) => {
          dispatch({ type: actions.MEASUREMENT_TYPE_SELECT, metric: e.target.value });
        }}>
          <option value="none" selected disabled hidden>
            Select an Option
          </option>
          {
            data.getMetrics.map(option => <option value={option}>{option}</option>)
          }
        </select>
      </div>
    )
  }
}

export default SearchBar



