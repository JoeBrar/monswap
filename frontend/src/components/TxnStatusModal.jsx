import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { GoCheckCircleFill } from "react-icons/go";
import { IoClose } from 'react-icons/io5';
import { CgSpinner } from "react-icons/cg";
import { CgInfo } from "react-icons/cg";
import { AiFillCloseCircle } from "react-icons/ai";

const TxnStatusModal = ({ status, onClose }) => {
  if (!status.show) {
    return null;
  }

  const isLoading = status.stage === 'initiating' || status.stage === 'awaitingConfirmation' || status.stage === 'userTxSuccess'
  const showWarning=status.stage==='initiating' || status.stage==='awaitingConfirmation' || status.stage==='userTxSuccess'
  const showCloseBtn=status.stage==='initiating' || status.stage==='monTxSuccess' || status.stage==='userTxFailed' || status.stage==='insufficientMonSupply'

  let title = '';
  let content = null;

  const TxnErrorText = ({ error }) => {
    const [expanded, setExpanded] = useState(false);
    if (!error) return null;
    const isLong = error.length > 68;
    const displayText = !isLong || expanded ? error : error.slice(0, 68) + '...';
    return (
      <>
        <p className="text-sm text-gray-600 whitespace-pre-wrap"><span className='font-semibold'>Error : </span>{displayText}</p>
        {isLong && (
          <button
            className="text-blue-500 hover:underline text-xs mt-0"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'See less' : 'See more'}
          </button>
        )}
        <div className='mt-6 gap-3 flex items-start'>
          <CgInfo size={40} className='text-red-800 mt-[-7px] min-w-[24px]'  />
          <p className='text-sm text-red-800 text-left'>If payment has been made, please contact us. We will verify and process a refund.</p>
        </div>
      </>
    );
  }

  switch (status.stage) {
    case 'initiating':
      title = 'Confirm Transaction';
      content = (
        <p className="text-md text-gray-600 mb-3">Please confirm the transaction from your wallet</p>
      );
      break;
    case 'awaitingConfirmation':
      title = 'Processing';
      content = (
        <p className="text-md text-gray-600 mb-3">Please wait while we verify your transaction</p>
      );
      break;
    case 'userTxSuccess':
      title = 'Sending MON';
      content = (
        <p className="text-md text-gray-600 mb-3">Please wait while we send MON to your wallet</p>
      );
      break;
    case 'monTxSuccess':
      title = 'Successful';
      content = (
        <>
          <GoCheckCircleFill className="text-green-600 text-[90px] mb-4" />
          <p className="text-md text-gray-600 mb-3">You have successfully received {status.monAmount} MON</p>
          <div className='flex flex-col gap-1 text-left border-1 border-gray-300 rounded-md p-2'>
            <p className='text-sm text-gray-600 text-nowrap font-semibold'>Txn Hash</p>
            <p className='text-xs text-gray-600 break-all text-left'>{status.txHash}</p>
          </div>
          {/* Assuming a similar explorer for Monad, adjust if necessary */}
          {status.txHash && (
             <a 
              href={`https://testnet.monadexplorer.com/tx/${status.txHash}`}  /* Update with actual Monad explorer URL structure */
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm mt-2"
            >
              View on Monad Explorer
            </a>
          )}
        </>
      );
      break;
    case 'userTxFailed':
      title = 'Transaction Failed';
      content = (
        <>
          <AiFillCloseCircle className="text-red-500 text-8xl mb-4" />
          <TxnErrorText error={status.error} />
        </>
      );
      break;
    case 'insufficientMonSupply':
      title = 'Timeout';
      content = (
        <>
          <CgInfo size={70} className='text-red-400 mt-2 mb-3'  />
          <p className="text-md text-gray-600 mb-3">Please refresh the page and try again after 15 seconds.</p>
        </>
      );
      break;
    default:
      title = 'Processing';
      content = <p className="text-sm text-gray-600 whitespace-pre-wrap">Please wait while we process your transaction</p>;
  }

  return (
    <div className="fixed inset-0 bg-[#00000073] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative border-[3px] border-green-400">
        {showCloseBtn && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-gray-700"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        )}
        <div className="flex flex-col items-center text-center mt-2 gap-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          {isLoading && (
            <div className="mb-4">
              <CgSpinner className="rotating-item" size={100} color='#5456c4' />
            </div>
          )}
          {content}
          {showWarning && (
            <div className='p-3 border-1 border-red-600 rounded-md'>
              <p className="text-xs text-red-600 font-semibold"><span className='font-semibold'>IMPORTANT:</span> Do not close this window or refresh the page until process is complete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TxnStatusModal; 