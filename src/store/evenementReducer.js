import * as types from './actiontypes';
import db from '../data/db.json';
import { utilisateursDemo } from './demo';

const defaultOrganizer =
  db.utilisateurs.find((u) => u.id === utilisateursDemo.organisateur) || db.utilisateurs[0];

const initialState = {
  utilisateurs: db.utilisateurs,
  currentUser: defaultOrganizer,
  evenements: db.evenements,
  sessions: db.sessions,
  intervenants: db.intervenants,
  inscriptions: db.inscriptions,
  paiements: db.paiements,
  evaluations: db.evaluations,
  filter: 'tous',
  search: '',
  viewMode: 'cartes',
};

export default function evenementReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };

    case types.LOGOUT_USER:
      return { ...state, currentUser: null };

    case types.REGISTER_USER: {
      const created = {
        ...action.payload,
        id: state.utilisateurs.length + 1,
        statut: 'actif',
        dateInscription: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        utilisateurs: [...state.utilisateurs, created],
        currentUser: created,
      };
    }

    case types.UPDATE_USER: {
      const { userId, updates } = action.payload;
      const updatedUtilisateurs = state.utilisateurs.map((u) =>
        Number(u.id) === Number(userId) ? { ...u, ...updates } : u
      );
      const updatedCurrentUser =
        state.currentUser && Number(state.currentUser.id) === Number(userId)
          ? { ...state.currentUser, ...updates }
          : state.currentUser;
      return {
        ...state,
        utilisateurs: updatedUtilisateurs,
        currentUser: updatedCurrentUser,
      };
    }

    case types.SET_EVENT_FILTER:
      return { ...state, filter: action.payload };

    case types.SET_EVENT_SEARCH:
      return { ...state, search: action.payload };

    case types.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };

    case types.CREATE_EVENT: {
      const nextId =
        state.evenements.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0) + 1;
      const newEvent = {
        ...action.payload,
        id: nextId,
        organisateurId:
          action.payload.organisateurId ||
          state.currentUser?.id ||
          utilisateursDemo.organisateur,
      };
      return {
        ...state,
        evenements: [newEvent, ...state.evenements],
      };
    }

    case types.UPDATE_EVENT:
      return {
        ...state,
        evenements: state.evenements.map((evt) =>
          Number(evt.id) === Number(action.payload.eventId)
            ? { ...evt, ...action.payload.updates }
            : evt
        ),
      };

    case types.CANCEL_EVENT:
      return {
        ...state,
        evenements: state.evenements.map((evt) =>
          Number(evt.id) === Number(action.payload.eventId)
            ? { ...evt, statut: 'annule', motifAnnulation: action.payload.reason }
            : evt
        ),
      };

    case types.ADD_SESSION: {
      const nextSessionId =
        state.sessions.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1;
      return {
        ...state,
        sessions: [...state.sessions, { ...action.payload, id: nextSessionId }],
      };
    }

    // ▼▼▼ AJOUTEZ CE CAS ▼▼▼
    case types.UPDATE_SESSION: {
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          Number(s.id) === Number(action.payload.id)
            ? { ...s, ...action.payload }
            : s
        ),
      };
    }
    // ▲▲▲ FIN DE L'AJOUT ▲▲▲

    case types.UPDATE_PARTICIPANT_PRESENCE:
      return {
        ...state,
        inscriptions: state.inscriptions.map((ins) =>
          Number(ins.id) === Number(action.payload.inscriptionId)
            ? { ...ins, presence: action.payload.presence }
            : ins
        ),
      };

    case types.REMOVE_PARTICIPANT:
      return {
        ...state,
        inscriptions: state.inscriptions.filter(
          (ins) => Number(ins.id) !== Number(action.payload.inscriptionId)
        ),
      };

    case types.UPDATE_INSCRIPTION_STATUS:
      return {
        ...state,
        inscriptions: state.inscriptions.map((ins) =>
          Number(ins.id) === Number(action.payload.inscriptionId)
            ? { ...ins, statut: action.payload.statut }
            : ins
        ),
      };

    case types.ACCEPT_ALL_INSCRIPTIONS:
      return {
        ...state,
        inscriptions: state.inscriptions.map((ins) =>
          Number(ins.evenementId) === Number(action.payload.evenementId) &&
          ins.statut === 'enattente'
            ? { ...ins, statut: 'confirmee' }
            : ins
        ),
      };

    case types.PROPOSE_WAITLIST_SPOT:
      return {
        ...state,
        inscriptions: state.inscriptions.map((ins) =>
          Number(ins.id) === Number(action.payload.inscriptionId)
            ? { ...ins, statut: 'placeproposee' }
            : ins
        ),
      };

    default:
      return state;
  }
}