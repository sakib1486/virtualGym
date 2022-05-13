/* eslint-disable indent */
export const gameTypeRendering = (gameType) => {
  switch (gameType) {
    case "balloons":
      return "Balloons";
    case "archery":
      return "Archery";
    case "slide-saber":
      return "Slide Saber";
    case "climbing":
      return "Climbing";
    case "flying-rings":
      return "Flying Rings";
    case "bubbles":
      return "Bubbles";
    default:
      return null;
  }
};
