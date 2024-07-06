import React from 'react'

const Alert = (props) => {
    const capitalize = (word)=>{
        if(word==="dange"){
            word="error"
        }
        const msg = word.toLowerCase();
        return msg.charAt(0).toUpperCase() + msg.slice(1);
    }
    if(props.alert !== null){
        return (
            <div>
                <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                    <strong>{capitalize(props.alert.type)}</strong>: {props.alert.message}
                </div>
            </div>
        )
    }
}
export default Alert

