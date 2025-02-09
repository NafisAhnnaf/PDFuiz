import React from 'react'

const Button = ({name, type, func}) => {
  return (
    <button onClick={func} className={`${type} rounded-xl px-3 py-2`}>{name}</button>
  )
}

export default Button