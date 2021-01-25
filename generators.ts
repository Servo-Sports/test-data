import Chance from 'chance'
import { DateTime } from 'luxon'
import {Unpacked, groupByCount, groupBy, notEmpty} from './utils'
const chance = new Chance()

const schema = 'https://ijruschemas.z16.web.core.windows.net/v1.3.0/event.schema.json'

const AgeGroups = [
  {
    Key: '7',
    AgeGroupID: 7,
    AgeGroupCode: 'a.12.999.18+',
    AgeGroupName: '18+',
    MaxAge: 999,
    MinAge: 12,
  },
  {
    Key: '6',
    AgeGroupID: 6,
    AgeGroupCode: 'a.10.17.15-17',
    AgeGroupName: '15-17',
    MaxAge: 17,
    MinAge: 10,
  },
  {
    Key: '5',
    AgeGroupID: 5,
    AgeGroupCode: 'a.0.14.12-14',
    AgeGroupName: '12-14',
    MaxAge: 14,
    MinAge: 0,
  },
  {
    Key: '9',
    AgeGroupID: 9,
    AgeGroupCode: 'a.0.11.11u',
    AgeGroupName: '11 and under',
    MaxAge: 11,
    MinAge: 0,
  },
  {
    Key: '8',
    AgeGroupID: 8,
    AgeGroupCode: 'a.30.999.30+',
    AgeGroupName: '30+',
    MaxAge: 999,
    MinAge: 30,
  },
]
type AgeGroup = Unpacked<typeof AgeGroups>

const EventDefinitions = [
  {
    Key: '1',
    EventDefinitionID: 1,
    EventDefinitionCode: 'e.ijru.sp.sr.srss.1.30',
    EventDefinitionName: 'Single Rope Speed Sprint',
    IsAllAround: false,
    NumParticipants: 1,
  },
  {
    Key: '2',
    EventDefinitionID: 2,
    EventDefinitionCode: 'e.ijru.sp.sr.srse.1.180',
    EventDefinitionName: 'Single Rope Speed Endurance',
    IsAllAround: false,
    NumParticipants: 1,
  },
  {
    Key: '3',
    EventDefinitionID: 3,
    EventDefinitionCode: 'e.ijru.sp.sr.srtu.1.0',
    EventDefinitionName: 'Single Rope Triple Unders',
    IsAllAround: false,
    NumParticipants: 1,
  },
  {
    Key: '4',
    EventDefinitionID: 4,
    EventDefinitionCode: 'e.ijru.fs.sr.srif.1.75',
    EventDefinitionName: 'Single Rope Individual Freestyle',
    IsAllAround: false,
    NumParticipants: 1,
  },
  {
    Key: '14',
    EventDefinitionID: 14,
    EventDefinitionCode: 'e.ijru.fs.wh.whpf.2.75',
    EventDefinitionName: 'Wheel Pair Freestyle',
    IsAllAround: false,
    NumParticipants: 2,
  },
  {
    Key: '23',
    EventDefinitionID: 23,
    EventDefinitionCode: 'e.ijru.oa.sr.isro.1.0',
    EventDefinitionName: 'Individual Single Rope Overall',
    IsAllAround: true,
    NumParticipants: 4,
  },
  {
    Key: '25',
    EventDefinitionID: 25,
    EventDefinitionCode: 'e.ijru.oa.dd.tddo.4.0',
    EventDefinitionName: 'Team Double Dutch Overall',
    IsAllAround: true,
    NumParticipants: 4,
  },
  {
    Key: '11',
    EventDefinitionID: 11,
    EventDefinitionCode: 'e.ijru.fs.dd.ddsf.3.75',
    EventDefinitionName: 'Double Dutch Single Freestyle',
    IsAllAround: false,
    NumParticipants: 3,
  },
  {
    Key: '12',
    EventDefinitionID: 12,
    EventDefinitionCode: 'e.ijru.fs.dd.ddpf.4.75',
    EventDefinitionName: 'Double Dutch Pair Freestyle',
    IsAllAround: false,
    NumParticipants: 4,
  },
  {
    Key: '8',
    EventDefinitionID: 8,
    EventDefinitionCode: 'e.ijru.sp.dd.ddss.3.60',
    EventDefinitionName: 'Double Dutch Speed Sprint',
    IsAllAround: false,
    NumParticipants: 3,
  },
  {
    Key: '7',
    EventDefinitionID: 7,
    EventDefinitionCode: 'e.ijru.sp.dd.ddsr.4.4x30',
    EventDefinitionName: 'Double Dutch Speed Relay',
    IsAllAround: false,
    NumParticipants: 4,
  },
]
type EventDefinition = Unpacked<typeof EventDefinitions>

const EventDefinitionMap = EventDefinitions.reduce(
  (prev, cur, index) => prev.set(cur.EventDefinitionCode, cur),
  new Map<string, EventDefinition>()
)

