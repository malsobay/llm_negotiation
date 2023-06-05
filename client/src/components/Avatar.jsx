import React from "react";

const alternative = "beam";
// const alternative = "bauhaus";
// const alternative = "pixel";
// const alternative = "personas";
// const alternative = "ring";
// const alternative = "sunset";
// const alternative = "marble";

// index is used to distinguish between the players.
// currently used with self=0, other=1.
export function Avatar({ playerId, index, size = 40 }) {
  let src;
  switch (alternative) {
    case "beam":
    case "bauhaus":
    case "pixel":
    case "ring":
    case "sunset":
    case "marble": {
      const colors = [
        "ef476f,ffd166,06d6a0,118ab2,073b4c",
        "8ecae6,219ebc,023047,ffb703,fb8500",
      ];
      const color = colors[index] || colors[0];
      src = `https://source.boringavatars.com/${alternative}/${size}/${playerId}11?colors=${color}`;
      break;
    }
    case "personas": {
      const colors = ["b6e3f4", "ffdfbf"];
      const backgroundColor = colors[index] || colors[0];
      const src = `https://api.dicebear.com/6.x/personas/svg?seed=${playerId}&backgroundType=gradientLinear&eyes=sunglasses&mouth=smile&backgroundColor=${backgroundColor}`;
      break;
    }
    default:
      throw new Error(`Unknown alternative: ${alternative}`);
  }

  return (
    <img
      className="h-full w-full overflow-hidden rounded-full"
      src={src}
      alt="Avatar"
    />
  );
}
