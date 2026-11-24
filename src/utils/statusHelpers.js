// src/utils/statusHelpers.js
import React from 'react';

export function getStatusBadge(statut) {
  const map = {
    publie:    { label: 'Publié',    cls: 'status_pill--publie',    dot: '●', bg: '#ece9fc', color: '#5847d8' },
    encours:   { label: 'En cours',  cls: 'status_pill--encours',   dot: '●', bg: '#fbe7e2', color: '#c84b2c' },
    brouillon: { label: 'Brouillon', cls: 'status_pill--brouillon', dot: '○', bg: '#f5f3ee', color: '#6f6b78' },
    complet:   { label: 'Complet',   cls: 'status_pill--complet',   dot: '●', bg: '#5847d8', color: '#ffffff' },
    termine:   { label: 'Terminé',   cls: 'status_pill--termine',   dot: '✓', bg: '#e3f3ec', color: '#216e4e' },
    annule:    { label: 'Annulé',    cls: 'status_pill--annule',    dot: '✕', bg: '#fde8e8', color: '#b42318' },
  };

  const item = map[statut] || { label: statut, cls: 'status_pill--brouillon', dot: '○', bg: '#f5f3ee', color: '#6f6b78' };

  return {
    label: item.label,
    cls: item.cls,
    dot: item.dot,
    bg: item.bg,
    color: item.color,
  };
}

// Optionnel : composant React prêt à l'emploi
export function StatusPill({ statut }) {
  const item = getStatusBadge(statut);
  return (
    <span
      className={`status_pill ${item.cls}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: item.bg,
        color: item.color,
      }}
    >
      <span>{item.dot}</span> {item.label}
    </span>
  );
}