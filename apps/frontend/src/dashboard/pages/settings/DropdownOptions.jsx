import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, UserCog, Users as UsersIcon, ListChecks, Plus, Trash2, GripVertical } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input from '@components/Input';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';
import { useAuth } from '@context/AuthContext';
import { useLookupAdmin } from '@context/LookupContext';
import { lookupsApi, apiError } from '@services/rbacService';

const settingsNav = [
  { to: '/settings',        label: 'Temple Info',         icon: SettingsIcon },
  { to: '/settings/options', label: 'Dropdown Options',    icon: ListChecks },
  { to: '/settings/users',  label: 'Users',                icon: UsersIcon },
  { to: '/settings/roles',  label: 'Roles & Permissions', icon: UserCog },
];

export default function DropdownOptions() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const canManage = hasPermission('settings.update');
  const { data, refresh } = useLookupAdmin();

  const [categories, setCategories] = useState([]); // [{ key, label }]
  const [active, setActive] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    lookupsApi
      .categories()
      .then((cats) => {
        setCategories(cats);
        setActive((cur) => cur || cats[0]?.key || '');
      })
      .catch((err) => toast.error(apiError(err)));
  }, [toast]);

  const options = useMemo(() => data[active] || [], [data, active]);
  const activeLabel = categories.find((c) => c.key === active)?.label || 'options';

  const add = async (e) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    setBusy(true);
    try {
      await lookupsApi.create({ category: active, label, sortOrder: options.length });
      setNewLabel('');
      await refresh();
      toast.success(`Added “${label}”.`);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (opt) => {
    if (!window.confirm(`Delete “${opt.label}” from ${activeLabel}?`)) return;
    try {
      await lookupsApi.remove(opt.id);
      await refresh();
      toast.success('Option deleted.');
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage the options that appear in your dropdown menus"
        breadcrumb={[{ label: 'Settings', to: '/settings' }, { label: 'Dropdown Options' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings nav */}
        <div className="space-y-1">
          {settingsNav.map((item) => {
            const isActive = item.to === '/settings/options';
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-saffron-500/10 to-transparent text-saffron-700 dark:text-saffron-400 border-l-2 border-saffron-500'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-sand-100 dark:hover:bg-neutral-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="lg:col-span-3 space-y-5">
          <Card>
            <CardHeader
              title="Dropdown Options"
              subtitle="These lists feed the Event Type, Property / Place, Purpose and Payment Method menus across the app."
            />
            <CardBody className="space-y-5">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setActive(c.key)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active === c.key
                        ? 'bg-saffron-500 text-white'
                        : 'bg-sand-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-sand-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {c.label}
                    <span className="ml-1.5 opacity-70">{(data[c.key] || []).length}</span>
                  </button>
                ))}
              </div>

              {/* Add option */}
              {canManage && (
                <form onSubmit={add} className="flex items-end gap-2">
                  <Input
                    label={`Add a new ${activeLabel} option`}
                    placeholder="Type an option and press Add…"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    containerClassName="flex-1"
                  />
                  <Button type="submit" icon={Plus} loading={busy} disabled={!newLabel.trim()}>
                    Add
                  </Button>
                </form>
              )}

              {/* Option list */}
              <div className="divide-y divide-sand-100 dark:divide-neutral-800 rounded-xl border border-sand-200 dark:border-neutral-800 overflow-hidden">
                {options.length === 0 ? (
                  <p className="p-6 text-center text-sm text-neutral-500">No options yet — add one above.</p>
                ) : (
                  options.map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GripVertical className="w-4 h-4 text-neutral-300 shrink-0" />
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{opt.label}</span>
                      </div>
                      {canManage && (
                        <button
                          onClick={() => remove(opt)}
                          aria-label={`Delete ${opt.label}`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-jain-red-600 hover:bg-jain-red-50 dark:hover:bg-jain-red-600/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {!canManage && (
                <p className="text-xs text-neutral-500">You need the “Update settings” permission to add or remove options.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
