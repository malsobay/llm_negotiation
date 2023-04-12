import React from "react";

export function Avatar({ player }) {
  // console.log("calling avatar function")
  // console.log(player.id)
  return (
    <img
      className="h-full w-full rounded-md shadow bg-white p-1"
      src={`https://avatars.dicebear.com/api/identicon/${player.id}.svg`}
      alt="Avatar"
    />
  );
}
