# Firebase NoSQL Datamodel Hockey - Systeemspecificatie

Dit document bevat de volledige NoSQL Firestore-datamodel architectuur ter ondersteuning van het Hockey Manager ecosysteem. Het model is speciaal ontworpen voor O(1) read operaties door gebruik te maken van pre-calculated paths, platte root-level documenten en geneste arrays voor randfunctionaliteiten. Er worden géén subcollecties gebruikt. We maken gebruik van een Type-driven aanpak voor onveranderlijke codes (HL7-principe).

## 1. Type Definities (Constants & Enums)

De volgende TypeScript types dienen als basis voor gecodeerde attributen. Deze codes worden in het `CONFIG`-bestand van de frontend vertaald naar mens-leesbare labels.

```typescript
// Voorbeeld Type-definities
type PlayerId = `PLR_${string}`;
type TeamId = `TEAM_${string}`;
type MatchId = `MCH_${string}`;
type SeasonId = `SZN_${string}`;
type DivisieId = `DIV_${string}`;
type OrgId = `ORG_${string}`;
type UserId = `USR_${string}`;

type PositionCode = "LW" | "RW" | "C" | "LD" | "RD" | "G";
type EventCode = "GOAL" | "ASSIST" | "TRIP" | "HOOK" | "FIGHT" | "SHOT" | "SAVE" | "HIT" | "BLOCK" | "FACEOFF_WON";
type MatchStatusCode = "SCHEDULED" | "WARMUP" | "PERIOD_1" | "INTERMISSION_1" | "PERIOD_2" | "INTERMISSION_2" | "PERIOD_3" | "OT" | "SO" | "FINAL" | "CLOSED";
type ContractStatusCode = "ACTIVE" | "EXPIRED" | "TERMINATED";
type TransactionStatusCode = "PENDING" | "COMPLETED" | "FAILED";
type InjuryStatusCode = "ACTIVE" | "RECOVERED" | "DAY_TO_DAY";
type RosterStatus = "ACTIVE" | "INACTIVE" | "SCRATCHED" | "INJURED";
type PostTypeCode = "NEWS" | "UPDATE" | "ANNOUNCEMENT" | "RESULT" | "MEDIA";
```

---

## 2. Kern Identiteiten & Profielen (Personen, Spelers, Users)

### Document: `person:[PERSON_ID]`
Bevat de onveranderlijke persoonsgegevens. Andere rollen (speler, coach, official) verwijzen naar dit ID.
```typescript
interface PersonDocument {
  id: PlayerId | string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO-8601
  nationalityId: string;
  genderCode: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  mediaPaths: { // Externe referenties (bijv. Cloudinary)
    profilePhotoUrl: string;
  };
  isActive: boolean;
}
```

### Document: `user:[USER_ID]:profile`
```typescript
interface UserProfileDocument {
  personId: string;
  authUserId: string; // Firebase Auth ID
  username: string;
  email: string;
  roleCode: "SUPER_ADMIN" | "PLATFORM_ADMIN" | "TEAM_MANAGER" | "COACH" | "PLAYER" | "FAN";
  preferences: {
    notificationsEnabled: boolean;
    language: string;
  };
  permissions: string[]; // Geneste array van permissies i.p.v. losse tabel
  favorites: { // Array met O(1) favorieten
    teamIds: string[];
    playerIds: string[];
    competitionIds: string[];
  };
}
```

### Document: `player:[PLAYER_ID]:profile`
Inclusief geneste arrays voor randzaken zoals uitrusting, contracten en medische geschiedenis om extra reads te voorkomen.
```typescript
interface PlayerProfileDocument {
  personId: string;
  primaryPositionCode: PositionCode;
  shootsCode: "L" | "R";
  jerseyNumber: number;
  physical: {
    heightCm: number;
    weightKg: number;
  };
  badges: Array<{ // Geneste achievements/badges
    badgeCode: string;
    earnedDate: string;
  }>;
  contracts: Array<{ // Historie en actieve contracten
    orgId: OrgId;
    teamId: TeamId;
    statusCode: ContractStatusCode;
    startDate: string;
    endDate: string;
    salary: number;
  }>;
  equipment: Array<{ // Uitrusting in bruikleen
    equipmentTypeCode: string;
    brandCode: string;
    model: string;
    acquiredDate: string;
  }>;
  injuries: Array<{ // Medisch dossier
    injuryTypeCode: string;
    statusCode: InjuryStatusCode;
    occurredDate: string;
    expectedReturn: string;
  }>;
  suspensions: Array<{ // Schorsingen en disciplinaire statussen
    matchId?: string;
    suspensionGames: number;
    reason: string;
    startDate: string;
    endDate: string;
    statusCode: "ONGOING" | "COMPLETED" | "APPEAL";
  }>;
}
```

