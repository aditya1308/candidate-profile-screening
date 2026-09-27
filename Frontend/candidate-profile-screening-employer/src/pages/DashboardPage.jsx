import React, { useEffect, useMemo, useState } from 'react';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Award, 
  TrendingUp, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  FunnelChart, Funnel, LabelList
} from 'recharts';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';

const POLL_INTERVAL_MS = 15000;

const DashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await jobService.getAllJobs();
        if (!isMounted) return;

        let allCands = [];
        const jobsWithData = await Promise.all(
          fetchedJobs.map(async (job) => {
            try {
              const cands = await candidateService.getCandidatesByJobId(job.id);
              if (Array.isArray(cands)) {
                allCands.push(...cands.map(c => ({...c, jobTitle: job.title})));
                return { ...job, candidateCount: cands.length };
              }
            } catch {
              // ignore
            }
            return { ...job, candidateCount: 0 };
          })
        );
        if (!isMounted) return;
        setJobs(jobsWithData);
        setAllCandidates(allCands);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => { 
      isMounted = false; 
      clearInterval(intervalId);
    };
  }, []);

  // Compute metrics dynamically from backend API data
  const kpi = useMemo(() => {
    // Open Jobs: Jobs that are active
    const openJobs = jobs.filter(j => j.status !== 'Closed').length;
    const applicants = allCandidates.length;

    // Interviews: Candidates in any round
    const interviews = allCandidates.filter(c => 
      c.status && c.status.startsWith('IN_PROCESS_ROUND')
    ).length;

    // Hires: Candidates with status 'HIRED'
    const hires = allCandidates.filter(c => c.status === 'HIRED').length;
    
    return { openJobs, applicants, interviews, hires };
  }, [jobs, allCandidates]);

  const funnelData = useMemo(() => {
    const applicants = allCandidates.length;
    const reviewed = allCandidates.filter(c => c.status !== 'IN_PROCESS').length;
    const interviewed = allCandidates.filter(c => 
      c.status && (
        c.status.startsWith('IN_PROCESS_ROUND') || 
        c.status === 'ON_HOLD' || 
        c.status === 'HIRED'
      )
    ).length;
    const hired = kpi.hires;

    return [
      { name: 'Applicants', value: applicants, fill: '#000000' },
      { name: 'Reviewed', value: reviewed, fill: '#333333' },
      { name: 'Interviewed', value: interviewed, fill: '#666666' },
      { name: 'Hired', value: hired, fill: '#999999' },
    ];
  }, [allCandidates, kpi.hires]);

  const trendData = useMemo(() => {
    const days = 7;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const count = allCandidates.filter(c => {
        if (!c.appliedDate) return false;
        return c.appliedDate.startsWith(dateString);
      }).length;

      data.push({
        name: dayName,
        fullDate: dateString,
        applications: count
      });
    }
    return data;
  }, [allCandidates]);

  const topJobs = useMemo(() => {
    return [...jobs].sort((a, b) => b.candidateCount - a.candidateCount).slice(0, 3);
  }, [jobs]);

  const recentApps = useMemo(() => {
    const sorted = [...allCandidates].sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));
    return sorted.slice(0, 4);
  }, [allCandidates]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 bg-gray-50/50 h-[calc(100vh-64px)] overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Here's what's happening with your recruitment today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Open Jobs', value: kpi.openJobs, icon: Briefcase },
          { label: 'Total Applicants', value: kpi.applicants, icon: Users },
          { label: 'Interviews', value: kpi.interviews, icon: UserCheck },
          { label: 'Hires', value: kpi.hires, icon: Award },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">{item.label}</span>
              <item.icon className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Hiring Funnel */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col h-full min-h-0">
          <h2 className="text-xs font-semibold mb-2 shrink-0">Hiring Funnel</h2>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <RechartsTooltip />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" className="text-[10px] font-medium" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Trend */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] col-span-2 flex flex-col h-full min-h-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-xs font-semibold">Applications Trend</h2>
            <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Last 7 Days
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dx={-5} allowDecimals={false} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                />
                <Line type="monotone" dataKey="applications" stroke="#000000" strokeWidth={2} dot={{ r: 3, fill: '#000' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Top Jobs */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
          <h2 className="text-xs font-semibold mb-3 shrink-0">Top Jobs</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {topJobs.length > 0 ? topJobs.map((job, i) => {
              const maxCands = topJobs[0]?.candidateCount || 1;
              const pct = maxCands > 0 ? Math.round((job.candidateCount / maxCands) * 100) : 0;
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-start text-xs gap-2">
                    <Link to={`/jobs/${job.id}`} className="font-medium text-gray-900 leading-tight hover:text-blue-600 hover:underline cursor-pointer transition-colors">
                      {job.title}
                    </Link>
                    <span className="text-gray-500 shrink-0 mt-0.5">{job.candidateCount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shrink-0 mt-1">
                    <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-gray-500">No jobs available.</p>
            )}
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
          <h2 className="text-xs font-semibold mb-3 shrink-0">Recent Applications</h2>
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
            <table className="w-full text-left text-xs text-gray-500">
              <thead className="uppercase text-gray-400 border-b border-gray-100 sticky top-0 bg-white">
                <tr>
                  <th className="pb-2 font-medium">Candidate</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentApps.length > 0 ? recentApps.map((app, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2 font-medium text-gray-900 truncate max-w-[80px]">{app.name || 'Anonymous'}</td>
                    <td className="py-2 max-w-[80px] truncate">{app.jobTitle || 'Unknown'}</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-600 uppercase tracking-wider">
                        {app.status ? app.status.replace(/_/g, ' ') : 'NEW'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="py-3 text-center text-xs text-gray-500">No recent applications</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
          <h2 className="text-xs font-semibold mb-3 shrink-0 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Insights & Alerts
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin">
            <div className="rounded-lg bg-orange-50 p-2.5 border border-orange-100">
              <p className="text-xs text-orange-800 font-medium">Time-to-hire is increasing</p>
              <p className="text-[10px] text-orange-600 mt-0.5">Engineering roles are taking 15% longer to fill.</p>
            </div>
            <div className="rounded-lg bg-green-50 p-2.5 border border-green-100">
              <p className="text-xs text-green-800 font-medium">High application volume</p>
              <p className="text-[10px] text-green-600 mt-0.5">You received {trendData[trendData.length - 1]?.applications || 0} new applications today.</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-200 group cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-900 font-medium">Review pending feedback</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {allCandidates.filter(c => c.status && c.status.startsWith('IN_PROCESS')).length} candidates in process.
                  </p>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
