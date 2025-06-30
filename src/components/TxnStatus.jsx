import React from 'react'

const TxnStatus = ({status}) => {
  return(
    <>
      <div className={`status-container ${status.isError ? 'error' : 'success'}`}>
        <div className="status-text">{status.message}</div>
      </div>
    </>
  ) 
}

export default TxnStatus