---

## 3. Organisaties, Teams & Locaties

### Document: `organization:[ORG_ID]:profile`
Bevat sponsoren, financiële accounts en personeel als geneste domeinen.
```typescript
interface OrganizationProfileDocument {
  name: string;
  orgTypeCode: "FEDERATION" | "CLUB" | "SPONSOR" | "BRAND";
  foundedDate: string;
  logoUrl: string;
  sponsorships: Array<{ // Geneste sponsors
    sponsorId: string; // Externe of interne OrgId
    value: number;
    startDate: string;
    endDate: string;
  }>;
  financialAccounts: Array<{
    accountName: string;
    balance: number;
    currencyCode: string;
  }>;
}
```

### Document: `team:[TEAM_ID]:profile`
```typescript
interface TeamProfileDocument {
  orgId: OrgId;
  name: string;
  logoUrl: string;
  categoryCode: "SENIOR" | "U18" | "U16" | "WOMEN";
  homeLocationId: string;
  teamSettings: Record<string, any>;
}
```

### Document: `location:[LOCATION_ID]:profile`
```typescript
interface LocationProfileDocument {
  name: string;
  address: string;
  capacity: number;
  facilities: Array<{
    facilityTypeCode: string;
    name: string;
    specifications: Record<string, any>;
  }>;
}
```

---

## 4. Competities & Seizoenen

### Document: `season:[SEIZOEN_ID]:structure`
Voor een O(1) opstart-read van de app-navigatie (divisies en bijbehorende teams per seizoen).
```typescript
interface SeasonStructureDocument {
  competitionId: string;
  divisions: Array<{
    divisieId: DivisieId;
    name: string;
    teamIds: TeamId[];
  }>;
}
```

### Document: `competition:[COMP_ID]:profile`
```typescript
interface CompetitionProfileDocument {
  name: string;
  compTypeCode: "LEAGUE" | "TOURNAMENT" | "CUP";
  genderTypeCode: string;
  ageCategoryCode: string;
  rulesetCode: string;
  stages: Array<{
    stageTypeCode: string;
    name: string;
    startDate: string;
    endDate: string;
  }>;
}
```

---

## 5. Wedstrijd Engine & Live Events

De wedstrijd data is opgesplitst om $O(1)$ reads te behouden, voorkomen dat eventlogs te zwaar worden, en het mogelijk te maken de wedstrijd "af te sluiten" waarna statistieken in een batch worden bijgewerkt.

### Document: `match:[WEDSTRIJD_ID]:info`
```typescript
interface MatchInfoDocument {
  seasonId: SeasonId;
  competitionId: string;
  divisieId: DivisieId;
  statusCode: MatchStatusCode;
  scheduledStartTime: string;
  locationId: string;
  scoreHome: number;
  scoreAway: number;
  period: number;
  gameClock: string;
}
```

### Document: `match:[WEDSTRIJD_ID]:rsvp`
Vóór de wedstrijd kunnen spelers/coaches hun aanwezigheid doorgeven.
```typescript
interface MatchRsvpDocument {
  homeTeamRsvp: Array<{
    playerId: PlayerId;
    rsvpStatusCode: "ATTENDING" | "NOT_ATTENDING" | "TENTATIVE";
    notes?: string;
  }>;
  awayTeamRsvp: Array<{
    playerId: PlayerId;
    rsvpStatusCode: "ATTENDING" | "NOT_ATTENDING" | "TENTATIVE";
    notes?: string;
  }>;
}
```

