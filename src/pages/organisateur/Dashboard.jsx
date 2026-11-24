import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ← AJOUT
import { ChevronRight } from 'lucide-react';

import AppShell from '../../layouts/AppShell';
import Card from '../../components/cards';
import DataTable from '../../components/tables';
import { DonutChart, ProgressBar } from '../../components/Diagram';
import { Segmented } from '../../components/inputs';
import { PrimaryButton, IconButton } from '../../components/buttons';
import { utilisateursDemo } from '../../store/demo';

// ================= CSS =================
const styles = `
.org_dashboard { display: flex; flex-direction: column; gap: 20px; color: #1e1c24; }
.org_dashboard_top { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.org_page_title { margin: 0; font-size: 24px; font-weight: 700; color: #1c1a22; }
.org_page_subtitle { margin: 4px 0 0; font-size: 13px; color: #7c7885; }
.org_dashboard_controls { display: flex; align-items: center; gap: 12px; }
.kpi_strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); background: #ffffff; border: 1px solid #ece8df; border-radius: 16px; overflow: hidden; }
.kpi_tile { padding: 18px 20px; border-right: 1px solid #ece8df; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: background-color 0.15s ease; }
.kpi_tile:last-child { border-right: none; }
.kpi_tile:hover { background: #faf8f4; }
.kpi_tile_head { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #7c7885; }
.kpi_tile_value { font-size: 22px; font-weight: 700; color: #1c1a22; line-height: 1.2; }
.kpi_tile_sub { font-size: 11px; color: #8f8b96; }
.analytics_row_top { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
.analytics_row_bottom { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
.card_subtext { margin: -8px 0 14px; font-size: 12px; color: #8f8b96; }
.mawid_chart_svg { width: 100%; height: auto; display: block; }
.chart_axis_text { font-size: 10px; fill: #9b97a3; }
.chart_peak_label { font-size: 11px; font-weight: 700; fill: #1c1a22; }
.presence_donut_wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding-top: 8px; }
.donut_legend { display: flex; gap: 18px; font-size: 12px; color: #5f5b66; }
.legend_dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
.legend_dot--present { background: #5847d8; }
.legend_dot--absent { background: #e5e0d5; }
.event_bars_list { display: flex; flex-direction: column; gap: 16px; padding-top: 6px; }
.horizontal_metric_row { display: grid; grid-template-columns: 150px 1fr 32px; align-items: center; gap: 12px; font-size: 12px; }
.metric_name { color: #4a4652; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.metric_count { text-align: right; color: #1c1a22; }
.section_block { display: flex; flex-direction: column; gap: 12px; }
.section_head_row { display: flex; justify-content: space-between; align-items: center; }
.section_heading { margin: 0; font-size: 15px; font-weight: 700; color: #1c1a22; }
.view_all_link { background: none; border: none; color: #5847d8; font-size: 12px; font-weight: 600; cursor: pointer; }
.sessions_strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); background: #ffffff; border: 1px solid #ece8df; border-radius: 16px; overflow: hidden; }
.session_tile { padding: 16px 20px; border-right: 1px solid #ece8df; display: flex; flex-direction: column; gap: 4px; }
.session_tile:last-child { border-right: none; }
.session_time { font-size: 11px; font-weight: 600; color: #5847d8; }
.session_title { font-size: 14px; color: #1c1a22; }
.session_room { font-size: 12px; color: #8f8b96; }
.date_badge { width: 42px; height: 44px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; line-height: 1.1; }
.date_badge strong { font-size: 13px; color: #1c1a22; }
.date_badge--0 { background: #dceef2; color: #366a75; }
.date_badge--1 { background: #dcebf4; color: #335f7a; }
.date_badge--2 { background: #e8e2f8; color: #5847d8; }
.event_cell_info { display: flex; flex-direction: column; gap: 2px; }
.event_cell_info strong { font-size: 13px; color: #1c1a22; }
.event_cell_info span { font-size: 11px; color: #8f8b96; }
.event_cell_progress { display: flex; flex-direction: column; gap: 5px; min-width: 120px; font-size: 11px; color: #7c7885; }
.event_cell_price { font-size: 13px; color: #1c1a22; }
.status_pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.status_pill--publie { background: #ece9fc; color: #5847d8; }
.status_pill--encours { background: #fbe7e2; color: #c84b2c; }
.status_pill--brouillon { background: #f5f3ee; color: #6f6b78; border: 1px dashed #d5d0c5; }
.status_pill--complet { background: #5847d8; color: #ffffff; }
.status_pill--termine { background: #e3f3ec; color: #216e4e; }
.status_pill--annule { background: #fde8e8; color: #b42318; }
@media (max-width: 1024px) {
  .kpi_strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .analytics_row_top, .analytics_row_bottom, .sessions_strip { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .kpi_strip { grid-template-columns: 1fr; }
  .kpi_tile { border-right: none; border-bottom: 1px solid #ece8df; }
  .horizontal_metric_row { grid-template-columns: 90px 1fr 28px; }
}
`;

