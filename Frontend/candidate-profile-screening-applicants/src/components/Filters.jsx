
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Search, SlidersHorizontal, X } from 'lucide-react';

const Filters = ({ jobs = [], filters = { skills: [], locations: [], titles: [] }, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [skillSearch, setSkillSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    titles: true,
    skills: true,
    locations: true
  });

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

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
    const current = new Set(draftFilters[key] || []);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setDraftFilters({ ...draftFilters, [key]: Array.from(current) });
  };

  const toggleSection = (section) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  const applyFilters = () => {
    onChange(draftFilters);
    setIsOpen(false);
  };

  const clearDraftFilters = () => {
    setDraftFilters({ skills: [], locations: [], titles: [] });
  };

  const visibleSkills = allSkills.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase().trim())
  );

  const selectedCount = Object.values(filters).reduce((count, values) => count + values.length, 0);

  const sectionHeader = (key, label) => (
    <button
      type="button"
      onClick={() => toggleSection(key)}
      className="flex w-full items-center justify-between border-b border-gray-100 py-3 text-left text-sm font-semibold text-gray-800"
      aria-expanded={expandedSections[key]}
    >
      <span>{label}</span>
      {expandedSections[key] ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:ring-gray-400"
        aria-label="Open job filters"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {selectedCount > 0 && (
          <span className="rounded-full bg-sg-red px-2 py-0.5 text-xs text-white">{selectedCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filter jobs">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          />
          <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Filter jobs</h2>
                <p className="text-xs text-gray-500">Choose what you are looking for</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded p-2 text-gray-500 hover:bg-gray-100" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              <section>
                {sectionHeader('titles', 'Title')}
                {expandedSections.titles && (
                  <div className="grid max-h-40 grid-cols-1 gap-2 overflow-auto py-3">
                    {allTitles.length === 0 && <div className="text-xs text-gray-500">No titles</div>}
                    {allTitles.map((title) => (
                      <label key={title} className="inline-flex items-center text-sm text-gray-700">
                        <input type="checkbox" checked={draftFilters.titles.includes(title)} onChange={() => toggle('titles', title)} className="mr-2" />
                        {title}
                      </label>
                    ))}
                  </div>
                )}
              </section>

              <section>
                {sectionHeader('skills', 'Skills')}
                {expandedSections.skills && (
                  <div className="py-3">
                    <div className="mb-3 flex items-center rounded border border-gray-200 px-3">
                      <Search className="mr-2 h-4 w-4 text-gray-400" />
                      <input value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} placeholder="Search skills" className="w-full py-2 text-sm outline-none" />
                    </div>
                    <div className="grid max-h-48 grid-cols-1 gap-2 overflow-auto">
                      {visibleSkills.length === 0 && <div className="text-xs text-gray-500">No matching skills</div>}
                      {visibleSkills.map((skill) => (
                        <label key={skill} className="inline-flex items-center text-sm text-gray-700">
                          <input type="checkbox" checked={draftFilters.skills.includes(skill)} onChange={() => toggle('skills', skill)} className="mr-2" />
                          {skill}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section>
                {sectionHeader('locations', 'Location')}
                {expandedSections.locations && (
                  <div className="grid max-h-40 grid-cols-1 gap-2 overflow-auto py-3">
                    {allLocations.length === 0 && <div className="text-xs text-gray-500">No locations</div>}
                    {allLocations.map((location) => (
                      <label key={location} className="inline-flex items-center text-sm text-gray-700">
                        <input type="checkbox" checked={draftFilters.locations.includes(location)} onChange={() => toggle('locations', location)} className="mr-2" />
                        {location}
                      </label>
                    ))}
                  </div>
                )}
              </section>

              <div className="mt-4 flex gap-3 border-t bg-white py-4">
                <button type="button" onClick={clearDraftFilters} className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Clear
                </button>
                <button type="button" onClick={applyFilters} className="flex-1 rounded-md bg-sg-red px-4 py-2 text-sm font-semibold text-white hover:bg-sg-red/90">
                  Apply Filter
                </button>
              </div>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};

export default Filters;



