import React from 'react';
import { useAlert } from 'context/AlertContext';
import { InfoIcon, LikeIcon } from 'icons';

function Alert(props) {
  const { alerts } = useAlert();

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="z-50 fixed right-0 top-0 mt-16">
      <div className="flex flex-col space-y-4 w-56 mt-4 mr-4">
        {alerts.map(({ id, alertType, msg }) => (
          <div
            key={id}
            role="alert"
            className={`rounded-l shadow-md border-r-4 ${
              alertType === 'success'
                ? 'bg-green-100 border-green-400'
                : 'bg-red-100 border-red-400'
            }`}
          >
            <div className="p-1 flex items-center">
              <div>
                {alertType === 'success' ? (
                  <LikeIcon className="w-10 h-10 fill-current text-green-400" />
                ) : (
                  <InfoIcon className="w-10 h-10 fill-current text-red-400" />
                )}
              </div>
              <div
                className={`w-full text-center font-semibold ${
                  alertType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {msg}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alert;