### Document: `match:[WEDSTRIJD_ID]:roster`
Gemaakt vlak voor of aan het begin van de wedstrijd.
```typescript
interface MatchRosterDocument {
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  rosterHome: Array<{
    playerId: PlayerId;
    jerseyNumber: number;
    positionCode: PositionCode;
    lineupRoleCode: "STARTER" | "BENCH" | "SCRATCH";
  }>;
  rosterAway: Array<{
    playerId: PlayerId;
    jerseyNumber: number;
    positionCode: PositionCode;
    lineupRoleCode: string;
  }>;
  officials: Array<{
    officialId: string;
    roleCode: "REFEREE" | "LINESMAN";
  }>;
}
```

### Document: `match:[WEDSTRIJD_ID]:events`
Append-only logboek tijdens live uitvoering.
```typescript
interface MatchEventsDocument {
  events: Array<{
    eventId: string; // UUID gegenereerd bij invoer
    periodNumber: number;
    eventTimeSeconds: number; // Tijd in de periode
    eventCode: EventCode;
    teamId?: TeamId;
    primaryPlayerId?: PlayerId;
    secondaryPlayerId?: PlayerId; // Assist of tegenstander
    goalieId?: PlayerId; // Betrokken goalie
    locationData?: { x: number; y: number }; // Voor heatmaps / shot maps
  }>;
}
```

### Document: `match:[WEDSTRIJD_ID]:report`
Wordt ingevuld door Gemini AI in de batch fase.
```typescript
interface MatchReportDocument {
  aiGeneratedText: string;
  generatedAt: string;
}
```

---

## 6. Pre-calculated Statistieken & Standen (O(1) Data)

Deze paden worden uitsluitend bijgewerkt door backend triggers nadat een wedstrijd naar "CLOSED" gaat, of via een volledige herberekening (`recalculateSeason`).

### Document: `stand:[SEIZOEN_ID]:[DIVISIE_ID]`
```typescript
interface StandingsDocument {
  lastCalculatedAt: string;
  rows: Array<{
    teamId: TeamId;
    rank: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
    otWins: number;
    otLosses: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    streakForm: string; // e.g. "WWLWW"
  }>;
}
```

### Document: `stats:[SEIZOEN_ID]:[TEAM_ID]:[SPELER_ID]` (Speler Statistieken)
Voor zowel veldspelers als goalies identiek gehouden. Keeperspecifieke statistieken leven in het optionele veld `goalieStats`.
```typescript
interface PlayerStatsDocument {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  pim: number; // Penalty Minutes
  shotsOnGoal: number;
  hits: number;
  blocks: number;
  plusMinus: number;
  faceoffsWon: number;
  faceoffsTaken: number;
  timeOnIceSeconds: number; // TOI
  goalieStats?: { // Optioneel veld, uitsluitend gevuld voor keepers
    minutesPlayed: number;
    shotsAgainst: number;
    saves: number;
    goalsAgainst: number;
    savePercentage: number;
    gaa: number; // Goals Against Average
    shutouts: number;
    wins: number;
    losses: number;
  };
}
```

### Document: `team:[SEIZOEN_ID]:[TEAM_ID]:stats`
```typescript
interface TeamSeasonStatsDocument {
  gamesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
  powerplayOpportunities: number;
  powerplayGoals: number;
  penaltyKillOpportunities: number;
  penaltyKillSuccesses: number;
  advancedStats: {
    corsiPercentage: number;
    xGF: number;
    xGA: number;
  };
}
```

---

## 7. Social, Media & Nieuws

Om O(1) weergave te garanderen, wordt content genest in één array per entiteit of kanaal (tot de max documentgrootte van 1MB limiet is bereikt, daarna via cursor-paging op documentniveau bijv. `feed:ORG_001:page_1`).

### Document: `social:[ENTITY_TYPE]:[ENTITY_ID]:feed`
Vangt zowel team feeds, speler feeds, als club feeds af.
```typescript
interface SocialFeedDocument {
  posts: Array<{
    postId: string;
    postTypeCode: PostTypeCode;
    authorUserId: UserId;
    content: string;
    mediaUrl?: string; // Optionele externe link
    createdAt: string;
    likesCount: number;
    comments: Array<{
      commentId: string;
      authorUserId: UserId;
      content: string;
      createdAt: string;
    }>;
  }>;
}
```

