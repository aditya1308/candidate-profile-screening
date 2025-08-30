import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { interviewerService } from '../services/interviewerService';

const InterviewerSelectionScreen = ({ 
  candidate, 
  onBack, 
  onConfirm, 
  currentRound, 
  nextRound 
}) => {
  const [interviewers, setInterviewers] = useState([]);
  const [filteredInterviewers, setFilteredInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      setLoading(true);
      const data = await interviewerService.getAllInterviewers();
      if (data) {
        setInterviewers(data);
        setFilteredInterviewers(data);
      } else {
        console.error('No data received from interviewer service');
      }
    } catch (err) {
      console.error('Error fetching interviewers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter interviewers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInterviewers(interviewers);
    } else {
      const filtered = interviewers.filter(interviewer =>
        interviewer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interviewer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInterviewers(filtered);
    }
  }, [searchQuery, interviewers]);

  const handleInterviewerClick = (interviewer) => {
    onConfirm(interviewer);
  };

  const getRoundLabel = (round) => {
    switch (round) {
      case 'applied': return 'Applied';
      case 'round1': return 'Round 1';
      case 'round2': return 'Round 2';
      case 'round3': return 'Round 3';
      default: return round;
    }
  };

  return (
    <div className="overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Interviewer</h3>
            <p className="text-xs text-gray-600">
              {candidate.fullName} • {getRoundLabel(currentRound)} → {getRoundLabel(nextRound)}
            </p>
          </div>
        </div>
      </div>

             {/* Search */}
       <div className="p-3 border-b">
         <div className="relative">
           <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                       <input
              type="text"
              placeholder="Search interviewers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-3 text-sm transition-colors border border-gray-300 rounded hover:border-2 hover:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
         </div>
       </div>

      {/* Interviewers List */}
      <div className="overflow-y-auto max-h-80">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-gray-500">Loading interviewers...</div>
          </div>
        ) : filteredInterviewers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-1 text-base text-gray-500">
              {searchQuery ? 'No interviewers found' : 'No interviewers available'}
            </div>
            <div className="text-xs text-gray-400">
              {searchQuery ? `No interviewers match "${searchQuery}"` : 'There are no interviewers in the system yet.'}
            </div>
          </div>
        ) : (
                     <div className="p-3">
             <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
               {filteredInterviewers.map((interviewer) => (
                 <div key={interviewer.id} className="relative group">
                                       {/* Shadow layer - positioned to the right and bottom with thick black shadow */}
                    <div 
                      className="absolute top-0 left-0 w-full h-full transition-all duration-200 bg-black group-hover:opacity-0"
                      style={{ transform: 'translate(4px, 4px)' }}
                    />
                    
                    {/* Card layer */}
                                         <div
                       onClick={() => handleInterviewerClick(interviewer)}
                       className="relative p-3 text-gray-900 transition-all duration-200 transform bg-white border-4 border-red-500 cursor-pointer group-hover:translate-x-1 group-hover:translate-y-1 hover:shadow-xl"
                     >
                                               <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{interviewer.fullName}</span>
                          <span className="text-xs text-gray-600">{interviewer.email}</span>
                        </div>
                     </div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerSelectionScreen;
