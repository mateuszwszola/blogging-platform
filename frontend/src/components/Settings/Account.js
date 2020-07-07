import React, { useState } from 'react';
import { useDeleteAccount } from 'hooks/useUser';
import UpdatePassword from './UpdatePassword';
import { Button } from 'components/layout/Button';

const Account = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteAccount, { status, error }] = useDeleteAccount();

  const handleAccountDelete = async () => {
    try {
      await deleteAccount();
      window.location.reload();
    } catch (error) {
      setShowDialog(false);
    }
  };

  return (
    <div className="w-full max-w-sm mt-6 lg:mt-0">
      <div>
        <h3 className="text-2xl text-center py-1">Change password</h3>
        <hr />
        <div className="py-4">
          <UpdatePassword />
        </div>
      </div>
      <div className="mt-6">
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
