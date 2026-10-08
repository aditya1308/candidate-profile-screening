import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Award, Briefcase, TrendingUp, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { candidateService } from '../services/candidateService';
import { jobService } from '../services/jobService';

const getCandidateStatus = candidate => (candidate.status || '').toUpperCase();

const isInterviewStage = candidate => getCandidateStatus(candidate).startsWith('IN_PROCESS_ROUND');

const isHire = candidate => ['HIRED', 'SELECTED'].includes(getCandidateStatus(candidate));

const formatDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const Panel = ({ title, children, className = '' }) => (
  <section className={`min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
    <h2 className="mb-3 text-sm font-semibold text-gray-800">{title}</h2>
    {children}
  </section>
);

const HiringFunnel = ({ candidates }) => {
  const total = candidates.length;
  const reviewed = candidates.filter(candidate => getCandidateStatus(candidate) !== 'IN_PROCESS').length;
  const interviewed = candidates.filter(candidate => isInterviewStage(candidate) || isHire(candidate)).length;
  const hired = candidates.filter(isHire).length;
  const stages = [
    { label: 'Applicants', count: total, fill: '#111827', top: 12, bottom: 58, topWidth: 390, bottomWidth: 240 },
    { label: 'Reviewed', count: reviewed, fill: '#374151', top: 58, bottom: 104, topWidth: 240, bottomWidth: 240 },
    { label: 'Interviewed', count: interviewed, fill: '#6b7280', top: 104, bottom: 150, topWidth: 240, bottomWidth: 150 },
    { label: 'Hired', count: hired, fill: '#9ca3af', top: 150, bottom: 196, topWidth: 150, bottomWidth: 0 }
  ];
  let previousBottomWidth = stages[0].topWidth;

  return (
    <Panel title="Hiring Funnel" className="lg:col-span-1">
      <svg className="h-52 w-full" viewBox="0 0 480 210" role="img" aria-label="Hiring funnel by candidate status">
        {stages.map((stage, index) => {
          const upperWidth = index === 0 ? stage.topWidth : previousBottomWidth;
          const lowerWidth = stage.bottomWidth;
          const left = (480 - upperWidth) / 2;
          const lowerLeft = (480 - lowerWidth) / 2;
          const points = lowerWidth === 0
            ? `${left},${stage.top} ${left + upperWidth},${stage.top} 240,${stage.bottom}`
            : `${left},${stage.top} ${left + upperWidth},${stage.top} ${lowerLeft + lowerWidth},${stage.bottom} ${lowerLeft},${stage.bottom}`;
          previousBottomWidth = stage.bottomWidth;

          return (
            <g key={stage.label}>
              <polygon points={points} fill={stage.fill} />
              <text x={Math.min(420, lowerLeft + lowerWidth + 8)} y={(stage.top + stage.bottom) / 2 + 4} fill="#374151" fontSize="11">
                {stage.label} · {stage.count}
              </text>
            </g>
          );
        })}
      </svg>
    </Panel>
  );
};

const ApplicationsTrend = ({ candidates }) => {
  const trend = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return days.map(day => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const count = candidates.filter(candidate => {
        const applied = formatDate(candidate.applicationDate);
        return applied && applied >= day && applied < nextDay;
      }).length;
      return {
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      };
    });
  }, [candidates]);

  const maxCount = Math.max(1, ...trend.map(day => day.count));
  const points = trend.map((day, index) => {
    const x = 48 + index * 100;
    const y = 176 - (day.count / maxCount) * 140;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Panel title="Applications Trend" className="lg:col-span-2">
      <div className="mb-1 flex justify-end text-xs text-gray-500">
        <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Last 7 Days</span>
      </div>
      <svg className="h-48 w-full" viewBox="0 0 700 220" preserveAspectRatio="none" role="img" aria-label="Applications over the last seven days">
        {[0, 0.5, 1].map(fraction => {
          const y = 176 - fraction * 140;
          return (
            <g key={fraction}>
              <text x="8" y={y + 4} fill="#9ca3af" fontSize="11">{Math.round(maxCount * fraction)}</text>
              <line x1="42" x2="665" y1={y} y2={y} stroke="#f3f4f6" />
            </g>
          );
        })}
        <polyline points={points} fill="none" stroke="#111827" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {trend.map((day, index) => {
          const x = 48 + index * 100;
          const y = 176 - (day.count / maxCount) * 140;
          return (
            <g key={`${day.label}-${index}`}>
              <circle cx={x} cy={y} r="3.5" fill="#111827" />
              <text x={x} y="204" textAnchor="middle" fill="#9ca3af" fontSize="11">{day.label}</text>
            </g>
          );
        })}
      </svg>
    </Panel>
  );
};

const AnalyticsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const fetchedJobs = await jobService.getAllJobs();
      const candidateGroups = await Promise.all(
        fetchedJobs.map(async job => {
          const jobCandidates = await candidateService.getCandidatesByJobId(job.id);
          return {
            job,
            candidates: jobCandidates.map(candidate => ({ ...candidate, jobTitle: job.title, jobId: job.id }))
          };
        })
      );

      setJobs(candidateGroups.map(group => ({
        ...group.job,
        candidateCount: group.candidates.length
      })));
      setCandidates(candidateGroups.flatMap(group => group.candidates));
    } catch (fetchError) {
      console.error('Error fetching recruitment analytics:', fetchError);
      setError(fetchError.message || 'Unable to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const metrics = useMemo(() => ({
    openJobs: jobs.filter(job => (job.status || '').toLowerCase() !== 'closed').length,
    applicants: candidates.length,
    interviews: candidates.filter(isInterviewStage).length,
    hires: candidates.filter(isHire).length
  }), [jobs, candidates]);

  const topJobs = useMemo(
    () => [...jobs].sort((first, second) => second.candidateCount - first.candidateCount).slice(0, 3),
    [jobs]
  );
  const recentApplications = useMemo(
    () => [...candidates].sort((first, second) =>
      (formatDate(second.applicationDate)?.getTime() || 0)
      - (formatDate(first.applicationDate)?.getTime() || 0)
    ).slice(0, 4),
    [candidates]
  );
  const applicationsToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return candidates.filter(candidate => {
      const applied = formatDate(candidate.applicationDate);
      return applied && applied >= today;
    }).length;
  }, [candidates]);
  const awaitingReview = candidates.filter(candidate => ['IN_PROCESS', 'ON_HOLD'].includes(getCandidateStatus(candidate))).length;

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-sg-red border-t-transparent" aria-label="Loading analytics" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center">
        <p className="text-red-700" role="alert">{error}</p>
        <button type="button" onClick={fetchAnalytics} className="rounded-md bg-sg-red px-4 py-2 text-sm font-semibold text-white hover:bg-sg-red/90">
          Retry
        </button>
      </div>
    );
  }

  const summaryCards = [
    { label: 'Open Jobs', value: metrics.openJobs, icon: <Briefcase className="h-4 w-4" aria-hidden="true" /> },
    { label: 'Total Applicants', value: metrics.applicants, icon: <Users className="h-4 w-4" aria-hidden="true" /> },
    { label: 'Interviews', value: metrics.interviews, icon: <UserCheck className="h-4 w-4" aria-hidden="true" /> },
    { label: 'Hires', value: metrics.hires, icon: <Award className="h-4 w-4" aria-hidden="true" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 p-4 pb-24 text-gray-900 lg:p-6 lg:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Here&apos;s what&apos;s happening with your recruitment today.</p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {summaryCards.map(({ label, value, icon }) => (
            <section key={label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-gray-500">
                <span className="text-xs font-medium">{label}</span>
                {icon}
              </div>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
            </section>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <HiringFunnel candidates={candidates} />
          <ApplicationsTrend candidates={candidates} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel title="Top Jobs">
            {topJobs.length ? (
              <ul className="space-y-3">
                {topJobs.map(job => (
                  <li key={job.id}>
                    <div className="mb-1 flex items-start justify-between gap-3 text-xs">
                      <Link to={`/jobs/${job.id}`} className="line-clamp-2 font-medium text-gray-800 hover:text-sg-red">
                        {job.title}
                      </Link>
                      <span className="shrink-0 text-gray-500">{job.candidateCount}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-900"
                        style={{ width: `${Math.round((job.candidateCount / Math.max(1, topJobs[0].candidateCount)) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500">No jobs available.</p>}
          </Panel>

          <Panel title="Recent Applications">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[360px] text-left text-xs text-gray-500">
                <thead className="border-b border-gray-100 uppercase text-gray-400">
                  <tr>
                    <th className="pb-2 font-medium">Candidate</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentApplications.length ? recentApplications.map((candidate, index) => (
                    <tr key={`${candidate.id}-${candidate.jobId}-${index}`}>
                      <td className="max-w-24 truncate py-2 font-medium text-gray-900">{candidate.name || 'Anonymous'}</td>
                      <td className="max-w-32 truncate py-2">{candidate.jobTitle}</td>
                      <td className="py-2 text-right">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium uppercase text-gray-600">
                          {(candidate.status || 'New').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="py-4 text-center text-gray-500">No recent applications</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Insights & Alerts">
            <div className="space-y-2.5">
              <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
                <p className="text-xs font-medium text-orange-900">Review pending feedback</p>
                <p className="mt-1 text-xs text-orange-800">{awaitingReview} candidates awaiting review.</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-900">Application activity</p>
                <p className="mt-1 text-xs text-emerald-800">{applicationsToday} applications received today.</p>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-gray-800">Hiring progress</p>
                  <p className="mt-1 text-xs text-gray-600">{metrics.hires} candidates hired across {jobs.length} job postings.</p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