### Document: `chat:[CHANNEL_ID]`
Beperkt aantal berichten per document, chat is vaak snel muterend.
```typescript
interface ChatChannelDocument {
  channelTypeCode: "TEAM" | "CLUB" | "COACHES";
  participants: UserId[];
  messages: Array<{
    messageId: string;
    senderUserId: UserId;
    messageText: string;
    createdAt: string;
  }>;
}
```

---

## 8. Financiën & Abonnementen

### Document: `finance:[ORG_ID]:ledger`
Beheer de transacties en facturen binnen één masterdocument of gepagineerde ledger documenten.
```typescript
interface FinanceLedgerDocument {
  transactions: Array<{
    transactionId: string;
    orderId?: string;
    amount: number;
    currencyCode: string;
    transactionStatusCode: TransactionStatusCode;
    processedAt: string;
  }>;
  invoices: Array<{
    invoiceId: string;
    subscriptionId?: string;
    totalAmount: number;
    dueDate: string;
    pdfUrl: string;
  }>;
}
```

### Document: `subscription:[ORG_ID]`
```typescript
interface SubscriptionDocument {
  planCode: string;
  statusCode: "ACTIVE" | "CANCELED" | "PAST_DUE";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}
```

---

## 9. Training, Drafts, Transfers & DFS (Randzaken)

### Document: `training:[TEAM_ID]:[SEIZOEN_ID]`
Alle trainingen voor een team in één seizoen worden in dit document ge-append.
```typescript
interface TeamTrainingLogDocument {
  sessions: Array<{
    sessionId: string;
    scheduledStart: string;
    coachId: string;
    title: string;
    attendance: Array<{ // Geneste aanwezigheidslijst
      playerId: PlayerId;
      attendanceStatusCode: "PRESENT" | "ABSENT" | "INJURED";
      effortRating?: number;
    }>;
  }>;
}
```

### Document: `transfers:[SEIZOEN_ID]`
Bevat alle trades en transfers voor een specifiek seizoen in de competitie, ideaal voor een snelle O(1) "Transfer Nieuws" feed of overzichtsscherm.
```typescript
interface SeasonTransfersDocument {
  transfers: Array<{
    transferId: string;
    playerId: PlayerId;
    fromTeamId: TeamId;
    toTeamId: TeamId;
    transferFee: number;
    effectiveDate: string;
    statusCode: "COMPLETED" | "PENDING";
  }>;
}
```

### Document: `dfs:[SLATE_ID]`
Daily Fantasy Sports en Betting Projections.
```typescript
interface DfsSlateDocument {
  operatorCode: string;
  slateName: string;
  startTime: string;
  salaryCap: number;
  games: Array<{
    gameId: MatchId;
  }>;
  players: Array<{
    playerId: PlayerId;
    operatorSalary: number;
    operatorPositionCode: string;
    projectedPoints: number;
  }>;
}
```

### Document: `marketplace:[ORG_ID]` of `marketplace:global`
Voor het verhandelen van equipment/merchandise.
```typescript
interface MarketplaceListingsDocument {
  listings: Array<{
    listingId: string;
    sellerId: OrgId | UserId;
    title: string;
    description: string;
    priceAmount: number;
    currencyCode: string;
    conditionCode: "NEW" | "USED";
    listingStatusCode: "ACTIVE" | "SOLD" | "REMOVED";
  }>;
}
```

---

## Architectuur Notities & Regels (In Line met de Specificatie)
- **Geen HTML scraping, geen inline verwerkingen:** Data wordt gemuteerd via state.
- **O(1) Data:** Iedere databerg is opvraagbaar via maximaal 1 read per context (bijv. alle prestaties van Speler X in Seizoen Y is direct 1 document via `stats:SZN:TEAM:PLR`).
- **Google Sheets & Scripts:** Master data updates en correcties (Fase 3 Cache Invalidation) vinden plaats via de backend en overschrijven de specifieke O(1) paden met behulp van Firestore transacties, gecoördineerd via Google Apps Script (inclusief `LockService` conform specificaties).
- **Media & Binaries:** Alle afbeeldingen, documenten (factuur-pdf's) zijn in de opslag gemapped als string referentie URL's. Base64 in Firestore is strikt vermeden.
- **Typing:** Alle dynamische status labels, event namen, positie namen en uitrusting namen zijn in dit model strict vastgelegd in een interface als Type/Enum en dus **nooit** plain tekst, conform het HL7-principe uit de requirements.