// ================= CONSTANTES =================
const PERIOD_OPTIONS = [
  { value: '7j', label: '7 jours' },
  { value: '30j', label: '30 jours' },
  { value: '6m', label: '6 mois' },
];

const MONTHS_FR = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
const MONTHS_FULL_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// ================= FONCTIONS =================
function formatDateBadge(isoDate) {
  if (!isoDate) return { day: '--', month: '---' };
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return { day: '--', month: '---' };
  return { day: String(date.getDate()), month: MONTHS_FR[date.getMonth()] };
}

function formatSessionDate(dateStr, timeStr) {
  if (!dateStr) return timeStr || '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return `${dateStr} · ${timeStr || ''}`;
  const mois = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return `${mois} · ${timeStr ? timeStr.replace(':', ' h ') : ''}`;
}

function getStatusBadge(statut) {
  const map = {
    publie: { label: 'Publié', cls: 'status_pill--publie', dot: '●' },
    encours: { label: 'En cours', cls: 'status_pill--encours', dot: '●' },
    brouillon: { label: 'Brouillon', cls: 'status_pill--brouillon', dot: '○' },
    complet: { label: 'Complet', cls: 'status_pill--complet', dot: '●' },
    termine: { label: 'Terminé', cls: 'status_pill--termine', dot: '✓' },
    annule: { label: 'Annulé', cls: 'status_pill--annule', dot: '✕' },
  };
  const item = map[statut] || { label: statut, cls: 'status_pill--brouillon', dot: '○' };
  return (
    <span className={`status_pill ${item.cls}`}>
      <span>{item.dot}</span> {item.label}
    </span>
  );
}

