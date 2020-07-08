import React, { useState } from 'react';
import { useDeleteAccount } from 'hooks/useUser';
import UpdatePassword from './UpdatePassword';
import { Button } from 'components/layout/Button';

const Account = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteAccount, { isError }] = useDeleteAccount();

  const handleAccountDelete = async () => {
    try {
      await deleteAccount();
      window.location.reload();
    } catch (error) {
      setShowDialog(false);
    }
  };

  return (
    <div className="w-full max-w-md mt-6 lg:mt-0 bg-white shadow-md rounded-lg py-4 px-2 lg:px-4 xl:px-8">
      <div>
        <h3 className="text-2xl text-center py-1">Change password</h3>
        <hr />
        <div className="py-4 max-w-sm mx-auto">
          <UpdatePassword />
        </div>
      </div>
      <div className="mt-6">
        {isError && (
          <p className="text-center text-red-500">
            There was a problem deleting your account
          </p>
        )}
        <h3 className="text-2xl text-center py-1">Delete account</h3>
        <hr />
        <div className="flex flex-col items-center mt-4">
          {!showDialog ? (
            <Button
              size="base"
              version="delete"
              fullRounded
              onClick={() => setShowDialog(true)}
            >
              Delete your account
            </Button>
          ) : (
            <div className="w-full">
              <p className="font-semibold py-2">
                This action cannot be undone. Are you sure?
              </p>
              <div className="space-x-4">
                <Button version="delete" onClick={handleAccountDelete}>
                  Confirm
                </Button>
                <Button version="basic" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