const AllAroundEventDefinitions = [
  {
    AllAround: EventDefinitionMap.get('e.ijru.oa.sr.isro.1.0'),
    Components: [
      EventDefinitionMap.get('e.ijru.fs.sr.srif.1.75'),
      EventDefinitionMap.get('e.ijru.sp.sr.srss.1.30'),
      EventDefinitionMap.get('e.ijru.sp.sr.srse.1.180'),
    ].filter(notEmpty),
  },
  {
    AllAround: EventDefinitionMap.get('e.ijru.oa.dd.tddo.4.0'),
    Components: [
      EventDefinitionMap.get('e.ijru.fs.dd.ddpf.4.75'),
      EventDefinitionMap.get('e.ijru.sp.dd.ddss.3.60'),
      EventDefinitionMap.get('e.ijru.fs.dd.ddsf.3.75'),
    ].filter(notEmpty),
  },
]
type AllAroundEventDefinition = Unpacked<typeof AllAroundEventDefinitions>

const Subcompetitions = [
  {
    Key: '3',
    SubcompetitionID: 3,
    SubcompetitionName: 'Default Competition',
  },
]

function createParticipant(ParticipantID: number) {
  const gender = chance.gender() === 'Female' ? 'female' : 'male'
  return {
    Key: ParticipantID.toString(),
    ParticipantID,
    MemberID: 1000 + ParticipantID,
    Birthdate: chance.birthday({ type: 'child' }).valueOf(),
    FirstName: chance.first({ gender }),
    LastName: chance.last(),
    GenderID: gender === 'female' ? 1 : 2,
    Comments: null,
    IsCompetitor: true,
    IsJudge: false,
    PhotoBlobUri: null,
  }
}

type Participant = ReturnType<typeof createParticipant>

function randomFromList<T>(input: Array<T>): T {
  const index = Math.floor(Math.random() * input.length)
  return input[index]
}

const range = (length: number) => [...Array.from(Array(length).keys())]

function createTeam(TeamID: number, numParticipants: number) {
  const prefixList = [
    'Admirable',
    'Brave',
    'Cunning',
    'Dashing',
    'Eager',
    'Flipping',
    'Gonzo',
    'Hoppin',
    'Ingenious',
    'Jumping',
    'Kind',
    'Leaping',
    'Motivated',
    'Nimble',
    'Outstanding',
    'Punctual',
    'Quiet',
    'Raving',
    'Skipping',
    'Triumphant',
    'Unusual',
    'Victorious',
    'Wily',
    'Xeric',
    'Yearning',
    'Zesty',
  ]
  return {
    Key: TeamID.toString(),
    TeamID: TeamID,
    TeamName: `${randomFromList(prefixList)} ${chance.animal()}s`,
    Participants: range(numParticipants).map((n) => createParticipant(TeamID * 1000 + n)),
  }
}

export type Team = ReturnType<typeof createTeam>

function createEvent(
  EventID: number,
  AgeGroupID: number,
  EventDefinition: EventDefinition,
  SubcompetitionID: number,
  GenderID: number,
  Entries: Array<Entry>,
  IsAllAround: boolean
) {
  return {
    Key: EventID.toString(),
    AgeGroupID,
    GenderID,
    GenderCode: genderIDToCode[GenderID],
    EventDefinitionID: EventDefinition.EventDefinitionID,
    EventDefinitionCode: EventDefinition.EventDefinitionCode,
    SubcompetitionID,
    IsAllAround,
    Entries,
  }
}

export type Event = ReturnType<typeof createEvent>

interface Entry {
  Key: string
  CompEventEntryID: number
  TeamID: number
  MusicBlobUri: string | null
  ParticipantEntries: {
    ParticipantID: number
  }[]
  AllAroundIncludedEntries: Array<number>
}

function createEntry(CompEventEntryID: number, Team: Team, participants: Array<Participant>, linkedAAEntries: Array<Entry>) {
  return {
    Key: CompEventEntryID.toString(),
    CompEventEntryID,
    TeamID: Team.TeamID,
    MusicBlobUri: null,
    ParticipantEntries: participants.map((p) => ({
      ParticipantID: p.ParticipantID,
    })),
    AllAroundIncludedEntries: linkedAAEntries.map((e) => e.CompEventEntryID),
  } as Entry
}

interface EntrySpec {
  EventDefinition: EventDefinition
  Participants: Participant[]
  Team: Team
  ComponentAAEntrySpecs: EntrySpec[]
}

function createEntrySpec(
  Team: Team,
  Participants: Participant[],
  EventDefinition: EventDefinition,
  ComponentAAEntrySpecs?: EntrySpec[]
) {
  return {
    EventDefinition,
    Participants: Participants.slice(0, EventDefinition.NumParticipants), // only take enough participants -- we get more if creating from an AA
    Team,
    ComponentAAEntrySpecs: ComponentAAEntrySpecs ?? [],
  } as EntrySpec
}

const genderIDToCode: Record<number, string> = {
  1: 'g.f',
  2: 'g.m',
  3: 'g.x',
}

