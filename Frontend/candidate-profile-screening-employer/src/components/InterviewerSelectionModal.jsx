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
    console.log('Interviewer clicked:', interviewer);
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
                     <div className="p-4">
             <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
               {filteredInterviewers.map((interviewer) => (
                 <div key={interviewer.id} className="group">
                   <div
                     onClick={() => handleInterviewerClick(interviewer)}
                     className="relative flex flex-col items-center p-4 transition-all duration-300 transform bg-white border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-sg-red hover:shadow-lg hover:shadow-sg-red/20 hover:-translate-y-1 group-hover:scale-105"
                   >
                     {/* Avatar Circle */}
                     <div className="flex items-center justify-center w-12 h-12 mb-3 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-br from-sg-red to-red-600 rounded-full group-hover:scale-110 group-hover:shadow-lg">
                       {interviewer.fullName.charAt(0).toUpperCase()}
                     </div>
                     
                     {/* Interviewer Info */}
                     <div className="text-center">
                       <h4 className="mb-1 text-sm font-semibold text-gray-900 truncate">
                         {interviewer.fullName}
                       </h4>
                       <p className="text-xs text-gray-500 truncate max-w-[120px]">
                         {interviewer.email}
                       </p>
                     </div>
                     
                     {/* Selection Indicator */}
                     <div className="absolute top-2 right-2 w-3 h-3 transition-all duration-300 bg-gray-300 rounded-full group-hover:bg-sg-red group-hover:scale-125"></div>
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