// ================= GRAPHIQUES =================
function AreaLineChart({ points }) {
  const width = 520, height = 190, padLeft = 36, padRight = 24, padTop = 28, padBottom = 28;
  const maxVal = Math.max(...points.map(p => p.value), 100);
  const roundedMax = Math.ceil(maxVal / 100) * 100;
  const ticks = [0, Math.round(roundedMax / 3), Math.round((roundedMax * 2) / 3), roundedMax];

  const coords = points.map((pt, idx) => {
    const x = points.length === 1 ? width / 2 : padLeft + (idx / (points.length - 1)) * (width - padLeft - padRight);
    const y = height - padBottom - (pt.value / roundedMax) * (height - padTop - padBottom);
    return { ...pt, x, y };
  });

  const lineD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = coords.length > 0 ? `${lineD} L ${coords[coords.length - 1].x} ${height - padBottom} L ${coords[0].x} ${height - padBottom} Z` : '';
  const last = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mawid_chart_svg">
      <defs>
        <linearGradient id="mawidAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5847D8" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#5847D8" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {ticks.map(t => {
        const y = height - padBottom - (t / roundedMax) * (height - padTop - padBottom);
        return (
          <g key={t}>
            <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#ECE8DF" strokeWidth="1" />
            <text x={padLeft - 8} y={y + 3} textAnchor="end" className="chart_axis_text">{t}</text>
          </g>
        );
      })}
      {areaD && <path d={areaD} fill="url(#mawidAreaGrad)" />}
      {lineD && <path d={lineD} fill="none" stroke="#5847D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      {coords.map(c => (
        <text key={c.label} x={c.x} y={height - 6} textAnchor="middle" className="chart_axis_text">{c.label}</text>
      ))}
      {last && (
        <g>
          <text x={last.x} y={last.y - 12} textAnchor="middle" className="chart_peak_label">{last.value}</text>
          <circle cx={last.x} cy={last.y} r="5" fill="#FFFFFF" stroke="#5847D8" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
}

function WeeklyRevenueBars({ bars }) {
  const width = 340, height = 165, padX = 18, padTop = 18, padBottom = 24;
  const maxVal = Math.max(...bars.map(b => b.value), 1);
  const slot = (width - padX * 2) / bars.length;
  const barW = Math.min(36, slot * 0.62);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mawid_chart_svg">
      {bars.map((b, idx) => {
        const h = Math.max(12, (b.value / maxVal) * (height - padTop - padBottom));
        const x = padX + idx * slot + (slot - barW) / 2;
        const y = height - padBottom - h;
        return (
          <g key={b.label}>
            <rect x={x} y={y} width={barW} height={h} rx="6" fill="#EA5B35" />
            <text x={x + barW / 2} y={height - 6} textAnchor="middle" className="chart_axis_text">{b.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ================= DASHBOARD =================
export default function Dashboard() { // ← Plus de prop onNavigate
  const navigate = useNavigate(); // ← AJOUT
  const eventState = useSelector(state => state.evenements || {});
  const currentUser = eventState.currentUser;
  const evenements = eventState.evenements || [];
  const inscriptions = eventState.inscriptions || [];
  const paiements = eventState.paiements || [];
  const evaluations = eventState.evaluations || [];
  const sessions = eventState.sessions || [];
  const search = eventState.search || '';

  const [period, setPeriod] = useState('6m');

  const organizerId = currentUser?.id || utilisateursDemo.organisateur;

  // --- 1. CALCUL DE LA DATE DE DÉBUT DE PÉRIODE ---
  const periodStartDate = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    if (period === '7j') start.setDate(now.getDate() - 7);
    else if (period === '30j') start.setDate(now.getDate() - 30);
    else if (period === '6m') start.setMonth(now.getMonth() - 6);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [period]);

  const isInPeriod = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= periodStartDate;
  };

  // --- 2. FILTRAGE DES DONNÉES PAR PÉRIODE ---
  const myEventsAll = evenements.filter(e => Number(e.organisateurId) === Number(organizerId));
  const myEvents = myEventsAll.filter(e => isInPeriod(e.dateDebut));
  const myEventIds = myEvents.map(e => Number(e.id));

  const myInscriptions = inscriptions.filter(i => 
    myEventIds.includes(Number(i.evenementId)) && isInPeriod(i.dateInscription || i.date)
  );
  const myInscriptionIds = myInscriptions.map(i => Number(i.id));

  const acceptedPayments = paiements.filter(p =>
    myInscriptionIds.includes(Number(p.inscriptionId)) && p.statut === 'accepte'
  );

  const totalRevenue = acceptedPayments.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  const myEvaluations = evaluations.filter(ev => myEventIds.includes(Number(ev.evenementId)));

  const avgRating = myEvaluations.length > 0
    ? (myEvaluations.reduce((sum, ev) => sum + (Number(ev.note) || 0), 0) / myEvaluations.length).toFixed(1)
    : '0,0';

  const markedPresence = myInscriptions.filter(i => i.presence === 'present' || i.presence === 'absent');
  const presentCount = myInscriptions.filter(i => i.presence === 'present').length;
  const attendanceRate = markedPresence.length > 0 ? Math.round((presentCount / markedPresence.length) * 100) : 82;
  const absentRate = Math.max(0, 100 - attendanceRate);

  const upcomingCount = myEvents.filter(e => e.statut === 'publie').length;
  const ongoingCount = myEvents.filter(e => e.statut === 'encours').length;

  const mySessions = sessions.filter(s => myEventIds.includes(Number(s.evenementId)) && isInPeriod(s.date));
  const nextSession = mySessions[0];

  const filteredEvents = myEvents.filter(evt =>
    !search.trim() ||
    (evt.titre || '').toLowerCase().includes(search.toLowerCase()) ||
    (evt.adresse || '').toLowerCase().includes(search.toLowerCase())
  );

  // --- 3. ADAPTATION DES GRAPHIQUES SELON LA PÉRIODE ---
  const growthSeries = useMemo(() => {
    if (period === '7j') {
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const label = `${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
        const count = myInscriptions.filter(ins => {
          const insDate = new Date(ins.dateInscription || ins.date || Date.now());
          return insDate.toDateString() === d.toDateString();
        }).length;
        return { label, value: count };
      });
    } else if (period === '30j') {
      return Array.from({ length: 4 }).map((_, i) => {
        const start = new Date(periodStartDate);
        start.setDate(start.getDate() + i * 7);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        const count = myInscriptions.filter(ins => {
          const d = new Date(ins.dateInscription || ins.date || Date.now());
          return d >= start && d < end;
        }).length;
        return { label: `S${i + 1}`, value: count };
      });
    } else {
      return Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(periodStartDate);
        d.setMonth(d.getMonth() + i);
        const label = MONTHS_FR[d.getMonth()];
        const nextMonth = new Date(d);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const count = myInscriptions.filter(ins => {
          const insDate = new Date(ins.dateInscription || ins.date || Date.now());
          return insDate >= d && insDate < nextMonth;
        }).length;
        return { label, value: count };
      });
    }
  }, [period, myInscriptions, periodStartDate]);

  const weeklyBars = useMemo(() => {
    const labels = period === '7j' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] 
                 : period === '30j' ? ['S1', 'S2', 'S3', 'S4'] 
                 : ['Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.'];
    
    return labels.map((label, idx) => {
      let start, end;
      if (period === '7j') {
        start = new Date(periodStartDate);
        start.setDate(start.getDate() + idx);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
      } else if (period === '30j') {
        start = new Date(periodStartDate);
        start.setDate(start.getDate() + idx * 7);
        end = new Date(start);
        end.setDate(end.getDate() + 7);
      } else {
        start = new Date(periodStartDate);
        start.setMonth(start.getMonth() + idx);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
      }
      
      const amount = acceptedPayments
        .filter(p => {
          const d = new Date(p.datePaiement || p.date || Date.now());
          return d >= start && d < end;
        })
        .reduce((acc, p) => acc + (Number(p.montant) || 0), 0);
      return { label, value: amount || 0 };
    });
  }, [period, acceptedPayments, periodStartDate]);

  const tableColumns = ['', 'ÉVÉNEMENT', 'INSCRIPTIONS', 'PRIX', 'STATUT', ''];

  const tableRows = filteredEvents.map((evt, idx) => {
    const evtCount = inscriptions.filter(i => Number(i.evenementId) === Number(evt.id)).length;
    const pct = evt.capaciteMax > 0 ? Math.min(100, Math.round((evtCount / evt.capaciteMax) * 100)) : 0;
    const badge = formatDateBadge(evt.dateDebut);

    return [
      <div key="date" className={`date_badge date_badge--${idx % 3}`}>
        <strong>{badge.day}</strong>
        <span>{badge.month}</span>
      </div>,
      <div key="title" className="event_cell_info">
        <strong>{evt.titre}</strong>
        <span>{evt.adresse}</span>
      </div>,
      <div key="inscr" className="event_cell_progress">
        <ProgressBar value={pct} />
        <span>{evtCount} / {evt.capaciteMax} inscrits</span>
      </div>,
      <strong key="price" className="event_cell_price">{evt.prix > 0 ? `${evt.prix} MAD` : 'Gratuit'}</strong>,
      <React.Fragment key="status">{getStatusBadge(evt.statut)}</React.Fragment>,
      <IconButton 
        key="action" 
        icon={<ChevronRight size={16} />} 
        label="Gérer" 
        onClick={() => navigate(`/organisateur/evenements/${evt.id}`)} // ← MODIFIÉ
      />,
    ];
  });

  return (
    <>
      <style>{styles}</style>
      <AppShell role={currentUser?.role || 'organisateur'}>
        <div className="org_dashboard">
          <div className="org_dashboard_top">
            <div>
              <h1 className="org_page_title">Vue d'ensemble</h1>
              <p className="org_page_subtitle">Vos chiffres et vos analyses, en un coup d'œil.</p>
            </div>
            <div className="org_dashboard_controls">
              <Segmented onChange={setPeriod} options={PERIOD_OPTIONS} value={period} />
              <PrimaryButton 
                onClick={() => navigate('/organisateur/evenements/nouveau')} // ← MODIFIÉ
                text="+ Créer un événement" 
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="kpi_strip">
            <div className="kpi_tile" onClick={() => navigate('/organisateur/evenements')}> {/* ← MODIFIÉ */}
              <div className="kpi_tile_head"><span>Événements</span><ChevronRight size={14} /></div>
              <strong className="kpi_tile_value">{myEvents.length}</strong>
              <span className="kpi_tile_sub">{upcomingCount} à venir · {ongoingCount} en cours</span>
            </div>
            <div className="kpi_tile" onClick={() => navigate('/organisateur/evenements')}>
              <div className="kpi_tile_head"><span>Participants</span><ChevronRight size={14} /></div>
              <strong className="kpi_tile_value">{myInscriptions.length}</strong>
              <span className="kpi_tile_sub">inscrits au total</span>
            </div>
            <div className="kpi_tile" onClick={() => navigate('/organisateur/evenements')}>
              <div className="kpi_tile_head"><span>Revenus</span><ChevronRight size={14} /></div>
              <strong className="kpi_tile_value">{totalRevenue.toLocaleString('fr-FR')} MAD</strong>
              <span className="kpi_tile_sub">générés</span>
            </div>
            <div className="kpi_tile" onClick={() => navigate('/organisateur/evenements')}>
              <div className="kpi_tile_head"><span>Note moyenne</span><ChevronRight size={14} /></div>
              <strong className="kpi_tile_value">{String(avgRating).replace('.', ',')} / 5</strong>
              <span className="kpi_tile_sub">sur vos événements</span>
            </div>
            <div className="kpi_tile" onClick={() => navigate('/organisateur/evenements')}>
              <div className="kpi_tile_head"><span>Prochaine session</span><ChevronRight size={14} /></div>
              <strong className="kpi_tile_value">{nextSession ? nextSession.date : '--'}</strong>
              <span className="kpi_tile_sub">{nextSession ? `${nextSession.heureDebut} · ${nextSession.titre}` : 'Aucune session'}</span>
            </div>
          </div>

          {/* GRAPHIQUES HAUTS */}
          <div className="analytics_row_top">
            <Card title="Évolution des inscriptions">
              <p className="card_subtext">Inscriptions cumulées sur la période</p>
              <AreaLineChart points={growthSeries} />
            </Card>
            <Card title="Taux de présence">
              <p className="card_subtext">Sur les événements terminés</p>
              <div className="presence_donut_wrap">
                <DonutChart segments={[attendanceRate, absentRate]} label={`${attendanceRate}%`} />
                <div className="donut_legend">
                  <span><i className="legend_dot legend_dot--present" />Présents</span>
                  <span><i className="legend_dot legend_dot--absent" />Absents</span>
                </div>
              </div>
            </Card>
          </div>

          {/* GRAPHIQUES BAS */}
          <div className="analytics_row_bottom">
            <Card title="Participants par événement">
              <p className="card_subtext">Nombre d'inscrits</p>
              <div className="event_bars_list">
                {filteredEvents.slice(0, 4).map(evt => {
                  const evtCount = inscriptions.filter(i => Number(i.evenementId) === Number(evt.id)).length;
                  const pct = evt.capaciteMax > 0 ? Math.min(100, Math.round((evtCount / evt.capaciteMax) * 100)) : 0;
                  return (
                    <div key={evt.id} className="horizontal_metric_row">
                      <span className="metric_name">{evt.titre}</span>
                      <div className="metric_bar_wrap"><ProgressBar value={pct} /></div>
                      <strong className="metric_count">{evtCount}</strong>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card title="Revenus par période">
              <p className="card_subtext">Répartition</p>
              <WeeklyRevenueBars bars={weeklyBars} />
            </Card>
          </div>

          {/* PROCHAINES SESSIONS */}
          <div className="section_block">
            <h2 className="section_heading">Prochaines sessions</h2>
            <div className="sessions_strip">
              {mySessions.slice(0, 3).map(s => (
                <div key={s.id} className="session_tile">
                  <span className="session_time">{formatSessionDate(s.date, s.heureDebut)}</span>
                  <strong className="session_title">{s.titre}</strong>
                  <span className="session_room">{s.salle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MES EVENEMENTS */}
          <div className="section_block">
            <div className="section_head_row">
              <h2 className="section_heading">Mes événements</h2>
              <button type="button" className="view_all_link" onClick={() => navigate('/organisateur/evenements')}>
                Voir tout →
              </button>
            </div>
            <Card><DataTable columns={tableColumns} rows={tableRows} /></Card>
          </div>
        </div>
      </AppShell>
    </>
  );
}