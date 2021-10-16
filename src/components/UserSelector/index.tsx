import React, { useState, useEffect } from "react";
import "./styles.css";

interface UserSelectorProps {
  label: string;
  users: any[];
  onChange: (users: any[]) => void;
}

const UserSelector = ({ label, users, onChange }: UserSelectorProps) => {
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    onChange(selectedUsers);
  }, [onChange, selectedUsers]);

  const handleUserSelection = (user: any, del: boolean = false) => {
    setDropdownOpen(!isDropdownOpen);
    if (selectedUsers.find((u) => u.id === user.id)) {
      if (del) {
        setSelectedUsers(
          [...selectedUsers].filter((assigned) => assigned.id !== user.id)
        );
      }
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
  };

  return (
    <div className="selector-container">
      <label>{label}</label>
      <div className="dropdown">
        <div
          className="dropdown-text"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          Select User:
        </div>
        {isDropdownOpen && (
          <ul className="shadow">
            {users.map((user) => {
              return (
                <li
                  key={user.id}
                  value={user.id}
                  onClick={() => handleUserSelection(user)}
                >
                  {user.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {selectedUsers.length > 0 && (
        <div className="user-section shadow-inset">
          {selectedUsers.map((user) => {
            return (
              <div key={user.id} className="shadow chip">
                {user.name}
                <span
                  className="chip-delete"
                  onClick={() => handleUserSelection(user, true)}
                >
                  x
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserSelector;
