import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Grid3X3, List, Calendar, MapPin, Users, Eye, Edit, Trash2, BarChart3 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import Card from '@components/Card';
import Badge from '@components/Badge';
import SearchBar from '@components/SearchBar';
import { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { useAuth } from '@context/AuthContext';
import { eventsApi, resolveMedia, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS, EVENT_CATEGORIES, onImgError } from '@utils/constants';

export default function EventList() {
  const nav = useNavigate();
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('events.create');
  const canEdit = hasPermission('events.update');
  const canDelete = hasPermission('events.delete');
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await eventsApi.list());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const matchSearch =
          !search ||
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          (e.location || '').toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || e.status === filter;
        const matchCat = cat === 'All' || e.category === cat;
        return matchSearch && matchFilter && matchCat;
      }),
    [events, search, filter, cat],
  );

  const handleDelete = async (e, ev) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete event "${ev.title}"? This also removes its event-wise donations.`)) return;
    try {
      await eventsApi.remove(ev.id);
      toast.success(`Event "${ev.title}" deleted.`);
      setEvents((list) => list.filter((x) => x.id !== ev.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Management"
        subtitle="Organize and track all temple events and festivals"
        breadcrumb={[{ label: 'Events' }]}
        actions={
          <>
            <Link to="/events/analytics">
              <Button variant="secondary" icon={BarChart3}>Analytics</Button>
            </Link>
            {canCreate && (
              <Link to="/events/create">
                <Button icon={Plus}>Create Event</Button>
              </Link>
            )}
          </>
        }
      />

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="md:max-w-sm" />
          <Select value={cat} onChange={(e) => setCat(e.target.value)} options={['All', ...EVENT_CATEGORIES]} className="md:max-w-[200px]" />
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                    : 'bg-sand-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-sand-200 dark:hover:bg-neutral-700'
                }`}
              >
                {f}
              </button>
            ))}
            <div className="flex bg-sand-100 dark:bg-neutral-800 rounded-xl p-1">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-white dark:bg-neutral-900 text-saffron-600 shadow' : 'text-neutral-500'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-white dark:bg-neutral-900 text-saffron-600 shadow' : 'text-neutral-500'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {loading && <p className="py-10 text-center text-sm text-neutral-500">Loading events…</p>}
      {!loading && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-neutral-500">No events found.</p>
      )}

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((e) => {
            const fundedPct = e.budget > 0 ? Math.round((e.raised / e.budget) * 100) : 0;
            return (
              <Card key={e.id} hover className="overflow-hidden group flex flex-col">
                <Link to={`/events/${e.id}`} className="block aspect-[16/10] overflow-hidden relative">
                  <img src={resolveMedia(e.image)} onError={onImgError} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge variant={STATUS_COLORS[e.status]}>{e.status}</Badge>
                    <Badge variant="primary">{e.type}</Badge>
                    {e.category && <Badge variant="neutral">{e.category}</Badge>}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur text-white text-xs font-medium">
                    {formatDate(e.date, { day: '2-digit', month: 'short' })}
                  </div>
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif font-semibold text-lg text-neutral-900 dark:text-white">{e.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">{e.description}</p>
                  <div className="mt-3 space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <p className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(e.date)} at {e.time}</p>
                    <p className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {e.location}</p>
                    <p className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {e.attendees.toLocaleString('en-IN')} expected</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-500">Funded</span>
                      <span className="font-semibold">{fundedPct}%</span>
                    </div>
                    <div className="w-full bg-sand-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-saffron-500 to-maroon-600 rounded-full" style={{ width: `${Math.min(fundedPct, 100)}%` }} />
                    </div>
                    <div className="mt-1.5 text-xs text-neutral-500">
                      {formatCurrency(e.raised)} raised of {formatCurrency(e.budget)}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-sand-100 dark:border-neutral-800 flex gap-2">
                    <Link to={`/events/${e.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" icon={Eye} fullWidth>View</Button>
                    </Link>
                    {canEdit && <Button variant="ghost" size="sm" className="px-2.5" onClick={() => nav(`/events/${e.id}/edit`)}><Edit className="w-4 h-4" /></Button>}
                    {canDelete && <Button variant="ghost" size="sm" className="px-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={(ev) => handleDelete(ev, e)}><Trash2 className="w-4 h-4" /></Button>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-sand-100 dark:divide-neutral-800">
            {filtered.map((e) => (
              <Link to={`/events/${e.id}`} key={e.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                <img src={resolveMedia(e.image)} onError={onImgError} alt={e.title} className="w-full md:w-32 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-semibold text-neutral-900 dark:text-white">{e.title}</h3>
                    <Badge variant={STATUS_COLORS[e.status]}>{e.status}</Badge>
                    <Badge variant="primary">{e.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(e.date)} • {e.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{e.attendees}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-semibold gradient-text">{formatCurrency(e.raised)}</div>
                    <div className="text-xs text-neutral-500">of {formatCurrency(e.budget)}</div>
                  </div>
                  {canEdit && (
                  <button
                    onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); nav(`/events/${e.id}/edit`); }}
                    className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-saffron-600"
                    title="Edit event"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  )}
                  {canDelete && (
                  <button
                    onClick={(ev) => handleDelete(ev, e)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
