"use client";

import { useState } from "react";

interface UserAvatarProps {
  picture?: string;
  name: string;
  username: string;
  size?: number;
  className?: string;
}

const UserAvatar = ({
  picture,
  name,
  username,
  size = 40,
  className = "",
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Check if picture is valid (not empty, not default placeholder)
  const isValidPicture = (pic?: string): boolean => {
    if (!pic || pic.trim() === "") return false;
    if (pic.includes("avatar.svg")) return false;
    if (pic.includes("default-avatar")) return false;
    return true;
  };

  const hasValidPicture = isValidPicture(picture) && !imageError;

  // Get first letter of username for fallback
  const getInitial = () => {
    if (username && username.length > 0) {
      return username.charAt(0).toUpperCase();
    }
    if (name && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Generate background color from username
  const getBackgroundColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];

    const charCode = username ? username.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  if (hasValidPicture) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={picture!}
        alt={name || username}
        className={`rounded-full object-cover ${className}`}
        onError={(e) => {
          console.log("Image load error for:", picture);
          setImageError(true);
        }}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      />
    );
  }

  // Fallback: Show initial letter
  return (
    <div
      className={`${getBackgroundColor()} flex items-center justify-center rounded-full text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {getInitial()}
    </div>
  );
};

export default UserAvatar;
