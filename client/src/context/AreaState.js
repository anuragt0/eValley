import AreaContext from "./AreaContext";

import {React, useState} from 'react'

const AreaState = (props) => {
    const [area, setArea] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);


  return (


    <AreaContext.Provider value={{area, setArea, isAdmin, setIsAdmin}}>
            {props.children}
    </AreaContext.Provider>


  )
}

export default AreaState