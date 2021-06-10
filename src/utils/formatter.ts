export const formatName = (name: string): string => {
  const nameArr = name.split(" ");
  let newName = "";

  nameArr.forEach((v, i) => {
    if (i < 2) {
      newName += v + " ";
    } else {
      newName += v.charAt(0) + ". ";
    }
  });

  return newName;
};
