// Basic constants for the prototype
export const CONFIG = Object.freeze({
  MATCH_STATUS: {
    SCHEDULED: 'SCHEDULED',
    LIVE: 'LIVE',
    PAUSED: 'PAUSED',
    FINAL: 'FINAL',
    CLOSED: 'CLOSED'
  },
  EVENT_TYPES: {
    GOAL: 'GOAL',
    ASSIST: 'ASSIST',
    PENALTY: 'PENALTY',
    SHOT_ON_GOAL: 'SOG',
  }
});

export const getLabelByCode = (listName, code) => {
  if (!CONFIG[listName]) return code;
  if (!Array.isArray(CONFIG[listName])) {
    return CONFIG[listName][code] || code;
  }
  const item = CONFIG[listName]?.find(i => i.code === code);
  return item ? item.label : code;
};