function entrySpecsToEvents(entrySpecs: Array<EntrySpec>, ageGroups: Array<AgeGroup>, ageCutoffDate: DateTime) {
  const entrySpecs2 = entrySpecs
    .map((es) => {
      const oldest = DateTime.fromMillis(Math.min(...es.Participants.map((p) => Number(p.Birthdate))))
      const maxAge = ageCutoffDate.diff(oldest, 'years').years
      const validAgeGroups = ageGroups.filter((ag) => ag.MaxAge <= maxAge).sort((a, b) => a.MaxAge - b.MaxAge)
      // console.log(`valid age groups:`, validAgeGroups, oldest.toString(), maxAge)
      const AgeGroup = validAgeGroups.length ? validAgeGroups[0] : null
      const genders = es.Participants.map((p) => p.GenderID).reduce((prev, cur) => prev.add(cur), new Set<number>())
      const evGender =
        genders.has(1) && genders.has(2)
          ? 3 // mixed
          : genders.has(1)
          ? 1
          : 2
      if (!AgeGroup) return null
      return {
        ...es,
        AgeGroup,
        GenderID: evGender,
        OldES: es,
      }
    })
    .filter(notEmpty)
  // group the entry specs to create events
  const entryGroups = groupBy(
    entrySpecs2,
    (es) => `${es.EventDefinition.EventDefinitionCode}/${es.AgeGroup.AgeGroupCode}/${es.GenderID}`
  )
  let nextEventID = 1
  let nextEntryID = 1
  const entryMap = new Map<EntrySpec, Entry>()
  const mapGroups = (eg: Unpacked<typeof entryGroups>) => {
    const first = eg[0]
    console.log(`Creating ${first.EventDefinition.EventDefinitionCode} (${eg.length} entries)`)
    // create the entries in the event
    const entries = eg.map((en) => {
      const entryID = nextEntryID++
      const components = en.ComponentAAEntrySpecs?.map((ce) => entryMap.get(ce)).filter(notEmpty) ?? []
      const thisEntry = createEntry(entryID, en.Team, en.Participants, components)
      entryMap.set(en.OldES, thisEntry)
      return thisEntry
    })
    return createEvent(
      nextEventID++,
      first.AgeGroup.AgeGroupID,
      first.EventDefinition,
      Subcompetitions[0].SubcompetitionID,
      first.GenderID,
      entries,
      first.EventDefinition.IsAllAround
    )
  }
  // create AAs last because we need to get component IDs to link them into the AA entry
  console.log('Starting comp')
  const compEvents = entryGroups.filter((eg) => eg[0].EventDefinition.IsAllAround === false).map(mapGroups)
  console.log('Starting aa')
  const aaEvents = entryGroups.filter((eg) => eg[0].EventDefinition.IsAllAround === true).map(mapGroups)
  return [...compEvents, ...aaEvents]
}

// creates entry specs for a team for a specific AA type
function createAAEntriesSpecForTeam(team: Team, aaEventDef: AllAroundEventDefinition) {
  const aa = aaEventDef.AllAround
  if (!aa || !aaEventDef.Components) return []
  const groups = groupByCount(team.Participants, aa.NumParticipants)
  const entrySpecs = groups.map((pg) => {
    // create the compenent entries
    const compEntrySpecs = aaEventDef.Components.map((comp) => createEntrySpec(team, pg, comp))
    // create the AA entry
    const aaEntrySpec = createEntrySpec(team, pg, aa, compEntrySpecs)
    return [aaEntrySpec, ...compEntrySpecs]
  })
  return entrySpecs.flat(2)
}

function createAAEventsForCompetition(
  teams: Team[],
  aaEventDefs: AllAroundEventDefinition[],
  ageGroups: AgeGroup[],
  ageCutoffDate: DateTime
) {
  const entrySpecs = teams.map((t) => aaEventDefs.map((e) => createAAEntriesSpecForTeam(t, e))).flat(3)
  // console.dir(entrySpecs, { maxArrayLength: 10 })
  const events = entrySpecsToEvents(entrySpecs, ageGroups, ageCutoffDate)
  // console.dir(events, { maxArrayLength: 10 })
  return events
}

function createCompetition(
  competitionID: number,
  CompetitionName: string,
  Teams: Array<Team>,
  Events: Array<Event>,
  AgeCutoffDate: DateTime
) {
  return {
    Key: competitionID.toString(),
    CompetitionName,
    AgeCutoffDate: AgeCutoffDate.toMillis().toString(),
    StartDate: '1580515200000',
    EndDate: 'null',
    Teams,
    Events,
  }
}

export type Competition = ReturnType<typeof createCompetition>

export function createDataFileContent(numTotalParticipants: number) {
  const numParticipantsPerTeam = 30
  const ageCutoffDate = DateTime.utc()
  const numTeams = Math.round(numTotalParticipants / numParticipantsPerTeam)

  const Teams = range(numTeams).map((n) => createTeam(n, numParticipantsPerTeam))
  const x = EventDefinitions.map((ed) => Teams.map((t) => 1))
  const Events = createAAEventsForCompetition(Teams, AllAroundEventDefinitions, AgeGroups, ageCutoffDate)
  const Competition = createCompetition(3, 'Demo Competition', Teams, Events, ageCutoffDate)

  return {
    $schema: schema,
    AgeGroups,
    EventDefinitions,
    Subcompetitions,
    Competition,
  }
}
