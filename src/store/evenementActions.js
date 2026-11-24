import * as types from './actiontypes';

export const setCurrentUser = (user) => ({
  type: types.SET_CURRENT_USER,
  payload: user,
});

export const logoutUser = () => ({
  type: types.LOGOUT_USER,
});

export const registerUser = (newUser) => ({
  type: types.REGISTER_USER,
  payload: newUser,
});

// ← AJOUT : mise à jour du profil utilisateur
export const updateUser = (userId, updates) => ({
  type: types.UPDATE_USER,
  payload: { userId, updates },
});

export const setEventFilter = (filter) => ({
  type: types.SET_EVENT_FILTER,
  payload: filter,
});

export const setEventSearch = (query) => ({
  type: types.SET_EVENT_SEARCH,
  payload: query,
});

export const setViewMode = (mode) => ({
  type: types.SET_VIEW_MODE,
  payload: mode,
});

export const createEvent = (eventData) => ({
  type: types.CREATE_EVENT,
  payload: eventData,
});

export const updateEvent = (eventId, updates) => ({
  type: types.UPDATE_EVENT,
  payload: { eventId, updates },
});

export const cancelEvent = (eventId, reason) => ({
  type: types.CANCEL_EVENT,
  payload: { eventId, reason },
});

export const addSession = (session) => ({
  type: types.ADD_SESSION,
  payload: session,
});

// ▼▼▼ CORRECTION ICI ▼▼▼
export const updateSession = (sessionId, sessionData) => ({
  type: types.UPDATE_SESSION, // <-- Il manquait "types."
  payload: {
    id: sessionId,
    ...sessionData,
  },
});
// ▲▲▲ FIN DE LA CORRECTION ▲▲▲

export const updateParticipantPresence = (inscriptionId, presence) => ({
  type: types.UPDATE_PARTICIPANT_PRESENCE,
  payload: { inscriptionId, presence },
});

export const removeParticipant = (inscriptionId) => ({
  type: types.REMOVE_PARTICIPANT,
  payload: { inscriptionId },
});

export const updateInscriptionStatus = (inscriptionId, statut) => ({
  type: types.UPDATE_INSCRIPTION_STATUS,
  payload: { inscriptionId, statut },
});

export const acceptAllInscriptions = (evenementId) => ({
  type: types.ACCEPT_ALL_INSCRIPTIONS,
  payload: { evenementId },
});

export const proposeWaitlistSpot = (inscriptionId) => ({
  type: types.PROPOSE_WAITLIST_SPOT,
  payload: { inscriptionId },
});