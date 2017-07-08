export const jobList = ['Barbarian', 'Mage', 'Hunter'];
export const userNameList = ['Bob', 'Mike', 'Owl', 'Willy', 'Noah', 'Hawk'];
export const maxUserLv = 20;
export const minUserLv = 1;
export const maxItemLv = 20;
export const minItemLv = 1;
export const itemAttrs = [ 'strength', 'dexerity', 'intelligence', 'vitality'];
export const minItemAttrs = 0;
export const itemAttrLimit = 4;
export const itemNameList = ['Sword', 'Spear', 'Dagger', 'Huge Sword', 'Wand'];
export const DB_URL = 'mongodb://localhost:27017/demo';
export const PORT = 3000;
export const itemQueryPatterns = {
  'Barbarian': { strength: -1, vitality: -1},
  'Mage': { intelligence: -1, vitality: -1},
  'Hunter': { dexerity: -1, vitality: -1},
};
