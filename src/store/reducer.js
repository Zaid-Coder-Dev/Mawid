import data from "../data/db.json";

const initialState = data;

function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default reducer;