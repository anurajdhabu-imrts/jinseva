import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Edit } from 'lucide-react';
import Card, { CardBody, CardHeader } from '@components/Card';
import Avatar from '@components/Avatar';
import Button from '@components/Button';
import Tabs from '@components/Tabs';
import { useToast } from '@context/ToastContext';
import { staffApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate } from '@utils/constants';

export default function StaffProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await staffApi.get(id);
        if (!cancelled) setStaff(s);
      } catch (err) {
        toast.error(apiError(err));
        nav('/staff');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, nav, toast]);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading staff…</p>;
  if (!staff) return null;

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Personal Information" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Email</span><span className="font-medium">{staff.email}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Phone</span><span className="font-medium">{staff.phone}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Department</span><span className="font-medium">{staff.department}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Role</span><span className="font-medium">{staff.role}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Join Date</span><span className="font-medium">{staff.joinDate ? formatDate(staff.joinDate) : '—'}</span></div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Compensation" />
            <CardBody className="space-y-3">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-saffron-50 to-gold-50 dark:from-saffron-500/10 dark:to-gold-500/10">
                <p className="text-xs uppercase text-neutral-500">Monthly Salary</p>
                <p className="text-3xl font-serif font-bold gradient-text mt-1">{formatCurrency(staff.salary)}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-500">Last Paid</span><span className="font-medium">25 May 2026</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Bank Account</span><span className="font-medium">XXXX 4521</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">PF Account</span><span className="font-medium">Active</span></div>
              </div>
            </CardBody>
          </Card>
        </div>
      ),
    },
    {
      key: 'attendance',
      label: 'Attendance',
      content: (
        <Card>
          <CardHeader title="May 2026 Attendance" />
          <CardBody>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 31 }).map((_, i) => {
                const present = (i + 1) % 7 !== 0 && (i + 1) % 11 !== 0;
                return (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                    present ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15'
                  }`}>
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" />Present (26)</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500" />Absent (5)</span>
            </div>
          </CardBody>
        </Card>
      ),
    },
    {
      key: 'documents',
      label: 'Documents',
      content: (
        <Card>
          <CardBody>
            <p className="text-neutral-500 text-center py-10">Aadhaar, PAN, contract documents will appear here.</p>
          </CardBody>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Link to="/staff" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> All staff
      </Link>

      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-saffron-500 via-saffron-600 to-maroon-600 bg-mandala" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar src={staff.avatar} name={staff.name} size="2xl" ring />
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold">{staff.name}</h1>
              <p className="text-neutral-500">{staff.role} • {staff.department}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-neutral-500">
                <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{staff.email}</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{staff.phone}</span>
              </div>
            </div>
            <Button icon={Edit}>Edit Profile</Button>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} variant="underline" />
    </div>
  );
}
