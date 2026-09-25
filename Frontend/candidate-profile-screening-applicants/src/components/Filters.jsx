
import { useMemo } from 'react';

const Filters = ({ jobs = [], filters = { skills: [], locations: [], titles: [] }, onChange }) => {
  const { allSkills, allLocations, allTitles } = useMemo(() => {
    const skillSet = new Set();
    const locSet = new Set();
    const titleSet = new Set();

    jobs.forEach(job => {
      if (job.requiredSkills) {
        job.requiredSkills
          .split(/[,\n]+/)
          .map(s => s.trim())
          .filter(Boolean)
          .forEach(s => skillSet.add(s));
      }
      if (job.location) locSet.add(job.location.trim());
      if (job.title) titleSet.add(job.title.trim());
    });

    return {
      allSkills: Array.from(skillSet).sort(),
      allLocations: Array.from(locSet).sort(),
      allTitles: Array.from(titleSet).sort()
    };
  }, [jobs]);

  const toggle = (key, value) => {
    const current = new Set(filters[key] || []);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    onChange({ ...filters, [key]: Array.from(current) });
  };

  return (
    <aside className="p-4 bg-white border rounded-md shadow-sm">
      <h4 className="mb-2 text-sm font-semibold text-gray-700">Filter jobs</h4>

      <div className="mb-4">
        <div className="mb-2 text-xs font-medium text-gray-600">Title</div>
        <div className="grid grid-cols-1 gap-1 max-h-36 overflow-auto pr-2">
          {allTitles.length === 0 && <div className="text-xs text-gray-500">No titles</div>}
          {allTitles.map(t => (
            <label key={t} className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                checked={(filters.titles || []).includes(t)}
                onChange={() => toggle('titles', t)}
                className="mr-2 form-checkbox"
              />
              <span className="text-gray-700">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs font-medium text-gray-600">Location</div>
        <div className="grid grid-cols-1 gap-1 max-h-36 overflow-auto pr-2">
          {allLocations.length === 0 && <div className="text-xs text-gray-500">No locations</div>}
          {allLocations.map(l => (
            <label key={l} className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                checked={(filters.locations || []).includes(l)}
                onChange={() => toggle('locations', l)}
                className="mr-2 form-checkbox"
              />
              <span className="text-gray-700">{l}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium text-gray-600">Skills</div>
        <div className="grid grid-cols-1 gap-1 max-h-36 overflow-auto pr-2">
          {allSkills.length === 0 && <div className="text-xs text-gray-500">No skills</div>}
          {allSkills.map(s => (
            <label key={s} className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                checked={(filters.skills || []).includes(s)}
                onChange={() => toggle('skills', s)}
                className="mr-2 form-checkbox"
              />
              <span className="text-gray-700">{s}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">At least one selected skill must be present in the job.</p>
      </div>
    </aside>
  );
};

export default Filters;