/*
Redux 사용하는 이유
    - Component 집합을 관리하기 편하게 하기 위해 사용
    - 자식 Component는 부모 Component와만 대화한다. 형제끼리는 대화하지 않음.
*/

import { combineReducers } from "redux";
// import user from './user_reducer'

const rootReducer = combineReducers({

})

export default rootReducer;