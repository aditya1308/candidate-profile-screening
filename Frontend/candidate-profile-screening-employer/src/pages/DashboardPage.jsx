import { useEffect, useMemo, useState } from 'react';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import MetricCard from '../components/dashboard/MetricCard';
import TrendChart from '../components/dashboard/TrendChart';

const POLL_INTERVAL_MS = 15000;

const DashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const allJobs = await jobService.getAllJobs();
        if (!isMounted) return;

        const jobsWithApplicationCounts = await Promise.all(
          allJobs.map(async (job) => {
            try {
              const candidates = await candidateService.getCandidatesByJobId(job.id);
              return {
                ...job,
                applicationCount: Array.isArray(candidates) ? candidates.length : Number(job.applications || 0)
              };
            } catch (innerError) {
              return {
                ...job,
                applicationCount: Number(job.applications || 0)
              };
            }
          })
        );

        if (!isMounted) return;
        setJobs(jobsWithApplicationCounts);
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.message || 'Unable to load dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const dashboardData = useMemo(() => {
    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, job) => sum + Number(job.applicationCount || 0), 0);
    const applicationsPerJob = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : '0.0';

    const roleBreakdown = (() => {
      const map = new Map();

      jobs.forEach((job) => {
        const role = job.title || 'Unknown role';
        const current = map.get(role) || { label: role, value: 0 };
        current.value += Number(job.applicationCount || 0);
        map.set(role, current);
      });

      return Array.from(map.values()).sort((a, b) => b.value - a.value).slice(0, 6);
    })();

    return {
      totalJobs,
      totalApplications,
      applicationsPerJob,
      roleBreakdown
    };
  }, [jobs]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-170px)] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-sg-red" />
          <p className="text-base font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-170px)] items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        <div>
          <p className="text-lg font-semibold text-red-700">Dashboard unavailable</p>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="flex h-[calc(100vh-170px)] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm">
        <div>
          <p className="text-xl font-semibold text-gray-800">No job data available</p>
          <p className="mt-2 text-gray-500">The dashboard will populate once jobs are available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-170px)] overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Overview</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-sg-red">
          Live updates
        </span>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <MetricCard label="Open Jobs" value={dashboardData.totalJobs} subLabel="Active" accent="bg-sg-red" />
        <MetricCard label="Applications" value={dashboardData.totalApplications} subLabel="Total" accent="bg-gray-900" />
        <MetricCard label="Avg / Job" value={dashboardData.applicationsPerJob} subLabel="Per job" accent="bg-red-500" />
      </div>

      <div className="h-[calc(100%-140px)] min-h-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <TrendChart data={dashboardData.roleBreakdown} />
      </div>
    </div>
  );
};

export default DashboardPage;
