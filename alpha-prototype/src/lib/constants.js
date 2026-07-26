/**
 * IJSHOCKEY PLATFORM - IMMUTABLE CONSTANTS & SYSTEM CODES
 * Regel: Wijzig NOOIT de 'code' waarden. Deze worden gebruikt in Firestore & Google Sheets.
 * Alleen de 'label' waarden mogen worden aangepast voor de UI.
 */

export const CONFIG = Object.freeze({

  // --- 1. PERSONEN & GEBRUIKERS ---

  ROLES: [
    { code: 'SUPER_ADMIN', label: 'Super Beheerder' },
    { code: 'PLATFORM_ADMIN', label: 'Platform Beheerder' },
    { code: 'TEAM_MANAGER', label: 'Team Manager' },
    { code: 'COACH', label: 'Coach' },
    { code: 'PLAYER', label: 'Speler' },
    { code: 'FAN', label: 'Fan' }
  ],

  SHOOTS: [
    { code: 'L', label: 'Left' },
    { code: 'R', label: 'Right' }
  ],

  POSITIONS: [
    { code: 'LW', label: 'Left Wing', category: 'FORWARD' },
    { code: 'C',  label: 'Center', category: 'FORWARD' },
    { code: 'RW', label: 'Right Wing', category: 'FORWARD' },
    { code: 'LD', label: 'Left Defense', category: 'DEFENSE' },
    { code: 'RD', label: 'Right Defense', category: 'DEFENSE' },
    { code: 'G',  label: 'Goaltender', category: 'GOALIE' }
  ],

  // --- 2. ORGANISATIES, TEAMS & COMPETITIES ---

  ORG_TYPES: [
    { code: 'FEDERATION', label: 'IJshockeybond' },
    { code: 'CLUB', label: 'Club / Vereniging' },
    { code: 'SPONSOR', label: 'Sponsor' },
    { code: 'BRAND', label: 'Merk' }
  ],

  TEAM_CATEGORIES: [
    { code: 'SENIOR', label: 'Senioren' },
    { code: 'U23', label: 'Onder 23' },
    { code: 'U20', label: 'Onder 20' },
    { code: 'U18', label: 'Onder 18' },
    { code: 'U16', label: 'Onder 16' },
    { code: 'WOMEN', label: 'Dames' },
    { code: 'RECREANTS', label: 'Recreanten' }
  ],

  COMP_TYPES: [
    { code: 'LEAGUE', label: 'Reguliere Competitie' },
    { code: 'TOURNAMENT', label: 'Toernooi' },
    { code: 'CUP', label: 'Bekercompetitie' }
  ],

  // --- 3. WEDSTRIJDEN & EVENTS ---

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
    SAVE: 'SAVE',
    TIMEOUT: 'TIMEOUT',
    PERIOD_START: 'P_START',
    PERIOD_END: 'P_END',
    GAME_END: 'G_END',
    HIT: 'HIT',
    BLOCK: 'BLOCK',
    FACEOFF_WON: 'FACEOFF_WON'
  },

  PENALTIES: [
    { code: 'TRIP',  label: 'Tripping', defaultMin: 2 },
    { code: 'HOOK',  label: 'Hooking', defaultMin: 2 },
    { code: 'SLASH', label: 'Slashing', defaultMin: 2 },
    { code: 'CROSS', label: 'Cross-checking', defaultMin: 2 },
    { code: 'ROUGH', label: 'Roughing', defaultMin: 2 },
    { code: 'BOARD', label: 'Boarding', defaultMin: 2 },
    { code: 'CHARG', label: 'Charging', defaultMin: 2 },
    { code: 'HIGH',  label: 'High-sticking', defaultMin: 2 },
    { code: 'INTER', label: 'Interference', defaultMin: 2 },
    { code: 'MISC',  label: 'Game Misconduct', defaultMin: 10 },
    { code: 'MATCH', label: 'Match Penalty', defaultMin: 20 }
  ],

  LINEUP_ROLES: [
    { code: 'STARTER', label: 'Starting Lineup' },
    { code: 'BENCH', label: 'Bench' },
    { code: 'SCRATCH', label: 'Healthy Scratch' }
  ],

  OFFICIAL_ROLES: [
    { code: 'REFEREE', label: 'Scheidsrechter (Referee)' },
    { code: 'LINESMAN', label: 'Lijnrechter (Linesman)' }
  ],

  // --- 4. STATUSCODES (MEDISCH, CONTRACT, RSVP) ---

  RSVP_STATUS: [
    { code: 'ATTENDING', label: 'Aanwezig' },
    { code: 'NOT_ATTENDING', label: 'Afwezig' },
    { code: 'TENTATIVE', label: 'Misschien' },
    { code: 'NO_RESPONSE', label: 'Nog niet gereageerd' }
  ],

  INJURY_STATUS: [
    { code: 'ACTIVE', label: 'Geblesseerd' },
    { code: 'DAY_TO_DAY', label: 'Dag-tot-dag' },
    { code: 'RECOVERED', label: 'Hersteld' }
  ],

  CONTRACT_STATUS: [
    { code: 'ACTIVE', label: 'Actief' },
    { code: 'EXPIRED', label: 'Verlopen' },
    { code: 'TERMINATED', label: 'Ontbonden' }
  ],

  DISCIPLINE_STATUS: [
    { code: 'ONGOING', label: 'Actieve Schorsing' },
    { code: 'COMPLETED', label: 'Uitgezeten' },
    { code: 'APPEAL', label: 'In Beroep' }
  ],

  TRANSFER_STATUS: [
    { code: 'PENDING', label: 'In afwachting' },
    { code: 'COMPLETED', label: 'Afgerond' },
    { code: 'CANCELLED', label: 'Geannuleerd' }
  ],

  // --- 5. SOCIAL, MARKTPLAATS & FINANCIËN ---

  POST_TYPES: [
    { code: 'NEWS', label: 'Nieuwsbericht' },
    { code: 'UPDATE', label: 'Update' },
    { code: 'ANNOUNCEMENT', label: 'Aankondiging' },
    { code: 'RESULT', label: 'Uitslag' },
    { code: 'MEDIA', label: 'Foto/Video' }
  ],

  CHANNEL_TYPES: [
    { code: 'TEAM', label: 'Team Chat' },
    { code: 'CLUB', label: 'Club Chat' },
    { code: 'COACHES', label: 'Coaches Chat' }
  ],

  CONDITION_CODES: [
    { code: 'NEW', label: 'Nieuw' },
    { code: 'USED', label: 'Gebruikt' }
  ],

  LISTING_STATUS: [
    { code: 'ACTIVE', label: 'Te Koop' },
    { code: 'SOLD', label: 'Verkocht' },
    { code: 'REMOVED', label: 'Verwijderd' }
  ],

  TRANSACTION_STATUS: [
    { code: 'PENDING', label: 'In Behandeling' },
    { code: 'COMPLETED', label: 'Betaald' },
    { code: 'FAILED', label: 'Mislukt' }
  ],

  SUBSCRIPTION_STATUS: [
    { code: 'ACTIVE', label: 'Actief' },
    { code: 'CANCELED', label: 'Geannuleerd' },
    { code: 'PAST_DUE', label: 'Betalingsachterstand' }
  ],

  // --- 6. UNIEKE BADGES ---

  BADGES: [
    { code: 'BADGE_HAT_TRICK', label: 'Hat Trick Hero' },
    { code: 'BADGE_50_GOALS',  label: '50 Goals Club' },
    { code: 'BADGE_SHUTOUT',   label: 'Brick Wall' },
    { code: 'BADGE_PLAYMAKER', label: 'Playmaker' },
    { code: 'BADGE_IRON_MAN',  label: 'Iron Man' }
  ]
});

// Helper functie om in je React app snel een 'label' op te zoeken via een 'code'
export const getLabelByCode = (listName, code) => {
  // Als het een object/dictionary is in plaats van een array (zoals MATCH_STATUS)
  if (!Array.isArray(CONFIG[listName])) {
    return CONFIG[listName][code] || code;
  }
  // Als het een array met { code, label } objecten is
  const item = CONFIG[listName]?.find(i => i.code === code);
  return item ? item.label : code;
};
