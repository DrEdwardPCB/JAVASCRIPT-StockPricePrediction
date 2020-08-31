import React, { useState, useEffect } from 'react'
const ResizeableDiv = (props) => {
    const [style, setStyle] = useState({
        position:'relative',
        width: '1980px',
        height: '600px'
    })
    useEffect(() => {
        setStyle(
            {
                position: 'relative',
                width: props.width+'px',
                height: props.height+'px'
            }
        )
    }
        , [props])
    return (<div style={style}>{props.children}</div>)
}
export default ResizeableDiv